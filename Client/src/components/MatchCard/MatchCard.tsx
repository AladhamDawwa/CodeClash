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
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import SubmissionStatus from '../../utils/submission_status';

type MatchInfo = {
  problemName: string;
  oppImage: string;
  status: string;
  amount: number;
  submissions: Submission[];
};

interface Submission {
  compile_output: string | null;
  exit_code: number;
  exit_signal: string | null;
  game_id: string;
  id: string;
  language_id: number;
  memory: number;
  message: string | null;
  number_of_accepted_testcases: number;
  score: number;
  source_code: string;
  status: number;
  submission_time: string;
  time: number;
  total_number_of_testcases: number;
  username: string;
}

const language: { [key: number]: string } = {
  52: 'cpp',
  53: 'cpp',
  54: 'cpp',
  63: 'javascript',
  74: 'typescript',
  76: 'cpp',
};

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

export default function MatchCard({
  problemName,
  oppImage,
  status,
  amount,
  submissions = [],
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

  const handleExpandClick = () => {
    setOpen(!open);
  };

  const user = useSelector((state: RootState) => state.user.data);

  return (
    <div style={{ marginBottom: '5rem' }}>
      <List sx={{ padding: '0' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            backgroundColor: '#0f0c29',
            width: '100%',
            height: '10rem',
            borderRadius: '1rem 1rem 0 0',
            boxShadow: '0 0 0.2rem ',
            padding: '0 2rem',
          }}
        >
          <div>
            <p className="level-p">{problemName}</p>
          </div>
          <div>
            <Stack direction="row" spacing={4} alignContent={'center'}>
              {user?.data?.image === undefined ? (
                <Avatar sx={{ width: '5rem', height: '5rem' }} />
              ) : (
                <img
                  src={user?.data.image}
                  alt="user image"
                  className="user-img"
                />
              )}
              <p
                style={{
                  color: 'white',
                  fontFamily: 'Rock Salt',
                  fontSize: '2rem',
                }}
              >
                VS
              </p>
              <img
                src={oppImage}
                alt="opponent image"
                style={{ width: '5rem', height: '5rem', borderRadius: '100%' }}
              />
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
              {amount}
            </p>
          </Stack>
          {open ? (
            <ExpandLessIcon
              style={{ color: 'white', fontSize: '5rem', cursor: 'pointer' }}
              onClick={handleExpandClick}
            />
          ) : (
            <ExpandMoreIcon
              style={{ color: 'white', fontSize: '5rem', cursor: 'pointer' }}
              onClick={handleExpandClick}
            />
          )}
        </Stack>
      </List>
      <div>
        <Collapse in={open} timeout="auto" unmountOnExit>
          {submissions.length === 0 ? (
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
                backgroundColor: '#0f0c29',
              }}
            >
              <Table sx={{ width: '100%' }} aria-label="simple table">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: '#1E1E36',
                      '& th': {
                        color: 'white',
                        fontSize: '2.5rem',
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
                  {submissions.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '& td': {
                          border: 'none',
                          color: 'white',
                          fontSize: '2rem',
                        },
                        backgroundColor:
                          index % 2 === 0 ? '#24243E' : '#1E1E36',
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
                                SubmissionStatus[row.status] === 'Wrong Answer'
                                  ? '#e33c37'
                                  : SubmissionStatus[row.status] === 'Accepted'
                                    ? '#2cbb5d'
                                    : '#E3BD37',
                              fontSize: '2rem',
                            }}
                          >
                            {SubmissionStatus[row.status]}
                          </div>
                          <div style={{ color: '#999' }}>
                            {formatDate(row.submission_time)}
                          </div>
                        </Stack>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {language[row.language_id]}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AccessTimeOutlinedIcon sx={{ fontSize: '2.5rem' }} />
                          <div>{row.time * 1000} ms</div>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <MemoryOutlinedIcon sx={{ fontSize: '2.5rem' }} />
                          <div>{`${row.memory} KB`}</div>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Collapse>
      </div>
    </div>
  );
}
