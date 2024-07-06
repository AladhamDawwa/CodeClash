import { Typography } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

const LevelStar = ({ level }: any) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: '5rem',
      }}
    >
      <StarRoundedIcon
        style={{
          color: '#FFD700',
          width: '7rem',
          height: '7rem',
        }}
      ></StarRoundedIcon>
      <Typography
        variant="h4"
        sx={{
          position: 'absolute',
          color: 'black',
        }}
      >
        {level}
      </Typography>
    </div>
  );
};
export default LevelStar;
