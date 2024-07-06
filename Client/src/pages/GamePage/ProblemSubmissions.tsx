import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import data from './problem.json';
import SubmissionStatus from '../../utils/submission_status';
import language from '../../utils/languages.json';

function formatDate(dateString: string): string {
  if (!dateString) {
    return 'Invalid date';
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export default function ProblemSubmissions({ submissions }: any) {
  return (
    <>
      {!submissions ? (
        <div
          style={{
            padding: '2rem',
            color: 'white',
            textAlign: 'center',
            backgroundColor: '#1E1E36',
            borderRadius: '0 0 0.5rem 0.5rem',
            fontSize: '2.3rem',
            textTransform: 'capitalize',
          }}
        >
          No submissions found!
        </div>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: '0 0 0.5rem 0.5rem',
            overflow: 'hidden',
          }}
        >
          <Table sx={{ width: '100%' }} aria-label="simple table">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: '#1E1E36',
                  '& th': {
                    color: 'white',
                    fontSize: '2rem',
                    border: 'none',
                    textTransform: 'capitalize',
                    height: '5rem',
                  },
                }}
              >
                <TableCell align="left">
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems={'center'}
                    justifyContent={'flex-start'}
                  >
                    <div>Status</div>
                    <FilterAltOutlinedIcon sx={{ fontSize: '2.5rem' }} />
                  </Stack>
                </TableCell>
                <TableCell align="left">
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems={'center'}
                    justifyContent={'flex-start'}
                  >
                    <div>Language</div>
                    <FilterAltOutlinedIcon sx={{ fontSize: '2.5rem' }} />
                  </Stack>
                </TableCell>
                <TableCell align="left">RunTime</TableCell>
                <TableCell align="left">Memory</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((sub: any, index: number) => (
                <TableRow
                  key={index}
                  sx={{
                    '& td': {
                      border: 'none',
                      color: 'white',
                      fontSize: '1.5rem',
                      textTransform: 'capitalize',
                    },
                    backgroundColor: index % 2 === 0 ? '#24243E' : '#1E1E36',
                  }}
                >
                  <TableCell align="left">
                    <Stack
                      direction="column"
                      spacing={1}
                      sx={{ fontSize: '1.3rem' }}
                    >
                      <div
                        style={{
                          color:
                            SubmissionStatus[sub.status] === 'Wrong Answer'
                              ? '#e33c37'
                              : SubmissionStatus[sub.status] === 'Accepted'
                                ? '#2cbb5d'
                                : '#E3BD37',
                          fontSize: '2rem',
                        }}
                      >
                        {SubmissionStatus[sub.status]}
                      </div>
                      <div style={{ color: '#999' }}>
                        {formatDate(sub.submission_time)}
                      </div>
                    </Stack>
                  </TableCell>
                  <TableCell align="left">
                    {language.find(lang => lang.id === sub.language_id)?.name}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTimeOutlinedIcon sx={{ fontSize: '2rem' }} />
                      <div>{sub.time * 1000} ms</div>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MemoryOutlinedIcon sx={{ fontSize: '2rem' }} />
                      <div>{`${sub.memory} KB`}</div>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
