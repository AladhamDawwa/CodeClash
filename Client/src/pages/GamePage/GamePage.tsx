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
import Timer from '../../components/Timer/Timer';
import Container from '@mui/material/Container';
import NavBar from '../../components/NavBar/NavBar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import data from './problem.json';
import '../../index.css';
const GamePage = () => {
  const [language, setLanguage] = useState('cpp');

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  return (
    <>
      <NavBar
        rankImg={'/assets/bronze.svg'}
        rankAmount={200}
        userImg={'/assets/user-1.jpg'}
      />

      <Container maxWidth="xl">
        <Stack direction={'column'}>
          <Stack direction={'column'} alignItems={'center'}>
            <Timer />
            <Box
              display={'flex'}
              justifyContent={'space-around'}
              alignItems={'center'}
              width={'33rem'}
              height={'5.5rem'}
              mt={3.3}
              mb={7}
              sx={{
                backgroundColor: '#383560',
                borderRadius: '0.5rem',
                boxShadow: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#0F0C29',
                  textTransform: 'capitalize',
                  color: 'white',
                  width: '8.5rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '1.7rem',
                  fontWeight: '400',
                }}
                disableRipple
                disableElevation
              >
                <img src="assets/run.svg" alt="run icon" />
                run
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#0F0C29',
                  textTransform: 'capitalize',
                  color: '#2CBB5D',
                  width: '11rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '1.6rem',
                  fontWeight: '400',
                }}
                disableRipple
                disableElevation
              >
                <img src="assets/submit.svg" alt="run icon" />
                submit
              </Button>
            </Box>
            <Stack direction={'row'} spacing={20}>
              <Box
                width={'80rem'}
                height={1080}
                sx={{
                  backgroundColor: '#0F0C29',
                  borderRadius: '1.3rem',
                  boxShadow: ' 0 0 0.3rem',
                }}
              >
                <Box
                  width={'100%'}
                  height={'5rem'}
                  display={'flex'}
                  alignItems={'center'}
                  sx={{
                    backgroundColor: '#24243e',
                    borderRadius: '1.3rem 1.3rem 0 0  ',
                  }}
                >
                  <Stack
                    ml={'3rem'}
                    direction={'row'}
                    spacing={1.5}
                    justifyContent={'start'}
                    color={'white'}
                    fontSize={'1.8rem'}
                    textTransform={'capitalize'}
                  >
                    <Stack
                      alignContent={'center'}
                      direction={'row'}
                      spacing={0.5}
                    >
                      <DescriptionOutlinedIcon sx={{ fontSize: '2rem' }} />
                      <p>description</p>
                    </Stack>
                    <p>|</p>
                    <Stack
                      alignContent={'center'}
                      direction={'row'}
                      spacing={0.5}
                    >
                      <HistoryOutlinedIcon sx={{ fontSize: '2rem' }} />
                      <p>submissions</p>
                    </Stack>
                  </Stack>
                </Box>
                <p
                  style={{
                    color: 'white',
                    textTransform: 'capitalize',
                    fontSize: '2rem',
                    marginLeft: '3rem',
                    marginTop: '2.5rem',
                    fontWeight: '700',
                  }}
                >
                  {data.header.title}
                </p>
              </Box>
              <Box
                width={'80rem'}
                height={1080}
                sx={{ backgroundColor: '#0F0C29' }}
              ></Box>
            </Stack>
          </Stack>
        </Stack>
        {/* <Box display="flex" flexDirection="column" width="100%">
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
        <CodeEditor language={language} />
      </Box> */}
      </Container>
    </>
  );
};
export default GamePage;
