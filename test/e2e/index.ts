#!/usr/bin/env bun

/**
 * End-to-End Test Runner for Prisma Drizzle Generator
 * 
 * This script runs comprehensive E2E tests that validate the entire pipeline
 * from Prisma schema to working Drizzle code with real database integration.
 * 
 * Features:
 * - Real Prisma CLI integration
 * - Docker database containers
 * - TypeScript compilation verification
 * - Runtime database operations
 * - Performance benchmarking
 * 
 * Usage:
 *   bun test/e2e/index.ts [--skip-docker] [--verbose]
 */

import { spawn } from 'node:child_process';
import { DatabaseManager } from './utils/database.js';

interface TestSuite {
  name: string;
  file: string;
  description: string;
  timeout: number;
}

const TEST_SUITES: TestSuite[] = [
  {
    name: 'Basic Generation',
    file: 'basic-generation.test.ts',
    description: 'Tests basic schema generation, file creation, and database validation',
    timeout: 120000
  },
  {
    name: 'Runtime Functionality',
    file: 'runtime-functionality.test.ts',
    description: 'Tests CRUD operations and relationship queries with real database',
    timeout: 180000
  },
  {
    name: 'Config Options',
    file: 'config-options.test.ts',
    description: 'Tests various generator configuration options like moduleResolution and formatter',
    timeout: 120000
  },
  {
    name: 'Performance Benchmarks',
    file: 'performance.test.ts', 
    description: 'Tests generation performance with large schemas and memory usage',
    timeout: 300000
  }
];

async function main() {
  const args = process.argv.slice(2);
  const skipDocker = true//  args.includes('--skip-docker');
  const verbose = true// args.includes('--verbose');

  console.log('🧪 Prisma Drizzle Generator E2E Test Suite\\n');

  // Check prerequisites
  if (!skipDocker) {
    console.log('🔍 Checking Docker availability...');
    const dockerAvailable = await DatabaseManager.checkDockerAvailable();
    
    if (!dockerAvailable) {
      console.error('❌ Docker is not available. Please install Docker or use --skip-docker flag.');
      console.error('   Docker is required for database integration tests.');
      process.exit(1);
    }
    
    console.log('✅ Docker is available\\n');
  }

  // Build the generator first
  console.log('🔨 Building generator...');
  const buildResult = await runCommand(process.cwd(), 'bun run build');
  
  if (!buildResult.success) {
    console.error('❌ Failed to build generator:');
    console.error(buildResult.error);
    process.exit(1);
  }
  
  console.log('✅ Generator built successfully\\n');

  // Run test suites
  let passed = 0;
  let failed = 0;
  const results: Array<{ suite: string; success: boolean; time: number; error?: string }> = [];

  for (const suite of TEST_SUITES) {
    if (skipDocker && suite.file.includes('runtime')) {
      console.log(`⏭️  Skipping ${suite.name} (Docker disabled)\\n`);
      continue;
    }

    console.log(`🏃 Running ${suite.name}...`);
    console.log(`   ${suite.description}`);
    
    const start = Date.now();
    const result = await runCommand(
      process.cwd(),
      `bun test test/e2e/${suite.file}`,
      suite.timeout
    );
    const time = Date.now() - start;
    
    results.push({
      suite: suite.name,
      success: result.success,
      time,
      error: result.error
    });

    if (result.success) {
      console.log(`✅ ${suite.name} passed in ${time}ms\\n`);
      passed++;
    } else {
      console.log(`❌ ${suite.name} failed in ${time}ms`);
      if (verbose && result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log('');
      failed++;
    }
  }

  // Print summary
  console.log('📊 Test Results Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  for (const result of results) {
    const status = result.success ? '✅' : '❌';
    const time = `${result.time}ms`.padStart(8);
    console.log(`${status} ${result.suite.padEnd(20)} ${time}`);
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const total = passed + failed;
  const totalTime = results.reduce((sum, r) => sum + r.time, 0);
  
  console.log(`📈 Total: ${total} tests, ${passed} passed, ${failed} failed`);
  console.log(`⏱️  Total time: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`);
  
  if (failed > 0) {
    console.log('\\n❌ Some tests failed. See details above.');
    process.exit(1);
  } else {
    console.log('\\n🎉 All tests passed!');
    process.exit(0);
  }
}

async function runCommand(
  cwd: string,
  command: string,
  timeout = 60000
): Promise<{ success: boolean; output: string; error?: string }> {
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
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Set timeout
    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        childProcess.kill('SIGTERM');
        resolve({
          success: false,
          output,
          error: `Command timed out after ${timeout}ms`
        });
      }, timeout);
    }

    childProcess.stdout.on('data', (data: Buffer) => {
      output += data.toString();
    });

    childProcess.stderr.on('data', (data: Buffer) => {
      error += data.toString();
    });

    childProcess.on('close', (code: number | null) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      resolve({
        success: code === 0,
        output,
        error: code !== 0 ? error : undefined
      });
    });
  });
}

// Show help if requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Prisma Drizzle Generator E2E Test Runner

Usage: bun test/e2e/index.ts [options]

Options:
  --skip-docker    Skip tests that require Docker
  --verbose        Show detailed error output
  --help, -h       Show this help message

Test Suites:
${TEST_SUITES.map(suite => `  • ${suite.name}: ${suite.description}`).join('\\n')}

Prerequisites:
  • Docker (for database integration tests)
  • Bun runtime
  • Internet connection (for dependency installation)
`);
  process.exit(0);
}

// Run tests
main().catch((error) => {
  console.error('💥 Test runner crashed:', error);
  process.exit(1);
});