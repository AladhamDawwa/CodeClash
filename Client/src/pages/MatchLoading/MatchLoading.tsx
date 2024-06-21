import { useSelector } from "react-redux";
import LoadingMatchCard from "../../components/LoadingMatchCard/LoadingMatchCard"
import { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

const MatchLoading = () => {
  const [matchFound, setMatchFound] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  useEffect(() => {
    const { user } = auth;

    // const socket = io('http://localhost:5000', {
    //   extraHeaders: {
    //     token: user.token,
    //   },
    // });

    // socket.on('connect', () => {
    //   console.log('connected', socket.id);
    // });

// socket.emit(
//   'match_maker_server:find_match',
//   JSON.stringify({
//     game_type: '0',
//     game_mode: '0',
//   }),
// );

// // I need to print if the connection is closed or there is an error
// socket.on('disconnect', () => {
//   console.log('disconnected');
// });

// return () => {
//   socket.disconnect();
// };
}, [auth]);
return (
<LoadingMatchCard gameSettings={location.state.gameSettings}></LoadingMatchCard>
)
}
export default MatchLoading