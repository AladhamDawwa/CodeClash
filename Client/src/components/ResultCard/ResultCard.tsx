import { Box, Button, Grow, Paper, Slide, Stack, Zoom } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Avatar from '@mui/material/Avatar';
import Fireworks from '@fireworks-js/react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import LevelStar from '../LevelStar/LevelStar';
import ranks from '../../utils/ranks';
import { updateGameResult } from '../../store/reducers/userReducer';
import { useEffect } from 'react';

interface ResultCardParams {
  status: string;
  rank: number;
  level: number;
  rankPoints: number;
  updatedResult: any;
}

export default function ResultCard({
  status,
  rank,
  rankPoints,
  level,
  updatedResult,
}: ResultCardParams) {
  const showCard = true;
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch<any>(updateGameResult(updatedResult));
      navigate('/home');
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 2,
          pointerEvents: 'none',
          background: '#0f0c292d',
          backdropFilter: 'blur(5px) contrast(0.8)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 300,
        }}
      >
        {status === 'winner' && (
          <Fireworks
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 1,
            }}
          />
        )}
        <Slide
          direction="up"
          in={showCard}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              zIndex: 300,
            }}
          >
            <Paper
              sx={{
                width: '60rem',
                height: '50rem',
                background: '#0f0c29',
                opacity: '0.9',
                borderRadius: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
              }}
            >
              <Grow in={showCard} timeout={1000}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                  }}
                >
                  <p
                    className="blink-animation"
                    style={{
                      color: `  ${status === 'winner' ? '#2CBB5D' : status === 'loser' ? '#E33C37' : '#918f8f'}`,
                      fontSize: '5rem',
                      fontWeight: 'semi-bold',
                      textTransform: 'capitalize',
                    }}
                  >
                    {status}
                  </p>
                </div>
              </Grow>
              <Zoom in={showCard} timeout={800}>
                {user.data.image === undefined ? (
                  <Avatar
                    sx={{
                      width: '15rem',
                      height: '15rem',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <img
                    src={user?.data.image}
                    alt=""
                    style={{
                      width: '15rem',
                      height: '15rem',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </Zoom>
              <Grow in={showCard} timeout={1200}>
                <Paper
                  sx={{
                    width: rank !== undefined ? '55rem' : '30rem',
                    height: '10rem',
                    bgcolor: '#1E1E36',
                    borderRadius: '1rem',
                    display: 'flex',
                    justifyContent: 'space-around',
                    justifyItems: 'center',
                  }}
                >
                  {rank !== undefined && (
                    <>
                      <Stack direction="row" alignItems={'center'} spacing={1}>
                        <img
                          src="assets/Rank.svg"
                          alt="rank image"
                          style={{
                            width: '5rem',
                            height: '5rem',
                            marginBottom: '1rem',
                          }}
                        />
                        <p
                          style={{
                            fontSize: '2.5rem',
                            color: `  ${rankPoints > 0 ? '#2CBB5D' : rankPoints < 0 ? '#E33C37' : '#918f8f'}`,
                          }}
                        >
                          {`${rankPoints > 0 ? '+' : rankPoints < 0 ? '-' : ''}${Math.abs(rankPoints)} `}
                        </p>
                      </Stack>
                      <Stack direction="row" alignItems={'center'} spacing={1}>
                        <img
                          src={`assets/${ranks[user.data.rank_tier]}.svg`}
                          alt="tier image"
                          style={{ width: '6rem', height: '6rem' }}
                        />
                        {rank != user.data.rank_tier && (
                          <>
                            <KeyboardDoubleArrowRightIcon
                              sx={{
                                width: '3rem',
                                height: '3rem',
                                color: `  ${status === 'winner' ? '#2CBB5D' : status === 'loser' ? '#E33C37' : '#918f8f'}`,
                              }}
                            />
                            <img
                              src={`assets/${ranks[user.data.rank_tier + 1]}.svg`}
                              alt="tier image"
                              style={{ width: '6rem', height: '6rem' }}
                            />
                          </>
                        )}
                      </Stack>
                    </>
                  )}
                  <Stack
                    direction="row"
                    alignItems={'center'}
                    justifyContent={'center'}
                    sx={{
                      position: 'relative',
                    }}
                  >
                    <LevelStar level={user.data?.user_level.level} />
                    {level != user.data?.user_level.level && (
                      <>
                        <KeyboardDoubleArrowRightIcon
                          sx={{
                            width: '3rem',
                            height: '3rem',
                            color: `  ${status === 'winner' ? '#2CBB5D' : status === 'loser' ? '#E33C37' : '#918f8f'}`,
                          }}
                        />
                        <LevelStar level={level} />
                      </>
                    )}
                  </Stack>
                </Paper>
              </Grow>
              <Button
                variant="contained"
                onClick={() => {
                  dispatch<any>(updateGameResult(updatedResult));
                  navigate('/home');
                }}
                sx={{
                  background: '#a239ca',
                  color: 'white',
                  boxShadow: '0 0 0 1.5px black',
                  fontSize: '1.5rem',
                  width: '10rem',
                  '&:hover': {
                    background: '#7a1faa',
                  },
                }}
              >
                Done
              </Button>
            </Paper>
          </Box>
        </Slide>
      </div>
    </>
  );
}
