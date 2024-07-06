import CodeIcon from '@mui/icons-material/Code';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
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
import { useSnackbar } from 'notistack';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CodeEditor from '../../components/CodeEditor/CodeEditor';
import ResultCard from '../../components/ResultCard';
import '../../index.css';
import socket from '../../socket';
import { getProblemInfo } from '../../store/actions/userInfo';
import { foundMatch, updateGameResult } from '../../store/reducers/userReducer';
import { RootState } from '../../store/store';
import GAME_STATUS from '../../utils/game_status';
import languages from '../../utils/languages.json';
import ProblemDescription from './ProblemDescription';
import ProblemSubmissions from './ProblemSubmissions';
import './styles.css';
import Timer from '../../components/Timer';

const GamePage = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const userData = useSelector((state: RootState) => state.user.data);
  const [language, setLanguage] = useState(54);
  const [problemOption, setProblemOption] = useState('description');

  const jwtToken = authState.user?.token;
  const gameId = userData.gameInfo?.id;
  const problemId = userData.gameInfo?.problem_id;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(Number(event.target.value));
  };

  const [problem, setProblem] = useState<any>();
  const [gameFinished, setGameFinished] = useState(false);
  const [gameResult, setGameResult] = useState<any>();
  const [submissions, setSubmissions] = useState<any>();
  const { enqueueSnackbar } = useSnackbar();

  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     event.preventDefault();
  //     event.returnValue = '';
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   window.history.pushState(null, '', window.location.pathname);
  //   window.addEventListener('popstate', () => {
  //     window.history.pushState(null, '', window.location.pathname);
  //   });

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  useEffect(() => {
    dispatch<any>(getProblemInfo({ problemId, jwtToken })).then((res: any) => {
      setProblem(res.payload);
    });
  }, []);

  useEffect(() => {
    if (!userData.gameInfo) return;
    if (userData.gameInfo.round > 1) {
      dispatch<any>(getProblemInfo({ problemId, jwtToken })).then(
        (res: any) => {
          setProblem(res.payload);
        },
      );
    }
    const url =
      userData.gameInfo?.game_type == 0
        ? 'uvu_game_client'
        : userData.gameInfo?.game_type == 1
          ? 'tvt_game_client'
          : 'lms_game_client';
    console.log('url', url);
    socket.on(`${url}:submission_notification`, (data: any) => {
      enqueueSnackbar(data, { variant: 'info' });
    });

    socket.on(`${url}:new_round`, (data: any) => {
      dispatch(foundMatch(data));
      // location.reload();
      // navigate('/gameSession');
    });

    socket.on(`${url}:send_game_result`, (data: any) => {
      socket.disconnect();
      const updatedResult =
        userData.gameInfo?.game_mode == 0
          ? {
              rank_tier: data.new_tier,
              rank_points: data.new_points,
              user_level: data.new_level,
            }
          : {
              user_level: data.new_level,
            };
      dispatch<any>(updateGameResult(updatedResult));
      setGameFinished(true);
      setGameResult(data);
    });

    return () => {
      socket.off(`${url}:submission_notification`);
      socket.off(`${url}:new_round`);
      socket.off(`${url}:send_game_result`);
    };
  }, [userData.gameInfo]);

  const handleProblemSubmission = (submission: any) => {
    setSubmissions(submission);
  };

  return (
    <>
      {gameId && (
        <Stack direction={'column'} alignItems={'center'}>
          <Button
            variant="contained"
            sx={{
              position: 'absolute',
              top: '1.5rem',
              left: '2rem',
              backgroundColor: '#0F0C29',
              textTransform: 'capitalize',
              color: 'red',
              width: '11rem',
              height: '5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '2rem',
              fontWeight: '400',
              borderRadius: '1rem',
              gap: '0.5rem',
            }}
            onClick={() => {
              socket.disconnect();
              navigate('/home');
            }}
          >
            <ExitToAppOutlinedIcon
              sx={{
                fontSize: '2.4rem',
                rotate: '180deg',
              }}
            />
            Leave
          </Button>
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            width={'100%'}
            height={'11vh'}
            sx={{
              backgroundColor: '#383560',
              borderRadius: '0.5rem',
              boxShadow: 2,
            }}
          >
            <Timer />
          </Box>

          {problem && (
            <Splitter
              style={{
                height: '89vh',
                width: '100vw',
                overflow: 'hidden',
              }}
            >
              <SplitterPanel
                style={{
                  width: '70%',
                  borderRadius: '1.3rem',
                  margin: '1rem',
                }}
              >
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
                  <Box
                    sx={{
                      background: '#0F0C29',
                      height: 'calc(100% - 5rem)',
                      overflowY: 'auto',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#383560 #0F0C29',
                    }}
                  >
                    {problemOption === 'description' && (
                      <ProblemDescription
                        problem={problem.problem}
                        testCases={problem.test_cases}
                      />
                    )}
                    {problemOption === 'submissions' && (
                      <ProblemSubmissions submissions={submissions} />
                    )}
                  </Box>
                </Box>
              </SplitterPanel>
              <SplitterPanel
                style={{
                  width: '30%',
                  borderRadius: '1.3rem',
                  margin: '1rem',
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
                    justifyContent={'space-between'}
                    color={'white'}
                    fontSize={'1.8rem'}
                    textTransform={'capitalize'}
                    width={'100%'}
                  >
                    <Stack
                      direction={'row'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      gap={1}
                    >
                      <CodeIcon sx={{ fontSize: '2.5rem' }} />
                      <p style={{ color: 'white', fontWeight: '500' }}>Code</p>
                    </Stack>
                    <FormControl>
                      <Select
                        value={language.toString()}
                        onChange={handleChange}
                        sx={{
                          marginRight: '2rem',
                          height: '3rem',
                          backgroundColor: '#1E1E36',
                          borderRadius: '1rem',
                          color: 'white',
                          fontSize: '1.5rem',
                          border: '2px solid white',
                          '.MuiSelect-icon': {
                            color: 'white',
                            fontSize: '2rem',
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              backgroundColor: '#24243E',
                              color: 'white',
                            },
                          },
                        }}
                      >
                        {languages.map((lang, index) => (
                          <MenuItem
                            key={index}
                            sx={{ fontSize: '1.5rem' }}
                            value={lang.id}
                          >
                            {lang.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>
                <CodeEditor
                  languageId={language}
                  gameID={gameId}
                  onProblemSubmit={handleProblemSubmission}
                />
              </SplitterPanel>
            </Splitter>
          )}
        </Stack>
      )}
      {gameFinished && (
        <ResultCard
          status={GAME_STATUS[gameResult.status]}
          rank={gameResult.new_tier}
          rankPoints={gameResult.delta}
          level={gameResult.new_level.level}
        />
      )}
    </>
  );
};

export default GamePage;
