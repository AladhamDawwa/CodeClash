import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import '../../pages/EntryPage/styles.css';
type cardprops = {
  header: string;
  image: string;
  para: string;
  alt: string;
};
export default function ModesCard({ header, image, para, alt }: cardprops) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        backgroundColor: theme.palette.primary.main,
        borderRadius: '0.5rem',
      }}
      elevation={3}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2.5rem 2.5rem',
        }}
      >
        <div style={{ width: '50%' }}>
          <Typography
            sx={{ fontSize: 32, fontWeight: 'bold' }}
            color="white"
            gutterBottom
          >
            {header}
          </Typography>
          <Typography
            sx={{
              fontSize: 16,
              textTransform: 'capitalize',
            }}
            color="white"
            gutterBottom
          >
            {para}
          </Typography>
        </div>
        <img src={image} alt={alt} className="img" />
      </CardContent>
    </Card>
  );
}
