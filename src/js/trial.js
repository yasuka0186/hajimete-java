import '../scss/style.scss';
import { validateAnswer } from './modules/answer-validator.js';
import { resolveHint } from './modules/hint-resolver.js';
import { QUESTIONS, getQuestionById } from './modules/questions.js';
import {
  bindTrialEvents,
  getActiveAnswer,
  renderCorrectFeedback,
  renderIncorrectFeedback,
  renderProgress,
  renderQuestion,
} from './modules/trial-view.js';

document.documentElement.classList.add('js-enabled');

const state = {
  currentQuestionId: QUESTIONS[0].id,
  completedQuestionIds: [],
  answers: Object.fromEntries(QUESTIONS.map(({ id }) => [id, ''])),
};

const getCurrentQuestion = () => getQuestionById(state.currentQuestionId) ?? QUESTIONS[0];

const handleSubmit = () => {
  const question = getCurrentQuestion();
  const answer = getActiveAnswer(question);
  const result = validateAnswer(answer, question.expectedAnswer);
  state.answers[question.id] = answer;

  if (!result.isCorrect) {
    renderIncorrectFeedback(resolveHint(result.normalizedAnswer, question));
    return;
  }

  if (!state.completedQuestionIds.includes(question.id)) {
    state.completedQuestionIds.push(question.id);
  }

  const hasNextQuestion = question.step < QUESTIONS.length;
  renderProgress(state);
  renderCorrectFeedback(question, hasNextQuestion);
};

const handleNext = () => {
  const question = getCurrentQuestion();
  const nextQuestion = QUESTIONS[question.step];

  if (!state.completedQuestionIds.includes(question.id) || !nextQuestion) {
    return;
  }

  state.currentQuestionId = nextQuestion.id;
  renderQuestion(state);
};

bindTrialEvents({
  onAnswerChange: (answer) => {
    state.answers[state.currentQuestionId] = answer;
  },
  onNext: handleNext,
  onSubmit: handleSubmit,
});

renderQuestion(state);
