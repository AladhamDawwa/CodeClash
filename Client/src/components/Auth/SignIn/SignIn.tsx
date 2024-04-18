import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { MouseEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInAction } from '../../../store/actions/authAction';
import { RootState } from '../../../store/store';
import './style.css';

const SignIn = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = () => {
    dispatch(signInAction({ username, password }));
    console.log('authState:', authState);
  };

  return (
    <div id="body">
      <div id="logo">
        <img src="./assets/logo.svg" alt="logo"></img>
      </div>
      <div id="logInCard">
        <Card id="card" variant="outlined">
          <div id="title">
            <h1>Sign In</h1>
            <hr />
          </div>
          <TextField
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="inputs"
            label="Email"
            variant="outlined"
          />
          <OutlinedInput
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="inputs"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          <FormControlLabel control={<Checkbox />} label="Remember me" />
          <Link href="#" underline="hover">
            Forgot Password?
          </Link>
          <Button variant="contained" onClick={handleLogin}>
            Sign in
          </Button>
          <div>
            <span>Don't have an account? </span>
            <Link href="../signUp" underline="hover">
              Register
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default SignIn;
