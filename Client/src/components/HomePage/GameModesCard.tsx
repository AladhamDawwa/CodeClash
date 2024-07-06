import Typography from '@mui/material/Typography';
import GameButton from './GameButton';
import './style.css';
import { Card } from '@mui/material';
import { GameMode } from '../../utils/game_settings';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import LockRoundedIcon from '@mui/icons-material/LockRounded';

export default function GameModesCard({ text, type }: any) {
  const user = useSelector((state: RootState) => state.user.data);

  let modeImage: string = '';
  switch (text) {
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
    user && (
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
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: text !== 'Last Man Standing' ? '5rem' : '3.5rem',
              width: '100%',
              height: '100%',
              backdropFilter:
                'blur(0.2rem) contrast(1.0) brightness(0.5) saturate(1.0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {text}
          </Typography>
          <div
            style={{
              flexDirection: 'column',
            }}
          >
            {user?.gameInfo ? (
              <div>
                <LockRoundedIcon
                  sx={{
                    fontSize: '7rem',
                    color: 'white',
                    backdropFilter: 'saturate(1.0)',
                    marginBottom: '3rem',
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 'bold',
                    // textTransform: 'uppercase',
                    fontSize: '2rem',
                    background: '#a0a0a0',
                    backdropFilter:
                      'blur(0.2rem) contrast(1.0) brightness(0.5) saturate(1.0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    transform: 'skewY(-20deg)',
                  }}
                >
                  You have an ongoing game
                </Typography>
              </div>
            ) : text == '3 V 3' && !user.current_team ? (
              <div>
                <LockRoundedIcon
                  sx={{
                    fontSize: '7rem',
                    color: 'white',
                    backdropFilter: 'saturate(1.0)',
                    marginBottom: '3rem',
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 'bold',
                    // textTransform: 'uppercase',
                    fontSize: '2rem',
                    background: '#a0a0a0',
                    backdropFilter:
                      'blur(0.2rem) contrast(1.0) brightness(0.5) saturate(1.0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    transform: 'skewY(-20deg)',
                  }}
                >
                  Activate a team to play this mode
                </Typography>
              </div>
            ) : text === '1 V 1' ? (
              <>
                <GameButton
                  gameSettings={{
                    type: GameMode.Ranked,
                    mode: type,
                  }}
                  text={{
                    type: 'Ranked',
                    mode: text,
                  }}
                >
                  Ranked
                </GameButton>
                <GameButton
                  gameSettings={{
                    type: GameMode.Normal,
                    mode: type,
                  }}
                  text={{
                    type: 'Normal',
                    mode: text,
                  }}
                >
                  Normal
                </GameButton>
              </>
            ) : (
              <>
                <GameButton
                  gameSettings={{
                    type: GameMode.Ranked,
                    mode: type,
                  }}
                  text={{
                    type: 'Ranked',
                    mode: text,
                  }}
                >
                  Play
                </GameButton>
              </>
            )}
          </div>
        </Card>
      </div>
    )
  );
}
