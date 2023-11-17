import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from "react-router-dom";
import loadingAnimation from '../assets/loading.gif';

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

  const [activeTab, setActiveTab] = useState("tab1");
  
  library.add(faEye);
  const [loading, setLoading] = useState(true);

  //Get all the Request on a specific user
  const fetchInspectForm = () => {
    axiosClient
    .get(`/myinspecreq/${id}`)
    .then((response) => {
        const responseData = response.data;
        const viewRequestData = responseData.view_request;
        const viewInspectorData = responseData.inspector;

        const mappedData = viewRequestData.map((dataItem) => {
          return{
            id: dataItem.id,
            date_of_request: dataItem.date_of_request,
            property_number: dataItem.property_number,
            acq_date: dataItem.acq_date,
            acq_cost: dataItem.acq_cost,
            brand_model: dataItem.brand_model,
            serial_engine_no: dataItem.serial_engine_no,
            type_of_property: dataItem.type_of_property,
            property_other_specific: dataItem.property_other_specific,
            property_description: dataItem.property_description,
            location: dataItem.location,
            complain: dataItem.complain,
            supervisor_approval: dataItem.supervisor_approval,
            admin_approval: dataItem.admin_approval,
            remarks: dataItem.remarks
          }
        });

        const inspectData = viewInspectorData.map((inspect) => {
          return{
            close: inspect.close
          }
        });

        setDisplayRequest({
          mappedData: mappedData,
          inspectData: inspectData
        });

        setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
        console.error('Error fetching data:', error);
    });
  }

  const fetchFacilityForm = () =>{
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
    fetchInspectForm();
    fetchFacilityForm();
  },[id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  return(
    <PageComponent title="My Request List">
    {/* {currentUser.fname} */}

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
        Request for Repair Inspection
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
        Request for use of Facility/Venue
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
        Request for Vehicle Slip
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
        Request for use of Manlift
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
      {activeTab === "tab1" && 
      <div>
        {loading ? (
        <div className="flex items-center justify-center">
          <img src={loadingAnimation} alt="Loading" className="h-10 w-10" />
          <span className="ml-2">Loading My Request List...</span>
        </div>
        ):(
        <div className="overflow-x-auto">
          <table className="border-collapse w-full mb-10">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Control No</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Date</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Property No</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Type of Property</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Complain</th> 
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Remarks</th>  
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayRequest.mappedData.length > 0 ? (
              displayRequest.mappedData.map((getData) => (
                <tr key={getData.id}>
                  <td className="px-2 py-4 w-3 text-center border-2 border-custom">{getData.id}</td>
                  <td className="px-6 py-4 text-center border-2 border-custom">{formatDate(getData.date_of_request)}</td>
                  <td className="px-6 py-4 text-center border-2 border-custom">{getData.property_number}</td>
                  {getData.type_of_property === "Others" ? (
                    <td className="px-6 py-4 text-center border-2 border-custom">Others: <i>{getData.property_other_specific}</i></td>
                  ):(
                    <td className="px-6 py-4 text-center border-2 border-custom">{getData.type_of_property}</td>
                  )}
                  <td className="px-6 py-4 text-center border-2 border-custom">{getData.complain}</td>
                  <td className="px-6 py-4 text-center border-2 w-66 border-custom">{getData.remarks}</td>
                  <td className="px-6 py-4 text-center border-2 border-custom">
                  {getData.remarks === "The Request has been close you can view it now" ? (
                  <div className="flex justify-center">
                    <Link to={`/repairinspectionform/${getData.id}`}>
                      <button 
                        className="bg-green-500 hover-bg-green-700 text-white font-bold py-2 px-2 rounded"
                        title="View Request"
                      >
                        <FontAwesomeIcon icon="eye" className="mr-0" />
                      </button>
                    </Link>
                  </div>
                  ): null }            
                  </td>
                </tr>
              ))
              ):(
              <tr>
                <td colSpan="10" className="px-6 py-4 text-center whitespace-nowrap">No Request</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>
      }

      {/* Request For The Use Of Facility / Venue */}
      {activeTab === "tab2" && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center">
              <img src={loadingAnimation} alt="Loading" className="h-10 w-10" />
              <span className="ml-2">Loading My Request List...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="border-collapse w-full mb-10">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Control No</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Date</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Title/Purpose of Activity</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Date and Time of Activity (Start)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Date and Time of Activity (End)</th> 
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Type of Facility/Venue</th>  
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRequestFacility.mappedData.length > 0 ? (
                    displayRequestFacility.mappedData.map((getData) => (
                      <tr key={getData.id}>
                        <td className="px-2 py-4 w-3 text-center border-2 border-custom">{getData.id}</td>
                        <td className="px-2 py-4 text-center border-2 border-custom">{formatDate(getData.date_requested)}</td>
                        <td className="px-2 py-4 text-center border-2 border-custom">{getData.title_of_activity}</td>
                        <td className="px-2 py-4 w-40 text-center border-2 border-custom">{formatDate(getData.date_start)} @ {formatTime(getData.time_start)}</td>
                        <td className="px-2 py-4 w-40 text-center border-2 border-custom">{formatDate(getData.date_end)} @ {formatTime(getData.time_end)}</td>
                        <td className="px-2 py-4 w-10 text-center border-2 border-custom">
                          {getData.mph === "1" && getData.conference === "0" && getData.dorm === "0" && getData.other === "0" ? ("MPH"):
                          getData.mph === "0" && getData.conference === "1" && getData.dorm === "0" && getData.other === "0" ? ("Conference Room"):
                          getData.mph === "0" && getData.conference === "0" && getData.dorm === "1" && getData.other === "0" ? ("Dormitory"):
                          getData.mph === "0" && getData.conference === "0" && getData.dorm === "0" && getData.other === "1" ? ("Others"):
                          getData.mph === "1" && getData.conference === "1" && getData.dorm === "0" && getData.other === "0" ? ("MPH and Conference Room"):
                          getData.mph === "1" && getData.conference === "0" && getData.dorm === "1" && getData.other === "0" ? ("MPH and Dormitory"):
                          getData.mph === "1" && getData.conference === "0" && getData.dorm === "0" && getData.other === "1" ? ("MPH and Other"):
                          getData.mph === "0" && getData.conference === "1" && getData.dorm === "1" && getData.other === "0" ? ("Conference and Dormitory"):
                          getData.mph === "0" && getData.conference === "1" && getData.dorm === "0" && getData.other === "1" ? ("Conference and Other"):
                          getData.mph === "0" && getData.conference === "0" && getData.dorm === "1" && getData.other === "1" ? ("Dorm and Other"):  
                          null}
                        </td>
                        <td className="px-2 py-4 text-center border-2 border-custom">
                          {getData.admin_approval === 3 ? ("Pending"):
                          getData.admin_approval === 2 ? ("Waiting for Admin's Approval"):
                          getData.admin_approval === 1 ? ("Approved"):
                          null}
                        </td>
                        <td className="px-2 py-4 text-center border-2 border-custom">
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
                      <td colSpan="7" className="px-6 py-4 text-center whitespace-nowrap">No Request</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "tab3" && <div>Coming Soon</div>}
      {activeTab === "tab4" && <div>Coming Soon</div>}
      {activeTab === "tab5" && <div>Coming Soon</div>}
    </div>

    </PageComponent>
  );
}