import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Protected Route
import ProtectedRoute from './components/protectedRoute';

// Layout
import JLMSLayout from './components/JLMSLayout';
import GuestLayout from './components/guestLayout';
import MainLayout from './components/mainLayout';
import TopNav from './layout/topnav';
import Sidebar from './layout/sidebar';
import Footer from './layout/footer';

// Landing Page
import JLMS from './views/jlmsLp';
import Login from './views/login';

// Pages
import Dashboard from './views/dashboard';
import Profile from './views/profile';
import MyRequest from './views/myrequest';
import PendingRequests from './views/pending';
import VehicleDetails from './views/vehicleDetails';
import SystemSettings from './views/Settings/systemSettings';
import UserDetails from './views/Users/userDetails';
import UserList from './views/Users/userList';
import UserRegistration from './views/Users/userRegistration';
import Announcement from './views/Settings/announcements';
import Logs from './views/Settings/logs';


// Form
import InspectionRequest from './views/Inspection/inspectionRequest';
import InspectionForm from './views/Inspection/inspectionForm';
import InspectionList from './views/Inspection/inspectionList';
import FacilityRequest from './views/FacilityVenue/facilityRequest';
import FacilityForm from './views/FacilityVenue/facilityForm';
import FacilityList from './views/FacilityVenue/facilityList';
import VehicleRequest from './views/Vehicle/vehicleRequest';
import VehicleForm from './views/Vehicle/vehicleForm';
import VehicleList from './views/Vehicle/vehicleList';
import LocatorRequest from './views/Locator/locatorRequest';
import LocatorForm from './views/Locator/locatorForm';
import LocatorList from './views/Locator/locatorList';

const routes = [
    // ---- Joint Local Management System (Open No need for the access) ---- //
    { path: '/', element: <JLMSLayout />,
        children: [
            { path: '/', element:  <JLMS /> }
        ]
    },
    // ---- Guest Layout (Open No need for the access) ---- //
    { path: '/', element: <GuestLayout />, 
        children: [
            { path: '/joms/login', element: <Login /> },
            { path: '/login', element: <Navigate to="/joms/login" replace /> }
        ] 
    },
    // ---- Main Layout (Open No need for the access) ---- //
    { path: '/', element: <ProtectedRoute><MainLayout /></ProtectedRoute>, 
        children: [
            { path: '/joms', element: <Navigate to="/joms/dashboard" /> },
            { path: '/joms/dashboard', element: <Dashboard /> },
            { path: '/joms/profile', element: <Profile /> },
            { path: '/joms/myrequest', element: <MyRequest /> },
            { path: '/joms/pending', element: <PendingRequests /> },
            // Settings
            { path: '/joms/settings', element: <SystemSettings /> },
            { path: '/joms/announcements', element: <Announcement /> },
            { path: '/joms/logs', element: <Logs /> },
            // Users
            { path: '/joms/users', element: <UserList /> },
            { path: '/joms/user/details', element: <UserDetails /> },
            { path: '/joms/user/registration', element: <UserRegistration /> },
            // Inspection Request
            { path: '/joms/inspection', element: <InspectionList /> },
            { path: '/joms/inspection/form', element: <InspectionRequest /> },
            { path: '/joms/inspection/form/:id', element: <InspectionForm /> },
            // Facility
            { path: '/joms/facility', element: <FacilityList /> },
            { path: '/joms/facility/form', element: <FacilityRequest /> },
            { path: '/joms/facility/form/:id', element: <FacilityForm /> },   
            // Vehicle
            { path: '/joms/vehicle', element: <VehicleList /> },
            { path: '/joms/vehicle/form', element: <VehicleRequest /> },
            { path: '/joms/vehicle/form/:id', element: <VehicleForm /> }, 
            // Locator
            { path: '/joms/locator', element: <LocatorList /> },
            { path: '/joms/locator/form', element: <LocatorRequest /> },
            { path: '/joms/locator/form/:id', element: <LocatorForm /> }, 
        ] 
    },
]

const router = createBrowserRouter(routes);

export default router;
