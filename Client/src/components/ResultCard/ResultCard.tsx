import { Box, Button, Grow, Paper, Slide, Stack, Zoom } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Avatar from '@mui/material/Avatar';
import './styles.css';

interface ResultCardParams {
  status: string;
  rank: number;
  level: number;
}

export default function ResultCard({ status, rank, level }: ResultCardParams) {
  const ranks = ['bronze', 'silver', 'gold', 'diamond', 'master'];
  const [showCard, setShowCard] = useState(true);
  const user = useSelector((state: RootState) => state.user);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Button
        sx={{
          width: '5rem',
          color: 'black',
          bgcolor: 'white',
          zIndex: '5',
          marginTop: '2rem',
        }}
        onClick={() => setShowCard(!showCard)}
      >
        Show Card
      </Button>
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
          }}
        >
          <Paper
            sx={{
              width: '80rem',
              height: '60rem',
              bgcolor: '#0F0C29',
              borderRadius: '5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-evenly',
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
                  width: '47rem',
                  height: '10rem',
                  bgcolor: '#24243E',
                  borderRadius: '20',
                  display: 'flex',
                  justifyContent: 'space-around',
                  justifyItems: 'center',
                }}
              >
                <Stack direction="row" alignItems={'center'} spacing={1}>
                  <img
                    src="assets/Rank.svg"
                    alt="rank image"
                    style={{ width: '5rem', height: '5rem' }}
                  />
                  <p
                    style={{
                      fontSize: '2.5rem',
                      color: `  ${status === 'winner' ? '#2CBB5D' : status === 'loser' ? '#E33C37' : '#918f8f'}`,
                    }}
                  >
                    {`${status === 'winner' ? '+' : status === 'loser' ? '-' : ''}${rank} `}
                  </p>
                </Stack>
                <Stack direction="row" alignItems={'center'} spacing={1}>
                  <img
                    src={`assets/${ranks[user.data.rank_tier]}.svg`}
                    alt="tier image"
                    style={{ width: '5rem', height: '5rem' }}
                  />
                  <Stack alignItems={'center'}>
                    <p
                      style={{
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: '400',
                      }}
                    >
                      {level}
                    </p>
                    <KeyboardDoubleArrowRightIcon
                      sx={{
                        width: '3rem',
                        height: '3rem',
                        color: `  ${status === 'winner' ? '#2CBB5D' : status === 'loser' ? '#E33C37' : '#918f8f'}`,
                      }}
                    />
                  </Stack>
                  <img
                    src={`assets/${ranks[user.data.rank_tier + 1]}.svg`}
                    alt="tier image"
                    style={{ width: '5rem', height: '5rem' }}
                  />
                </Stack>
              </Paper>
            </Grow>
            <Button
              onClick={() => setShowCard(!showCard)}
              sx={{
                bgcolor: '#24243E',
                color: 'white',
                boxShadow: '0 0 0 1.5px black',
                fontSize: '1.5rem',
                width: '10rem',
              }}
            >
              Done
            </Button>
          </Paper>
        </Box>
      </Slide>
    </div>
  );
}
