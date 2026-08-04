const HINT_TYPES = {
  EMPTY: 'empty',
  COMMAND: 'command',
  CASE: 'case',
  QUOTES: 'quotes',
  SEMICOLON: 'semicolon',
  DISPLAY_TEXT: 'display-text',
  COMMON: 'common',
};

const HINT_MESSAGES = {
  [HINT_TYPES.EMPTY]: 'まずは入力欄にコードを書いてみましょう。学習ポイントも手がかりになります。',
  [HINT_TYPES.QUOTES]: '表示したい文字は、半角のダブルクォーテーション（"）で囲みます。',
  [HINT_TYPES.SEMICOLON]: '命令の終わりに、半角のセミコロン（;）を付けましょう。',
  [HINT_TYPES.COMMON]: '「命令」「丸かっこ」「表示する文字」「セミコロン」の順に、模範の形と見比べてみましょう。',
};

const getCommandHint = (question) =>
  question.inputType === 'fragment'
    ? '空欄には、改行付きで文字を表示する「println」を小文字で入力します。'
    : '文字を表示する命令を確認しましょう。「System.out.println」の順に、続けて書きます。';

const getCaseHint = (question) =>
  question.inputType === 'fragment'
    ? 'Javaでは大文字と小文字を区別します。「println」はすべて小文字で書きます。'
    : 'Javaでは大文字と小文字を区別します。「System」のSだけが大文字で、ほかの命令は小文字です。';

const hasCommandTypo = (answer, question) => {
  if (question.inputType === 'fragment') {
    return answer.toLowerCase() !== 'println';
  }

  const lowerAnswer = answer.toLowerCase();
  return !lowerAnswer.includes('system.out') || !lowerAnswer.includes('println');
};

const hasCaseError = (answer, question) => {
  if (question.inputType === 'fragment') {
    return answer.toLowerCase() === question.expectedAnswer.toLowerCase();
  }

  return (
    answer.toLowerCase().includes('system.out.println') &&
    !answer.includes('System.out.println')
  );
};

export const resolveHint = (answer, question) => {
  if (answer === '') {
    return { type: HINT_TYPES.EMPTY, message: HINT_MESSAGES[HINT_TYPES.EMPTY] };
  }

  if (hasCommandTypo(answer, question)) {
    return { type: HINT_TYPES.COMMAND, message: getCommandHint(question) };
  }

  if (hasCaseError(answer, question)) {
    return { type: HINT_TYPES.CASE, message: getCaseHint(question) };
  }

  if (question.inputType === 'line' && !answer.includes('"')) {
    return { type: HINT_TYPES.QUOTES, message: HINT_MESSAGES[HINT_TYPES.QUOTES] };
  }

  if (question.inputType === 'line' && !answer.endsWith(';')) {
    return { type: HINT_TYPES.SEMICOLON, message: HINT_MESSAGES[HINT_TYPES.SEMICOLON] };
  }

  if (question.inputType === 'line') {
    const expectedText = question.expectedOutput;
    const enteredText = answer.match(/"([^"]*)"/)?.[1];

    if (enteredText !== expectedText) {
      return {
        type: HINT_TYPES.DISPLAY_TEXT,
        message: `ダブルクォーテーションの内側を「${expectedText}」にしましょう。`,
      };
    }
  }

  return { type: HINT_TYPES.COMMON, message: HINT_MESSAGES[HINT_TYPES.COMMON] };
};
