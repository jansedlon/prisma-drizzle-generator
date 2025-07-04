# Testing Infrastructure Documentation

This document outlines the comprehensive testing infrastructure for the Prisma-to-Drizzle Generator, designed to ensure reliability, type safety, and compatibility across different database systems.

## 🏗️ Testing Architecture

Our testing strategy follows a multi-layered approach:

```
┌─────────────────────┐
│   E2E Tests         │ ← Real databases, full integration
├─────────────────────┤
│ Integration Tests   │ ← File generation, API testing
├─────────────────────┤
│    Type Tests       │ ← TypeScript type safety (tsd)
├─────────────────────┤
│    Unit Tests       │ ← Individual components
└─────────────────────┘
```

## 🧪 Test Categories

### 1. Unit Tests (`tests/unit/`)

**Purpose**: Test individual components in isolation.

**Coverage**:
- Schema parser logic
- Relations generator
- Database adapters
- Utility functions

**Technology**: Vitest

**Example**:
```typescript
// tests/unit/parsers/schema-parser.test.ts
describe('SchemaParser', () => {
  it('should parse 1:M relations correctly', () => {
    const dmmf = createMockDMMF({/* ... */});
    const result = parser.parse(dmmf);
    expect(result.relations).toHaveLength(2);
  });
});
```

**Run with**:
```bash
npm run test:unit
```

### 2. Integration Tests (`tests/integration/`)

**Purpose**: Test the complete generator workflow from DMMF to generated files.

**Coverage**:
- Complete relation type support (1:1, 1:M, M:N, self-relations)
- File generation and validation
- Cross-adapter compatibility
- Edge cases and error handling

**Technology**: Vitest + File System

**Example**:
```typescript
// tests/integration/relations/one-to-many.test.ts
describe('One-to-Many Relations Integration', () => {
  it('should generate correct User → Posts relationship', async () => {
    const result = await generateDrizzleSchema({
      dmmf: MOCK_SCHEMAS.userPost(),
      outputDir: tempDir,
      adapter: 'postgresql'
    });
    
    expect(result.success).toBe(true);
    const content = await readFile(join(tempDir, 'user-relations.ts'));
    expect(content).toContain('posts: many(post)');
  });
});
```

**Run with**:
```bash
npm run test:integration
```

### 3. Type Tests (`tests/types/`)

**Purpose**: Verify TypeScript type safety of generated schemas and relations.

**Coverage**:
- Generated schema types
- Relation query types
- Insert/update types
- Join conditions
- Transaction types

**Technology**: tsd (TypeScript Definition Testing)

**Example**:
```typescript
// tests/types/relations.test-d.ts
import { expectType, expectError } from 'tsd';

describe('Type Tests - Relations', () => {
  it('should infer correct select types from schemas', () => {
    type UserSelect = InferSelectModel<typeof user>;
    
    expectType<{
      id: string;
      email: string;
      name: string | null;
      createdAt: Date;
      updatedAt: Date;
    }>({} as UserSelect);
  });
});
```

**Run with**:
```bash
npm run test:types
```

### 4. E2E Tests (`tests/e2e/`)

**Purpose**: Test against real databases to ensure generated schemas work in production.

**Coverage**:
- PostgreSQL, MySQL, SQLite support
- Real database operations
- Foreign key constraints
- Performance testing
- Migration compatibility

**Technology**: Vitest + Testcontainers + Real databases

**Example**:
```typescript
// tests/e2e/postgresql/relations.e2e.test.ts
describe('E2E Tests - PostgreSQL Relations', () => {
  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:15').start();
    // Setup real database connection
  });
  
  it('should create and query user with posts', async () => {
    const [newUser] = await db.insert(user).values({
      email: 'test@example.com',
      name: 'Test User'
    }).returning();
    
    // Test real database operations...
  });
});
```

**Run with**:
```bash
npm run test:e2e
```

## 🛠️ Testing Tools & Technologies

### Core Testing Framework
- **Vitest**: Modern test runner with TypeScript support
- **tsd**: TypeScript definition testing
- **@testcontainers**: Real database instances for E2E tests

### Database Testing
- **PostgreSQL Container**: Full PostgreSQL 15 instance
- **MySQL Container**: MySQL 8 instance
- **SQLite**: In-memory and file-based testing
- **Real Drizzle ORM**: Production database operations

### Utilities
- **Mock DMMF Generator**: Creates test Prisma schemas
- **Temporary Directories**: Isolated file generation
- **Custom Matchers**: Enhanced assertions for generated code

## 📁 Test Structure

```
tests/
├── unit/                   # Unit tests for components
│   ├── parsers/           # Schema and relation parsers
│   ├── generators/        # Code generators
│   ├── adapters/          # Database adapters
│   └── utils/             # Utility functions
├── integration/           # Integration tests
│   ├── basic-types/       # Basic type handling
│   ├── relations/         # All relation types
│   │   ├── one-to-one.test.ts
│   │   ├── one-to-many.test.ts
│   │   ├── many-to-many.test.ts
│   │   └── self-relations.test.ts
│   ├── constraints/       # Indexes, unique constraints
│   └── edge-cases/        # Special scenarios
├── types/                 # Type safety tests
│   ├── schemas/           # Schema type tests
│   ├── relations/         # Relation type tests
│   └── queries/           # Query builder types
├── e2e/                   # End-to-end tests
│   ├── postgresql/        # PostgreSQL specific tests
│   ├── mysql/             # MySQL specific tests
│   └── sqlite/            # SQLite specific tests
├── performance/           # Performance benchmarks
├── fixtures/              # Test data and schemas
│   ├── basic/             # Simple test schemas
│   ├── complex/           # Real-world schemas
│   └── edge-cases/        # Edge case schemas
└── utils/                 # Testing utilities
    ├── mock-dmmf.ts       # DMMF generation helpers
    ├── db-helpers.ts      # Database setup utilities
    └── matchers.ts        # Custom Vitest matchers
```

## 🚀 Running Tests

### All Tests
```bash
npm run test:all
```

### Individual Test Suites
```bash
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only
npm run test:types          # Type tests only
npm run test:e2e           # E2E tests only
```

### Development Workflow
```bash
npm run test:watch         # Watch mode for development
npm run test:ui            # Visual test UI
npm run test:coverage      # Coverage report
```

### CI/CD
```bash
npm run test:ci            # Optimized for CI environment
```

## 📊 Coverage Requirements

We maintain high code coverage standards:

- **Statements**: 85%
- **Branches**: 85%
- **Functions**: 85%
- **Lines**: 85%

Coverage reports are generated in multiple formats:
- HTML report: `coverage/index.html`
- JSON report: `coverage/coverage.json`
- LCOV report: `coverage/lcov.info`

## 🐳 Database Testing with Containers

### PostgreSQL
```javascript
const container = await new PostgreSqlContainer('postgres:15')
  .withDatabase('test_db')
  .withUsername('test_user')
  .withPassword('test_password')
  .start();
```

### MySQL
```javascript
const container = await new MySqlContainer('mysql:8')
  .withDatabase('test_db')
  .withUsername('test_user')
  .withUserPassword('test_password')
  .start();
```

### Benefits
- **Isolation**: Each test gets a fresh database
- **Reliability**: Real database behavior
- **Performance**: Containers start quickly
- **Consistency**: Same environment everywhere

## 🔧 Custom Test Utilities

### Mock DMMF Generator
```typescript
import { createMockDMMF, MOCK_SCHEMAS } from '@tests/utils/mock-dmmf';

// Predefined schemas
const userPostSchema = MOCK_SCHEMAS.userPost();
const complexSchema = MOCK_SCHEMAS.complexSchema();

// Custom schemas
const customSchema = createMockDMMF({
  models: [/* custom models */],
  enums: [/* custom enums */]
});
```

### Database Helpers
```typescript
import { setupTestDatabase, cleanDatabase } from '@tests/utils/db-helpers';

beforeEach(async () => {
  await cleanDatabase(db);
});
```

### Custom Matchers
```typescript
// Check generated TypeScript syntax
expect(generatedCode).toBeValidTypeScript();

// Check Drizzle relation structure
expect(relations).toHaveValidDrizzleRelations();

// Check database schema compatibility
expect(schema).toBeCompatibleWith('postgresql');
```

## 🎯 Testing Best Practices

### 1. Test Isolation
- Each test runs in isolation
- Fresh database for each E2E test
- Temporary directories for file generation
- No shared state between tests

### 2. Descriptive Test Names
```typescript
// ✅ Good
it('should generate one-to-many relation with correct foreign key fields')

// ❌ Bad  
it('should work with relations')
```

### 3. Comprehensive Coverage
- Test all relation types (1:1, 1:M, M:N, self)
- Test all database adapters
- Test error conditions
- Test edge cases

### 4. Performance Awareness
- E2E tests with timeouts
- Large schema testing
- Memory usage monitoring
- Generation speed benchmarks

### 5. Real-World Scenarios
- Complex nested relations
- Large schemas (100+ models)
- Real database constraints
- Production-like data

## 📈 Performance Testing

### Benchmarks
```bash
npm run benchmark
```

Performance tests cover:
- **Schema parsing speed**: Large DMMF processing
- **Code generation time**: File generation performance
- **Memory usage**: Memory efficiency
- **Database operations**: Query performance

### Metrics Tracked
- Generation time for 100+ model schemas
- Memory usage during generation
- Database query performance
- Type checking time

## 🚨 Debugging Tests

### Debug Mode
```bash
DEBUG=1 npm run test:unit
```

### Verbose Output
```bash
npm run test -- --reporter=verbose
```

### Test UI
```bash
npm run test:ui
```

### Database Logs
```bash
DATABASE_DEBUG=1 npm run test:e2e
```

## 🎭 Mock vs Real Testing

### When to Use Mocks
- Unit tests for business logic
- Testing error conditions
- Fast feedback loops
- Component isolation

### When to Use Real Databases
- E2E functionality testing
- Foreign key constraint testing
- Performance testing
- Migration compatibility

## 🔍 Quality Gates

Before merging code, all tests must pass:

1. **Unit Tests**: ✅ All components work in isolation
2. **Integration Tests**: ✅ Complete workflows function
3. **Type Tests**: ✅ Generated code is type-safe
4. **E2E Tests**: ✅ Real database operations work
5. **Coverage**: ✅ Meets minimum coverage requirements
6. **Performance**: ✅ No significant regressions

## 🤝 Contributing to Tests

### Adding New Tests
1. Identify the appropriate test category
2. Use existing patterns and utilities
3. Include both positive and negative test cases
4. Update documentation if needed

### Test Naming Conventions
- Files: `*.test.ts` for unit/integration, `*.test-d.ts` for types, `*.e2e.test.ts` for E2E
- Describe blocks: Feature being tested
- Test cases: Specific behavior being verified

### Mock Data Guidelines
- Use `MOCK_SCHEMAS` for common scenarios
- Create custom DMMF for specific test cases
- Keep test data minimal but realistic
- Document complex test scenarios

---

This testing infrastructure ensures that the Prisma-to-Drizzle Generator produces reliable, type-safe, and performant code across all supported database systems and relation types.