import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import loading_table from "/default/ring-loading.gif";
import { useUserStateContext } from "../../context/ContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from '@fortawesome/free-solid-svg-icons';

export default function MyRequest(){

  const { currentUserId } = useUserStateContext();

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

  // Loading
  const [loading, setLoading] = useState(true);

  // Variable
  const [inspectionForm, getInspectionForm] = useState([]);
  const [facilityForm, getFacilityForm] = useState([]);
  const [vehicleForm, getVehicleForm] = useState([]);

  // Get the Data
  const fetchRequest = () => {
    axiosClient
    .get(`/jomsmyrequest/${currentUserId?.id}`)
    .then((response) => {
      const responseInspData = response.data.inspection;
      const responseFacData = response.data.facility;
      const responseVehData = response.data.vehicle;

      // Inspection
      const inspectionData = responseInspData ? 
      responseInspData.map((InspDet) => {
        return{
          id: InspDet.repair_id,
          date_request: formatDate(InspDet.repair_date_request),
          property_number: InspDet.repair_property_number,
          type: InspDet.repair_type,
          description: InspDet.repair_description,
          complain: InspDet.repair_complain,
          supervisor: InspDet.repair_supervisor_name,
          remarks: InspDet.repair_remarks,
        }
      })
      :null ;

      // Facility
      const facilityData = responseFacData ? 
      responseFacData.map((FacDet) => {
        const facilities = [];

        if(FacDet.mph == 1){ facilities.push("MPH"); }
        if(FacDet.conference == 1){ facilities.push("Conference Room"); }
        if(FacDet.dorm == 1){ facilities.push("Dormitory"); }
        if(FacDet.other == 1){ facilities.push("Other"); }

        const resultFacilities = facilities.join(', ');

        return{
          id: FacDet.fac_id,
          date_requested: formatDate(FacDet.fac_date_request),
          request_office: FacDet.fac_request_office,
          title_of_activity: FacDet.fac_title_of_activity,
          date_start: formatDate(FacDet.fac_date_start),
          time_start: formatTime(FacDet.fac_time_start),
          date_end: formatDate(FacDet.fac_date_end),
          time_end: formatTime(FacDet.fac_time_end),
          facility: resultFacilities,
          remarks: FacDet.fac_remarks
        }

      })
      :null;

      // Vehicle
      const vehicleData = responseVehData ? 
      responseVehData.map((VehData) =>{
        return{
          id: VehData.veh_id,
          date_request: formatDate(VehData.veh_date_req),
          purpose: VehData.veh_purpose,
          place: VehData.veh_place,
          date_arrival: formatDate(VehData.veh_date),
          time_arrival: formatTime(VehData.veh_time),
          vehicle: VehData.veh_vehicle ? VehData.veh_vehicle : "None",
          driver: VehData.veh_driver ? VehData.veh_driver : "None",
          no_passengers: VehData.veh_passengers,
          remarks: VehData.remarks,
        }
      })
      :null;

      getInspectionForm(inspectionData);
      getFacilityForm(facilityData);
      getVehicleForm(vehicleData);

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

  return(
    <PageComponent title="My Request List">

      {/* Post Repair Form */}
      <div className="font-roboto ppa-form-box bg-white">
        <div className="ppa-form-header"> Pre/Post Repair Inspection Form </div>

        {loading ? (
          <div className="flex justify-center items-center pt-2 pb-2">
            <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
            <span className="loading-table">Loading</span>
          </div>
        ):(
          <div className="p-2 ppa-div-table" style={{ maxHeight: '400px', overflowY: 'auto'}}>
            <table className="ppa-table w-full mb-10 mt-2"> 
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Ctrl ID</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date Request</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Property Number</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Type of Property</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Description</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Complain/Defect</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Approver</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#fff' }}>
                {inspectionForm && inspectionForm?.length > 0 ? (
                  inspectionForm.map((getInspData)=>(
                    <tr key={getInspData.id}>
                      <td className="px-2 py-2 text-lg font-bold text-center table-font">
                        <Link 
                          to={`/joms/vehicle/form/${getInspData.id}`} 
                          className="group flex justify-center items-center"
                        >
                          {/* Initially show the ID */}
                          <span className="group-hover:hidden">{getInspData.id}</span>
                          
                          {/* Show the View Icon on hover */}
                          <span className="hidden group-hover:inline-flex items-center">
                            <FontAwesomeIcon icon={faEye} />
                          </span>
                        </Link>
                      </td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getInspData.date_request}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getInspData.property_number ? getInspData.property_number : 'N/A'}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getInspData.type}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getInspData.description}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getInspData.complain}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getInspData.supervisor}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getInspData.remarks}</td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={8} className="px-2 py-2 text-center text-sm text-gray-600">
                      No records found.
                    </td>
                  </tr>
                )}
              
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Facility Form */}
      <div className="font-roboto ppa-form-box bg-white mt-6">
        <div className="ppa-form-header"> Facility / Venue Request Form </div>

        {loading ? (
          <div className="flex justify-center items-center pt-2 pb-2">
            <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
            <span className="loading-table">Loading</span>
          </div>
        ) : (
          <div className="p-2 ppa-div-table" style={{ maxHeight: '400px', overflowY: 'auto'}}>
            <table className="ppa-table w-full mb-10 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Ctrl ID</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date Request</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Request Office</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Activity</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Facility/Venue</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#fff' }}>
                {facilityForm && facilityForm.length > 0 ? (
                  facilityForm.map((getFacData) => (
                    <tr key={getFacData.id}>
                      <td className="px-2 py-2 text-lg font-bold text-center table-font">
                        <Link 
                          to={`/joms/vehicle/form/${getFacData.id}`} 
                          className="group flex justify-center items-center"
                        >
                          {/* Initially show the ID */}
                          <span className="group-hover:hidden">{getFacData.id}</span>
                          
                          {/* Show the View Icon on hover */}
                          <span className="hidden group-hover:inline-flex items-center">
                            <FontAwesomeIcon icon={faEye} />
                          </span>
                        </Link>
                      </td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getFacData.date_requested}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getFacData.request_office}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getFacData.title_of_activity}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">
                        {getFacData.date_start === getFacData.date_end ? (
                          `${getFacData.date_start} @ ${getFacData.time_start} to ${getFacData.time_end}`
                        ) : (
                          `${getFacData.date_start} @ ${getFacData.time_start} to ${getFacData.date_end} @ ${getFacData.time_end}`
                        )}
                      </td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getFacData.facility}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getFacData.remarks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-2 py-2 text-center text-sm text-gray-600">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vehicle Form */}
      <div className="font-roboto ppa-form-box bg-white mt-6">
        <div className="ppa-form-header"> Vehicle Slip </div>
        
        {loading ? (
          <div className="flex justify-center items-center pt-2 pb-2">
            <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
            <span className="loading-table">Loading</span>
          </div>
        ):(
          <div className="p-2 ppa-div-table" style={{ maxHeight: '400px', overflowY: 'auto'}}>
            <table className="ppa-table w-full mb-10 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Slip No</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date Request</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Purpose</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Place</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date and Time for Arrival</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Vehicle</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Driver</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">No of Passengers</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#fff' }}>
                {vehicleForm && vehicleForm?.length > 0 ? (
                  vehicleForm.map((getVehData) => (
                    <tr key={getVehData.id}>
                      <td className="px-2 py-2 text-lg font-bold text-center table-font">
                        <Link 
                          to={`/joms/vehicle/form/${getVehData.id}`} 
                          className="group flex justify-center items-center"
                        >
                          {/* Initially show the ID */}
                          <span className="group-hover:hidden">{getVehData.id}</span>
                          
                          {/* Show the View Icon on hover */}
                          <span className="hidden group-hover:inline-flex items-center">
                            <FontAwesomeIcon icon={faEye} />
                          </span>
                        </Link>
                      </td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getVehData.date_request}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getVehData.purpose}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getVehData.place}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getVehData.date_arrival} @ {getVehData.time_arrival}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getVehData.vehicle}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getVehData.driver}</td>
                      <td className="px-2 py-2 text-sm text-center w-1 table-font">{getVehData.no_passengers}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{getVehData.remarks}</td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={9} className="px-2 py-2 text-center text-sm text-gray-600">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </PageComponent>
  );
}