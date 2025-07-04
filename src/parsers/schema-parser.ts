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
        drizzleType: `${this.toCamelCase(field.type)}Enum`,
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
          return "defaultNow";
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

    // Process each model independently - only generate relations for fields that belong to that model
    for (const model of models) {
      for (const field of model.fields) {
        if (!field.relationName) continue;

        const relatedModel = models.find((m) => m.name === field.type);
        if (!relatedModel) continue;

        const isForeignKeyOwner = field.relationFromFields && field.relationFromFields.length > 0;
        const isListField = field.isList;
        const isSelfRelation = model.name === relatedModel.name;

        // Generate relation for this specific field in this specific model
        if (isForeignKeyOwner) {
          // This field owns the foreign key - generate 'one' relation
          relations.push({
            type: "one",
            foreignKeyTable: model.name,
            foreignKeyField: field.relationFromFields![0]!,
            referencedTable: relatedModel.name,
            referencedField: field.relationToFields![0]!,
            relationName: field.name,
            onDelete: this.mapOnDeleteAction(field.relationOnDelete),
            onUpdate: this.mapOnUpdateAction(field.relationOnUpdate),
          });

          // For self-relations, also generate the reverse 'many' relation  
          if (isSelfRelation) {
            relations.push({
              type: "many",
              foreignKeyTable: model.name,
              foreignKeyField: field.relationFromFields![0]!,
              referencedTable: relatedModel.name,
              referencedField: field.relationToFields![0]!,
              relationName: this.getReverseSelfRelationName(field, model),
              onDelete: this.mapOnDeleteAction(field.relationOnDelete),
              onUpdate: this.mapOnUpdateAction(field.relationOnUpdate),
            });
          }
        } else if (isListField) {
          // This field is a list (many) relation
          const correspondingField = relatedModel.fields.find(
            f => f.relationName === field.relationName && !f.isList && 
                 f.relationFromFields && f.relationFromFields.length > 0
          );

          if (correspondingField && !isSelfRelation) {
            // Regular 1:M relation - this table contains the list field, FK is on the related table
            relations.push({
              type: "many",
              foreignKeyTable: model.name,              // Source table (where the list field is)
              foreignKeyField: correspondingField.relationFromFields![0]!,
              referencedTable: relatedModel.name,       // Target table (where the FK points)
              referencedField: correspondingField.relationToFields![0]!,
              relationName: field.name,
              onDelete: this.mapOnDeleteAction(correspondingField.relationOnDelete),
              onUpdate: this.mapOnUpdateAction(correspondingField.relationOnUpdate),
            });
          } else if (!correspondingField) {
            // Implicit M:N relation
            relations.push({
              type: "many",
              foreignKeyTable: model.name,
              foreignKeyField: 'id',
              referencedTable: relatedModel.name,
              referencedField: 'id',
              relationName: field.name,
              isImplicitManyToMany: true,
            });
          }
        } else {
          // This could be the reverse side of a 1:1 relation
          const correspondingField = relatedModel.fields.find(
            f => f.relationName === field.relationName && !f.isList &&
                 f.relationFromFields && f.relationFromFields.length > 0
          );

          if (correspondingField) {
            // Generate reverse 1:1 relation
            relations.push({
              type: "one",
              foreignKeyTable: model.name,  // Fixed: should be current model, not related model
              foreignKeyField: correspondingField.relationFromFields![0]!,
              referencedTable: relatedModel.name,
              referencedField: correspondingField.relationToFields![0]!,
              relationName: field.name,
              isReverse: true,
            });
          }
        }
      }
    }

    return this.deduplicateRelations(relations);
  }

  private deduplicateRelations(relations: DrizzleRelation[]): DrizzleRelation[] {
    const seen = new Map<string, DrizzleRelation>();
    
    for (const relation of relations) {
      const key = `${relation.foreignKeyTable}_${relation.relationName}_${relation.type}`;
      
      if (!seen.has(key)) {
        seen.set(key, relation);
      }
    }
    
    return Array.from(seen.values());
  }

  private ensurePlural(str: string): string {
    // Don't pluralize if already plural or if it's a special case
    if (str.endsWith('s') && !str.endsWith('us') && !str.endsWith('ss')) {
      return str;
    }
    
    // Special cases
    const irregulars: Record<string, string> = {
      'child': 'children',
      'person': 'people', 
      'man': 'men',
      'woman': 'women',
      'foot': 'feet',
      'tooth': 'teeth',
      'goose': 'geese',
      'mouse': 'mice',
      'category': 'categories',
      'company': 'companies',
      'country': 'countries',
      'city': 'cities',
      'story': 'stories',
      'entry': 'entries',
      'query': 'queries',
      'currency': 'currencies'
    };
    
    const lower = str.toLowerCase();
    if (irregulars[lower]) {
      return irregulars[lower];
    }
    
    // Standard rules
    if (str.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(str[str.length - 2])) {
      return str.slice(0, -1) + 'ies';
    }
    if (str.endsWith('s') || str.endsWith('sh') || str.endsWith('ch') || str.endsWith('x') || str.endsWith('z')) {
      return str + 'es';
    }
    if (str.endsWith('f')) {
      return str.slice(0, -1) + 'ves';
    }
    if (str.endsWith('fe')) {
      return str.slice(0, -2) + 'ves';
    }
    
    return str + 's';
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

  private toCamelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  private toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase()
      .replace(/^_/, "");
  }

  private getReverseSelfRelationName(field: DMMF.Field, model: DMMF.Model): string {
    // For self-relations, derive the reverse relation name
    // e.g., "referredBy" -> "referrals", "parent" -> "children"
    const fieldName = field.name;
    
    if (fieldName === 'referredBy') return 'referrals';
    if (fieldName === 'parent') return 'children';
    if (fieldName === 'parentCategory') return 'childCategories';
    if (fieldName.endsWith('Parent')) {
      const base = fieldName.replace('Parent', '');
      return this.ensurePlural(base);
    }
    
    // Default: pluralize the field name
    return this.ensurePlural(fieldName);
  }
}
