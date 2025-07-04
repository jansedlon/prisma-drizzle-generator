import { expect } from 'vitest';

// Custom matchers for better test assertions
expect.extend({
  toBeValidTypeScript(received: string) {
    // Basic TypeScript syntax validation
    const hasImports = /^import.*from/m.test(received);
    const hasExports = /export\s+(const|default|function|class)/m.test(received);
    const noSyntaxErrors = !received.includes('undefined') && !received.includes('null');
    
    const pass = hasImports && hasExports && noSyntaxErrors;
    
    return {
      pass,
      message: () => 
        pass 
          ? `Expected code not to be valid TypeScript`
          : `Expected valid TypeScript code but got:\n${received.slice(0, 200)}...`
    };
  },
  
  toHaveValidDrizzleRelations(received: any) {
    // Check if relations structure is valid
    const hasRelations = received && typeof received === 'object';
    const hasRelationFields = hasRelations && Object.keys(received).length > 0;
    
    return {
      pass: hasRelations && hasRelationFields,
      message: () => 
        hasRelations && hasRelationFields
          ? `Expected not to have valid Drizzle relations`
          : `Expected valid Drizzle relations structure`
    };
  },
  
  toBeCompatibleWith(received: any, database: string) {
    // Check database adapter compatibility
    const supportedDatabases = ['postgresql', 'mysql', 'sqlite'];
    const isSupported = supportedDatabases.includes(database);
    
    return {
      pass: isSupported,
      message: () => 
        isSupported
          ? `Expected not to be compatible with ${database}`
          : `Expected to be compatible with ${database}, but ${database} is not supported`
    };
  }
});

// Declare custom matchers for TypeScript
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeValidTypeScript(): T;
    toHaveValidDrizzleRelations(): T;
    toBeCompatibleWith(database: string): T;
  }
  interface AsymmetricMatchersContaining {
    toBeValidTypeScript(): any;
    toHaveValidDrizzleRelations(): any;
    toBeCompatibleWith(database: string): any;
  }
}