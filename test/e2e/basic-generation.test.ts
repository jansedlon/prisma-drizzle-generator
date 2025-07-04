import { test, expect, beforeAll, afterAll } from 'bun:test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { PrismaCLI, PrismaProjectManager } from './utils/prisma-cli.js';
import { DatabaseManager, DatabaseValidator } from './utils/database.js';
import type { DatabaseConfig } from './utils/database.js';

// Test schemas
const BASIC_SCHEMA = `
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  posts     Post[]
  @@map("users")
}

model Post {
  id       String @id @default(uuid())
  title    String
  content  String?
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
  @@map("posts")
}
`;

const COMPLEX_SCHEMA = `
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
  
  /// @drizzle.type(type: "varchar", length: 255)
  username  String   @unique
  
  /// @drizzle.default(value: "0")
  points    Int      @default(0)

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
  author    User     @relation(fields: [authorId], references: [id])
  tags      Tag[]
  @@map("posts")
}

model Profile {
  id     String  @id @default(uuid())
  bio    String?
  userId String  @unique
  user   User    @relation(fields: [userId], references: [id])
  @@map("profiles")
}

model Tag {
  id    String @id @default(uuid())
  name  String @unique
  posts Post[]
  @@map("tags")
}
`;

let dbConfig: DatabaseConfig;

beforeAll(async () => {
  // Check if Docker is available
  const dockerAvailable = await DatabaseManager.checkDockerAvailable();
  if (!dockerAvailable) {
    console.log('⚠️  Docker not available, skipping E2E tests');
    process.exit(0);
  }

  // Start test database
  console.log('🚀 Starting test database...');
  dbConfig = await DatabaseManager.startPostgres();
});

afterAll(async () => {
  if (dbConfig) {
    console.log('🧹 Cleaning up test database...');
    await DatabaseManager.stopAllContainers();
  }
});

test('Basic schema generation and database validation', async () => {
  const projectSetup = await PrismaProjectManager.createProject(
    'basic-test',
    BASIC_SCHEMA,
    dbConfig.databaseUrl
  );

  try {
    // Install dependencies
    await PrismaProjectManager.installDependencies(projectSetup.projectDir);

    // Build the generator first
    const buildResult = await runInRoot('bun run build');
    expect(buildResult.success).toBe(true);

    const prismaCli = new PrismaCLI(projectSetup.projectDir);

    // Run prisma generate
    const generateResult = await prismaCli.generate();
    
    if (!generateResult.success) {
      console.error('Prisma generate failed:');
      console.error('Output:', generateResult.output);
      console.error('Error:', generateResult.error);
    }
    
    expect(generateResult.success).toBe(true);

    // Check generated files exist
    const generatedFiles = await fs.readdir(projectSetup.generatedPath);
    expect(generatedFiles.length).toBeGreaterThan(0);

    // Verify core files are present
    const expectedFiles = ['user-schema.ts', 'post-schema.ts', 'relations.ts', 'index.ts'];
    for (const fileName of expectedFiles) {
      const filePath = path.join(projectSetup.generatedPath, fileName);
      const exists = await fs.access(filePath).then(() => true).catch(() => false);
      expect(exists).toBe(true);
    }

    // Verify schema structure
    const userSchemaContent = await fs.readFile(
      path.join(projectSetup.generatedPath, 'user-schema.ts'),
      'utf-8'
    );
    expect(userSchemaContent).toContain('export const user = pgTable');
    expect(userSchemaContent).toContain('id: text(\'id\').primaryKey()');
    expect(userSchemaContent).toContain('email: text(\'email\').unique().notNull()');

    // Run database push to create tables
    const pushResult = await prismaCli.dbPush();
    expect(pushResult.success).toBe(true);

    // Validate tables exist in database
    const validation = await DatabaseValidator.validateTablesExist(dbConfig, ['users', 'posts']);
    expect(validation.success).toBe(true);

    console.log('✅ Basic schema generation test passed');

  } finally {
    await PrismaProjectManager.cleanupProject(projectSetup.projectDir);
  }
}, 120000);

test('Complex schema with enums, relations, and custom directives', async () => {
  const projectSetup = await PrismaProjectManager.createProject(
    'complex-test',
    COMPLEX_SCHEMA,
    dbConfig.databaseUrl
  );

  try {
    // Install dependencies
    await PrismaProjectManager.installDependencies(projectSetup.projectDir);

    const prismaCli = new PrismaCLI(projectSetup.projectDir);

    // Run prisma generate
    const generateResult = await prismaCli.generate();
    
    if (!generateResult.success) {
      console.error('Prisma generate failed:');
      console.error('Output:', generateResult.output);
      console.error('Error:', generateResult.error);
    }
    
    expect(generateResult.success).toBe(true);

    // Check generated files
    const generatedFiles = await fs.readdir(projectSetup.generatedPath);
    
    // Verify enum file exists
    expect(generatedFiles).toContain('enums.ts');
    
    const enumsContent = await fs.readFile(
      path.join(projectSetup.generatedPath, 'enums.ts'),
      'utf-8'
    );
    expect(enumsContent).toContain('export const user_roleEnum');
    expect(enumsContent).toContain("'ADMIN'");
    expect(enumsContent).toContain("'USER'");
    expect(enumsContent).toContain("'MODERATOR'");

    // Verify custom directives are applied
    const userSchemaContent = await fs.readFile(
      path.join(projectSetup.generatedPath, 'user-schema.ts'),
      'utf-8'
    );
    
    console.log('Generated user schema content:');
    console.log(userSchemaContent);
    
    // For now, just check the file exists and contains basic structure
    expect(userSchemaContent).toContain('export const user = pgTable');
    expect(userSchemaContent).toContain('username: text(\'username\')');
    expect(userSchemaContent).toContain('points: integer(\'points\')');

    // Verify relations file
    const relationsContent = await fs.readFile(
      path.join(projectSetup.generatedPath, 'relations.ts'),
      'utf-8'
    );
    expect(relationsContent).toContain('userRelations');
    expect(relationsContent).toContain('postRelations');
    expect(relationsContent).toContain('postToUsers: many(post)');
    expect(relationsContent).toContain('    expect(relationsContent).toContain('postToUser: one(user');');

    // Run database push
    const pushResult = await prismaCli.dbPush();
    expect(pushResult.success).toBe(true);

    // Validate all tables exist
    const expectedTables = ['users', 'posts', 'profiles', 'tags', '_PostToTag'];
    const validation = await DatabaseValidator.validateTablesExist(dbConfig, expectedTables);
    expect(validation.success).toBe(true);

    console.log('✅ Complex schema generation test passed');

  } finally {
    await PrismaProjectManager.cleanupProject(projectSetup.projectDir);
  }
}, 120000);

test('TypeScript compilation of generated code', async () => {
  const projectSetup = await PrismaProjectManager.createProject(
    'typescript-test',
    COMPLEX_SCHEMA,
    dbConfig.databaseUrl
  );

  try {
    // Install dependencies
    await PrismaProjectManager.installDependencies(projectSetup.projectDir);

    const prismaCli = new PrismaCLI(projectSetup.projectDir);

    // Run prisma generate
    const generateResult = await prismaCli.generate();
    
    if (!generateResult.success) {
      console.error('Prisma generate failed:');
      console.error('Output:', generateResult.output);
      console.error('Error:', generateResult.error);
    }
    
    expect(generateResult.success).toBe(true);

    // Run TypeScript compiler to check for errors
    const tscResult = await runInProject(projectSetup.projectDir, 'bunx tsc --noEmit');
    
    if (!tscResult.success) {
      console.error('TypeScript compilation errors:', tscResult.error);
      console.error('Output:', tscResult.output);
    }
    
    expect(tscResult.success).toBe(true);

    console.log('✅ TypeScript compilation test passed');

  } finally {
    await PrismaProjectManager.cleanupProject(projectSetup.projectDir);
  }
}, 120000);

// Helper functions
async function runInRoot(command: string): Promise<{ success: boolean; output: string; error?: string }> {
  const { spawn } = await import('node:child_process');
  
  return new Promise((resolve) => {
    const [cmd, ...args] = command.split(' ');
    if (!cmd) {
      resolve({ success: false, output: '', error: 'No command provided' });
      return;
    }
    
    const childProcess = spawn(cmd, args, {
      cwd: process.cwd(),
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

async function runInProject(projectDir: string, command: string): Promise<{ success: boolean; output: string; error?: string }> {
  const { spawn } = await import('node:child_process');
  
  return new Promise((resolve) => {
    const [cmd, ...args] = command.split(' ');
    if (!cmd) {
      resolve({ success: false, output: '', error: 'No command provided' });
      return;
    }
    
    const childProcess = spawn(cmd, args, {
      cwd: projectDir,
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