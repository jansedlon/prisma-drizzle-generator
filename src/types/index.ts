export interface GeneratorConfig {
  output: string;
  moduleResolution: "node" | "nodeNext" | "bundler";
  formatter?: "prettier" | "biome" | "none";
  formatterConfig?: string;
  splitFiles: boolean;
}

export interface DatabaseAdapter {
  name: string;
  alwaysPresentImports: string[];
  mapPrismaType(prismaType: string, isOptional: boolean): DrizzleColumnType;
  getImports(): string[];
  generateTableFunction(tableName: string): string;
  generateColumnDefinition(column: DrizzleColumn): string;
  generateRelationReference(relation: DrizzleRelation): string;
  generateUniqueConstraint(constraint: DrizzleUniqueConstraint): string;
  generateIndexDefinition(index: DrizzleIndex): string;
  generateCompoundPrimaryKey(constraint: DrizzleCompoundPrimaryKey): string;
}

export interface DrizzleColumn {
  name: string;
  dbName: string | null | undefined;
  type: DrizzleColumnType;
  nullable: boolean;
  defaultValue?: string;
  primaryKey: boolean;
  unique: boolean;
  customDirectives?: CustomDirective[];
  isUpdatedAt?: boolean;
}

export interface DrizzleColumnType {
  drizzleType: string;
  importPath: string;
  typeArguments?: string[];
  options?: Record<string, unknown>;
}

export interface DrizzleUniqueConstraint {
  name?: string;
  columns: string[];
}

export interface DrizzleIndex {
  name?: string;
  columns: string[];
  unique?: boolean;
}

export interface DrizzleCompoundPrimaryKey {
  columns: string[];
}

export interface DrizzleTable {
  name: string;
  tableName: string;
  dbTableName?: string;
  columns: DrizzleColumn[];
  enums: DrizzleEnum[];
  customDirectives?: CustomDirective[];
  uniqueConstraints?: DrizzleUniqueConstraint[];
  indexes?: DrizzleIndex[];
  compoundPrimaryKey?: DrizzleCompoundPrimaryKey;
}

export interface DrizzleRelation {
  type: "one" | "many";
  foreignKeyTable: string;
  foreignKeyField: string;
  referencedTable: string;
  referencedField: string;
  relationName: string;
  onDelete?: "cascade" | "restrict" | "setNull" | "setDefault";
  onUpdate?: "cascade" | "restrict" | "setNull" | "setDefault";
}

export interface DrizzleEnum {
  name: string;
  values: string[];
}

export interface CustomDirective {
  name: string;
  arguments: Record<string, unknown>;
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: "schema" | "relations" | "enums";
}

export interface ParsedSchema {
  tables: DrizzleTable[];
  relations: DrizzleRelation[];
  enums: DrizzleEnum[];
}
