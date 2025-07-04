import { describe, it, expect, beforeEach } from 'vitest';
import { SchemaParser } from '@/parsers/schema-parser';
import { PostgreSQLAdapter } from '@/adapters/postgresql';
import { createMockDMMF } from '@tests/utils/mock-dmmf';

describe('SchemaParser', () => {
  let parser: SchemaParser;
  let adapter: PostgreSQLAdapter;

  beforeEach(() => {
    adapter = new PostgreSQLAdapter();
    parser = new SchemaParser(adapter);
  });

  describe('Basic Type Parsing', () => {
    it('should parse all Prisma scalar types correctly', () => {
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'email', type: 'String', isUnique: true },
              { name: 'age', type: 'Int', isOptional: true },
              { name: 'isActive', type: 'Boolean', default: { name: 'true' } },
              { name: 'createdAt', type: 'DateTime', default: { name: 'now' } },
              { name: 'score', type: 'Float' },
              { name: 'bio', type: 'String', isOptional: true },
              { name: 'metadata', type: 'Json' }
            ]
          }
        ]
      });

      const result = parser.parse(dmmf);
      const userTable = result.tables.find(t => t.name === 'User');

      expect(userTable).toBeDefined();
      expect(userTable?.columns).toHaveLength(8);
      
      // Test specific column mappings
      const idColumn = userTable?.columns.find(c => c.name === 'id');
      expect(idColumn?.primaryKey).toBe(true);
      expect(idColumn?.type.drizzleType).toBe('text');

      const emailColumn = userTable?.columns.find(c => c.name === 'email');
      expect(emailColumn?.unique).toBe(true);

      const ageColumn = userTable?.columns.find(c => c.name === 'age');
      expect(ageColumn?.nullable).toBe(true);
    });

    it('should handle native PostgreSQL types', () => {
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'TestTypes',
            fields: [
              { 
                name: 'id', 
                type: 'String', 
                isId: true,
                documentation: '/// @db.Uuid'
              },
              { 
                name: 'text', 
                type: 'String',
                documentation: '/// @db.VarChar(255)'
              },
              { 
                name: 'number', 
                type: 'Decimal',
                documentation: '/// @db.Decimal(10, 2)'
              }
            ]
          }
        ]
      });

      const result = parser.parse(dmmf);
      const table = result.tables[0];

      const idColumn = table.columns.find(c => c.name === 'id');
      expect(idColumn?.type.drizzleType).toBe('uuid');

      const textColumn = table.columns.find(c => c.name === 'text');
      expect(textColumn?.type.drizzleType).toBe('varchar');

      const numberColumn = table.columns.find(c => c.name === 'number');
      expect(numberColumn?.type.drizzleType).toBe('decimal');
    });
  });

  describe('Relation Parsing', () => {
    it('should parse 1:1 relations correctly', () => {
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { 
                name: 'profile', 
                type: 'UserProfile',
                relationName: 'UserToProfile'
              }
            ]
          },
          {
            name: 'UserProfile',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'userId', type: 'String', isUnique: true },
              { 
                name: 'user', 
                type: 'User',
                relationName: 'UserToProfile',
                relationFromFields: ['userId'],
                relationToFields: ['id']
              }
            ]
          }
        ]
      });

      const result = parser.parse(dmmf);
      
      // FK owner side (UserProfile)
      const fkRelation = result.relations.find(r => 
        r.relationName === 'user' && r.foreignKeyTable === 'UserProfile'
      );
      expect(fkRelation).toBeDefined();
      expect(fkRelation?.type).toBe('one');
      expect(fkRelation?.foreignKeyField).toBe('userId');
      expect(fkRelation?.referencedField).toBe('id');

      // Reverse side (User)
      const reverseRelation = result.relations.find(r => 
        r.relationName === 'profile' && r.isReverse === true
      );
      expect(reverseRelation).toBeDefined();
      expect(reverseRelation?.type).toBe('one');
    });

    it('should parse 1:M relations correctly', () => {
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { 
                name: 'posts', 
                type: 'Post',
                isList: true,
                relationName: 'UserToPosts'
              }
            ]
          },
          {
            name: 'Post',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'authorId', type: 'String' },
              { 
                name: 'author', 
                type: 'User',
                relationName: 'UserToPosts',
                relationFromFields: ['authorId'],
                relationToFields: ['id']
              }
            ]
          }
        ]
      });

      const result = parser.parse(dmmf);
      
      // FK owner side (Post)
      const fkRelation = result.relations.find(r => 
        r.relationName === 'author' && r.foreignKeyTable === 'Post'
      );
      expect(fkRelation).toBeDefined();
      expect(fkRelation?.type).toBe('one');

      // Many side (User)
      const manyRelation = result.relations.find(r => 
        r.relationName === 'posts' && r.foreignKeyTable === 'User'
      );
      expect(manyRelation).toBeDefined();
      expect(manyRelation?.type).toBe('many');
    });

    it('should parse M:N implicit relations correctly', () => {
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { 
                name: 'tags', 
                type: 'Tag',
                isList: true,
                relationName: 'UserTags'
              }
            ]
          },
          {
            name: 'Tag',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { 
                name: 'users', 
                type: 'User',
                isList: true,
                relationName: 'UserTags'
              }
            ]
          }
        ]
      });

      const result = parser.parse(dmmf);
      
      const userTagsRelation = result.relations.find(r => 
        r.relationName === 'tags' && r.foreignKeyTable === 'User'
      );
      expect(userTagsRelation).toBeDefined();
      expect(userTagsRelation?.type).toBe('many');
      expect(userTagsRelation?.isImplicitManyToMany).toBe(true);

      const tagUsersRelation = result.relations.find(r => 
        r.relationName === 'users' && r.foreignKeyTable === 'Tag'
      );
      expect(tagUsersRelation).toBeDefined();
      expect(tagUsersRelation?.isImplicitManyToMany).toBe(true);
    });

    it('should parse self-relations correctly', () => {
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'referredById', type: 'String', isOptional: true },
              { 
                name: 'referredBy', 
                type: 'User',
                isOptional: true,
                relationName: 'UserReferrals',
                relationFromFields: ['referredById'],
                relationToFields: ['id']
              },
              { 
                name: 'referrals', 
                type: 'User',
                isList: true,
                relationName: 'UserReferrals'
              }
            ]
          }
        ]
      });

      const result = parser.parse(dmmf);
      
      // FK side (referredBy)
      const fkRelation = result.relations.find(r => 
        r.relationName === 'referredBy'
      );
      expect(fkRelation).toBeDefined();
      expect(fkRelation?.type).toBe('one');
      expect(fkRelation?.foreignKeyField).toBe('referredById');

      // Reverse side (referrals)
      const reverseRelation = result.relations.find(r => 
        r.relationName === 'referrals'
      );
      expect(reverseRelation).toBeDefined();
      expect(reverseRelation?.type).toBe('many');
    });
  });

  describe('Constraints Parsing', () => {
    it('should parse unique constraints', () => {
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'email', type: 'String' },
              { name: 'username', type: 'String' }
            ],
            uniqueIndexes: [
              {
                name: 'email_username_unique',
                fields: ['email', 'username']
              }
            ]
          }
        ]
      });

      const result = parser.parse(dmmf);
      const table = result.tables[0];
      
      expect(table.uniqueConstraints).toBeDefined();
      expect(table.uniqueConstraints).toHaveLength(1);
      expect(table.uniqueConstraints?.[0].columns).toEqual(['email', 'username']);
      expect(table.uniqueConstraints?.[0].name).toBe('email_username_unique');
    });

    it('should parse compound primary keys', () => {
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'UserRole',
            fields: [
              { name: 'userId', type: 'String' },
              { name: 'roleId', type: 'String' },
              { name: 'assignedAt', type: 'DateTime' }
            ],
            primaryKey: {
              fields: ['userId', 'roleId']
            }
          }
        ]
      });

      const result = parser.parse(dmmf);
      const table = result.tables[0];
      
      expect(table.compoundPrimaryKey).toBeDefined();
      expect(table.compoundPrimaryKey?.columns).toEqual(['userId', 'roleId']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle models with no relations', () => {
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'SimpleModel',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'name', type: 'String' }
            ]
          }
        ]
      });

      const result = parser.parse(dmmf);
      
      expect(result.tables).toHaveLength(1);
      expect(result.relations).toHaveLength(0);
    });

    it('should handle empty schema', () => {
      const dmmf = createMockDMMF({
        models: []
      });

      const result = parser.parse(dmmf);
      
      expect(result.tables).toHaveLength(0);
      expect(result.relations).toHaveLength(0);
      expect(result.enums).toHaveLength(0);
    });

    it('should handle models with very long names', () => {
      const longName = 'VeryLongModelNameThatTestsNamingConventionsAndEdgeCases';
      const dmmf = createMockDMMF({
        models: [
          {
            name: longName,
            fields: [
              { name: 'id', type: 'String', isId: true }
            ]
          }
        ]
      });

      const result = parser.parse(dmmf);
      const table = result.tables[0];
      
      expect(table.name).toBe(longName);
      expect(table.tableName).toBe(longName);
    });

    it('should handle reserved SQL keywords', () => {
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'Order',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'select', type: 'String' },
              { name: 'from', type: 'String' },
              { name: 'where', type: 'String' }
            ]
          }
        ]
      });

      const result = parser.parse(dmmf);
      const table = result.tables[0];
      
      expect(table.name).toBe('Order');
      expect(table.columns.find(c => c.name === 'select')).toBeDefined();
      expect(table.columns.find(c => c.name === 'from')).toBeDefined();
      expect(table.columns.find(c => c.name === 'where')).toBeDefined();
    });
  });

  describe('Custom Directives', () => {
    it('should parse custom @drizzle directives', () => {
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'User',
            fields: [
              { 
                name: 'id', 
                type: 'String', 
                isId: true,
                documentation: '/// @drizzle.type(type: "uuid")'
              },
              { 
                name: 'customField', 
                type: 'String',
                default: { name: 'original' },
                documentation: '/// @drizzle.default(value: "custom_default")'
              }
            ]
          }
        ]
      });

      const result = parser.parse(dmmf);
      const table = result.tables[0];
      
      const idColumn = table.columns.find(c => c.name === 'id');
      expect(idColumn?.customDirectives).toBeDefined();
      
      const customColumn = table.columns.find(c => c.name === 'customField');
      expect(customColumn?.defaultValue).toBe('custom_default');
    });
  });
});