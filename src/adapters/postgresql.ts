import { logger } from "@prisma/sdk";
import type {
  DatabaseAdapter,
  DrizzleColumn,
  DrizzleColumnType,
  DrizzleRelation,
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

  mapPrismaType(prismaType: string, _isOptional: boolean): DrizzleColumnType {
    const baseType = this.typeMap[prismaType];
    if (!baseType) {
      throw new Error(`Unsupported Prisma type: ${prismaType}`);
    }
    return baseType;
  }

  getImports(): string[] {
    return [
      "pgTable",
      "text",
      "integer",
      "bigint",
      "real",
      "decimal",
      "boolean",
      "timestamp",
      "jsonb",
      "serial",
      "uuid",
      "pgEnum",
      "sql",
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
      modifiers.push(`default(${column.defaultValue})`);
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
}
