import { describe, expect, it } from 'vitest';
import { resolveHint } from '../../src/js/modules/hint-resolver.js';
import { QUESTIONS } from '../../src/js/modules/questions.js';

const lineQuestion = QUESTIONS[1];

describe('hint resolver', () => {
  it.each([
    ['', 'empty'],
    ['System.out.print("Hello, Java!");', 'command'],
    ['system.out.println("Hello, Java!");', 'case'],
    ['System.out.println(Hello, Java!);', 'quotes'],
    ['System.out.println("Hello, Java!")', 'semicolon'],
    ['System.out.println("Hi!");', 'display-text'],
    ['System.out.println ("Hello, Java!");', 'common'],
  ])('classifies %j as %s in the required priority', (answer, expectedType) => {
    expect(resolveHint(answer, lineQuestion).type).toBe(expectedType);
  });

  it('uses a question-specific command hint for the fragment answer', () => {
    expect(resolveHint('print', QUESTIONS[0]).type).toBe('command');
    expect(resolveHint('printLn', QUESTIONS[0]).type).toBe('case');
  });
});
