export const normalizeAnswer = (answer) => answer.trim();

export const validateAnswer = (answer, expectedAnswer) => {
  const normalizedAnswer = normalizeAnswer(answer);

  return {
    isCorrect: normalizedAnswer === expectedAnswer,
    normalizedAnswer,
  };
};
