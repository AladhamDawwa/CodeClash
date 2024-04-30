import React, { useState, useEffect, useRef } from 'react';
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

export default function FriendsList({ type }: ListType) {
  const [open, setOpen] = useState(false);

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

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <List
        ref={listRef}
        sx={{
          width: '35rem',
          height: '6.5rem',
          backgroundColor: '#0f0c29',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '1rem 1rem 0 0',
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: textColor, marginLeft: '2rem' }}
        >{`${type} (10)`}</Typography>
        <ListItemButton disableRipple onClick={() => setOpen(!open)}>
          {open ? (
            <ExpandLessIcon
              sx={{ color: 'white', fontSize: '4rem', marginLeft: 'auto' }}
              className="expand-icon"
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
              overflowY: 'auto',
              scrollbarWidth: 'none',
              borderRadius: '0 0 1rem 1rem',
              boxShadow: '0 0.5rem 1.5rem #24243e',
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
                    src={`/assets/${user.rank}.svg`}
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
