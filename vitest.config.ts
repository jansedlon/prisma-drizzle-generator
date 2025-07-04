import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // Global settings
    globals: true,
    environment: 'node',
    
    // Test file patterns
    include: [
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}',
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'
    ],
    exclude: [
      'node_modules',
      'dist',
      'prisma/generated',
      '**/*.d.ts'
    ],

    // Test timeouts
    testTimeout: 60000,  // 60s for E2E tests with containers
    hookTimeout: 30000,  // 30s for setup/teardown

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,js}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,js}',
        'src/**/*.d.ts',
        'src/types/**',
        'node_modules/**'
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        }
      }
    },

    // Setup files
    setupFiles: [
      './tests/utils/setup.ts',
      './tests/utils/db-setup.ts'
    ],

    // Test sequencing
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
        useAtomics: true
      }
    },

    // Snapshot configuration
    resolveSnapshotPath: (testPath, snapExtension) => {
      return resolve('./tests/snapshots', testPath.replace(/\.test\.ts$/, snapExtension));
    },

    // Custom matchers
    expect: {
      // Will be extended in setup files
    }
  },

  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@tests': resolve(__dirname, 'tests'),
      '@fixtures': resolve(__dirname, 'tests/fixtures')
    }
  },

  // Environment variables for tests
  define: {
    __TEST__: true,
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  }
});