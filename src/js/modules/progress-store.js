import { QUESTIONS } from './questions.js';

export const STORAGE_KEY = 'hajimete-java:trial:v1';

const questionIds = QUESTIONS.map(({ id }) => id);

export const createInitialProgress = () => ({
  currentQuestionId: questionIds[0],
  completedQuestionIds: [],
  answers: Object.fromEntries(questionIds.map((id) => [id, ''])),
});

export const getFirstIncompleteQuestionId = (progress) =>
  questionIds.find((id) => !progress.completedQuestionIds.includes(id));

export const isTrialComplete = (progress) =>
  questionIds.every((id) => progress.completedQuestionIds.includes(id));

export const sanitizeProgress = (value) => {
  const initialProgress = createInitialProgress();

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return initialProgress;
  }

  const completedQuestionIds = Array.isArray(value.completedQuestionIds)
    ? [...new Set(value.completedQuestionIds.filter((id) => questionIds.includes(id)))]
    : [];
  const answers = { ...initialProgress.answers };

  if (value.answers && typeof value.answers === 'object' && !Array.isArray(value.answers)) {
    questionIds.forEach((id) => {
      if (typeof value.answers[id] === 'string') {
        answers[id] = value.answers[id];
      }
    });
  }

  const firstIncompleteQuestionId = questionIds.find((id) => !completedQuestionIds.includes(id));
  const savedQuestionIsIncomplete =
    questionIds.includes(value.currentQuestionId) &&
    !completedQuestionIds.includes(value.currentQuestionId);

  return {
    currentQuestionId: firstIncompleteQuestionId
      ? savedQuestionIsIncomplete
        ? value.currentQuestionId
        : firstIncompleteQuestionId
      : questionIds.includes(value.currentQuestionId)
        ? value.currentQuestionId
        : questionIds.at(-1),
    completedQuestionIds,
    answers,
  };
};

export const loadProgress = (storage = window.localStorage) => {
  try {
    const savedValue = storage.getItem(STORAGE_KEY);
    return savedValue ? sanitizeProgress(JSON.parse(savedValue)) : createInitialProgress();
  } catch {
    return createInitialProgress();
  }
};

export const saveProgress = (progress, storage = window.localStorage) => {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(sanitizeProgress(progress)));
  } catch {
    // 保存できない環境でも、ページ内の学習操作は継続できるようにする。
  }
};

export const createDebouncedProgressSaver = (storage = window.localStorage, delay = 250) => {
  let timeoutId;

  return {
    cancel() {
      window.clearTimeout(timeoutId);
    },
    flush(progress) {
      window.clearTimeout(timeoutId);
      saveProgress(progress, storage);
    },
    schedule(progress) {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => saveProgress(progress, storage), delay);
    },
  };
};

export const resetProgress = (storage = window.localStorage) => {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // 削除できない環境でも、呼び出し側で表示状態は初期化する。
  }

  return createInitialProgress();
};
