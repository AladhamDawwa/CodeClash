import { useSelector } from 'react-redux';
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
import MatchLoading from './pages/MatchLoading/MatchLoading';
import Teams from './pages/Teams/Teams';
import Test from './components/testComponent/Test';
import CreateProblem from './pages/CreateProblem/CreateProblem';
import { SnackbarProvider } from 'notistack';
import { NavigationProvider, useNavigation } from './NavigationContext';
import NotiPage from './pages/NotiPage/NotiPage';
interface PrivateRouteProps {
  children: JSX.Element;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return isAuthenticated ? children : <Navigate to="/signIn" replace />;
}

interface ProtectedRouteProps {
  children: JSX.Element;
  condition: boolean;
  redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  condition,
  redirectTo,
}) => {
  return condition ? children : <Navigate to={redirectTo} />;
};

const App: React.FC = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

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
      <Route path="/test" element={<Test />} />
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
          path="/createProblem"
          element={
            <PrivateRoute>
              <CreateProblem />
            </PrivateRoute>
          }
        />
        <Route path="/notifications" element={<NotiPage />} />
      </Route>
      <Route
        path="/gameSession"
        element={
          <PrivateRoute>
            {/* <ProtectedRoute
              condition={useNavigation().canAccessGameSession}
              redirectTo="/home"
            > */}
            <GamePage />
            {/* </ProtectedRoute> */}
          </PrivateRoute>
        }
      />
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
            <ProtectedRoute
              condition={useNavigation().canAccessMatchLoading}
              redirectTo="/home"
            >
              <MatchLoading />
            </ProtectedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/signIn"
        element={
          useSelector((state: RootState) => state.auth.isAuthenticated) ? (
            <Navigate to="/home" />
          ) : (
            <SignIn />
          )
        }
      />
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
};

const AppWrapper: React.FC = () => {
  return (
    <SnackbarProvider
      maxSnack={3}
      style={{
        color: 'white',
        fontSize: '1.8rem',
        borderRadius: '1rem',
      }}
    >
      <BrowserRouter>
        <NavigationProvider>
          <App />
        </NavigationProvider>
      </BrowserRouter>
    </SnackbarProvider>
  );
};

export default AppWrapper;
