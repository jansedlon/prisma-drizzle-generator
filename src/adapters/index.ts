import type { DatabaseAdapter } from '../types/index.js';
import { PostgreSQLAdapter } from './postgresql.js';

export function createDatabaseAdapter(provider: string): DatabaseAdapter {
  switch (provider.toLowerCase()) {
    case 'postgresql':
    case 'postgres':
      return new PostgreSQLAdapter();
    default:
      throw new Error(`Unsupported database provider: ${provider}`);
  }
}

export { PostgreSQLAdapter };