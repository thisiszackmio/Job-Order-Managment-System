import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layout
import ProtectedRoute from './components/ProtectedRoute';
import JLMSLayout from './components/JLMSLayout';
import JOMSLayout from './components/JOMSLayout';
import GuestLayout from './components/GuestLayout';

// JOMS
import DashboardJOMS from './views/sidebar/DashboardJOMS';
import SystemUpdate from './views/sidebar/SystemUpdate';
import MyRequest from './views/sidebar/MyRequestList';
import InspectionRepairFormRequest from './views/inspectionForm/InpectionFormRequest';
import InspectionRepairForm from './views/inspectionForm/InspectionForm';
import InspectionFormList from './views/inspectionForm/InspectionFormList';
import FacilityVenueFormRequest from './views/facilityForm/FacilityForRequest';
import FacilityVenueForm from './views/facilityForm/FacilityForm';
import FacilityVenueList from './views/facilityForm/FacilityFormList';
import VehicleSlipFormRequest from './views/vehicleSlip/VehicleSlipRequest';
import VehicleSlipForm from './views/vehicleSlip/VehicleSlip'; 
import VehicleSlipList from './views/vehicleSlip/VehicleSlipList';
import AddPersonnel from './views/sidebar/AddPersonnel';
import AddVehicleType from './views/sidebar/VehicleType';
import AllAnnouncements from './views/announcement/AllAnnounce';
import AddAnnouncements from './views/announcement/AddAnnounce';
import Logs from './views/settings/Logs';
import UserRegistrationJLMS from './views/settings/UserRegistration';
import UserListJLMS from './views/settings/UserList';
import UserDetailsJLMS from './views/settings/UserDetails';
import ViewUser from './views/ViewUser';
import PendingRequest from './views/sidebar/Pending';

import JLMS from './views/jlms';
import Login from './views/Login';
import Maintenance from './views/settings/Maintenance';
import FileNotFound from './components/404';

const routes = [

  // ---- Joint Local Management System (Open No need for the access) ---- //
  {
    path: '/',
    element: <JLMSLayout />,
    children: [
      { path: '/', element:  <JLMS /> }
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

  // ---- Job Order Management System ---- //
  {
    path: '/joms',
    element: <ProtectedRoute><JOMSLayout /></ProtectedRoute>,
    children: [
      // SideBar
      { path: '/joms', element: <Navigate to="/joms/dashboard" /> },
      { path: '/joms/dashboard', element: <DashboardJOMS /> },
      { path: '/joms/systemupdate', element:  <SystemUpdate /> },
      { path: '/joms/myrequest', element: <MyRequest /> },
      { path: '/joms/personnel', element: <AddPersonnel /> },
      { path: '/joms/vehicletype', element: <AddVehicleType /> },
      { path: '/joms/allannouncement', element: <AllAnnouncements /> },
      { path: '/joms/addannouncement', element: <AddAnnouncements /> },
      { path: '/joms/settings', element: <Maintenance /> },
      { path: '/joms/logs', element: <Logs /> },
      { path: '/joms/addemployee', element: <UserRegistrationJLMS /> },
      { path: '/joms/userlist', element: <UserListJLMS /> },
      { path: '/joms/userdetails/:id', element: <UserDetailsJLMS /> },
      { path: '/joms/user', element: <ViewUser /> },
      { path: '/joms/pending', element: <PendingRequest /> },
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

  { path: '*', element: <FileNotFound /> },

]

const router = createBrowserRouter(routes);

export default router;
