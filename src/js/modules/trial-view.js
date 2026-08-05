import { QUESTIONS, getQuestionById } from './questions.js';

const elements = {
  answerForm: document.querySelector('[data-answer-form]'),
  codePrefix: document.querySelector('[data-code-prefix]'),
  codeSuffix: document.querySelector('[data-code-suffix]'),
  completion: document.querySelector('[data-completion]'),
  console: document.querySelector('[data-console]'),
  consoleOutput: document.querySelector('[data-console-output]'),
  count: document.querySelector('[data-question-count]'),
  explanation: document.querySelector('[data-explanation]'),
  explanationText: document.querySelector('[data-explanation-text]'),
  feedback: document.querySelector('[data-feedback]'),
  fragmentField: document.querySelector('[data-fragment-field]'),
  fragmentInput: document.querySelector('[data-fragment-input]'),
  hint: document.querySelector('[data-hint]'),
  hintText: document.querySelector('[data-hint-text]'),
  learningPoint: document.querySelector('[data-learning-point]'),
  lineField: document.querySelector('[data-line-field]'),
  lineInput: document.querySelector('[data-line-input]'),
  navigation: document.querySelector('[data-progress-navigation]'),
  nextQuestion: document.querySelector('[data-next-question]'),
  pageTitle: document.querySelector('[data-page-title]'),
  progressbar: document.querySelector('[data-progressbar]'),
  prompt: document.querySelector('[data-question-prompt]'),
  resetProgress: document.querySelector('[data-reset-progress]'),
  resultMessage: document.querySelector('[data-result-message]'),
  resultTitle: document.querySelector('[data-result-title]'),
  retryQuestion: document.querySelector('[data-retry-question]'),
  reviewAll: document.querySelector('[data-review-all]'),
  reviewNotice: document.querySelector('[data-review-notice]'),
  step: document.querySelector('[data-question-step]'),
  submit: document.querySelector('.p-code-form__submit'),
  title: document.querySelector('[data-question-title]'),
  workspace: document.querySelector('.p-trial-workspace'),
};

const renderProgressNavigation = (state, onSelect, isCompletion = false) => {
  elements.navigation.replaceChildren();

  QUESTIONS.forEach((question) => {
    const isCurrent = !isCompletion && question.id === state.currentQuestionId;
    const isCompleted = state.completedQuestionIds.includes(question.id);
    const item = document.createElement('li');
    const button = document.createElement('button');
    const status = isCurrent ? '現在の問題' : isCompleted ? '完了' : '未着手';

    button.type = 'button';
    button.className = 'p-trial-progress__button';
    button.dataset.questionId = question.id;
    button.disabled = !isCompleted || isCurrent;

    const number = document.createElement('span');
    number.textContent = question.step;
    const label = document.createElement('strong');
    label.textContent = `問題${question.step}`;
    const statusLabel = document.createElement('small');
    statusLabel.textContent = status;
    button.append(number, label, statusLabel);

    if (isCurrent) {
      button.setAttribute('aria-current', 'step');
    }

    if (isCompleted && !isCurrent) {
      button.addEventListener('click', () => onSelect(question.id));
    }

    item.append(button);
    elements.navigation.append(item);
  });
};

export const renderProgress = (state, onSelect, isCompletion = false) => {
  elements.progressbar.value = state.completedQuestionIds.length;
  renderProgressNavigation(state, onSelect, isCompletion);
};

const resetFeedback = () => {
  elements.feedback.hidden = true;
  elements.feedback.classList.remove('p-trial-feedback--correct', 'p-trial-feedback--incorrect');
  elements.hint.hidden = true;
  elements.explanation.hidden = true;
  elements.console.hidden = true;
  elements.nextQuestion.hidden = true;
  elements.retryQuestion.hidden = true;
};

const setEditorReadOnly = (isReadOnly) => {
  elements.fragmentInput.readOnly = isReadOnly;
  elements.lineInput.readOnly = isReadOnly;
  elements.answerForm.classList.toggle('p-code-form--readonly', isReadOnly);
  elements.reviewNotice.hidden = !isReadOnly;
  elements.submit.hidden = isReadOnly;
};

export const getActiveAnswer = (question) =>
  question.inputType === 'fragment' ? elements.fragmentInput.value : elements.lineInput.value;

export const renderQuestion = (state, { mode = 'learning', onSelect = () => {} } = {}) => {
  const question = getQuestionById(state.currentQuestionId) ?? QUESTIONS[0];
  const isFragment = question.inputType === 'fragment';
  const isReview = mode === 'review';

  elements.workspace.hidden = false;
  elements.completion.hidden = true;
  elements.count.textContent = `問題 ${question.step} / ${QUESTIONS.length}`;
  elements.step.textContent = `QUESTION ${question.step}`;
  elements.title.textContent = question.title;
  elements.prompt.textContent = question.prompt;
  elements.learningPoint.textContent = question.learningPoint;
  elements.fragmentField.hidden = !isFragment;
  elements.lineField.hidden = isFragment;
  elements.codePrefix.textContent = question.codePrefix ?? '';
  elements.codeSuffix.textContent = question.codeSuffix ?? '';
  elements.fragmentInput.value = state.answers[question.id] ?? '';
  elements.lineInput.value = state.answers[question.id] ?? '';
  resetFeedback();
  setEditorReadOnly(isReview);
  renderProgress(state, onSelect);

  if (isReview) {
    renderReviewFeedback(question);
  } else {
    (isFragment ? elements.fragmentInput : elements.lineInput).focus();
  }
};

export const renderIncorrectFeedback = (hint) => {
  elements.feedback.hidden = false;
  elements.feedback.classList.remove('p-trial-feedback--correct');
  elements.feedback.classList.add('p-trial-feedback--incorrect');
  elements.resultTitle.textContent = 'もう一度確認してみよう';
  elements.resultMessage.textContent = '入力した内容に、見直せるところがあります。';
  elements.hintText.textContent = hint.message;
  elements.hint.hidden = false;
  elements.explanation.hidden = true;
  elements.console.hidden = true;
  elements.nextQuestion.hidden = true;
  elements.retryQuestion.hidden = true;
  elements.feedback.focus();
};

const showCorrectDetails = (question) => {
  elements.feedback.hidden = false;
  elements.feedback.classList.remove('p-trial-feedback--incorrect');
  elements.feedback.classList.add('p-trial-feedback--correct');
  elements.hint.hidden = true;
  elements.explanationText.textContent = question.explanation;
  elements.explanation.hidden = false;
  elements.consoleOutput.textContent = question.expectedOutput;
  elements.console.hidden = false;
};

export const renderCorrectFeedback = (question, actionLabel) => {
  showCorrectDetails(question);
  elements.resultTitle.textContent = '正解！';
  elements.resultMessage.textContent = 'コードを正しく完成できました。';
  elements.nextQuestion.textContent = actionLabel;
  elements.nextQuestion.hidden = false;
  elements.retryQuestion.hidden = true;
  elements.feedback.focus();
};

export const renderReviewFeedback = (question) => {
  showCorrectDetails(question);
  elements.resultTitle.textContent = '完了した問題';
  elements.resultMessage.textContent = '保存した回答と解説を見直せます。';
  elements.nextQuestion.textContent = '学習に戻る';
  elements.nextQuestion.hidden = false;
  elements.retryQuestion.hidden = false;
};

export const renderCompletion = (state, onSelect) => {
  elements.workspace.hidden = true;
  elements.completion.hidden = false;
  elements.count.textContent = `問題 ${QUESTIONS.length} / ${QUESTIONS.length}`;
  renderProgress(state, onSelect, true);
  elements.completion.focus();
};

export const focusPageTitle = () => elements.pageTitle.focus();

export const bindTrialEvents = (handlers) => {
  elements.answerForm.addEventListener('input', (event) => handlers.onAnswerChange(event.target.value));
  elements.answerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handlers.onSubmit();
  });
  elements.answerForm.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handlers.onSubmit();
    }
  });
  elements.nextQuestion.addEventListener('click', handlers.onNext);
  elements.retryQuestion.addEventListener('click', handlers.onRetry);
  elements.resetProgress.addEventListener('click', handlers.onReset);
  elements.reviewAll.addEventListener('click', handlers.onReviewAll);
};
