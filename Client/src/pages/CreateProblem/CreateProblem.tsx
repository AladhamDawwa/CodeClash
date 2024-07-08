import {
  Button,
  Rating,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import { encode } from 'js-base64';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAdminState } from '../../store/reducers/adminReducer';
type problem = {
  title: string;
  description: string;
  input_format: string;
  output_format: string;
  memory_limit: number;
  time_limit: number;
  rating: string;
  testcases: TestCase[];
};

type TestCase = {
  input: string;
  expected_output: string;
  test_type: number;
};

const styleInput = {
  width: '100%',
  background: '#1a1a1d',
  borderRadius: '1rem',
  '& label': {
    color: '#fff',
    fontSize: '1.5rem',
  },
  '& label.Mui-focused': {
    color: '#fff',
  },
};

const CreateProblem = () => {
  const [value, setValue] = useState(0);
  const [numberOfExtraTC, setNumberOfExtraTC] = useState(0);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  // const auth = useSelector((state: any) => state.auth);
  const auth = useSelector((state: any) => state.admin.data);

  const { register, handleSubmit, unregister } = useForm<problem>();
  const onSubmit: SubmitHandler<problem> = (data: problem) => {
    data.testcases.map((test_case, index) => {
      test_case.input = encode(test_case.input);
      test_case.expected_output = encode(test_case.expected_output);
      test_case.test_type = index === 0 ? 0 : 1;
    });
    data.description = encode(data.description);
    data.input_format = encode(data.input_format);
    data.output_format = encode(data.output_format);
    data.rating = String.fromCharCode(64 + rating).toLowerCase();
    console.log(auth.token);
    axios
      .post('http://localhost:5000/problems/create', [data], {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setOpen(true);
      });
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '3rem',
          alignItems: 'center',
          height: '100vh',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '50%',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 0.5rem',
            minWidth: '450px',
            gap: '2rem',
          }}
        >
          <Typography
            variant="h2"
            style={{
              color: '#fff',
              fontWeight: 'bold',
              font: 'Roboto',
            }}
          >
            Create Problem
          </Typography>
          <div
            style={{
              display: 'flex',
            }}
          >
            <Button
              sx={{
                background: '#4caf50',
                color: 'white',
                borderRadius: '1rem 0 0 1rem',
                fontSize: '2rem',
                fontWeight: 'bold',
                width: '50%',
                height: '5rem',
                '&:hover': {
                  background: '#388e3c',
                },
              }}
              onClick={() => setNumberOfExtraTC(numberOfExtraTC + 1)}
            >
              <AddCircleRoundedIcon
                sx={{
                  fontSize: '2rem',
                  marginRight: '0.5rem',
                }}
              />
            </Button>
            <Button
              sx={{
                background: '#f44336',
                color: 'white',
                borderRadius: '0 1rem 1rem 0',
                fontSize: '2rem',
                fontWeight: 'bold',
                width: '50%',
                height: '5rem',
                '&:hover': {
                  background: '#ff0000',
                },
              }}
              disabled={numberOfExtraTC === 0}
              onClick={() => {
                setNumberOfExtraTC(numberOfExtraTC - 1);
                if (value === numberOfExtraTC + 1) {
                  setValue(value - 1);
                }
                unregister(`testcases.${numberOfExtraTC}`);
              }}
            >
              <RemoveCircleRoundedIcon
                sx={{
                  fontSize: '2rem',
                  marginRight: '0.5rem',
                }}
              />
            </Button>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '75%',
            width: '50%',
            minWidth: '600px',
          }}
        >
          <Tabs
            value={value}
            variant="scrollable"
            onChange={handleChange}
            sx={{
              width: '100%',
              background: '#a239ca',
              borderRadius: '1rem 1rem 0 0',
              '& button': {
                color: '#fff',
                fontSize: '1.5rem',
              },
              '& button.Mui-selected': {
                color: '#fff',
                background: '#8c1eb2',
              },
              // scroll buttons color
              '& .MuiTabs-scrollButtons': {
                color: '#fff',
                backgroundColor: '#8c1eb2',
              },
              '& .MuiTabs-indicator': {
                background: '#fff',
              },
            }}
          >
            <Tab label="Problem" />
            <Tab label="Sample Test Cases" />
            {[...Array(numberOfExtraTC)].map((_, i) => (
              <Tab key={i} label={`Test Case #${i + 1}`} />
            ))}
          </Tabs>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '100%',
              background: '#0f0c29',
              padding: '2rem',
              borderRadius: '0 0 1rem 1rem',
              alignItems: 'center',
              height: '70rem',
            }}
          >
            {value === 0 && (
              <>
                <TextField
                  label="Problem Title"
                  {...register('title', { required: true })}
                  sx={{
                    ...styleInput,
                    '& input': {
                      color: '#fff',
                      fontSize: '1.5rem',
                    },
                  }}
                />

                <TextField
                  label="Problem Description"
                  multiline
                  rows={4}
                  {...register('description', { required: true })}
                  sx={{
                    ...styleInput,
                    '& textarea': {
                      color: '#fff',
                      fontSize: '1.5rem',
                    },
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <TextField
                    label="Input Format"
                    multiline
                    rows={6}
                    {...register('input_format', { required: true })}
                    sx={{
                      ...styleInput,
                      '& textarea': {
                        color: '#fff',
                        fontSize: '1.5rem',
                      },
                      width: '43%',
                    }}
                  />

                  <TextField
                    label="Output Format"
                    multiline
                    rows={6}
                    {...register('output_format', { required: true })}
                    sx={{
                      ...styleInput,
                      '& textarea': {
                        color: '#fff',
                        fontSize: '1.5rem',
                      },
                      width: '43%',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <TextField
                    label="Memory Limit in MBs"
                    {...register('memory_limit', { required: true })}
                    sx={{
                      ...styleInput,
                      '& input': {
                        color: '#fff',
                        fontSize: '1.5rem',
                      },
                      width: '43%',
                    }}
                  />

                  <TextField
                    label="Time Limit in seconds"
                    {...register('time_limit', { required: true })}
                    sx={{
                      ...styleInput,
                      '& input': {
                        color: '#fff',
                        fontSize: '1.5rem',
                      },
                      width: '43%',
                    }}
                  />
                </div>

                {/* dropdown rating A - H */}
                <div
                  style={{
                    display: 'flex',
                    gap: '2rem',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h4" style={{ color: '#fff' }}>
                    Rating
                  </Typography>
                  <Rating
                    value={rating}
                    defaultValue={0}
                    max={10}
                    onChange={(event, newValue) => {
                      setRating(newValue as number);
                    }}
                    sx={{
                      fontSize: '3rem',
                      '& .MuiRating-iconEmpty': {
                        color: '#fff',
                      },
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background: '#a239ca',
                    color: 'white',
                    borderRadius: '1rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    width: '20rem',
                    wordSpacing: '0.5rem',
                    '&:hover': {
                      backgroundColor: '#8c1eb2',
                    },
                  }}
                >
                  Create Problem
                </Button>
              </>
            )}
            {value === 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '2rem',
                  width: '100%',
                }}
              >
                <TextField
                  label={`Test Case Input`}
                  multiline
                  rows={25}
                  {...register(`testcases.0.input`, { required: true })}
                  sx={{
                    ...styleInput,
                    '& textarea': {
                      color: '#fff',
                      fontSize: '1.5rem',
                    },
                  }}
                />

                <TextField
                  label={`Test Case Output`}
                  multiline
                  rows={25}
                  {...register(`testcases.0.expected_output`, {
                    required: true,
                  })}
                  sx={{
                    ...styleInput,
                    '& textarea': {
                      color: '#fff',
                      fontSize: '1.5rem',
                    },
                  }}
                />
              </div>
            )}

            {[...Array(numberOfExtraTC)].map(
              (_, i) =>
                value == i + 2 && (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '2rem',
                      width: '100%',
                    }}
                  >
                    <TextField
                      label={`Test Case #${i + 1} Input`}
                      multiline
                      rows={25}
                      {...register(`testcases.${i + 1}.input`, {
                        required: true,
                      })}
                      sx={{
                        ...styleInput,
                        '& textarea': {
                          color: '#fff',
                          fontSize: '1.5rem',
                        },
                      }}
                    />

                    <TextField
                      label={`Test Case #${i + 1} Output`}
                      multiline
                      rows={25}
                      {...register(`testcases.${i + 1}.expected_output`, {
                        required: true,
                      })}
                      sx={{
                        ...styleInput,
                        '& textarea': {
                          color: '#fff',
                          fontSize: '1.5rem',
                        },
                      }}
                    />
                  </div>
                ),
            )}
          </div>
        </form>
      </div>
      <Button
        sx={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          background: 'transparent',
          borderRadius: '50%',
          width: '6rem',
          height: '6rem',
          '&:hover': {
            background: 'inherit',
            '& *': {
              color: 'white',
            },
          },
        }}
        onClick={() => {
          dispatch(clearAdminState());
          navigate('/signIn');
        }}
      >
        <LogoutIcon
          sx={{
            color: 'red',
            fontSize: '3rem',
            rotate: '180deg',
          }}
        />
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={60}
        message="Problem Added"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        action={
          <Button
            color="inherit"
            size="large"
            onClick={() => setOpen(false)}
            sx={{ fontSize: '1.2rem' }}
          >
            Close
          </Button>
        }
        sx={{
          '& .MuiSnackbarContent-root': {
            background: '#4caf50',
            color: '#fff',
            fontSize: '1.5rem',
          },
        }}
      />
    </>
  );
};

export default CreateProblem;
