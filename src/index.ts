#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  type GeneratorOptions,
  generatorHandler,
} from "@prisma/generator-helper";
import { createDatabaseAdapter } from "./adapters/index.ts";
import { CodeGenerator } from "./generators/index.ts";
import { SchemaParser } from "./parsers/schema-parser.ts";
import { parseGeneratorConfig } from "./utils/config.ts";
// Simple logger fallback
const logger = {
  info: (msg: string) => console.log(`prisma:info ${msg}`),
  warn: (msg: string) => console.warn(`prisma:warn ${msg}`),
};

// const PackageJson = Schema.Struct({
//   version: Schema.String,
// });

// const ConfigSchema = Schema.Struct({
//   relationalQuery: Schema.optionalWith(Schema.BooleanFromString, {
//     default: () => true,
//   }),
//   moduleResolution: Schema.optionalWith(Schema.String, {
//     default: () => "NodeNext",
//   }),
//   verbose: Schema.optionalWith(Schema.BooleanFromString, {
//     default: () => false,
//   }),
//   formatter: Schema.optionalWith(Schema.String, {
//     default: () => "biome",
//   }),
//   abortOnFailedFormatting: Schema.optionalWith(Schema.BooleanFromString, {
//     default: () => true,
//   }),
//   dateMode: Schema.optionalWith(
//     Schema.Union(Schema.Literal("string"), Schema.Literal("native")),
//     {
//       default: () => "string",
//     },
//   ),
// });

// const program = Effect.gen(function* () {
//   const path = yield* Path.Path;
//   const fs = yield* FileSystem.FileSystem;

//   const packageJsonPath = path.resolve(import.meta.dir, "../", "package.json");

//   const packageJson = yield* fs.readFileString(packageJsonPath, "utf-8");

//   const decoded = yield* Schema.decodeUnknown(Schema.parseJson(PackageJson))(
//     packageJson,
//   );

//   generatorHandler({
//     onManifest() {
//       return {
//         version: decoded.version,
//         defaultOutput: "./generated/drizzle",
//         prettyName: "Prisma Drizzle Generator",
//         requiresGenerators: ["prisma-client-js"],
//       };
//     },

//     async onGenerate(options) {
//       const config = Schema.decodeUnknownSync(ConfigSchema)(
//         options.generator.config,
//       );

//       await Effect.runPromise(
//         Effect.withConfigProvider(
//           generateHandler(options),
//           ConfigProvider.fromJson(config),
//         ).pipe(Effect.provide(BunContext.layer), Effect.provide(Logger.pretty)),
//       );
//     },
//   });
// });

// const generateHandler = (options: GeneratorOptions) =>
//   Effect.gen(function* () {});

// BunRuntime.runMain(
//   program.pipe(Effect.provide(BunContext.layer), Effect.provide(Logger.pretty)),
// );

generatorHandler({
  async onManifest() {
    const { version } = await Bun.file("./package.json").json();
    return {
      version,
      defaultOutput: "./generated/drizzle",
      prettyName: "Prisma Drizzle Generator",
      requiresGenerators: ["prisma-client-js"],
    };
  },

  async onGenerate(options: GeneratorOptions) {
    try {
      const outputDir =
        options.generator.output?.value || "./generated/drizzle";

      const config = parseGeneratorConfig(options.generator.config);

      // Get database provider from datasource
      const datasource =
        options.dmmf.datamodel.models.length > 0
          ? options.datasources[0]?.provider || "postgresql"
          : "postgresql";

      console.log(`Generating Drizzle schema for ${datasource}...`);

      // Create database adapter
      const adapter = createDatabaseAdapter(datasource);

      // Parse Prisma schema
      const parser = new SchemaParser(adapter);
      logger.info("Parsing schema...");
      const parsedSchema = parser.parse(options.dmmf);
      logger.info("Parsed schema");

      // Generate code
      const generator = new CodeGenerator(adapter, config);
      logger.info("Generating code...");
      const files = await generator.generate(parsedSchema);
      logger.info("Generated code");

      // Ensure output directory exists
      await mkdir(outputDir, { recursive: true });

      // Write generated files
      for (const file of files) {
        const filePath = path.join(outputDir, file.path);
        await writeFile(filePath, file.content, "utf-8");
        console.log(`Generated: ${filePath}`);
      }
      console.log(
        `Successfully generated ${files.length} files to ${outputDir}`,
      );
    } catch (error) {
      console.error("Generation failed:", error);
      throw error;
    }
  },
});
