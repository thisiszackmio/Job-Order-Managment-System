import { Navigate, createBrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Logout from "./views/Logout";
import GuestLayout from "./components/GuestLayout";
import DefaultLayout from "./components/DefaultLayout";

import RequestRepairForm from "./views/RequestForRepairForm";

import MyRequestInspectionForm from "./views/MyRequestforInspectionForm";

import RepairRequestForm from "./views/RepairFormList"

import PrepostRepairForm from "./views/PrePostRepairForm";

import RequestList from "./views/RequestList";
import MyRequest from "./views/YourRequest";
import Account from "./views/Personnel"; 
import AccountEdit from "./views/AccountEdit";
import FacilityVenueForm from "./views/FacilityVenueForm";
import VehicleSlipForm from "./views/VehicleSlipForm";
import EquipmentForm from "./views/EquipmentForm";
import RepairRequestList from "./views/RepairFormList";


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
            //For Pre/Post Repair Inspection Form
            {
                path: "/repairrequestform/:id",
                element: <RequestRepairForm />
            },
            //My Request Form
            // For Pre/Post Repair Inspection Form
            {
                path: "/myrequestinpectionform/:id",
                element: <MyRequestInspectionForm />
            },
            //Request List
            {
                path: "/repairrequestform",
                element: <RepairRequestForm />
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
            },
            //For Vehicle Slip Form
            {
                path: "/vehicleslipform/:id",
                element: <VehicleSlipForm />
            },
            //For Equipment Form
            {
                path: "/equipmentform/:id",
                element: <EquipmentForm />
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