import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Statues from '@mui/icons-material/FiberManualRecord';
export default function TeamsList() {
  return (
    <Paper
      sx={{
        width: '35rem',
        height: '6.5rem',
        backgroundColor: '#24243e',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: 'white', marginLeft: '2rem' }}
        >{`Team #1`}</Typography>
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Statues
            sx={{
              color: '#2cbb5d',
            }}
          />
          <ExpandMoreIcon
            sx={{
              color: 'white',
              fontSize: '4rem',
            }}
          />
        </div>
      </div>
    </Paper>
  );
}
