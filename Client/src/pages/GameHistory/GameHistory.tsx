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
  const [gameSubmissions, setGameSubmissions] = useState<any[]>([]);

  const jwtToken = authState.user?.token;

  useEffect(() => {
    dispatch<any>(getGameHistory({ username, jwtToken })).then(
      async (response: any) => {
        if (response.payload) {
          const sortedGameHistory = [...response.payload].sort(
            (a: any, b: any) => {
              const timeA =
                a.start_time._seconds * 1000 +
                a.start_time._nanoseconds / 1000000;
              const timeB =
                b.start_time._seconds * 1000 +
                b.start_time._nanoseconds / 1000000;
              return timeB - timeA;
            },
          );

          setGameHistory(sortedGameHistory);

          await Promise.all(
            response.payload.map(async (match: any) => {
              dispatch<any>(
                getGameSubmissions({ gameId: match?.id, username, jwtToken }),
              ).then((response: any) => {
                setGameSubmissions(prev => [...prev, response.payload]);
              });
            }),
          );
        }
      },
    );
  }, [dispatch, username, jwtToken]);
  console.log(gameHistory);
  return (
    <>
      {loading && <LoadingState />}
      {!loading && gameHistory && (
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
                  status={GAME_STATUS[match.user_b_result.status]}
                  amount={match.user_b_result.delta}
                  key={index}
                  submissions={gameSubmissions[index]}
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
