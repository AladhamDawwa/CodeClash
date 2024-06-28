import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { decode } from 'js-base64';

export default function ProblemDescription({ problem, testCases } : any) {
  return (
    <Stack
      direction={'column'}
      spacing={3}
      sx={{ mx: '3rem', pt: '3rem', paddingBottom: '4rem' }}
    >
      <p
        style={{
          color: 'white',
          textTransform: 'capitalize',
          fontSize: '3rem',
          fontWeight: '800',
        }}
      >
        {problem.title}
      </p>
      <p
        style={{
          color: 'white',
          fontSize: '1.5rem',
          letterSpacing: '0.3px',
          lineHeight: '1.4',
        }}
      >
        {decode(problem.description)}
      </p>
      <p style={{ color: 'white', fontWeight: '600', fontSize: '2.3rem' }}>
        Input Format :
      </p>
      <Box
        sx={{
          color: 'white',
          fontSize: '1.5rem',
          backgroundColor: '#24243E',
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          justifyContent: 'center',
          padding: '2rem',
          borderRadius: '2rem',
        }}
      >
        <p>{decode(problem.input_format)}</p>
      </Box>
      <p style={{ color:'white', fontWeight: '600', fontSize: '2.3rem' }}>
        Output Format :
      </p>
      <Box
        sx={{
          color: 'white',
          fontSize: '1.5rem',
          backgroundColor: '#24243E',
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          justifyContent: 'center',
          padding: '2rem',
          borderRadius: '2rem',
        }}
      >
        <p>{decode(problem.output_format)}</p>
      </Box>
      <p style={{ color:'white', fontWeight: '600', fontSize: '2.3rem' }}>
        Sample Test Cases:
      </p>
      <Box
        sx={{
          color: 'white',
          fontSize: '1.5rem',
          backgroundColor: '#24243E',
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          justifyContent: 'center',
          padding: '2rem',
          borderRadius: '2rem',
        }}
      >
        <p style={{ fontWeight: '600', fontSize: '2.3rem' }}>
          Input :
        </p>
        <p>{decode(testCases[0].input)}</p>
        <p style={{ fontWeight: '600', fontSize: '2.3rem' }}>
          Output :
        </p>
        <p>{decode(testCases[0].expected_output)}</p>
      </Box>
    </Stack>
  );
}
