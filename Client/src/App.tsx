import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import _404 from './components/404/404';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import HomePage from './pages/HomePage/Home';
import { RootState } from './store/store';
import EntryPage from './pages/EntryPage/Entry';
import GamePage from './pages/GamePage/GamePage';
import MatchMaker from './pages/MatchMaker/MatchMaker';

import ProfilePage from './pages/ProfilePage/ProfilePage';
import GameHistory from './pages/GameHistory/GameHistory';
import AppLayout from './components/AppLayout';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getUserByUsername } from './store/actions/userInfo';
import MatchLoading from './pages/MatchLoading/MatchLoading';
function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (authState.user.token && authState.user.user.username) {
      dispatch<any>(
        getUserByUsername({
          username: authState.user.user.username,
          jwtToken: authState.user.token,
        }),
      );
    }
  }, [authState.user.token, authState.user.user.username, dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/entry" element={<EntryPage />} />
        <Route element={<AppLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<GameHistory />} />
          <Route
            path="/home"
            element={
              isAuthenticated ? <HomePage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/gameSession"
            element={
              isAuthenticated ? <GamePage /> : <Navigate to="/" replace />
            }
          />
        </Route>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/entry" replace />
            )
          }
        />
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/gameSession"
          element={isAuthenticated ? <GamePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/matchMaker"
          element={
            isAuthenticated ? <MatchMaker /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/matchLoading"
          element={
            isAuthenticated ? <MatchLoading /> : <Navigate to="/" replace />
          }
        />
        <Route path="/signIn" element={<SignIn />} />
        <Route
          path="/signUp"
          element={isAuthenticated ? <Navigate to="/home" /> : <SignUp />}
        />
        <Route path="*" element={<_404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
