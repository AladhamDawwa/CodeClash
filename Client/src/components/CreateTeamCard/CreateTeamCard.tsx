import React, { useState } from 'react';
import { Box, Button, Paper, Slide, TextField, Snackbar } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { addTeam } from '../../store/actions/userInfo';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { SnackbarOrigin } from '@mui/material/Snackbar';

interface State extends SnackbarOrigin {
  openn: boolean;
}

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface funparams {
  open: boolean;
  onClose: any;
}

export default function CreateTeamCard({ open, onClose }: funparams) {
  const [state, setState] = useState<State>({
    openn: false,
    vertical: 'bottom',
    horizontal: 'center',
  });
  const { openn } = state;

  const handleCloseSnack = () => {
    setState({ ...state, openn: false });
  };
  const [teamNameError, setteamNameError] = useState(false);
  const [repeatedTeamName, setRepeatedTeamName] = useState(false);
  const [teamName, setteamName] = useState('');
  const [slogan, setslogan] = useState('');
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleteamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setteamName(e.target.value);

    if (!e.target.value.trim()) {
      setteamNameError(true);
    } else {
      setteamNameError(false);
    }
  };

  const handleSloganChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setslogan(e.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setteamNameError(true);
      return;
    } else {
      setteamNameError(false);
    }

    if (teamName) {
      const jwtToken = authState.user.token;
      dispatch<any>(addTeam({ jwtToken, teamName, slogan }))
        .then((responseData: { payload: string }) => {
          if (responseData.payload === 'team name already exists') {
            setRepeatedTeamName(true);
          } else {
            setRepeatedTeamName(false);
            handleClose();
            setState({ ...state, openn: true });
            console.log('Team created');
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
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
        message="Team Created!"
      />
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
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
              backdropFilter: 'blur(1px)',
              backgroundColor: 'rgba(0, 0, 0, 0.0001)',
              zIndex: 2,
              pointerEvents: open ? 'initial' : 'none',
              display: open ? 'block' : 'none',
            }}
          />

          <Paper
            sx={{
              backgroundColor: 'rgba(82, 88, 114, 0.9)',
              width: '60rem',
              height: '40rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5rem',
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
                Create your team
              </p>
              <GroupsIcon
                sx={{ color: 'white', fontSize: '3.2rem', alignSelf: 'center' }}
              />
            </div>
            <ThemeProvider theme={theme}>
              <TextField
                required
                error={teamNameError || repeatedTeamName}
                helperText={
                  teamNameError
                    ? 'Team name is required'
                    : repeatedTeamName
                      ? 'Repeated team name'
                      : ''
                }
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
                label="Team Name"
                variant="standard"
              />
              <TextField
                onChange={handleSloganChange}
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
                label="Slogan"
                variant="standard"
              />
            </ThemeProvider>
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
                onClick={handleCreateTeam}
              >
                Add team
              </Button>
            </div>
          </Paper>
        </Box>
      </Slide>
    </div>
  );
}
