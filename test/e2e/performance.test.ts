import { test, expect, beforeAll, afterAll } from 'bun:test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { PrismaCLI, PrismaProjectManager } from './utils/prisma-cli.js';
import { DatabaseManager } from './utils/database.js';
import type { DatabaseConfig } from './utils/database.js';

// Large schema for performance testing
const LARGE_SCHEMA = `
enum Status {
  ACTIVE
  INACTIVE
  PENDING
  ARCHIVED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

model User {
  id          String   @id @default(uuid())
  email       String   @unique
  username    String   @unique
  firstName   String
  lastName    String
  status      Status   @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  lastLoginAt DateTime?
  
  profile     UserProfile?
  posts       Post[]
  comments    Comment[]
  likes       Like[]
  followers   Follow[] @relation("UserFollows")
  following   Follow[] @relation("UserFollowing")
  teams       TeamMember[]
  projects    ProjectMember[]
  tasks       Task[]
  notifications Notification[]
  
  @@map("users")
}

model UserProfile {
  id        String   @id @default(uuid())
  userId    String   @unique
  bio       String?
  avatar    String?
  website   String?
  location  String?
  birthDate DateTime?
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("user_profiles")
}

model Post {
  id          String   @id @default(uuid())
  title       String
  content     String
  excerpt     String?
  slug        String   @unique
  published   Boolean  @default(false)
  publishedAt DateTime?
  authorId    String
  categoryId  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  author      User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  category    Category?  @relation(fields: [categoryId], references: [id])
  comments    Comment[]
  likes       Like[]
  tags        PostTag[]
  
  @@map("posts")
}

model Category {
  id          String   @id @default(uuid())
  name        String   @unique
  slug        String   @unique
  description String?
  parentId    String?
  
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  posts       Post[]
  
  @@map("categories")
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  postId    String
  authorId  String
  parentId  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
  likes     Like[]
  
  @@map("comments")
}

model Like {
  id        String   @id @default(uuid())
  userId    String
  postId    String?
  commentId String?
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  comment   Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)
  
  @@unique([userId, postId])
  @@unique([userId, commentId])
  @@map("likes")
}

model Tag {
  id    String @id @default(uuid())
  name  String @unique
  slug  String @unique
  color String?
  
  posts PostTag[]
  
  @@map("tags")
}

model PostTag {
  postId String
  tagId  String
  
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([postId, tagId])
  @@map("post_tags")
}

model Follow {
  id          String   @id @default(uuid())
  followerId  String
  followingId String
  createdAt   DateTime @default(now())
  
  follower    User     @relation("UserFollows", fields: [followerId], references: [id], onDelete: Cascade)
  following   User     @relation("UserFollowing", fields: [followingId], references: [id], onDelete: Cascade)
  
  @@unique([followerId, followingId])
  @@map("follows")
}

model Team {
  id          String   @id @default(uuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  
  members     TeamMember[]
  projects    Project[]
  
  @@map("teams")
}

model TeamMember {
  id        String   @id @default(uuid())
  userId    String
  teamId    String
  role      String   @default("member")
  joinedAt  DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  team      Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  
  @@unique([userId, teamId])
  @@map("team_members")
}

model Project {
  id          String   @id @default(uuid())
  name        String
  description String?
  status      Status   @default(ACTIVE)
  priority    Priority @default(MEDIUM)
  startDate   DateTime?
  endDate     DateTime?
  teamId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  team        Team           @relation(fields: [teamId], references: [id], onDelete: Cascade)
  members     ProjectMember[]
  tasks       Task[]
  
  @@map("projects")
}

model ProjectMember {
  id        String   @id @default(uuid())
  userId    String
  projectId String
  role      String   @default("contributor")
  joinedAt  DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@unique([userId, projectId])
  @@map("project_members")
}

model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  status      Status   @default(PENDING)
  priority    Priority @default(MEDIUM)
  assigneeId  String?
  projectId   String
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  assignee    User?    @relation(fields: [assigneeId], references: [id])
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@map("tasks")
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  title     String
  content   String
  type      String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("notifications")
}
`;

let dbConfig: DatabaseConfig;

beforeAll(async () => {
  // Check if Docker is available
  const dockerAvailable = await DatabaseManager.checkDockerAvailable();
  if (!dockerAvailable) {
    console.log('⚠️  Docker not available, skipping performance tests');
    process.exit(0);
  }

  // Start test database
  console.log('🚀 Starting test database for performance tests...');
  dbConfig = await DatabaseManager.startPostgres();
});

afterAll(async () => {
  if (dbConfig) {
    console.log('🧹 Cleaning up performance test database...');
    await DatabaseManager.stopAllContainers();
  }
});

test('Large schema generation performance', async () => {
  const projectSetup = await PrismaProjectManager.createProject(
    'performance-test',
    LARGE_SCHEMA,
    dbConfig.databaseUrl
  );

  try {
    console.log('📊 Starting large schema performance test...');
    
    // Install dependencies
    const installStart = Date.now();
    await PrismaProjectManager.installDependencies(projectSetup.projectDir);
    const installTime = Date.now() - installStart;
    console.log(`📦 Dependencies installed in ${installTime}ms`);

    // Build generator
    const buildStart = Date.now();
    const buildResult = await runCommand(process.cwd(), 'bun run build');
    expect(buildResult.success).toBe(true);
    const buildTime = Date.now() - buildStart;
    console.log(`🔨 Generator built in ${buildTime}ms`);

    const prismaCli = new PrismaCLI(projectSetup.projectDir);

    // Measure generation time
    const generateStart = Date.now();
    const generateResult = await prismaCli.generate();
    const generateTime = Date.now() - generateStart;
    
    expect(generateResult.success).toBe(true);
    console.log(`⚡ Large schema generated in ${generateTime}ms`);

    // Count generated files
    const generatedFiles = await fs.readdir(projectSetup.generatedPath);
    console.log(`📄 Generated ${generatedFiles.length} files`);

    // Measure database push time
    const pushStart = Date.now();
    const pushResult = await prismaCli.dbPush();
    const pushTime = Date.now() - pushStart;
    
    expect(pushResult.success).toBe(true);
    console.log(`🗄️ Database schema pushed in ${pushTime}ms`);

    // Measure TypeScript compilation time
    const compileStart = Date.now();
    const compileResult = await runCommand(projectSetup.projectDir, 'bunx tsc --noEmit');
    const compileTime = Date.now() - compileStart;
    
    expect(compileResult.success).toBe(true);
    console.log(`📝 TypeScript compilation completed in ${compileTime}ms`);

    // Performance assertions
    expect(generateTime).toBeLessThan(30000); // Should generate in under 30 seconds
    expect(compileTime).toBeLessThan(60000);  // Should compile in under 60 seconds
    expect(generatedFiles.length).toBeGreaterThan(15); // Should generate many files

    // Log performance summary
    console.log('\n📊 Performance Summary:');
    console.log(`   Dependencies: ${installTime}ms`);
    console.log(`   Build:        ${buildTime}ms`);
    console.log(`   Generation:   ${generateTime}ms`);
    console.log(`   DB Push:      ${pushTime}ms`);
    console.log(`   Compilation:  ${compileTime}ms`);
    console.log(`   Total:        ${installTime + buildTime + generateTime + pushTime + compileTime}ms`);
    console.log(`   Files:        ${generatedFiles.length}`);

  } finally {
    await PrismaProjectManager.cleanupProject(projectSetup.projectDir);
  }
}, 300000); // 5 minute timeout for large schema

test('Memory usage and file size analysis', async () => {
  const projectSetup = await PrismaProjectManager.createProject(
    'memory-test',
    LARGE_SCHEMA,
    dbConfig.databaseUrl
  );

  try {
    console.log('🧠 Starting memory and file size analysis...');
    
    await PrismaProjectManager.installDependencies(projectSetup.projectDir);
    
    const prismaCli = new PrismaCLI(projectSetup.projectDir);
    
    // Monitor generation process
    const generateResult = await prismaCli.generate();
    expect(generateResult.success).toBe(true);

    // Analyze generated file sizes
    const generatedFiles = await fs.readdir(projectSetup.generatedPath);
    let totalSize = 0;
    const fileSizes: Array<{ name: string; size: number }> = [];
    
    for (const fileName of generatedFiles) {
      const filePath = path.join(projectSetup.generatedPath, fileName);
      const stats = await fs.stat(filePath);
      fileSizes.push({ name: fileName, size: stats.size });
      totalSize += stats.size;
    }
    
    // Sort by size
    fileSizes.sort((a, b) => b.size - a.size);
    
    console.log('\n📁 File Size Analysis:');
    console.log(`   Total size: ${(totalSize / 1024).toFixed(2)} KB`);
    console.log(`   Average size: ${(totalSize / fileSizes.length / 1024).toFixed(2)} KB`);
    console.log('\n   Largest files:');
    
    for (const file of fileSizes.slice(0, 5)) {
      console.log(`     ${file.name}: ${(file.size / 1024).toFixed(2)} KB`);
    }

    // Assertions
    expect(totalSize).toBeLessThan(1024 * 1024); // Total should be under 1MB
    expect(fileSizes.length).toBeGreaterThan(10); // Should generate multiple files
    
    // No single file should be too large
    const largestFile = fileSizes[0];
    expect(largestFile.size).toBeLessThan(100 * 1024); // No file over 100KB

    console.log('✅ Memory usage and file size analysis completed');

  } finally {
    await PrismaProjectManager.cleanupProject(projectSetup.projectDir);
  }
}, 180000);

test('Generation scalability with multiple iterations', async () => {
  console.log('🔄 Testing generation scalability...');
  
  const iterations = 3;
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const projectSetup = await PrismaProjectManager.createProject(
      `scalability-test-${i}`,
      LARGE_SCHEMA,
      dbConfig.databaseUrl
    );

    try {
      await PrismaProjectManager.installDependencies(projectSetup.projectDir);
      
      const prismaCli = new PrismaCLI(projectSetup.projectDir);
      
      const start = Date.now();
      const result = await prismaCli.generate();
      const time = Date.now() - start;
      
      expect(result.success).toBe(true);
      times.push(time);
      
      console.log(`   Iteration ${i + 1}: ${time}ms`);
      
    } finally {
      await PrismaProjectManager.cleanupProject(projectSetup.projectDir);
    }
  }
  
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const variance = times.reduce((acc, time) => acc + Math.pow(time - avgTime, 2), 0) / times.length;
  const stdDev = Math.sqrt(variance);
  
  console.log('\n📈 Scalability Results:');
  console.log(`   Average: ${avgTime.toFixed(2)}ms`);
  console.log(`   Min:     ${minTime}ms`);
  console.log(`   Max:     ${maxTime}ms`);
  console.log(`   Std Dev: ${stdDev.toFixed(2)}ms`);
  
  // Performance should be consistent
  expect(stdDev).toBeLessThan(avgTime * 0.3); // Standard deviation should be < 30% of average
  expect(maxTime - minTime).toBeLessThan(avgTime); // Range should be reasonable
  
  console.log('✅ Scalability test completed');
}, 300000);

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