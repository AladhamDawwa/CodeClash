import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import { MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInAction } from '../../../store/actions/authAction';
import { clearError } from '../../../store/reducers/authReducer';
import { store, RootState } from '../../../store/store';
import './style.css';

const SignIn = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const { loading, error } = authState;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(show => !show);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);

    if (!e.target.value.trim()) {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);

    if (!e.target.value.trim()) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleLogin = () => {
    if (!username.trim()) {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }

    if (!password.trim()) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (username && password) {
      dispatch<any>(signInAction({ username, password })).then(() => {
        const state = store.getState();
        if (!state.auth.error) {
          setUsername('');
          setPassword('');
          navigate('/home');
        }
      });
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (error) {
      setOpenSnackbar(true);
    }
  }, [dispatch, error]);

  return (
    <div id="body">
      <div id="logo">
        <img src="./assets/logo.svg" alt="logo"></img>
      </div>
      <div id="logInCard">
        <Card id="card" variant="outlined">
          <div id="title">
            <h1>Sign In</h1>
          </div>
          <TextField
            value={username}
            onChange={handleUsernameChange}
            required
            error={usernameError}
            helperText={usernameError ? 'Username or Email is required' : ''}
            label="Username or Email"
            variant="outlined"
            margin="normal"
            fullWidth
            disabled={loading}
            sx={{
              '& .MuiInputLabel-root': {
                fontSize: '1.5rem',
              },
              '& .MuiOutlinedInput-root': {
                fontSize: '1.5rem',
              },
              '& .MuiFormHelperText-root': {
                fontSize: '1.2rem',
              },
            }}
          />
          <FormControl
            variant="outlined"
            margin="normal"
            fullWidth
            required
            disabled={loading}
            error={passwordError}
            sx={{
              '& .MuiInputLabel-root': {
                fontSize: '1.5rem',
              },
              '& .MuiOutlinedInput-root': {
                fontSize: '1.5rem',
              },
              '& .MuiFormHelperText-root': {
                fontSize: '1.2rem',
              },
              mb: '1.8rem',
            }}
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              label="Password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{ '& svg': { fontSize: '2rem' } }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {passwordError && (
              <FormHelperText>Password is required</FormHelperText>
            )}
          </FormControl>

          <Button
            variant="contained"
            onClick={handleLogin}
            size="large"
            sx={{
              mb: '1.5rem',
              fontSize: '1.5rem',
              ...(loading && {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }),
              textTransform: 'capitalize',
            }}
            disableElevation
            disableRipple
            fullWidth
            disabled={loading}
            endIcon={loading && <CircularProgress size={20} />}
          >
            Sign in
          </Button>
          <div className="register-link">
            <span>Don't have an account? </span>
            <Link href="../signUp" underline="hover">
              Register
            </Link>
          </div>
        </Card>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{
            width: '100%',
            alignItems: 'center',
            '& .MuiAlert-message': {
              fontSize: '1.5rem',
            },
            '& .MuiAlert-icon': {
              fontSize: '2.5rem',
            },
            '& .MuiAlert-action': {
              paddingTop: 0,
            },
            '& .MuiSvgIcon-root': {
              fontSize: '2rem',
            },
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};
export default SignIn;
