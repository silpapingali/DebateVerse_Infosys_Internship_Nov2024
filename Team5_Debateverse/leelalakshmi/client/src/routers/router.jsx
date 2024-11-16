import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Login from "../components/Login";
import Register from "../components/Register";
import PasswordCorrect from "../components/PasswordCorrect";
import PasswordConfirm from "../components/PasswordConfirm";
import RegisterSuccess from "../components/RegisterSuccess";
import Home from "../components/Home";
import About from "../components/About";
const router = createBrowserRouter([
    {
      path: "/",
      element:<App/>,
      children: [
        {
        path: "/",
        element:<Home/>
        },
        {
            path: "/about",
            element:<About/>
            },
            {
            path: "/login",
            element:<Login/>
            },
            {
            path: "/register",
            element:<Register/>
            },
            {
            path:"/passwordcorrect",
            element:<PasswordCorrect/>
            },
            {
              path:"/passwordconfirm",
              element:<PasswordConfirm/>
            },
            {
              path:"/registersuccess",
              element:<RegisterSuccess/>

            }

      ]
    },
  ]);
  export default router;