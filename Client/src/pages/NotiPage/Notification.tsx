import React from 'react';
import { Box, Button, colors, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface NotificationProps {
  title: string;
  content: string;
  onAccept: () => void;
  onReject: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  title,
  content,
  onAccept,
  onReject,
}) => {
  return (
    <Paper
      sx={{
        width: '120rem',
        height: 'auto',
        backgroundColor: '#0f0c29cc',
        borderRadius: '7px',
        marginBottom: '2rem',
        padding: '2rem',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>
          {title}
        </p>
        <p style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>
          {content}
        </p>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '2rem',
            marginTop: '1rem',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Button
              onClick={onAccept}
              sx={{
                color: '#2CBB5D',
                fontSize: '2rem',
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                textTransform: 'capitalize',
                '&:hover': {
                  color: '#2cbb5eac',
                },
              }}
            >
              Accept
              <CheckCircleIcon
                sx={{
                  color: 'inherit',
                  fontSize: '3rem',
                  marginLeft: '5px',
                }}
              />
            </Button>
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Button
              onClick={onReject}
              sx={{
                color: '#E33C37',
                fontSize: '2rem',
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                textTransform: 'capitalize',
                '&:hover': {
                  color: '#e33d37a2',
                },
              }}
            >
              Reject
              <CancelIcon
                sx={{
                  color: 'inherit',
                  fontSize: '3rem',
                  marginLeft: '5px',
                }}
              />
            </Button>
          </div>
        </Box>
      </Box>
    </Paper>
  );
};

export default Notification;
