import Editor, { useMonaco } from '@monaco-editor/react';
import 'monaco-themes/themes/Blackboard.json';
import { useEffect, useState } from 'react';
import './style.css';
const CodeEditor = ({ language }: { language: string }) => {
  const [code, setCode] = useState(`// Write your ${language} code here`);
  const monaco = useMonaco();

  useEffect(() => {
    setCode(
      `${language === 'python' ? '#' : '//'} Write your ${language} code here`,
    );
    if (monaco) {
      console.log('here is the monaco isntance:', monaco);
      import('monaco-themes/themes/Blackboard.json')
        .then((data: any) => {
          monaco.editor.defineTheme('Blackboard', data);
        })
        .then(_ => monaco.editor.setTheme('Blackboard'));
    }
  }, [monaco, language]);

  const handleEditorChange = (value: string | undefined, event: any) => {
    // TODO: Handle code change and send it to the server
    console.log('handleEditorChange value', value);
  };

  return (
    <Editor
      height="36rem"
      width="78rem"
      defaultLanguage="cpp"
      language={language}
      value={code}
      onChange={handleEditorChange}
      theme="Blackboard"
    />
  );
};

export default CodeEditor;
