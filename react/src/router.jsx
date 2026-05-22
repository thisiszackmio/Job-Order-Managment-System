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
import LocatorSlipForm from './views/locatorslip/LocatorSlip';
import TravelDetails from './views/TravelDetail';
// import AddPersonnel from './views/sidebar/AddPersonnel';
// import AddVehicleType from './views/sidebar/VehicleType';
import AllAnnouncements from './views/announcement/AllAnnounce';
import AddAnnouncements from './views/announcement/AddAnnounce';
import Logs from './views/settings/Logs';
import UserRegistrationJLMS from './views/settings/UserRegistration';
import UserListJLMS from './views/settings/UserList';
import UserDetailsJLMS from './views/settings/UserDetails';
import ViewUser from './views/ViewUser';
import PendingRequest from './views/sidebar/Pending';
import DateLogs from './views/DateLogs';
import QRScanner from './views/QRScanner';

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
      { path: '/joms', element: <Navigate to="/joms/dashboard" />, handle: { title: 'Dashboard' } },
      { path: '/joms/dashboard', element: <DashboardJOMS />, handle: { title: 'Dashboard' } },
      { path: '/joms/systemupdate', element:  <SystemUpdate /> },
      { path: '/joms/myrequest', element: <MyRequest />, handle: { title: 'My Request' } },
      { path: '/joms/traveldetails', element: <TravelDetails />, handle: { title: 'Personnel' } },
      // { path: '/joms/personnel', element: <AddPersonnel /> },
      // { path: '/joms/vehicletype', element: <AddVehicleType /> },
      { path: '/joms/allannouncement', element: <AllAnnouncements /> },
      { path: '/joms/addannouncement', element: <AddAnnouncements /> },
      { path: '/joms/settings', element: <Maintenance />, handle: { title: 'Settings' } },
      { path: '/joms/logs', element: <Logs />, handle: { title: 'Logs' } },
      { path: '/joms/addemployee', element: <UserRegistrationJLMS />, handle: { title: 'Users' } },
      { path: '/joms/userlist', element: <UserListJLMS />, handle: { title: 'Users' } },
      { path: '/joms/userdetails/:id', element: <UserDetailsJLMS />, handle: { title: 'Users' } },
      { path: '/joms/user', element: <ViewUser />, handle: { title: 'Users' } },
      { path: '/joms/pending', element: <PendingRequest />, handle: { title: 'Request' } },
      { path: '/joms/datelogs', element: <DateLogs />, handle: { title: 'Dashboard' } },
      // Inspection
      { path: '/joms/inspection', element: <InspectionFormList />, handle: { title: 'Form' } },
      { path: '/joms/inspection/form', element: <InspectionRepairFormRequest />, handle: { title: 'Form' } },
      { path: '/joms/inspection/form/:id', element: <InspectionRepairForm />, handle: { title: 'Form' } },
      // Facility
      { path: '/joms/facilityvenue/form', element: <FacilityVenueFormRequest />, handle: { title: 'Form' } },
      { path: '/joms/facilityvenue/form/:id', element: <FacilityVenueForm />, handle: { title: 'Form' } },
      { path: '/joms/facilityvenue', element: <FacilityVenueList />, handle: { title: 'Form' } },
      // Vehicle
      { path: '/joms/vehicle/form', element: <VehicleSlipFormRequest />, handle: { title: 'Form' } },
      { path: '/joms/vehicle/form/:id', element: <VehicleSlipForm />, handle: { title: 'Form' } },
      { path: '/joms/vehicle', element: <VehicleSlipList />, handle: { title: 'Form' } },
      // Locator
      { path: '/joms/locator/form', element: <LocatorSlipForm /> },
    ]
  },

  { path: '*', element: <FileNotFound />, handle: { title: 'Page Not Found' } },

]

const router = createBrowserRouter(routes);

export default router;
