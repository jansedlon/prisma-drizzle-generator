import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface PrismaProjectSetup {
  projectDir: string;
  schemaPath: string;
  databaseUrl: string;
  generatedPath: string;
}

export class PrismaCLI {
  constructor(private projectDir: string) {}

  /**
   * Run prisma generate command
   */
  async generate(): Promise<{ success: boolean; output: string; error?: string }> {
    return this.runCommand(['generate']);
  }

  /**
   * Run prisma db push to sync database
   */
  async dbPush(): Promise<{ success: boolean; output: string; error?: string }> {
    return this.runCommand(['db', 'push', '--force-reset']);
  }

  /**
   * Run prisma migrate dev
   */
  async migrateDev(name?: string): Promise<{ success: boolean; output: string; error?: string }> {
    const args = ['migrate', 'dev'];
    if (name) {
      args.push('--name', name);
    }
    return this.runCommand(args);
  }

  /**
   * Run prisma db pull (introspection)
   */
  async dbPull(): Promise<{ success: boolean; output: string; error?: string }> {
    return this.runCommand(['db', 'pull']);
  }

  /**
   * Get schema validation
   */
  async validate(): Promise<{ success: boolean; output: string; error?: string }> {
    return this.runCommand(['validate']);
  }

  private async runCommand(args: string[]): Promise<{ success: boolean; output: string; error?: string }> {
    return new Promise((resolve) => {
      const childProcess = spawn('bunx', ['prisma', ...args], {
        cwd: this.projectDir,
        stdio: 'pipe',
        env: { ...process.env }
      });

      let output = '';
      let error = '';

      childProcess.stdout?.on('data', (data: Buffer) => {
        output += data.toString();
      });

      childProcess.stderr?.on('data', (data: Buffer) => {
        error += data.toString();
      });

      childProcess.on('close', (code: number | null) => {
        resolve({
          success: code === 0,
          output,
          error: code !== 0 ? error : undefined
        });
      });
    });
  }
}

export class PrismaProjectManager {
  /**
   * Create a new Prisma test project
   */
  static async createProject(
    projectName: string,
    schema: string,
    databaseUrl: string
  ): Promise<PrismaProjectSetup> {
    const projectDir = path.join(process.cwd(), 'test', 'e2e', 'projects', projectName);
    
    // Ensure clean project directory
    await fs.rm(projectDir, { recursive: true, force: true });
    await fs.mkdir(projectDir, { recursive: true });

    // Create package.json
    const packageJson = {
      name: `test-${projectName}`,
      version: '1.0.0',
      type: 'module',
      dependencies: {
        '@prisma/client': '^6.11.0',
        'drizzle-orm': '^0.36.4',
        'postgres': '^3.4.3'
      },
      devDependencies: {
        'prisma': '^6.11.0',
        'typescript': '^5.0.0',
        '@types/node': '^22.0.0'
      }
    };

    await fs.writeFile(
      path.join(projectDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Create prisma directory
    const prismaDir = path.join(projectDir, 'prisma');
    await fs.mkdir(prismaDir, { recursive: true });

    // Create schema.prisma with our generator
    const generatorPath = path.resolve(process.cwd(), 'dist', 'index.js');
    const schemaContent = `
generator client {
  provider = "prisma-client-js"
}

generator drizzle {
  provider = "${generatorPath}"
  output   = "./generated/drizzle"
  moduleResolution = "nodeNext"
  formatter = "none"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

${schema}
`;

    const schemaPath = path.join(prismaDir, 'schema.prisma');
    await fs.writeFile(schemaPath, schemaContent.trim());

    // Create .env file
    await fs.writeFile(
      path.join(projectDir, '.env'),
      `DATABASE_URL="${databaseUrl}"`
    );

    // Create tsconfig.json
    const tsConfig = {
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        strict: true,
        skipLibCheck: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true
      },
      include: ['**/*.ts'],
      exclude: ['node_modules']
    };

    await fs.writeFile(
      path.join(projectDir, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );

    return {
      projectDir,
      schemaPath,
      databaseUrl,
      generatedPath: path.join(projectDir, 'prisma', 'generated', 'drizzle')
    };
  }

  /**
   * Install dependencies in project
   */
  static async installDependencies(projectDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const childProcess = spawn('bun', ['install'], {
        cwd: projectDir,
        stdio: 'pipe'
      });

      childProcess.on('close', (code: number | null) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`bun install failed with code ${code}`));
        }
      });
    });
  }

  /**
   * Clean up project
   */
  static async cleanupProject(projectDir: string): Promise<void> {
    await fs.rm(projectDir, { recursive: true, force: true });
  }
}