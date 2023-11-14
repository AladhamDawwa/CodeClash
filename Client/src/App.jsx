import './App.css'
import {createBrowserRouter, RouterProvider, redirect} from "react-router-dom";
import _404 from "./components/404";
import SignIn from './components/Auth/SignIn';
import SignUp from "./components/Auth/SignUp";
import HomePage from "./components/HomePage";
import Landing from "./components/Landing";

let isUserAuthenticated = false;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing/>,
    loader : () => {
      return isUserAuthenticated ? redirect("/home") : null;
    },
  },
  {
    path: "/home",
    element: <HomePage/>,
  },
  {
    path: "/signIn",
    element: <SignIn/>,
  },
  {
    path: "/signUp",
    element: <SignUp/>,
  },
  {
    path: "*",
    element: <_404/>,
  }
]);

function App() {
  return (
    <div id='main'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
