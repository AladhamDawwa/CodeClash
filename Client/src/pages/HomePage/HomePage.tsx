import './styles.css';
import '../../index.css';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import NavBar from '../../components/HomePage/NavBar';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import GameModesCard from '../../components/HomePage/GameModesCard';
import GameButton from '../../components/HomePage/GameButton';
import data from './users.json';
import FriendsList from '../../components/HomePage/FriendsList';
import TeamsList from '../../components/HomePage/TeamsList';
import Button from '@mui/material/Button';
const HomePage = () => {
  return (
    <Container maxWidth="xl">
      <NavBar
        rankImg={'../../../public/assets/bronze.svg'}
        rankAmount={200}
        userImg={'../../../public/assets/user-1.jpg'}
      />
      <div className="left-right">
        <div className="left">
          <Paper
            sx={{
              backgroundColor: '#0f0c29',
              width: '70rem',
              height: '100rem',
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
              marginBottom: '10rem',
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
                  'linear-gradient(to bottom right, #302b63 5% , #818196 80% )',
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
              height: '100rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '3rem',
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
                overflowY: 'auto',
              }}
            >
              <FriendsList type="All" />
              <FriendsList type="Offline" />
              <FriendsList type="Online" />
              <div className="teams">
                <Paper
                  sx={{
                    backgroundColor: '#0f0c29',
                    width: '40rem',
                    height: '46rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '3rem',
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      color: 'white',
                      marginTop: '3rem',
                      fontWeight: '500',
                    }}
                  >
                    Teams
                  </Typography>
                  <TeamsList />
                  <TeamsList />
                  <TeamsList />
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      marginBottom: '3rem',
                      px: '1rem',
                      fontSize: '1.5rem',
                      textTransform: 'capitalize',
                      backgroundColor: '#24243e',
                    }}
                    disableRipple
                    disableElevation
                  >
                    Create Team
                  </Button>
                </Paper>
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
                    height: '7rem',
                    backgroundColor: '#0f0c29',
                    marginBottom: '1rem',
                    textAlign: 'center',
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
  );
};
export default HomePage;
