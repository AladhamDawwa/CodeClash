import { Stack, Typography } from '@mui/material';
import './styles.css';
import MatchCard from '../../components/MatchCard';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  getGameHistory,
  getGameSubmissions,
} from '../../store/actions/userInfo';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import GAME_STATUS from '../../utils/game_status';
import LoadingState from '../../components/LoadingState';
const GameHistory = () => {
  const dispatch = useDispatch();

  const authState = useSelector((state: RootState) => state.auth);
  const { loading, data } = useSelector((state: RootState) => state.user);

  const username = data?.username;
  const [gameHistory, setGameHistory] = useState<any[]>([]);

  const jwtToken = authState.user?.token;

  useEffect(() => {
    dispatch<any>(getGameHistory({ username, jwtToken })).then(
      async (response: any) => {
        if (response.payload) {
          setGameHistory(response.payload);
        }
      },
    );
  }, [dispatch, username, jwtToken]);
  return (
    <>
      {loading && gameHistory.length === 0 && <LoadingState />}
      {gameHistory && (
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
              {gameHistory.map((match, index) => (
                <MatchCard
                  startDate={match.start_time}
                  problemName={match.id}
                  oppImage="/assets/avatar.png"
                  status={
                    match?.user_b_result?.username === data?.username
                      ? GAME_STATUS[match?.user_b_result?.status]
                      : GAME_STATUS[match?.user_a_result?.status]
                  }
                  amount={
                    match?.user_b_result?.username === data?.username
                      ? match?.user_b_result?.delta
                      : match?.user_a_result?.status
                  }
                  key={index}
                  gameHistory={match}
                />
              ))}
            </Stack>
          </div>
        </div>
      )}
    </>
  );
};
export default GameHistory;
