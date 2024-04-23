import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';
import CodeEditor from '../../components/CodeEditor/CodeEditor';

const GamePage = () => {
  const [language, setLanguage] = useState('cpp');

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  return (
    <div className="container">
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="select-label-language">Language</InputLabel>
          <Select
            labelId="select-label-language"
            id="select-label-language"
            value={language}
            label="Language"
            onChange={handleChange}
          >
            <MenuItem value={'javascript'}>JavaScript</MenuItem>
            <MenuItem value={'typescript'}>TypeScript</MenuItem>
            <MenuItem value={'python'}>Python</MenuItem>
            <MenuItem value={'java'}>Java</MenuItem>
            <MenuItem value={'csharp'}>C#</MenuItem>
            <MenuItem value={'cpp'}>C++</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <CodeEditor language={language} />
    </div>
  );
};
export default GamePage;
