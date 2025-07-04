import { describe, it, expect, beforeEach } from 'vitest';
import { SchemaParser } from '../../../src/parsers/schema-parser.js';
import { PostgreSQLAdapter } from '../../../src/adapters/postgresql.js';
import { createMockDMMF } from '../../utils/mock-dmmf.js';

describe('Relations Behavior - How the generator SHOULD work', () => {
  let parser: SchemaParser;
  let adapter: PostgreSQLAdapter;

  beforeEach(() => {
    adapter = new PostgreSQLAdapter();
    parser = new SchemaParser(adapter);
  });

  describe('1:1 Relations - One-to-One', () => {
    it('should generate correct relations for User ↔ UserProfile', () => {
      // Given: Prisma schema with 1:1 relation
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'email', type: 'String', isUnique: true },
              { name: 'profile', type: 'UserProfile', relationName: 'UserToProfile' }
            ]
          },
          {
            name: 'UserProfile', 
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'bio', type: 'String', isOptional: true },
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

      // When: Parser processes the schema
      const result = parser.parse(dmmf);

      // Then: Should generate correct relations
      
      // UserProfile (FK owner) should have 'one' relation WITH fields/references
      const userProfileToUser = result.relations.find(r => 
        r.foreignKeyTable === 'UserProfile' && 
        r.relationName === 'user' && 
        r.type === 'one'
      );
      expect(userProfileToUser).toBeDefined();
      expect(userProfileToUser?.foreignKeyField).toBe('userId');
      expect(userProfileToUser?.referencedTable).toBe('User');
      expect(userProfileToUser?.referencedField).toBe('id');

      // User (reverse side) should have 'one' relation WITHOUT fields/references
      const userToProfile = result.relations.find(r => 
        r.foreignKeyTable === 'User' && 
        r.relationName === 'profile' && 
        r.type === 'one'
      );
      expect(userToProfile).toBeDefined();
      expect(userToProfile?.isReverse).toBe(true);
    });
  });

  describe('1:M Relations - One-to-Many', () => {
    it('should generate correct relations for User → Posts', () => {
      // Given: Prisma schema with 1:M relation
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'email', type: 'String', isUnique: true },
              { name: 'posts', type: 'Post', isList: true, relationName: 'UserToPosts' }
            ]
          },
          {
            name: 'Post',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'title', type: 'String' },
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

      // When: Parser processes the schema
      const result = parser.parse(dmmf);

      // Then: Should generate correct relations

      // Post (FK owner) should have 'one' relation WITH fields/references  
      const postToUser = result.relations.find(r => 
        r.foreignKeyTable === 'Post' && 
        r.relationName === 'author' && 
        r.type === 'one'
      );
      expect(postToUser).toBeDefined();
      expect(postToUser?.foreignKeyField).toBe('authorId');
      expect(postToUser?.referencedTable).toBe('User');
      expect(postToUser?.referencedField).toBe('id');

      // User (many side) should have 'many' relation WITHOUT fields/references
      const userToPosts = result.relations.find(r => 
        r.foreignKeyTable === 'User' && 
        r.relationName === 'posts' && 
        r.type === 'many'
      );
      expect(userToPosts).toBeDefined();
      expect(userToPosts?.referencedTable).toBe('Post');
    });
  });

  describe('M:N Relations - Many-to-Many', () => {
    it('should generate correct relations for User ↔ Tags (implicit M:N)', () => {
      // Given: Prisma schema with implicit M:N relation
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'email', type: 'String', isUnique: true },
              { name: 'tags', type: 'Tag', isList: true, relationName: 'UserTags' }
            ]
          },
          {
            name: 'Tag',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'name', type: 'String', isUnique: true },
              { name: 'users', type: 'User', isList: true, relationName: 'UserTags' }
            ]
          }
        ]
      });

      // When: Parser processes the schema
      const result = parser.parse(dmmf);

      // Then: Should generate M:N relations

      // User should have 'many' relation to Tag
      const userToTags = result.relations.find(r => 
        r.foreignKeyTable === 'User' && 
        r.relationName === 'tags' && 
        r.type === 'many'
      );
      expect(userToTags).toBeDefined();
      expect(userToTags?.isImplicitManyToMany).toBe(true);
      expect(userToTags?.referencedTable).toBe('Tag');

      // Tag should have 'many' relation to User
      const tagToUsers = result.relations.find(r => 
        r.foreignKeyTable === 'Tag' && 
        r.relationName === 'users' && 
        r.type === 'many'
      );
      expect(tagToUsers).toBeDefined();
      expect(tagToUsers?.isImplicitManyToMany).toBe(true);
      expect(tagToUsers?.referencedTable).toBe('User');
    });
  });

  describe('Self Relations - Self-referencing', () => {
    it('should generate correct relations for User referrals', () => {
      // Given: Prisma schema with self-referencing relation
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'email', type: 'String', isUnique: true },
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

      // When: Parser processes the schema
      const result = parser.parse(dmmf);

      // Then: Should generate self-referencing relations

      // FK side should have 'one' relation WITH fields/references
      const referredBy = result.relations.find(r => 
        r.relationName === 'referredBy' && 
        r.type === 'one'
      );
      expect(referredBy).toBeDefined();
      expect(referredBy?.foreignKeyField).toBe('referredById');
      expect(referredBy?.referencedTable).toBe('User');
      expect(referredBy?.referencedField).toBe('id');

      // Reverse side should have 'many' relation WITHOUT fields/references
      const referrals = result.relations.find(r => 
        r.relationName === 'referrals' && 
        r.type === 'many'
      );
      expect(referrals).toBeDefined();
      expect(referrals?.referencedTable).toBe('User');
    });
  });

  describe('Relation Naming - Exact field names from Prisma', () => {
    it('should use exact field names from Prisma schema, not generic names', () => {
      // Given: Prisma schema with specific field names
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'Post',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'title', type: 'String' },
              { name: 'authorId', type: 'String' },
              { name: 'categoryId', type: 'String' },
              { 
                name: 'author',  // Specific name - not 'user'
                type: 'User', 
                relationName: 'PostAuthor',
                relationFromFields: ['authorId'],
                relationToFields: ['id']
              },
              { 
                name: 'category', // Specific name - not 'categories'
                type: 'Category', 
                relationName: 'PostCategory',
                relationFromFields: ['categoryId'],
                relationToFields: ['id']
              },
              { 
                name: 'comments', // Specific name - not 'comment'
                type: 'Comment', 
                isList: true, 
                relationName: 'PostComments' 
              },
              { 
                name: 'tags', // Specific name - should stay 'tags'
                type: 'Tag', 
                isList: true, 
                relationName: 'PostTags' 
              }
            ]
          },
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'posts', type: 'Post', isList: true, relationName: 'PostAuthor' }
            ]
          },
          {
            name: 'Category',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'posts', type: 'Post', isList: true, relationName: 'PostCategory' }
            ]
          },
          {
            name: 'Comment',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'postId', type: 'String' },
              { name: 'post', type: 'Post', relationName: 'PostComments',
                relationFromFields: ['postId'], relationToFields: ['id'] }
            ]
          },
          {
            name: 'Tag',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'posts', type: 'Post', isList: true, relationName: 'PostTags' }
            ]
          }
        ]
      });

      // When: Parser processes the schema
      const result = parser.parse(dmmf);

      // Then: Should use EXACT field names from Prisma

      // Post should have relations with exact names from schema
      const postRelations = result.relations.filter(r => r.foreignKeyTable === 'Post');
      
      const authorRelation = postRelations.find(r => r.relationName === 'author');
      expect(authorRelation).toBeDefined();
      expect(authorRelation?.relationName).toBe('author'); // Not 'user'
      
      const categoryRelation = postRelations.find(r => r.relationName === 'category');
      expect(categoryRelation).toBeDefined();
      expect(categoryRelation?.relationName).toBe('category'); // Not 'categories'

      const commentsRelation = postRelations.find(r => r.relationName === 'comments');
      expect(commentsRelation).toBeDefined();
      expect(commentsRelation?.relationName).toBe('comments'); // Not 'comment'

      const tagsRelation = postRelations.find(r => r.relationName === 'tags');
      expect(tagsRelation).toBeDefined();
      expect(tagsRelation?.relationName).toBe('tags'); // Should stay 'tags'
    });
  });

  describe('No Duplicate Relations', () => {
    it('should not generate duplicate relation names for the same table', () => {
      // Given: Complex schema that might cause duplicates
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'posts', type: 'Post', isList: true, relationName: 'UserPosts' },
              { name: 'comments', type: 'Comment', isList: true, relationName: 'UserComments' }
            ]
          },
          {
            name: 'Post',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'authorId', type: 'String' },
              { name: 'author', type: 'User', relationName: 'UserPosts',
                relationFromFields: ['authorId'], relationToFields: ['id'] },
              { name: 'comments', type: 'Comment', isList: true, relationName: 'PostComments' }
            ]
          },
          {
            name: 'Comment',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'authorId', type: 'String' },
              { name: 'postId', type: 'String' },
              { name: 'author', type: 'User', relationName: 'UserComments',
                relationFromFields: ['authorId'], relationToFields: ['id'] },
              { name: 'post', type: 'Post', relationName: 'PostComments',
                relationFromFields: ['postId'], relationToFields: ['id'] }
            ]
          }
        ]
      });

      // When: Parser processes the schema
      const result = parser.parse(dmmf);

      // Then: Should not have duplicate relation names per table
      
      // Check Post relations - should not have duplicates
      const postRelations = result.relations.filter(r => r.foreignKeyTable === 'Post');
      const postRelationNames = postRelations.map(r => r.relationName);
      const uniquePostNames = [...new Set(postRelationNames)];
      expect(postRelationNames).toHaveLength(uniquePostNames.length);

      // Check User relations - should not have duplicates  
      const userRelations = result.relations.filter(r => r.foreignKeyTable === 'User');
      const userRelationNames = userRelations.map(r => r.relationName);
      const uniqueUserNames = [...new Set(userRelationNames)];
      expect(userRelationNames).toHaveLength(uniqueUserNames.length);

      // Check Comment relations - should not have duplicates
      const commentRelations = result.relations.filter(r => r.foreignKeyTable === 'Comment');
      const commentRelationNames = commentRelations.map(r => r.relationName);
      const uniqueCommentNames = [...new Set(commentRelationNames)];
      expect(commentRelationNames).toHaveLength(uniqueCommentNames.length);
    });
  });

  describe('Only Relations That Belong to Model', () => {
    it('should only generate relations for fields that actually exist in each model', () => {
      // Given: Schema where models have specific fields
      const dmmf = createMockDMMF({
        models: [
          {
            name: 'Post',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'title', type: 'String' },
              { name: 'authorId', type: 'String' },
              { 
                name: 'author', // Post HAS this field
                type: 'User', 
                relationName: 'UserPosts',
                relationFromFields: ['authorId'],
                relationToFields: ['id']
              },
              { 
                name: 'comments', // Post HAS this field
                type: 'Comment', 
                isList: true, 
                relationName: 'PostComments' 
              }
              // Post does NOT have 'posts' field!
            ]
          },
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { 
                name: 'posts', // User HAS this field
                type: 'Post', 
                isList: true, 
                relationName: 'UserPosts' 
              }
              // User does NOT have 'author' field!
            ]
          },
          {
            name: 'Comment',
            fields: [
              { name: 'id', type: 'String', isId: true },
              { name: 'postId', type: 'String' },
              { 
                name: 'post', // Comment HAS this field
                type: 'Post', 
                relationName: 'PostComments',
                relationFromFields: ['postId'],
                relationToFields: ['id']
              }
              // Comment does NOT have 'comments' field!
            ]
          }
        ]
      });

      // When: Parser processes the schema
      const result = parser.parse(dmmf);

      // Then: Should ONLY generate relations for fields that exist

      // Post should have ONLY 'author' and 'comments' - NOT 'posts'
      const postRelations = result.relations.filter(r => r.foreignKeyTable === 'Post');
      const postRelationNames = postRelations.map(r => r.relationName);
      expect(postRelationNames).toContain('author');
      expect(postRelationNames).toContain('comments');
      expect(postRelationNames).not.toContain('posts'); // Post doesn't have 'posts' field!

      // User should have ONLY 'posts' - NOT 'author'
      const userRelations = result.relations.filter(r => r.foreignKeyTable === 'User');
      const userRelationNames = userRelations.map(r => r.relationName);
      expect(userRelationNames).toContain('posts');
      expect(userRelationNames).not.toContain('author'); // User doesn't have 'author' field!

      // Comment should have ONLY 'post' - NOT 'comments'  
      const commentRelations = result.relations.filter(r => r.foreignKeyTable === 'Comment');
      const commentRelationNames = commentRelations.map(r => r.relationName);
      expect(commentRelationNames).toContain('post');
      expect(commentRelationNames).not.toContain('comments'); // Comment doesn't have 'comments' field!
    });
  });
});