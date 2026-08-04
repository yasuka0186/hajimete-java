import { QUESTIONS, getQuestionById } from './questions.js';

const elements = {
  answerForm: document.querySelector('[data-answer-form]'),
  codePrefix: document.querySelector('[data-code-prefix]'),
  codeSuffix: document.querySelector('[data-code-suffix]'),
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
  progressbar: document.querySelector('[data-progressbar]'),
  prompt: document.querySelector('[data-question-prompt]'),
  resultMessage: document.querySelector('[data-result-message]'),
  resultTitle: document.querySelector('[data-result-title]'),
  step: document.querySelector('[data-question-step]'),
  title: document.querySelector('[data-question-title]'),
};

const renderProgressNavigation = ({ currentQuestionId, completedQuestionIds }) => {
  elements.navigation.replaceChildren();

  QUESTIONS.forEach((question) => {
    const isCurrent = question.id === currentQuestionId;
    const isCompleted = completedQuestionIds.includes(question.id);
    const item = document.createElement('li');
    const button = document.createElement('button');
    const status = isCompleted ? '完了' : isCurrent ? '現在の問題' : '未着手';

    button.type = 'button';
    button.className = 'p-trial-progress__button';
    button.disabled = true;

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

    item.append(button);
    elements.navigation.append(item);
  });
};

export const renderProgress = (state) => {
  elements.progressbar.value = state.completedQuestionIds.length;
  renderProgressNavigation(state);
};

const resetFeedback = () => {
  elements.feedback.hidden = true;
  elements.feedback.classList.remove('p-trial-feedback--correct', 'p-trial-feedback--incorrect');
  elements.hint.hidden = true;
  elements.explanation.hidden = true;
  elements.console.hidden = true;
  elements.nextQuestion.hidden = true;
};

export const getActiveAnswer = (question) =>
  question.inputType === 'fragment' ? elements.fragmentInput.value : elements.lineInput.value;

export const renderQuestion = (state) => {
  const question = getQuestionById(state.currentQuestionId) ?? QUESTIONS[0];
  const isFragment = question.inputType === 'fragment';

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
  renderProgress(state);

  (isFragment ? elements.fragmentInput : elements.lineInput).focus();
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
  elements.feedback.focus();
};

export const renderCorrectFeedback = (question, hasNextQuestion) => {
  elements.feedback.hidden = false;
  elements.feedback.classList.remove('p-trial-feedback--incorrect');
  elements.feedback.classList.add('p-trial-feedback--correct');
  elements.resultTitle.textContent = '正解！';
  elements.resultMessage.textContent = 'コードを正しく完成できました。';
  elements.hint.hidden = true;
  elements.explanationText.textContent = question.explanation;
  elements.explanation.hidden = false;
  elements.consoleOutput.textContent = question.expectedOutput;
  elements.console.hidden = false;
  elements.nextQuestion.hidden = !hasNextQuestion;
  elements.feedback.focus();
};

export const bindTrialEvents = ({ onAnswerChange, onNext, onSubmit }) => {
  elements.answerForm.addEventListener('input', (event) => onAnswerChange(event.target.value));
  elements.answerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    onSubmit();
  });
  elements.answerForm.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      onSubmit();
    }
  });
  elements.nextQuestion.addEventListener('click', onNext);
};
