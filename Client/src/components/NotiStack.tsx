import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
interface params {
  message: string;
  varient: AlertColor;
}
const NotiStack = ({ message, varient }: params) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={varient}
        sx={{
          textTransform: 'capitalize',
          fontSize: '1.8rem',
          '& .MuiAlert-icon': {
            fontSize: '2.5rem',
            alignSelf: 'center',
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotiStack;
