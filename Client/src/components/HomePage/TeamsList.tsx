import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Statues from '@mui/icons-material/FiberManualRecord';
import DeleteIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import data from '../../pages/HomePage/team.json';

type TeamType = {
  open: boolean;
  onClick: () => void;
};

export default function TeamsList({ open, onClick }: TeamType) {
  return (
    <div style={{ position: 'relative' }}>
      <List
        sx={{
          width: '35rem',
          minHeight: '6.5rem',
          backgroundColor: '#24243e',
          borderRadius: '0.5rem 0.5rem 0 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography variant="h4" sx={{ color: 'white', marginLeft: '2rem' }}>
            {`Team #1`}
          </Typography>
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
                fontSize: '2rem',
              }}
            />
            {open && (
              <ListItemButton disableRipple>
                <DeleteIcon
                  sx={{
                    color: 'red',
                    fontSize: '2rem',
                    marginRight: '1rem',
                  }}
                />
              </ListItemButton>
            )}
            <ListItemButton disableRipple onClick={onClick}>
              {open ? (
                <ExpandLessIcon
                  sx={{
                    color: 'white',
                    fontSize: '4rem',
                  }}
                />
              ) : (
                <ExpandMoreIcon
                  sx={{
                    color: 'white',
                    fontSize: '4rem',
                  }}
                />
              )}
            </ListItemButton>
          </div>
        </div>
      </List>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Paper
          elevation={3}
          sx={{
            width: '35rem',
            backgroundColor: '#24243e',
            borderRadius: '0 0 0.5rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1,
          }}
        >
          <List component="div">
            {data.map((user, index) => (
              <ListItem
                key={index}
                sx={{
                  width: '32.5rem',
                  minHeight: '7rem',
                  backgroundColor: '#0f0c29',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  margin: '2rem',
                  borderRadius: '0.5rem',
                }}
              >
                <p
                  style={{
                    color: 'white',
                    fontSize: '1.7rem',
                  }}
                >
                  {user.username}
                </p>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Collapse>
    </div>
  );
}
