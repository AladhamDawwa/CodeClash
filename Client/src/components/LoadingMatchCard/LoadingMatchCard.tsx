import { Paper, Box, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
// import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';
export default function LoadingMatchCard({ text }: any) {
  const user = useSelector((state: RootState) => state.user.data);
  // const [isOppFetched, setIsOppFetched] = useState(false);
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper
        sx={{
          backgroundColor: '#0F0C29',
          width: '90rem',
          height: '60rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '5rem',
            gap: '2rem',
          }}
        >
          <p
            style={{
              color: 'white',
              fontSize: '3rem',
              fontWeight: '600',
            }}
          >
            {text.mode} - {text.type}
          </p>
          <p
            style={{
              color: 'white',
              fontSize: '3rem',
              fontWeight: '600',
            }}
          >
            Finding Match
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8rem',
          }}
        >
          {user?.image ? (
            <img src={user?.image}
              alt="user image"
              style={{ width: '12rem', height: '12rem', borderRadius: '100%' }}
            />
          ) : (
            <Avatar
              sx={{
                width: '12rem',
                height: '12rem',
                borderRadius: '100%',
              }}
              src="/broken-image.jpg"
            />
          )}
          <p
            style={{
              color: 'white',
              fontFamily: 'Rock Salt',
              fontSize: '3rem',
              fontWeight: 'bold',
            }}
          >
            VS
          </p>
          {/* {isOppFetched ? (
            <img src="" alt="" /> //handle the opponent image
          ) : ( */}
            <Skeleton
              sx={{ bgcolor: 'grey', width: '12rem', height: '12rem' }}
              variant="circular"
              animation="pulse"
            />
          {/* )} */}
        </div>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#E33C37',
            '&:hover': {
              backgroundColor: '#e33d37c5',
            },
            fontSize: '2.3rem',
            textTransform: 'capitalize',
            fontWeight: '700',
          }}
          onClick={() => {
            navigate('/');
          }}
        >
          Cancel
        </Button>
      </Paper>
    </Box>
  );
}
