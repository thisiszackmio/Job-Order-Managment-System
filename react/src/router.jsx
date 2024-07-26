import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import GuestLayout from './components/GuestLayout';
import Login from './views/Login';

//  -- JLMS -- //
import JLMSLayout from './components/JLMSLayout';
import DashboardJLMS from './views/jlms/DashboardJLMS';
import UserRegistrationJLMS from './views/jlms/UserRegistration';
import UserListJLMS from './views/jlms/UserList';
import UserDetailsJLMS from './views/jlms/UserDetails';

// -- AMS -- //
import AMSLayout from './components/AMSLayout';
import DashboardAMS from './views/ams/Dashboard';
import AccountableOfficerAMS from './views/ams/AccountableOfficer';
import AddAccountableOfficerAMS from './views/ams/AddAccountableOfficer';
import AssestClassificationAMS from './views/ams/AssetClassification';
import AddAssestClassificationAMS from './views/ams/AddAssetClassification';

// -- JOMS -- //
import JOMSLayout from './components/JOMSLayout';
import DashboardJOMS from './views/DashboardJOMS';

// import Dashboard from './views/Dashboard';

// import Logout from './views/Logout';
// 
// import DefaultLayout from './components/DefaultLayout';
// import ProtectedRoute from './components/ProtectedRoute';

// import RequestRepairForm from './views/InspectionFormRequest';
// import MyRequestForm from './views/MyRequest';
// import RequestFormFacility from './views/RequestForFacilityVenue';
// import RequestVehicleSlipForm from './views/RequestForVehicleSlipForm';
// import RequestEquipmentForm from './views/RequestForEquipment';
// import MyEquipmentForm from './views/MyEquipementForm';
// import RepairRequestForm from './views/RepairFormList';
// import FacilityFormForm from './views/FacilityVenueFormList';
// import VehicleSlipFormList from './views/VehicleSlipFormList';
// import EquipmentFormList from './views/EquipmentFormList';
// import PrepostRepairForm from './views/PrePostRepairForm';
// import FacilityVenueForm from './views/FacilityVenueForm';
// import VehicleSlipForm from './views/VehicleSlipForm';
// import EquipmentForm from './views/EquipmentForm';
// import UsersList from './views/UserList';
// import UserDetails from './views/UserDetails';
// import UserAssign from './views/UserAssign';
// import UserRegistration from './views/UserRegistration';
// import NewPassword from './views/NewPassword';
// import Forbidden from './components/403';
// import NotFound from './components/404';

const routes = [
  {
    path: '/',
    element: <JLMSLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Navigate to="/" />
      },
      {
        path: '/',
        element: <DashboardJLMS />
      },
      {
        path: '/addemployee',
        element: <UserRegistrationJLMS />
      },
      {
        path: '/userlist',
        element: <UserListJLMS />
      },
      {
        path: '/userdetails',
        element: <UserDetailsJLMS />
      }
    ]
  },

  // ---- Job Order Management System ---- //
  {
    path: '/joms',
    element: <JOMSLayout />,
    children: [
      {
        path: '/joms',
        element: <Navigate to="/joms/dashboard" />
      },
      {
        path: '/joms/dashboard',
        element: <DashboardJOMS />
      }
    ]
  },

  // ---- Asset Management System ---- //
  {
    path: '/ams',
    element: <AMSLayout />,
    children: [
      {
        path: '/ams',
        element: <Navigate to="/ams/dashboard" />
      },
      {
        path: '/ams/dashboard',
        element: <DashboardAMS />
      },
      {
        path: '/ams/accountable-officer',
        element: <AccountableOfficerAMS />
      },
      {
        path: '/ams/add-accountable-officer',
        element: <AddAccountableOfficerAMS />
      },
      {
        path: '/ams/asset-classification',
        element: <AssestClassificationAMS />
      },
      {
        path: '/ams/add-asset-classification',
        element: <AddAssestClassificationAMS />
      }
    ]
  },

  // ---- Login ---- //
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
    ]
  }
];

const router = createBrowserRouter(routes);

export default router;
