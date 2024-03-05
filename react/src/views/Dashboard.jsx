import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye  } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

// Function to format the date as "Month Day, Year"
function formatDate(dateString) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// To refrain return null on reloading the page
const storedUserData = JSON.parse(localStorage.getItem('USER'));

export default function Dashboard()
{
  library.add( faEye);
  const [isLoading , setLoading] = useState(false);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  return(
    <PageComponent title={`${getTimeOfDay()}! User`}>

    {isLoading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src="ppa_logo_animationn_v4.gif"
        alt="Your Company"
      />
      <span className="ml-2 animate-heartbeat">Loading Dashboard</span>
    </div>
    ):(
    <>
    
    </>
    )}
    
    </PageComponent>
  )
}