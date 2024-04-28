import React, { useEffect, useState } from 'react';
import { socket } from '../../socket';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';

const MatchMaker = () => {
  const [matchFound, setMatchFound] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    socket.on('match_maker:found_match', () => {
      setMatchFound(true);
    });

    return () => {
      socket.off('match_maker:found_match');
    };
  }, []);

  const findMatch = () => {
    const { user } = auth;

    const token = user.token;

    socket.emit('match_maker_server:find_match', { token });
  };

  return (
    <div>
      {matchFound ? (
        <p>Match found! You're ready to play.</p>
      ) : (
        <Button onClick={findMatch}>Find Match</Button>
      )}
    </div>
  );
};

export default MatchMaker;
