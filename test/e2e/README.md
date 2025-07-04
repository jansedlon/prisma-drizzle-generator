# End-to-End Testing Framework

This directory contains comprehensive end-to-end tests for the Prisma Drizzle Generator. These tests validate the entire pipeline from Prisma schema to working Drizzle code with real database integration.

## Overview

The E2E testing framework provides:

- **Real Prisma CLI Integration**: Uses actual `prisma generate` commands
- **Docker Database Containers**: Spins up real PostgreSQL/MySQL databases
- **TypeScript Compilation Verification**: Ensures generated code compiles
- **Runtime Database Operations**: Tests CRUD operations and queries
- **Performance Benchmarking**: Measures generation time and memory usage
- **Database Schema Validation**: Verifies database structure matches expectations

## Test Suites

### 1. Basic Generation Tests (`basic-generation.test.ts`)

Tests fundamental generation capabilities:
- Basic schema generation with simple models
- Complex schemas with enums, relations, and custom directives
- File structure validation
- TypeScript compilation verification
- Database table creation

**Duration**: ~2 minutes  
**Requirements**: Docker

### 2. Runtime Functionality Tests (`runtime-functionality.test.ts`)

Tests runtime database operations:
- CRUD operations (Create, Read, Update, Delete)
- Relationship queries and joins
- Enum value validation
- Cascade delete operations
- Complex multi-table queries

**Duration**: ~3 minutes  
**Requirements**: Docker

### 3. Performance Tests (`performance.test.ts`)

Benchmarks generation performance:
- Large schema generation timing
- Memory usage analysis
- File size optimization
- Generation scalability across iterations
- TypeScript compilation performance

**Duration**: ~5 minutes  
**Requirements**: Docker

## Quick Start

### Prerequisites

1. **Docker**: Required for database integration tests
   ```bash
   # Check if Docker is available
   docker --version
   ```

2. **Bun Runtime**: Used for test execution
   ```bash
   # Check if Bun is available
   bun --version
   ```

### Running Tests

```bash
# Run all E2E tests
bun test/e2e/index.ts

# Run with verbose output
bun test/e2e/index.ts --verbose

# Skip Docker-dependent tests
bun test/e2e/index.ts --skip-docker

# Run individual test suite
bun test test/e2e/basic-generation.test.ts
```

### Test Output Example

```
🧪 Prisma Drizzle Generator E2E Test Suite

🔍 Checking Docker availability...
✅ Docker is available

🔨 Building generator...
✅ Generator built successfully

🏃 Running Basic Generation...
   Tests basic schema generation, file creation, and database validation
✅ Basic Generation passed in 45123ms

📊 Test Results Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Basic Generation      45123ms
✅ Runtime Functionality 67890ms
✅ Performance Benchmarks 123456ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Total: 3 tests, 3 passed, 0 failed
⏱️  Total time: 236469ms (236.47s)

🎉 All tests passed!
```

## Architecture

### Test Utilities (`utils/`)

#### `prisma-cli.ts`
- **PrismaCLI**: Programmatic execution of Prisma commands
- **PrismaProjectManager**: Creates real test projects with schema files
- Methods: `generate()`, `dbPush()`, `migrateDev()`, `validate()`

#### `database.ts`
- **DatabaseManager**: Docker container management for test databases
- **DatabaseValidator**: Database schema and table validation
- Supports PostgreSQL and MySQL containers

### Test Project Structure

Each test creates a temporary project with:
```
test-project/
├── package.json          # Dependencies and configuration
├── tsconfig.json         # TypeScript configuration
├── .env                  # Database connection URL
├── prisma/
│   └── schema.prisma     # Test schema with our generator
└── prisma/generated/drizzle/  # Generated Drizzle files
    ├── enums.ts
    ├── *-schema.ts
    ├── relations.ts
    └── index.ts
```

## Test Scenarios

### Schema Complexity Levels

1. **Basic**: Simple models with basic types
2. **Intermediate**: Relations, enums, custom directives
3. **Advanced**: Self-references, many-to-many, complex hierarchies
4. **Large**: 15+ models with extensive relationships

### Database Operations Tested

- **Create**: Insert operations with all data types
- **Read**: Select queries with filtering and joins
- **Update**: Modification operations
- **Delete**: Cascade deletions and constraint validation
- **Relations**: One-to-one, one-to-many, many-to-many queries

### Performance Metrics

- **Generation Time**: Time to generate Drizzle schema
- **Compilation Time**: TypeScript compilation duration
- **File Size**: Generated code size optimization
- **Memory Usage**: Peak memory during generation
- **Scalability**: Performance consistency across iterations

## Troubleshooting

### Docker Issues

```bash
# Ensure Docker is running
docker ps

# Clean up test containers
docker stop prisma-drizzle-test-postgres
docker rm prisma-drizzle-test-postgres
```

### Test Failures

1. **Generation Failures**: Check generator build status
2. **Database Connection**: Verify Docker containers are healthy
3. **TypeScript Errors**: Review generated code syntax
4. **Runtime Errors**: Check database schema consistency

### Common Issues

- **Port Conflicts**: Tests use ports 5433 (PostgreSQL), 3307 (MySQL)
- **Permission Errors**: Ensure Docker has proper permissions
- **Memory Issues**: Large schemas may require increased memory limits

## Extending Tests

### Adding New Test Cases

1. Create test schema in the test file
2. Use `PrismaProjectManager.createProject()` to setup
3. Run `prismaCli.generate()` and `prismaCli.dbPush()`
4. Validate results with expect assertions
5. Clean up with `PrismaProjectManager.cleanupProject()`

### Adding New Database Providers

1. Extend `DatabaseManager` with new provider methods
2. Add type mappings in `DatabaseValidator`
3. Update test schemas with provider-specific features
4. Add provider-specific test cases

### Performance Benchmarking

Use the performance test framework to benchmark:
- New generator features
- Different schema patterns
- Memory optimization improvements
- Generation speed enhancements

## CI/CD Integration

For continuous integration:

```yaml
# Example GitHub Actions step
- name: Run E2E Tests
  run: |
    # Start Docker service
    sudo systemctl start docker
    
    # Run tests
    bun test/e2e/index.ts
  env:
    CI: true
```

The tests are designed to be:
- **Deterministic**: Consistent results across environments
- **Isolated**: Each test cleans up after itself
- **Fast**: Optimized for CI environments
- **Comprehensive**: Full pipeline validation