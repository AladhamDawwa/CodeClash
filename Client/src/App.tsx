import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
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
import { useEffect } from 'react';
import { getUserByUsername } from './store/actions/userInfo';
import MatchLoading from './pages/MatchLoading/MatchLoading';
import Teams from './pages/Teams/Teams';

interface PrivateRouteProps {
  children: JSX.Element;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return isAuthenticated ? children : <Navigate to="/signIn" replace />;
}

function App() {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (authState?.user?.token && authState?.user?.user?.username) {
      dispatch<any>(
        getUserByUsername({
          username: authState?.user?.user?.username,
          jwtToken: authState?.user?.token,
        }),
      );
    }
  }, [authState?.user?.token, authState?.user?.user?.username, dispatch]);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      const currentPath = location.pathname;
      if (currentPath !== '/signUp') {
        navigate('/signIn');
      }
    }
  }, [authState.isAuthenticated, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/entry" element={<EntryPage />} />
      <Route element={<AppLayout />}>
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <GameHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <PrivateRoute>
              <Teams />
            </PrivateRoute>
          }
        />
        <Route
          path="/gameSession"
          element={
            <PrivateRoute>
              <GamePage />
            </PrivateRoute>
          }
        />
      </Route>
      <Route
        path="/"
        element={
          useSelector((state: RootState) => state.auth.isAuthenticated) ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/entry" replace />
          )
        }
      />
      <Route
        path="/matchMaker"
        element={
          <PrivateRoute>
            <MatchMaker />
          </PrivateRoute>
        }
      />
      <Route
        path="/matchLoading"
        element={
          <PrivateRoute>
            <MatchLoading />
          </PrivateRoute>
        }
      />
      <Route path="/signIn" element={<SignIn />} />
      <Route
        path="/signUp"
        element={
          useSelector((state: RootState) => state.auth.isAuthenticated) ? (
            <Navigate to="/home" />
          ) : (
            <SignUp />
          )
        }
      />
      <Route path="*" element={<_404 />} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
