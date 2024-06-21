import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import GameButton from './GameButton';
import './style.css';
import { Card } from '@mui/material';
type ModeType = {
  type: string;
};
export default function GameModesCard({ type }: ModeType) {
  return (
      <div className="card">    
        <Paper
          elevation={5}
          sx={{
            zIndex: 1,
            width: '98%',
            height: '98%',
            background: '#191c29',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <Typography variant="h2" sx={{ 
            color: 'white',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.5rem',
            fontSize: '3rem',
          }}>
            {type}
          </Typography>

          <div
            style={{
              display: 'flex',
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
      </div>
  );
}
