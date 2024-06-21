import React, { useEffect, useState } from 'react';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { io } from 'socket.io-client';

const MatchMaker = () => {
  const [matchFound, setMatchFound] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const { user } = auth;

    const socket = io('http://localhost:5000', {
      extraHeaders: {
        token: user.token,
      },
    });

    socket.on('connect', () => {
      console.log('connected', socket.id);
    });

    socket.emit(
      'match_maker_server:find_match',
      JSON.stringify({
        game_type: '0',
        game_mode: '0',
      }),
    );

    // I need to print if the connection is closed or there is an error
    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [auth]);

  // const findMatch = () => {
  //   const { user } = auth;

  //   const token = user.token;

  //   socket.emit('match_maker_server:find_match', { token });
  // };

  return (
    <div>
      {matchFound ? (
        <p>Match found! You're ready to play.</p>
      ) : (
        <Button>Find Match</Button>
      )}
    </div>
  );
};

export default MatchMaker;
