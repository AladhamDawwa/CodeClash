import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNavigation } from '../../NavigationContext';
import LoadingMatchCard from '../../components/LoadingMatchCard/LoadingMatchCard';
import socket from '../../socket';
import { foundMatch } from '../../store/reducers/userReducer';
import { RootState } from '../../store/store';
import { GameMode, GameType } from '../../utils/game_settings';

type MatchRequest = {
  game_type: GameType;
  game_mode: GameMode;
  team_name?: string;
};

const MatchLoading = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const userState = useSelector((state: RootState) => state.user.data);
  const navigate = useNavigate();
  const { allowGameSessionAccess } = useNavigation();

  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = auth;
  const { gameSettings, text } = location.state;

  const [requestReady, setRequestReady] = useState(false);

  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname);

    const handlePopState = (event: PopStateEvent) => {
      window.history.pushState(null, '', window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      socket.off('match_maker_client:found_match');
      // socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.io.opts.extraHeaders = {
      token: user.token,
    };

    socket.connect();

    let matchRequest: MatchRequest;

    if (gameSettings.mode === GameType.OneVsOne) {
      matchRequest = {
        game_type: gameSettings.mode,
        game_mode: gameSettings.type,
      };
      setRequestReady(true);
    } else {
      matchRequest = {
        game_type: gameSettings.mode,
        game_mode: gameSettings.type,
        team_name: userState.current_team,
      };
      socket.on('match_maker_client:team_completed', () => {
        setRequestReady(true);
      });
    }

    // if (!requestReady) return;

    socket.emit('match_maker_server:find_match', JSON.stringify(matchRequest));

    socket.on('match_maker_client:found_match', (game: any) => {
      console.log(game);
      dispatch(foundMatch(game));
      allowGameSessionAccess();
      navigate('/gameSession', { state: { game, gameSettings } });
    });
  }, []);

  return (
    <LoadingMatchCard
      text={text}
      team={gameSettings.mode != GameType.OneVsOne}
      requestReady={requestReady}
    />
  );
};
export default MatchLoading;
