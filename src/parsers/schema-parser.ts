import type { DMMF } from "@prisma/generator-helper";
import type {
  CustomDirective,
  DatabaseAdapter,
  DrizzleColumn,
  DrizzleColumnType,
  DrizzleEnum,
  DrizzleRelation,
  DrizzleTable,
  DrizzleUniqueConstraint,
  DrizzleIndex,
  DrizzleCompoundPrimaryKey,
  ParsedSchema,
} from "../types/index.js";
import { parseCustomDirectives } from "../utils/directive-parser.js";

export class SchemaParser {
  constructor(private adapter: DatabaseAdapter) {}

  parse(dmmf: DMMF.Document): ParsedSchema {
    const enums = this.parseEnums(Array.from(dmmf.datamodel.enums));
    const tables = this.parseModels(Array.from(dmmf.datamodel.models), enums);
    const relations = this.parseRelations(Array.from(dmmf.datamodel.models));

    return {
      tables,
      relations,
      enums,
    };
  }

  private parseEnums(prismaEnums: DMMF.DatamodelEnum[]): DrizzleEnum[] {
    return prismaEnums.map((prismaEnum) => ({
      name: prismaEnum.name,
      values: prismaEnum.values.map((value) => value.name),
    }));
  }

  private parseModels(
    prismaModels: DMMF.Model[],
    enums: DrizzleEnum[],
  ): DrizzleTable[] {
    return prismaModels.map((model) => this.parseModel(model, enums));
  }

  private parseModel(model: DMMF.Model, enums: DrizzleEnum[]): DrizzleTable {
    const customDirectives = parseCustomDirectives(model.documentation);

    // Parse compound constraints
    const uniqueConstraints = this.parseUniqueConstraints(model);
    const indexes = this.parseIndexes(model);
    const compoundPrimaryKey = this.parseCompoundPrimaryKey(model);

    // Parse @@map directive for custom table name
    const dbTableName = model.dbName ?? this.extractMapValue(model) ?? undefined;

    return {
      name: model.name,
      tableName: model.name,
      dbTableName,
      columns: model.fields
        .filter((field) => !field.relationName) // Filter out relation fields
        .map((field) => this.parseField(field, enums)),
      enums: enums.filter((enumItem) =>
        model.fields.some((field) => field.type === enumItem.name),
      ),
      customDirectives,
      uniqueConstraints: uniqueConstraints.length > 0 ? uniqueConstraints : undefined,
      indexes: indexes.length > 0 ? indexes : undefined,
      compoundPrimaryKey,
    };
  }

  // New method: Parse @@unique constraints
  private parseUniqueConstraints(model: DMMF.Model): DrizzleUniqueConstraint[] {
    const constraints: DrizzleUniqueConstraint[] = [];

    // Parse uniqueFields (array of arrays of field names)
    if ('uniqueFields' in model && Array.isArray((model as any).uniqueFields)) {
      const uniqueFields = (model as any).uniqueFields;
      for (const fieldArray of uniqueFields) {
        if (Array.isArray(fieldArray)) {
          constraints.push({
            name: undefined, // uniqueFields doesn't provide names
            columns: [...fieldArray],
          });
        }
      }
    }

    // Parse uniqueIndexes (array of objects with name and fields)
    if ('uniqueIndexes' in model && Array.isArray((model as any).uniqueIndexes)) {
      const uniqueIndexes = (model as any).uniqueIndexes;
      for (const constraint of uniqueIndexes) {
        if (constraint && constraint.fields && Array.isArray(constraint.fields)) {
          // Only add if not already added from uniqueFields (avoid duplicates)
          const existingConstraint = constraints.find(c => 
            c.columns.length === constraint.fields.length &&
            c.columns.every((col, idx) => col === constraint.fields[idx])
          );
          
          if (!existingConstraint) {
            constraints.push({
              name: constraint.name || undefined,
              columns: [...constraint.fields],
            });
          } else if (constraint.name && !existingConstraint.name) {
            // Update existing constraint with name if it has one
            existingConstraint.name = constraint.name;
          }
        }
      }
    }

    return constraints;
  }

  // New method: Parse @@index constraints
  private parseIndexes(model: DMMF.Model): DrizzleIndex[] {
    const indexes: DrizzleIndex[] = [];

    // Note: Prisma DMMF does not expose @@index information 
    // This is a known limitation - @@index directives are not available in DMMF
    // Regular indexes would need to be handled through other means (e.g., custom parsing)
    
    return indexes;
  }

  // New method: Parse @@id compound primary key
  private parseCompoundPrimaryKey(model: DMMF.Model): DrizzleCompoundPrimaryKey | undefined {
    if (model.primaryKey && model.primaryKey.fields && model.primaryKey.fields.length > 1) {
      return {
        columns: [...model.primaryKey.fields], // Create mutable copy
      };
    }
    return undefined;
  }

  // New method: Extract @@map value from model
  private extractMapValue(model: DMMF.Model): string | undefined {
    // Check if model has @@map attribute
    // This is typically stored in model.dbName or can be parsed from documentation
    return model.dbName || undefined;
  }

  private parseField(field: DMMF.Field, enums: DrizzleEnum[]): DrizzleColumn {
    const customDirectives = parseCustomDirectives(field.documentation);
    const isEnum = enums.some((enumItem) => enumItem.name === field.type);

    // Check for @updatedAt attribute
    const isUpdatedAt = field.isUpdatedAt || false;

    // Handle native database types
    let columnType: DrizzleColumnType;

    // Handle custom type override
    const customType = customDirectives.find((d) => d.name === "drizzle.type");
    
    if (customType) {
      columnType = {
        drizzleType: String(
          customType.arguments.type || field.type.toLowerCase(),
        ),
        importPath: "drizzle-orm/pg-core",
      };
    } else if (isEnum) {
      columnType = {
        drizzleType: `${this.toSnakeCase(field.type)}Enum`,
        importPath: "./enums.js",
      };
    } else {
      columnType = this.adapter.mapPrismaType(field.type, !field.isRequired);
      
      // Handle native PostgreSQL types
      if (field.documentation && field.documentation.includes('@db.')) {
        const nativeTypeMatch = field.documentation.match(/@db\.(\w+)(?:\(([^)]+)\))?/);
        if (nativeTypeMatch) {
          const nativeType = nativeTypeMatch[1];
          const args = nativeTypeMatch[2]?.split(',').map(arg => arg.trim());
          
          // Use the PostgreSQL adapter to map native types
          if (this.adapter.name === 'postgresql' && 'mapNativeType' in this.adapter) {
            const nativeMapping = (this.adapter as any).mapNativeType(nativeType, args);
            if (nativeMapping.drizzleType) {
              columnType = {
                ...columnType,
                ...nativeMapping,
              };
            }
          }
        }
      }
    }

    return {
      name: field.name,
      dbName: field.dbName,
      type: columnType,
      nullable: !field.isRequired && !field.hasDefaultValue && !field.isId,
      defaultValue: this.parseDefaultValue(field.default, customDirectives),
      primaryKey: field.isId,
      unique: field.isUnique,
      customDirectives,
      isUpdatedAt,
    };
  }

  private parseDefaultValue(
    defaultValue: unknown,
    customDirectives: CustomDirective[],
  ): string | undefined {
    // Check for custom default directive first
    const customDefault = customDirectives.find(
      (d) => d.name === "drizzle.default",
    );
    if (customDefault) {
      return String(customDefault.arguments.value);
    }

    if (defaultValue === undefined || defaultValue === null) return undefined;

    if (
      typeof defaultValue === "object" &&
      defaultValue !== null &&
      "name" in defaultValue
    ) {
      // Handle Prisma functions like autoincrement(), now(), uuid()
      const funcName = String(defaultValue.name);
      switch (funcName) {
        case "autoincrement":
          return undefined; // Handle with serial type
        case "now":
          return "defaultNow()";
        case "uuid":
          return undefined; // No direct equivalent in Drizzle
        case "cuid":
          return undefined; // No direct equivalent in Drizzle
        case "dbgenerated":
          // Handle dbgenerated with args if present
          if (typeof defaultValue === "object" && "args" in defaultValue && Array.isArray(defaultValue.args) && defaultValue.args.length > 0) {
            return `sql\`${defaultValue.args[0]}\``;
          }
          return "sql\`gen_random_uuid()\`"; // Default fallback
        default:
          return `${funcName}()`;
      }
    }

    if (typeof defaultValue === "string") {
      return `'${defaultValue}'`;
    }

    if (Array.isArray(defaultValue)) {
      const arrayValues = defaultValue.map(val => typeof val === "string" ? `'${val}'` : String(val));
      return `[${arrayValues.join(", ")}]`;
    }

    return String(defaultValue);
  }

  private parseRelations(models: DMMF.Model[]): DrizzleRelation[] {
    const relations: DrizzleRelation[] = [];

    for (const model of models) {
      for (const field of model.fields) {
        if (!field.relationName) continue;

        const relatedModel = models.find((m) => m.name === field.type);
        if (!relatedModel) continue;

        // Determine if this field is the "owning" side of the relation (where the foreign key is defined)
        // For 1-1 and M-1, the foreign key is on the side with the scalar field (relationFromFields)
        // For 1-M, the foreign key is on the 'many' side, which is the 'to' side from the perspective of the 'one' side.
        const isForeignKeyOwner =
          field.relationFromFields && field.relationFromFields.length > 0;

        if (isForeignKeyOwner) {
          relations.push({
            type: field.isList ? "many" : "one", // If the field is a list, it's a 1-M relation from this side
            foreignKeyTable: model.name,
            foreignKeyField: field.relationFromFields![0],
            referencedTable: relatedModel.name,
            referencedField: field.relationToFields![0],
            relationName: field.relationName,
            onDelete: this.mapOnDeleteAction(field.relationOnDelete),
            onUpdate: this.mapOnUpdateAction(field.relationOnUpdate),
          });
        } else if (field.isList) {
          // This is the 'one' side of a 1-M relation, where the foreign key is on the 'many' side
          // We need to find the corresponding field on the 'many' side to get the foreign key info
          const manySideField = relatedModel.fields.find(
            (f) => f.relationName === field.relationName && f.isList === false,
          );

          if (
            manySideField &&
            manySideField.relationFromFields &&
            manySideField.relationFromFields.length > 0
          ) {
            relations.push({
              type: "many",
              foreignKeyTable: relatedModel.name,
              foreignKeyField: manySideField.relationFromFields[0],
              referencedTable: model.name,
              referencedField: manySideField.relationToFields![0],
              relationName: field.relationName,
              // onDelete and onUpdate are defined on the foreign key side
              onDelete: this.mapOnDeleteAction(manySideField.relationOnDelete),
              onUpdate: this.mapOnUpdateAction(manySideField.relationOnUpdate),
            });
          }
        }
      }
    }

    return relations;
  }

  private mapOnDeleteAction(action?: string): DrizzleRelation["onDelete"] {
    switch (action?.toLowerCase()) {
      case "cascade":
        return "cascade";
      case "restrict":
        return "restrict";
      case "setnull":
        return "setNull";
      case "setdefault":
        return "setDefault";
      default:
        return undefined;
    }
  }

  private mapOnUpdateAction(action?: string): DrizzleRelation["onUpdate"] {
    switch (action?.toLowerCase()) {
      case "cascade":
        return "cascade";
      case "restrict":
        return "restrict";
      case "setnull":
        return "setNull";
      case "setdefault":
        return "setDefault";
      default:
        return undefined;
    }
  }

  private toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase()
      .replace(/^_/, "");
  }
}
