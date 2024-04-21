import './style.css';
import '../../index.css';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ModesCard from './ModesCard';
import SystemCard from './SystemCard';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
const EntryPage = () => {
  //const navigate = useNavigate();
  const oneVSone =
    'compete against your opponent in an intense problem solving game and show-off your skills!';
  const threeVSthree =
    'enjoy the company of your best mates storming the competition against another team to seek victory!';
  const tournament =
    'join us on a bigger scale competition where you beat your foes all the way up  to grab your trophy!';
  const lastMan =
    'survive by your own in a battle royal mode and solve your problems as soon as possible to make it through the last man standing!';
  const ranked =
    'Experience the competition with your foes in a more exciting ranks as you gain them throughout winning and solving!';
  const leveling =
    'storm the competition and as you play you gain levels and as you advance your level increases and so the enjoyment! ';
  return (
    <Container>
      <div className="header">
        <img src="../../../public/assets/logo.svg" />
        <Button
          onClick={() => {
            // navigate('/signUp');
          }}
          variant="contained"
          size="large"
          sx={{
            px: '4rem',
            fontSize: '1.5rem',
            textTransform: 'capitalize',
          }}
          disableRipple
          disableElevation
        >
          join
        </Button>
      </div>
      <div className="Flexh1">
        <Typography variant="h2" sx={{ color: 'white', my: '5rem' }}>
          Game Modes
        </Typography>
      </div>
      <div className="GameModes">
        <ModesCard
          header="1 vs 1"
          image="../../../public/assets/1vs1.png"
          para={oneVSone}
          alt="one vs one cartoon image"
        />
        <ModesCard
          header="3 vs 3"
          image="../../../public/assets/3vs3.png"
          para={threeVSthree}
          alt="three vs three cartoon image"
        />
        <ModesCard
          header="TOURNAMENT"
          image="../../../public/assets/tournament.png"
          para={tournament}
          alt="tournament image"
        />

        <ModesCard
          header="LAST MAN STANDING"
          image="../../../public/assets/lastman.png"
          para={lastMan}
          alt="last man standing image"
        />
      </div>
      <div className="Flexh1">
        <Typography variant="h2" sx={{ color: 'white', my: '5rem' }}>
          Systems
        </Typography>
      </div>
      <div className="system">
        <div>
          <div className="Flexh1">
            <Typography variant="h4" sx={{ color: 'white', my: '5rem' }}>
              Ranked System
            </Typography>
          </div>
          <SystemCard
            img="../../../public/assets/ranked.png"
            alt="image for ranks"
            para={ranked}
          />
        </div>
        <div>
          <div className="Flexh1">
            <Typography variant="h4" sx={{ color: 'white', my: '5rem' }}>
              Leveling System
            </Typography>
          </div>
          <SystemCard
            img="../../../public/assets/leveling.png"
            para={leveling}
            alt="image for levels"
          />
        </div>
      </div>
    </Container>
  );
};
export default EntryPage;
