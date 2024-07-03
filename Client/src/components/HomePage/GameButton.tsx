import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import { useNavigation } from '../../NavigationContext';
export default function GameButton({ gameSettings, text, children }: any) {
  const navigate = useNavigate();
  const { allowMatchLoadingAccess } = useNavigation();

  return (
    <Button
      variant="contained"
      size="large"
      sx={{
        px: '4rem',
        fontSize: '2rem',
        textTransform: 'capitalize',
        backgroundColor: '#3f51b5',
        color: 'white',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',

        '&:hover': {
          backgroundColor: '#303f9f',
        },
      }}
      disableRipple
      disableElevation
      onClick={() => {
        allowMatchLoadingAccess();
        navigate('/matchLoading', { state: { gameSettings, text } });
      }}
    >
      {gameSettings && text.type === 'Ranked' ? (
        <LeaderboardRoundedIcon
          sx={{
            fontSize: '3rem',
            mr: '1rem',
          }}
        />
      ) : gameSettings && text.type !== 'Register' ? (
        <FitnessCenterRoundedIcon
          sx={{
            fontSize: '3rem',
            mr: '1rem',
          }}
        />
      ) : null}
      {children}
    </Button>
  );
}
