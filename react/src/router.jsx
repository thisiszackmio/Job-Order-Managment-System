import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import GuestLayout from './components/GuestLayout';
import ProtectedRoute from './components/ProtectedRoute';
import FileNotFound from './components/404';
import ViewUser from './views/jlms/ViewUser';
import Login from './views/Login';

//  -- JLMS -- //
import AllAnnouncements from './views/jlms/AllAnnounce';
import JLMSLayout from './components/JLMSLayout';
import DashboardJLMS from './views/jlms/DashboardJLMS';
import AddAnnouncements from './views/jlms/AddAnnounce';
import UserRegistrationJLMS from './views/jlms/UserRegistration';
import UserListJLMS from './views/jlms/UserList';
import UserDetailsJLMS from './views/jlms/UserDetails';
import Logs from './views/jlms/Logs';
import SystemStats from './views/joms/SystemStatus'; 

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
import Maintenance from './views/joms/Maintenance';
import SystemUpdate from './views/joms/SystemUpdate';

const routes = [
  // ---- Joint Local Management System (Open No need for the access) ---- //
  {
    path: '/',
    element: <JLMSLayout />,
    children: [
    { path: '/', element:  <DashboardJLMS /> }
    ]
  },
  // ---- Job Order Management System ---- //
  {
    path: '/joms',
    element: <ProtectedRoute><JOMSLayout /></ProtectedRoute>,
    children: [
      { path: '/joms', element: <Navigate to="/joms/dashboard" /> },
      { path: '/joms/dashboard', element: <DashboardJOMS /> },
      { path: '/joms/allannouncement', element: <AllAnnouncements /> },
      { path: '/joms/addannouncement', element: <AddAnnouncements /> },
      { path: '/joms/addemployee', element: <UserRegistrationJLMS /> },
      { path: '/joms/systemupdate', element:  <SystemUpdate /> },
      { path: '/joms/userlist', element: <UserListJLMS /> },
      { path: '/joms/userdetails/:id', element: <UserDetailsJLMS /> },
      { path: '/joms/logs', element: <Logs /> },
      { path: '/joms/myrequest', element: <MyRequest /> },
      { path: '/joms/personnel', element: <AddPersonnel /> },
      { path: '/joms/vehicletype', element: <AddVehicleType /> },
      { path: '/joms/settings', element: <Maintenance /> },
      { path: '/joms/user', element: <ViewUser /> },
      { path: '/joms/systemstat', element: <SystemStats /> },
      // Inspection
      { path: '/joms/inspection', element: <InspectionFormList /> },
      { path: '/joms/inspection/form', element: <InspectionRepairFormRequest /> },
      { path: '/joms/inspection/form/:id', element: <InspectionRepairForm /> },
      // Facility
      { path: '/joms/facilityvenue/form', element: <FacilityVenueFormRequest /> },
      { path: '/joms/facilityvenue/form/:id', element: <FacilityVenueForm /> },
      { path: '/joms/facilityvenue', element: <FacilityVenueList /> },
      // Vehicle
      { path: '/joms/vehicle/form', element: <VehicleSlipFormRequest /> },
      { path: '/joms/vehicle/form/:id', element: <VehicleSlipForm /> },
      { path: '/joms/vehicle', element: <VehicleSlipList /> },
    ]
  },
  // ---- Login ---- //
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      { path: "/joms/login", element: <Login /> },
      { path: '/login', element: <Navigate to="/joms/login" replace /> },
    ]
  },

  { path: '*', element: <FileNotFound /> },
];

const router = createBrowserRouter(routes);

export default router;
