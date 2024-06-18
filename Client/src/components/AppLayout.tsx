import { Outlet } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

function AppLayout() {
  const authState = useSelector((state: RootState) => state.auth);
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default AppLayout;
