import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../../components/PageComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faEye } from '@fortawesome/free-solid-svg-icons';
import { useUserStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios";
import ReactPaginate from "react-paginate";

export default function MyRequest(){

  const { currentUserId } = useUserStateContext();

  // Loading
  const [loading, setLoading] = useState(true);

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

  const [activeTab, setActiveTab] = useState("inspection");

  const changeTab = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");

    if (hash === "facility" || hash === "vehicle" || hash === "inspection") {
      setActiveTab(hash);
    }
  }, []);

  // --- Inspection Data --- //
  const [inspectionForm, getInspectionForm] = useState([]);
  const [facilityForm, getFacilityForm] = useState([]);
  const [vehicleForm, getVehicleForm] = useState([]);

  const fetchInspection = async () => {
    try {
      const response = await axiosClient.get(`/jomsmyrequest/${currentUserId}`);
      const responseForm = response.data;

      console.log(responseForm.inspection);
      if(responseForm){
        getInspectionForm(responseForm.inspection);
        getFacilityForm(responseForm.facility);
        getVehicleForm(responseForm.vehicle)
      }

    } catch(error){
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // execute the function
  useEffect(() => {
    if (currentUserId) {
      fetchInspection();
    }
  }, [currentUserId]);

  // For pagination
  const ListPerPage = 10;

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
    <PageComponent title="My Request">
      <div className="ppa-widget mt-12">
        {/* Tabs */}
        <div className="flex">
          {["inspection", "facility", "vehicle"].map((tab) => (
            <button key={tab} onClick={() => changeTab(tab)}
              className={`transition-all tab-btn ${
                activeTab === tab
                  ? "tab-active"
                  : "not-active"
              }`}
            >
              {tab === "inspection"
                ? "Pre/Post Inspection Repair"
                : tab === "facility"
                ? "Facility/Venue"
                : "Vehicle Slip"}
            </button>
          ))}
        </div>

        {/* Inspection Tab */}
        {activeTab === "inspection" && ( 
        <div className="bg-white tab-container">
          <div className="mt-10 mb-3 ml-2">
            {inspPageCount > 1 && !loading && (
              <ReactPaginate
                previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                breakLabel="..."
                pageCount={inspPageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={({ selected }) => setInspPage(selected)}
                forcePage={inspPage}
                containerClassName="pagination"
                activeClassName="active"
              />
            )}
          </div>
          {/* Table */}
          <div>
            <div className="pb-4 px-4 ppa-div-table overflow-x-auto md:overflow-x-visible">
              <table className="ppa-table w-full">
                <thead>
                  <tr>
                    <th className="px-2 md:px-4 py-2 w-[5%] text-center ppa-table-header">#</th>
                    <th className="px-2 md:px-4 py-2 w-[10%] text-left ppa-table-header">Date Request</th>
                    <th className="px-2 md:px-4 py-2 w-[15%] text-left ppa-table-header">Type of Property</th>
                    <th className="px-2 md:px-4 py-2 w-[15%] text-left ppa-table-header">Description</th>
                    <th className="px-2 md:px-4 py-2 w-[20%] text-left ppa-table-header">Complain/Defect</th>
                    <th className="px-2 md:px-4 py-2 w-[15%] text-left ppa-table-header">Approver</th>
                    <th className="px-2 md:px-4 py-2 w-[15%] text-left ppa-table-header">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (  // 5 skeleton rows
                      <tr key={index}>
                        <td className="px-2 py-4 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                      </tr>
                    ))
                  ):(
                    paginatedInspection && paginatedInspection?.length > 0 ? (
                      paginatedInspection.map(getInspData => (
                        <tr key={getInspData.repair_id}>
                          <td className="px-2 py-2 md:px-4 md:py-4 w-[5%] font-bold text-center ppa-table-body-id">
                            <Link 
                              to={`/joms/inspection/form/${getInspData.repair_id}`} 
                              className="group flex justify-center items-center"
                            >
                              {/* Initially show the ID */}
                              <span className="group-hover:hidden">{getInspData.repair_id}</span>
                              
                              {/* Show the View Icon on hover */}
                              <span className="hidden group-hover:inline-flex items-center">
                                <FontAwesomeIcon icon={faEye} />
                              </span>
                            </Link>
                          </td>
                          <td className="px-2 py-2 md:px-4 md:py-2 w-[10%] text-left ppa-table-body">{formatDate(getInspData.repair_date_request)}</td>
                          <td className="px-2 py-2 md:px-4 md:py-2 w-[15%] text-left ppa-table-body">{getInspData.repair_type}</td>
                          <td className="px-2 py-2 md:px-4 md:py-2 w-[15%] text-left ppa-table-body">{getInspData.repair_description}</td>
                          <td className="px-2 py-2 md:px-4 md:py-2 w-[20%] text-left ppa-table-body">{getInspData.repair_complain}</td>
                          <td className="px-2 py-2 md:px-4 md:py-2 w-[15%] text-left ppa-table-body">{getInspData.repair_supervisor_name}</td>
                          <td className="px-2 py-2 md:px-4 md:py-2 w-[15%] text-left ppa-table-body">{getInspData.repair_remarks}</td>
                        </tr>
                      ))
                    ):(
                      <tr>
                        <td colSpan={7} className="px-2 py-5 text-center ppa-table-body">
                          No records found
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}

        {/* Facility Tab */}
        {activeTab === "facility" && (
        <div className="bg-white tab-container">
          <div className="mt-10 mb-3 ml-2">
            {facPageCount > 1 && !loading && (
              <ReactPaginate
                previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                breakLabel="..."
                pageCount={facPageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={({ selected }) => setFacPage(selected)}
                forcePage={facPage}
                containerClassName="pagination"
                activeClassName="active"
              />
            )}
          </div>
          {/* Table */}
          <div>
            <div className="pb-4 px-4 ppa-div-table overflow-x-auto md:overflow-x-visible">
              <table className="ppa-table w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 w-[5%] text-center ppa-table-header">#</th>
                    <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Date Request</th>
                    <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Request Office</th>
                    <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Activity</th>
                    <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Date</th>
                    <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Facility/Venue</th>
                    <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (  // 5 skeleton rows
                      <tr key={index}>
                        <td className="px-2 py-4 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                      </tr>
                    ))
                  ):(
                    paginatedFacility && paginatedFacility.length > 0 ? (
                      paginatedFacility.map(getFacData => (
                        <tr key={getFacData.fac_id}>
                          <td className="px-4 py-4 w-[5%] font-bold text-center ppa-table-body-id">
                            <Link 
                              to={`/joms/facilityvenue/form/${getFacData.fac_id}`} 
                              className="group flex justify-center items-center"
                            >
                              {/* Initially show the ID */}
                              <span className="group-hover:hidden">{getFacData.fac_id}</span>
                              
                              {/* Show the View Icon on hover */}
                              <span className="hidden group-hover:inline-flex items-center">
                                <FontAwesomeIcon icon={faEye} />
                              </span>
                            </Link>
                          </td>
                          <td className="px-4 py-2 w-[10%] text-left ppa-table-body">{formatDate(getFacData.fac_date_request)}</td>
                          <td className="px-4 py-2 w-[10%] text-left ppa-table-body">{getFacData.fac_request_office}</td>
                          <td className="px-4 py-2 w-[15%] text-left ppa-table-body">{getFacData.fac_title_of_activity}</td>
                          <td className="px-4 py-2 w-[20%] text-left ppa-table-body">
                            {formatDate(getFacData?.fac_date_start) ===
                            formatDate(getFacData?.fac_date_end) ? (
                              `${formatDate(getFacData.fac_date_start)} @ ${formatTime(
                                getFacData.fac_time_start
                              )} to ${formatTime(getFacData.fac_time_end)}`
                            ) : (
                              `${formatDate(getFacData.fac_date_start)} @ ${formatTime(
                                getFacData.fac_time_start
                              )} to ${formatDate(getFacData.fac_date_end)} @ ${formatTime(
                                getFacData.fac_time_end
                              )}`
                            )}
                          </td>
                          <td className="px-4 py-2 w-[15%] text-left ppa-table-body">
                            {getFacData.mph ? "Multi-Purpose Hall" : null}
                            {getFacData.conference ? "Conference" : null}
                            {getFacData.dorm ? "Dormitory" : null}
                            {getFacData.other ? "Other" : null}
                          </td>
                          <td className="px-4 py-2 w-[25%] text-left ppa-table-body">{getFacData.fac_remarks}</td>
                        </tr>
                      ))
                    ):(
                      <tr>
                        <td colSpan={7} className="px-2 py-5 text-center ppa-table-body">
                          No records found
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}

        {/* Inspection Tab */}
        {activeTab === "vehicle" && (
        <div className="bg-white tab-container">
          <div className="mt-10 mb-3 ml-2">
            {vehPageCount > 1 && !loading && (
              <ReactPaginate
                previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                breakLabel="..."
                pageCount={vehPageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={({ selected }) => setVehPage(selected)}
                forcePage={vehPage}
                containerClassName="pagination"
                activeClassName="active"
              />
          )}
          </div>
          {/* Table */}
          <div>
            <div className="pb-4 px-4 ppa-div-table overflow-x-auto md:overflow-x-visible">
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
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (  // 5 skeleton rows
                      <tr key={index}>
                        <td className="px-2 py-4 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="px-2 py-2 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                      </tr>
                    ))
                  ):(
                    paginatedVehicle && paginatedVehicle?.length > 0 ? (
                      paginatedVehicle.map(getVehData => (
                        <tr key={getVehData.veh_id}>
                          <td className="px-4 py-2 font-bold text-center ppa-table-body-id">
                            <Link 
                              to={`/joms/vehicle/form/${getVehData.veh_id}`} 
                              className="group flex justify-center items-center"
                            >
                              {/* Initially show the ID */}
                              <span className="group-hover:hidden">{getVehData.veh_id}</span>
                              
                              {/* Show the View Icon on hover */}
                              <span className="hidden group-hover:inline-flex items-center">
                                <FontAwesomeIcon icon={faEye} />
                              </span>
                            </Link>
                          </td>
                          <td className="px-4 py-2 text-left ppa-table-body">{formatDate(getVehData.veh_date_req)}</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{getVehData.veh_purpose}</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{formatDate(getVehData.veh_date)} @ {formatTime(getVehData.veh_time)}</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{getVehData.veh_vehicle ? getVehData.veh_vehicle : "No Assign Vehicle"}</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{getVehData.veh_driver ? getVehData.veh_driver : "No Assign Driver" }</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{getVehData.remarks}</td>
                        </tr>
                      ))
                    ):(
                      <tr>
                        <td colSpan={7} className="px-2 py-5 text-center ppa-table-body">
                          No records found
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}
      </div>
    </PageComponent>
  );
}