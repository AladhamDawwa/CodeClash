import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import { Avatar, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { clearError, setAuthenticated } from '../store/reducers/authReducer';
import RankFlag from './RankFlag/RankFlag';

const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  zIndex: 1,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(8)})`,
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const LogOut = () => {
    dispatch(clearError());
    dispatch(setAuthenticated(false));
    navigate('/signIn');
  };

  const user = useSelector((state: RootState) => state.user.data);

  return (
    <Box sx={{ 
      minWidth: 'calc(100vw - (100vw - 100%))',
      // backgroundColor: '#24243e',
    }}>
      <Drawer variant="permanent" open={open} 
      onMouseEnter={handleDrawerOpen} 
      onMouseLeave={handleDrawerClose}
      sx={{
        '& .MuiDrawer-paper': { 
          background: '#0f0c29',
          color: 'white',
          boxShadow: '0 0 3px white',
          justifyContent: 'space-between',
          padding: '1rem 0',
        },
      }}
      >
        <List sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>

          {/* Logo */}

          <ListItem key={'home'} disablePadding sx={{ 
            display: 'block',
            '&:hover': {
              backgroundColor: '#1a1a1a',
            }
          }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 1.5,
              }}
              onClick={() => {
                handleDrawerClose();
                navigate('/home');
              }}
            >
              <ListItemIcon>
              <Avatar
                  sx={{
                    cursor: 'pointer',
                    boxShadow: '0 0 3px white',
                    width: '4rem',
                    height: '4rem',
                  }}
                  src="/assets/logo.svg"
                  />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{
                fontSize: '1.5rem',
                letterSpacing: 1,
                fontStyle: 'italic',
              }}>CodeClash</ListItemText>
            </ListItemButton>
          </ListItem>

          <Divider sx={{ 
            backgroundColor: 'white',
            opacity: 0.5,
            margin: '1rem 0', 
          }} />

          {/* Profile */}

          <ListItem key={'profile'} disablePadding sx={{ 
            display: 'block',
            '&:hover': {
              backgroundColor: '#1a1a1a',
            }
          }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 1.5,
              }}
              onClick={() => {
                handleDrawerClose();
                navigate('/Profile');
              }}
            >
              <ListItemIcon>
                {user.image ? (
                    <img style={{
                      borderRadius: '50%',
                      width: '4rem',
                      height: '4rem',
                      objectFit: 'cover',
                      boxShadow: '0 0 3px white',
                    }} src={user.image} alt="user image" className="user-img" />
                  ) : (
                    <Avatar
                      className="navbar-avatar"
                      sx={{
                        cursor: 'pointer',
                        boxShadow: '0 0 3px white',
                      }}
                      src="/broken-image.jpg"
                    />
                )}
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{
                fontSize: '1.5rem',
                letterSpacing: 1,
              }}>Profile</ListItemText>
            </ListItemButton>
          </ListItem>

          {/* Teams */}

          <ListItem key={'Teams'} disablePadding sx={{ 
            display: 'block',
            '&:hover': {
              backgroundColor: '#1a1a1a',
            }
          }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 1.5,
              }}
            >
              <ListItemIcon>
                <Groups2RoundedIcon sx={{
                  color: 'white',
                  fontSize: '4rem',
                }}/>
              </ListItemIcon>
              <ListItemText primary={'Teams'} primaryTypographyProps={{
                fontSize: '1.5rem',
                letterSpacing: 1,
              }} />
            </ListItemButton>
          </ListItem>

          {/* Game History */}

          <ListItem key={'Inbox'} disablePadding sx={{ 
            display: 'block',
            '&:hover': {
              backgroundColor: '#1a1a1a',
            }
          }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 1.5,
              }}
            >
              <ListItemIcon>
                <HistoryRoundedIcon sx={{
                  color: 'white',
                  fontSize: '4rem',
                }}/>
              </ListItemIcon>
              <ListItemText primary={'Game History'} primaryTypographyProps={{
                letterSpacing: 1,
                fontSize: '1.5rem',
              }} />
            </ListItemButton>
          </ListItem>

          

        </List>

        <List>
          <ListItem key={'Logout'} disablePadding sx={{ 
            display: 'block',
            '&:hover': {
              backgroundColor: '#1a1a1a',
            }
          }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 1.5,
              }}
              onClick={LogOut}
            >
              <ListItemIcon>
                <LogoutIcon sx={{
                  color: 'darkred',
                  fontSize: '4rem',
                  rotate: '180deg',
                }}/>
              </ListItemIcon>
              <ListItemText primary={'Logout'} primaryTypographyProps={{
                letterSpacing: 1,
                fontSize: '1.5rem',
              }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        filter: open ? 'blur(10px) opacity(0.5) grayscale(100%)' : 'none',
        transition: 'filter 0.2s ease',
        padding: '0 6rem',
      }}>
        <Outlet />
      </div>
      <div style={{
        position: 'fixed',
        top: '0',
        right: '0.8rem',
      }}>
        <RankFlag/>
      </div>
    </Box>
  );
}
