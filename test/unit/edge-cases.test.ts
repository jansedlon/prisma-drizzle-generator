import { test, expect } from 'bun:test';
import { TestGenerator, createMockDMMF, createMockModel, createMockField, TestAssertions } from '../utils/test-helpers.js';

test('Empty schema handling', async () => {
  const generator = new TestGenerator();
  const dmmf = createMockDMMF([]);
  const result = await generator.generateFromDMMF(dmmf);
  
  // Should only generate index file
  const indexFile = TestAssertions.assertFileExists(result.files, 'index.ts');
  TestAssertions.assertFileContains(indexFile, ''); // Empty or minimal content
  
  expect(result.parsedSchema.tables.length).toBe(0);
  expect(result.parsedSchema.relations.length).toBe(0);
  expect(result.parsedSchema.enums.length).toBe(0);
});

test('Model with no fields (edge case)', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'EmptyModel',
    dbName: 'empty_model',
    fields: [], // No fields
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'empty-model-schema.ts');
  TestAssertions.assertFileContains(schemaFile, 'export const emptyModel = pgTable(\'empty_model\', {');
  TestAssertions.assertFileContains(schemaFile, '});'); // Empty table definition
});

test('Model with only relation fields', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'RelationOnly',
    dbName: 'relation_only',
    fields: [
      createMockField({ 
        name: 'users', 
        type: 'User', 
        kind: 'object',
        isList: true,
        relationName: 'UserRelation'
      }),
      createMockField({ 
        name: 'posts', 
        type: 'Post', 
        kind: 'object',
        isList: true,
        relationName: 'PostRelation'
      }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'relation-only-schema.ts');
  // Should have empty table as relation fields are filtered out
  TestAssertions.assertFileContains(schemaFile, 'export const relationOnly = pgTable(\'relation_only\', {');
  TestAssertions.assertFileContains(schemaFile, '});');
});

test('Very long field and table names', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'VeryLongModelNameThatExceedsTypicalLimitsAndTestsNamingConventions',
    dbName: 'very_long_table_name_that_exceeds_typical_database_limits_and_tests_naming_conventions',
    fields: [
      createMockField({ 
        name: 'veryLongFieldNameThatExceedsTypicalLimitsAndTestsNamingConventions', 
        type: 'String',
        isId: true
      }),
      createMockField({ 
        name: 'anotherVeryLongFieldNameWithUnderscores_and_numbers123', 
        type: 'String'
      }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(
    result.files, 
    'very-long-model-name-that-exceeds-typical-limits-and-tests-naming-conventions-schema.ts'
  );
  
  TestAssertions.assertFileContains(
    schemaFile, 
    'veryLongFieldNameThatExceedsTypicalLimitsAndTestsNamingConventions: text('
  );
  TestAssertions.assertFileContains(
    schemaFile, 
    'anotherVeryLongFieldNameWithUnderscores_and_numbers123: text('
  );
});

test('Special characters in field names', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'SpecialChars',
    dbName: 'special_chars',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ name: 'field_with_underscores', type: 'String' }),
      createMockField({ name: 'fieldWithNumbers123', type: 'String' }),
      createMockField({ name: 'field$with$dollars', type: 'String' }),
      createMockField({ name: 'field-with-dashes', type: 'String' }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'special-chars-schema.ts');
  
  // All field names should be preserved as-is in column definitions
  TestAssertions.assertFileContains(schemaFile, 'field_with_underscores: text(\'field_with_underscores\')');
  TestAssertions.assertFileContains(schemaFile, 'fieldWithNumbers123: text(\'fieldWithNumbers123\')');
  TestAssertions.assertFileContains(schemaFile, 'field$with$dollars: text(\'field$with$dollars\')');
  TestAssertions.assertFileContains(schemaFile, 'field-with-dashes: text(\'field-with-dashes\')');
});

test('Reserved JavaScript keywords as field names', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'ReservedKeywords',
    dbName: 'reserved_keywords',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ name: 'function', type: 'String' }),
      createMockField({ name: 'class', type: 'String' }),
      createMockField({ name: 'const', type: 'String' }),
      createMockField({ name: 'let', type: 'String' }),
      createMockField({ name: 'var', type: 'String' }),
      createMockField({ name: 'return', type: 'String' }),
      createMockField({ name: 'if', type: 'String' }),
      createMockField({ name: 'else', type: 'String' }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'reserved-keywords-schema.ts');
  
  // Reserved keywords should work fine as object property names
  TestAssertions.assertFileContains(schemaFile, 'function: text(\'function\')');
  TestAssertions.assertFileContains(schemaFile, 'class: text(\'class\')');
  TestAssertions.assertFileContains(schemaFile, 'const: text(\'const\')');
  TestAssertions.assertFileContains(schemaFile, 'return: text(\'return\')');
});

test('All nullable fields', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'AllNullable',
    dbName: 'all_nullable',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }), // Primary key, not nullable
      createMockField({ name: 'optional1', type: 'String', isRequired: false }),
      createMockField({ name: 'optional2', type: 'Int', isRequired: false }),
      createMockField({ name: 'optional3', type: 'Boolean', isRequired: false }),
      createMockField({ name: 'optional4', type: 'DateTime', isRequired: false }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'all-nullable-schema.ts');
  
  // Primary key should have primaryKey()
  TestAssertions.assertFileContains(schemaFile, 'id: text(\'id\').primaryKey()');
  
  // Optional fields should not have notNull()
  TestAssertions.assertFileContains(schemaFile, 'optional1: text(\'optional1\')');
  TestAssertions.assertFileNotContains(schemaFile, 'optional1: text(\'optional1\').notNull()');
  TestAssertions.assertFileContains(schemaFile, 'optional2: integer(\'optional2\')');
  TestAssertions.assertFileNotContains(schemaFile, 'optional2: integer(\'optional2\').notNull()');
});

test('All required fields with defaults', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'AllDefaults',
    dbName: 'all_defaults',
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
        default: 'default'
      }),
      createMockField({ 
        name: 'number', 
        type: 'Int',
        hasDefaultValue: true,
        default: 0
      }),
      createMockField({ 
        name: 'bool', 
        type: 'Boolean',
        hasDefaultValue: true,
        default: false
      }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'all-defaults-schema.ts');
  
  // All fields should have default values
  TestAssertions.assertFileContains(schemaFile, 'id: text(\'id\').primaryKey().default(crypto.randomUUID())');
  TestAssertions.assertFileContains(schemaFile, 'text: text(\'text\').notNull().default(\'default\')');
  TestAssertions.assertFileContains(schemaFile, 'number: integer(\'number\').notNull().default(0)');
  TestAssertions.assertFileContains(schemaFile, 'bool: boolean(\'bool\').notNull().default(false)');
});

test('Circular relationships', async () => {
  const generator = new TestGenerator();
  
  const userModel = createMockModel({
    name: 'User',
    dbName: 'users',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ name: 'bestFriendId', type: 'String', isRequired: false }),
      createMockField({ 
        name: 'bestFriend', 
        type: 'User', 
        kind: 'object',
        isRequired: false,
        relationName: 'BestFriends',
        relationFromFields: ['bestFriendId'],
        relationToFields: ['id']
      }),
      createMockField({ 
        name: 'bestFriendOf', 
        type: 'User', 
        kind: 'object',
        isRequired: false,
        relationName: 'BestFriends'
      }),
    ],
  });

  const dmmf = createMockDMMF([userModel]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'user-schema.ts');
  TestAssertions.assertFileContains(schemaFile, 'bestFriendId: text(\'bestFriendId\')');
  
  const relationsFile = TestAssertions.assertFileExists(result.files, 'relations.ts');
  TestAssertions.assertFileContains(relationsFile, 'userRelations');
  // Should handle self-referencing relation
  TestAssertions.assertFileContains(relationsFile, 'user: one(user');
});

test('Unsupported Prisma types handling', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'UnsupportedTypes',
    dbName: 'unsupported_types',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      // This would be an unsupported type in real scenario
      createMockField({ name: 'weirdType', type: 'WeirdCustomType' }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  
  // Should throw an error for unsupported types
  expect(async () => {
    await generator.generateFromDMMF(dmmf);
  }).toThrow();
});

test('Model with many unique constraints', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'ManyUnique',
    dbName: 'many_unique',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ name: 'email', type: 'String', isUnique: true }),
      createMockField({ name: 'username', type: 'String', isUnique: true }),
      createMockField({ name: 'phone', type: 'String', isUnique: true }),
      createMockField({ name: 'ssn', type: 'String', isUnique: true }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'many-unique-schema.ts');
  
  // All unique fields should have unique() modifier
  TestAssertions.assertFileContains(schemaFile, 'email: text(\'email\').unique().notNull()');
  TestAssertions.assertFileContains(schemaFile, 'username: text(\'username\').unique().notNull()');
  TestAssertions.assertFileContains(schemaFile, 'phone: text(\'phone\').unique().notNull()');
  TestAssertions.assertFileContains(schemaFile, 'ssn: text(\'ssn\').unique().notNull()');
});