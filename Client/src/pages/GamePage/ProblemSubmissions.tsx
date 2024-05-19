import React from 'react';
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

function createData(
  status: string,
  time: string,
  language: string,
  runtime: number,
  memory: number,
) {
  return { status, time, language, runtime, memory };
}

const rows = data.problem.submissions.map(sub =>
  createData(sub.status, sub.time, sub.language, sub.runtime, sub.memory),
);

export default function ProblemSubmissions() {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: '0 0 0.5rem 0.5rem',
        overflow: 'hidden',
        backgroundColor: '#1E1E36',
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
            <TableCell align="center">
              <Stack
                direction="row"
                spacing={1}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <div>Status</div>
                <FilterAltOutlinedIcon sx={{ fontSize: '2.5rem' }} />
              </Stack>
            </TableCell>
            <TableCell align="center">
              <Stack
                direction="row"
                spacing={1}
                alignItems={'center'}
                justifyContent={'center'}
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
          {rows.map((row, index) => (
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
              <TableCell align="center">
                <Stack
                  direction="column"
                  spacing={1}
                  sx={{ fontSize: '1.3rem' }}
                >
                  <div
                    style={{
                      color:
                        row.status === 'wrong answer'
                          ? '#e33c37'
                          : row.status === 'accepted'
                            ? '#2cbb5d'
                            : '#E3BD37',
                      fontSize: '1.8rem',
                    }}
                  >
                    {row.status}
                  </div>
                  <div style={{ color: '#999' }}>{row.time}</div>
                </Stack>
              </TableCell>
              <TableCell align="center">{row.language}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeOutlinedIcon sx={{ fontSize: '2rem' }} />
                  <div>{`${row.runtime}ms`}</div>
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <MemoryOutlinedIcon sx={{ fontSize: '2rem' }} />
                  <div>{`${row.memory} KB`}</div>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
