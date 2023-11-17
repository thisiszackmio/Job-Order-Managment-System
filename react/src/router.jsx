import { Navigate, createBrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Logout from "./views/Logout";
import GuestLayout from "./components/GuestLayout";
import DefaultLayout from "./components/DefaultLayout";
import RequestForm from "./views/RequestForm";
import RequestList from "./views/RequestList";
import MyRequest from "./views/YourRequest";
import PrepostRepairForm from "./views/PrePostRepairForm";
import Account from "./views/Personnel"; 
import AccountEdit from "./views/AccountEdit";
import FacilityVenueForm from "./views/FacilityVenueForm";


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
                path: "/account",
                element: <Account />
            },
            {
                path: "/editaccount/:id",
                element: <AccountEdit />
            },
            //For Inspection Form
            {
                path: "/repairinspectionform/:id",
                element: <PrepostRepairForm />
            },
            //For Facility / Venue Room
            {
                path: "/facilityvenueform/:id",
                element: <FacilityVenueForm />
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
                path: "/logout",
                element: <Logout />
            }
        ]
    }

];

const router = createBrowserRouter(routes);

export default router;