import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import data from './problem.json';
export default function ProblemDescription() {
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
        {data.problem.header.title}
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
        {data.problem.description.text}
      </p>
      <Stack spacing={6}>
        {data.problem.examples.map((example, index) => (
          <Box
            key={index}
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
              Example {index + 1}
            </p>
            <p>Input: {example.input}</p>
            <p>Output: {example.output}</p>
          </Box>
        ))}
        <Box>
          <p
            style={{
              color: 'white',
              fontSize: '3rem',
              fontWeight: '400',
              marginBottom: '1rem',
            }}
          >
            Constraints:
          </p>
          {data.problem.constraints.map((constraint, index) => (
            <p
              key={index}
              style={{
                color: 'white',
                fontSize: '1.8rem',
                backgroundColor: '#24243E',
                width: '20rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '1rem 2rem',
                margin: ' 1.8rem 0',
                borderRadius: '0.8rem',
              }}
            >
              {constraint}
            </p>
          ))}
        </Box>
      </Stack>
    </Stack>
  );
}
