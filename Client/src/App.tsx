import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import SignUp from "./components/Auth/SignUp";
import Landing from "./pages/Landing";
import SignIn from "./components/Auth/SignIn/SignIn";
import _404 from "./components/404/404";

let isUserAuthenticated = false;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    loader: () => {
      return isUserAuthenticated ? redirect("/home") : null;
    },
  },
  // {
  //   path: "/home",
  //   element: <HomePage/>,
  // },
  {
    path: "/signIn",
    element: <SignIn />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <_404 />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
