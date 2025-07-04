import { describe, it, expect, beforeEach } from 'vitest';
import { SchemaParser } from '../../../src/parsers/schema-parser.js';
import { PostgreSQLAdapter } from '../../../src/adapters/postgresql.js';
import { createMockDMMF, MOCK_SCHEMAS } from '../../utils/mock-dmmf.js';

describe('SchemaParser', () => {
  let parser: SchemaParser;
  let adapter: PostgreSQLAdapter;

  beforeEach(() => {
    adapter = new PostgreSQLAdapter();
    parser = new SchemaParser(adapter);
  });

  describe('Basic Parsing', () => {
    it('should create SchemaParser instance', () => {
      expect(parser).toBeDefined();
      expect(adapter).toBeDefined();
    });

    it('should parse simple model without relations', () => {
      const dmmf = MOCK_SCHEMAS.simple();
      const result = parser.parse(dmmf);
      
      expect(result).toBeDefined();
      expect(result.tables).toBeDefined();
      expect(result.relations).toBeDefined();
      expect(result.enums).toBeDefined();
    });

    it('should parse User model with basic fields', () => {
      const dmmf = MOCK_SCHEMAS.simple();
      const result = parser.parse(dmmf);
      
      expect(result.tables).toHaveLength(1);
      const userTable = result.tables[0];
      
      expect(userTable).toBeDefined();
      expect(userTable.name).toBe('User');
      expect(userTable.columns).toBeDefined();
      expect(userTable.columns.length).toBeGreaterThan(0);
      
      // Check for id column
      const idColumn = userTable.columns.find(c => c.name === 'id');
      expect(idColumn).toBeDefined();
      expect(idColumn?.primaryKey).toBe(true);
    });
  });

  describe('Relations Parsing', () => {
    it('should parse User-Post relationship', () => {
      const dmmf = MOCK_SCHEMAS.userPost();
      const result = parser.parse(dmmf);
      
      expect(result.tables).toHaveLength(2);
      expect(result.relations.length).toBeGreaterThan(0);
      
      // Should have User and Post tables
      const userTable = result.tables.find(t => t.name === 'User');
      const postTable = result.tables.find(t => t.name === 'Post');
      
      expect(userTable).toBeDefined();
      expect(postTable).toBeDefined();
    });

    it('should generate relations for User-Post relationship', () => {
      const dmmf = MOCK_SCHEMAS.userPost();
      const result = parser.parse(dmmf);
      
      expect(result.relations.length).toBeGreaterThan(0);
      
      // Check for FK relation from Post to User
      const postToUserRelation = result.relations.find(r => 
        r.relationName === 'author' && r.type === 'one'
      );
      expect(postToUserRelation).toBeDefined();
      
      // Check for many relation from User to Posts
      const userToPostsRelation = result.relations.find(r => 
        r.relationName === 'posts' && r.type === 'many'
      );
      expect(userToPostsRelation).toBeDefined();
    });
  });

  describe('PostgreSQL Adapter Integration', () => {
    it('should use PostgreSQL adapter for type mapping', () => {
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'TestModel',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'name', type: 'String' },
              { name: 'age', type: 'Int', isOptional: true },
              { name: 'isActive', type: 'Boolean' }
            ]
          }
        ]
      });

      const result = parser.parse(dmmf);
      expect(result.tables).toHaveLength(1);
      
      const table = result.tables[0];
      expect(table).toBeDefined();
      expect(table.columns).toHaveLength(4);
      
      // Check PostgreSQL type mappings
      const stringColumn = table.columns.find(c => c.name === 'name');
      expect(stringColumn?.type.drizzleType).toBe('text');
      
      const intColumn = table.columns.find(c => c.name === 'age');
      expect(intColumn?.type.drizzleType).toBe('integer');
      
      const boolColumn = table.columns.find(c => c.name === 'isActive');
      expect(boolColumn?.type.drizzleType).toBe('boolean');
    });
  });

  describe('Error Handling', () => {
    it('should handle empty models', () => {
      const dmmf = createMockDMMF({
        models: []
      });

      const result = parser.parse(dmmf);
      
      expect(result.tables).toHaveLength(0);
      expect(result.relations).toHaveLength(0);
      expect(result.enums).toHaveLength(0);
    });
  });
});