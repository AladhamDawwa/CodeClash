import { Stack, Typography } from '@mui/material';
import './styles.css';
import MatchCard from '../../components/MatchCard';
const GameHistory = () => {
  return(
    <div style={{
      width: '100%',
      padding: '3rem 6rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '3rem',
    }}>
      <Typography
        variant="h2"
        sx={{ color: 'white', fontWeight: 'bold' }}
      >
        Latest Matches
      </Typography>
      <div>
        <Stack direction="column" spacing={5}>
          <MatchCard
            problemName="reverse integer"
            date="April 06, 2023"
            oppImage="/assets/avatar.png"
            status="loser"
            amount={50}
          />
          <MatchCard
            problemName="reverse integer"
            date="April 06, 2023"
            oppImage="/assets/avatar.png"
            status="loser"
            amount={50}
          />
        </Stack>
      </div>
    </div>
  );
};
export default GameHistory;
