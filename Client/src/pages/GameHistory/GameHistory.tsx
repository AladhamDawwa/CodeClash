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

const GameHistory = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.data);
  const authState = useSelector((state: RootState) => state.auth);
  const username = user?.username;
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [gameSubmissions, setGameSubmissions] = useState<any[]>([]);

  const jwtToken = authState.user?.token;

  useEffect(() => {
    dispatch<any>(getGameHistory({ username, jwtToken })).then(
      async (response: any) => {
        if (response.payload) {
          setGameHistory(response.payload);

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
          {gameHistory.map((match, index) => (
            <MatchCard
              problemName="reverse integer"
              date="April 06, 2023"
              oppImage="/assets/avatar.png"
              status="loser"
              amount={50}
              key={index}
              gameCard={match}
              submissions={gameSubmissions[index]}
            />
          ))}
        </Stack>
      </div>
    </div>
  );
};
export default GameHistory;
