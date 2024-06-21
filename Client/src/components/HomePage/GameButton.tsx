import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
export default function GameButton( {gameSettings, children} : any ) {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      size="large"
      sx={{
        px: '4rem',
        fontSize: '2rem',
        textTransform: 'capitalize',
        backgroundColor: '#0f0c29',
      }}
      disableRipple
      disableElevation
      onClick={() => {
        navigate('/matchLoading', { state: { gameSettings } });
      }}
    >
      {children}
    </Button>
  );
}
