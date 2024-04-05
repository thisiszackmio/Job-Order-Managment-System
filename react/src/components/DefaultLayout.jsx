import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { NavLink } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from "react-router-dom";
import { useUserStateContext } from '../context/ContextProvider'
import axiosClient from '../axios'

import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import TopNav from './TopNav';
import Sidebar from './SideBar';
import Footer from './Footer';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DefaultLayout() {

  return (
    <div className="min-h-full">
      <TopNav />
      <Sidebar />
      <Footer />
    </div>
  );
}
