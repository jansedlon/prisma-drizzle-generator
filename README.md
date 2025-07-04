# Prisma Drizzle Generator

A modern, clean implementation of a Prisma generator that creates Drizzle ORM schema from Prisma schema files.

## Features

- ✅ **Full PostgreSQL Support** - Complete type mapping and modern SQL features
- ✅ **Split File Architecture** - Separate files for schemas, relations, and enums
- ✅ **Custom Directives** - `@drizzle.type`, `@drizzle.default` for fine-grained control
- ✅ **Module Resolution** - Support for NodeNext, Node, and Bundler resolution
- ✅ **Auto Formatting** - Built-in Biome and Prettier support
- ✅ **TypeScript First** - Written in TypeScript with full type safety
- ✅ **Modern Architecture** - Clean, extensible codebase with proper abstractions

## Installation

```bash
bun add -D prisma-drizzle-generator
# or
npm install -D prisma-drizzle-generator
```

## Usage

Add the generator to your `schema.prisma`:

```prisma
generator drizzle {
  provider = "prisma-drizzle-generator"
  output   = "./generated/drizzle"
  moduleResolution = "nodeNext" // "node" | "nodeNext" | "bundler"
  formatter = "biome" // "biome" | "prettier" | "none"
}
```

Then run:

```bash
bunx prisma generate
```

## Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `output` | `./generated/drizzle` | Output directory for generated files |
| `moduleResolution` | `nodeNext` | Module resolution strategy |
| `formatter` | `biome` | Code formatter to use |
| `formatterConfig` | `undefined` | Path to formatter config file |
| `splitFiles` | `true` | Generate separate files for schemas, relations, enums |

## Custom Directives

### Type Override
```prisma
model User {
  /// @drizzle.type(type: "varchar", length: 255)
  username String @unique
}
```

### Custom Default Values
```prisma
model User {
  /// @drizzle.default(value: "0")
  points Int @default(0)
}
```

## Generated Structure

For each model, the generator creates:

- `{model}-schema.ts` - Table definitions
- `relations.ts` - Relationship definitions 
- `enums.ts` - Enum definitions (if any)
- `index.ts` - Exports all generated code

## Example

Given this Prisma schema:

```prisma
enum UserRole {
  ADMIN
  USER
}

model User {
  id    String   @id @default(uuid())
  email String   @unique
  role  UserRole @default(USER)
  posts Post[]
}

model Post {
  id       String @id @default(uuid()) 
  title    String
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}
```

Generates these Drizzle files:

**`enums.ts`**
```typescript
import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'USER']);
```

**`user-schema.ts`**
```typescript
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { userRoleEnum } from './enums.js';

export const user = pgTable('users', {
  id: text('id').primaryKey().default('crypto.randomUUID()'),
  email: text('email').unique().notNull(),
  role: userRoleEnum('role').default('USER').notNull()
});
```

**`relations.ts`**
```typescript
import { relations } from 'drizzle-orm';
import { user } from './user-schema.js';
import { post } from './post-schema.js';

export const userRelations = relations(user, ({ many }) => ({
  posts: many(post)
}));

export const postRelations = relations(post, ({ one }) => ({
  author: one(user, {
    fields: [post.authorId],
    references: [user.id]
  })
}));
```

## Architecture

The generator is built with a clean, modular architecture:

- **Database Adapters** - Pluggable database support (PostgreSQL implemented)
- **Schema Parser** - Converts DMMF to internal representation
- **Code Generators** - Separate generators for schemas, relations, enums
- **Type Mappers** - Handle Prisma to Drizzle type conversions
- **Formatter Integration** - Optional code formatting

## Development

```bash
# Install dependencies
bun install

# Build
bun run build

# Format
bun run format

# Lint
bun run lint
```

## License

MIT