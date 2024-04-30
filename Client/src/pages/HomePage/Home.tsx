import './styles.css';
import '../../index.css';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import GameModesCard from '../../components/HomePage/GameModesCard';
import GameButton from '../../components/HomePage/GameButton';
import data from './users.json';
import FriendsList from '../../components/HomePage/FriendsList';
import TeamsList from '../../components/HomePage/TeamsList';
import Button from '@mui/material/Button';
import { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
//TODO when the user clicks on his image it navigate him to his profile page
const Home = () => {
  const [openList, setOpenList] = useState(-1);
  const handleListToggle = (index: number) => {
    setOpenList(openList === index ? -1 : index);
  };
  const [openTeam, setOpenTeam] = useState(-1);
  const handleTeamToggle = (index: number) => {
    setOpenTeam(openTeam === index ? -1 : index);
  };
  return (
    <>
      <NavBar
        rankImg={'../../../public/assets/bronze.svg'}
        rankAmount={200}
        userImg={'../../../public/assets/user-1.jpg'}
      />
      <Container maxWidth="xl">
        <div className="left-right">
          <div className="left">
            <Paper
              sx={{
                backgroundColor: '#0f0c29',
                width: '70rem',
                height: '110rem',
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
                Game Modes
              </Typography>
              <GameModesCard type="1 vs 1" />
              <GameModesCard type="3 vs 3" />
              <GameModesCard type="Last Man Standing" />
              <Box height="2rem" />
            </Paper>
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
                height: '110rem',
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
                Friends
              </Typography>
              <Paper
                sx={{
                  backgroundColor: '#24243e',
                  width: '45rem',
                  height: '95rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
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
                <div className="home-teams">
                  <Typography
                    variant="h2"
                    sx={{
                      color: 'white',
                      marginBottom: '3rem',
                      fontWeight: '500',
                    }}
                  >
                    Teams
                  </Typography>
                  <Paper
                    sx={{
                      backgroundColor: '#0f0c29',
                      width: '40rem',
                      height: '35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      overflowY: 'auto',
                      scrollbarWidth: 'none',
                      gap: '4rem',
                      padding: '3rem 0',
                    }}
                  >
                    <TeamsList
                      open={openTeam === 0}
                      onClick={() => handleTeamToggle(0)}
                    />
                    <TeamsList
                      open={openTeam === 1}
                      onClick={() => handleTeamToggle(1)}
                    />
                    <TeamsList
                      open={openTeam === 2}
                      onClick={() => handleTeamToggle(2)}
                    />
                    <TeamsList
                      open={openTeam === 3}
                      onClick={() => handleTeamToggle(3)}
                    />
                    <TeamsList
                      open={openTeam === 4}
                      onClick={() => handleTeamToggle(4)}
                    />
                    <TeamsList
                      open={openTeam === 5}
                      onClick={() => handleTeamToggle(5)}
                    />
                  </Paper>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      margin: '3rem',
                      p: '1.5rem',
                      fontSize: '1.5rem',
                      textTransform: 'capitalize',
                      backgroundColor: '#0f0c29',
                    }}
                    disableRipple
                    disableElevation
                  >
                    Create Team
                  </Button>
                </div>
              </Paper>
              <Box height="2rem" />
            </Paper>
            <Paper
              sx={{
                backgroundColor: '#0f0c29',
                width: '40rem',
                height: '60rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '3rem',
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
                  width: '36em',
                  height: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
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
                      width: '32rem',
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
                      src={`../../../public/assets/${user.rank}.svg`}
                    />
                  </Paper>
                ))}
              </Paper>
              <Box height="1rem" />
            </Paper>
          </div>
        </div>
      </Container>
    </>
  );
};
export default Home;
