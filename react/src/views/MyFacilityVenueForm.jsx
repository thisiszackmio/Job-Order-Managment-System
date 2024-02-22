import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useParams } from "react-router-dom";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import { useUserStateContext } from "../context/ContextProvider";

export default function MyRequestForRepairInspection(){

  const { currentUser } = useUserStateContext();
  const {id} = useParams();

  //Date Format
  function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  //Time Format
  function formatTime(timeString) {
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

  const [loading, setLoading] = useState(true);
  const[displayRequestFacility, setDisplayRequestFacility] = useState([]);

  //Get all the Request on the Facility
  const fetchFacilityForm = () => {
    axiosClient
    .get(`/myfacilityformrequest/${id}`)
    .then((response) => {
        const responseData = response.data;
        const viewFacilityData = responseData.view_facility;

        const mappedData = viewFacilityData.map((dataItem) => {
          return{
            id: dataItem.id,
            date_requested: dataItem.date_requested,
            request_office: dataItem.request_office,
            title_of_activity: dataItem.title_of_activity,
            date_start: dataItem.date_start,
            time_start: dataItem.time_start,
            date_end: dataItem.date_end,
            time_end: dataItem.time_end,
            mph: dataItem.mph,
            conference: dataItem.conference,
            dorm: dataItem.dorm,
            other: dataItem.other,
            admin_approval: dataItem.admin_approval,
            remarks: dataItem.remarks
          }
        });

        setDisplayRequestFacility({
          mappedData: mappedData
        });

        setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
        console.error('Error fetching data:', error);
    });
  }

  useEffect(()=>{
    fetchFacilityForm();
  },[id]);

  //Restrict
  const Users = currentUser.id == id || currentUser.code_clearance == 10;

  return Users ? (
  <PageComponent title="Facility / Venue Form">
  {loading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src={loadingAnimation}
        alt="Your Company"
      />
      <span className="ml-2 animate-heartbeat">Loading My Request List</span>
    </div>
  ):(
  <>
    {/* Display Table */}
    <div className="mt-4 max-w-full">
      <table className="border-collapse w-full">
        <thead>
        {displayRequestFacility.mappedData.length > 0 ? (
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Title/Purpose of Activity</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date and Time of Activity (Start to End)</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Type of Facility/Venue</th>  
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Status</th>
          </tr>
        ):null}
        </thead>
        <tbody>
        {displayRequestFacility.mappedData.length > 0 ? (
          displayRequestFacility.mappedData.map((getData) => (
            <tr key={getData.id}>
              <td className="px-2 py-1 text-center border border-custom w-1/5">{formatDate(getData.date_requested)}</td>
              <td className="px-2 py-1 text-center border border-custom w-1/5">{getData.title_of_activity}</td>
              <td className="px-2 py-1 text-center border border-custom w-1/5">
              {getData.date_start === getData.date_end ? (
                `${formatDate(getData.date_start)} @ ${formatTime(getData.time_start)} to ${formatTime(getData.time_end)}`
              ) : (
                `${formatDate(getData.date_start)} @ ${formatTime(getData.time_start)} to ${formatDate(getData.date_end)} @ ${formatTime(getData.time_end)}`
              )}
              </td>
              <td className="px-0 py-1 w-10 text-center border border-custom w-1/5">
                {getData.mph == 1 ? (<p>MPH</p>):null}
                {getData.conference == 1 ? (<p>Conference Room</p>):null}
                {getData.dorm == 1 ? (<p>Dormitory</p>):null}
                {getData.other == 1 ? (<p>Other</p>):null}
              </td>
              <td className="px-2 py-1 text-center border border-custom w-1/5">
                {getData.remarks == "Approved" && (<span className="approved-status">{getData.remarks}</span>)}
                {getData.remarks == "Disapproved" && (<span className="disapproved-status">{getData.remarks}</span>)}
                {getData.remarks == "Pending" && (<span className="pending-status">{getData.remarks}</span>)}
                {getData.remarks == "Closed" && (
                  <>
                  <div className="flex justify-center">
                    <span className="approved-status">Approved</span> 
                    <span className="done-status ml-1">{getData.remarks}</span>
                  </div>
                  </>
                )}
              </td>
            </tr>
          ))
        ):(
          <tr>
            <div className="px-6 py-6 text-center font-bold whitespace-nowrap">No Request for you Yet</div>
          </tr>
        )}
        </tbody>
      </table>
      <div className="text-right text-sm/[17px]">
        {displayRequestFacility.mappedData.length > 0 ? (
        <i>Total of <b> {displayRequestFacility.mappedData.length} </b> Facility / Venue Request</i>
        ):null}
      </div>
    </div>
  </>
  )}
  </PageComponent>
  ):(
    (() => {
      window.location = '/forbidden';
      return null; // Return null to avoid any unexpected rendering
    })()
  );
}