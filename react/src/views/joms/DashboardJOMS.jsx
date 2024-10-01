import PageComponent from "../../components/PageComponent";
import { useUserStateContext } from "../../context/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import loadingAnimation from '/ppa_logo_animationn_v4.gif';

export default function DashboardJOMS(){

  const { currentUserId } = useUserStateContext();

  // Loading
  const [loading, setLoading] = useState(true);

  // Variable
  const [inspectionForm, getInspectionForm] = useState([]);
  const [facilityForm, getFacilityForm] = useState([]);
  const [vehicleForm, getVehicleForm] = useState([]);

    // Disable the Scroll on Popup
    useEffect(() => {
    
      // Define the classes to be added/removed
      const loadingClass = 'loading-show';
  
      // Function to add the class to the body
      const addLoadingClass = () => document.body.classList.add(loadingClass);
  
      // Function to remove the class from the body
      const removeLoadingClass = () => document.body.classList.remove(loadingClass);
  
      // Add or remove the class based on showPopup state
      if(loading) {
        addLoadingClass();
      }
      else {
        removeLoadingClass();
      }
  
      // Cleanup function to remove the class when the component is unmounted or showPopup changes
      return () => {
        removeLoadingClass();
      };
    }, [loading]);

  //Get the data
  const fetchRequest = () => {
    axiosClient
    .get(`/jomsdashboard`)
    .then((response) => {
      const responseData = response.data;
      const InspectionForm = responseData.inspection_count;
      const FacilityForm = responseData.facility_count;
      const VehicleForm = responseData.vehicle_count;

      getInspectionForm(InspectionForm);
      getFacilityForm(FacilityForm);
      getVehicleForm(VehicleForm);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  // Get the useEffect
  useEffect(() => {
    if(currentUserId && currentUserId.id){
      fetchRequest();
    }
  }, [currentUserId]);

  return loading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src={loadingAnimation}
        alt="Your Company"
      />
      <span className="loading-text loading-animation">
      {Array.from("Loading...").map((char, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>{char}</span>
      ))}
      </span>
    </div>
  ):(
    <PageComponent title="Dashboard">
      <div className="font-roboto">
  
        {/* Request Form */}
        <div className="grid grid-cols-3 gap-4 mt-10">

          {/* For Repair */}
          <div className="col-span-1 ppa-widget">
            <div className="joms-dashboard-title"> Pre/Post Repair Inspection Form </div>
            <div className="joms-count">{inspectionForm}</div>
            <div className="joms-word-count">Total Count</div>
            <div className="ppa-system-link"> Request Form </div>
          </div>

          {/* For Facility */}
          <div className="col-span-1 ppa-widget">
            <div className="joms-dashboard-title"> Facility / Venue Form </div>
            <div className="joms-count">{facilityForm}</div>
            <div className="joms-word-count">Total Count</div>
            <div className="ppa-system-link"> Request Form </div>
          </div>

          {/* For Vehicle Slip */}
          <div className="col-span-1 ppa-widget">
            <div className="joms-dashboard-title"> Vehicle Slip </div>
            <div className="joms-count">{vehicleForm}</div>
            <div className="joms-word-count">Total Count</div>
            <div className="ppa-system-link"> Request Slip </div>
          </div>

        </div>

      </div>
    </PageComponent>
  );
}