import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  STORAGE_KEY,
  createDebouncedProgressSaver,
  createInitialProgress,
  getFirstIncompleteQuestionId,
  isTrialComplete,
  loadProgress,
  resetProgress,
  saveProgress,
} from '../../src/js/modules/progress-store.js';

const createStorage = (initialValue = null) => {
  let value = initialValue;

  return {
    getItem: vi.fn(() => value),
    removeItem: vi.fn(() => {
      value = null;
    }),
    setItem: vi.fn((_key, nextValue) => {
      value = nextValue;
    }),
  };
};

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('progress store', () => {
  it('saves and restores the current problem, completed problems, and all answers', () => {
    const storage = createStorage();
    const progress = {
      currentQuestionId: 'question-2',
      completedQuestionIds: ['question-1'],
      answers: {
        'question-1': 'println',
        'question-2': 'System.out.',
        'question-3': '',
      },
    };

    saveProgress(progress, storage);

    expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEY, expect.any(String));
    expect(loadProgress(storage)).toEqual(progress);
  });

  it('returns a safe initial state for broken JSON', () => {
    expect(loadProgress(createStorage('{broken'))).toEqual(createInitialProgress());
  });

  it('ignores unknown ids and invalid answer values', () => {
    const storage = createStorage(
      JSON.stringify({
        currentQuestionId: 'unknown',
        completedQuestionIds: ['question-1', 'unknown'],
        answers: { 'question-1': 'println', 'question-2': 42, unknown: 'value' },
      }),
    );

    expect(loadProgress(storage)).toEqual({
      currentQuestionId: 'question-2',
      completedQuestionIds: ['question-1'],
      answers: { 'question-1': 'println', 'question-2': '', 'question-3': '' },
    });
  });

  it('removes duplicate completions and resumes the first incomplete problem', () => {
    const storage = createStorage(
      JSON.stringify({
        currentQuestionId: 'question-1',
        completedQuestionIds: ['question-1', 'question-1'],
        answers: {},
      }),
    );

    expect(loadProgress(storage)).toEqual({
      currentQuestionId: 'question-2',
      completedQuestionIds: ['question-1'],
      answers: { 'question-1': '', 'question-2': '', 'question-3': '' },
    });
  });

  it('keeps a valid saved incomplete problem as the resume position', () => {
    const storage = createStorage(
      JSON.stringify({
        currentQuestionId: 'question-3',
        completedQuestionIds: ['question-1'],
        answers: {},
      }),
    );

    expect(loadProgress(storage).currentQuestionId).toBe('question-3');
  });

  it('uses the last problem when completed data has an unknown current id', () => {
    const storage = createStorage(
      JSON.stringify({
        currentQuestionId: 'unknown',
        completedQuestionIds: ['question-1', 'question-2', 'question-3'],
        answers: {},
      }),
    );

    expect(loadProgress(storage).currentQuestionId).toBe('question-3');
  });

  it('calculates the first incomplete problem and full completion', () => {
    const progress = createInitialProgress();
    expect(getFirstIncompleteQuestionId(progress)).toBe('question-1');
    expect(isTrialComplete(progress)).toBe(false);

    progress.completedQuestionIds = ['question-1', 'question-2', 'question-3'];
    expect(getFirstIncompleteQuestionId(progress)).toBeUndefined();
    expect(isTrialComplete(progress)).toBe(true);
  });

  it('removes the saved value and returns the initial state on reset', () => {
    const storage = createStorage('{}');
    expect(resetProgress(storage)).toEqual(createInitialProgress());
    expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('keeps operating when storage APIs throw errors', () => {
    const unavailableStorage = {
      getItem: vi.fn(() => {
        throw new Error('unavailable');
      }),
      removeItem: vi.fn(() => {
        throw new Error('unavailable');
      }),
      setItem: vi.fn(() => {
        throw new Error('unavailable');
      }),
    };

    expect(loadProgress(unavailableStorage)).toEqual(createInitialProgress());
    expect(() => saveProgress(createInitialProgress(), unavailableStorage)).not.toThrow();
    expect(resetProgress(unavailableStorage)).toEqual(createInitialProgress());
  });

  it('debounces input saves and can cancel a pending save', () => {
    vi.useFakeTimers();
    vi.stubGlobal('window', {
      clearTimeout: globalThis.clearTimeout,
      setTimeout: globalThis.setTimeout,
    });
    const storage = createStorage();
    const saver = createDebouncedProgressSaver(storage, 100);
    const progress = createInitialProgress();

    saver.schedule(progress);
    saver.schedule(progress);
    vi.advanceTimersByTime(99);
    expect(storage.setItem).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(storage.setItem).toHaveBeenCalledTimes(1);

    saver.flush(progress);
    expect(storage.setItem).toHaveBeenCalledTimes(2);

    saver.schedule(progress);
    saver.cancel();
    vi.runAllTimers();
    expect(storage.setItem).toHaveBeenCalledTimes(2);
  });
});
