import '../scss/style.scss';
import { validateAnswer } from './modules/answer-validator.js';
import { resolveHint } from './modules/hint-resolver.js';
import {
  focusActiveAnswer,
  focusCompletion,
  focusPageTitle,
  focusResult,
} from './modules/focus-manager.js';
import {
  createDebouncedProgressSaver,
  getFirstIncompleteQuestionId,
  isTrialComplete,
  loadProgress,
  resetProgress,
} from './modules/progress-store.js';
import { QUESTIONS, getQuestionById } from './modules/questions.js';
import {
  bindTrialEvents,
  getActiveAnswer,
  prepareAnswerEdit,
  renderCompletion,
  renderCorrectFeedback,
  renderIncorrectFeedback,
  renderProgress,
  renderQuestion,
} from './modules/trial-view.js';

document.documentElement.classList.add('js-enabled');

let state = loadProgress();
let mode = isTrialComplete(state) ? 'completion' : 'learning';
let returnQuestionId = getFirstIncompleteQuestionId(state);
const progressSaver = createDebouncedProgressSaver();

const getCurrentQuestion = () => getQuestionById(state.currentQuestionId) ?? QUESTIONS[0];

const openQuestion = (questionId, nextMode) => {
  state.currentQuestionId = questionId;
  mode = nextMode;
  progressSaver.flush(state);
  renderQuestion(state, { mode, onSelect: handleReview });
  if (mode === 'review') {
    focusResult();
  } else {
    focusActiveAnswer(getCurrentQuestion().inputType);
  }
};

function handleReview(questionId) {
  if (!state.completedQuestionIds.includes(questionId)) {
    return;
  }

  if (mode === 'learning') {
    returnQuestionId = state.currentQuestionId;
  } else if (mode === 'completion') {
    returnQuestionId = undefined;
  }

  openQuestion(questionId, 'review');
}

const returnToLearning = () => {
  const nextQuestionId = returnQuestionId ?? getFirstIncompleteQuestionId(state);

  if (!nextQuestionId || isTrialComplete(state)) {
    mode = 'completion';
    progressSaver.flush(state);
    renderCompletion(state, handleReview);
    focusCompletion();
    return;
  }

  openQuestion(nextQuestionId, 'learning');
};

const handleSubmit = () => {
  if (mode === 'review') {
    return;
  }

  const question = getCurrentQuestion();
  const answer = getActiveAnswer(question);
  const result = validateAnswer(answer, question.expectedAnswer);
  state.answers[question.id] = answer;

  if (!result.isCorrect) {
    progressSaver.flush(state);
    renderIncorrectFeedback(question, resolveHint(result.normalizedAnswer, question));
    focusResult();
    return;
  }

  if (!state.completedQuestionIds.includes(question.id)) {
    state.completedQuestionIds.push(question.id);
  }

  progressSaver.flush(state);
  renderProgress(state, handleReview);

  if (mode === 'retry') {
    renderCorrectFeedback(question, '学習に戻る');
    focusResult();
    return;
  }

  renderCorrectFeedback(question, question.step < QUESTIONS.length ? '次の問題へ' : '結果を見る');
  focusResult();
};

const handleNext = () => {
  if (mode === 'review' || mode === 'retry') {
    returnToLearning();
    return;
  }

  const question = getCurrentQuestion();

  if (!state.completedQuestionIds.includes(question.id)) {
    return;
  }

  const nextQuestion = QUESTIONS[question.step];
  if (!nextQuestion) {
    mode = 'completion';
    progressSaver.flush(state);
    renderCompletion(state, handleReview);
    focusCompletion();
    return;
  }

  returnQuestionId = nextQuestion.id;
  openQuestion(nextQuestion.id, 'learning');
};

const handleRetry = () => {
  mode = 'retry';
  progressSaver.flush(state);
  renderQuestion(state, { mode, onSelect: handleReview });
  focusActiveAnswer(getCurrentQuestion().inputType);
};

const handleReset = () => {
  if (!window.confirm('保存した回答と進捗を削除して、最初からやり直しますか？')) {
    return;
  }

  progressSaver.cancel();
  state = resetProgress();
  mode = 'learning';
  returnQuestionId = state.currentQuestionId;
  renderQuestion(state, { mode, onSelect: handleReview });
  focusPageTitle();
};

bindTrialEvents({
  onAnswerChange: (answer) => {
    if (mode === 'review') {
      return;
    }

    state.answers[state.currentQuestionId] = answer;
    prepareAnswerEdit(getCurrentQuestion());
    progressSaver.schedule(state);
  },
  onNext: handleNext,
  onReset: handleReset,
  onRetry: handleRetry,
  onReviewAll: () => handleReview(QUESTIONS[0].id),
  onSubmit: handleSubmit,
});

if (mode === 'completion') {
  renderCompletion(state, handleReview);
  focusCompletion();
} else {
  renderQuestion(state, { mode, onSelect: handleReview });
  focusActiveAnswer(getCurrentQuestion().inputType);
}
