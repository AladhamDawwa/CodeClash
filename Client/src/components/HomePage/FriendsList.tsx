import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import data from '../../pages/HomePage/users.json';

type ListType = {
  type: string;
  open: boolean;
  onClick: () => void;
};

export default function FriendsList({ type, open, onClick }: ListType) {
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
    <div style={{ position: 'relative' }}>
      <List
        sx={{
          width: '35rem',
          height: '6.5rem',
          backgroundColor: '#0f0c29',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '1rem',
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: textColor }}
          style={{ marginTop: '1rem' }}
        >{`${type} (10)`}</Typography>
        <ListItemButton onClick={onClick}>
          {open ? (
            <ExpandLessIcon
              sx={{ color: 'white', fontSize: '4rem', marginLeft: 'auto' }}
            />
          ) : (
            <ExpandMoreIcon
              sx={{ color: 'white', fontSize: '4rem', marginLeft: 'auto' }}
            />
          )}
        </ListItemButton>
      </List>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 2 }}>
          <Paper
            sx={{
              width: '35rem',
              height: '30rem',
              backgroundColor: '#0f0c29',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0 2rem',
              borderRadius: '0',
              overflowY: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            <List sx={{ width: '100%' }} component="div">
              {data.map((user, index) => (
                <ListItem
                  sx={{ minHeight: '5rem', padding: '1rem 0' }}
                  key={index}
                >
                  <ListItemText
                    primary={user.username}
                    primaryTypographyProps={{
                      style: { color: 'white', fontSize: '1.7rem' },
                    }}
                  />
                  <img
                    src={`../../../public/assets/${user.rank}.svg`}
                    style={{ height: '4rem', width: '4rem' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </div>
      </Collapse>
    </div>
  );
}
