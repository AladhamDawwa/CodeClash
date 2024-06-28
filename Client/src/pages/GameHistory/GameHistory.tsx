import { Stack, Typography } from '@mui/material';
import './styles.css';
import MatchCard from '../../components/MatchCard';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getGameHistory } from '../../store/actions/userInfo';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const GameHistory = () => {
  const dispatch = useDispatch();
  // get the user state from the store
  const user = useSelector((state: RootState) => state.user.data);
  const authState = useSelector((state: RootState) => state.auth);
  const username = user?.username;

  const jwtToken = authState.user?.token;

  useEffect(() => {
    dispatch<any>(getGameHistory({ username, jwtToken }));
  }, [dispatch, username, jwtToken]);

  return (
    <div
      style={{
        width: '100%',
        padding: '3rem 6rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem',
      }}
    >
      <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
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
