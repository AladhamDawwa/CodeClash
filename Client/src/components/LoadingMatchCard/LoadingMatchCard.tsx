import { Paper, Box, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import { useState } from 'react';
export default function LoadingMatchCard() {
  const user = useSelector((state: RootState) => state.user.data);
  const [isOppFetched, setIsOppfetched] = useState(false);
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
          gap: '13rem',
        }}
      >
        <p
          style={{
            color: 'white',
            fontSize: '3rem',
            fontWeight: '600',
            marginTop: '5rem',
          }}
        >
          Finding Match
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8rem',
          }}
        >
          {user.image ? (
            <img
              src={user.image}
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
          {isOppFetched ? (
            <img src="" alt="" /> //handle the opponent image
          ) : (
            <Skeleton
              sx={{ bgcolor: 'grey', width: '12rem', height: '12rem' }}
              variant="circular"
              animation="pulse"
            />
          )}
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
        >
          Cancel
        </Button>
      </Paper>
    </Box>
  );
}
