import { test, expect } from 'bun:test';
import { TestGenerator, createMockDMMF, createMockModel, createMockField, TestAssertions } from '../utils/test-helpers.js';

test('Custom type directive (@drizzle.type)', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'CustomTypes',
    dbName: 'custom_types',
    fields: [
      createMockField({ 
        name: 'id', 
        type: 'String', 
        isId: true,
        documentation: '/// @drizzle.type(type: "uuid")'
      }),
      createMockField({ 
        name: 'username', 
        type: 'String',
        documentation: '/// @drizzle.type(type: "varchar", length: 255)'
      }),
      createMockField({ 
        name: 'email', 
        type: 'String',
        documentation: '/// @drizzle.type(type: "varchar", length: 100)'
      }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'custom-types-schema.ts');
  
  // Custom types should override default mappings
  TestAssertions.assertFileContains(schemaFile, 'id: uuid(\'id\').primaryKey()');
  TestAssertions.assertFileContains(schemaFile, 'username: varchar(\'username\')');
  TestAssertions.assertFileContains(schemaFile, 'email: varchar(\'email\')');
});

test('Custom default directive (@drizzle.default)', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'CustomDefaults',
    dbName: 'custom_defaults',
    fields: [
      createMockField({ 
        name: 'id', 
        type: 'String', 
        isId: true,
        hasDefaultValue: true,
        default: { name: 'uuid', args: [] },
        documentation: '/// @drizzle.default(value: "gen_random_uuid()")'
      }),
      createMockField({ 
        name: 'status', 
        type: 'String',
        hasDefaultValue: true,
        default: 'PENDING',
        documentation: '/// @drizzle.default(value: "\'ACTIVE\'")'
      }),
      createMockField({ 
        name: 'counter', 
        type: 'Int',
        hasDefaultValue: true,
        default: 0,
        documentation: '/// @drizzle.default(value: "1")'
      }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'custom-defaults-schema.ts');
  
  // Custom defaults should override Prisma defaults
  TestAssertions.assertFileContains(schemaFile, 'id: text(\'id\').primaryKey().default(gen_random_uuid())');
  TestAssertions.assertFileContains(schemaFile, 'status: text(\'status\').notNull().default(\'ACTIVE\')');
  TestAssertions.assertFileContains(schemaFile, 'counter: integer(\'counter\').notNull().default(1)');
});

test('Combined custom directives', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'CombinedCustom',
    dbName: 'combined_custom',
    fields: [
      createMockField({ 
        name: 'id', 
        type: 'String', 
        isId: true,
        hasDefaultValue: true,
        default: { name: 'uuid', args: [] },
        documentation: '/// @drizzle.type(type: "uuid")\\n/// @drizzle.default(value: "gen_random_uuid()")'
      }),
      createMockField({ 
        name: 'createdAt', 
        type: 'DateTime',
        hasDefaultValue: true,
        default: { name: 'now', args: [] },
        documentation: '/// @drizzle.type(type: "timestamptz")\\n/// @drizzle.default(value: "now()")'
      }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'combined-custom-schema.ts');
  
  // Both directives should apply
  TestAssertions.assertFileContains(schemaFile, 'id: uuid(\'id\').primaryKey().default(gen_random_uuid())');
  TestAssertions.assertFileContains(schemaFile, 'createdAt: timestamptz(\'createdAt\').notNull().default(now())');
});

test('JSON field with custom directives', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'JsonFields',
    dbName: 'json_fields',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ 
        name: 'data', 
        type: 'Json',
        documentation: '/// @drizzle.type(type: "jsonb")'
      }),
      createMockField({ 
        name: 'metadata', 
        type: 'Json',
        isRequired: false,
        documentation: '/// @drizzle.default(value: "{}")'
      }),
      createMockField({ 
        name: 'config', 
        type: 'Json',
        hasDefaultValue: true,
        default: '{}',
        documentation: '/// @drizzle.type(type: "json")\\n/// @drizzle.default(value: "null")'
      }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'json-fields-schema.ts');
  
  TestAssertions.assertFileContains(schemaFile, 'data: jsonb(\'data\').notNull()');
  TestAssertions.assertFileContains(schemaFile, 'metadata: jsonb(\'metadata\').default({})');
  TestAssertions.assertFileContains(schemaFile, 'config: json(\'config\').notNull().default(null)');
});

test('Enum field with custom directives', async () => {
  const generator = new TestGenerator();
  
  const statusEnum = {
    name: 'Status',
    values: [
      { name: 'ACTIVE', dbName: null },
      { name: 'INACTIVE', dbName: null },
    ],
    dbName: null,
    documentation: undefined,
  };

  const model = createMockModel({
    name: 'EnumFields',
    dbName: 'enum_fields',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ 
        name: 'status', 
        type: 'Status',
        hasDefaultValue: true,
        default: 'ACTIVE',
        documentation: '/// @drizzle.default(value: "\'INACTIVE\'")'
      }),
    ],
  });

  const dmmf = createMockDMMF([model], [statusEnum]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'enum-fields-schema.ts');
  const enumsFile = TestAssertions.assertFileExists(result.files, 'enums.ts');
  
  // Check enum generation
  TestAssertions.assertEnumDefinition(enumsFile, 'statusEnum', ['ACTIVE', 'INACTIVE']);
  
  // Check enum field with custom default
  TestAssertions.assertFileContains(schemaFile, 'status: statusEnum(\'status\').notNull().default(\'INACTIVE\')');
});

test('Invalid directive handling', async () => {
  const generator = new TestGenerator();
  
  const model = createMockModel({
    name: 'InvalidDirectives',
    dbName: 'invalid_directives',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ 
        name: 'field1', 
        type: 'String',
        documentation: '/// @drizzle.invalidDirective(value: "test")'
      }),
      createMockField({ 
        name: 'field2', 
        type: 'String',
        documentation: '/// @notDrizzleDirective(value: "test")'
      }),
      createMockField({ 
        name: 'field3', 
        type: 'String',
        documentation: '/// Regular comment'
      }),
    ],
  });

  const dmmf = createMockDMMF([model]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const schemaFile = TestAssertions.assertFileExists(result.files, 'invalid-directives-schema.ts');
  
  // Invalid directives should be ignored, fields should use default types
  TestAssertions.assertFileContains(schemaFile, 'field1: text(\'field1\').notNull()');
  TestAssertions.assertFileContains(schemaFile, 'field2: text(\'field2\').notNull()');
  TestAssertions.assertFileContains(schemaFile, 'field3: text(\'field3\').notNull()');
});