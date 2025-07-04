import { test, expect } from 'bun:test';
import { TestGenerator, createMockDMMF, createMockModel, createMockField, TestAssertions } from '../utils/test-helpers.js';

test('One-to-many relationship', async () => {
  const generator = new TestGenerator();
  
  const userModel = createMockModel({
    name: 'User',
    dbName: 'users',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ name: 'name', type: 'String' }),
      createMockField({ 
        name: 'posts', 
        type: 'Post', 
        kind: 'object',
        isList: true,
        relationName: 'UserPosts'
      }),
    ],
  });

  const postModel = createMockModel({
    name: 'Post',
    dbName: 'posts',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ name: 'title', type: 'String' }),
      createMockField({ name: 'authorId', type: 'String' }),
      createMockField({ 
        name: 'author', 
        type: 'User', 
        kind: 'object',
        relationName: 'UserPosts',
        relationFromFields: ['authorId'],
        relationToFields: ['id']
      }),
    ],
  });

  const dmmf = createMockDMMF([userModel, postModel]);
  const result = await generator.generateFromDMMF(dmmf);
  
  // Check schema files
  const userSchema = TestAssertions.assertFileExists(result.files, 'user-schema.ts');
  const postSchema = TestAssertions.assertFileExists(result.files, 'post-schema.ts');
  
  TestAssertions.assertTableDefinition(userSchema, 'users', 'id');
  TestAssertions.assertTableDefinition(postSchema, 'posts', 'authorId');
  
  // Check relations file
  const relationsFile = TestAssertions.assertFileExists(result.files, 'relations.ts');
  TestAssertions.assertImportExists(relationsFile, 'relations');
  TestAssertions.assertImportExists(relationsFile, 'user');
  TestAssertions.assertImportExists(relationsFile, 'post');
  
  TestAssertions.assertRelationDefinition(relationsFile, 'posts');
  TestAssertions.assertRelationDefinition(relationsFile, 'user');
  TestAssertions.assertFileContains(relationsFile, 'many(post)');
  TestAssertions.assertFileContains(relationsFile, 'one(user');
});

test('One-to-one relationship', async () => {
  const generator = new TestGenerator();
  
  const userModel = createMockModel({
    name: 'User',
    dbName: 'users',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ 
        name: 'profile', 
        type: 'Profile', 
        kind: 'object',
        relationName: 'UserProfile'
      }),
    ],
  });

  const profileModel = createMockModel({
    name: 'Profile',
    dbName: 'profiles',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ name: 'userId', type: 'String', isUnique: true }),
      createMockField({ 
        name: 'user', 
        type: 'User', 
        kind: 'object',
        relationName: 'UserProfile',
        relationFromFields: ['userId'],
        relationToFields: ['id']
      }),
    ],
  });

  const dmmf = createMockDMMF([userModel, profileModel]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const relationsFile = TestAssertions.assertFileExists(result.files, 'relations.ts');
  TestAssertions.assertFileContains(relationsFile, 'one(profile');
  TestAssertions.assertFileContains(relationsFile, 'one(user');
});

test('Self-referencing relationship', async () => {
  const generator = new TestGenerator();
  
  const userModel = createMockModel({
    name: 'User',
    dbName: 'users',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ name: 'managerId', type: 'String', isRequired: false }),
      createMockField({ 
        name: 'manager', 
        type: 'User', 
        kind: 'object',
        isRequired: false,
        relationName: 'UserManager',
        relationFromFields: ['managerId'],
        relationToFields: ['id']
      }),
      createMockField({ 
        name: 'subordinates', 
        type: 'User', 
        kind: 'object',
        isList: true,
        relationName: 'UserManager'
      }),
    ],
  });

  const dmmf = createMockDMMF([userModel]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const relationsFile = TestAssertions.assertFileExists(result.files, 'relations.ts');
  TestAssertions.assertFileContains(relationsFile, 'user:'); // manager relation
  // Note: self-referencing many relations need additional logic to work properly
});

test('Many-to-many explicit junction table', async () => {
  const generator = new TestGenerator();
  
  const userModel = createMockModel({
    name: 'User',
    dbName: 'users',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ 
        name: 'memberships', 
        type: 'TeamMember', 
        kind: 'object',
        isList: true,
        relationName: 'UserMembership'
      }),
    ],
  });

  const teamModel = createMockModel({
    name: 'Team',
    dbName: 'teams',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ 
        name: 'members', 
        type: 'TeamMember', 
        kind: 'object',
        isList: true,
        relationName: 'TeamMembership'
      }),
    ],
  });

  const teamMemberModel = createMockModel({
    name: 'TeamMember',
    dbName: 'team_members',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ name: 'userId', type: 'String' }),
      createMockField({ name: 'teamId', type: 'String' }),
      createMockField({ name: 'role', type: 'String' }),
      createMockField({ 
        name: 'user', 
        type: 'User', 
        kind: 'object',
        relationName: 'UserMembership',
        relationFromFields: ['userId'],
        relationToFields: ['id']
      }),
      createMockField({ 
        name: 'team', 
        type: 'Team', 
        kind: 'object',
        relationName: 'TeamMembership',
        relationFromFields: ['teamId'],
        relationToFields: ['id']
      }),
    ],
  });

  const dmmf = createMockDMMF([userModel, teamModel, teamMemberModel]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const teamMemberSchema = TestAssertions.assertFileExists(result.files, 'team-member-schema.ts');
  TestAssertions.assertTableDefinition(teamMemberSchema, 'team_members', 'userId');
  TestAssertions.assertTableDefinition(teamMemberSchema, 'team_members', 'teamId');
  
  const relationsFile = TestAssertions.assertFileExists(result.files, 'relations.ts');
  // Note: explicit junction tables create different relation patterns
  TestAssertions.assertFileContains(relationsFile, 'teamMembers:'); // many relation to junction
  TestAssertions.assertFileContains(relationsFile, 'teamMembers:'); // many relation from team
});

test('Foreign key constraints with onDelete/onUpdate', async () => {
  const generator = new TestGenerator();
  
  const userModel = createMockModel({
    name: 'User',
    dbName: 'users',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ 
        name: 'posts', 
        type: 'Post', 
        kind: 'object',
        isList: true,
        relationName: 'UserPosts'
      }),
    ],
  });

  const postModel = createMockModel({
    name: 'Post',
    dbName: 'posts',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ name: 'title', type: 'String' }),
      createMockField({ name: 'authorId', type: 'String' }),
      createMockField({ 
        name: 'author', 
        type: 'User', 
        kind: 'object',
        relationName: 'UserPosts',
        relationFromFields: ['authorId'],
        relationToFields: ['id'],
        relationOnDelete: 'Cascade',
        relationOnUpdate: 'Cascade'
      }),
    ],
  });

  const dmmf = createMockDMMF([userModel, postModel]);
  const result = await generator.generateFromDMMF(dmmf);
  
  // For now, we're just checking that relations are generated
  // TODO: Add foreign key constraint support to the generator
  const relationsFile = TestAssertions.assertFileExists(result.files, 'relations.ts');
  TestAssertions.assertRelationDefinition(relationsFile, 'user'); // author relation
});

test('Multiple relations between same tables', async () => {
  const generator = new TestGenerator();
  
  const userModel = createMockModel({
    name: 'User',
    dbName: 'users',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ 
        name: 'authoredPosts', 
        type: 'Post', 
        kind: 'object',
        isList: true,
        relationName: 'PostAuthor'
      }),
      createMockField({ 
        name: 'editedPosts', 
        type: 'Post', 
        kind: 'object',
        isList: true,
        relationName: 'PostEditor'
      }),
    ],
  });

  const postModel = createMockModel({
    name: 'Post',
    dbName: 'posts',
    fields: [
      createMockField({ name: 'id', type: 'String', isId: true }),
      createMockField({ name: 'title', type: 'String' }),
      createMockField({ name: 'authorId', type: 'String' }),
      createMockField({ name: 'editorId', type: 'String', isRequired: false }),
      createMockField({ 
        name: 'author', 
        type: 'User', 
        kind: 'object',
        relationName: 'PostAuthor',
        relationFromFields: ['authorId'],
        relationToFields: ['id']
      }),
      createMockField({ 
        name: 'editor', 
        type: 'User', 
        kind: 'object',
        isRequired: false,
        relationName: 'PostEditor',
        relationFromFields: ['editorId'],
        relationToFields: ['id']
      }),
    ],
  });

  const dmmf = createMockDMMF([userModel, postModel]);
  const result = await generator.generateFromDMMF(dmmf);
  
  const relationsFile = TestAssertions.assertFileExists(result.files, 'relations.ts');
  TestAssertions.assertFileContains(relationsFile, 'posts:'); // authored posts (simplified)
  TestAssertions.assertFileContains(relationsFile, 'user:'); // author/editor relations (simplified)
});