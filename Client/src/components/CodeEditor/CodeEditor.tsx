import Editor, { useMonaco } from '@monaco-editor/react';
import 'monaco-themes/themes/Blackboard.json';
import { useEffect, useState } from 'react';
import './style.css';
import { Button } from '@mui/material';
import { encode } from 'js-base64';
import socket from '../../socket';
import languages from '../../pages/GamePage/languages.json';
import { useSnackbar } from 'notistack';
import SubmissionStatus from '../../utils/submission_status';
const CodeEditor = ({ languageId, gameID }: any) => {
  const [language, setLanguage] = useState<string>('cpp');
  const [code, setCode] = useState(`// Write your ${language} code here`);
  const monaco = useMonaco();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLanguage(languages.find((lang) => lang.id == Number.parseInt(languageId))?.code || 'C++');
    setCode(
      `${language === 'python' ? '#' : '//'} Write your ${language} code here`,
    );
    if (monaco) {
      import('monaco-themes/themes/Blackboard.json')
        .then((data: any) => {
          monaco.editor.defineTheme('Blackboard', data);
        })
        .then(() => monaco.editor.setTheme('Blackboard'));
    }
  }, [monaco, languageId, language]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value ? value : '');
  };

  const handleSubmission = () => {
    const encoded = encode(code);
    socket.emit('uvu_game_server:submit_problem', 
      JSON.stringify({ source_code: encoded, game_id: gameID, language_id: languageId }), 
      (response: any) => {
        console.log('response', response);
        const message = SubmissionStatus[response.status];
        if (response.status == 3) {
          enqueueSnackbar(message, { variant: 'success' });
        } else if(response.status == 5) {
          enqueueSnackbar(message, { variant: "warning" });
        } else {
          enqueueSnackbar(message, { variant: 'error' });
        }
    });
  };

  return (
    <>
      <Button variant="contained"
        sx={{
          position: 'absolute',
          top: '1.5rem',
          right: '2rem',
          backgroundColor: '#0F0C29',
          textTransform: 'capitalize',
          color: '#2CBB5D',
          width: '11rem',
          height: '5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '1.7rem',
          fontWeight: '400',
          borderRadius: '1rem',
        }}
        disableRipple
        disableElevation
        onClick={handleSubmission}
      >
        <img src="assets/submit.svg" alt="submit icon" />
        submit
      </Button>
      <Editor
        width={'100%'}
        height={'calc(100vh - 15rem)'}
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
