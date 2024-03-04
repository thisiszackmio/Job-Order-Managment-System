import axiosClient from "../axios";
import PageComponent from "../components/PageComponent";
import React, { useEffect, useState } from "react";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import submitAnimation from '../assets/loading_nobg.gif';
import { useParams, useNavigate } from "react-router-dom";
import { useUserStateContext } from "../context/ContextProvider";

export default function EquipmentForm(){

  const {id} = useParams();
  const { currentUser } = useUserStateContext();

  return (
  <PageComponent title="Request on Equipment Form">

  </PageComponent>
  );

}