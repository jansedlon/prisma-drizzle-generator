import { describe, it, expect } from 'vitest';

// Simple utility functions for testing
function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
}

function ensurePlural(str: string): string {
  if (str.endsWith('s') && !str.endsWith('us') && !str.endsWith('ss')) {
    return str;
  }
  
  const irregulars: Record<string, string> = {
    'child': 'children',
    'person': 'people', 
    'man': 'men',
    'woman': 'women'
  };
  
  const lower = str.toLowerCase();
  if (irregulars[lower]) {
    return irregulars[lower];
  }
  
  // Handle words ending in s, ss, sh, ch, x, z
  if (str.endsWith('s') || str.endsWith('sh') || str.endsWith('ch') || str.endsWith('x') || str.endsWith('z')) {
    return str + 'es';
  }
  
  if (str.endsWith('y') && str.length > 1 && !['a', 'e', 'i', 'o', 'u'].includes(str[str.length - 2]!)) {
    return str.slice(0, -1) + 'ies';
  }
  
  if (str.endsWith('f')) {
    return str.slice(0, -1) + 'ves';
  }
  if (str.endsWith('fe')) {
    return str.slice(0, -2) + 'ves';
  }
  
  return str + 's';
}

describe('Utility Functions', () => {
  describe('toCamelCase', () => {
    it('should convert first letter to lowercase', () => {
      expect(toCamelCase('User')).toBe('user');
      expect(toCamelCase('UserProfile')).toBe('userProfile');
      expect(toCamelCase('ID')).toBe('iD');
    });

    it('should handle empty string', () => {
      expect(toCamelCase('')).toBe('');
    });

    it('should handle single character', () => {
      expect(toCamelCase('A')).toBe('a');
      expect(toCamelCase('a')).toBe('a');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(toSnakeCase('userId')).toBe('user_id');
      expect(toSnakeCase('userName')).toBe('user_name');
      expect(toSnakeCase('userProfileId')).toBe('user_profile_id');
    });

    it('should handle PascalCase', () => {
      expect(toSnakeCase('UserId')).toBe('user_id');
      expect(toSnakeCase('UserProfileId')).toBe('user_profile_id');
    });

    it('should handle single words', () => {
      expect(toSnakeCase('user')).toBe('user');
      expect(toSnakeCase('User')).toBe('user');
    });

    it('should handle already snake_case', () => {
      expect(toSnakeCase('user_id')).toBe('user_id');
    });
  });

  describe('ensurePlural', () => {
    it('should pluralize regular words', () => {
      expect(ensurePlural('user')).toBe('users');
      expect(ensurePlural('post')).toBe('posts');
      expect(ensurePlural('comment')).toBe('comments');
    });

    it('should handle words ending in y', () => {
      expect(ensurePlural('category')).toBe('categories');
      expect(ensurePlural('company')).toBe('companies');
      expect(ensurePlural('story')).toBe('stories');
    });

    it('should handle irregular plurals', () => {
      expect(ensurePlural('child')).toBe('children');
      expect(ensurePlural('person')).toBe('people');
      expect(ensurePlural('man')).toBe('men');
      expect(ensurePlural('woman')).toBe('women');
    });

    it('should not pluralize already plural words', () => {
      expect(ensurePlural('users')).toBe('users');
      expect(ensurePlural('posts')).toBe('posts');
      expect(ensurePlural('categories')).toBe('categories');
    });

    it('should handle words ending in us or ss', () => {
      expect(ensurePlural('status')).toBe('statuses');
      expect(ensurePlural('class')).toBe('classes');
    });
  });

  describe('Integration Tests', () => {
    it('should handle model name conversions', () => {
      const modelName = 'UserProfile';
      const camelCase = toCamelCase(modelName);
      const snakeCase = toSnakeCase(modelName);
      const plural = ensurePlural(camelCase);

      expect(camelCase).toBe('userProfile');
      expect(snakeCase).toBe('user_profile');
      expect(plural).toBe('userProfiles');
    });

    it('should handle relation name generation', () => {
      const relationName = 'post';
      const plural = ensurePlural(relationName);
      const tableName = toSnakeCase(plural);

      expect(plural).toBe('posts');
      expect(tableName).toBe('posts');
    });
  });
});