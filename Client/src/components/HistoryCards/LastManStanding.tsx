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
import SubmissionStatus from '../../utils/submission_status';
import language from '../../utils/languages.json';
import { AvatarGroup } from '@mui/material';

type MatchInfo = {
  problemName: string;
  oppImage: string;
  status: string;
  amount: number;
  submissions: Submission[];
  startDate: any;
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

export default function LastManStanding({
  oppImage,
  status,
  amount,
  submissions = [],
  startDate,
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

  const milliseconds =
    startDate._seconds * 1000 + startDate._nanoseconds / 1000000;
  const gameDate = new Date(milliseconds);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  const formattedDate = gameDate.toLocaleDateString('en-US', options);
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
          <div
            style={{
              width: '15%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <p className="level-p">{formattedDate}</p>
            <p
              className="level-p"
              style={{ color: '#2cbb5d', fontStyle: 'italic' }}
            >
              Round 2
            </p>
          </div>
          <div style={{ width: '15%' }}>
            <Stack direction="row" spacing={4} alignContent={'center'}>
              {user?.image === undefined ? (
                <Avatar
                  sx={{
                    width: '4.5rem',
                    height: '4.5rem',
                    alignSelf: 'center',
                  }}
                />
              ) : (
                <img
                  src={user?.image}
                  alt="user image"
                  className="user-img"
                  style={{
                    width: '4.5rem',
                    height: '4.5rem',
                    alignSelf: 'center',
                  }}
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
              <AvatarGroup max={2} sx={{ alignSelf: 'center' }}>
                <Avatar alt="user 2" src={oppImage} className="user-img" />
                <Avatar alt="user 3" />
                <Avatar alt="user 4" />
              </AvatarGroup>
            </Stack>
          </div>
          <p
            style={{
              color: `${textColor}`,
              fontSize: '3rem',
              fontWeight: 'bold',
              textTransform: 'capitalize',
              width: '15%',
            }}
          >
            {status}
          </p>
          <Stack
            direction="row"
            spacing={1}
            alignItems={'center'}
            sx={{ width: '15%' }}
          >
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
                    <TableCell align="center" sx={{ width: '15%' }}>
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
                    <TableCell align="center" sx={{ width: '15%' }}>
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
                    <TableCell align="left" sx={{ width: '15%' }}>
                      RunTime
                    </TableCell>
                    <TableCell align="left" sx={{ width: '15%' }}>
                      Memory
                    </TableCell>
                    <TableCell align="left" sx={{ width: '2%' }}></TableCell>
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
                      <TableCell align="left">
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
                        align="left"
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {
                          language.find(lang => lang.id === row.language_id)
                            ?.name
                        }
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
                      <TableCell></TableCell>
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
