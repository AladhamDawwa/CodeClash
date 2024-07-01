import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../index.css';
import { uploadImage } from '../../store/actions/authAction';
import { getUserByUsername, updateUser } from '../../store/actions/userInfo';
import { RootState } from '../../store/store';
import userData from './profile.json';
import './styles.css';
import { useSnackbar } from 'notistack';
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
  const { enqueueSnackbar } = useSnackbar();
  const ranks = ['bronze', 'silver', 'gold', 'diamond', 'master'];
  const dispatch = useDispatch();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const jwtToken = authState.user.token;
      uploadImage(file, jwtToken).then(() => {
        enqueueSnackbar('Image is being updated', { variant: 'info' });
        dispatch<any>(getUserByUsername({ jwtToken, username })).then(() => {
          enqueueSnackbar('Image is  updated', { variant: 'success' });
        });
      });
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    const jwtToken = authState.user?.token;
    if (
      user.username !== username ||
      user.first_name + ' ' + user.last_name !== name ||
      user.description !== description
    ) {
      const nameParts = name.split(' ');
      const first_name = nameParts[0];
      const last_name = nameParts.slice(1).join(' ');
      dispatch<any>(
        updateUser({
          jwtToken,
          first_name,
          last_name,
          username,
          description,
        }),
      ).then(() => {
        enqueueSnackbar('User Info is Updated', { variant: 'success' });
        dispatch<any>(getUserByUsername({ jwtToken, username }));
      });
    } else {
      return;
    }
  };

  return (
    <Container maxWidth="xl">
      <div className="profile-top-bottom">
        <div className="profile-left-right">
          <Paper
            sx={{
              width: '60rem',
              height: '96rem',
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
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                }}
              >
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="profile-edit"
                    />
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
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
                      {user?.first_name + ' ' + user?.last_name}
                    </p>
                    <p
                      style={{
                        color: '#999',
                        fontSize: '2rem',
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
                sx={{
                  color: 'white',
                  marginBottom: '2rem',
                  fontSize: '3rem',
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
                      minWidth: '52rem',
                      minHeight: '12rem',
                      fontWeight: '500',
                      resize: 'none',
                      overflowY: 'auto',
                      scrollbarWidth: 'none',
                      border: '1px solid #5d6ba1',
                      fontFamily: 'inherit',
                      padding: '1rem 1.5rem',
                      borderRadius: '0.5rem',
                    }}
                    className="profile-edit"
                  />
                ) : (
                  user?.description
                )}
              </p>
            </div>
            <Typography variant="h2" sx={{ color: 'white' }}>
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
            style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}
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
      </div>
    </Container>
  );
};

export default ProfilePage;
