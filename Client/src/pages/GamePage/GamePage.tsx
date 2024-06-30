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
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CodeEditor from '../../components/CodeEditor/CodeEditor';
import Timer from '../../components/Timer/Timer';
import '../../index.css';
import socket from '../../socket';
import { getProblemInfo } from '../../store/actions/userInfo';
import { RootState } from '../../store/store';
import ProblemDescription from './ProblemDescription';
import ProblemSubmissions from './ProblemSubmissions';
import languages from './languages.json';
import './styles.css';
import ResultCard from '../../components/ResultCard';
import GAME_STATUS from '../../utils/game_status';
import { updateGameResult } from '../../store/reducers/userReducer';
import { SnackbarProvider, useSnackbar } from 'notistack';

const GamePage = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const userState = useSelector((state: RootState) => state.user);
  const [language, setLanguage] = useState(54);
  const [problemOption, setProblemOption] = useState('description');

  const { data: userData } = userState;
  // TODO Change gameID
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
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch<any>(getProblemInfo({ problemId, jwtToken })).then((res: any) => {
      setProblem(res.payload);
    });
  }, [dispatch, jwtToken, problemId]);

  useEffect(() => {
    socket.on('uvu_game_client:submission_notification', (data: any) => {
      enqueueSnackbar(data, { variant : 'info' });
    });

    socket.on('uvu_game_client:send_game_result', (data: any) => {
      socket.disconnect();
      dispatch<any>(updateGameResult({
        rank_tier: data.new_tier,
        rank_points: data.new_points,
      }));
      setGameFinished(true);
      setGameResult(data);
    });
  }, [dispatch, gameId, enqueueSnackbar]);

  return (
    <>    
      { gameId &&
        <Stack direction={'column'} alignItems={'center'}>
          <Button variant="contained" sx={{
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
          }} onClick={()=>{
            socket.disconnect();
            navigate('/home');
          }}>
            <ExitToAppOutlinedIcon sx={{
              fontSize: '2.4rem',
              rotate: '180deg',
            }}/>
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

        { problem && 
          <Splitter style={{ 
            height: '89vh',
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
                    <p style={{ color: 'white', fontWeight: '500' }}>
                      Code
                    </p>
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
                    }}>
                      {
                        languages.map((lang, index) => (
                          <MenuItem key={index} sx={{ fontSize: '1.5rem' }} value={lang.id}>
                            {lang.name}
                          </MenuItem>
                        ))
                      }
                      {/* <MenuItem sx={{ fontSize: '1.5rem' }} value={'javascript'}>
                        JavaScript
                      </MenuItem>
                      <MenuItem sx={{ fontSize: '1.5rem' }} value={'typescript'}>
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
                      </MenuItem> */}
                    </Select>
                  </FormControl>
                </Stack>
              </Box>
              <CodeEditor languageId={language} gameID={gameId} />
            </SplitterPanel>
          </Splitter>
        }
        </Stack>
      }
      {gameFinished && <ResultCard 
        status={GAME_STATUS[gameResult.status]}
        rank={gameResult.delta}
        level={gameResult.new_tier}
      />}
    </>
  );
};

const IntegrationNotifyStack = () => {
  return (
    <SnackbarProvider maxSnack={3} style={{
      color: 'white',
      fontSize: '1.8rem',
      borderRadius: '1rem',
    }}>
      <GamePage />
    </SnackbarProvider>
  );
};

export default IntegrationNotifyStack;
