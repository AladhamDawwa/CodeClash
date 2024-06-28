import CodeIcon from '@mui/icons-material/Code';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import CodeEditor from '../../components/CodeEditor/CodeEditor';
import Timer from '../../components/Timer/Timer';
import '../../index.css';
import socket from '../../socket';
import { getProblemInfo } from '../../store/actions/userInfo';
import { RootState } from '../../store/store';
import ProblemDescription from './ProblemDescription';
import ProblemSubmissions from './ProblemSubmissions';
import data from './problem.json';
import './styles.css';
interface TestCase {
  test_type: number;
  input: string;
  output: string;
}

interface Problem {
  problem: {
    description: string;
    submissions: any[];
  };
  testCases: string;
}
const GamePage = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const userState = useSelector((state: RootState) => state.user);
  const [language, setLanguage] = useState('cpp');
  const [selectedCase, setSelectedCase] = useState<TestCase | null>(
    data.problem.testCases[0],
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [problemOption, setProblemOption] = useState('description');
  const [testcaseOption, setTestcaseOption] = useState('testcase');

  const { state } = useLocation();

  const { data: userData } = userState;
  // TODO Change gameID
  const jwtToken = authState.user?.token;
  const gameId = userData.gameInfo.id;
  const problemId = userData.gameInfo.problem_id;

  const dispatch = useDispatch();

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };
  const handleCaseClicked = (testCase: TestCase) => {
    setSelectedCase(testCase);
  };

  const handleSubmission = () => {};

  const submissions = data.problem.submissions;
  let accepted = false;
  const lastStatus = submissions[submissions.length - 1].status;

  for (let i = 0; i < submissions.length; i++) {
    if (submissions[i].status === 'accepted') {
      accepted = true;
      break;
    }
  }

  const [problem, setProblem] = useState<any>();

  useEffect(() => {
    dispatch<any>(getProblemInfo({ problemId, jwtToken })).then((res: any) => {
      setProblem(res.payload);
    });
  }, [dispatch, jwtToken, problemId]);

  const [notification, setNotification] = useState<any>();

  useEffect(() => {
    socket.on('uvu_game_client:submission_notification', (data: any) => {
      alert(data);
    });
  }, []);

  return (
    <Stack direction={'column'} alignItems={'center'}>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        width={'100%'}
        height={'10vh'}
        sx={{
          backgroundColor: '#383560',
          borderRadius: '0.5rem',
          boxShadow: 2,
        }}
      >
        <Button>
          Cancel
        </Button>
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
              onClick={handleSubmission}
          >
            <img src="assets/submit.svg" alt="submit icon" />
            submit
          </Button>
        </Box>
      </Box>

      { problem && 
        <Splitter style={{ 
          height: '90vh',
          width: '100vw',
          overflow: 'hidden',
        }}>
          <SplitterPanel style={{
            width: '70%',
            borderRadius: '1.3rem',
            margin: '1rem'
          }}>
            <Box
              height={'100%'}
              sx={{
                borderRadius: '1.3rem',
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
                <Stack ml={'1rem'} direction={'row'}>
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
              <Box sx={{
                background: '#0F0C29',
                height: 'calc(100% - 5rem)',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#383560 #0F0C29',
              }}>
                {problemOption === 'description' 
                  && 
                  <ProblemDescription problem={problem.problem} testCases={problem.test_cases}/>}
                {problemOption === 'submissions' && <ProblemSubmissions />}
              </Box>
            </Box>
          </SplitterPanel>
          <SplitterPanel style={{
            width: '30%',
            borderRadius: '1.3rem',
            margin: '1rem'
          }}>
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
                  // margin={'1rem'}
                >
                  <CodeIcon sx={{ fontSize: '2.5rem' }} />
                  <p style={{ color: 'white', fontWeight: '500' }}>
                    Code
                  </p>
                </Stack>
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
              </Stack>
            </Box>
            <CodeEditor language={language} gameID={gameId} />
          </SplitterPanel>
        </Splitter>
      }
    </Stack>
  );
};

export default GamePage;
