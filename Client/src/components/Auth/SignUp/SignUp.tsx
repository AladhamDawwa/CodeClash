import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ChangeEvent, FormEvent } from "react";
import { redirect } from "react-router-dom";

function signUp(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.target as HTMLFormElement);

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const userName = formData.get("userName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  redirect("/");
  console.log("Signed up");
}

const SignUp = () => {
  function validateUserName(event: ChangeEvent<HTMLInputElement>): void {
    console.log(event.target.value);
  }

  function validateEmail(event: ChangeEvent<HTMLInputElement>): void {
    console.log(event.target.value);
    const regex = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
    if (regex.test(event.target.value)) {
      console.log("Valid email");
    } else {
      console.log("Invalid email");
    }
  }

  function validatePassword(event: ChangeEvent<HTMLInputElement>): void {
    console.log(event.target.value);
    if (event.target.value.length < 8) {
      console.log("Password too short");
    } else {
      console.log("Password long enough");
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="justify-center items-center flex-[2] hidden sm:flex">
        <img src="./assets/logo.svg" alt="logo" className="w-1/2"></img>
      </div>
      <div className="flex-[3] flex justify-center">
        <Paper
          elevation={24}
          className="h-[650px] w-3/4 max-w-md py-6 flex flex-col justify-between items-center !rounded-3xl"
        >
          <div className="flex flex-col items-center w-fit">
            <p className="text-2xl font-bold">Sign Up</p>
            <hr className="border-black border-2 w-1/2 m-[1px]" />
          </div>
          <form
            onSubmit={signUp}
            className="flex flex-col justify-evenly items-center flex-[6]"
          >
            <TextField
              name="firstName"
              required
              label="First Name"
              variant="outlined"
            />
            <TextField
              name="lastName"
              required
              label="Last Name"
              variant="outlined"
            />
            <TextField
              onChange={validateUserName}
              name="userName"
              required
              label="Username"
              variant="outlined"
            />
            <TextField
              onChange={validateEmail}
              name="email"
              required
              label="Email"
              variant="outlined"
            />
            <TextField
              onChange={validatePassword}
              name="password"
              required
              type="password"
              label="Password"
              variant="outlined"
            />
            <TextField
              required
              type="password"
              label="Confirm Password"
              variant="outlined"
            />
            <Button
              variant="contained"
              type="submit"
              className="w-fit"
              disabled={false}
            >
              Sign up
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
};
export default SignUp;
