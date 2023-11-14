import './style.css';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { signUp } from './helper';

const SignUp = () => {
  return (
    <div id='body'>
      <div id='logo'>
        <img src='./assets/logo.svg' alt='logo'></img>
      </div>
      <div id='signUpCard'>
        <Card id='card' variant='outlined'>
          <div id='title'>
            <h1>Sign Up</h1>
            <hr />
          </div>
          <TextField required className='inputs' label="First Name" variant="outlined" />
          <TextField required className='inputs' label="Last Name" variant="outlined" />
          <TextField required className='inputs' label="Username" variant="outlined" />
          <TextField required className='inputs' label="Email" variant="outlined" />
          <TextField required type="password" className='inputs' label="Password" variant="outlined" />
          <TextField required type="password" className='inputs' label="Confirm Password" variant="outlined" />
          <Button variant="contained" onClick={signUp}>Sign up</Button>
        </Card>
      </div>
    </div>
  )
}
export default SignUp