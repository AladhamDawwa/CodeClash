import './style.css';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { setAuthenticated, clearError } from '../../store/reducers/authReducer';
type NavBar = {
  rankImg: string;
  rankAmount: number;
  userImg: string;
};
// TODO : apply useEffects to get the user info instead of props
export default function NavBar({ rankImg, rankAmount, userImg }: NavBar) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogoClick = () => {
    navigate('/');
  };
  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };
  const Profile = () => {
    navigate('/profile');
  };
  const GameHistory = () => {
    navigate('/history');
  };
  const LogOut = () => {
    dispatch(clearError());
    dispatch(setAuthenticated(false));
    navigate('/signIn');
  };
  return (
    <Paper
      elevation={2}
      sx={{
        width: '100%',
        backgroundColor: '#24243e',
        height: '7rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4rem 2rem',
        marginBottom: '5rem',
      }}
    >
      <div>
        <img
          style={{ cursor: 'pointer' }}
          src="/assets/logo.svg"
          className="logo"
          onClick={handleLogoClick}
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          justifyContent: 'space-between',
        }}
      >
        <img src={rankImg} className="rank-img" alt="rank image" />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '2rem',
          }}
        >
          <img className="rank-icon" src="/assets/Rank.svg" />
          <Typography variant="h4" sx={{ color: 'white', marginLeft: '10px' }}>
            {rankAmount}
          </Typography>
        </div>

        <div
          ref={anchorRef as React.RefObject<HTMLDivElement>}
          onClick={() => setOpen(!open)}
          style={{ position: 'relative' }}
        >
          <img src={userImg} alt="user image" className="user-img" />
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom-start' ? 'left top' : 'left bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      sx={{
                        width: '20rem',
                        backgroundColor: '#0f0c29',
                        boxShadow: '0 0 0.3rem black',
                      }}
                    >
                      <MenuItem
                        onClick={Profile}
                        sx={{ color: 'white', fontSize: '1.8rem' }}
                      >
                        Profile
                      </MenuItem>
                      <MenuItem
                        onClick={GameHistory}
                        sx={{ color: 'white', fontSize: '1.8rem' }}
                      >
                        Game History
                      </MenuItem>
                      <MenuItem
                        onClick={LogOut}
                        sx={{
                          color: 'white',
                          fontSize: '1.8rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        Log Out
                        <LogoutIcon sx={{ color: 'red', fontSize: '2rem' }} />
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    </Paper>
  );
}
