import { Navigate, createBrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Logout from "./views/Logout";
import GuestLayout from "./components/GuestLayout";
import DefaultLayout from "./components/DefaultLayout";

import RequestRepairForm from "./views/RequestForRepairForm";
import RequestFormFacility from "./views/RequestForFacilityVenue";

import MyRequestInspectionForm from "./views/MyRequestforInspectionForm";
import MyRequestFacilityVenue from "./views/MyFacilityVenueForm";

import RepairRequestForm from "./views/RepairFormList"

import PrepostRepairForm from "./views/PrePostRepairForm";
import FacilityVenueForm from "./views/FacilityVenueForm";

import RequestList from "./views/RequestList";
import MyRequest from "./views/YourRequest";
import Account from "./views/Personnel"; 
import AccountEdit from "./views/AccountEdit";
import VehicleSlipForm from "./views/VehicleSlipForm";
import EquipmentForm from "./views/EquipmentForm";

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

            //Form
            //For Pre/Post Repair Inspection Form
            {
                path: "/repairrequestform/:id",
                element: <RequestRepairForm />
            },
            //For Facility / Venue Form
            {
                path: "/facilityrequestform/:id",
                element: <RequestFormFacility />
            },

            //My Request Form
            // For Pre/Post Repair Inspection
            {
                path: "/myrequestinpectionform/:id",
                element: <MyRequestInspectionForm />
            },
            // For Facility/Venue Form
            {
                path: "/myrequestfacilityvenueform/:id",
                element: <MyRequestFacilityVenue />
            },

            //Request List
            //For Pre/Post Inspection Repair
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
            //Request Details
            //For Inspection Form Details
            {
                path: "/repairinspectionform/:id",
                element: <PrepostRepairForm />
            },
            //For Facility / Venue Form Details
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