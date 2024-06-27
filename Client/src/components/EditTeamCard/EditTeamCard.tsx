import React, { useState } from 'react';
import { Box, Button, Paper, Slide, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { editTeam } from '../../store/actions/userInfo';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface funparams {
  open: boolean;
  onClose: any;
  team: any;
  onTeamEdited: any;
}

export default function EditTeamCard({
  open,
  onClose,
  team,
  onTeamEdited,
}: funparams) {
  const [teamNameError, setteamNameError] = useState(false);
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

  const handleEditTeam = async () => {
    if (!teamName.trim()) {
      setteamNameError(true);
      return;
    } else {
      setteamNameError(false);
    }

    if (teamName) {
      const jwtToken = authState.user.token;
      dispatch<any>(
        editTeam({
          jwtToken,
          oldteamName: team.team_name,
          newteamName: teamName,
          slogan,
        }),
      )
        .then((responseData: { payload: any }) => {
          if (responseData.payload === '') {
            //handle error
          } else {
            onTeamEdited(responseData.payload);
            handleClose();
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
            background: '#0f0c294b',
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
              height: 'fitContent',
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
                Edit your team
              </p>
              <EditIcon
                sx={{
                  color: 'white',
                  fontSize: '2.5rem',
                  fontWeight: '400',
                  alignSelf: 'center',
                }}
              />
            </div>
            <ThemeProvider theme={theme}>
              <TextField
                placeholder={team.team_name}
                required
                error={teamNameError}
                helperText={teamNameError ? 'Team name is required' : ''}
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
                placeholder={team.slogan}
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
                onClick={handleEditTeam}
              >
                Edit team
              </Button>
            </div>
          </Paper>
        </Box>
      </Slide>
    </div>
  );
}
