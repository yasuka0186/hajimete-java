import { describe, expect, it } from 'vitest';
import { QUESTIONS, getQuestionById } from '../../src/js/modules/questions.js';

describe('question data', () => {
  it('defines three questions in the required learning order', () => {
    expect(QUESTIONS.map(({ id, inputType }) => ({ id, inputType }))).toEqual([
      { id: 'question-1', inputType: 'fragment' },
      { id: 'question-2', inputType: 'line' },
      { id: 'question-3', inputType: 'line' },
    ]);
  });

  it('finds a question by its stable id', () => {
    expect(getQuestionById('question-2')?.step).toBe(2);
  });
});

