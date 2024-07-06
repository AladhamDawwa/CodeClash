import './styles.css';
import '../../index.css';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import GameModesCard from '../../components/HomePage/GameModesCard';
import GameButton from '../../components/HomePage/GameButton';
import data from './users.json';
import FriendsList from '../../components/HomePage/FriendsList';
import { useState } from 'react';
import './glitchText.scss';
import { GameType } from '../../utils/game_settings';
const Home = () => {
  const [openList, setOpenList] = useState(-1);

  const handleListToggle = (index: number) => {
    setOpenList(openList === index ? -1 : index);
  };

  return (
    <>
      <Container maxWidth="xl">
        <div
          style={{
            margin: '2rem',
            padding: '4rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '20rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '500px',
              gap: '4rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 'fit-content',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div className="glitch" data-text="GAME">
                GAME
              </div>
              <div className="glitch" data-text="MODES">
                MODES
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                gap: '2rem',
                width: '100%',
                flexWrap: 'wrap',
              }}
            >
              <GameModesCard text="1 V 1" type={GameType.OneVsOne} />
              <GameModesCard text="3 V 3" type={GameType.TeamVsTeam} />
              <GameModesCard
                text="Last Man Standing"
                type={GameType.LastManStanding}
              />
            </div>
          </div>
          {/* <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '500px',
            gap: '4rem',
          }}>
            <div
                style={{
                  display: 'flex',
                  width: 'fit-content',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div className="glitch" data-text="EVENTS">
                  EVENTS
                </div>
            </div>
          </div> */}
          {/* <div className="left-right">
            <div className="left">
              <Paper
                sx={{
                  backgroundColor: '#0f0c29',
                  width: '70rem',
                  height: '50rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '5rem',
                }}
              >
                <Typography
                  variant="h2"
                  sx={{ color: 'white', marginTop: '3rem', fontWeight: '500' }}
                >
                  Tournamet
                </Typography>
                <Paper
                  elevation={5}
                  sx={{
                    width: '60rem',
                    height: '27rem',
                    background:
                      'linear-gradient(to bottom right, #24243e  , #818196  )',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{ color: 'white', fontWeight: '500' }}
                  >
                    opens in 20 days!
                  </Typography>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      gap: '10rem',
                    }}
                  >
                    <GameButton>Register</GameButton>
                  </div>
                </Paper>
                <Box height="2rem" />
              </Paper>
            </div>
            <div className="right">
              <Paper
                sx={{
                  backgroundColor: '#0f0c29',
                  width: '50rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="h2"
                  sx={{ color: 'white', marginTop: '3rem', fontWeight: '500' }}
                >
                  Friends
                </Typography>
                <Paper
                  sx={{
                    backgroundColor: '#24243e',
                    width: '45rem',
                    height: '30rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    gap: '2rem',
                  }}
                >
                  <FriendsList
                    type="All"
                    open={openList === 0}
                    onClick={() => handleListToggle(0)}
                  />
                  <FriendsList
                    type="Offline"
                    open={openList === 1}
                    onClick={() => handleListToggle(1)}
                  />
                  <FriendsList
                    type="Online"
                    open={openList === 2}
                    onClick={() => handleListToggle(2)}
                  />
                </Paper>
                <Box height="2rem" />
              </Paper>
              <Paper
                sx={{
                  backgroundColor: '#0f0c29',
                  width: '50rem',
                  height: '60rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '5.5rem',
                  marginBottom: '10rem',
                }}
              >
                <Typography
                  variant="h2"
                  sx={{ color: 'white', marginTop: '2rem', fontWeight: '500' }}
                >
                  Leader Board
                </Typography>
                <Paper
                  sx={{
                    backgroundColor: '#24243e',
                    width: '45rem',
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '2rem 0rem',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    gap: '2rem',
                  }}
                >
                  {data.map((user, index) => (
                    <Paper
                      key={index}
                      sx={{
                        width: '40rem',
                        minHeight: '7rem',
                        backgroundColor: '#0f0c29',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0rem 2rem',
                      }}
                    >
                      <p
                        style={{
                          color: 'white',
                          fontSize: '1.7rem',
                        }}
                      >
                        {user.username}
                      </p>
                      <img
                        className="tournament-img"
                        src={`/assets/${user.rank}.svg`}
                      />
                    </Paper>
                  ))}
                </Paper>
                <Box height="1rem" />
              </Paper>
            </div>
          </div> */}
        </div>
      </Container>
    </>
  );
};
export default Home;
