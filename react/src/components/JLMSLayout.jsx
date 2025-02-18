import { useEffect, useState } from "react";
import axiosClient from '../axios';
import { Link, Outlet } from "react-router-dom";
import ppaLogo from '/default/ppa_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBars, faSignOutAlt, faFileLines, faUserPlus, faChevronRight, faScroll } from '@fortawesome/free-solid-svg-icons';
import Footer from "./Footer";
import { useUserStateContext } from "../context/ContextProvider";
import { useNavigate } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function JLMSLayout() {
  const { currentUserId, currentUserName, currentUserAvatar, currentUserToken, currentUserCode } = useUserStateContext();

  return (
    <div className="w-full h-full font-roboto">
      {currentUserId}
    </div>
  );
}