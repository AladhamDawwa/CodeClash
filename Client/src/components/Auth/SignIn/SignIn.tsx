import './style.css';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signInAction } from '../../../store/actions/authAction';

const SignIn = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = () => {
    dispatch(signInAction({ usernameOrEmail, password }));
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
            value={usernameOrEmail}
            onChange={e => setUsernameOrEmail(e.target.value)}
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
