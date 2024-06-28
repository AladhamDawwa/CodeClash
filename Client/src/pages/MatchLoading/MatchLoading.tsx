import { useSelector } from 'react-redux';
import LoadingMatchCard from '../../components/LoadingMatchCard/LoadingMatchCard';
import { useEffect } from 'react';
import { RootState } from '../../store/store';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../../socket';
import { useDispatch } from 'react-redux';
import { foundMatch } from '../../store/reducers/userReducer';

const MatchLoading = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = auth;

  useEffect(() => {
    socket.io.opts.extraHeaders = {
      token: user.token,
    };

    socket.connect();

    // socket.on('connect', () => {
    //   console.log('connected', socket.id);
    // });

    socket.emit(
      'match_maker_server:find_match',
      JSON.stringify({
        game_type: 0,
        game_mode: 0,
      }),
    );

    socket.on('match_maker_client:found_match', (game: any) => {
      dispatch(foundMatch(game));
      navigate('/gameSession', { state: { game } });
    });
  });

  return <LoadingMatchCard gameSettings={location.state.gameSettings} />;
};
export default MatchLoading;
