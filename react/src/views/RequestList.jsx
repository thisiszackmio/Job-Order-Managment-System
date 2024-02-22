import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTimes, faEye, faStickyNote  } from '@fortawesome/free-solid-svg-icons';
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import ReactPaginate from "react-paginate";

// Function to format the date as "Month Day, Year"
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatDateAct(dateString) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatTimeAct(timeString) {
  const [hours, minutes, seconds] = timeString.split(':');
  let amOrPm = 'am';
  let formattedHours = parseInt(hours, 10);

  if (formattedHours >= 12) {
    amOrPm = 'pm';
    if (formattedHours > 12) {
      formattedHours -= 12;
    }
  }

  const formattedTime = `${formattedHours}:${minutes}${amOrPm}`;
  return formattedTime;
}

export default function RequestList()
{
  library.add(faCheck, faTimes, faEye, faStickyNote);

  const [activeTab, setActiveTab] = useState("tab1");

  const [loading, setLoading] = useState(true);

  const { userRole } = useUserStateContext();
  const [getVehicleSlip, setVehicleSlip] = useState([]);
 
  useEffect(() => { 
    fetchTableData(); 
    fetchFacilityData();
    fetchVehicleData();
  }, []);

  //Search Filter and Pagination
  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset page when searching
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return(
    <PageComponent title="Request List">
    {userRole === "admin" ?(
    <>
    {loading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src={loadingAnimation}
        alt="Your Company"
      />
      <span className="ml-2 animate-heartbeat">Loading Request List</span>
    </div>
    ):(
      <>

      <div className="mt-4">

      {/* Vehicle Slip Request List */}


      {activeTab === "tab4" && <div className="text-center">Coming Soon</div>}
      {activeTab === "tab5" && <div className="text-center">Coming Soon</div>}

      </div>
      </>
    )}
    </>
    ):(
      <div>Access Denied. Only admins can view this page.</div>
    )}
    </PageComponent>
  )
}