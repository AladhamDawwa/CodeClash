import { Avatar, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Timer = () => {
  const [endTime, setEndTime] = useState(Date.now() + 2 * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTimeLeft = endTime - Date.now();

      if (newTimeLeft < 0) {
        clearInterval(intervalId);

        navigate('/home');
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTime, navigate]);

  const hours = Math.floor(timeLeft / (60 * 60 * 1000));
  const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="45rem"
      p={2}
      sx={{
        backgroundImage: 'linear-gradient(0deg, #56508D 50%, #0F0C29 100%)',
        borderRadius: '0.5rem',
      }}
    >
      <Avatar alt="user 1" src="assets/user-1.jpg" />
      <Box
        fontSize={20}
        sx={{
          backgroundColor: '#0F0C29',
          color: '#fff',
          padding: '0.5rem 2rem',
          borderRadius: '0.5rem',
          width: '25%',
        }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box fontSize={22}>{`${hours}:${minutes}:${seconds}`}</Box>
      </Box>
      <Avatar alt="user 2" src="assets/avatar.png" />
    </Box>
  );
};

export default Timer;
