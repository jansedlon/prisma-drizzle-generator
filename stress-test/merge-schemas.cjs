#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

async function mergeSchemas() {
  const schemaDir = path.join(__dirname, 'schema');
  const outputPath = path.join(__dirname, 'merged-schema.prisma');
  
  console.log('🔗 Merging Prisma schemas...');
  
  // Read main schema first
  const mainSchemaPath = path.join(schemaDir, 'schema.prisma');
  let mainContent = await fs.readFile(mainSchemaPath, 'utf-8');
  
  // Get all other schema files
  const files = await fs.readdir(schemaDir);
  const otherFiles = files.filter(f => f.endsWith('.prisma') && f !== 'schema.prisma');
  
  console.log(`📁 Found ${otherFiles.length} additional schema files:`, otherFiles);
  
  let mergedContent = mainContent;
  
  // Append content from other files
  for (const file of otherFiles) {
    const filePath = path.join(schemaDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Remove generator and datasource blocks from additional files
    const contentWithoutHeader = content
      .replace(/^generator\s+\w+\s*\{[^}]*\}/gm, '')
      .replace(/^datasource\s+\w+\s*\{[^}]*\}/gm, '')
      .trim();
    
    if (contentWithoutHeader) {
      mergedContent += `\n\n// ===== From ${file} =====\n`;
      mergedContent += contentWithoutHeader;
    }
  }
  
  // Write merged file
  await fs.writeFile(outputPath, mergedContent);
  console.log(`✅ Merged schema written to: ${outputPath}`);
  
  return outputPath;
}

module.exports = { mergeSchemas };

if (require.main === module) {
  mergeSchemas().catch(console.error);
}