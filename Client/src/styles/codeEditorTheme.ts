const blackboardTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: 'ffa500', fontStyle: 'italic' },
    { token: 'comment.js', foreground: '008000', fontStyle: 'bold' },
    { token: 'comment.css', foreground: '008000' },
    { token: 'comment.scss', foreground: '008000' },
    { token: 'comment.html', foreground: '008000' },
    { token: 'comment.ts', foreground: '008000' },
    { token: 'comment.tsx', foreground: '008000' },
    { token: 'comment.c', foreground: '008000' },
    { token: 'comment.cpp', foreground: '008000' },
    { token: 'comment.java', foreground: '008000' },
    { token: 'comment.csharp', foreground: '008000' },
    { token: 'comment.python', foreground: '008000' },
    { token: 'comment.json', foreground: '008000' },
    { token: 'comment.sql', foreground: '008000' },
  ],
  colors: {
    'editor.foreground': '#D4D4D4',
    'editor.background': '#0C1021',
    'editor.selectionBackground': '#DDF0FF33',
    'editor.lineHighlightBackground': '#FFFFFF08',
    'editorCursor.foreground': '#A7A7A7',
    'editorWhitespace.foreground': '#FFFFFF40',
  },
};

export default blackboardTheme;
