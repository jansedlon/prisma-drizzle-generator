#!/usr/bin/env node

import { SchemaParser } from '../src/parsers/schema-parser.js';
import { PostgreSQLAdapter } from '../src/adapters/postgresql.js';
import { CodeGenerator } from '../src/generators/index.js';
import type { GeneratorConfig } from '../src/types/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log('🚀 Starting stress test on production schema...\n');

  try {
    // Read the main Prisma schema
    const schemaPath = join(__dirname, 'schema/schema.prisma');
    const schemaContent = await fs.readFile(schemaPath, 'utf-8');
    
    console.log(`📖 Schema loaded: ${schemaContent.length} characters, ${schemaContent.split('\n').length} lines`);

    // Get DMMF from Prisma
    console.log('🔍 Generating DMMF from Prisma schema...');
    const dmmf = await PrismaInternals.getDMMF({ datamodel: schemaContent });
    
    const modelsCount = dmmf.datamodel.models.length;
    const enumsCount = dmmf.datamodel.enums.length;
    console.log(`📊 Found ${modelsCount} models and ${enumsCount} enums`);

    // Initialize our generator
    const adapter = new PostgreSQLAdapter();
    const parser = new SchemaParser(adapter);
    
    const config: GeneratorConfig = {
      output: './generated',
      moduleResolution: 'nodeNext',
      splitFiles: true
    };
    const generator = new CodeGenerator(adapter, config);

    // Parse the schema
    console.log('⚙️  Parsing schema with our generator...');
    const parsedSchema = parser.parse(dmmf);
    
    console.log(`✅ Parsed:
  - ${parsedSchema.tables.length} tables
  - ${parsedSchema.relations.length} relations  
  - ${parsedSchema.enums.length} enums`);

    // Generate output directory
    const outputDir = join(__dirname, 'generated-output');
    await fs.mkdir(outputDir, { recursive: true });

    // Generate files
    console.log('📝 Generating Drizzle files...');
    const result = await generator.generate(parsedSchema);

    console.log(`🎉 Generated ${result.length} files:`);
    
    // Group files by type
    const filesByType = result.reduce((acc: Record<string, number>, file) => {
      const ext = file.path.split('.').pop();
      const type = file.path.includes('-relations') ? 'relations' : 
                  file.path.includes('-enum') ? 'enums' : 
                  ext === 'ts' ? 'tables' : 'other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    Object.entries(filesByType).forEach(([type, count]) => {
      console.log(`  - ${count} ${type} files`);
    });

    // Write files to disk
    for (const file of result) {
      const filePath = join(outputDir, file.path);
      await fs.writeFile(filePath, file.content, 'utf-8');
    }

    // Show some example files
    console.log('\n📄 Generated files preview:');
    result.slice(0, 10).forEach(file => {
      console.log(`  ✓ ${file.path}`);
    });
    
    if (result.length > 10) {
      console.log(`  ... and ${result.length - 10} more files`);
    }

    // Analyze relations
    console.log('\n🔗 Relations analysis:');
    const relationsByType = parsedSchema.relations.reduce((acc: Record<string, number>, rel) => {
      acc[rel.type] = (acc[rel.type] || 0) + 1;
      return acc;
    }, {});

    Object.entries(relationsByType).forEach(([type, count]) => {
      console.log(`  - ${count} ${type} relations`);
    });

    // Check for specific patterns
    const selfRelations = parsedSchema.relations.filter(r => 
      r.foreignKeyTable === r.referencedTable
    );
    console.log(`  - ${selfRelations.length} self-referencing relations`);

    const implicitManyToMany = parsedSchema.relations.filter(r => 
      r.isImplicitManyToMany
    );
    console.log(`  - ${implicitManyToMany.length} implicit M:N relations`);

    // Show some complex relations
    if (selfRelations.length > 0) {
      console.log('\n🔄 Self-referencing relations found:');
      selfRelations.slice(0, 5).forEach(rel => {
        console.log(`  - ${rel.foreignKeyTable}.${rel.relationName} (${rel.type})`);
      });
    }

    console.log(`\n✨ Success! All files generated in: ${outputDir}`);
    console.log('\n🧪 You can now compare the generated files with your existing Drizzle schema!');

  } catch (error) {
    console.error('❌ Error during stress test:');
    console.error(error);
    process.exit(1);
  }
}

main().catch(console.error);