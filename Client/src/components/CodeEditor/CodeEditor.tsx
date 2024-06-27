import Editor, { useMonaco } from '@monaco-editor/react';
import 'monaco-themes/themes/Blackboard.json';
import { useEffect, useState } from 'react';
import './style.css';
import { Button } from '@mui/material';
import { decode, encode } from 'js-base64';
import socket from '../../socket';
const CodeEditor = ({ language, gameID }: { language: string, gameID : string }) => {
  const [code, setCode] = useState(`// Write your ${language} code here`);
  const monaco = useMonaco();

  useEffect(() => {
    setCode(
      `${language === 'python' ? '#' : '//'} Write your ${language} code here`,
    );
    if (monaco) {
      // console.log('here is the monaco isntance:', monaco);
      import('monaco-themes/themes/Blackboard.json')
        .then((data: any) => {
          monaco.editor.defineTheme('Blackboard', data);
        })
        .then(_ => monaco.editor.setTheme('Blackboard'));
    }
  }, [monaco, language]);

  const handleEditorChange = (value: string | undefined, event: any) => {
    // TODO: Handle code change and send it to the server
    setCode(value ? value : '');
    // console.log('handleEditorChange value', value);
  };

  const handleSubmission = () => {
    // const encoded = Buffer.from(code, "utf8").toString("base64");
    const encoded = encode(code);
    // console.log(encoded);
    socket.emit('uvu_game_server:submit_problem', 
      JSON.stringify({ source_code: encoded, game_id: gameID, language_id: 52 }), (response: any) => {
      console.log('response', response);
    });

    socket.on('uvu_game_client:send_game_result', (data: any) => {
      console.log('game result', data);
    });
  };

  return (
    <>
      <Button
        onClick={handleSubmission}
      >
        <h1>Run</h1>
      </Button>
      <Editor
        height="100rem"
        width="78rem"
        defaultLanguage="cpp"
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme="Blackboard"
      />
    </>
  );
};

export default CodeEditor;
