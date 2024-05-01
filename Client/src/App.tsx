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
function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  console.log(isAuthenticated ? 'Authenticated' : 'Not Authenticated');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/entry" element={<EntryPage />} />
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
