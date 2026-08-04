import { describe, expect, it } from 'vitest';
import { normalizeAnswer, validateAnswer } from '../../src/js/modules/answer-validator.js';

describe('answer validator', () => {
  it('removes only leading and trailing whitespace and newlines', () => {
    expect(normalizeAnswer('\n  System.out.println("Hello, Java!"); \t')).toBe(
      'System.out.println("Hello, Java!");',
    );
    expect(normalizeAnswer('System.out. println')).toBe('System.out. println');
  });

  it('accepts an exact normalized answer and rejects an internal difference', () => {
    expect(validateAnswer('  println\n', 'println').isCorrect).toBe(true);
    expect(validateAnswer('printLn', 'println').isCorrect).toBe(false);
  });
});
