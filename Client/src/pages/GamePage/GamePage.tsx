import { useState } from 'react';
import '../../index.css';
import './styles.css';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Button,
} from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import CodeIcon from '@mui/icons-material/Code';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CodeEditor from '../../components/CodeEditor/CodeEditor';
import Timer from '../../components/Timer/Timer';
import NavBar from '../../components/NavBar/NavBar';
import data from './problem.json';
import ProblemDescription from './ProblemDescription';
import ProblemSubmissions from './ProblemSubmissions';
interface TestCase {
  test_type: number;
  input: string;
  output: string;
}
const GamePage = () => {
  const [language, setLanguage] = useState('cpp');
  const [selectedCase, setSelectedCase] = useState<TestCase | null>(
    data.problem.testCases[0],
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [problemOption, setProblemOption] = useState('description');
  const [testcaseOption, setTestcaseOption] = useState('testcase');
  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };
  const handleCaseClicked = (testCase: TestCase) => {
    setSelectedCase(testCase);
  };

  const submissions = data.problem.submissions;
  let accepted = false;
  const lastStatus = submissions[submissions.length - 1].status;

  for (let i = 0; i < submissions.length; i++) {
    if (submissions[i].status === 'accepted') {
      accepted = true;
      break;
    }
  }
  return (
    <>
      <div>
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
              mb={5}
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
                <img src="assets/submit.svg" alt="submit icon" />
                submit
              </Button>
            </Box>
            <Stack
              direction={'row'}
              spacing={15}
              sx={{ paddingBottom: '7rem' }}
            >
              <Box
                width={'80rem'}
                height={1120}
                sx={{
                  backgroundColor: '#0F0C29',
                  borderRadius: '1.3rem',
                  boxShadow: '0 0 0.3rem',
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  position: 'relative',
                }}
              >
                <Box
                  width={'100%'}
                  height={'5rem'}
                  display={'flex'}
                  alignItems={'center'}
                  sx={{
                    backgroundColor: '#24243e',
                    borderRadius: '1.3rem 1.3rem 0 0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <Stack ml={'4rem'} direction={'row'}>
                    <Stack>
                      <Button
                        disableRipple
                        onClick={() => setProblemOption('description')}
                        sx={{
                          color: 'white',
                          display: 'flex',
                          gap: '1rem',
                          fontSize: '1.8rem',
                          textTransform: 'capitalize',
                          opacity:
                            problemOption === 'description' ? '100%' : '40%',
                          transition: 'opacity 0.3s',
                        }}
                      >
                        <DescriptionOutlinedIcon sx={{ fontSize: '2rem' }} />
                        <p>description</p>
                      </Button>
                    </Stack>
                    <p
                      style={{
                        color: 'white',
                        fontSize: '2rem',
                        padding: '1rem 0.5rem',
                      }}
                    >
                      |
                    </p>
                    <Stack>
                      <Button
                        onClick={() => setProblemOption('submissions')}
                        sx={{
                          color: 'white',
                          display: 'flex',
                          gap: '1rem',
                          fontSize: '1.8rem',
                          textTransform: 'capitalize',
                          opacity:
                            problemOption != 'description' ? '100%' : '40%',
                          transition: 'opacity 0.3s',
                        }}
                        disableRipple
                      >
                        <HistoryOutlinedIcon sx={{ fontSize: '2rem' }} />
                        <p>submissions</p>
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
                {problemOption === 'description' && <ProblemDescription />}
                {problemOption === 'submissions' && <ProblemSubmissions />}
              </Box>
              <Stack spacing={5} sx={{ width: '80rem' }}>
                <Box
                  height={540}
                  sx={{
                    backgroundColor: '#0F0C29',
                    borderRadius: '1.3rem',
                    boxShadow: '0 0 0.3rem',
                    width: '100%',
                  }}
                >
                  <Box
                    width={'100%'}
                    height={'5rem'}
                    display={'flex'}
                    alignItems={'center'}
                    sx={{
                      backgroundColor: '#24243e',
                      borderRadius: '1.3rem 1.3rem 0 0',
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
                        direction={'row'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        gap={1}
                      >
                        <CodeIcon sx={{ fontSize: '2.5rem' }} />
                        <p style={{ color: 'white', fontWeight: '500' }}>
                          Code
                        </p>
                      </Stack>
                    </Stack>
                  </Box>
                  <FormControl
                    sx={{
                      marginLeft: '3rem',
                      marginTop: '1.5rem',
                      width: 'fit-content',
                    }}
                  >
                    <Select
                      value={language}
                      onChange={handleChange}
                      sx={{
                        color: 'white',
                        backgroundColor: '#24243E',
                        fontSize: '1.6rem',
                        '.MuiSelect-icon': {
                          color: 'white',
                          fontSize: '2rem',
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            width: '15rem',
                            backgroundColor: '#24243E',
                            color: 'white',
                            padding: '1rem 0',
                          },
                        },
                      }}
                    >
                      <MenuItem
                        sx={{ fontSize: '1.5rem' }}
                        value={'javascript'}
                      >
                        JavaScript
                      </MenuItem>
                      <MenuItem
                        sx={{ fontSize: '1.5rem' }}
                        value={'typescript'}
                      >
                        TypeScript
                      </MenuItem>
                      <MenuItem sx={{ fontSize: '1.5rem' }} value={'python'}>
                        Python
                      </MenuItem>
                      <MenuItem sx={{ fontSize: '1.5rem' }} value={'java'}>
                        Java
                      </MenuItem>
                      <MenuItem sx={{ fontSize: '1.5rem' }} value={'csharp'}>
                        C#
                      </MenuItem>
                      <MenuItem sx={{ fontSize: '1.5rem' }} value={'cpp'}>
                        C++
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Box
                    sx={{
                      width: '100%',
                      backgroundColor: '#24243E',
                      height: '0.3rem',
                      margin: '2rem 0',
                    }}
                  />
                  <CodeEditor language={language} />
                </Box>
                <Box
                  height={540}
                  sx={{
                    backgroundColor: '#0F0C29',
                    borderRadius: '1.3rem',
                    boxShadow: '0 0 0.3rem',
                    width: '100%',
                  }}
                >
                  <Box
                    width={'100%'}
                    height={'5rem'}
                    display={'flex'}
                    alignItems={'center'}
                    sx={{
                      backgroundColor: '#24243e',
                      borderRadius: '1.3rem 1.3rem 0 0',
                    }}
                  >
                    <Stack ml={'4rem'} direction={'row'}>
                      <Stack>
                        <Button
                          disableRipple
                          onClick={() => setTestcaseOption('testcase')}
                          sx={{
                            color: 'white',
                            display: 'flex',
                            gap: '1rem',
                            fontSize: '1.8rem',
                            textTransform: 'capitalize',
                            opacity:
                              testcaseOption === 'testcase' ? '100%' : '40%',
                            transition: 'opacity 0.3s',
                          }}
                        >
                          <CheckBoxOutlinedIcon
                            sx={{ fontSize: '2rem', color: '#2CBB5D' }}
                          />
                          <p>Testcase</p>
                        </Button>
                      </Stack>
                      <p
                        style={{
                          color: 'white',
                          fontSize: '2rem',
                          padding: '1rem 0.5rem',
                        }}
                      >
                        |
                      </p>
                      <Stack>
                        <Button
                          onClick={() => setTestcaseOption('testresult')}
                          sx={{
                            color: 'white',
                            display: 'flex',
                            gap: '1rem',
                            fontSize: '1.8rem',
                            textTransform: 'capitalize',
                            opacity:
                              testcaseOption != 'testcase' ? '100%' : '40%',
                            transition: 'opacity 0.3s',
                          }}
                          disableRipple
                        >
                          <img
                            src="assets/result.svg"
                            alt="test result"
                            style={{ color: '#2CBB5D' }}
                          />
                          <p>Test Result</p>
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                  <div
                    className="wrapper"
                    style={{
                      overflowX: 'auto',
                      maxHeight: '30rem',
                    }}
                  >
                    <Stack
                      direction={'row'}
                      gap={5}
                      alignItems={'center'}
                      m={5}
                    >
                      {testcaseOption === 'testresult' && (
                        <p
                          style={{
                            minWidth: '10rem',

                            color: accepted
                              ? '#2CBB5D'
                              : lastStatus === 'wrong answer'
                                ? '#e33c37'
                                : '#E3BD37',
                            fontSize: '2rem',
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                          }}
                        >
                          {accepted ? 'Accepted' : lastStatus}
                        </p>
                      )}
                      {data.problem.testCases.map((cases, index) => (
                        <p
                          onClick={() => handleCaseClicked(cases)}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          style={{
                            color:
                              testcaseOption === 'testcase'
                                ? 'white'
                                : accepted && testcaseOption != 'testcase'
                                  ? '#2CBB5D'
                                  : lastStatus === 'wrong answer'
                                    ? '#e33c37'
                                    : '#E3BD37',
                            fontSize: '2rem',
                            backgroundColor:
                              selectedCase === cases
                                ? '#24243E'
                                : hoveredIndex === index
                                  ? '#555570'
                                  : '',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '10rem',
                            height: '5rem',
                            borderRadius: '1rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                          }}
                          key={index}
                        >
                          case {index + 1}
                        </p>
                      ))}
                    </Stack>
                  </div>
                  {selectedCase && (
                    <Stack
                      mx={8}
                      gap={5}
                      sx={{ color: 'white', fontSize: '1.5rem' }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: '2rem',
                            marginBottom: '2rem',
                            fontWeight: '600',
                          }}
                        >
                          Input =
                        </p>
                        <p
                          style={{
                            backgroundColor: '#24243E',
                            height: '4rem',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '2.5rem',
                            fontSize: '2rem',
                          }}
                        >
                          {selectedCase?.input}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: '2rem',
                            marginBottom: '2rem',
                            fontWeight: '600',
                          }}
                        >
                          Output =
                        </p>
                        <p
                          style={{
                            backgroundColor: '#24243E',
                            height: '4rem',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '2.5rem',
                            fontSize: '2rem',
                          }}
                        >
                          {selectedCase?.output}
                        </p>
                      </div>
                    </Stack>
                  )}
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </>
  );
};

export default GamePage;
