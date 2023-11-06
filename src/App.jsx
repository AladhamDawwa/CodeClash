import './App.css'
import {createBrowserRouter, RouterProvider, redirect} from "react-router-dom";
import _404 from "./components/404";
import SignIn from './components/Auth/SignIn';
import SignUp from "./components/Auth/SignUp";
import HomePage from "./components/HomePage";

let isUserAuthenticated = false;

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
    loader : () => {
      return isUserAuthenticated ? null : redirect("/signIn");
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
