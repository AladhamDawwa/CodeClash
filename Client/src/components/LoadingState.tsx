import { CircularProgress } from '@mui/material';

export default function LoadingState() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '2rem',
      }}
    >
      {/* <p style={{ color: 'white', fontSize: '2rem' }}>Loading...</p> */}
      <CircularProgress
        sx={{
          color: 'white',
          width: '6rem',
          height: '6rem',
        }}
      />
      <img
        src="assets/logo.svg"
        alt="logo image"
        style={{ width: '6rem', height: '6rem' }}
      />
    </div>
  );
}
