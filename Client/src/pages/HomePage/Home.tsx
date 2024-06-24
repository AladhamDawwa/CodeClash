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
import TeamsList from '../../components/HomePage/TeamsList';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import './glitchText.scss';
import CreateTeamCard from '../../components/CreateTeamCard/CreateTeamCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useDispatch } from 'react-redux';
import { getUserTeams } from '../../store/actions/userInfo';
const Home = () => {
  const [openList, setOpenList] = useState(-1);
  const [showTeamCard, setshowTeanCard] = useState(false);
  const [userTeams, setuserTeams] = useState<Team[]>([]);
  const authState = useSelector((state: RootState) => state.auth);
  interface Team {
    doc_id: string;
    slogan: string;
    team_name: string;
    emails: string[];
    exp: number;
    level: number;
    rank_points: number;
    rank_tier: number;
    registration_date: {
      _seconds: number;
      _nanoseconds: number;
    };
    mmr: number;
  }
  const dispatch = useDispatch();
  const handleshowTeamCard = () => {
    setshowTeanCard(true);
  };

  const handleCloseshowTeamCard = () => {
    setshowTeanCard(false);
  };
  const handleListToggle = (index: number) => {
    setOpenList(openList === index ? -1 : index);
  };
  const [openTeam, setOpenTeam] = useState(-1);
  const handleTeamToggle = (index: number) => {
    setOpenTeam(openTeam === index ? -1 : index);
  };
  const handleAddTeam = (newTeam: Team) => {
    setuserTeams(prevTeams => [...prevTeams, newTeam]);
  };

  useEffect(() => {
    const jwtToken = authState.user.token;
    dispatch<any>(getUserTeams({ jwtToken }))
      .unwrap()
      .then((responseData: any) => {
        setuserTeams(responseData);
      })
      .catch((error: any) => {
        console.error('Failed to fetch user teams:', error);
      });
  }, [authState.user.token, dispatch]);
  return (
    <>
      <Container maxWidth="xl">
        <div
          style={{
            margin: '2rem',
            padding: '4rem 2rem',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '500px',
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
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '2rem',
                width: '100%',
                flexWrap: "wrap"
              }}
            >
              <GameModesCard type="1 V 1" />
              <GameModesCard type="3 V 3" />
              <GameModesCard type="Last Man Standing" />
            </div>
          </div>
          <div className="left-right">
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
                      {userTeams.length > 0 ? (
                        userTeams.map((team, index) => (
                          <TeamsList
                            key={team.doc_id}
                            open={openTeam === index}
                            onClick={() => handleTeamToggle(index)}
                            team={team}
                          />
                        ))
                      ) : (
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          No teams found
                        </Typography>
                      )}
                    </Paper>
                    <Button
                      variant="contained"
                      onClick={handleshowTeamCard}
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
                    {showTeamCard && (
                      <CreateTeamCard
                        open={true}
                        onClose={handleCloseshowTeamCard}
                        onTeamCreated={handleAddTeam}
                      />
                    )}
                  </div>
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
          </div>
        </div>
      </Container>
    </>
  );
};
export default Home;
