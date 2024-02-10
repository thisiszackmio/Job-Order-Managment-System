import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import ForbiddenComponent from "../components/403";
import { Link, useParams } from "react-router-dom";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import { useUserStateContext } from "../context/ContextProvider";

export default function MyRequestForRepairInspection(){

  const { currentUser, userRole } = useUserStateContext();
  const {id} = useParams();


  //Restrict
  const Users = currentUser.id == id || userRole == 'hackers';

  return Users ? (
  <PageComponent title="Facility / Venue Form">

  </PageComponent>
  ):(
  <ForbiddenComponent />
  );
}