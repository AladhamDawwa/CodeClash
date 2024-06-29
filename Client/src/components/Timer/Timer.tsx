import { Avatar, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';
import axios from 'axios';
import { RootState } from '../../store/store';

const Timer = () => {
  const ranks = ['bronze', 'silver', 'gold', 'diamond', 'master'];
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);
  const userState = useSelector((state: RootState) => state.user);
  const jwtToken = authState.user?.token;
  const { data: userData } = userState;

  useEffect(() => {
    const endTime = new Date(userData.gameInfo.start_time).getTime() + userData.gameInfo.duration * 60 * 1000;
    const intervalId = setInterval(() => {
      const newTimeLeft = endTime - Date.now();

      if (newTimeLeft < 0) {
        clearInterval(intervalId);
        // socket.disconnect();
        navigate('/home');
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [navigate, userData]);

  const [opponent, setOpponent] = useState<any>(null);

  useEffect(() => {
    const opponentName = userData.username === userData.gameInfo.username_a ? userData.gameInfo.username_b : userData.gameInfo.username_a;
    const url = `http://localhost:5000/users/${opponentName}`;
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      setOpponent(res.data);
    });
  }, [jwtToken, userData]);

  const hours = Math.floor(timeLeft / (60 * 60 * 1000));
  const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

  return (
    <Box
      display="flex" 
      alignItems="center"
      justifyContent="space-between"
      width="60rem"
      px={3}
      py={2}
      sx={{
        borderRadius: '10rem',
        background: '#0F0C29',
        '@media (max-width: 900px)': {
          display: 'none',
        },
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        {
          userData && <Avatar alt="user 1" src={`assets/${ranks[userData.rank_tier]}.svg`} />
        }
        { userData?.image ? 
          <Avatar alt="user 1" src={`${userData.image}`} /> : 
          <Avatar alt="user 1" src="assets/avatar.png" />
        }
        <p style={{
          color: '#fff',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}>
          {userData.username}
        </p>
      </div>
      <Box
        fontSize={20}
        sx={{
          backgroundColor: '#c70039',
          color: '#fff',
          padding: '0.5rem 2rem',
          margin: '0 2rem',
          borderRadius: '0.5rem',
          width: '25%',
        }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box fontSize={22}>{`${hours} : ${minutes} : ${seconds}`}</Box>
      </Box>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <p style={{
          color: '#fff',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}>
          {userData.username === userData.gameInfo.username_a ? userData.gameInfo.username_b : userData.gameInfo.username_a}
        </p>
        { opponent?.image ? 
          <Avatar alt="user 2" src={`${opponent.image}`} /> : 
          <Avatar alt="user 2" src="assets/avatar.png" />
        }
        {
          opponent && <Avatar alt="user 1" src={`assets/${ranks[opponent.rank_tier]}.svg`} />
        }
      </div>
    </Box>
  );
};

export default Timer;
