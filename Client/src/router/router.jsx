import {
    createBrowserRouter,
} from "react-router-dom";
import App from "../App"
import Home from "../pages/Home";
import Login from "../pages/Login"
import Signup from "../pages/Signup"


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/:user_params",
                element: <Home />
            },
            {
                path: "",
                element: <Home />,
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/signup",
                element: <Signup />
            }, {
                path: "*",
                element: <Home />
            }

        ],
    },
]);

export default router;
