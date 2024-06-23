import React, { useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Statues from '@mui/icons-material/FiberManualRecord';
import DeleteIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import Typography from '@mui/material/Typography';
import { Box, Button, Paper, Slide, Snackbar, TextField } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { inviteUser } from '../../store/actions/userInfo';
import { SnackbarOrigin } from '@mui/material/Snackbar';

interface State extends SnackbarOrigin {
  openn: boolean;
}

interface Team {
  open: boolean;
  onClick: () => void;
  team: {
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
  };
}

export default function TeamsList({ open, onClick, team }: Team) {
  const [state, setState] = useState<State>({
    openn: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { openn } = state;

  const handleCloseSnack = () => {
    setState({ ...state, openn: false });
  };

  const [showDialog, setshowDialog] = useState(false);
  const [teammateError, setteammateError] = useState(false);
  const [teammateUsername, setteammateUsername] = useState('');
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleinvite = async () => {
    if (!teammateUsername.trim()) {
      setteammateError(true);
    } else {
      setteammateError(false);
    }

    const jwtToken = authState.user.token;
    dispatch<any>(
      inviteUser({
        jwtToken,
        team_name: team.team_name,
        user: teammateUsername,
      }),
    )
      .then((responseData: { payload: string }) => {
        if (responseData.payload !== '') {
          handleClose();
          setState({ ...state, openn: true });
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleteamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setteammateUsername(e.target.value);

    if (!e.target.value.trim()) {
      setteammateError(true);
    } else {
      setteammateError(false);
    }
  };

  const handleClose = () => {
    setshowDialog(false);
  };

  const inviteButtons = () => {
    const remainingSlots = 3 - team.emails.length;
    const buttons = [];

    for (let i = 0; i < remainingSlots; i++) {
      buttons.push(
        <Button
          key={i}
          variant="contained"
          onClick={() => setshowDialog(!showDialog)}
          sx={{
            width: '32.5rem',
            minHeight: '7rem',
            backgroundColor: 'rgba(82, 88, 114, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '2rem',
            borderRadius: '0.5rem',
            fontSize: '1.7rem',
            textTransform: 'capitalize',
          }}
        >
          Invite Player
        </Button>,
      );
    }

    return buttons;
  };

  return (
    <div style={{ position: 'relative' }}>
      <List
        sx={{
          width: '35rem',
          minHeight: '6.5rem',
          backgroundColor: '#24243e',
          borderRadius: '0.5rem 0.5rem 0 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography variant="h4" sx={{ color: 'white', marginLeft: '2rem' }}>
            {team.team_name}
          </Typography>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {open ? (
              <ListItemButton disableRipple sx={{ padding: 0, margin: 0 }}>
                <DeleteIcon
                  sx={{
                    color: 'red',
                    fontSize: '2rem',
                  }}
                />
              </ListItemButton>
            ) : (
              <Statues
                sx={{
                  color: '#2cbb5d',
                  fontSize: '2rem',
                }}
              />
            )}

            <ListItemButton disableRipple onClick={onClick}>
              {open ? (
                <ExpandLessIcon
                  sx={{
                    color: 'white',
                    fontSize: '4rem',
                  }}
                />
              ) : (
                <ExpandMoreIcon
                  sx={{
                    color: 'white',
                    fontSize: '4rem',
                  }}
                />
              )}
            </ListItemButton>
          </div>
        </div>
      </List>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Paper
          elevation={3}
          sx={{
            width: '35rem',
            backgroundColor: '#24243e',
            borderRadius: '0 0 0.5rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
        >
          <List component="div">
            {team.emails.map((user, index) => (
              <ListItem
                key={index}
                sx={{
                  width: '32.5rem',
                  minHeight: '7rem',
                  backgroundColor: '#0f0c29',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  margin: '2rem',
                  borderRadius: '0.5rem',
                }}
              >
                <p
                  style={{
                    color: 'white',
                    fontSize: '1.7rem',
                  }}
                >
                  {user}
                </p>
              </ListItem>
            ))}
          </List>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {inviteButtons()}
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
                  onClick={handleClose}
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
                      onChange={handleteamNameChange}
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
                        onClick={handleClose}
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
                        onClick={handleinvite}
                      >
                        Invite
                      </Button>
                    </div>
                  </Paper>
                </Box>
              </Slide>
            )}
          </div>
        </Paper>
      </Collapse>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          fontSize: '2.5rem',
          '& .MuiPaper-root': {
            bgcolor: '#14751c',
            fontSize: '1.5rem',
            height: '5rem',
            width: '4rem',
            textTransform: 'capitalize',
          },
        }}
        open={openn}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        message="Invite sent!"
      />
    </div>
  );
}
