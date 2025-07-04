import { describe, it, expect, beforeEach } from 'vitest';
import { PostgreSQLAdapter } from '../../../src/adapters/postgresql.js';

describe('PostgreSQL Adapter', () => {
  let adapter: PostgreSQLAdapter;

  beforeEach(() => {
    adapter = new PostgreSQLAdapter();
  });

  describe('Basic Properties', () => {
    it('should have correct name', () => {
      expect(adapter.name).toBe('postgresql');
    });

    it('should have alwaysPresentImports', () => {
      expect(adapter.alwaysPresentImports).toEqual(['pgTable']);
    });

    it('should provide imports', () => {
      const imports = adapter.getImports();
      expect(imports).toContain('pgTable');
      expect(imports).toContain('text');
      expect(imports).toContain('integer');
      expect(imports).toContain('boolean');
    });
  });

  describe('Type Mapping', () => {
    it('should map String to text', () => {
      const result = adapter.mapPrismaType('String', false);
      expect(result.drizzleType).toBe('text');
      expect(result.importPath).toBe('drizzle-orm/pg-core');
    });

    it('should map Int to integer', () => {
      const result = adapter.mapPrismaType('Int', false);
      expect(result.drizzleType).toBe('integer');
      expect(result.importPath).toBe('drizzle-orm/pg-core');
    });

    it('should map Boolean to boolean', () => {
      const result = adapter.mapPrismaType('Boolean', false);
      expect(result.drizzleType).toBe('boolean');
      expect(result.importPath).toBe('drizzle-orm/pg-core');
    });

    it('should map DateTime to timestamp', () => {
      const result = adapter.mapPrismaType('DateTime', false);
      expect(result.drizzleType).toBe('timestamp');
      expect(result.importPath).toBe('drizzle-orm/pg-core');
      expect(result.typeArguments).toEqual(['{ withTimezone: true, mode: "date" }']);
    });

    it('should handle Float type', () => {
      const result = adapter.mapPrismaType('Float', false);
      expect(result.drizzleType).toBe('real');
    });

    it('should handle Json type', () => {
      const result = adapter.mapPrismaType('Json', false);
      expect(result.drizzleType).toBe('jsonb');
    });

    it('should throw error for unsupported type', () => {
      expect(() => adapter.mapPrismaType('UnsupportedType', false)).toThrow('Unsupported Prisma type: UnsupportedType');
    });
  });

  describe('Table Generation', () => {
    it('should generate table function', () => {
      const result = adapter.generateTableFunction('users');
      expect(result).toBe("pgTable('users', {");
    });
  });

  describe('Column Generation', () => {
    it('should generate basic column definition', () => {
      const column = {
        name: 'email',
        type: { drizzleType: 'text', importPath: 'drizzle-orm/pg-core' },
        nullable: false,
        primaryKey: false,
        unique: false
      };

      const result = adapter.generateColumnDefinition(column as any);
      expect(result).toBe("email: text('email').notNull()");
    });

    it('should generate primary key column', () => {
      const column = {
        name: 'id',
        type: { drizzleType: 'text', importPath: 'drizzle-orm/pg-core' },
        nullable: false,
        primaryKey: true,
        unique: false
      };

      const result = adapter.generateColumnDefinition(column as any);
      expect(result).toBe("id: text('id').primaryKey()");
    });

    it('should generate unique column', () => {
      const column = {
        name: 'email',
        type: { drizzleType: 'text', importPath: 'drizzle-orm/pg-core' },
        nullable: false,
        primaryKey: false,
        unique: true
      };

      const result = adapter.generateColumnDefinition(column as any);
      expect(result).toBe("email: text('email').unique().notNull()");
    });

    it('should generate column with default value', () => {
      const column = {
        name: 'created_at',
        type: { drizzleType: 'timestamp', importPath: 'drizzle-orm/pg-core' },
        nullable: false,
        primaryKey: false,
        unique: false,
        defaultValue: 'defaultNow'
      };

      const result = adapter.generateColumnDefinition(column as any);
      expect(result).toBe("created_at: timestamp('created_at').defaultNow().notNull()");
    });
  });

  describe('Native Type Mapping', () => {
    it('should map VarChar with length', () => {
      const result = adapter.mapNativeType('VarChar', ['255']);
      expect(result.drizzleType).toBe('varchar');
      expect(result.typeArguments).toEqual(['{ length: 255 }']);
    });

    it('should map Decimal with precision and scale', () => {
      const result = adapter.mapNativeType('Decimal', ['10', '2']);
      expect(result.drizzleType).toBe('decimal');
      expect(result.typeArguments).toEqual(['{ precision: 10, scale: 2 }']);
    });

    it('should handle unsupported native type', () => {
      const result = adapter.mapNativeType('UnsupportedNativeType');
      expect(result).toEqual({});
    });
  });

  describe('Constraint Generation', () => {
    it('should generate unique constraint with name', () => {
      const constraint = {
        name: 'unique_email',
        columns: ['email']
      };

      const result = adapter.generateUniqueConstraint(constraint);
      expect(result).toBe("unique('unique_email').on(table.email)");
    });

    it('should generate unique constraint without name', () => {
      const constraint = {
        columns: ['email', 'username']
      };

      const result = adapter.generateUniqueConstraint(constraint);
      expect(result).toBe("unique().on(table.email, table.username)");
    });

    it('should generate compound primary key', () => {
      const constraint = {
        columns: ['userId', 'roleId']
      };

      const result = adapter.generateCompoundPrimaryKey(constraint);
      expect(result).toBe("primaryKey({ columns: [table.userId, table.roleId] })");
    });
  });
});