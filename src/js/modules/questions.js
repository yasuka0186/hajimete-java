export const QUESTIONS = [
  {
    id: 'question-1',
    step: 1,
    title: '空欄を埋めて、文字を表示しよう',
    prompt: '「Hello, Java!」と表示するために、空欄へ文字を表示する命令を入力してください。',
    learningPoint: 'printlnは、文字を表示したあとに改行する命令です。小文字で入力します。',
    inputType: 'fragment',
    codePrefix: 'System.out.',
    codeSuffix: '("Hello, Java!");',
    expectedAnswer: 'println',
    expectedOutput: 'Hello, Java!',
    explanation: 'printlnは、丸かっこの中に書いた文字を表示し、そのあとで改行する命令です。すべて小文字で書きます。',
  },
  {
    id: 'question-2',
    step: 2,
    title: '文字を表示する1行を完成させよう',
    prompt: '「Hello, Java!」と表示するJavaコードを、1行すべて入力してください。',
    learningPoint: '文字列はダブルクォーテーションで囲み、命令の終わりにはセミコロンを付けます。',
    inputType: 'line',
    expectedAnswer: 'System.out.println("Hello, Java!");',
    expectedOutput: 'Hello, Java!',
    explanation: 'System.out.printlnの丸かっこに文字列を入れ、命令の終わりにセミコロンを付けると、1行の文字出力になります。',
  },
  {
    id: 'question-3',
    step: 3,
    title: '表示する文字を変えてみよう',
    prompt: '「Javaをはじめよう」と表示するJavaコードを、1行すべて入力してください。',
    learningPoint: '命令は第2問と同じです。ダブルクォーテーションの内側に、表示したい文字を書きます。',
    inputType: 'line',
    expectedAnswer: 'System.out.println("Javaをはじめよう");',
    expectedOutput: 'Javaをはじめよう',
    explanation: 'ダブルクォーテーションの内側を書き換えると、同じ命令で表示する文字を変えられます。',
  },
];

export const getQuestionById = (questionId) => QUESTIONS.find(({ id }) => id === questionId);
