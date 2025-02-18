import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import GuestLayout from './components/GuestLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorize from './components/403';
import FileNotFound from './components/404';
import ViewUser from './views/jlms/ViewUser';
import Login from './views/Login';
import Logout from './views/Logout';
import Maintenance from './components/maint';

//  -- JLMS -- //
import AllAnnouncements from './views/jlms/AllAnnounce';
import JLMSLayout from './components/JLMSLayout';
import DashboardJLMS from './views/jlms/DashboardJLMS';
import AddAnnouncements from './views/jlms/AddAnnounce';
import UserRegistrationJLMS from './views/jlms/UserRegistration';
import UserListJLMS from './views/jlms/UserList';
import UserDetailsJLMS from './views/jlms/UserDetails';
import Logs from './views/jlms/Logs';

// -- AMS -- //
import AMSLayout from './components/AMSLayout';
import DashboardAMS from './views/ams/DashboardAMS';
// import AccountableOfficerAMS from './views/ams/AccountableOfficer';
// import AddAccountableOfficerAMS from './views/ams/AddAccountableOfficer';
// import AssestClassificationAMS from './views/ams/AssetClassification';
// import AddAssestClassificationAMS from './views/ams/AddAssetClassification';

// -- JOMS -- //
import JOMSLayout from './components/JOMSLayout';
import DashboardJOMS from './views/joms/DashboardJOMS';
import MyRequest from './views/joms/MyRequestList';
import AddPersonnel from './views/joms/Personnel/AddPersonnel';
import AddVehicleType from './views/joms/VehicleSlip/VehicleType';
import VehicleSlipFormRequest from './views/joms/VehicleSlip/VehicleSlipRequest';
import VehicleSlipForm from './views/joms/VehicleSlip/VehicleSlip'; 
import VehicleSlipList from './views/joms/VehicleSlip/VehicleSlipList';
import InspectionRepairFormRequest from './views/joms/InspectionForms/InpectionFormRequest';
import InspectionRepairForm from './views/joms/InspectionForms/InspectionForm';
import InspectionFormList from './views/joms/InspectionForms/InspectionFormList';
import FacilityVenueFormRequest from './views/joms/FacilityForms/FacilityForRequest';
import FacilityVenueForm from './views/joms/FacilityForms/FacilityForm';
import FacilityVenueList from './views/joms/FacilityForms/FacilityFormList';

const routes = [
  // ---- Joint Local Management System ---- //
  {
    path: '/',
    element: <ProtectedRoute><JLMSLayout /></ProtectedRoute>,
    children: [
      { path: '/dashboard', element: <Navigate to="/" /> },
      { path: '/', element:  <DashboardJLMS /> },
  //     { path: '/addannouncement', element: <AddAnnouncements /> },
  //     { path: '/allannouncement', element: <AllAnnouncements /> },
  //     { path: '/addemployee', element: <UserRegistrationJLMS /> },
  //     { path: '/userlist', element: <UserListJLMS /> },
  //     { path: '/userdetails/:id', element: <UserDetailsJLMS /> },
  //     { path: '/user', element: <ViewUser /> },
  //     { path: '/logs', element: <Logs /> }
    ]
  },

  // ---- Job Order Management System ---- //
  // {
  //   path: '/joms',
  //   element: <ProtectedRoute><JOMSLayout /></ProtectedRoute>,
  //   children: [
  //     { path: '/joms', element: <Navigate to="/joms/dashboard" /> },
  //     { path: '/joms/dashboard', element: <DashboardJOMS /> },
  //     { path: '/joms/myrequest', element: <MyRequest /> },
  //     { path: '/joms/personnel', element: <AddPersonnel /> },
  //     { path: '/joms/vehicletype', element: <AddVehicleType /> },
  //     // Inspection
  //     { path: '/joms/inspection', element: <InspectionFormList /> },
  //     { path: '/joms/inspection/form', element: <InspectionRepairFormRequest /> },
  //     { path: '/joms/inspection/form/:id', element: <InspectionRepairForm /> },
  //     // Facility
  //     { path: '/joms/facilityvenue/form', element: <FacilityVenueFormRequest /> },
  //     { path: '/joms/facilityvenue/form/:id', element: <FacilityVenueForm /> },
  //     { path: '/joms/facilityvenue', element: <FacilityVenueList /> },
  //     // Vehicle
  //     { path: '/joms/vehicle/form', element: <VehicleSlipFormRequest /> },
  //     { path: '/joms/vehicle/form/:id', element: <VehicleSlipForm /> },
  //     { path: '/joms/vehicle', element: <VehicleSlipList /> },
  //   ]
  // },

  // ---- Asset Management System ---- //
  // {
  //   path: '/ams',
  //   element: <ProtectedRoute><AMSLayout /></ProtectedRoute>,
  //   children: [
  //     { path: '/ams', element: <Navigate to="/ams/dashboard" /> },
  //     { path: '/ams/dashboard', element: <DashboardAMS /> },
  // //     {
  // //       path: '/ams/accountable-officer',
  // //       element: <AccountableOfficerAMS />
  // //     },
  // //     {
  // //       path: '/ams/add-accountable-officer',
  // //       element: <AddAccountableOfficerAMS />
  // //     },
  // //     {
  // //       path: '/ams/asset-classification',
  // //       element: <AssestClassificationAMS />
  // //     },
  // //     {
  // //       path: '/ams/add-asset-classification',
  // //       element: <AddAssestClassificationAMS />
  // //     }
  //   ]
  // },

  // ---- Login ---- //
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/logout", element: <Logout /> },
    ]
  },
  // --- Other Pages --- //
  // { path: '/unauthorize', element: <Unauthorize /> },
  // { path: '*', element: <FileNotFound /> },
  // { path: '/404', element: <FileNotFound /> },
  // { path: '/maintanance', element:<Maintenance /> },
];

const router = createBrowserRouter(routes);

export default router;
