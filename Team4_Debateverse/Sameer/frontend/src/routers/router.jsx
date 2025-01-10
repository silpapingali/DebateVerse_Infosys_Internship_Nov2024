import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../components/Login";
import Register from "../components/Register";
import PasswordCorrect from "../components/PasswordCorrect";
import PasswordConfirm from "../components/PasswordConfirm";
import RegisterSuccess from "../components/RegisterSuccess";
import Home from "../components/Home";
import About from "../components/About";
import Userdashboard from "../components/Userdashboard";
import Admindashboard from "../components/Admindashboard";
import VerifySuccess from "../components/VerifySuccess";
import DebatesSearch from "../components/DebatesSearch";
import NewDebate from "../components/NewDebate";
import Moderatedebate from "../components/Moderatedebate";
import Userdetails from "../components/Userdetails";
import AdminModerateDebate from "../components/AdminModerateDebate";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> }, // Default route
      { path: "/about", element: <About /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/passwordcorrect", element: <PasswordCorrect /> },
      { path: "/reset-password/:token", element: <PasswordConfirm /> },
      { path: "/registersuccess", element: <RegisterSuccess /> },
      { path: "/userdashboard", element: <Userdashboard /> },
      { path: "/admindashboard", element: <Admindashboard /> },
      { path: "/verify-email", element: <VerifySuccess /> },
      { path: "/debatesearch", element: <DebatesSearch /> },
      { path: "/newdebate", element: <NewDebate /> },
      { path: "/moderatedebate", element: <Moderatedebate /> },
      { path: "/userdetails/:id", element: <Userdetails /> },
      { path: "/adminmoderatedebate", element: <AdminModerateDebate /> },
    ],
  },
]);

export default router;


// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import App from "../App";
// import Login from "../components/Login";
// import Register from "../components/Register";
// import PasswordCorrect from "../components/PasswordCorrect";
// import PasswordConfirm from "../components/PasswordConfirm";
// import RegisterSuccess from "../components/RegisterSuccess";
// import Home from "../components/Home";
// import About from "../components/About";
// import Userdashboard from "../components/Userdashboard";
// import Admindashboard from "../components/Admindashboard";
// import VerifySuccess from "../components/VerifySuccess";
// import DebatesSearch from "../components/DebatesSearch";
// import NewDebate from "../components/NewDebate";
// import Moderatedebate from "../components/Moderatedebate";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       { path: "/", element: <Home /> },
//       { path: "/about", element: <About /> },
//       { path: "/login", element: <Login /> },
//       { path: "/register", element: <Register /> },
//       { path: "/passwordcorrect", element: <PasswordCorrect /> },
//       { path: "/reset-password/:token", element: <PasswordConfirm /> },
//       { path: "/registersuccess", element: <RegisterSuccess /> },
//       { path: "/userdashboard", element: <Userdashboard /> },
//       { path: "/admindashboard", element: <Admindashboard /> },
//       { path: "/verify-email", element: <VerifySuccess /> },
//       { path: "/debatesearch", element: <DebatesSearch /> },
//       { path: "/newdebate", element: <NewDebate /> },
//       { path: "/moderatedebate", element: <Moderatedebate /> },
//     ],
//   },
// ]);

// export default router;
