import './style.css';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import GoogleAuth from './GoogleAuth';

const SignIn = () => {
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
          <TextField required className='inputs' label="Username" variant="outlined" />
          <TextField required type="password" className='inputs' label="Password" variant="outlined" />
          <FormControlLabel control={<Checkbox />} label="Remember me" />
          <Link href="#" underline="hover">Forgot Password?</Link>
          <Button variant="contained">Sign in</Button>
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