import React, { useState } from 'react';
import { Box, Button, Paper, Slide, TextField } from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { addTeam } from '../../store/actions/userInfo';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useSnackbar } from 'notistack';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface CreateTeamCardProps {
  open: boolean;
  onClose: () => void;
  onTeamCreated: (newTeam: any) => void;
}

const CreateTeamCard: React.FC<CreateTeamCardProps> = ({
  open,
  onClose,
  onTeamCreated,
}) => {
  const [teamNameError, setteamNameError] = useState(false);
  const [repeatedTeamName, setRepeatedTeamName] = useState(false);
  const [teamName, setteamName] = useState('');
  const [slogan, setslogan] = useState('');
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
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
        .then((responseData: { payload: any }) => {
          if (responseData.payload === 'Team name already exists') {
            setRepeatedTeamName(true);
            enqueueSnackbar('Team name is repeated', { variant: 'error' });
          } else {
            setRepeatedTeamName(false);
            onTeamCreated(responseData.payload);
            handleClose();
            enqueueSnackbar('New team created', { variant: 'success' });
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      {open ? (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 2,
            pointerEvents: open ? 'initial' : 'none',
            background: '#0f0c292d',
            backdropFilter: 'blur(2px) opacity(0.5) contrast(0.8)',
          }}
        />
      ) : null}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3,
          }}
          onClick={handleClose}
        >
          <Paper
            sx={{
              background: '#0f0c29',
              width: '50rem',
              height: '35rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4rem',
              padding: '1rem',
              borderRadius: '1rem',
              zIndex: 3,
              boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
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
              <GroupsOutlinedIcon
                sx={{ color: 'white', fontSize: '4rem', fontWeight: '400' }}
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
                  color: 'white',
                  fontSize: '1.7rem',
                  textTransform: 'capitalize',
                  background: '#f44336',
                  '&:hover': {
                    backgroundColor: '#d32f2f',
                  },
                }}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                disableElevation
                variant="contained"
                sx={{
                  color: 'white',
                  fontSize: '1.7rem',
                  textTransform: 'capitalize',
                  background: '#3f51b5',
                  '&:hover': {
                    backgroundColor: '#303f9f',
                  },
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
};

export default CreateTeamCard;
