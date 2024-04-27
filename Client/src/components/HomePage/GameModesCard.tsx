import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import GameButton from './GameButton';
type ModeType = {
  type: string;
};
export default function GameModesCard({ type }: ModeType) {
  return (
    <Paper
      elevation={5}
      sx={{
        width: '60rem',
        height: '27rem',
        background:
          'linear-gradient(to bottom right, #302b63 5% , #818196 80% )',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <Typography variant="h2" sx={{ color: 'white', fontWeight: '500' }}>
        {type}
      </Typography>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          gap: '10rem',
        }}
      >
        <GameButton>Ranked</GameButton>
        <GameButton>Normal</GameButton>
      </div>
    </Paper>
  );
}
