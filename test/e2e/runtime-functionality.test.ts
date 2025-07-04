import { test, expect, beforeAll, afterAll } from 'bun:test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { PrismaCLI, PrismaProjectManager } from './utils/prisma-cli.js';
import { DatabaseManager } from './utils/database.js';
import type { DatabaseConfig } from './utils/database.js';

const RUNTIME_TEST_SCHEMA = `
enum UserRole {
  ADMIN
  USER
  MODERATOR
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  posts     Post[]
  profile   Profile?
  @@map("users")
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  @@map("posts")
}

model Profile {
  id     String  @id @default(uuid())
  bio    String?
  userId String  @unique
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("profiles")
}

model Product {
  id    String @id @default(uuid())
  name  String
  /// @drizzle.type(type: "decimal", precision: 10, scale: 2)
  price Float
  @@map("products")
}

enum OrderStatus {
  PENDING
  COMPLETED
  CANCELLED
}

model Order {
  id        String      @id @default(uuid())
  /// @drizzle.default(value: "PENDING")
  status    OrderStatus @default(PENDING)
  createdAt DateTime    @default(now())
  @@map("orders")
}
`;

let dbConfig: DatabaseConfig;

beforeAll(async () => {
  // Check if Docker is available
  const dockerAvailable = await DatabaseManager.checkDockerAvailable();
  if (!dockerAvailable) {
    console.log('⚠️  Docker not available, skipping runtime tests');
    process.exit(0);
  }

  // Start test database
  console.log('🚀 Starting test database for runtime tests...');
  dbConfig = await DatabaseManager.startPostgres();
});

afterAll(async () => {
  if (dbConfig) {
    console.log('🧹 Cleaning up runtime test database...');
    await DatabaseManager.stopAllContainers();
  }
});

test('Runtime CRUD operations with generated Drizzle code', async () => {
  const projectSetup = await PrismaProjectManager.createProject(
    'runtime-test',
    RUNTIME_TEST_SCHEMA,
    dbConfig.databaseUrl
  );

  try {
    // Install dependencies
    await PrismaProjectManager.installDependencies(projectSetup.projectDir);

    // Build the generator
    const buildResult = await runCommand(process.cwd(), 'bun run build');
    expect(buildResult.success).toBe(true);

    const prismaCli = new PrismaCLI(projectSetup.projectDir);

    // Generate Drizzle schema
    const generateResult = await prismaCli.generate();
    expect(generateResult.success).toBe(true);

    // Push database schema
    const pushResult = await prismaCli.dbPush();
    expect(pushResult.success).toBe(true);

    // Create test script that uses the generated schema
    const testScript = `
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, posts, profiles, products, orders, userRoleEnum, orderStatusEnum } from './prisma/generated/drizzle/index.js';
import { eq, and } from 'drizzle-orm';

const client = postgres('${dbConfig.databaseUrl}');
const db = drizzle(client);

async function runTests() {
  console.log('🧪 Starting runtime tests...');
  
  try {
    // Test 1: Create a user
    console.log('1. Creating user...');
    const [newUser] = await db.insert(users).values({
      id: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER'
    }).returning();
    
    console.log('✅ User created:', newUser.email);
    
    // Test 2: Create a profile for the user
    console.log('2. Creating profile...');
    const [newProfile] = await db.insert(profiles).values({
      id: 'test-profile-1',
      userId: newUser.id,
      bio: 'This is a test bio'
    }).returning();
    
    console.log('✅ Profile created for user:', newProfile.userId);
    
    // Test 3: Create posts
    console.log('3. Creating posts...');
    const postsData = [
      {
        id: 'post-1',
        title: 'First Post',
        content: 'This is the first post content',
        authorId: newUser.id,
        published: true
      },
      {
        id: 'post-2', 
        title: 'Second Post',
        content: 'This is the second post content',
        authorId: newUser.id,
        published: false
      }
    ];
    
    const newPosts = await db.insert(posts).values(postsData).returning();
    console.log(\`✅ Created \${newPosts.length} posts\`);
    
    // Test 4: Query user with posts (test relations)
    console.log('4. Querying user with posts...');
    const userWithPosts = await db.select().from(users).where(eq(users.id, newUser.id));
    const userPosts = await db.select().from(posts).where(eq(posts.authorId, newUser.id));
    
    console.log(\`✅ User \${userWithPosts[0].email} has \${userPosts.length} posts\`);
    
    // Test 5: Update operations
    console.log('5. Testing updates...');
    await db.update(users)
      .set({ name: 'Updated Test User' })
      .where(eq(users.id, newUser.id));
      
    const updatedUser = await db.select().from(users).where(eq(users.id, newUser.id));
    console.log('✅ User updated:', updatedUser[0].name);
    
    // Test 6: Delete operations with cascade
    console.log('6. Testing cascade delete...');
    await db.delete(users).where(eq(users.id, newUser.id));
    
    const remainingPosts = await db.select().from(posts).where(eq(posts.authorId, newUser.id));
    const remainingProfile = await db.select().from(profiles).where(eq(profiles.userId, newUser.id));
    
    console.log(\`✅ After user deletion: \${remainingPosts.length} posts, \${remainingProfile.length} profiles remaining\`);
    
    // Test 7: Enum validation
    console.log('7. Testing enum values...');
    const [adminUser] = await db.insert(users).values({
      id: 'admin-user',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN'
    }).returning();
    
    console.log('✅ Admin user created with role:', adminUser.role);
    
    await db.delete(users).where(eq(users.id, adminUser.id));

    // Test 8: Custom type directive (@drizzle.type)
    console.log('8. Testing @drizzle.type directive...');
    const [newProduct] = await db.insert(products).values({
      id: 'test-product-1',
      name: 'Test Product',
      price: '123.45' // Drizzle expects string for decimal
    }).returning();

    const productColumnInfo = await db.execute(sql`
      SELECT data_type, numeric_precision, numeric_scale
      FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'price';
    `);

    if (productColumnInfo.rows.length > 0) {
      const column = productColumnInfo.rows[0];
      console.log(`✅ Product price column type: ${column.data_type}, precision: ${column.numeric_precision}, scale: ${column.numeric_scale}`);
      if (column.data_type !== 'numeric' || column.numeric_precision !== 10 || column.numeric_scale !== 2) {
        throw new Error(`Expected price column to be numeric(10,2), but got ${column.data_type}(${column.numeric_precision},${column.numeric_scale})`);
      }
    } else {
      throw new Error('Product price column not found in information_schema.');
    }
    console.log('✅ @drizzle.type directive for Product.price validated.');

    // Test 9: Custom default directive (@drizzle.default)
    console.log('9. Testing @drizzle.default directive...');
    const [newOrder] = await db.insert(orders).values({
      id: 'test-order-1'
      // status is intentionally omitted to test default
    }).returning();

    if (newOrder.status !== 'PENDING') {
      throw new Error(`Expected order status to be PENDING, but got ${newOrder.status}`);
    }
    console.log('✅ @drizzle.default directive for Order.status validated.');
    
    console.log('🎉 All runtime tests passed!');
    
  } catch (error) {
    console.error('❌ Runtime test failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runTests();
`;

    // Write the test script
    const testScriptPath = path.join(projectSetup.projectDir, 'runtime-test.js');
    await fs.writeFile(testScriptPath, testScript);

    // Run the runtime test script
    console.log('🧪 Running runtime functionality test...');
    const runtimeResult = await runCommand(projectSetup.projectDir, 'node runtime-test.js');
    
    if (!runtimeResult.success) {
      console.error('Runtime test output:', runtimeResult.output);
      console.error('Runtime test error:', runtimeResult.error);
    }
    
    expect(runtimeResult.success).toBe(true);
    expect(runtimeResult.output).toContain('All runtime tests passed!');

    console.log('✅ Runtime functionality test completed successfully');

  } finally {
    await PrismaProjectManager.cleanupProject(projectSetup.projectDir);
  }
}, 180000);

test('Relationship queries and joins', async () => {
  const projectSetup = await PrismaProjectManager.createProject(
    'relations-test',
    RUNTIME_TEST_SCHEMA,
    dbConfig.databaseUrl
  );

  try {
    // Install dependencies  
    await PrismaProjectManager.installDependencies(projectSetup.projectDir);

    const prismaCli = new PrismaCLI(projectSetup.projectDir);

    // Generate and push schema
    await prismaCli.generate();
    await prismaCli.dbPush();

    // Create relationship test script
    const relationScript = `
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, posts, profiles } from './prisma/generated/drizzle/index.js';
import { eq, desc, count } from 'drizzle-orm';

const client = postgres('${dbConfig.databaseUrl}');
const db = drizzle(client);

async function testRelations() {
  console.log('🔗 Testing relationship queries...');
  
  try {
    // Setup test data
    const [user1] = await db.insert(users).values({
      id: 'rel-user-1',
      email: 'user1@example.com',
      name: 'User One'
    }).returning();
    
    const [user2] = await db.insert(users).values({
      id: 'rel-user-2', 
      email: 'user2@example.com',
      name: 'User Two'
    }).returning();
    
    // Create profiles
    await db.insert(profiles).values([
      { id: 'profile-1', userId: user1.id, bio: 'Bio for User One' },
      { id: 'profile-2', userId: user2.id, bio: 'Bio for User Two' }
    ]);
    
    // Create posts
    await db.insert(posts).values([
      { id: 'post-1', title: 'Post 1', authorId: user1.id, published: true },
      { id: 'post-2', title: 'Post 2', authorId: user1.id, published: false },
      { id: 'post-3', title: 'Post 3', authorId: user2.id, published: true }
    ]);
    
    // Test 1: Join users with profiles
    console.log('1. Testing user-profile joins...');
    const usersWithProfiles = await db
      .select({
        userId: users.id,
        userName: users.name,
        userEmail: users.email,
        profileBio: profiles.bio
      })
      .from(users)
      .leftJoin(profiles, eq(users.id, profiles.userId));
      
    console.log(\`✅ Found \${usersWithProfiles.length} user-profile combinations\`);
    
    // Test 2: Join users with posts
    console.log('2. Testing user-post joins...');
    const usersWithPosts = await db
      .select({
        userId: users.id,
        userName: users.name,
        postId: posts.id,
        postTitle: posts.title,
        published: posts.published
      })
      .from(users)
      .leftJoin(posts, eq(users.id, posts.authorId))
      .orderBy(users.name, posts.title);
      
    console.log(\`✅ Found \${usersWithPosts.length} user-post combinations\`);
    
    // Test 3: Aggregate queries
    console.log('3. Testing aggregate queries...');
    const postCounts = await db
      .select({
        userId: users.id,
        userName: users.name,
        postCount: count(posts.id)
      })
      .from(users)
      .leftJoin(posts, eq(users.id, posts.authorId))
      .groupBy(users.id, users.name);
      
    console.log(\`✅ Post counts calculated for \${postCounts.length} users\`);
    
    // Test 4: Complex query with multiple joins
    console.log('4. Testing complex multi-join query...');
    const fullUserData = await db
      .select({
        userId: users.id,
        userName: users.name,
        userEmail: users.email,
        profileBio: profiles.bio,
        postTitle: posts.title,
        postPublished: posts.published
      })
      .from(users)
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .leftJoin(posts, eq(users.id, posts.authorId))
      .where(eq(posts.published, true));
      
    console.log(\`✅ Complex query returned \${fullUserData.length} rows\`);
    
    // Cleanup
    await db.delete(posts);
    await db.delete(profiles);
    await db.delete(users);
    
    console.log('🎉 All relationship tests passed!');
    
  } catch (error) {
    console.error('❌ Relationship test failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

testRelations();
`;

    const relationScriptPath = path.join(projectSetup.projectDir, 'relation-test.js');
    await fs.writeFile(relationScriptPath, relationScript);

    // Run the relationship test
    const relationResult = await runCommand(projectSetup.projectDir, 'node relation-test.js');
    
    if (!relationResult.success) {
      console.error('Relation test output:', relationResult.output);
      console.error('Relation test error:', relationResult.error);
    }
    
    expect(relationResult.success).toBe(true);
    expect(relationResult.output).toContain('All relationship tests passed!');

    console.log('✅ Relationship queries test completed successfully');

  } finally {
    await PrismaProjectManager.cleanupProject(projectSetup.projectDir);
  }
}, 180000);

// Helper function
async function runCommand(cwd: string, command: string): Promise<{ success: boolean; output: string; error?: string }> {
  const { spawn } = await import('node:child_process');
  
  return new Promise((resolve) => {
    const [cmd, ...args] = command.split(' ');
    if (!cmd) {
      resolve({ success: false, output: '', error: 'No command provided' });
      return;
    }
    
    const childProcess = spawn(cmd, args, {
      cwd,
      stdio: 'pipe'
    });

    let output = '';
    let error = '';

    childProcess.stdout.on('data', (data: Buffer) => {
      output += data.toString();
    });

    childProcess.stderr.on('data', (data: Buffer) => {
      error += data.toString();
    });

    childProcess.on('close', (code: number | null) => {
      resolve({
        success: code === 0,
        output,
        error: code !== 0 ? error : undefined
      });
    });
  });
}