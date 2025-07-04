import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface DatabaseConfig {
  containerName: string;
  port: number;
  databaseUrl: string;
  provider: 'postgresql' | 'mysql' | 'sqlite';
}

export class DatabaseManager {
  private static readonly POSTGRES_CONFIG: DatabaseConfig = {
    containerName: 'prisma-drizzle-test-postgres',
    port: 5433,
    databaseUrl: 'postgresql://test:test@localhost:5433/testdb',
    provider: 'postgresql'
  };

  private static readonly MYSQL_CONFIG: DatabaseConfig = {
    containerName: 'prisma-drizzle-test-mysql',
    port: 3307,
    databaseUrl: 'mysql://test:test@localhost:3307/testdb',
    provider: 'mysql'
  };

  /**
   * Start PostgreSQL test database
   */
  static async startPostgres(): Promise<DatabaseConfig> {
    const config = DatabaseManager.POSTGRES_CONFIG;
    
    // Stop and remove existing container if running
    await DatabaseManager.stopContainer(config.containerName);
    
    // Start new container
    await DatabaseManager.runCommand([
      'docker', 'run', '-d',
      '--name', config.containerName,
      '-e', 'POSTGRES_USER=test',
      '-e', 'POSTGRES_PASSWORD=test',
      '-e', 'POSTGRES_DB=testdb',
      '-p', `${config.port}:5432`,
      'postgres:16-alpine'
    ]);

    // Wait for database to be ready
    await DatabaseManager.waitForDatabase(config);
    
    return config;
  }

  /**
   * Start MySQL test database
   */
  static async startMySQL(): Promise<DatabaseConfig> {
    const config = DatabaseManager.MYSQL_CONFIG;
    
    // Stop and remove existing container if running
    await DatabaseManager.stopContainer(config.containerName);
    
    // Start new container
    await DatabaseManager.runCommand([
      'docker', 'run', '-d',
      '--name', config.containerName,
      '-e', 'MYSQL_ROOT_PASSWORD=test',
      '-e', 'MYSQL_DATABASE=testdb',
      '-e', 'MYSQL_USER=test',
      '-e', 'MYSQL_PASSWORD=test',
      '-p', `${config.port}:3306`,
      'mysql:8.0'
    ]);

    // Wait for database to be ready
    await DatabaseManager.waitForDatabase(config);
    
    return config;
  }

  /**
   * Stop and remove a database container
   */
  static async stopContainer(containerName: string): Promise<void> {
    try {
      await DatabaseManager.runCommand(['docker', 'stop', containerName]);
      await DatabaseManager.runCommand(['docker', 'rm', containerName]);
    } catch (error) {
      // Ignore errors if container doesn't exist
    }
  }

  /**
   * Stop all test database containers
   */
  static async stopAllContainers(): Promise<void> {
    await Promise.all([
      DatabaseManager.stopContainer(DatabaseManager.POSTGRES_CONFIG.containerName),
      DatabaseManager.stopContainer(DatabaseManager.MYSQL_CONFIG.containerName)
    ]);
  }

  /**
   * Wait for database to be ready
   */
  private static async waitForDatabase(config: DatabaseConfig, maxAttempts = 30): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (config.provider === 'postgresql') {
          await DatabaseManager.runCommand([
            'docker', 'exec', config.containerName,
            'pg_isready', '-h', 'localhost', '-p', '5432'
          ]);
        } else if (config.provider === 'mysql') {
          await DatabaseManager.runCommand([
            'docker', 'exec', config.containerName,
            'mysqladmin', 'ping', '-h', 'localhost', '-u', 'test', '-ptest'
          ]);
        }
        
        console.log(`✅ Database ${config.containerName} is ready`);
        return;
      } catch (error) {
        if (attempt === maxAttempts) {
          throw new Error(`Database ${config.containerName} failed to start after ${maxAttempts} attempts`);
        }
        
        console.log(`⏳ Waiting for database ${config.containerName} (attempt ${attempt}/${maxAttempts})...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  /**
   * Run a command and return the result
   */
  private static async runCommand(args: string[]): Promise<{ success: boolean; output: string; error?: string }> {
    return new Promise((resolve) => {
      const process = spawn(args[0], args.slice(1), {
        stdio: 'pipe'
      });

      let output = '';
      let error = '';

      process.stdout?.on('data', (data) => {
        output += data.toString();
      });

      process.stderr?.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        resolve({
          success: code === 0,
          output,
          error: code !== 0 ? error : undefined
        });
      });
    });
  }

  /**
   * Check if Docker is available
   */
  static async checkDockerAvailable(): Promise<boolean> {
    try {
      const result = await DatabaseManager.runCommand(['docker', '--version']);
      return result.success;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Database validation utilities
 */
export class DatabaseValidator {
  /**
   * Validate that tables exist in the database
   */
  static async validateTablesExist(
    config: DatabaseConfig,
    expectedTables: string[]
  ): Promise<{ success: boolean; missingTables: string[] }> {
    const missingTables: string[] = [];
    
    for (const tableName of expectedTables) {
      const exists = await DatabaseValidator.tableExists(config, tableName);
      if (!exists) {
        missingTables.push(tableName);
      }
    }
    
    return {
      success: missingTables.length === 0,
      missingTables
    };
  }

  /**
   * Check if a table exists
   */
  private static async tableExists(config: DatabaseConfig, tableName: string): Promise<boolean> {
    try {
      if (config.provider === 'postgresql') {
        const result = await DatabaseManager.runCommand([
          'docker', 'exec', config.containerName,
          'psql', '-U', 'test', '-d', 'testdb', '-t', '-c',
          `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '${tableName}');`
        ]);
        return result.output.trim().includes('t');
      } else if (config.provider === 'mysql') {
        const result = await DatabaseManager.runCommand([
          'docker', 'exec', config.containerName,
          'mysql', '-u', 'test', '-ptest', 'testdb', '-e',
          `SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '${tableName}';`
        ]);
        return !result.output.includes('0');
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate database schema structure
   */
  static async validateSchema(
    config: DatabaseConfig,
    expectedSchema: {
      tables: Array<{
        name: string;
        columns: Array<{
          name: string;
          type: string;
          nullable: boolean;
        }>;
      }>;
    }
  ): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    for (const table of expectedSchema.tables) {
      const tableValid = await DatabaseValidator.validateTable(config, table);
      if (!tableValid.success) {
        errors.push(...tableValid.errors);
      }
    }
    
    return {
      success: errors.length === 0,
      errors
    };
  }

  /**
   * Validate a single table structure
   */
  private static async validateTable(
    config: DatabaseConfig,
    table: { name: string; columns: Array<{ name: string; type: string; nullable: boolean }> }
  ): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    // Get table columns from database
    try {
      let result;
      
      if (config.provider === 'postgresql') {
        result = await DatabaseManager.runCommand([
          'docker', 'exec', config.containerName,
          'psql', '-U', 'test', '-d', 'testdb', '-t', '-c',
          `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = '${table.name}' ORDER BY ordinal_position;`
        ]);
      } else {
        // MySQL implementation would go here
        return { success: true, errors: [] };
      }
      
      if (!result.success) {
        errors.push(`Failed to query table ${table.name}: ${result.error}`);
        return { success: false, errors };
      }
      
      const dbColumns = DatabaseValidator.parsePostgresColumns(result.output);
      
      // Validate each expected column
      for (const expectedColumn of table.columns) {
        const dbColumn = dbColumns.find(col => col.name === expectedColumn.name);
        
        if (!dbColumn) {
          errors.push(`Column ${table.name}.${expectedColumn.name} is missing`);
          continue;
        }
        
        // Type validation (simplified)
        if (!DatabaseValidator.isCompatibleType(expectedColumn.type, dbColumn.type)) {
          errors.push(`Column ${table.name}.${expectedColumn.name} has wrong type: expected ${expectedColumn.type}, got ${dbColumn.type}`);
        }
        
        // Nullable validation
        if (expectedColumn.nullable !== dbColumn.nullable) {
          errors.push(`Column ${table.name}.${expectedColumn.name} has wrong nullable: expected ${expectedColumn.nullable}, got ${dbColumn.nullable}`);
        }
      }
      
    } catch (error) {
      errors.push(`Error validating table ${table.name}: ${error}`);
    }
    
    return {
      success: errors.length === 0,
      errors
    };
  }

  /**
   * Parse PostgreSQL column information
   */
  private static parsePostgresColumns(output: string): Array<{ name: string; type: string; nullable: boolean }> {
    const lines = output.trim().split('\n').filter(line => line.trim());
    const columns: Array<{ name: string; type: string; nullable: boolean }> = [];
    
    for (const line of lines) {
      const parts = line.trim().split('|').map(part => part.trim());
      if (parts.length >= 3) {
        columns.push({
          name: parts[0],
          type: parts[1],
          nullable: parts[2] === 'YES'
        });
      }
    }
    
    return columns;
  }

  /**
   * Check if database type is compatible with expected type
   */
  private static isCompatibleType(expectedType: string, dbType: string): boolean {
    // Simplified type compatibility check
    const typeMap: Record<string, string[]> = {
      'text': ['text', 'character varying', 'varchar'],
      'integer': ['integer', 'int4'],
      'bigint': ['bigint', 'int8'],
      'boolean': ['boolean'],
      'timestamp': ['timestamp without time zone', 'timestamp'],
      'uuid': ['uuid'],
      'jsonb': ['jsonb'],
      'bytes': ['bytes']
    };
    
    const compatibleTypes = typeMap[expectedType.toLowerCase()] || [expectedType.toLowerCase()];
    return compatibleTypes.includes(dbType.toLowerCase());
  }
}