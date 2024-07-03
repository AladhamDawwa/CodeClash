import { useSelector } from 'react-redux';
import LoadingMatchCard from '../../components/LoadingMatchCard/LoadingMatchCard';
import { useEffect } from 'react';
import { RootState } from '../../store/store';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../../socket';
import { useDispatch } from 'react-redux';
import { foundMatch } from '../../store/reducers/userReducer';
import { GameType } from '../../utils/game_settings';

const MatchLoading = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const userState = useSelector((state: RootState) => state.user.data);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = auth;
  const { gameSettings, text } = location.state;

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
      gameSettings.mode === GameType.OneVsOne ?
      JSON.stringify({
        game_type: gameSettings.mode,
        game_mode: gameSettings.type,
      })
      :
      JSON.stringify({
        game_type: gameSettings.mode,
        game_mode: gameSettings.type,
        team_name: userState.current_team,
      })
    );    

    socket.on('match_maker_client:found_match', (game: any) => {
      console.log(game);
      
      dispatch(foundMatch(game));
      navigate('/gameSession', { state: { game, gameSettings} });
    });
  });

  return <LoadingMatchCard text={ text }/>;
};
export default MatchLoading;
