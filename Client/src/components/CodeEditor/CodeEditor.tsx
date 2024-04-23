import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import blackboardTheme from '../../styles/codeEditorTheme';

const CodeEditor = ({ language }: { language: string }) => {
  const [code, setCode] = useState(`// Write your ${language} code here`);

  function handleEditorWillMount(monaco: any) {
    monaco.editor.defineTheme('blackboard', blackboardTheme);
  }

  useEffect(() => {
    setCode(
      `${language === 'python' ? '#' : '//'} Write your ${language} code here`,
    );
  }, [language]);

  const handleEditorChange = (value: string | undefined, event: any) => {
    // TODO: Handle code change and send it to the server
    console.log('handleEditorChange value', value);
  };

  return (
    <Editor
      height="50%"
      width="50%"
      defaultLanguage="cpp"
      language={language}
      value={code}
      onChange={handleEditorChange}
      theme="blackboard"
      beforeMount={handleEditorWillMount}
    />
  );
};

export default CodeEditor;
