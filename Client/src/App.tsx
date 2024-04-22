import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import _404 from './components/404/404';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import HomePage from './pages/HomePage/home';
import { RootState } from './store/store';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  console.log(isAuthenticated ? 'Authenticated' : 'Not Authenticated');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/" replace />}
        />
        <Route path="/signIn" element={<SignIn />} />
        <Route
          path="/signUp"
          element={isAuthenticated ? <HomePage /> : <SignUp />}
        />
        <Route path="*" element={<_404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
