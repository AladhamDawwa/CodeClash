import {
  Button,
  Typography,
  Slide,
  Box,
  Paper,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { inviteUser } from '../../store/actions/userInfo';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
import { useState } from 'react';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import EditTeamCard from '../EditTeamCard/EditTeamCard';
import { useSnackbar } from 'notistack';
import { activateTeam } from '../../store/reducers/userReducer';

const ranks = ['bronze', 'silver', 'gold', 'diamond', 'master'];

const TeamCard = ({ team }: any) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const auth = useSelector((state: RootState) => state.auth);
  const { current_team } = useSelector((state: RootState) => state.user.data);
  const dispatch = useDispatch();
  const [showEditCard, setShowEditCard] = useState(false);
  const [Team, setTeam] = useState(team);
  const { enqueueSnackbar } = useSnackbar();
  const handleShowEditTeam = () => {
    setShowEditCard(true);
  };
  const handleCloseEditTeam = () => {
    setShowEditCard(false);
  };

  const handleDeleteTeam = () => {
    if (current_team === Team.team_name) {
      dispatch<any>(
        activateTeam({
          current_team: '',
        }),
      );
    }
    axios
      .delete(`${apiUrl}/teams/delete`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
          'Content-Type': 'application/json',
        },
        data: {
          team_name: Team.team_name,
        },
      })
      .then(() => {
        enqueueSnackbar('Team is deleted', { variant: 'success' });
        location.reload();
      });
  };

  const [showDialog, setShowDialog] = useState(false);
  const [teammateError, setTeammateError] = useState(false);
  const [teammateUsername, setTeammateUsername] = useState('');

  const handleEditTeam = (response: string) => {
    setTeam(response);
    enqueueSnackbar('Team data updated', { variant: 'success' });
  };

  const handleInvite = async () => {
    if (!teammateUsername.trim()) {
      setTeammateError(true);
      return;
    }

    setTeammateError(false);

    const jwtToken = auth.user.token;
    dispatch<any>(
      inviteUser({
        jwtToken,
        team_name: Team.team_name,
        user: teammateUsername,
      }),
    )
      .then((responseData: { payload: any }) => {
        if (responseData.payload.members) {
          enqueueSnackbar('User invited', { variant: 'success' });
          setTeam(responseData.payload);
          handleCloseDialog();
        } else {
          enqueueSnackbar('No username matched', { variant: 'error' });
          return;
        }
      })
      .catch((error: any) => {
        enqueueSnackbar('Error inviting user', { variant: 'error' });
        console.log(error);
      });
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeammateUsername(e.target.value);
    setTeammateError(!e.target.value.trim());
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        width: 'fit-content',
        height: 'fit-content',
        gap: '1rem',
        borderRadius: '1rem',
        boxShadow: '0 0 2rem rgba(0, 0, 0, 0.6)',
        padding: '1rem 2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {Team.team_name}
          </Typography>

          {Team.slogan && (
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontStyle: 'italic',
              }}
            >
              "{Team.slogan}"
            </Typography>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          <Button
            sx={{
              minWidth: '4rem',
              minHeight: '4rem',
              color: 'white',
              borderRadius: '20rem',
              backgroundColor: '#3f51b5',
              '&:hover': {
                backgroundColor: '#303f9f',
              },
            }}
            onClick={() => setShowDialog(!showDialog)}
          >
            <PersonAddAlt1RoundedIcon
              sx={{
                fontSize: '2rem',
              }}
            />
          </Button>

          <Button
            sx={{
              minWidth: '4rem',
              minHeight: '4rem',
              color: 'white',
              borderRadius: '20rem',
              backgroundColor: '#4caf50',
              '&:hover': {
                backgroundColor: '#388e3c',
              },
            }}
            onClick={handleShowEditTeam}
          >
            <ModeEditOutlineRoundedIcon
              sx={{
                fontSize: '2rem',
              }}
            />
          </Button>

          <Button
            sx={{
              minWidth: '4rem',
              minHeight: '4rem',
              color: 'white',
              borderRadius: '20rem',
              backgroundColor: '#f44336',
              '&:hover': {
                backgroundColor: '#d32f2f',
              },
            }}
            onClick={handleDeleteTeam}
          >
            <DeleteOutlineRoundedIcon
              sx={{
                fontSize: '2rem',
              }}
            />
          </Button>
        </div>
      </div>

      {showEditCard && (
        <EditTeamCard
          open={true}
          onClose={handleCloseEditTeam}
          team={Team}
          onTeamEdited={handleEditTeam}
        />
      )}

      <div
        style={{
          display: 'flex',
          gap: '3rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            padding: '2rem',
          }}
        >
          <img
            src={`assets/${ranks[Team?.rank_tier]}.svg`}
            alt="rank image"
            style={{
              width: '6.5rem',
              height: '6.5rem',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <img
              src="/assets/Rank.svg"
              style={{
                width: '4rem',
                height: '4rem',
              }}
            />
            <Typography variant="h4" sx={{ color: 'white' }}>
              {Team?.rank_points}
            </Typography>
          </div>

          <Button
            sx={{
              bgcolor: '#14751c',
              color: 'white',
              fontSize: '1.7rem',
              textTransform: 'capitalize',
              borderRadius: '0.5rem',
              '&:hover': {
                backgroundColor: '#0d4b1c',
              },
              '&:disabled': {
                backgroundColor: '#555',
                color: '#999',
                cursor: 'not-allowed',
              },
            }}
            disabled={current_team === Team?.team_name}
            onClick={() => {
              if (Team.members.length < 2) {
                enqueueSnackbar('Not enough members', { variant: 'error' });
                return;
              } else {
                dispatch<any>(
                  activateTeam({
                    current_team: Team.team_name,
                  }),
                );
                enqueueSnackbar(`${Team.team_name} is set to current team`, {
                  variant: 'success',
                });
              }
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: 'white',
              }}
            >
              Activate
            </Typography>
          </Button>
        </div>

        <div>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Members
          </Typography>
          <ul
            style={{
              listStyle: 'none',
              padding: '1rem 0',
              margin: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {Team.members.map((member: string) => (
              <li
                key={member}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '0.5rem',
                  borderRadius: '1rem',
                  width: '24rem',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                  }}
                >
                  <PersonRoundedIcon
                    sx={{
                      color: 'white',
                      fontSize: '3rem',
                    }}
                  />
                  <Typography variant="h4" sx={{ color: 'white' }}>
                    {member}
                  </Typography>
                </div>
                <Button
                  sx={{
                    minWidth: '4rem',
                    minHeight: '4rem',
                    borderRadius: '20rem',
                    color: 'white',
                    backgroundColor: '#f44336',
                    '&:hover': {
                      backgroundColor: '#d32f2f',
                    },
                  }}
                  onClick={() => {
                    if (current_team === Team.team_name) {
                      dispatch<any>(
                        activateTeam({
                          current_team: '',
                        }),
                      );
                    }
                    axios
                      .post(
                        `${apiUrl}/teams/remove_user`,
                        {
                          team_name: Team.team_name,
                          user: member,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${auth.user.token}`,
                            'Content-Type': 'application/json',
                          },
                        },
                      )
                      .then(() => {
                        enqueueSnackbar('Member is removed', {
                          variant: 'success',
                        });
                        location.reload();
                      })
                      .catch(() => {
                        enqueueSnackbar('Error removing user', {
                          variant: 'error',
                        });
                      });
                  }}
                >
                  <PersonRemoveRoundedIcon
                    sx={{
                      fontSize: '2rem',
                    }}
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showDialog && (
        <Slide direction="up" in={showDialog} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 3,
            }}
            onClick={handleCloseDialog}
          >
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.0001)',
                zIndex: 2,
                pointerEvents: showDialog ? 'initial' : 'none',
                display: showDialog ? 'block' : 'none',
              }}
            />

            <Paper
              sx={{
                backgroundColor: 'rgba(82, 88, 114, 0.9)',
                width: '50rem',
                height: '30rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3rem',
                padding: '2rem',
                borderRadius: '5px',
                zIndex: 3,
                position: 'relative',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '2rem',
                  marginTop: '2rem',
                  borderRadius: '5px',
                }}
              >
                <p
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: '3rem',
                    justifyContent: 'center',
                    fontWeight: '400',
                    textTransform: 'capitalize',
                  }}
                >
                  Teammate Username
                </p>
                <PersonAddAltIcon
                  sx={{
                    color: 'white',
                    fontSize: '3.2rem',
                    alignSelf: 'center',
                  }}
                />
              </div>
              <TextField
                required
                error={teammateError}
                helperText={teammateError ? 'Username is required' : ''}
                onChange={handleTeamNameChange}
                sx={{
                  width: '30rem',
                  '& .MuiInputLabel-root': {
                    fontSize: '1.5rem',
                    fontWeight: '500',
                  },
                  '& .MuiInputBase-root': {
                    fontSize: '1.5rem',
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: '1.2rem',
                  },
                }}
                label="Username"
                variant="standard"
              />
              <div style={{ display: 'flex', gap: '10rem' }}>
                <Button
                  disableElevation
                  variant="contained"
                  sx={{
                    bgcolor: '#bb1a1a',
                    color: 'white',
                    fontSize: '1.7rem',
                    textTransform: 'capitalize',
                  }}
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button
                  disableElevation
                  variant="contained"
                  sx={{
                    bgcolor: '#14751c',
                    color: 'white',
                    fontSize: '1.7rem',
                    textTransform: 'capitalize',
                  }}
                  onClick={handleInvite}
                >
                  Invite
                </Button>
              </div>
            </Paper>
          </Box>
        </Slide>
      )}
    </div>
  );
};

export default TeamCard;
