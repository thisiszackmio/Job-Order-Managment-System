import { Navigate, createBrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Logout from "./views/Logout";
import GuestLayout from "./components/GuestLayout";
import DefaultLayout from "./components/DefaultLayout";

import RequestRepairForm from "./views/RequestForRepairForm";
import RequestFormFacility from "./views/RequestForFacilityVenue";
import RequestVehicleSlipForm from "./views/RequestForVehicleSlipForm";
import RequestEquipmentForm from "./views/RequestForEquipment";

import MyRequestInspectionForm from "./views/MyRequestforInspectionForm";
import MyRequestFacilityVenue from "./views/MyFacilityVenueForm";
import MyRequestVehicleSlip from "./views/MyVehicleSlipForm";
import MyEquipmentForm from "./views/MyEquipementForm";

import RepairRequestForm from "./views/RepairFormList";
import FacilityFormForm from "./views/FacilityVenueFormList";
import VehicleSlipFormList from "./views/VehicleSlipFormList";

import PrepostRepairForm from "./views/PrePostRepairForm";
import FacilityVenueForm from "./views/FacilityVenueForm";
import VehicleSlipForm from "./views/VehicleSlipForm";

import Forbidden from "./components/403";

import RequestList from "./views/RequestList";
import MyRequest from "./views/YourRequest";
import Account from "./views/Personnel"; 
import AccountEdit from "./views/AccountEdit";
import EquipmentForm from "./views/EquipmentForm";

const routes = [
    {
        path: '/',
        element: <DefaultLayout />,
        children: [

            //Main Tab
            {
                path: "/dashboard",
                element: <Navigate to="/" />
            },
            {
                path: "/",
                element: <Dashboard />
            },

            // ---- Form ---- //

            // Inspection Request Form
            {
                path: "/repairrequestform/:id",
                element: <RequestRepairForm />
            },
            // Facility / Venue Request Form
            {
                path: "/facilityrequestform/:id",
                element: <RequestFormFacility />
            },
            // Vehicle Slip Request Form
            {
                path: "/vehiclesliprequestform/:id",
                element: <RequestVehicleSlipForm />
            },
            // Equipement Request Form
            {
                path: "/equipmentrequestform/:id",
                element: <RequestEquipmentForm />
            },

            // ---- My Request Form ---- //

            // Inspection Request Form
            {
                path: "/myrequestinpectionform/:id",
                element: <MyRequestInspectionForm />
            },
            // Facility / Venue Request Form
            {
                path: "/myrequestfacilityvenueform/:id",
                element: <MyRequestFacilityVenue />
            },
            // Vehicle Slip Request Form
            {
                path: "/myrequestvehicleslipform/:id",
                element: <MyRequestVehicleSlip />
            },
            // Equipment Request Form
            {
                path: "/myequipmentform/:id",
                element: <MyEquipmentForm />
            },

            // ---- Request List Form ---- //

            // Inspection Request Form
            {
                path: "/repairrequestform",
                element: <RepairRequestForm />
            },
            // Facility / Venue Request Form
            {
                path: "/facilityvenuerequestform",
                element: <FacilityFormForm />
            },
            // Vehicle Slip Request Form
            {
                path: "/vehiclesliprequestform",
                element: <VehicleSlipFormList />
            },

            // ---- Form Details ---- //

            // Inspection Request Details
            {
                path: "/repairinspectionform/:id",
                element: <PrepostRepairForm />
            },
            // Facility / Venue Request Details
            {
                path: "/facilityvenueform/:id",
                element: <FacilityVenueForm />
            },
            // Vehicle Slip Request Details
            {
                path: "/vehicleslipform/:id",
                element: <VehicleSlipForm />
            },




            // ---- Others ---- //

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
    },
    {
        path: '/forbidden',
        element: <Forbidden />,
    }

];

const router = createBrowserRouter(routes);

export default router;