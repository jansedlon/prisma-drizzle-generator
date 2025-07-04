import { test, expect, beforeAll, afterAll } from 'bun:test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { PrismaCLI, PrismaProjectManager } from './utils/prisma-cli.js';
import { DatabaseManager } from './utils/database.js';
import type { DatabaseConfig } from './utils/database.js';

const CONFIG_TEST_SCHEMA = `
model User {
  id    String @id @default(uuid())
  email String @unique
  name  String?
  posts Post[]
  @@map("users")
}

model Post {
  id       String @id @default(uuid())
  title    String
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
  @@map("posts")
}
`;

let dbConfig: DatabaseConfig;

beforeAll(async () => {
  const dockerAvailable = await DatabaseManager.checkDockerAvailable();
  if (!dockerAvailable) {
    console.log('⚠️  Docker not available, skipping config options tests');
    process.exit(0);
  }

  console.log('🚀 Starting test database for config options tests...');
  dbConfig = await DatabaseManager.startPostgres();
});

afterAll(async () => {
  if (dbConfig) {
    console.log('🧹 Cleaning up config options test database...');
    await DatabaseManager.stopAllContainers();
  }
});

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

test('Generator with moduleResolution: node', async () => {
  const projectSetup = await PrismaProjectManager.createProject(
    'module-node-test',
    CONFIG_TEST_SCHEMA,
    dbConfig.databaseUrl,
    { moduleResolution: 'node' }
  );

  try {
    await PrismaProjectManager.installDependencies(projectSetup.projectDir);
    const prismaCli = new PrismaCLI(projectSetup.projectDir);

    const generateResult = await prismaCli.generate();
    expect(generateResult.success).toBe(true);

    const indexContent = await fs.readFile(
      path.join(projectSetup.generatedPath, 'index.ts'),
      'utf-8'
    );
    expect(indexContent).toContain('./user-schema.js'); // Should have .js extension
    expect(indexContent).toContain('./relations.js');

    console.log('✅ moduleResolution: node test passed');

  } finally {
    await PrismaProjectManager.cleanupProject(projectSetup.projectDir);
  }
}, 120000);

test('Generator with moduleResolution: bundler', async () => {
  const projectSetup = await PrismaProjectManager.createProject(
    'module-bundler-test',
    CONFIG_TEST_SCHEMA,
    dbConfig.databaseUrl,
    { moduleResolution: 'bundler' }
  );

  try {
    await PrismaProjectManager.installDependencies(projectSetup.projectDir);
    const prismaCli = new PrismaCLI(projectSetup.projectDir);

    const generateResult = await prismaCli.generate();
    expect(generateResult.success).toBe(true);

    const indexContent = await fs.readFile(
      path.join(projectSetup.generatedPath, 'index.ts'),
      'utf-8'
    );
    expect(indexContent).toContain('./user-schema.js'); // Should have .js extension
    expect(indexContent).toContain('./relations.js');

    console.log('✅ moduleResolution: bundler test passed');

  } finally {
    await PrismaProjectManager.cleanupProject(projectSetup.projectDir);
  }
}, 120000);

test('Generator with formatter: prettier', async () => {
  const projectSetup = await PrismaProjectManager.createProject(
    'formatter-prettier-test',
    CONFIG_TEST_SCHEMA,
    dbConfig.databaseUrl,
    { formatter: 'prettier' }
  );

  try {
    await PrismaProjectManager.installDependencies(projectSetup.projectDir);
    const prismaCli = new PrismaCLI(projectSetup.projectDir);

    const generateResult = await prismaCli.generate();
    expect(generateResult.success).toBe(true);

    // Check if prettier was applied (simple check, more robust would be to run prettier and compare)
    const userSchemaContent = await fs.readFile(
      path.join(projectSetup.generatedPath, 'user-schema.ts'),
      'utf-8'
    );
    // Prettier typically uses single quotes by default, and specific indentation
    expect(userSchemaContent).toMatch(/import { .* } from 'drizzle-orm\/pg-core';/);
    expect(userSchemaContent).toContain("  id: text('id').primaryKey().default(crypto.randomUUID()),");

    console.log('✅ formatter: prettier test passed');

  } finally {
    await PrismaProjectManager.cleanupProject(projectSetup.projectDir);
  }
}, 120000);

test('Generator with formatter: biome', async () => {
  const projectSetup = await PrismaProjectManager.createProject(
    'formatter-biome-test',
    CONFIG_TEST_SCHEMA,
    dbConfig.databaseUrl,
    { formatter: 'biome' }
  );

  try {
    await PrismaProjectManager.installDependencies(projectSetup.projectDir);
    const prismaCli = new PrismaCLI(projectSetup.projectDir);

    const generateResult = await prismaCli.generate();
    expect(generateResult.success).toBe(true);

    // Check if biome was applied
    const userSchemaContent = await fs.readFile(
      path.join(projectSetup.generatedPath, 'user-schema.ts'),
      'utf-8'
    );
    // Biome typically uses double quotes by default, and specific indentation
    expect(userSchemaContent).toMatch(/import .* from ".*drizzle-orm\/pg-core";/);
    expect(userSchemaContent).toContain("  id: text(\"id\").primaryKey().default(\"crypto.randomUUID()\"),");

    console.log('✅ formatter: biome test passed');

  } finally {
    await PrismaProjectManager.cleanupProject(projectSetup.projectDir);
  }
}, 120000);

test('Generator with formatter: none', async () => {
  const projectSetup = await PrismaProjectManager.createProject(
    'formatter-none-test',
    CONFIG_TEST_SCHEMA,
    dbConfig.databaseUrl,
    { formatter: 'none' }
  );

  try {
    await PrismaProjectManager.installDependencies(projectSetup.projectDir);
    const prismaCli = new PrismaCLI(projectSetup.projectDir);

    const generateResult = await prismaCli.generate();
    expect(generateResult.success).toBe(true);

    // With no formatter, the output might be less consistent. 
    // We'll just check for basic content without strict formatting expectations.
    const userSchemaContent = await fs.readFile(
      path.join(projectSetup.generatedPath, 'user-schema.ts'),
      'utf-8'
    );
    expect(userSchemaContent).toContain("pgTable('users', {");

    console.log('✅ formatter: none test passed');

  } finally {
    await PrismaProjectManager.cleanupProject(projectSetup.projectDir);
  }
}, 120000);
