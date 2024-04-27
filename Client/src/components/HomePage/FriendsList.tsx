import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

type ListType = {
  type: string;
};

export default function FriendsList({ type }: ListType) {
  let textColor: string;
  switch (type) {
    case 'Online':
      textColor = '#2cbb5d';
      break;
    case 'Offline':
      textColor = '#9ca0a7';
      break;
    default:
      textColor = '#fff';
      break;
  }

  return (
    <Paper
      sx={{
        width: '35rem',
        height: '6.5rem',
        backgroundColor: '#0f0c29',
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
          sx={{ color: textColor, marginLeft: '2rem' }}
        >{`${type} (10)`}</Typography>
        <ExpandMoreIcon
          sx={{
            color: 'white',
            fontSize: '4rem',
            marginLeft: 'auto',
          }}
        />
      </div>
    </Paper>
  );
}
