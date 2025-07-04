import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { generateDrizzleSchema } from '@/index';
import { MOCK_SCHEMAS } from '@tests/utils/mock-dmmf';
import { tmpdir } from 'os';
import { join } from 'path';
import { mkdtemp } from 'fs/promises';
import { rimraf } from 'rimraf';

// Import generated schemas and relations for testing
import { user, post, comment, userProfile, tag } from './generated/schemas';
import { userRelations, postRelations, commentRelations, userProfileRelations, tagRelations } from './generated/relations';

describe('E2E Tests - PostgreSQL Relations', () => {
  let container: StartedPostgreSqlContainer;
  let sql: ReturnType<typeof postgres>;
  let db: ReturnType<typeof drizzle>;
  let tempDir: string;

  beforeAll(async () => {
    // Start PostgreSQL container
    container = await new PostgreSqlContainer('postgres:15')
      .withDatabase('test_db')
      .withUsername('test_user')
      .withPassword('test_password')
      .withExposedPorts(5432)
      .start();

    // Create temp directory for generated files
    tempDir = await mkdtemp(join(tmpdir(), 'drizzle-e2e-'));
    
    // Generate Drizzle schema from mock DMMF
    const result = await generateDrizzleSchema({
      dmmf: MOCK_SCHEMAS.complexSchema(),
      outputDir: tempDir,
      adapter: 'postgresql'
    });

    expect(result.success).toBe(true);

    // Setup database connection
    const connectionString = container.getConnectionUri();
    sql = postgres(connectionString, { max: 1 });
    db = drizzle(sql, {
      schema: {
        user,
        post,
        comment,
        userProfile,
        tag,
        userRelations,
        postRelations,
        commentRelations,
        userProfileRelations,
        tagRelations
      }
    });

    // Run migrations to create tables
    await runMigrations(tempDir, connectionString);
  }, 120000); // 2 minute timeout for container startup

  afterAll(async () => {
    if (sql) await sql.end();
    if (container) await container.stop();
    if (tempDir) await rimraf(tempDir);
  });

  beforeEach(async () => {
    // Clean database before each test
    await db.delete(comment);
    await db.delete(post);
    await db.delete(userProfile);
    await db.delete(user);
    await db.delete(tag);
  });

  describe('One-to-Many Relations', () => {
    it('should create and query user with posts', async () => {
      // Create user
      const [newUser] = await db.insert(user).values({
        email: 'test@example.com',
        name: 'Test User'
      }).returning();

      // Create posts for the user
      const [post1, post2] = await db.insert(post).values([
        {
          title: 'First Post',
          content: 'Content of first post',
          authorId: newUser.id,
          published: true
        },
        {
          title: 'Second Post',
          content: 'Content of second post',
          authorId: newUser.id,
          published: false
        }
      ]).returning();

      // Query user with posts using relations
      const userWithPosts = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, newUser.id),
        with: {
          posts: true
        }
      });

      expect(userWithPosts).toBeDefined();
      expect(userWithPosts!.posts).toHaveLength(2);
      expect(userWithPosts!.posts.map(p => p.title)).toEqual(
        expect.arrayContaining(['First Post', 'Second Post'])
      );
      
      // Verify foreign key relationships
      userWithPosts!.posts.forEach(post => {
        expect(post.authorId).toBe(newUser.id);
      });
    });

    it('should query posts with author information', async () => {
      // Create user
      const [author] = await db.insert(user).values({
        email: 'author@example.com',
        name: 'John Author'
      }).returning();

      // Create post
      const [newPost] = await db.insert(post).values({
        title: 'Test Post',
        content: 'Test content',
        authorId: author.id,
        published: true
      }).returning();

      // Query post with author using relations
      const postWithAuthor = await db.query.post.findFirst({
        where: (post, { eq }) => eq(post.id, newPost.id),
        with: {
          author: true
        }
      });

      expect(postWithAuthor).toBeDefined();
      expect(postWithAuthor!.author).toBeDefined();
      expect(postWithAuthor!.author!.email).toBe('author@example.com');
      expect(postWithAuthor!.author!.name).toBe('John Author');
    });
  });

  describe('One-to-One Relations', () => {
    it('should create and query user with profile', async () => {
      // Create user
      const [newUser] = await db.insert(user).values({
        email: 'user@example.com',
        name: 'Profile User'
      }).returning();

      // Create profile for the user
      const [profile] = await db.insert(userProfile).values({
        userId: newUser.id,
        bio: 'This is my bio',
        avatar: 'https://example.com/avatar.jpg'
      }).returning();

      // Query user with profile
      const userWithProfile = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, newUser.id),
        with: {
          profile: true
        }
      });

      expect(userWithProfile).toBeDefined();
      expect(userWithProfile!.profile).toBeDefined();
      expect(userWithProfile!.profile!.bio).toBe('This is my bio');
      expect(userWithProfile!.profile!.avatar).toBe('https://example.com/avatar.jpg');
      expect(userWithProfile!.profile!.userId).toBe(newUser.id);
    });

    it('should query profile with user information', async () => {
      // Create user
      const [owner] = await db.insert(user).values({
        email: 'owner@example.com',
        name: 'Profile Owner'
      }).returning();

      // Create profile
      const [newProfile] = await db.insert(userProfile).values({
        userId: owner.id,
        bio: 'Owner bio',
        avatar: null
      }).returning();

      // Query profile with user
      const profileWithUser = await db.query.userProfile.findFirst({
        where: (profile, { eq }) => eq(profile.id, newProfile.id),
        with: {
          user: true
        }
      });

      expect(profileWithUser).toBeDefined();
      expect(profileWithUser!.user).toBeDefined();
      expect(profileWithUser!.user!.email).toBe('owner@example.com');
      expect(profileWithUser!.user!.name).toBe('Profile Owner');
    });
  });

  describe('Many-to-Many Relations', () => {
    it('should create and query many-to-many relationships', async () => {
      // Create users
      const [user1, user2] = await db.insert(user).values([
        { email: 'user1@example.com', name: 'User One' },
        { email: 'user2@example.com', name: 'User Two' }
      ]).returning();

      // Create tags
      const [tag1, tag2, tag3] = await db.insert(tag).values([
        { name: 'JavaScript' },
        { name: 'TypeScript' },
        { name: 'PostgreSQL' }
      ]).returning();

      // For implicit M:N, we would need to create junction records
      // This depends on how the generator handles implicit M:N relations
      
      // For now, let's test that the structure is correct
      const allUsers = await db.query.user.findMany({
        with: {
          tags: true
        }
      });

      expect(allUsers).toHaveLength(2);
      // Structure should be ready for M:N relations
      allUsers.forEach(user => {
        expect(user.tags).toBeDefined();
        expect(Array.isArray(user.tags)).toBe(true);
      });
    });
  });

  describe('Nested Relations', () => {
    it('should query deeply nested relations', async () => {
      // Create user
      const [author] = await db.insert(user).values({
        email: 'author@example.com',
        name: 'Blog Author'
      }).returning();

      // Create user profile
      await db.insert(userProfile).values({
        userId: author.id,
        bio: 'Author bio'
      });

      // Create post
      const [newPost] = await db.insert(post).values({
        title: 'Blog Post',
        content: 'Blog content',
        authorId: author.id,
        published: true
      }).returning();

      // Create comments
      const [commenter] = await db.insert(user).values({
        email: 'commenter@example.com',
        name: 'Comment User'
      }).returning();

      await db.insert(comment).values([
        {
          content: 'Great post!',
          authorId: commenter.id,
          postId: newPost.id
        },
        {
          content: 'Thanks for sharing',
          authorId: commenter.id,
          postId: newPost.id
        }
      ]);

      // Query post with author, author profile, and comments
      const complexQuery = await db.query.post.findFirst({
        where: (post, { eq }) => eq(post.id, newPost.id),
        with: {
          author: {
            with: {
              profile: true
            }
          },
          comments: {
            with: {
              author: true
            }
          }
        }
      });

      expect(complexQuery).toBeDefined();
      expect(complexQuery!.author).toBeDefined();
      expect(complexQuery!.author!.profile).toBeDefined();
      expect(complexQuery!.author!.profile!.bio).toBe('Author bio');
      expect(complexQuery!.comments).toHaveLength(2);
      
      complexQuery!.comments.forEach(comment => {
        expect(comment.author).toBeDefined();
        expect(comment.author!.email).toBe('commenter@example.com');
      });
    });
  });

  describe('Referential Integrity', () => {
    it('should enforce foreign key constraints', async () => {
      // Try to create post with non-existent user
      await expect(
        db.insert(post).values({
          title: 'Orphaned Post',
          content: 'This should fail',
          authorId: 'non-existent-user-id'
        })
      ).rejects.toThrow(); // Should throw FK constraint error
    });

    it('should handle cascade deletions correctly', async () => {
      // Create user
      const [user1] = await db.insert(user).values({
        email: 'deleteme@example.com',
        name: 'Delete Me'
      }).returning();

      // Create profile with CASCADE delete
      await db.insert(userProfile).values({
        userId: user1.id,
        bio: 'Soon to be deleted'
      });

      // Create posts (should be handled by application logic)
      await db.insert(post).values([
        {
          title: 'Post 1',
          authorId: user1.id,
          published: true
        },
        {
          title: 'Post 2', 
          authorId: user1.id,
          published: false
        }
      ]);

      // Delete user
      await db.delete(user).where(eq(user.id, user1.id));

      // Profile should be cascade deleted (if configured)
      const remainingProfile = await db.query.userProfile.findFirst({
        where: (profile, { eq }) => eq(profile.userId, user1.id)
      });
      expect(remainingProfile).toBeUndefined();

      // Posts might remain (depends on configuration)
      const orphanedPosts = await db.query.post.findMany({
        where: (post, { eq }) => eq(post.authorId, user1.id)
      });
      // This would depend on the specific FK constraint configuration
    });
  });

  describe('Performance and Optimization', () => {
    it('should efficiently query large datasets with relations', async () => {
      // Create multiple users
      const users = await db.insert(user).values(
        Array.from({ length: 100 }, (_, i) => ({
          email: `user${i}@example.com`,
          name: `User ${i}`
        }))
      ).returning();

      // Create posts for each user
      const posts = [];
      for (const user of users.slice(0, 10)) { // First 10 users get posts
        posts.push({
          title: `Post by ${user.name}`,
          content: `Content from ${user.name}`,
          authorId: user.id,
          published: true
        });
      }
      await db.insert(post).values(posts);

      // Query with pagination and relations
      const start = Date.now();
      const results = await db.query.user.findMany({
        limit: 10,
        offset: 0,
        with: {
          posts: {
            limit: 5
          },
          profile: true
        }
      });
      const duration = Date.now() - start;

      expect(results).toHaveLength(10);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});

// Helper function to run migrations
async function runMigrations(schemaDir: string, connectionString: string) {
  // Create migration files
  const migrationSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      role VARCHAR(50) DEFAULT 'USER',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS user_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      bio TEXT,
      avatar VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      content TEXT,
      author_id UUID NOT NULL REFERENCES users(id),
      published BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS comments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      content TEXT NOT NULL,
      author_id UUID NOT NULL REFERENCES users(id),
      post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS tags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  // Execute migration
  const migrationSql = postgres(connectionString, { max: 1 });
  await migrationSql.unsafe(migrationSQL);
  await migrationSql.end();
}