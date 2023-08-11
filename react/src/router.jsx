import { Navigate, createBrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Register from "./views/Register";
import GuestLayout from "./components/GuestLayout";
import DefaultLayout from "./components/DefaultLayout";
import DeploymentofPersonel from "./views/DeploymentOfPersonel";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/dashboard',
                element: <Navigate to="/" />
            },
            {
                path: '/',
                element: <Dashboard />
            },
            {
                path: '/dps',
                element: <DeploymentofPersonel />
            }
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            }
        ]
    }

])

export default router;