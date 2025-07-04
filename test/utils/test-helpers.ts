import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { DMMF } from '@prisma/generator-helper';
import { createDatabaseAdapter } from '../../src/adapters/index.js';
import { SchemaParser } from '../../src/parsers/schema-parser.js';
import { CodeGenerator } from '../../src/generators/index.js';
import type { ParsedSchema, GeneratedFile, GeneratorConfig } from '../../src/types/index.js';

export interface TestGenerationResult {
  files: GeneratedFile[];
  parsedSchema: ParsedSchema;
  config: GeneratorConfig;
}

export class TestGenerator {
  private config: GeneratorConfig;
  private adapter;
  private parser;
  private generator;

  constructor(config: Partial<GeneratorConfig> = {}) {
    this.config = {
      output: './test-output',
      moduleResolution: 'nodeNext',
      formatter: 'none', // Skip formatting for tests
      splitFiles: true,
      ...config,
    };
    
    this.adapter = createDatabaseAdapter('postgresql');
    this.parser = new SchemaParser(this.adapter);
    this.generator = new CodeGenerator(this.adapter, this.config);
  }

  async generateFromDMMF(dmmf: DMMF.Document): Promise<TestGenerationResult> {
    const parsedSchema = this.parser.parse(dmmf);
    const files = await this.generator.generate(parsedSchema);
    
    return {
      files,
      parsedSchema,
      config: this.config,
    };
  }

  async writeTestFiles(files: GeneratedFile[], outputDir: string): Promise<void> {
    await fs.mkdir(outputDir, { recursive: true });
    
    for (const file of files) {
      const filePath = path.join(outputDir, file.path);
      await fs.writeFile(filePath, file.content, 'utf-8');
    }
  }
}

export function createMockDMMF(models: DMMF.Model[], enums: DMMF.DatamodelEnum[] = []): DMMF.Document {
  return {
    datamodel: {
      models,
      enums,
      types: [],
      indexes: [],
    },
    mappings: {
      modelOperations: [],
      otherOperations: {
        read: [],
        write: [],
      },
    },
    schema: {
      rootQueryType: undefined,
      rootMutationType: undefined,
      rootSubscriptionType: undefined,
      inputObjectTypes: {
        prisma: [],
        model: undefined,
      },
      outputObjectTypes: {
        prisma: [],
        model: [],
      },
      enumTypes: {
        prisma: [],
        model: undefined,
      },
      fieldRefTypes: {
        prisma: [],
      },
    },
  } as DMMF.Document;
}

export function createMockModel(overrides: Partial<DMMF.Model> = {}): DMMF.Model {
  return {
    name: 'TestModel',
    dbName: 'test_model',
    schema: null,
    fields: [],
    primaryKey: null,
    uniqueFields: [],
    uniqueIndexes: [],
    isGenerated: false,
    documentation: undefined,
    ...overrides,
  } as DMMF.Model;
}

export function createMockField(overrides: Partial<DMMF.Field> = {}): DMMF.Field {
  return {
    name: 'testField',
    kind: 'scalar',
    type: 'String',
    isRequired: true,
    isList: false,
    isUnique: false,
    isId: false,
    isReadOnly: false,
    hasDefaultValue: false,
    default: undefined,
    relationFromFields: undefined,
    relationToFields: undefined,
    relationOnDelete: undefined,
    relationName: undefined,
    documentation: undefined,
    isGenerated: false,
    isUpdatedAt: false,
    ...overrides,
  } as DMMF.Field;
}

export function createMockEnum(overrides: Partial<DMMF.DatamodelEnum> = {}): DMMF.DatamodelEnum {
  return {
    name: 'TestEnum',
    values: [
      { name: 'VALUE1', dbName: null },
      { name: 'VALUE2', dbName: null },
    ],
    dbName: null,
    documentation: undefined,
    ...overrides,
  } as DMMF.DatamodelEnum;
}

export const TestAssertions = {
  assertFileExists(files: GeneratedFile[], fileName: string): GeneratedFile {
    const file = files.find(f => f.path === fileName);
    if (!file) {
      throw new Error(`Expected file '${fileName}' not found. Available files: ${files.map(f => f.path).join(', ')}`);
    }
    return file;
  },

  assertFileContains(file: GeneratedFile, content: string): void {
    if (!file.content.includes(content)) {
      throw new Error(`File '${file.path}' does not contain expected content: '${content}'`);
    }
  },

  assertFileNotContains(file: GeneratedFile, content: string): void {
    if (file.content.includes(content)) {
      throw new Error(`File '${file.path}' should not contain: '${content}'`);
    }
  },

  assertImportExists(file: GeneratedFile, importStatement: string): void {
    const lines = file.content.split('\n');
    const hasImport = lines.some(line => line.trim().includes(importStatement));
    if (!hasImport) {
      throw new Error(`File '${file.path}' missing import: '${importStatement}'`);
    }
  },

  assertTableDefinition(file: GeneratedFile, tableName: string, columnName: string): void {
    TestAssertions.assertFileContains(file, `pgTable('${tableName}'`);
    TestAssertions.assertFileContains(file, `${columnName}:`);
  },

  assertRelationDefinition(file: GeneratedFile, relationName: string): void {
    TestAssertions.assertFileContains(file, `${relationName}:`);
    TestAssertions.assertFileContains(file, 'relations(');
  },

  assertEnumDefinition(file: GeneratedFile, enumName: string, values: string[]): void {
    TestAssertions.assertFileContains(file, `${enumName} = pgEnum(`);
    for (const value of values) {
      TestAssertions.assertFileContains(file, `'${value}'`);
    }
  },
};

export async function loadFixture(fileName: string): Promise<string> {
  const fixturePath = path.join(process.cwd(), 'test', 'fixtures', fileName);
  return await fs.readFile(fixturePath, 'utf-8');
}

export async function compareWithExpected(generated: string, expectedFile: string): Promise<boolean> {
  try {
    const expected = await loadFixture(`expected/${expectedFile}`);
    return generated.trim() === expected.trim();
  } catch {
    return false;
  }
}

export function normalizeWhitespace(content: string): string {
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}