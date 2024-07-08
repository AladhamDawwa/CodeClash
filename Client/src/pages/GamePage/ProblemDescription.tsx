import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { decode } from 'js-base64';

const wordStyling: any = {
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
  color: 'white',
  fontSize: '1.7rem',
  // fontWeight: '600',
  wordSpacing: '-4px',
  lineHeight: '1.5',
};

export default function ProblemDescription({ problem, testCases }: any) {
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
      <pre style={wordStyling}>{decode(problem.description)}</pre>
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
        <pre style={wordStyling}>{decode(problem.input_format)}</pre>
      </Box>
      <p style={{ color: 'white', fontWeight: '600', fontSize: '2.3rem' }}>
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
        <pre style={wordStyling}>{decode(problem.output_format)}</pre>
      </Box>
      <p style={{ color: 'white', fontWeight: '600', fontSize: '2.3rem' }}>
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
        <p style={{ fontWeight: '600', fontSize: '2.3rem' }}>Input :</p>
        <pre style={wordStyling}>{decode(testCases[0].input)}</pre>
        <p style={{ fontWeight: '600', fontSize: '2.3rem' }}>Output :</p>
        <pre style={wordStyling}>{decode(testCases[0].expected_output)}</pre>
      </Box>
    </Stack>
  );
}
