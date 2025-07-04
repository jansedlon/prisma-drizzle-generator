import { test, expect } from 'bun:test';
import { TestGenerator, createMockDMMF, createMockModel, createMockField, TestAssertions } from '../utils/test-helpers.js';

test('Basic scalar types mapping', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'BasicTypes',
    dbName: 'basic_types',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ name: 'text', type: 'String' }),
      createMockField({ name: 'number', type: 'Int' }),
      createMockField({ name: 'bigNumber', type: 'BigInt' }),
      createMockField({ name: 'float', type: 'Float' }),
      createMockField({ name: 'decimal', type: 'Decimal' }),
      createMockField({ name: 'boolean', type: 'Boolean' }),
      createMockField({ name: 'date', type: 'DateTime' }),
      createMockField({ name: 'json', type: 'Json' }),
      createMockField({ name: 'bytes', type: 'Bytes' }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'basic-types-schema.ts');
  
  // Check imports
  TestAssertions.assertImportExists(schemaFile, 'pgTable');
  TestAssertions.assertImportExists(schemaFile, 'text');
  TestAssertions.assertImportExists(schemaFile, 'integer');
  TestAssertions.assertImportExists(schemaFile, 'bigint');
  TestAssertions.assertImportExists(schemaFile, 'real');
  TestAssertions.assertImportExists(schemaFile, 'decimal');
  TestAssertions.assertImportExists(schemaFile, 'boolean');
  TestAssertions.assertImportExists(schemaFile, 'timestamp');
  TestAssertions.assertImportExists(schemaFile, 'jsonb');
  TestAssertions.assertImportExists(schemaFile, 'bytes');
  
  // Check table definition
  TestAssertions.assertTableDefinition(schemaFile, 'basic_types', 'id');
  TestAssertions.assertFileContains(schemaFile, 'id: text(\'id\').primaryKey()');
  TestAssertions.assertFileContains(schemaFile, 'text: text(\'text\').notNull()');
  TestAssertions.assertFileContains(schemaFile, 'number: integer(\'number\').notNull()');
  TestAssertions.assertFileContains(schemaFile, 'bigNumber: bigint(\'bigNumber\', number, bigint).notNull()');
  TestAssertions.assertFileContains(schemaFile, 'float: real(\'float\').notNull()');
  TestAssertions.assertFileContains(schemaFile, 'decimal: decimal(\'decimal\').notNull()');
  TestAssertions.assertFileContains(schemaFile, 'boolean: boolean(\'boolean\').notNull()');
  TestAssertions.assertFileContains(schemaFile, 'date: timestamp(\'date\', { withTimezone: true, mode: "date" }).notNull()');
  TestAssertions.assertFileContains(schemaFile, 'json: jsonb(\'json\').notNull()');
  TestAssertions.assertFileContains(schemaFile, 'bytes: bytes(\'bytes\').notNull()');
});

test('Optional fields mapping', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'OptionalFields',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ name: 'optional', type: 'String', isRequired: false }),
      createMockField({ name: 'required', type: 'String', isRequired: true }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'optional-fields-schema.ts');
  
  // Required field should have .notNull()
  TestAssertions.assertFileContains(schemaFile, 'required: text(\'required\').notNull()');
  
  // Optional field should not have .notNull()
  TestAssertions.assertFileContains(schemaFile, 'optional: text(\'optional\')');
  TestAssertions.assertFileNotContains(schemaFile, 'optional: text(\'optional\').notNull()');
});

test('Default values mapping', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'DefaultValues',
    fields: [
      createMockField({ 
        name: 'id', 
        type: 'String', 
        isId: true, 
        hasDefaultValue: true,
        default: { name: 'uuid', args: [] }
      }),
      createMockField({ 
        name: 'text', 
        type: 'String', 
        hasDefaultValue: true,
        default: 'default text'
      }),
      createMockField({ 
        name: 'number', 
        type: 'Int', 
        hasDefaultValue: true,
        default: 42
      }),
      createMockField({ 
        name: 'boolean', 
        type: 'Boolean', 
        hasDefaultValue: true,
        default: true
      }),
      createMockField({ 
        name: 'date', 
        type: 'DateTime', 
        hasDefaultValue: true,
        default: { name: 'now', args: [] }
      }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'default-values-schema.ts');
  
  TestAssertions.assertFileContains(schemaFile, 'id: text(\'id\').primaryKey().default(crypto.randomUUID())');
  TestAssertions.assertFileContains(schemaFile, 'text: text(\'text\').notNull().default(\'default text\')');
  TestAssertions.assertFileContains(schemaFile, 'number: integer(\'number\').notNull().default(42)');
  TestAssertions.assertFileContains(schemaFile, 'boolean: boolean(\'boolean\').notNull().default(true)');
  TestAssertions.assertFileContains(schemaFile, 'date: timestamp(\'date\', { withTimezone: true, mode: "date" }).notNull().default(new Date())');
});

test('Unique constraints mapping', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'UniqueFields',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ name: 'email', type: 'String', isUnique: true }),
      createMockField({ name: 'username', type: 'String', isUnique: true }),
      createMockField({ name: 'normal', type: 'String' }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'unique-fields-schema.ts');
  
  TestAssertions.assertFileContains(schemaFile, 'email: text(\'email\').unique().notNull()');
  TestAssertions.assertFileContains(schemaFile, 'username: text(\'username\').unique().notNull()');
  TestAssertions.assertFileContains(schemaFile, 'normal: text(\'normal\').notNull()');
  TestAssertions.assertFileNotContains(schemaFile, 'normal: text(\'normal\').unique()');
});

test('Composite primary key handling', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'CompositeKey',
    fields: [
      createMockField({ name: 'userId', type: 'String' }),
      createMockField({ name: 'projectId', type: 'String' }),
      createMockField({ name: 'role', type: 'String' }),
    ],
    primaryKey: {
      name: null,
      fields: ['userId', 'projectId'],
    },
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'composite-key-schema.ts');
  
  // Should not have individual primaryKey() calls
  TestAssertions.assertFileNotContains(schemaFile, '.primaryKey()');
  TestAssertions.assertFileContains(schemaFile, 'userId: text(\'userId\').notNull()');
  TestAssertions.assertFileContains(schemaFile, 'projectId: text(\'projectId\').notNull()');
  TestAssertions.assertFileContains(schemaFile, 'role: text(\'role\').notNull()');
});

test('Custom table mapping (@map)', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'CustomTableName',
    dbName: 'custom_table_name',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'custom-table-name-schema.ts');
  
  TestAssertions.assertFileContains(schemaFile, 'pgTable(\'custom_table_name\'');
  TestAssertions.assertFileContains(schemaFile, 'export const customTableName = pgTable');
});