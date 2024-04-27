import Button from '@mui/material/Button';
type ButtonText = {
  children: string;
};
export default function GameButton({ children }: ButtonText) {
  return (
    <Button
      variant="contained"
      size="large"
      sx={{
        px: '4rem',
        fontSize: '2rem',
        textTransform: 'capitalize',
        backgroundColor: '#0f0c29',
      }}
      disableRipple
      disableElevation
    >
      {children}
    </Button>
  );
}
