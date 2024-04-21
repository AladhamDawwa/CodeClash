import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import './style.css';
type CardType = {
  img: string;
  para: string;
  alt: string;
};
export default function SystemCard({ img, para, alt }: CardType) {
  return (
    <Card
      sx={{
        backgroundColor: '#444379',
        borderRadius: '0.5rem',
        marginBottom: '5rem',
      }}
      elevation={3}
    >
      <CardContent
        sx={{
          maxWidth: '28rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3rem',
        }}
      >
        <img src={img} alt={alt} />
        <Typography
          variant="body1"
          sx={{ fontSize: 18, textTransform: 'capitalize' }}
          color="white"
          gutterBottom
        >
          {para}
        </Typography>
      </CardContent>
    </Card>
  );
}
