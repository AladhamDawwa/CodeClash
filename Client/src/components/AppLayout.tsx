import { Outlet } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import LoadingState from './LoadingState';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

function AppLayout() {
  const user = useSelector((state: RootState) => state.user.data);
  if (!user) {
    return <LoadingState />;
  }
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default AppLayout;
