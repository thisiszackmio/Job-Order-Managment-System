import { Navigate, createBrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Register from "./views/Register";
import Logout from "./views/Logout";
import GuestLayout from "./components/GuestLayout";
import DefaultLayout from "./components/DefaultLayout";
import RequestForm from "./views/RequestForm";
import RequestList from "./views/RequestList";
import ViewRequestInspection from "./views/ViewRequestInspection";
import EditRequestInspection from "./views/EditInspectionRequest";
import MyRequest from "./views/YourRequest";
import AdminManagerRequest from "./views/AdminMangerRequestList";
import AdminManagerViewRequest from "./views/AdminMangerViewRequest";


const routes = [
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: "/dashboard",
                element: <Navigate to="/" />
            },
            {
                path: "/",
                element: <Dashboard />
            },
            {
                path: "/request_form",
                element: <RequestForm />
            },
            {
                path: "/my_request/:id",
                element: <MyRequest />
            },
            {
                path: "/request_list",
                element: <RequestList />
            },
            {
                path: "/view_request_inspection/:id",
                element: <ViewRequestInspection />
            },
            {
                path: "/edit_request_inspection/:id",
                element: <EditRequestInspection />
            },
            // For Maam Daisy's page only
            {
                path: "/admin_manager_request",
                element: <AdminManagerRequest />
            },
            {
                path: "/admin_manager_view_inspection_request/:id",
                element: <AdminManagerViewRequest />
            }
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/logout",
                element: <Logout />
            }
        ]
    }

];

const router = createBrowserRouter(routes);

export default router;