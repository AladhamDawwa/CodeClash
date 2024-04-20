import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import {
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
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
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(show => !show);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  function validateUserName(event: ChangeEvent<HTMLInputElement>): void {
    console.log(event.target.value);
  }

  function validateEmail(event: ChangeEvent<HTMLInputElement>): void {
    console.log(event.target.value);
    const regex = new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$');
    if (regex.test(event.target.value)) {
      console.log('Valid email');
    } else {
      console.log('Invalid email');
    }
  }

  function validatePassword(event: ChangeEvent<HTMLInputElement>): void {
    console.log(event.target.value);
    if (event.target.value.length < 8) {
      console.log('Password too short');
    } else {
      console.log('Password long enough');
    }
  }

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
            // onChange={handleFirstNameChange}
            required
            // error={usernameError}
            // helperText={usernameError ? 'Username or Email is required' : ''}
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
            // onChange={handleFirstNameChange}
            required
            // error={usernameError}
            // helperText={usernameError ? 'Username or Email is required' : ''}
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
            // onChange={handleFirstNameChange}
            required
            // error={usernameError}
            // helperText={usernameError ? 'Username or Email is required' : ''}
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
            // onChange={handleFirstNameChange}
            required
            // error={usernameError}
            // helperText={usernameError ? 'Username or Email is required' : ''}
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
            // error={passwordError}
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
              // onChange={handlePasswordChange}
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
            {/* {passwordError && (
              <FormHelperText>Password is required</FormHelperText>
            )} */}
          </FormControl>

          <Button
            variant="contained"
            // onClick={handleLogin}
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
        </Card>
      </div>
    </div>
  );
};
export default SignUp;
