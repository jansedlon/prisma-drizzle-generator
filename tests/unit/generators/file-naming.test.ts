import { describe, it, expect, beforeEach } from 'vitest';
import { CodeGenerator } from '../../../src/generators/index.js';
import { PostgreSQLAdapter } from '../../../src/adapters/postgresql.js';
import type { GeneratorConfig, ParsedSchema } from '../../../src/types/index.js';

describe('File Naming - Plural Forms', () => {
  let generator: CodeGenerator;
  let config: GeneratorConfig;

  beforeEach(() => {
    const adapter = new PostgreSQLAdapter();
    config = {
      output: './test-output',
      moduleResolution: 'nodeNext',
      splitFiles: true
    };
    generator = new CodeGenerator(adapter, config);
  });

  it('should generate schema files with plural names', async () => {
    // Given: Schema with singular model names
    const schema: ParsedSchema = {
      tables: [
        {
          name: 'User',
          tableName: 'User',
          columns: [
            {
              name: 'id',
              dbName: null,
              type: { drizzleType: 'text', importPath: 'drizzle-orm/pg-core' },
              nullable: false,
              primaryKey: true,
              unique: false
            }
          ],
          enums: []
        },
        {
          name: 'Post',
          tableName: 'Post',
          columns: [
            {
              name: 'id',
              dbName: null,
              type: { drizzleType: 'text', importPath: 'drizzle-orm/pg-core' },
              nullable: false,
              primaryKey: true,
              unique: false
            }
          ],
          enums: []
        },
        {
          name: 'Category',
          tableName: 'Category',
          columns: [
            {
              name: 'id',
              dbName: null,
              type: { drizzleType: 'text', importPath: 'drizzle-orm/pg-core' },
              nullable: false,
              primaryKey: true,
              unique: false
            }
          ],
          enums: []
        }
      ],
      relations: [],
      enums: []
    };

    // When: Generate files
    const files = await generator.generate(schema);

    // Then: Should use plural file names
    const schemaFiles = files.filter(f => f.type === 'schema' && f.path !== 'index.ts');
    
    expect(schemaFiles).toHaveLength(3);
    expect(schemaFiles.map(f => f.path)).toEqual([
      'users-schema.ts',      // User -> users
      'posts-schema.ts',      // Post -> posts
      'categories-schema.ts'  // Category -> categories
    ]);
  });

  it('should generate relations files with plural names', async () => {
    // Given: Schema with relations
    const schema: ParsedSchema = {
      tables: [
        {
          name: 'User',
          tableName: 'User',
          columns: [
            {
              name: 'id',
              dbName: null,
              type: { drizzleType: 'text', importPath: 'drizzle-orm/pg-core' },
              nullable: false,
              primaryKey: true,
              unique: false
            }
          ],
          enums: []
        },
        {
          name: 'Company',
          tableName: 'Company',
          columns: [
            {
              name: 'id',
              dbName: null,
              type: { drizzleType: 'text', importPath: 'drizzle-orm/pg-core' },
              nullable: false,
              primaryKey: true,
              unique: false
            }
          ],
          enums: []
        }
      ],
      relations: [
        {
          type: 'one',
          foreignKeyTable: 'User',
          foreignKeyField: 'companyId',
          referencedTable: 'Company',
          referencedField: 'id',
          relationName: 'company'
        },
        {
          type: 'many',
          foreignKeyTable: 'Company',
          foreignKeyField: 'companyId',
          referencedTable: 'User',
          referencedField: 'id',
          relationName: 'users'
        }
      ],
      enums: []
    };

    // When: Generate files
    const files = await generator.generate(schema);

    // Then: Should use plural file names for relations
    const relationFiles = files.filter(f => f.type === 'relations');
    
    expect(relationFiles.map(f => f.path)).toEqual([
      'users-relations.ts',     // User -> users
      'companies-relations.ts'  // Company -> companies
    ]);
  });

  it('should generate index file with plural import paths', async () => {
    // Given: Schema with multiple models
    const schema: ParsedSchema = {
      tables: [
        {
          name: 'User',
          tableName: 'User',
          columns: [
            {
              name: 'id',
              dbName: null,
              type: { drizzleType: 'text', importPath: 'drizzle-orm/pg-core' },
              nullable: false,
              primaryKey: true,
              unique: false
            }
          ],
          enums: []
        },
        {
          name: 'Story',
          tableName: 'Story',
          columns: [
            {
              name: 'id',
              dbName: null,
              type: { drizzleType: 'text', importPath: 'drizzle-orm/pg-core' },
              nullable: false,
              primaryKey: true,
              unique: false
            }
          ],
          enums: []
        }
      ],
             relations: [
         {
           type: 'one',
           foreignKeyTable: 'Story',
           foreignKeyField: 'authorId',
           referencedTable: 'User',
           referencedField: 'id',
           relationName: 'author'
         },
         {
           type: 'many',
           foreignKeyTable: 'User',
           foreignKeyField: 'authorId',
           referencedTable: 'Story',
           referencedField: 'id',
           relationName: 'stories'
         }
       ],
      enums: []
    };

    // When: Generate files
    const files = await generator.generate(schema);
    const indexFile = files.find(f => f.path === 'index.ts');

    // Then: Should export plural file names
    expect(indexFile).toBeDefined();
    expect(indexFile!.content).toContain('export * from \'./users-schema.js\';');
    expect(indexFile!.content).toContain('export * from \'./stories-schema.js\';');
    expect(indexFile!.content).toContain('export * from \'./users-relations.js\';');
    expect(indexFile!.content).toContain('export * from \'./stories-relations.js\';');
  });

  it('should handle special pluralization cases', async () => {
    // Given: Models with special pluralization rules
    const schema: ParsedSchema = {
      tables: [
        {
          name: 'Child',
          tableName: 'Child',
          columns: [
            {
              name: 'id',
              dbName: null,
              type: { drizzleType: 'text', importPath: 'drizzle-orm/pg-core' },
              nullable: false,
              primaryKey: true,
              unique: false
            }
          ],
          enums: []
        },
        {
          name: 'Person',
          tableName: 'Person',
          columns: [
            {
              name: 'id',
              dbName: null,
              type: { drizzleType: 'text', importPath: 'drizzle-orm/pg-core' },
              nullable: false,
              primaryKey: true,
              unique: false
            }
          ],
          enums: []
        }
      ],
      relations: [],
      enums: []
    };

    // When: Generate files
    const files = await generator.generate(schema);

    // Then: Should use correct irregular plurals
    const schemaFiles = files.filter(f => f.type === 'schema' && f.path !== 'index.ts');
    
    expect(schemaFiles.map(f => f.path)).toEqual([
      'children-schema.ts',  // Child -> children (irregular)
      'people-schema.ts'     // Person -> people (irregular)
    ]);
  });

  it('should not double-pluralize already plural names', async () => {
    // Given: Model with already plural name
    const schema: ParsedSchema = {
      tables: [
        {
          name: 'Users', // Already plural
          tableName: 'Users',
          columns: [
            {
              name: 'id',
              dbName: null,
              type: { drizzleType: 'text', importPath: 'drizzle-orm/pg-core' },
              nullable: false,
              primaryKey: true,
              unique: false
            }
          ],
          enums: []
        }
      ],
      relations: [],
      enums: []
    };

    // When: Generate files
    const files = await generator.generate(schema);

    // Then: Should not double-pluralize
    const schemaFiles = files.filter(f => f.type === 'schema' && f.path !== 'index.ts');
    
    expect(schemaFiles.map(f => f.path)).toEqual([
      'users-schema.ts'  // Users -> users (not userss)
    ]);
  });
});