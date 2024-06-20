import NavBar from '../../components/NavBar/NavBar';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Stack from '@mui/material/Stack';
import './styles.css';
import '../../index.css';
import { useState } from 'react';
import MatchCard from '../../components/MatchCard/MatchCard';
import userData from './profile.json';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData.user.fullName);
  const [userName, setUserName] = useState(userData.user.userName);
  const [description, setDescription] = useState(userData.user.describtion);
  const userLanguages = userData.user.languages;
  const currentRank = userData.user.currentRank;
  const NextRank = userData.user.nextRank;
  const currentPoints = userData.user.currentRankPoints;
  const PointsToRank = userData.user.pointsToRank;
  const currentLevelPoints = userData.user.currentLevelPoints;
  const PointsToLevelUp = userData.user.pointsToLevel;
  const currentLevel = userData.user.currentLevel;
  const nextLevel = userData.user.nextLevel;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // we need to call our database
  };

  return (
    <>
      <NavBar
        rankImg={`/assets/${currentRank}.svg`}
        rankAmount={currentPoints}
        userImg={userData.user.profilePicture}
      />
      <Container maxWidth="xl">
        <div className="profile-top-bottom">
          <div className="profile-left-right">
            <Paper
              sx={{
                width: '55rem',
                height: '80rem',
                backgroundColor: '#0f0c29',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                gap: '5rem',
                padding: '4rem',
              }}
            >
              <div className="profile-user-info">
                <div className="profile-img">
                  {isEditing ? (
                    <>
                      {userData.user.profilePicture.length === 0 ? (
                        <AccountBoxIcon
                          sx={{
                            width: '15rem',
                            height: '17rem',
                            borderRadius: '1rem',
                            color: 'white',
                            filter: 'brightness(70%)',
                          }}
                        />
                      ) : (
                        <img
                          src={userData.user.profilePicture}
                          alt="user image"
                          style={{
                            width: '15rem',
                            height: '17rem',
                            borderRadius: '1rem',
                            filter: 'brightness(70%)',
                          }}
                        />
                      )}
                    </>
                  ) : userData.user.profilePicture.length === 0 ? (
                    <AccountBoxIcon
                      sx={{
                        width: '15rem',
                        height: '17rem',
                        borderRadius: '1rem',
                        color: 'white',
                      }}
                    />
                  ) : (
                    <img
                      src={userData.user.profilePicture}
                      alt="user image"
                      style={{
                        width: '15rem',
                        height: '17rem',
                        borderRadius: '1rem',
                      }}
                    />
                  )}
                </div>
                <div
                  className="profile-txt"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        style={{
                          fontSize: '3rem',
                          border: '1px solid white',
                          textTransform: 'capitalize',
                        }}
                        className="profile-edit"
                      />
                      <input
                        type="text"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        style={{
                          fontSize: '2.2rem',
                          color: '#999',
                          border: '1px solid white',
                          padding: '0 0.5rem',
                          textTransform: 'capitalize',
                        }}
                        className="profile-edit"
                      />
                    </>
                  ) : (
                    <>
                      <p
                        style={{
                          color: 'white',
                          textTransform: 'capitalize',
                          fontSize: '3rem',
                        }}
                      >
                        {name}
                      </p>
                      <p
                        style={{ color: '#999', fontSize: '2.2rem' }}
                      >{`#${userName}`}</p>
                    </>
                  )}
                </div>
              </div>
              <p
                style={{
                  fontSize: '1.5rem',
                  color: 'white',
                  textTransform: 'capitalize',
                  letterSpacing: '0.5px',
                  maxWidth: '50rem',
                  lineHeight: '1.8',
                  fontWeight: '500',
                }}
              >
                {isEditing ? (
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    style={{
                      fontSize: '1.5rem',
                      lineHeight: '1.8',
                      textTransform: 'capitalize',
                      letterSpacing: '0.5px',
                      overflow: 'hidden',
                      minWidth: '45rem',
                      minHeight: '12rem',
                      fontWeight: '500',
                      resize: 'none',
                      overflowY: 'auto',
                      scrollbarWidth: 'none',
                      border: '1px solid white',
                      borderRadius: '1rem',
                      fontFamily: 'inherit',
                    }}
                    className="profile-edit"
                  />
                ) : (
                  description
                )}
              </p>
              <Typography
                variant="h2"
                sx={{ color: 'white', fontWeight: 'bold' }}
              >
                Languages
              </Typography>
              <div className="language">
                {userLanguages.length === 0 ? (
                  <p
                    style={{
                      color: 'white',
                      textTransform: 'capitalize',
                      fontSize: '1.8rem',
                      fontWeight: '500',
                    }}
                  >
                    No languages detected yet!
                  </p>
                ) : (
                  userLanguages.map(lang => {
                    let langColor;
                    switch (lang) {
                      case 'python':
                        langColor = '#58a6b1';
                        break;
                      case 'c++':
                        langColor = '#C2255C';
                        break;
                      case 'c#':
                        langColor = '#6741D9';
                        break;
                      case 'java':
                        langColor = '#E8590C';
                        break;
                      default:
                        langColor = '#5d6ba1';
                        break;
                    }
                    return (
                      <p
                        className="profile-lang-background"
                        key={lang}
                        style={{ backgroundColor: langColor }}
                      >
                        {lang}
                      </p>
                    );
                  })
                )}
              </div>
              {isEditing ? (
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    width: '30rem',
                    px: '2rem',
                    py: '1rem',
                    fontSize: '2rem',
                    textTransform: 'capitalize',
                    backgroundColor: '#24243e',
                    alignSelf: 'center',
                    borderRadius: '1rem',
                  }}
                  disableRipple
                  disableElevation
                >
                  Save
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleEdit}
                  sx={{
                    width: '30rem',
                    px: '2rem',
                    py: '1rem',
                    fontSize: '2rem',
                    textTransform: 'capitalize',
                    backgroundColor: '#24243e',
                    alignSelf: 'center',
                    borderRadius: '1rem',
                  }}
                  disableRipple
                  disableElevation
                >
                  Edit Profile
                </Button>
              )}
            </Paper>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10rem' }}
            >
              <Paper
                sx={{
                  width: '55rem',
                  height: '55rem',
                  backgroundColor: '#0f0c29',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5rem',
                  padding: '3rem',
                }}
              >
                <Typography
                  variant="h2"
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  Rank
                </Typography>
                <div className="rank-grid-container">
                  <div className="rank-align">
                    <p className="rank-p">Current Points</p>
                    <p className="rank-txt">{currentPoints}</p>
                  </div>
                  <div className="rank-align">
                    <p className="rank-p">Current Rank</p>
                    <img
                      src={`/assets/${currentRank}.svg`}
                      alt="rank image"
                      className="profile-rank-img"
                    />
                  </div>
                  <div className="rank-align">
                    <p className="rank-p">Points to rank up</p>
                    <p className="rank-txt">{PointsToRank}</p>
                  </div>
                  <div className="rank-align">
                    <p className="rank-p">Next Rank</p>
                    <img
                      src={`/assets/${NextRank}.svg`}
                      alt="rank image"
                      className="profile-rank-img"
                      style={{ opacity: '50%' }}
                    />
                  </div>
                </div>
              </Paper>
              <Paper
                sx={{
                  width: '55rem',
                  height: '50rem',
                  backgroundColor: '#0f0c29',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5rem',
                  padding: '3rem',
                }}
              >
                <Typography
                  variant="h2"
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  Levels
                </Typography>
                <div className="rank-grid-container">
                  <div className="rank-align">
                    <p className="rank-p">Current Points</p>
                    <p className="rank-txt-level">{currentLevelPoints}</p>
                  </div>
                  <div className="rank-align">
                    <p className="rank-p">Current Level</p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <img
                        src="/assets/Rank.svg"
                        alt="level image"
                        className="profile-level-img"
                      />
                      <p className="level-p">{currentLevel}</p>
                    </div>
                  </div>
                  <div className="rank-align">
                    <p className="rank-p">Points to rank up</p>
                    <p className="rank-txt-level">{PointsToLevelUp}</p>
                  </div>
                  <div className="rank-align">
                    <p className="rank-p">Next Level</p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <img
                        src="/assets/Rank.svg"
                        alt="level image"
                        className="profile-level-img"
                      />
                      <p className="level-p">{nextLevel}</p>
                    </div>
                  </div>
                </div>
              </Paper>
            </div>
          </div>
          <Typography
            variant="h2"
            sx={{ color: 'white', fontWeight: 'bold', alignSelf: 'center' }}
          >
            Latest Matches
          </Typography>
          <div>
            <Stack direction="column" spacing={5}>
              <MatchCard
                problemName="reverse integer"
                date="April 06, 2023"
                oppImage="/assets/avatar.png"
                status="loser"
                amount={50}
              />
              <MatchCard
                problemName="reverse integer"
                date="April 06, 2023"
                oppImage="/assets/avatar.png"
                status="loser"
                amount={50}
              />
            </Stack>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ProfilePage;
