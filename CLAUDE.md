# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
```bash
bun install                    # Install dependencies
bun run dev                    # Run with hot reload (main development command)
bun run generate               # Build and run prisma generate
bun run generate:watch         # Watch mode for development
```

**Testing:**
```bash
bun test                      # Run all tests
bun run test:unit             # Run unit tests only
bun run test:e2e              # Run end-to-end tests
bun run test:e2e:no-docker    # Run E2E tests without Docker
bun run test:all              # Run both unit and E2E tests
```

**Building and Quality:**
```bash
bun run build                 # Build using tsdown
bun run format                # Format code with Biome
bun run lint                  # Lint code with Biome
```

## Project Overview

This is a mature TypeScript project using Bun runtime that generates Drizzle ORM schemas from Prisma schema files. It features a clean, extensible architecture with comprehensive testing and supports modern development workflows.

**Key Technologies:**
- Bun runtime (replaces Node.js)
- TypeScript with strict configuration
- ESNext modules with bundler resolution
- Biome for formatting and linting
- tsdown for building
- Effect library for functional programming patterns
- Comprehensive test suite with E2E testing

## Project Structure

```
src/
├── adapters/          # Database-specific implementations
│   ├── postgresql.ts  # PostgreSQL adapter
│   └── index.ts       # Adapter factory
├── generators/        # Code generation modules
│   ├── schema-generator.ts     # Table schema generation
│   ├── relations-generator.ts  # Relations generation
│   ├── enums-generator.ts      # Enum generation
│   └── index.ts                # Main code generator
├── parsers/           # DMMF parsing logic
│   └── schema-parser.ts        # Prisma DMMF to internal format
├── types/             # TypeScript type definitions
│   └── index.ts       # All type exports
├── utils/             # Utility modules
│   ├── directive-parser.ts     # Custom directive parsing
│   ├── formatter.ts            # Code formatting
│   └── config.ts               # Configuration parsing
└── index.ts           # Generator entry point
```

## Important Development Notes

**Architecture Principles:**
- Database adapters for extensibility (PostgreSQL implemented)
- Separate generators for schemas, relations, and enums
- Custom directive support for fine-grained control
- Type-safe throughout with proper abstractions
- Clean separation of concerns: parsers, generators, adapters, utilities

**Bun-First Development:**
- Always use `bun` commands instead of npm/node/yarn equivalents
- Use Bun's built-in APIs where possible
- Entry point is `src/index.ts` with shebang for CLI usage

**Code Generation Flow:**
1. Parse Prisma DMMF using `SchemaParser`
2. Create appropriate `DatabaseAdapter` (currently PostgreSQL)
3. Generate code using `CodeGenerator` with separate generators for schemas, relations, enums
4. Apply formatting using configured formatter (Biome by default)
5. Write files to output directory

**Testing Strategy:**
- Unit tests: `test/unit/` - Test individual components
- E2E tests: `test/e2e/` - Test full generation workflow with real Prisma projects
- Integration tests: `test/integration/` - Test component interactions
- Performance tests: Included in E2E suite
- Docker integration for database testing
- Use `bun:test` framework for all tests

**Code Quality:**
- Biome for formatting (2-space indentation, double quotes)
- Comprehensive linting with recommended rules
- TypeScript strict mode enabled
- Import organization automatically managed

## Development Patterns

**Adding New Database Support:**
1. Create new adapter in `src/adapters/`
2. Implement `DatabaseAdapter` interface
3. Add type mappings for Prisma → Drizzle conversion
4. Update adapter factory in `src/adapters/index.ts`

**Testing New Features:**
- Add unit tests for core logic
- Add E2E tests with sample Prisma schemas in `test/e2e/projects/`
- Use `test/utils/test-helpers.ts` for common test utilities
- Run performance tests for large schemas

**Common Development Workflows:**
- Use `bun run generate:watch` for iterative development
- Test with example schemas in `example/` and `prisma/` directories
- Check generated output in respective `generated/drizzle/` folders
- Use `bun run test:e2e:no-docker` for faster feedback during development