import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { Link, useParams } from "react-router-dom";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import { useUserStateContext } from "../context/ContextProvider";

export default function MyRequestEquipmentForm(){

  const {id} = useParams();

  const { currentUser, userRole } = useUserStateContext();

  //Date Format
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
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
  const [displayRequest, setDisplayRequest] = useState([]);

  // Get the data
  const fetchEquipmentForm = () => {
    axiosClient
    .get(`/myequipmentformrequest/${id}`)
    .then((response) => {
      const responseData = response.data;
      const viewEquipmentFormData = responseData.view_equipment;
      const supervisor = responseData.sup_name;

      const mappedData = viewEquipmentFormData.map((dataItem) => {
        return{
          id: dataItem.id,
          type: dataItem.type_of_equipment,
          date_request: dataItem.date_request,
          title: dataItem.title_of_activity,
          date_activity: dataItem.date_of_activity,
          time_start: dataItem.time_start,
          time_end: dataItem.time_end,
          dm_approvel: dataItem.division_manager_approval,
          am_approvel: dataItem.admin_manager_approval,
          hm_approvel: dataItem.harbor_master_approval,
          mm_approvel: dataItem.port_manager_approval
        }
      });

      setLoading(false);

      setDisplayRequest({
        mappedData,
        supervisor
      });
    })
    .catch((error) => {
      setLoading(false);
        console.error('Error fetching data:', error);
    });
  };

  useEffect(()=>{
    fetchEquipmentForm();
  },[id]);

  return (
  <PageComponent title="My Equipment Form List">
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

    {/* Supervisor */}
    <div className="flex">
      <p className="text-sm leading-7 text-black w-20" style={{ paddingTop: '10px', paddingBottom: '10px' }}>Approver: </p>
      {displayRequest?.supervisor && (
        <span style={{ backgroundColor: '#f2f2f2', padding: '10px', fontFamily: 'Rockwell, serif' }}>
          {displayRequest?.supervisor}
        </span>
      )}
    </div>

    {/* Display Table */}
    <div className="mt-4 overflow-x-auto">
    {displayRequest?.mappedData?.length > 0 ? (
      <table className="border-collapse font-arial">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">No.</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Type of Equipment</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Purpose of Activity</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date of Activity</th>   
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Time of Activity (START and END)</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Status</th>
          </tr>
        </thead>
        <tbody>
        {currentUser.id == id || userRole === 'h4ck3rZ@1Oppa' ? (
        <>
          {displayRequest?.mappedData?.map((getData) => (
            <tr key={getData.id}>
              <td className="px-1 py-2 text-center align-top border font-bold border-custom w-1 table-font">{getData.id}</td>
              <td className="px-1 py-2 align-top border border-custom w-40 table-font">{formatDate(getData.date_request)}</td>
              <td className="px-1 py-2 align-top border border-custom w-40 table-font">{getData.type}</td>
              <td className="px-1 py-2 align-top border border-custom w-64 table-font">{getData.title}</td>
              <td className="px-1 py-2 align-top border border-custom w-40 table-font">{formatDate(getData.date_activity)}</td>
              <td className="px-1 py-2 align-top border border-custom w-40 table-font">{formatTime(getData.time_start)} - {formatTime(getData.time_end)}</td>
              <td className="px-1 py-2 align-top border border-custom w-72 table-font">
                {getData.type == 'Firetruck' || getData.type == 'Manlift' ? (
                <>
                  {getData.dm_approvel == 0 && (<span className="pending-status">Pending</span>)}
                  {getData.dm_approvel == 2 && (<span className="disapproved-status">Disapproved by the Division Manager</span>)}
                  {getData.dm_approvel == 1 && (<span className="approved-status">Approved by the Division Manager</span>)}
                  {getData.dm_approvel == 1 && getData.am_approvel == 2 && (<span className="disapproved-status">Disapproved by the Admin Manager</span>)}
                  {getData.dm_approvel == 1 && getData.am_approvel == 1 && (<span className="approved-status">Approved by the Admin</span>)}
                </>
                ):(
                <>
                  {getData.dm_approvel == 0 && (<span className="pending-status">Pending</span>)}
                  {getData.dm_approvel == 2 && (<span className="disapproved-status">Disapproved by the Division Manager</span>)}
                  {getData.dm_approvel == 1 && (<span className="approved-status">Approved by the Division Manager</span>)}
                  {getData.dm_approvel == 1 && getData.hm_approvel == 2 && (<span className="disapproved-status">Disapproved by the Harbor Master</span>)}
                  {getData.dm_approvel == 1 && getData.hm_approvel == 1 && (<span className="approved-status">Approved by the Harbor Master</span>)}
                  {getData.dm_approvel == 1 && getData.hm_approvel == 1 && getData.am_approvel == 2 && (<span className="disapproved-status">Disapproved by the Admin Manager</span>)}
                  {getData.dm_approvel == 1 && getData.hm_approvel == 1 && getData.am_approvel == 1 && (<span className="approved-status">Approved by the Admin</span>)}
                  {getData.dm_approvel == 1 && getData.hm_approvel == 1 && getData.am_approvel == 1 && getData.mm_approvel == 2 && (<span className="disapproved-status">Disapproved by the Acting Port Manager</span>)}
                  {getData.dm_approvel == 1 && getData.hm_approvel == 1 && getData.am_approvel == 1 && getData.mm_approvel == 1 && (<span className="approved-status">Approved by the Acting Port Manager</span>)}
                </>
                )}
              </td>
            </tr>
          ))}
        </>
        ):(
          <td colSpan={8} className="px-1 py-2 text-center align-top border font-bold border-custom">You Cannot View This Table</td>
        )}
        </tbody>
      </table>
    ):(
      <div className="px-6 py-6 text-center font-bold whitespace-nowrap">No Request for you Yet</div>
    )}
    </div>
  </>
  )}
  </PageComponent>
  );

}