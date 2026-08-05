import { describe, expect, it } from 'vitest';
import { normalizeAnswer, validateAnswer } from '../../src/js/modules/answer-validator.js';
import { QUESTIONS } from '../../src/js/modules/questions.js';

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

  it.each(QUESTIONS)('accepts the expected answer for $id with surrounding whitespace', (question) => {
    expect(validateAnswer(`\n\t${question.expectedAnswer}\u3000`, question.expectedAnswer)).toEqual({
      isCorrect: true,
      normalizedAnswer: question.expectedAnswer,
    });
  });

  it.each([
    ['println\nextra', 'println'],
    ['System.out.println( "Hello, Java!");', 'System.out.println("Hello, Java!");'],
    ['SYSTEM.out.println("Hello, Java!");', 'System.out.println("Hello, Java!");'],
    ['System.out.println("Java をはじめよう");', 'System.out.println("Javaをはじめよう");'],
  ])('rejects an internal notation difference in %j', (answer, expectedAnswer) => {
    expect(validateAnswer(answer, expectedAnswer).isCorrect).toBe(false);
  });
});
