import './style.css';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import GoogleAuth from './GoogleAuth';
import { signIn } from './helper';
import { useRef } from 'react';

const SignIn = () => {
  const emailRef = useRef(null);
  const passRef = useRef(null);

  return (
    <div id='body'>
      <div id='logo'>
        <img src='./assets/logo.svg' alt='logo'></img>
      </div>
      <div id='logInCard'>
        <Card id='card' variant='outlined'>
          <div id='title'>
            <h1>Sign In</h1>
            <hr />
          </div>
          <TextField inputRef={emailRef} required className='inputs' label="Email" variant="outlined" />
          <TextField inputRef={passRef} required type="password" className='inputs' label="Password" variant="outlined" />
          <FormControlLabel control={<Checkbox />} label="Remember me" />
          <Link href="#" underline="hover">Forgot Password?</Link>
          <Button variant="contained" onClick={()=>{
            signIn(emailRef.current.value, passRef.current.value);
          }}>Sign in</Button>
          <div id='breaker'>
            <hr />
            <p>Or sign in with</p>
          </div>
          <GoogleAuth />
          <div>
            <span>Don't have an account? </span>
            <Link href="../signUp" underline="hover">Register</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
export default SignIn