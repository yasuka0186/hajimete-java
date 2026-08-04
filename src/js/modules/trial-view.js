import { QUESTIONS, getQuestionById } from './questions.js';

const elements = {
  count: document.querySelector('[data-question-count]'),
  fragmentField: document.querySelector('[data-fragment-field]'),
  fragmentInput: document.querySelector('[data-fragment-input]'),
  learningPoint: document.querySelector('[data-learning-point]'),
  lineField: document.querySelector('[data-line-field]'),
  lineInput: document.querySelector('[data-line-input]'),
  navigation: document.querySelector('[data-progress-navigation]'),
  progressbar: document.querySelector('[data-progressbar]'),
  prompt: document.querySelector('[data-question-prompt]'),
  step: document.querySelector('[data-question-step]'),
  title: document.querySelector('[data-question-title]'),
  codePrefix: document.querySelector('[data-code-prefix]'),
  codeSuffix: document.querySelector('[data-code-suffix]'),
};

const renderProgressNavigation = ({ currentQuestionId, completedQuestionIds }, onSelect) => {
  elements.navigation.replaceChildren();

  QUESTIONS.forEach((question) => {
    const isCurrent = question.id === currentQuestionId;
    const isCompleted = completedQuestionIds.includes(question.id);
    const item = document.createElement('li');
    const button = document.createElement('button');
    const status = isCompleted ? '完了' : isCurrent ? '現在の問題' : '未着手';

    button.type = 'button';
    button.className = 'p-trial-progress__button';
    button.dataset.questionId = question.id;
    button.disabled = !isCompleted || isCurrent;
    button.innerHTML = `<span>${question.step}</span><strong>問題${question.step}</strong><small>${status}</small>`;

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

export const renderQuestion = (state, onSelect = () => {}) => {
  const question = getQuestionById(state.currentQuestionId) ?? QUESTIONS[0];
  const isFragment = question.inputType === 'fragment';
  const completedCount = state.completedQuestionIds.length;

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
  elements.progressbar.value = completedCount;

  renderProgressNavigation(state, onSelect);
};
