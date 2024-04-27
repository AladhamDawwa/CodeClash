import '../../pages/HomePage/styles.css';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
type NavBar = {
  rankImg: string;
  rankAmount: number;
  userImg: string;
};
export default function NavBar({ rankImg, rankAmount, userImg }: NavBar) {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate('/');
  };
  return (
    <Paper
      elevation={2}
      sx={{
        width: '100%',
        backgroundColor: '#24243e',
        height: '7rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4rem 2rem',
        marginBottom: '5rem',
      }}
    >
      <div>
        <img
          style={{ cursor: 'pointer' }}
          src="../../../public/assets/logo.svg"
          className="logo"
          onClick={handleLogoClick}
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          justifyContent: 'space-between',
        }}
      >
        <img src={rankImg} className="rank-img" alt="rank image" />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '2rem',
          }}
        >
          <img className="rank-icon" src="../../../public/assets/Rank.svg" />
          <Typography variant="h4" sx={{ color: 'white', marginLeft: '10px' }}>
            {rankAmount}
          </Typography>
        </div>

        <img src={userImg} alt="user image" className="user-img" />
      </div>
    </Paper>
  );
}
