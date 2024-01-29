import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from "react-router-dom";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';

export default function MyRequest(){
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

  const[displayRequest, setDisplayRequest] = useState([]);
  const[displayRequestFacility, setDisplayRequestFacility] = useState([]);
  const[displayRequestVehicle, setDisplayRequestVehicle] = useState([]);
  const[displayRequestEquipment, setDisplayRequestEquipment] = useState([]);

  const [activeTab, setActiveTab] = useState("tab1");
  
  library.add(faEye);
  const [loading, setLoading] = useState(true);

  

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

  //Get all the Request on the Vehicle Slip
  const fetchVehicleSlipForm = () => {
    axiosClient
    .get(`/myvehicleformrequest/${id}`)
    .then((response) => {
      const responseData = response.data;
      const viewVehicleSlipData = responseData.view_vehicle;
      const countPassengers = responseData.passenger_count;

      const mappedData = viewVehicleSlipData.map((dataItem, index) => {
        return{
          id: dataItem.id,
          date_requested: dataItem.date_of_request,
          purpose: dataItem.purpose,
          passengerCount: countPassengers[index].passengers_count,
          place_visit: dataItem.place_visited,
          date_arrival: dataItem.date_arrival,
          time_arrival: dataItem.time_arrival,
          vehicle_type: dataItem.vehicle_type,
          driver: dataItem.driver,
          remarks: dataItem.admin_approval
        }
      });

      setDisplayRequestVehicle({mappedData:mappedData});
    })
    .catch((error) => {
      setLoading(false);
        console.error('Error fetching data:', error);
    });
  }

  //Get all the Request on the Equipment
  const fetchEquipmentForm = () => {
    axiosClient
    .get(`/myequipmentformrequest/${id}`)
    .then((response) => {
      const responseData = response.data;
      const viewEquipmentFormData = responseData.view_equipment;
      
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

      setDisplayRequestEquipment({mappedData:mappedData});
    })
    .catch((error) => {
      setLoading(false);
        console.error('Error fetching data:', error);
    });
  }

  useEffect(()=>{
    fetchInspectForm();
    fetchFacilityForm();
    fetchVehicleSlipForm();
    fetchEquipmentForm();
  },[id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  return(
    <PageComponent title="My Request List">
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
      {/* Button Tabs */}
      <div className="flex">
        {/* Tab 1 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab1"
              ? "bg-gray-200 border-b-4 border-gray-800"
              : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab1")}
        >
          Request for Repair/Inspection
        </button>
        {/* Tab 2 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab2"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab2")}
        >
          Request for Facility/Venue
        </button>
        {/* Tab 3 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab3"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab3")}
        >
          Request for Vehicle
        </button>
        {/* Tab 4 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab4"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab4")}
        >
          Request for Equipment
        </button>
        {/* Tab 5 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab5"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab5")}
        >
          Other Request
        </button>
      </div>

      <div className="mt-4">

        {/* Pre-Repair/Post Repair Inspection Form */}

        {/* Request For The Use Of Facility / Venue */}
        {activeTab === "tab2" && (
          <div>
            <table className="border-collapse w-full">
              <thead>
              {displayRequestFacility.mappedData.length > 0 ? (
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Ctrl No</th>
                  <th className="px-4 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
                  <th className="px-4 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Title/Purpose of Activity</th>
                  <th className="px-4 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date and Time of Activity (Start)</th>
                  <th className="px-4 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date and Time of Activity (End)</th> 
                  <th className="px-4 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Type of Facility/Venue</th>  
                  <th className="px-4 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Status</th>
                  <th className="px-4 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Action</th>
                </tr>
              ):null}
              </thead>
              <tbody>
              {displayRequestFacility.mappedData.length > 0 ? (
                displayRequestFacility.mappedData.map((getData) => (
                  <tr key={getData.id}>
                    <td className="px-2 py-1 w-3 text-center border border-custom font-bold">{getData.id}</td>
                    <td className="px-2 py-1 text-center border border-custom">{formatDate(getData.date_requested)}</td>
                    <td className="px-2 py-1 text-center border border-custom">{getData.title_of_activity}</td>
                    <td className="px-2 py-1 w-40 text-center border border-custom">{formatDate(getData.date_start)} @ {formatTime(getData.time_start)}</td>
                    <td className="px-2 py-1 w-40 text-center border border-custom">{formatDate(getData.date_end)} @ {formatTime(getData.time_end)}</td>
                    <td className="px-0 py-1 w-10 text-center border border-custom">
                      {getData.mph !== "0" ? (<p>MPH</p>):null}
                      {getData.conference !== "0" ? (<p>Conference Room</p>):null}
                      {getData.dorm !== "0" ? (<p>Dormitory</p>):null}
                      {getData.other !== "0" ? (<p>Other</p>):null}
                    </td>
                    <td className="px-2 py-1 text-center border border-custom">
                      {getData.remarks}
                    </td>
                    <td className="px-2 py-1 text-center border border-custom">
                      <div className="flex justify-center">
                        <Link to={`/facilityvenueform/${getData.id}`}>
                          <button 
                            className="bg-green-500 hover-bg-green-700 text-white font-bold py-2 px-2 rounded"
                            title="View Request"
                          >
                            <FontAwesomeIcon icon="eye" className="mr-0" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-6 text-center font-bold whitespace-nowrap">No Request for Facility/Venue</td>
                </tr>
              )}
              </tbody>
            </table>
            <div className="text-right text-sm/[17px]">
            {displayRequestFacility.mappedData.length > 0 ? (
            <i>Total of <b> {displayRequestFacility.mappedData.length} </b> Pre/Post Repair Request</i>
            ):null}
            </div>
          </div>
        )}

        {/* Request For the Vehicle Slip */}
        {activeTab === "tab3" && (
          <div>
            <table className="border-collapse w-full">
              <thead>
                {displayRequestVehicle.mappedData.length > 0 ? (
                <tr className="bg-gray-100">
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border w-1 border-custom">Slip No</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Purpose</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Visited Place</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date/Time of Arrival</th>   
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Vehicle</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Driver</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">No of Passengers</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Status</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Action</th>
                </tr>
                ):null}
              </thead>
              <tbody>
              {displayRequestVehicle.mappedData.length > 0 ? (
                displayRequestVehicle.mappedData.map((getData) => (
                  <tr key={getData.id}>
                    <td className="px-1 py-1 text-center border border-custom w-1 font-bold">{getData.id}</td>
                    <td className="px-1 py-1 text-center border border-custom w-24">{formatDate(getData.date_requested)}</td>
                    <td className="px-1 py-1 text-center border border-custom">{getData.purpose}</td>
                    <td className="px-1 py-1 text-center border border-custom">{getData.place_visit}</td>
                    <td className="px-1 py-1 text-center border border-custom">{formatDate(getData.date_arrival)} @ {formatTime(getData.time_arrival)}</td>
                    <td className="px-1 py-1 text-center border border-custom">{getData.vehicle_type.split('=')?.[0]}({getData.vehicle_type.split('=')?.[1]} )</td>
                    <td className="px-1 py-1 text-center border border-custom">{getData.driver}</td>
                    <td className="px-1 py-1 text-center border border-custom">{getData.passengerCount}</td>
                    <td className="px-1 py-1 text-center border border-custom">{getData.remarks == 1 ? ("Approve"):getData.remarks == 2 ? ("Disapprove"):("Pending")}</td>
                    <td className="px-1 py-1 text-center border border-custom">
                    {getData.remarks == 1 || getData.remarks == 2 ?(
                      <div className="flex justify-center">
                        <Link to={`/vehicleslipform/${getData.id}`}>
                          <button 
                            className="bg-green-500 hover-bg-green-700 text-white font-bold py-1 px-2 rounded"
                            title="View Request"
                          >
                            <FontAwesomeIcon icon="eye" className="mr-0" />
                          </button>
                        </Link>
                      </div>
                    ):null}
                    </td>
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan="7" className="px-6 py-6 text-center font-bold whitespace-nowrap">No Request for yoou today</td>
                </tr>
              )}
              </tbody>
            </table>
            <div className="text-right text-sm/[17px]">
            {displayRequestVehicle.mappedData.length > 0 ? (
            <i>Total of <b> {displayRequestVehicle.mappedData.length} </b> Vehicle Slip Request</i>
            ):null}
            </div>
          </div>
        )}

        {/* Request For the Equipment Slip */}
        {activeTab === "tab4" && (
          <div>
            <table className="border-collapse w-full">
              <thead>
                {displayRequestEquipment?.mappedData?.length > 0 ? (
                <tr className="bg-gray-100">
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border w-1 border-custom">Ctrl No</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Type of Equipment</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Purpose of Activity</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date of Activity</th>   
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Time of Activity (START and END)</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Status</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Action</th>
                </tr>
                ):null}
              </thead>
              <tbody>
              {displayRequestEquipment?.mappedData?.length > 0 ? (
                displayRequestEquipment?.mappedData?.map((getDataE) => (
                  <tr key={getDataE.id}>
                    <td className="px-1 py-1 text-center border border-custom w-1 font-bold">{getDataE.id}</td>
                    <td className="px-1 py-1 text-center border border-custom">{formatDate(getDataE.date_request)}</td>
                    <td className="px-1 py-1 text-center border border-custom">{getDataE.type}</td>
                    <td className="px-1 py-1 text-center border border-custom">{getDataE.title}</td>
                    <td className="px-1 py-1 text-center border border-custom">{formatDate(getDataE.date_activity)}</td>
                    <td className="px-2 py-1 w-40 text-center border border-custom">{formatTime(getDataE.time_start)} - {formatTime(getDataE.time_end)}</td>
                    <td className="px-1 py-1 text-center border border-custom">
                    {getDataE.type != 'Rescue Boat' ? (
                      getDataE.dm_approvel == 0 && getDataE.am_approvel == 0 ? ("Pending Approval"):
                      getDataE.dm_approvel == 1 && getDataE.am_approvel == 0 ? ("Approved by your DM"):
                      getDataE.dm_approvel == 1 && getDataE.am_approvel == 1 ? ("Approved by the Admin"):null
                    ):("ako ni")}
                    </td>
                    <td className="px-1 py-1 text-center border border-custom">
                      <div className="flex justify-center">
                        <Link to={`/equipmentform/${getDataE.id}`}>
                          <button 
                            className="bg-green-500 hover-bg-green-700 text-white font-bold py-1 px-2 rounded"
                            title="View Request"
                          >
                            <FontAwesomeIcon icon="eye" className="mr-0" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan="7" className="px-6 py-6 text-center font-bold whitespace-nowrap">No Request for yoou today</td>
                </tr>
              )}
              </tbody>
              
            </table>
            <div className="text-right text-sm/[17px]">
            {displayRequestEquipment.mappedData.length > 0 ? (
            <i>Total of <b> {displayRequestEquipment.mappedData.length} </b> Pre/Post Repair Request</i>
            ):null}
            </div>
          </div>
        )}


        {activeTab === "tab5" && <div className="text-center">Coming Soon</div>}

      </div>

    </>
    )}
    </PageComponent>
  );
}