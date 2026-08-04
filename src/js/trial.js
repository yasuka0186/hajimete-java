import '../scss/style.scss';
import { QUESTIONS } from './modules/questions.js';
import { renderQuestion } from './modules/trial-view.js';

document.documentElement.classList.add('js-enabled');

const initialState = {
  currentQuestionId: QUESTIONS[0].id,
  completedQuestionIds: [],
  answers: Object.fromEntries(QUESTIONS.map(({ id }) => [id, ''])),
};

renderQuestion(initialState);
