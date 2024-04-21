import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
} from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUpAction } from '../../../store/actions/authAction';
import { clearError } from '../../../store/reducers/authReducer';
import store, { RootState } from '../../../store/store';
import './style.css';

const SignUp = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const { loading, error } = authState;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(show => !show);
  };

  const handleClickShowPasswordConfirm = () => {
    setShowConfirmPassword(show => !show);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  function handleFirstNameChange(event: ChangeEvent<HTMLInputElement>): void {
    setFirstName(event.target.value);

    if (event.target.value.trim() === '') {
      setFirstNameError(true);
    } else {
      setFirstNameError(false);
    }
  }

  function handleLastNameChange(event: ChangeEvent<HTMLInputElement>): void {
    setLastName(event.target.value);

    if (event.target.value.trim() === '') {
      setLastNameError(true);
    } else {
      setLastNameError(false);
    }
  }

  function handleUserNameChange(event: ChangeEvent<HTMLInputElement>): void {
    setUserName(event.target.value);

    if (event.target.value.trim() === '') {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>): void {
    validateEmail(event);

    setEmail(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>): void {
    validatePassword(event);

    setPassword(event.target.value);
  }

  function handlePasswordConfirmChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    if (event.target.value !== password) {
      setPasswordConfirmError(true);
    } else {
      setPasswordConfirmError(false);
    }
    setPasswordConfirm(event.target.value);
  }

  function validateEmail(event: ChangeEvent<HTMLInputElement>): void {
    const regex = new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$');
    if (regex.test(event.target.value)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  }

  function validatePassword(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.value.length < 8) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  }

  function handleSignUp(): void {
    if (
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      userName.trim() === '' ||
      email.trim() === '' ||
      password.trim() === '' ||
      passwordConfirm.trim() === ''
    ) {
      setFirstNameError(firstName.trim() === '');
      setLastNameError(lastName.trim() === '');
      setUsernameError(userName.trim() === '');
      setEmailError(email.trim() === '');
      setPasswordError(password.trim() === '');
      setPasswordConfirmError(passwordConfirm.trim() === '');
      return;
    }

    if (
      firstNameError ||
      lastNameError ||
      usernameError ||
      emailError ||
      passwordError ||
      passwordConfirmError
    ) {
      return;
    }

    dispatch<any>(
      signUpAction({
        first_name: firstName,
        last_name: lastName,
        username: userName,
        email,
        password,
      }),
    ).then(() => {
      const state = store.getState();
      if (!state.auth.error) {
        setFirstName('');
        setLastName('');
        setUserName('');
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
        navigate('/home');
      }
    });
  }

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
            <h1>Sign Up</h1>
          </div>
          <TextField
            value={firstName}
            onChange={handleFirstNameChange}
            required
            error={firstNameError}
            helperText={firstNameError ? 'First Name is required' : ''}
            label="First Name"
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
          <TextField
            value={lastName}
            onChange={handleLastNameChange}
            required
            error={lastNameError}
            helperText={lastNameError ? 'Last Name is required' : ''}
            label="Last Name"
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
          <TextField
            value={userName}
            onChange={handleUserNameChange}
            required
            error={usernameError}
            helperText={usernameError ? 'Username is required' : ''}
            label="Username"
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
          <TextField
            value={email}
            onChange={handleEmailChange}
            required
            error={emailError}
            helperText={emailError ? 'Email is not valid' : ''}
            label="Email"
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
              <FormHelperText>
                Password should be at least 8 characters
              </FormHelperText>
            )}
          </FormControl>

          <FormControl
            variant="outlined"
            margin="normal"
            fullWidth
            required
            disabled={loading}
            error={passwordConfirmError}
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
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              label="Password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPasswordConfirm}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{ '& svg': { fontSize: '2rem' } }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {passwordConfirmError && (
              <FormHelperText>Password is Not Matched</FormHelperText>
            )}
          </FormControl>

          <Button
            variant="contained"
            onClick={handleSignUp}
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
            Sign up
          </Button>
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
        </Card>
      </div>
    </div>
  );
};
export default SignUp;
