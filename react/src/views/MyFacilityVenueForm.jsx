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

          const facilities = [];

          if (dataItem.mph == 1) {
            facilities.push("MPH");
          }
      
          if (dataItem.conference == 1) {
            facilities.push("Conference Room");
          }
      
          if (dataItem.dorm == 1) {
            facilities.push("Dormitory");
          }
      
          if (dataItem.other == 1) {
            facilities.push("Other");
          }

          const result = facilities.join(', ');

          return{
            id: dataItem.id,
            date_requested: dataItem.date_requested,
            request_office: dataItem.request_office,
            title_of_activity: dataItem.title_of_activity,
            date_start: dataItem.date_start,
            time_start: dataItem.time_start,
            date_end: dataItem.date_end,
            time_end: dataItem.time_end,
            facility: result,
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

  return (
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
          <tr className="bg-gray-100">
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">No.</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Title/Purpose of Activity</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date and Time of Activity (Start to End)</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Type of Facility/Venue</th>  
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Status</th>
          </tr>
        </thead>
        <tbody>
        {currentUser.id == id || userRole === 'h4ck3rZ@1Oppa' ? (
        <>
        {displayRequestFacility.mappedData.length > 0 ? (
          displayRequestFacility.mappedData.map((getData) => (
            <tr key={getData.id}>
              <td className="px-1 py-2 text-center align-top border font-bold border-custom w-1">{getData.id}</td>
              <td className="px-1 py-2 align-top border border-custom w-1">{formatDate(getData.date_requested)}</td>
              <td className="px-1 py-2 align-top border border-custom w-1/5">{getData.title_of_activity}</td>
              <td className="px-1 py-2 align-top border border-custom w-1/4">
              {getData.date_start === getData.date_end ? (
                `${formatDate(getData.date_start)} @ ${formatTime(getData.time_start)} to ${formatTime(getData.time_end)}`
              ) : (
                `${formatDate(getData.date_start)} @ ${formatTime(getData.time_start)} to ${formatDate(getData.date_end)} @ ${formatTime(getData.time_end)}`
              )}
              </td>
              <td className="px-1 py-2 w-10 align-top border border-custom w-1/5">
                {getData.facility}
              </td>
              <td className="px-1 py-2 align-top border border-custom w-1/5">
                {getData.remarks == "Approved" && (<span className="approved-status">{getData.remarks}</span>)}
                {getData.remarks == "Disapproved" && (<span className="disapproved-status">{getData.remarks}</span>)}
                {getData.remarks == "Pending" && (<span className="pending-status">{getData.remarks}</span>)}
                {getData.remarks == "Closed" && (<span className="finish-status">{getData.remarks}</span>)}
              </td>
            </tr>
          ))
        ):(
          <tr>
            <div className="px-6 py-6 text-center font-bold whitespace-nowrap">No Request for you Yet</div>
          </tr>
        )}
        </>
        ):(
          <td colSpan={12} className="px-1 py-2 text-center align-top border font-bold border-custom">You Cannot View This Table</td>
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
  );
}