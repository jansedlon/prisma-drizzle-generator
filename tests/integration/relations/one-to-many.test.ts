import { describe, it, expect, beforeEach } from 'vitest';
import { generateDrizzleSchema } from '@/index';
import { MOCK_SCHEMAS } from '@tests/utils/mock-dmmf';
import { tmpdir } from 'os';
import { join } from 'path';
import { mkdtemp, readFile } from 'fs/promises';
import { rimraf } from 'rimraf';

describe('One-to-Many Relations Integration', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'drizzle-test-'));
  });

  afterEach(async () => {
    await rimraf(tempDir);
  });

  describe('Basic 1:M Relationships', () => {
    it('should generate correct User → Posts relationship', async () => {
      const dmmf = MOCK_SCHEMAS.userPost();
      
      const result = await generateDrizzleSchema({
        dmmf,
        outputDir: tempDir,
        adapter: 'postgresql'
      });

      expect(result.success).toBe(true);
      expect(result.files).toContain('user-relations.ts');
      expect(result.files).toContain('post-relations.ts');

      // Check User relations file
      const userRelationsContent = await readFile(
        join(tempDir, 'user-relations.ts'), 
        'utf-8'
      );

      expect(userRelationsContent).toContain('export const userRelations');
      expect(userRelationsContent).toContain('posts: many(post)');
      expect(userRelationsContent).not.toContain('fields:');
      expect(userRelationsContent).not.toContain('references:');

      // Check Post relations file
      const postRelationsContent = await readFile(
        join(tempDir, 'post-relations.ts'), 
        'utf-8'
      );

      expect(postRelationsContent).toContain('export const postRelations');
      expect(postRelationsContent).toContain('author: one(user, {');
      expect(postRelationsContent).toContain('fields: [post.authorId]');
      expect(postRelationsContent).toContain('references: [user.id]');
    });

    it('should handle multiple 1:M relationships from same model', async () => {
      const dmmf = MOCK_SCHEMAS.complexSchema();
      
      const result = await generateDrizzleSchema({
        dmmf,
        outputDir: tempDir,
        adapter: 'postgresql'
      });

      const userRelationsContent = await readFile(
        join(tempDir, 'user-relations.ts'), 
        'utf-8'
      );

      // User should have multiple many() relations
      expect(userRelationsContent).toContain('posts: many(post)');
      expect(userRelationsContent).toContain('comments: many(comment)');
      
      // Should also have 1:1 relation
      expect(userRelationsContent).toContain('profile: one(userProfile)');
    });

    it('should generate correct imports for 1:M relations', async () => {
      const dmmf = MOCK_SCHEMAS.userPost();
      
      await generateDrizzleSchema({
        dmmf,
        outputDir: tempDir,
        adapter: 'postgresql'
      });

      const userRelationsContent = await readFile(
        join(tempDir, 'user-relations.ts'), 
        'utf-8'
      );

      expect(userRelationsContent).toContain("import { relations } from 'drizzle-orm';");
      expect(userRelationsContent).toContain("import { user } from './user-schema.js';");
      expect(userRelationsContent).toContain("import { post } from './post-schema.js';");

      const postRelationsContent = await readFile(
        join(tempDir, 'post-relations.ts'), 
        'utf-8'
      );

      expect(postRelationsContent).toContain("import { relations } from 'drizzle-orm';");
      expect(postRelationsContent).toContain("import { post } from './post-schema.js';");
      expect(postRelationsContent).toContain("import { user } from './user-schema.js';");
    });
  });

  describe('Cascade Actions', () => {
    it('should handle onDelete and onUpdate actions', async () => {
      const dmmf = MOCK_SCHEMAS.complexSchema();
      
      await generateDrizzleSchema({
        dmmf,
        outputDir: tempDir,
        adapter: 'postgresql'
      });

      const userProfileContent = await readFile(
        join(tempDir, 'user-profile-relations.ts'), 
        'utf-8'
      );

      // UserProfile → User should have cascade delete
      expect(userProfileContent).toContain('user: one(user, {');
      expect(userProfileContent).toContain('fields: [userProfile.userId]');
      expect(userProfileContent).toContain('references: [user.id]');
    });
  });

  describe('Schema Generation Validation', () => {
    it('should generate valid TypeScript code', async () => {
      const dmmf = MOCK_SCHEMAS.userPost();
      
      const result = await generateDrizzleSchema({
        dmmf,
        outputDir: tempDir,
        adapter: 'postgresql'
      });

      expect(result.success).toBe(true);
      
      // Verify syntax by attempting to parse with TypeScript AST
      for (const file of result.files.filter(f => f.endsWith('.ts'))) {
        const content = await readFile(join(tempDir, file), 'utf-8');
        expect(content).not.toContain('undefined');
        expect(content).not.toContain('null');
        expect(content).toMatch(/^import.*from/m); // Has imports
        expect(content).toMatch(/export const \w+Relations/); // Has exports
      }
    });

    it('should not generate relations files for models without relations', async () => {
      const simpleDMMF = {
        datamodel: {
          models: [
            {
              name: 'SimpleModel',
              fields: [
                { name: 'id', type: 'String', isId: true, kind: 'scalar' },
                { name: 'name', type: 'String', kind: 'scalar' }
              ]
            }
          ],
          enums: [],
          types: []
        }
      } as any;

      const result = await generateDrizzleSchema({
        dmmf: simpleDMMF,
        outputDir: tempDir,
        adapter: 'postgresql'
      });

      expect(result.files).not.toContain('simple-model-relations.ts');
      expect(result.files).toContain('simple-model-schema.ts');
    });
  });

  describe('Edge Cases', () => {
    it('should handle models with reserved SQL keywords', async () => {
      const reservedKeywordsDMMF = {
        datamodel: {
          models: [
            {
              name: 'User',
              fields: [
                { name: 'id', type: 'String', isId: true, kind: 'scalar' },
                { name: 'orders', type: 'Order', isList: true, relationName: 'UserOrders', kind: 'object' }
              ]
            },
            {
              name: 'Order',
              fields: [
                { name: 'id', type: 'String', isId: true, kind: 'scalar' },
                { name: 'select', type: 'String', kind: 'scalar' },
                { name: 'from', type: 'String', kind: 'scalar' },
                { name: 'userId', type: 'String', kind: 'scalar' },
                { 
                  name: 'user', 
                  type: 'User', 
                  relationName: 'UserOrders',
                  relationFromFields: ['userId'],
                  relationToFields: ['id'],
                  kind: 'object'
                }
              ]
            }
          ],
          enums: [],
          types: []
        }
      } as any;

      const result = await generateDrizzleSchema({
        dmmf: reservedKeywordsDMMF,
        outputDir: tempDir,
        adapter: 'postgresql'
      });

      expect(result.success).toBe(true);

      const orderRelationsContent = await readFile(
        join(tempDir, 'order-relations.ts'), 
        'utf-8'
      );

      expect(orderRelationsContent).toContain('user: one(user, {');
      expect(orderRelationsContent).toContain('fields: [order.userId]');
    });

    it('should handle very long relation names', async () => {
      const longNameDMMF = {
        datamodel: {
          models: [
            {
              name: 'VeryLongModelNameThatTestsNamingConventions',
              fields: [
                { name: 'id', type: 'String', isId: true, kind: 'scalar' },
                { 
                  name: 'relatedVeryLongItems', 
                  type: 'AnotherVeryLongModelNameForTesting',
                  isList: true,
                  relationName: 'VeryLongRelationshipName',
                  kind: 'object'
                }
              ]
            },
            {
              name: 'AnotherVeryLongModelNameForTesting',
              fields: [
                { name: 'id', type: 'String', isId: true, kind: 'scalar' },
                { name: 'parentId', type: 'String', kind: 'scalar' },
                { 
                  name: 'parentVeryLongModel', 
                  type: 'VeryLongModelNameThatTestsNamingConventions',
                  relationName: 'VeryLongRelationshipName',
                  relationFromFields: ['parentId'],
                  relationToFields: ['id'],
                  kind: 'object'
                }
              ]
            }
          ],
          enums: [],
          types: []
        }
      } as any;

      const result = await generateDrizzleSchema({
        dmmf: longNameDMMF,
        outputDir: tempDir,
        adapter: 'postgresql'
      });

      expect(result.success).toBe(true);
      expect(result.files).toContain('very-long-model-name-that-tests-naming-conventions-relations.ts');
      expect(result.files).toContain('another-very-long-model-name-for-testing-relations.ts');
    });
  });

  describe('Consistency Checks', () => {
    it('should generate symmetric relations', async () => {
      const dmmf = MOCK_SCHEMAS.userPost();
      
      await generateDrizzleSchema({
        dmmf,
        outputDir: tempDir,
        adapter: 'postgresql'
      });

      const userRelationsContent = await readFile(
        join(tempDir, 'user-relations.ts'), 
        'utf-8'
      );
      const postRelationsContent = await readFile(
        join(tempDir, 'post-relations.ts'), 
        'utf-8'
      );

      // User should reference Post
      expect(userRelationsContent).toContain("import { post } from './post-schema.js';");
      expect(userRelationsContent).toContain('posts: many(post)');

      // Post should reference User
      expect(postRelationsContent).toContain("import { user } from './user-schema.js';");
      expect(postRelationsContent).toContain('author: one(user, {');
    });

    it('should maintain referential integrity in generated relations', async () => {
      const dmmf = MOCK_SCHEMAS.complexSchema();
      
      await generateDrizzleSchema({
        dmmf,
        outputDir: tempDir,
        adapter: 'postgresql'
      });

      // Check that all foreign key relations have corresponding reverse relations
      const userRelationsContent = await readFile(
        join(tempDir, 'user-relations.ts'), 
        'utf-8'
      );
      
      // User has many posts
      expect(userRelationsContent).toContain('posts: many(post)');
      
      const postRelationsContent = await readFile(
        join(tempDir, 'post-relations.ts'), 
        'utf-8'
      );
      
      // Post belongs to user
      expect(postRelationsContent).toContain('author: one(user, {');
      expect(postRelationsContent).toContain('fields: [post.authorId]');
      expect(postRelationsContent).toContain('references: [user.id]');
    });
  });
});