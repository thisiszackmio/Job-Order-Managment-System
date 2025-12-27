import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../../components/PageComponent";
import loading_table from "/default/ring-loading.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faEye } from '@fortawesome/free-solid-svg-icons';
import { useUserStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios";
import ReactPaginate from "react-paginate";

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
    .get(`/jomsmyrequest/${currentUserId}`)
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
    if(currentUserId){
      fetchRequest();
    }
  }, [currentUserId]);

  // For pagination
  const ListPerPage = 5;

  // Inspection pagination
  const [inspPage, setInspPage] = useState(0);
  // Facility pagination
  const [facPage, setFacPage] = useState(0);
  // Vehicle pagination
  const [vehPage, setVehPage] = useState(0);

  // Inspection
  const paginatedInspection = inspectionForm?.slice(
    inspPage * ListPerPage,
    (inspPage + 1) * ListPerPage
  );
  // Facility
  const paginatedFacility = facilityForm?.slice(
    facPage * ListPerPage,
    (facPage + 1) * ListPerPage
  );
  // Vehicle
  const paginatedVehicle = vehicleForm?.slice(
    vehPage * ListPerPage,
    (vehPage + 1) * ListPerPage
  );

  // Inspection count
  const inspPageCount = Math.ceil((inspectionForm?.length || 0) / ListPerPage);
  const facPageCount  = Math.ceil((facilityForm?.length || 0) / ListPerPage);
  const vehPageCount  = Math.ceil((vehicleForm?.length || 0) / ListPerPage);

  return(
    <PageComponent title="My Request List">
      {/* Post Repair Form */}
      <div className="ppa-widget mt-8">
        <div className="joms-user-info-header text-left"> Pre/Post Repair Inspection Form </div>

        {/* Pagination */}
        <div className="px-4 mt-2">
          {inspPageCount > 1 && (
            <ReactPaginate
              previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
              nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
              breakLabel="..."
              pageCount={inspPageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={({ selected }) => setInspPage(selected)}
              forcePage={inspPage}
              containerClassName="pagination-top"
              subContainerClassName="pages pagination"
              activeClassName="active"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
            />
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center pt-2 pb-8">
            <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
            <span className="loading-table">Loading</span>
          </div>
        ):(
          <div className="px-4 pb-4 ppa-div-table">
            <table className="ppa-table w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 w-[5%] text-center ppa-table-header">#</th>
                  <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Date Request</th>
                  <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Type of Property</th>
                  <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Description</th>
                  <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Complain/Defect</th>
                  <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Approver</th>
                  <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Remarks</th>
                </tr>
              </thead>
              <tbody className="ppa-tbody" style={{ backgroundColor: '#fff' }}>
                {paginatedInspection && paginatedInspection?.length > 0 ? (
                  paginatedInspection.map((getInspData)=>(
                    <tr key={getInspData.id}>
                      <td className="px-4 py-4 w-[5%] font-bold text-center ppa-table-body-id">
                        <Link 
                          to={`/joms/inspection/form/${getInspData.id}`} 
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
                      <td className="px-4 py-2 w-[10%] text-left ppa-table-body">{getInspData.date_request}</td>
                      <td className="px-4 py-2 w-[15%] text-left ppa-table-body">{getInspData.type}</td>
                      <td className="px-4 py-2 w-[15%] text-left ppa-table-body">{getInspData.description}</td>
                      <td className="px-4 py-2 w-[20%] text-left ppa-table-body">{getInspData.complain}</td>
                      <td className="px-4 py-2 w-[15%] text-left ppa-table-body">{getInspData.supervisor}</td>
                      <td className="px-4 py-2 w-[15%] text-left ppa-table-body">{getInspData.remarks}</td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={7} className="px-2 py-5 text-center ppa-table-body">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Facility Form */}
      <div className="ppa-widget mt-14">
        <div className="joms-user-info-header text-left"> Facility / Venue Request Form </div>

        {/* Pagination */}
        <div className="px-4 mt-2">
          {facPageCount > 1 && (
            <ReactPaginate
              previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
              nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
              breakLabel="..."
              pageCount={facPageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={({ selected }) => setFacPage(selected)}
              forcePage={facPage}
              containerClassName="pagination-top"
              subContainerClassName="pages pagination"
              activeClassName="active"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
            />
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center pt-2 pb-8">
            <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
            <span className="loading-table">Loading</span>
          </div>
        ):(
          <div className="px-4 pb-4 ppa-div-table">
            <table className="ppa-table w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 w-[5%] text-center ppa-table-header">#</th>
                  <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Date Request</th>
                  <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Request Office</th>
                  <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Activity</th>
                  <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Date</th>
                  <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Facility/Venue</th>
                  <th className="px-4 py-2 w-[25%] text-left ppa-table-header">Remarks</th>
                </tr>
              </thead>
              <tbody className="ppa-tbody" style={{ backgroundColor: '#fff' }}>
                {paginatedFacility && paginatedFacility.length > 0 ? (
                  paginatedFacility.map((getFacData) => (
                    <tr key={getFacData.id}>
                      <td className="px-4 py-4 w-[5%] font-bold text-center ppa-table-body-id">
                        <Link 
                          to={`/joms/facilityvenue/form/${getFacData.id}`} 
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
                      <td className="px-4 py-2 w-[10%] text-left ppa-table-body">{getFacData.date_requested}</td>
                      <td className="px-4 py-2 w-[10%] text-left ppa-table-body">{getFacData.request_office}</td>
                      <td className="px-4 py-2 w-[15%] text-left ppa-table-body">{getFacData.title_of_activity}</td>
                      <td className="px-4 py-2 w-[20%] text-left ppa-table-body">
                        {getFacData.date_start === getFacData.date_end ? (
                          `${getFacData.date_start} @ ${getFacData.time_start} to ${getFacData.time_end}`
                        ) : (
                          `${getFacData.date_start} @ ${getFacData.time_start} to ${getFacData.date_end} @ ${getFacData.time_end}`
                        )}
                      </td>
                      <td className="px-4 py-2 w-[15%] text-left ppa-table-body">{getFacData.facility}</td>
                      <td className="px-4 py-2 w-[25%] text-left ppa-table-body">{getFacData.remarks}</td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={7} className="px-2 py-5 text-center ppa-table-body">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vehicle Form */}
      <div className="ppa-widget mt-14">
        <div className="joms-user-info-header text-left"> Vehicle Slip </div>

        {/* Pagination */}
        <div className="px-4 mt-2">
          {vehPageCount > 1 && (
            <ReactPaginate
              previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
              nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
              breakLabel="..."
              pageCount={vehPageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={({ selected }) => setVehPage(selected)}
              forcePage={vehPage}
              containerClassName="pagination-top"
              subContainerClassName="pages pagination"
              activeClassName="active"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
            />
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center pt-2 pb-8">
            <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
            <span className="loading-table">Loading</span>
          </div>
        ):(
          <div className="px-4 pb-4 ppa-div-table">
            <table className="ppa-table w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 w-[5%] text-center ppa-table-header">#</th>
                  <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Date Request</th>
                  <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Purpose</th>
                  <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Arrival</th>
                  <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Vehicle</th>
                  <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Driver</th>
                  <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Remarks</th>
                </tr>
              </thead>
              <tbody className="ppa-tbody" style={{ backgroundColor: '#fff' }}>
                {paginatedVehicle && paginatedVehicle?.length > 0 ? (
                  paginatedVehicle.map((getVehData) => (
                    <tr key={getVehData.id}>
                      <td className="px-4 py-2 font-bold text-center ppa-table-body-id">
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
                      <td className="px-4 py-2 text-left ppa-table-body">{getVehData.date_request}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getVehData.purpose}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getVehData.date_arrival} @ {getVehData.time_arrival}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getVehData.vehicle}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getVehData.driver}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getVehData.remarks}</td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={7} className="px-2 py-5 text-center ppa-table-body">
                      No records found
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