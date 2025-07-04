import { describe, it, expect } from 'vitest';

describe('Basic Test Infrastructure', () => {
  it('should run basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle async tests', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });

  it('should support object matching', () => {
    const user = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    };

    expect(user).toEqual({
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    });
  });

  it('should support array operations', () => {
    const numbers = [1, 2, 3, 4, 5];
    
    expect(numbers).toHaveLength(5);
    expect(numbers).toContain(3);
    expect(numbers.filter(n => n % 2 === 0)).toEqual([2, 4]);
  });
});