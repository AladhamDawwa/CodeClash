import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

type MatchInfo = {
  problemName: string;
  date: string;
  oppImage: string;
  status: string;
  amount: number;
};

function createData(
  status: string,
  time: string,
  language: string,
  runtime: number,
  memory: number,
) {
  return { status, time, language, runtime, memory };
}

const rows = [
  createData('wrong answer', 'Aug 04, 2023', 'C++', 17, 10.8),
  createData('time limit', 'Aug 04, 2023', 'C++', 17, 10.8),
  createData('wrong answer', 'Aug 04, 2023', 'C++', 17, 10.8),
  createData('wrong answer', 'Aug 04, 2023', 'C++', 17, 10.8),
  createData('wrong answer', 'Aug 04, 2023', 'C++', 17, 10.8),
];

export default function MatchCard({
  problemName,
  date,
  oppImage,
  status,
  amount,
}: MatchInfo) {
  const [open, setOpen] = useState(false);

  let textColor: string;
  switch (status) {
    case 'loser':
      textColor = '#e33c37';
      break;
    case 'draw':
      textColor = '#ccc';
      break;
    default:
      textColor = '#2cbb5d';
      break;
  }

  return (
    <div style={{ marginBottom: '5rem' }}>
      <List sx={{ padding: '0' }}>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          sx={{
            backgroundColor: '#0f0c29',
            width: '100%',
            height: '10rem',
            borderRadius: '1rem 1rem 0 0',
            boxShadow: '0 0 0.2rem ',
          }}
        >
          <div>
            <Stack direction="column" spacing={1}>
              <p className="level-p">{problemName}</p>
              <p style={{ color: 'grey', fontSize: '1.7rem' }}>{date}</p>
            </Stack>
          </div>
          <div>
            <Stack direction="row" spacing={4} alignContent={'center'}>
              <img
                src="/assets/user-1.jpg"
                alt="user image"
                className="user-img"
              />
              <p
                style={{
                  color: 'white',
                  fontFamily: 'Rock Salt',
                  fontSize: '2rem',
                }}
              >
                VS
              </p>
              <img src={oppImage} alt="opponent image" className="user-img" />
            </Stack>
          </div>
          <p
            style={{
              color: `${textColor}`,
              fontSize: '3rem',
              fontWeight: 'bold',
              textTransform: 'capitalize',
            }}
          >
            {status}
          </p>
          <Stack direction="row" spacing={1} alignItems={'center'}>
            <img
              src="/assets/Rank.svg"
              alt="level image"
              className="profile-level-img"
            />
            <p
              style={{
                color: `${textColor}`,
                fontSize: '2rem',
                fontWeight: 'bold',
              }}
            >
              {status === 'loser' ? `- ${amount}` : `${amount}`}
            </p>
          </Stack>

          {open ? (
            <ExpandLessIcon
              style={{ color: 'white', fontSize: '5rem', cursor: 'pointer' }}
              onClick={() => setOpen(!open)}
            />
          ) : (
            <ExpandMoreIcon
              style={{ color: 'white', fontSize: '5rem', cursor: 'pointer' }}
              onClick={() => setOpen(!open)}
            />
          )}
        </Stack>
      </List>
      <div>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: '0 0 0.5rem 0.5rem' }}
          >
            <Table sx={{ width: '100%' }} aria-label="simple table">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: '#24243E',
                    '& th': {
                      color: 'white',
                      fontSize: '2.5rem',
                      border: 'none',
                      textTransform: 'capitalize',
                      height: '5rem',
                    },
                  }}
                >
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems={'center'}
                      justifyContent={'center'}
                    >
                      <div>Status</div>
                      <div>
                        <FilterAltOutlinedIcon sx={{ fontSize: '3rem' }} />
                      </div>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems={'center'}
                      justifyContent={'center'}
                    >
                      <div>Language</div>
                      <div>
                        <FilterAltOutlinedIcon sx={{ fontSize: '3rem' }} />
                      </div>
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
                        fontSize: '2rem',
                        textTransform: 'capitalize',
                      },
                      backgroundColor: index % 2 === 0 ? '#0f0c29' : '#24243E',
                    }}
                  >
                    <TableCell align="center">
                      <Stack
                        direction="column"
                        spacing={1}
                        sx={{ fontSize: '1.7rem' }}
                      >
                        <div
                          style={{
                            color:
                              row.status === 'wrong answer'
                                ? '#e33c37'
                                : row.status === 'accepted'
                                  ? '#2cbb5d'
                                  : '#E3BD37',
                            fontSize: '2rem',
                          }}
                        >
                          {row.status}
                        </div>
                        <div style={{ color: '#999' }}>{row.time}</div>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">{row.language}</TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent={'left'}
                      >
                        {<AccessTimeOutlinedIcon sx={{ fontSize: '2.5rem' }} />}
                        <div>{`${row.runtime}ms`}</div>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent={'left'}
                      >
                        {<MemoryOutlinedIcon sx={{ fontSize: '2.5rem' }} />}
                        <div>{`${row.memory} KB`}</div>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </div>
    </div>
  );
}
