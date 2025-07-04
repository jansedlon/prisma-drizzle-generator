import { logger } from "@prisma/internals";
import type {
  DatabaseAdapter,
  DrizzleColumn,
  DrizzleColumnType,
  DrizzleRelation,
  DrizzleUniqueConstraint,
  DrizzleIndex,
  DrizzleCompoundPrimaryKey,
} from "../types/index.js";

export class PostgreSQLAdapter implements DatabaseAdapter {
  name = "postgresql";

  alwaysPresentImports = ["pgTable"];

  private typeMap: Record<string, DrizzleColumnType> = {
    String: {
      drizzleType: "text",
      importPath: "drizzle-orm/pg-core",
    },
    Int: {
      drizzleType: "integer",
      importPath: "drizzle-orm/pg-core",
    },
    BigInt: {
      drizzleType: "bigint",
      importPath: "drizzle-orm/pg-core",
      typeArguments: ["{ mode: 'number' }"],
    },
    Float: {
      drizzleType: "real",
      importPath: "drizzle-orm/pg-core",
    },
    Decimal: {
      drizzleType: "decimal",
      importPath: "drizzle-orm/pg-core",
    },
    Boolean: {
      drizzleType: "boolean",
      importPath: "drizzle-orm/pg-core",
    },
    DateTime: {
      drizzleType: "timestamp",
      importPath: "drizzle-orm/pg-core",
      typeArguments: ['{ withTimezone: true, mode: "date" }'],
    },
    Json: {
      drizzleType: "jsonb",
      importPath: "drizzle-orm/pg-core",
    },
    Bytes: {
      drizzleType: "text",
      importPath: "drizzle-orm/pg-core",
    },
  };

  // New method: Add native PostgreSQL type mappings
  private nativeTypeMap: Record<string, { 
    drizzleType: string; 
    typeArgsGenerator?: (args?: string[]) => string[] | undefined;
  }> = {
    'VarChar': {
      drizzleType: "varchar",
      typeArgsGenerator: (args?: string[]) => args?.[0] ? [`{ length: ${args[0]} }`] : undefined,
    },
    'Text': {
      drizzleType: "text",
    },
    'Char': {
      drizzleType: "char",
      typeArgsGenerator: (args?: string[]) => args?.[0] ? [`{ length: ${args[0]} }`] : undefined,
    },
    'SmallInt': {
      drizzleType: "smallint",
    },
    'Integer': {
      drizzleType: "integer",
    },
    'BigInt': {
      drizzleType: "bigint",
      typeArgsGenerator: () => ["{ mode: 'number' }"],
    },
    'Real': {
      drizzleType: "real",
    },
    'DoublePrecision': {
      drizzleType: "doublePrecision",
    },
    'Decimal': {
      drizzleType: "decimal",
      typeArgsGenerator: (args?: string[]) => {
        if (args?.[0] && args?.[1]) return [`{ precision: ${args[0]}, scale: ${args[1]} }`];
        if (args?.[0]) return [`{ precision: ${args[0]} }`];
        return undefined;
      },
    },
    'Money': {
      drizzleType: "decimal", // Money maps to decimal in Drizzle
    },
    'Date': {
      drizzleType: "date",
      typeArgsGenerator: () => ['{ mode: "date" }'],
    },
    'Time': {
      drizzleType: "time",
      typeArgsGenerator: () => ['{ withTimezone: true }'],
    },
    'Timestamp': {
      drizzleType: "timestamp",
      typeArgsGenerator: () => ['{ mode: "date" }'],
    },
    'Timestamptz': {
      drizzleType: "timestamp",
      typeArgsGenerator: () => ['{ withTimezone: true, mode: "date" }'],
    },
    'JsonB': {
      drizzleType: "jsonb",
    },
  };

  mapPrismaType(prismaType: string, _isOptional: boolean): DrizzleColumnType {
    const baseType = this.typeMap[prismaType];
    if (!baseType) {
      throw new Error(`Unsupported Prisma type: ${prismaType}`);
    }
    return baseType;
  }

  // New method: Handle native PostgreSQL types
  mapNativeType(nativeType: string, args?: string[]): Partial<DrizzleColumnType> {
    const mapping = this.nativeTypeMap[nativeType];
    if (!mapping) {
      logger.warn(`Unsupported native PostgreSQL type: ${nativeType}`);
      return {};
    }

    const result: Partial<DrizzleColumnType> = {
      drizzleType: mapping.drizzleType,
      importPath: "drizzle-orm/pg-core"
    };
    
    // Handle type arguments for native types
    if (mapping.typeArgsGenerator) {
      result.typeArguments = mapping.typeArgsGenerator(args);
    }

    return result;
  }

  getImports(): string[] {
    return [
      "pgTable",
      "text",
      "varchar", 
      "char",
      "integer",
      "smallint",
      "bigint",
      "real",
      "doublePrecision",
      "decimal",
      "boolean",
      "timestamp",
      "date",
      "time",
      "jsonb",
      "serial",
      "uuid",
      "pgEnum",
      "sql",
      "unique",
      "index",
      "primaryKey",
    ];
  }

  generateTableFunction(tableName: string): string {
    return `pgTable('${tableName}', {`;
  }

  generateColumnDefinition(column: DrizzleColumn): string {
    logger.info(`Generating column definition for ${column.name}`);
    let definition = `${column.name}: ${column.type.drizzleType}('${column.dbName || column.name}')`;

    if (column.type.typeArguments?.length) {
      const args = column.type.typeArguments.join(", ");
      logger.info(
        `Generating column definition for ${column.name} with args: ${args}`,
      );
      definition = `${column.name}: ${column.type.drizzleType}('${column.dbName || column.name}', ${args})`;
    }

    const modifiers: string[] = [];

    if (column.primaryKey) {
      modifiers.push("primaryKey()");
    }

    if (column.unique) {
      modifiers.push("unique()");
    }

    if (!column.nullable && !column.primaryKey) {
      modifiers.push("notNull()");
    }

    // Handle @updatedAt columns
    if (column.isUpdatedAt) {
      modifiers.push("$onUpdate(() => new Date())");
    }

    // Apply custom directives for defaults
    let hasCustomDefault = false;
    if (column.customDirectives) {
      for (const directive of column.customDirectives) {
        if (directive.name === "drizzle.type") {
          // Custom type override handled in parsing
        } else if (directive.name === "drizzle.default") {
          modifiers.push(`default(${directive.arguments.value})`);
          hasCustomDefault = true;
        }
      }
    }

    // Only add regular default if no custom default was applied
    if (column.defaultValue && !hasCustomDefault) {
      // Handle special column builder methods
      if (column.defaultValue === "defaultNow") {
        modifiers.push("defaultNow()");
      } else {
        modifiers.push(`default(${column.defaultValue})`);
      }
    }

    if (modifiers.length > 0) {
      definition += `.${modifiers.join(".")}`;
    }

    return definition;
  }

  generateRelationReference(relation: DrizzleRelation): string {
    let reference = `references(() => ${relation.toTable}.${relation.toField}`;

    const options: string[] = [];
    if (relation.onDelete) {
      options.push(`onDelete: '${relation.onDelete}'`);
    }
    if (relation.onUpdate) {
      options.push(`onUpdate: '${relation.onUpdate}'`);
    }

    if (options.length > 0) {
      reference += `, { ${options.join(", ")} }`;
    }

    reference += ")";
    return reference;
  }

  // New method: Generate unique constraint
  generateUniqueConstraint(constraint: DrizzleUniqueConstraint): string {
    const columns = constraint.columns.map(col => `table.${col}`).join(", ");
    if (constraint.name) {
      return `unique('${constraint.name}').on(${columns})`;
    }
    return `unique().on(${columns})`;
  }

  // New method: Generate index definition  
  generateIndexDefinition(index: DrizzleIndex): string {
    const columns = index.columns.map(col => `table.${col}`).join(", ");
    if (index.name) {
      if (index.unique) {
        return `uniqueIndex('${index.name}').on(${columns})`;
      }
      return `index('${index.name}').on(${columns})`;
    } else {
      if (index.unique) {
        return `uniqueIndex().on(${columns})`;
      }
      return `index().on(${columns})`;
    }
  }

  // New method: Generate compound primary key
  generateCompoundPrimaryKey(constraint: DrizzleCompoundPrimaryKey): string {
    const columns = constraint.columns.map(col => `table.${col}`).join(", ");
    return `primaryKey({ columns: [${columns}] })`;
  }
}
