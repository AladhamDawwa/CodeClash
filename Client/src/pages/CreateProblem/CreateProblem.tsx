import { Button, Input, Tab, Tabs, TextField, Typography } from "@mui/material"
import { SyntheticEvent, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
type problem = {
  title: string
  description: string
  input_format: string
  output_format: string
  testcases: TestCase[]
}

type TestCase = {
  input: string
  output: string
}

const styleInput = {
  width: "100%",
  background: "#1a1a1d",
  borderRadius: "1rem",
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

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<problem>()
  const onSubmit: SubmitHandler<problem> = (data) => console.log(data)

  console.log(watch("title")) // watch input value by passing the name of it

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "3rem",
      alignItems: "center",
      height: "100vh",
      width: "100%",
    }}>
      <div style={{
        width: "50%",
        display: "flex",
        justifyContent: "space-between",
        padding: "0 0.5rem",
        minWidth: "450px",
        gap: "2rem",
      }}>
        <Typography variant="h2" style={{ 
          color: "#fff",
          fontWeight: "bold",
          font: "Roboto",
        }}>Create Problem</Typography>
        <div style={{
          display: "flex",
        }}>
          <Button sx={{
            background: "#a239ca",
            color: "white",
            borderRadius: "1rem 0 0 1rem",
            fontSize: "2rem",
            fontWeight: "bold",
            width: "50%",
            height: "5rem",
            '&:hover': {
              backgroundColor: "#8c1eb2",
            },
          }}
          onClick={() => setNumberOfExtraTC(numberOfExtraTC + 1)}
          >
            <AddCircleRoundedIcon sx={{ 
              fontSize: "2rem",
              marginRight: "0.5rem",
            }}/>
          </Button>
          <Button variant="text" sx={{
            background: "#ff0000",
            color: "white",
            borderRadius: "0 1rem 1rem 0",
            fontSize: "2rem",
            fontWeight: "bold",
            width: "50%",
            height: "5rem",
            '&:hover': {
              background: "#ff0000",
            },
          }}
          disabled={numberOfExtraTC === 0}
          onClick={() => setNumberOfExtraTC(numberOfExtraTC - 1)}
          >
            <RemoveCircleRoundedIcon sx={{ 
              fontSize: "2rem",
              marginRight: "0.5rem",
            }}/>
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} style={{
        display: "flex",
        flexDirection: "column",
        height: "75%",
        width: "50%",
        minWidth: "400px",
      }}>
        <Tabs value={value} variant="scrollable" onChange={handleChange} sx={{
          width: "100%",
          background: "#a239ca",
          borderRadius: "1rem 1rem 0 0",
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
        }}>
          <Tab label="Problem" />
          <Tab label="Sample Test Cases" />
          {[...Array(numberOfExtraTC)].map((_, i) => (
            <Tab key={i} label={`Test Case #${i + 1}`} />
          ))}
        </Tabs>
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "4rem",
            width: "100%",
            background: "#0f0c29",
            padding: "3rem",
            borderRadius: "0 0 1rem 1rem",
            alignItems: "center",
        }}>
          { value === 0 &&
            <>
              <TextField label="Problem Title"
                {...register("title", { required: true })}
                sx={{
                  ...styleInput,
                  '& input': { color: '#fff' },
              }}
              />

              <TextField label="Problem Description"
                multiline
                rows={4}
                {...register("description", { required: true })}
                sx={{
                  ...styleInput,
                  '& textarea': { color: '#fff' },
                }}
              />

              <div style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}>
                <TextField label="Input Format"
                  multiline
                  rows={6}
                  {...register("input_format", { required: true })}
                  sx={{
                    ...styleInput,
                    '& textarea': { color: '#fff' },
                    width: "43%",
                  }}
                />

                <TextField label="Output Format"
                  multiline
                  rows={6}
                  {...register("output_format", { required: true })}
                  sx={{
                    ...styleInput,
                    '& textarea': { color: '#fff' },
                    width: "43%",
                  }}
                />
              </div>

              {/* include validation with required or other standard HTML validation rules */}
              {/* <Input {...register("exampleRequired", { required: true })} /> */}
              {/* errors will return when field validation fails  */}
              {/* {errors.exampleRequired && <span>This field is required</span>} */}

              <Button type="submit" variant="contained" sx={{
                background: "#a239ca",
                color: "white",
                borderRadius: "1rem",
                fontSize: "1.5rem",
                fontWeight: "bold",
                width: "20rem",
                wordSpacing: "0.5rem",
                '&:hover': {
                  backgroundColor: "#8c1eb2",
                },
              }}>Create Problem</Button>

            </>
          }
          { value === 1 &&
            <div style={{
              display: "flex",
              gap: "2rem",
              width: "100%",
            }}>
              <TextField label={`Test Case Input`}
                multiline
                rows={25}
                // {...register(`testcases.${i}.input`, { required: true })}
                sx={{
                  ...styleInput,
                  '& textarea': { color: '#fff' },
                }}
              />

              <TextField label={`Test Case Output`}
                multiline
                rows={25}
                // {...register(`testcases.${i}.output`, { required: true })}
                sx={{
                  ...styleInput,
                  '& textarea': { color: '#fff' },
                }}
              />
            </div>
          }

          {[...Array(numberOfExtraTC)].map((_, i) => ( value == i + 2 &&
            <div key={i} style={{
              display: "flex",
              gap: "2rem",
              width: "100%",
            }}>
              <TextField label={`Test Case #${i + 1} Input`}
                multiline
                rows={25}
                // {...register(`testcases.${i}.input`, { required: true })}
                sx={{
                  ...styleInput,
                  '& textarea': { color: '#fff' },
                }}
              />

              <TextField label={`Test Case #${i + 1} Output`}
                multiline
                rows={25}
                // {...register(`testcases.${i}.output`, { required: true })}
                sx={{
                  ...styleInput,
                  '& textarea': { color: '#fff' },
                }}
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  )
}

export default CreateProblem
