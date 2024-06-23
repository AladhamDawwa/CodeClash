import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Stack from '@mui/material/Stack';
import './styles.css';
import '../../index.css';
import { ChangeEvent, useState } from 'react';
import MatchCard from '../../components/MatchCard/MatchCard';
import userData from './profile.json';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { uploadImage } from '../../store/actions/authAction';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getUserByUsername, updateUser } from '../../store/actions/userInfo';
import LoadingState from '../../components/LoadingState';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state: RootState) => state.user.data);
  const authState = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState(user.first_name + ' ' + user.last_name);
  const [username, setUsername] = useState(user.username);
  const [description, setDescription] = useState(user.description);

  const userLanguages = userData.user.languages;
  const PointsToRank = userData.user.pointsToRank;
  const PointsToLevelUp = userData.user.pointsToLevel;

  const ranks = ['bronze', 'silver', 'gold', 'diamond', 'master'];
  const dispatch = useDispatch();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const jwtToken = authState.user.token;
      uploadImage(file, jwtToken);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    const jwtToken = authState.user?.token;
    if (user.username !== username) {
      dispatch<any>(
        updateUser({
          jwtToken,
          fieldName: 'username',
          fieldValue: username,
        }),
      ).then((result: any) => {
        if (updateUser.pending.match(result)) {
          <LoadingState />;
        } else if (updateUser.fulfilled.match(result)) {
          dispatch<any>(getUserByUsername({ jwtToken, username }));
        }
      });
    }

    if (user.first_name + ' ' + user.last_name !== name) {
      const nameParts = name.split(' ');
      const first_name = nameParts[0];
      const last_name = nameParts.slice(1).join(' ');
      dispatch<any>(
        updateUser({
          jwtToken,
          fieldName: 'first_name',
          fieldValue: first_name,
        }),
      ).then((result: any) => {
        if (updateUser.pending.match(result)) {
          <LoadingState />;
        } else if (updateUser.fulfilled.match(result)) {
          dispatch<any>(getUserByUsername({ jwtToken, username }));
        }
      });
      dispatch<any>(
        updateUser({ jwtToken, fieldName: 'last_name', fieldValue: last_name }),
      ).then((result: any) => {
        if (updateUser.pending.match(result)) {
          <LoadingState />;
        } else if (updateUser.fulfilled.match(result)) {
          dispatch<any>(getUserByUsername({ jwtToken, username }));
        }
      });
    }

    if (user.description !== description) {
      dispatch<any>(
        updateUser({
          jwtToken,
          fieldName: 'description',
          fieldValue: description,
        }),
      ).then((result: any) => {
        if (updateUser.fulfilled.match(result)) {
          dispatch<any>(getUserByUsername({ jwtToken, username }));
        }
      });
    }
  };

  return (
    <Container maxWidth="xl">
      <div className="profile-top-bottom">
        <div className="profile-left-right">
          <Paper
            sx={{
              width: '60rem',
              height: '90rem',
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
                {user.image ? (
                  <img
                    className="profile-img"
                    src={user?.image}
                    alt="user image"
                    onClick={() =>
                      document.getElementById('fileInput')?.click()
                    }
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <AccountBoxIcon
                    className="profile-account-box"
                    sx={{
                      width: '15rem',
                      height: '17rem',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      document.getElementById('fileInput')?.click()
                    }
                  />
                )}
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
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
                        padding: '1rem 1.5rem',
                      }}
                      className="profile-edit"
                    />
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      style={{
                        fontSize: '2.2rem',
                        color: '#999',
                        border: '1px solid white',
                        padding: '1rem 1.5rem',
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
                        padding: '1rem 1.5rem',
                      }}
                    >
                      {user?.first_name + ' ' + user?.last_name}
                    </p>
                    <p
                      style={{
                        color: '#999',
                        fontSize: '2.2rem',
                        padding: '1rem 1.5rem',
                      }}
                    >
                      {`#${user?.username}`}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div>
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  marginBottom: '2rem',
                }}
              >
                Description
              </Typography>
              <p
                style={{
                  fontSize: '1.5rem',
                  color: 'white',
                  textTransform: 'capitalize',
                  letterSpacing: '0.5px',
                  maxWidth: '50rem',
                  lineHeight: '1.8',
                  fontWeight: '500',
                  padding: '1rem 1.5rem',
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
                      fontFamily: 'inherit',
                      padding: '1rem 1.5rem',
                    }}
                    className="profile-edit"
                  />
                ) : (
                  user?.description
                )}
              </p>
            </div>
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
                  <p className="rank-txt">{user?.rank_points}</p>
                </div>
                <div className="rank-align">
                  <p className="rank-p">Current Rank</p>
                  <img
                    src={`/assets/${ranks[user?.rank_tier]}.svg`}
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
                    src={`/assets/${ranks[user?.rank_tier + 1]}.svg`}
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
                  <p className="rank-txt">{user?.exp}</p>
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
                    <p className="level-p">{user?.level}</p>
                  </div>
                </div>
                <div className="rank-align">
                  <p className="rank-p">Points to level up</p>
                  <p className="rank-txt">{PointsToLevelUp}</p>
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
                    <p className="level-p">{user?.level + 1}</p>
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
  );
};

export default ProfilePage;
