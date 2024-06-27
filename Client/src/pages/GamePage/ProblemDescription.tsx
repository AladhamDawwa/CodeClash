import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { decode } from 'js-base64';

export default function ProblemDescription({ problem, testCases } : any) {
  return (
    <Stack
      direction={'column'}
      spacing={7}
      sx={{ ml: '3rem', mt: '4rem', paddingBottom: '4rem' }}
    >
      <p
        style={{
          color: 'white',
          textTransform: 'capitalize',
          fontSize: '2.8rem',
          fontWeight: '800',
        }}
      >
        {problem.title}
      </p>
      <p
        style={{
          color: 'white',
          fontSize: '2rem',
          width: '70rem',
          letterSpacing: '0.3px',
          fontWeight: '500',
          lineHeight: '1.4',
        }}
      >
        {decode(problem.description)}
      </p>
      <Box
        sx={{
          color: 'white',
          fontSize: '2rem',
          backgroundColor: '#24243E',
          width: '50.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          justifyContent: 'center',
          padding: '2rem',
          borderRadius: '2rem',
        }}
      >
        <p style={{ fontWeight: '600', fontSize: '2.3rem' }}>
          Input Format :
        </p>
        <p>{decode(problem.input_format)}</p>
      </Box>
      <Box
        sx={{
          color: 'white',
          fontSize: '2rem',
          backgroundColor: '#24243E',
          width: '50.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          justifyContent: 'center',
          padding: '2rem',
          borderRadius: '2rem',
        }}
      >
        <p style={{ fontWeight: '600', fontSize: '2.3rem' }}>
          Output Format :
        </p>
        <p>{decode(problem.output_format)}</p>
      </Box>
      <Box
        sx={{
          color: 'white',
          fontSize: '2rem',
          backgroundColor: '#24243E',
          width: '50.5rem',
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
