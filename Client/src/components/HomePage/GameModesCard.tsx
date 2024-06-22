import Typography from '@mui/material/Typography';
import GameButton from './GameButton';
import './style.css';
import { Card } from '@mui/material';
type ModeType = {
  type: string;
};
export default function GameModesCard({ type }: ModeType) {

  let modeImage : string = '';
  switch (type) {
    case '1 V 1':
      modeImage = '1vs1';
      break;
    case '3 V 3':
      modeImage = '3vs3';
      break;
    case 'Last Man Standing':
      modeImage = 'lastman';
      break;
  }

  return (
      <div className="card">    
        <Card
          sx={{
            zIndex: 1,
            width: '98%',
            height: '98%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            background: `url(assets/${modeImage}.png) no-repeat center`,
            backgroundSize: 'cover',
            boxShadow: '0 0 20px 10px rgba(0, 0, 0, 0.5)',
            borderRadius: '1rem',

            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.5s',
              filter: 'blur(0)',
            },

            '&:hover::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '1rem',
            },

            '&:hover > div': {
              display: 'flex',
              gap: '5rem',
            },

            '&:hover > h2': {
              display: 'none',
            },

            '& > div': {
              display: 'none',
            },
          }}
        >
          <Typography variant="h2" sx={{
            color: 'white',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: type !== "Last Man Standing" ? '5rem' : '3.5rem',
            width: '100%',
            height: '100%',
            backdropFilter: 'blur(0.2rem) contrast(1.0) brightness(0.5) saturate(1.0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {type}
          </Typography>

          <div style={{
            flexDirection: 'column',
          }}>
            <GameButton gameSettings={{
              type: 'Ranked',
              mode: type,
            }}>Ranked</GameButton>
            <GameButton gameSettings={{
              type: 'Normal',
              mode: type,
            }}>Normal</GameButton>
          </div>
        </Card>
      </div>
  );
}
