import './style.css'
import Button from '@mui/material/Button';
import { signInWithGoogle } from './helper';

const GoogleAuth = () => {
  return (
    <div onClick={signInWithGoogle} id='GoogleAuth'>
      <Button variant="contained">
        <img width={'15%'} src='./assets/google.svg' alt='google'></img>
        <span>Sign in with Google</span>
      </Button>
    </div>
  )
}
export default GoogleAuth