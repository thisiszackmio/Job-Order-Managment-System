import PageComponent from "../../components/PageComponent";
import { useUserStateContext } from "../../context/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import loadingAnimation from '/default/ppa_logo_animationn_v4.gif';
import loading_table from "/default/ring-loading.gif";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from '@fortawesome/free-solid-svg-icons';

export default function DashboardJOMS(){

  const { currentUserId, userCode } = useUserStateContext();

  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const roles = ["AM", "GSO", "DM", "PM", "AP", "AU"];
  const accessOnly = roles.some(role => codes.includes(role));

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Loading
  const [loading, setLoading] = useState(true);
  const [loadingArea, setLoadingArea] = useState(true);

  // Variable
  const [inspectionForm, getInspectionForm] = useState([]);
  const [facilityForm, getFacilityForm] = useState([]);
  const [vehicleForm, getVehicleForm] = useState([]);
  const [pending, getPending] = useState([]);
  const [pendingApproval, getPendingApproval] = useState([]);

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

  // Set Delay for Loading
  useEffect(() => {
    // Simulate an authentication check
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

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
      setLoadingArea(false);
    });
  }

  // Get Pending Request
  const fetchPending = () => {
    axiosClient
    .get(`/pendingrequest/${currentUserId.id}`)
    .then((response) => {
      const responseData = response.data;
      const PendingRemarks = responseData.pending_requests;

      //console.log(PendingRemarks);
      getPending({PendingRemarks});
    })
    .finally(() => {
      setLoadingArea(false);
    });
  }

  // Get Pending Approval
  const fetchApprove = () => {
    axiosClient
    .get(`/jomspendingapproval/${currentUserId.id}`)
    .then((response) => {
      const responseData = response.data;
      const PendingApproval = responseData.pending_approved;

      //console.log(PendingApproval);
      getPendingApproval({PendingApproval});
    })
    .finally(() => {
      setLoadingArea(false);
    });
  }

  // Get the useEffect
  useEffect(() => {
    if(currentUserId && currentUserId.id){
      fetchRequest();
      fetchPending();
      fetchApprove();
    }
  }, [currentUserId]);

  return (
    <PageComponent title="JOMS Dashboard">

      {/* Preload Screen */}
      {loading && (
        <div className="pre-loading-screen z-50">
          <img className="mx-auto h-44 w-auto" src={loadingAnimation} alt="Your Company" />
          <span className="loading-text loading-animation">
          {Array.from("Loading...").map((char, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>{char}</span>
          ))}
          </span>
        </div>
      )}

      {/* Main */}
      <div className="font-roboto">
  
        {/* Request Form */}
        <div className="grid grid-cols-3 gap-4 mt-10">

          {/* For Repair */}
          <div className="col-span-1 ppa-widget relative">
            <div className="joms-dashboard-title"> Pre/Post Repair Inspection Form </div>
            {loadingArea ? (
              <div className="flex justify-center items-center py-4">
                <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                <span className="loading-table">Loading</span>
              </div>
            ):(
            <>
              <img className="mx-auto joms-icons" src="/default/technician-unscreen.gif" alt="Your Company"/>
              <div className="joms-count">{inspectionForm}</div>
              <div className="joms-word-count">Total Count</div>
            </>
            )}
            <Link to={`/joms/inspection/form`}> <div className="ppa-system-link"> Go to Request Form  </div> </Link>
          </div>

          {/* For Facility */}
          <div className="col-span-1 ppa-widget relative">
            <div className="joms-dashboard-title"> Facility / Venue Form </div>
            {loadingArea ? (
              <div className="flex justify-center items-center py-4">
                <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                <span className="loading-table">Loading</span>
              </div>
            ):(
            <>
              <img className="mx-auto joms-icons" src="/default/form-unscreen.gif" alt="Your Company"/>
              <div className="joms-count">{facilityForm}</div>
              <div className="joms-word-count">Total Count</div>
            </>
            )}
            <Link to={`/joms/facilityvenue/form`}> <div className="ppa-system-link"> Go to Request Form </div> </Link>
          </div>

          {/* For Vehicle Slip */}
          <div className="col-span-1 ppa-widget relative">
            <div className="joms-dashboard-title"> Vehicle Slip </div>
            {loadingArea ? (
              <div className="flex justify-center items-center py-4">
                <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                <span className="loading-table">Loading</span>
              </div>
            ):(
            <>
              <img className="mx-auto joms-icons" src="/default/formother-unscreen.gif" alt="Your Company"/>
              <div className="joms-count">{vehicleForm}</div>
              <div className="joms-word-count">Total Count</div>
            </>
            )}
            <Link to={`/joms/vehicle/form`}> <div className="ppa-system-link"> Go to Request Form </div></Link> 
          </div>

        </div>

        {/* Pending Forms */}
        {accessOnly && (
          <div className="ppa-widget mt-10">
            <div className="ppa-widget-title">Pending Form</div>
            <div className="ppa-div-table" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table className="ppa-table w-full mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-1 py-1 w-5 text-center text-xs font-medium text-gray-600 uppercase">Ctrl No</th>
                    <th className="px-1 py-1 w-auto text-center text-xs font-medium text-gray-600 uppercase">Type of Request</th>
                    <th className="px-1 py-1 w-auto text-center text-xs font-medium text-gray-600 uppercase">Date Request</th>
                    <th className="px-1 py-1 w-auto text-center text-xs font-medium text-gray-600 uppercase">Requestor</th>
                    <th className="px-1 py-1 w-auto text-center text-xs font-medium text-gray-600 uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: '#fff' }}>
                  {(loadingArea || pendingApproval?.PendingApproval === undefined) ? (
                    <tr>
                      <td colSpan={5} className="px-1 py-3 text-base text-center border-0 border-custom">
                        <div className="flex justify-center items-center">
                          <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                          <span className="loading-table">Loading Request</span>
                        </div>
                      </td>
                    </tr>
                  ):(
                    pendingApproval?.PendingApproval?.length > 0 ? (
                      pendingApproval?.PendingApproval?.map((list) => (
                        <tr key={list.id}>
                          <td className="px-1 py-3 text-center font-bold table-font text-base">
                            <Link 
                              to={
                                list.type === "Pre/Post Repair Inspection Form"
                                  ? `/joms/inspection/form/${list.id}`
                                  : list.type === "Facility / Venue Form"
                                  ? `/joms/facilityvenue/form/${list.id}`
                                  : `/joms/vehicle/form/${list.id}`
                              }
                              className="group flex justify-center items-center"
                            >
                              {/* Initially show the ID */}
                              <span className="group-hover:hidden">{list.id}</span>
                              
                              {/* Show the View Icon on hover */}
                              <span className="hidden group-hover:inline-flex items-center">
                                <FontAwesomeIcon icon={faEye} />
                              </span>
                            </Link>
                          </td>
                          <td className="px-1 py-3 text-center table-font text-base">{list.type}</td>
                          <td className="px-1 py-3 text-center table-font text-base">{formatDate(list?.date_request)}</td>
                          <td className="px-1 py-3 text-center table-font text-base">{list?.requestor}</td>
                          <td className="px-1 py-3 text-center table-font text-base">{list?.remarks}</td>
                        </tr>
                      ))
                    ):(
                      <tr>
                        <td colSpan={5} className="px-1 py-3 text-base text-center border-0 border-custom"> No Pending Form </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pending Request */}
        <div className="ppa-widget mt-10">
          <div className="ppa-widget-title">Pending Request</div>
          <div className="ppa-div-table" style={{ maxHeight: '250px', overflowY: 'auto' }}>
            <table className="ppa-table w-full mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-1 py-1 w-5 text-center text-xs font-medium text-gray-600 uppercase">Ctrl No</th>
                  <th className="px-1 py-1 w-18 text-center text-xs font-medium text-gray-600 uppercase">Type of Request</th>
                  <th className="px-1 py-1 w-18 text-center text-xs font-medium text-gray-600 uppercase">Date Request</th>
                  <th className="px-1 py-1 w-2/4 text-center text-xs font-medium text-gray-600 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#fff' }}>
                {(loadingArea || pending?.PendingRemarks === undefined) ? (
                  <tr>
                    <td colSpan={4} className="px-1 py-3 text-base text-center border-0 border-custom">
                      <div className="flex justify-center items-center">
                        <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                        <span className="loading-table">Loading Request</span>
                      </div>
                    </td>
                  </tr>
                ):pending?.PendingRemarks?.length > 0 ? (
                  pending?.PendingRemarks?.map((list) => (
                    <tr key={list.id}>
                      <td className="px-1 py-3 text-center font-bold table-font text-base">
                        <Link 
                          to={
                            list.type === "Pre/Post Repair Inspection Form"
                              ? `/joms/inspection/form/${list.id}`
                              : list.type === "Facility / Venue Form"
                              ? `/joms/facilityvenue/form/${list.id}`
                              : `/joms/vehicle/form/${list.id}`
                          }
                          className="group flex justify-center items-center"
                        >
                          {/* Initially show the ID */}
                          <span className="group-hover:hidden">{list.id}</span>
                          
                          {/* Show the View Icon on hover */}
                          <span className="hidden group-hover:inline-flex items-center">
                            <FontAwesomeIcon icon={faEye} />
                          </span>
                        </Link>
                      </td>
                      <td className="px-1 py-3 text-center table-font text-base">{list?.type}</td>
                      <td className="px-1 py-3 text-center table-font text-base">{formatDate(list?.date_request)}</td>
                      <td className="px-1 py-3 text-center table-font text-base">{list?.remarks}</td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={4} className="px-1 py-3 text-base text-center border-0 border-custom"> No Pending Request </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </PageComponent>
  )
}