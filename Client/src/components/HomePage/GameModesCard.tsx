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
        background: 'linear-gradient(to bottom right, #24243e  , #818196  )',
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
        <GameButton gameSettings={{
          type: 'Ranked',
          mode: type,
        }}>Ranked</GameButton>
        <GameButton gameSettings={{
          type: 'Normal',
          mode: type,
        }}>Normal</GameButton>
      </div>
    </Paper>
  );
}
