import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Avatar,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import { CSSObject, Theme, styled } from '@mui/material/styles';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../store/reducers/authReducer';
import {
  clearUserState,
  updateGameResult,
} from '../store/reducers/userReducer';
import { RootState } from '../store/store';
import RankFlag from './RankFlag/RankFlag';
import { GameType, GameTypeString } from '../utils/game_settings';
import socket from '../socket';
import { useEffect } from 'react';

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

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
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
}));

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(false);
  const hasNotification = false;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const LogOut = () => {
    dispatch(logout());
    dispatch(clearUserState());

    navigate('/signIn');
  };

  const user = useSelector((state: RootState) => state.user.data);

  useEffect(() => {
    if (!user?.gameInfo) return;
    const url =
      user.gameInfo?.game_type == 0
        ? 'uvu_game_client'
        : user.gameInfo?.game_type == 1
          ? 'tvt_game_client'
          : 'lms_game_client';
    socket.on(`${url}:send_game_result`, (data: any) => {
      socket.disconnect();
      const updatedResult =
        user.gameInfo?.game_type == 1
          ? {
              rank_tier: data.new_tier,
              rank_points: data.new_points,
            }
          : user.gameInfo?.game_mode == 0
            ? {
                rank_tier: data.new_tier,
                rank_points: data.new_points,
                user_level: data.new_level,
              }
            : {
                user_level: data.new_level,
              };
      dispatch<any>(updateGameResult(updatedResult));
    });
  }, [user?.gameInfo]);

  return (
    <Box
      sx={{
        minWidth: 'calc(100vw - (100vw - 100%))',
        // backgroundColor: '#24243e',
      }}
    >
      <Drawer
        variant="permanent"
        open={open}
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
        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Logo */}

          <ListItem
            key={'home'}
            disablePadding
            sx={{
              display: 'block',
              '&:hover': {
                backgroundColor: '#1a1a1a',
              },
            }}
          >
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
              <ListItemText
                primaryTypographyProps={{
                  fontSize: '1.5rem',
                  letterSpacing: 1,
                  fontStyle: 'italic',
                }}
              >
                CodeClash
              </ListItemText>
            </ListItemButton>
          </ListItem>

          <Divider
            sx={{
              backgroundColor: 'white',
              opacity: 0.5,
              margin: '1rem 0',
            }}
          />

          {/* Profile */}

          <ListItem
            key={'profile'}
            disablePadding
            sx={{
              display: 'block',
              '&:hover': {
                backgroundColor: '#1a1a1a',
              },
            }}
          >
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
                {user?.image ? (
                  <img
                    style={{
                      borderRadius: '50%',
                      width: '4rem',
                      height: '4rem',
                      objectFit: 'cover',
                      boxShadow: '0 0 3px white',
                    }}
                    src={user?.image}
                    alt="user image"
                    className="user-img"
                  />
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
              <ListItemText
                primaryTypographyProps={{
                  fontSize: '1.5rem',
                  letterSpacing: 1,
                }}
              >
                Profile
              </ListItemText>
            </ListItemButton>
          </ListItem>

          {/* Teams */}

          <ListItem
            key={'Teams'}
            disablePadding
            sx={{
              display: 'block',
              '&:hover': {
                backgroundColor: '#1a1a1a',
              },
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 1.5,
              }}
              onClick={() => {
                handleDrawerClose();
                navigate('/teams');
              }}
            >
              <ListItemIcon>
                <Groups2RoundedIcon
                  sx={{
                    color: 'white',
                    fontSize: '4rem',
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  open
                    ? user?.current_team
                      ? `Teams : ${user.current_team}`
                      : 'Teams'
                    : 'Teams'
                }
                primaryTypographyProps={{
                  fontSize: '1.5rem',
                  letterSpacing: 1,
                }}
              />
            </ListItemButton>
          </ListItem>

          {/* Game History */}
          {/* {open && (

          )} */}
          <ListItem
            key={'Inbox'}
            disablePadding
            sx={{
              display: 'block',
              '&:hover': {
                backgroundColor: '#1a1a1a',
              },
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 1.5,
              }}
              onClick={() => {
                handleDrawerClose();
                navigate('/history');
              }}
            >
              <ListItemIcon>
                <HistoryRoundedIcon
                  sx={{
                    color: 'white',
                    fontSize: '4rem',
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={'Game History'}
                primaryTypographyProps={{
                  letterSpacing: 1,
                  fontSize: '1.5rem',
                }}
              />
            </ListItemButton>
          </ListItem>

          {/* Create Problem */}
          {/*           
          <ListItem
            key={'Create Problem'}
            disablePadding
            sx={{
              display: 'block',
              '&:hover': {
                backgroundColor: '#1a1a1a',
              },
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 1.5,
              }}
              onClick={() => {
                handleDrawerClose();
                navigate('/createProblem');
              }}
            >
              <ListItemIcon>
                <PostAddRoundedIcon
                  sx={{
                    color: 'white',
                    fontSize: '4rem',
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={'Create Problem'}
                primaryTypographyProps={{
                  letterSpacing: 1,
                  fontSize: '1.5rem',
                }}
              />
            </ListItemButton>
          </ListItem> */}

          {/* notification */}

          <ListItem
            key={'Notification'}
            disablePadding
            sx={{
              display: 'block',
              '&:hover': {
                backgroundColor: '#1a1a1a',
              },
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 1.5,
              }}
              onClick={() => {
                handleDrawerClose();
                navigate('/notifications');
              }}
            >
              <ListItemIcon>
                <Badge
                  badgeContent={hasNotification ? '' : null}
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: 'red',
                      height: '5px',
                      width: '5px',
                    },
                  }}
                >
                  <NotificationsIcon
                    sx={{
                      color: 'white',
                      fontSize: '4rem',
                    }}
                  />
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary={'Notifications'}
                primaryTypographyProps={{
                  letterSpacing: 1,
                  fontSize: '1.5rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <List>
          <ListItem
            key={'Logout'}
            disablePadding
            sx={{
              display: 'block',
              '&:hover': {
                backgroundColor: '#1a1a1a',
              },
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 1.5,
              }}
              onClick={LogOut}
            >
              <ListItemIcon>
                <LogoutIcon
                  sx={{
                    color: 'darkred',
                    fontSize: '4rem',
                    rotate: '180deg',
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={'Logout'}
                primaryTypographyProps={{
                  letterSpacing: 1,
                  fontSize: '1.5rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          filter: open ? 'blur(10px) opacity(0.5) grayscale(100%)' : 'none',
          transition: 'filter 0.2s ease',
          padding: '0 6rem',
        }}
      >
        <Outlet />
      </div>
      <div
        style={{
          position: 'fixed',
          top: '0',
          right: '0.8rem',
        }}
      >
        <RankFlag />
      </div>
      {/* GameStatus */}
      {user?.gameInfo && (
        <div
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            backgroundColor: '#0f0c29',
            boxShadow: '0 0 3px white',
            borderRadius: '1rem',
            width: '22rem',
            height: '5rem',
            cursor: 'pointer',
          }}
          onClick={() => {
            navigate('/gameSession');
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.5rem 1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'green',
                    boxShadow: '0 0 3px white',
                    transition: 'background-color 0.2s ease',
                    animation: 'pulse 2s infinite',
                    filter: 'brightness(1.5)',
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                <h3 style={{ margin: 0 }}>Game running in background</h3>
                <h1 style={{ margin: 0 }}>
                  {GameTypeString[user.gameInfo?.game_type]}
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
}
