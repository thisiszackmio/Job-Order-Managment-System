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
  const [loadingInsp, setLoadingInsp] = useState(true);
  const [loadingFac, setLoadingFac] = useState(true);
  const [loadingVeh, setLoadingVeh] = useState(true);

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
  const [currentInspPage, setCurrentInspPage] = useState(1);
  const [lastInspPage, setLastInspPage] = useState(1);
  const [searchInsp, setSearchInsp] = useState('');

  const fetchInspection = async (page = 1, searchValue = searchInsp) => {
    try {
      setLoadingInsp(true);
      
      const InspRes = await axiosClient.get(`/jomsmyinsprequest/${currentUserId}?inspection_page=${page}&search=${searchValue}`);

      // console.log(InspRes.data.last_page);
      getInspectionForm(InspRes.data.data);
      setCurrentInspPage(InspRes.data.current_page);
      setLastInspPage(InspRes.data.last_page);

    } catch(error){
      console.error(error);
    } finally {
      setLoadingInsp(false);
    }
  }

  // --- Facility Data --- // 
  const [facilityForm, getFacilityForm] = useState([]);
  const [currentFacPage, setCurrentFacPage] = useState(1);
  const [lastFacPage, setLastFacPage] = useState(1);
  const [searchFac, setSearchFac] = useState('');

  const fetchFacility = async (page = 1, searchValue = searchFac) => {
    try {
      setLoadingFac(true);
      const FacRes = await axiosClient.get(`/jomsmyfacrequest/${currentUserId}?facility_page=${page}&search=${searchValue}`);

      // console.log(FacRes.data.last_page);
      getFacilityForm(FacRes.data.data);
      setCurrentFacPage(FacRes.data.current_page);
      setLastFacPage(FacRes.data.last_page);

    } catch(error){
      console.error(error);
    } finally {
      setLoadingFac(false);
    }
  }
  
  // --- Vehicle Data --- // 
  const [vehicleForm, getVehicleForm] = useState([]);
  const [currentVehPage, setCurrentVehPage] = useState(1);
  const [lastVehPage, setLastVehPage] = useState(1);
  const [searchVeh, setSearchVeh] = useState('');

  const fetchVehicle = async (page = 1, searchValue = searchVeh) => {
    try {
      setLoadingVeh(true);
      const VehRes = await axiosClient.get(`/jomsmyvehrequest/${currentUserId}?facility_page=${page}&search=${searchValue}`);

      // console.log(VehRes.data.data);
      getVehicleForm(VehRes.data.data);
      setCurrentVehPage(VehRes.data.current_page);
      setLastVehPage(VehRes.data.last_page);

    } catch(error){
      console.error(error);
    } finally {
      setLoadingVeh(false);
    }
  }

  // execute the function
  useEffect(() => {
    if (currentUserId) {
      fetchInspection();
      fetchFacility();
      fetchVehicle();
    }
  }, [currentUserId]);

  // For search in Inspection
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchInspection(1, searchInsp);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchInsp]);

  // For search in Facility
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchFacility(1, searchFac);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchFac]);

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
            <div className="mt-10 mb-3 ml-2 px-2">
              {/* Top */}
              <div className="pt-3">
                <div className="flex w-full justify-between items-center">

                  {/* Search (LEFT) */}
                  <input
                    type="text"
                    placeholder="Search here ..."
                    value={searchInsp}
                    onChange={(e) =>
                      setSearchInsp(e.target.value)
                    }
                    className="block w-1/4 focus:ring-0 ppa-form-field-en"
                  />

                  {/* Page Count (RIGHT) */}
                  <div className="text-sm text-right px-2">
                    Page {currentInspPage} of {lastInspPage}
                  </div>

                </div>
              </div>

              {/* Pagination Top */}
              {lastInspPage > 1 && (
                <div className="flex gap-2 mt-4">
                  {/* Prev */}
                  <button
                    disabled={currentInspPage === 1}
                    onClick={() => fetchInspection(currentInspPage - 1)}
                    className="px-2 py-1 ppa-add-form text-sm"
                  >
                    <FontAwesomeIcon
                      title="Prev"
                      icon={faChevronLeft}
                    />
                  </button>

                  {/* Next */}
                  <button
                    disabled={currentInspPage === lastInspPage}
                    onClick={() => fetchInspection(currentInspPage + 1)}
                    className="px-2 py-1 ppa-add-form text-sm"
                  >
                    <FontAwesomeIcon
                      title="Next"
                      icon={faChevronRight}
                    />
                  </button>
                </div>
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
                    {loadingInsp ? (
                      Array.from({ length: 10 }).map((_, index) => (  // 5 skeleton rows
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
                      inspectionForm && inspectionForm?.length > 0 ? (
                        inspectionForm.map(getInspData => (
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
            <div className="mt-10 mb-3 ml-2 px-2">
              {/* Top */}
              <div className="pt-3">
                <div className="flex w-full justify-between items-center">

                  {/* Search (LEFT) */}
                  <input
                    type="text"
                    placeholder="Search here ..."
                    value={searchFac}
                    onChange={(e) =>
                      setSearchFac(e.target.value)
                    }
                    className="block w-1/4 focus:ring-0 ppa-form-field-en"
                  />

                  {/* Page Count (RIGHT) */}
                  <div className="text-sm text-right">
                    Page {currentFacPage} of {lastFacPage}
                  </div>

                </div>
              </div>

              {/* Pagination Top */}
              {lastFacPage > 1 && (
                <div className="flex gap-2 mt-4">
                  {/* Prev */}
                  <button
                    disabled={currentFacPage === 1}
                    onClick={() => fetchFacility(currentFacPage - 1)}
                    className="px-2 py-1 ppa-add-form text-sm"
                  >
                    <FontAwesomeIcon
                      title="Prev"
                      icon={faChevronLeft}
                    />
                  </button>

                  {/* Next */}
                  <button
                    disabled={currentFacPage === lastFacPage}
                    onClick={() => fetchFacility(currentFacPage + 1)}
                    className="px-2 py-1 ppa-add-form text-sm"
                  >
                    <FontAwesomeIcon
                      title="Next"
                      icon={faChevronRight}
                    />
                  </button>
                </div>
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
                    {loadingFac ? (
                      Array.from({ length: 10 }).map((_, index) => (  // 5 skeleton rows
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
                      facilityForm && facilityForm?.length > 0 ? (
                        facilityForm.map(getFacData => (
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
            <div className="mt-10 mb-3 ml-2 px-2">
              {/* Top */}
              <div className="pt-3">
                <div className="flex w-full justify-between items-center">

                  {/* Search (LEFT) */}
                  <input
                    type="text"
                    placeholder="Search here ..."
                    value={searchVeh}
                    onChange={(e) =>
                      setSearchVeh(e.target.value)
                    }
                    className="block w-1/4 focus:ring-0 ppa-form-field-en"
                  />

                  {/* Page Count (RIGHT) */}
                  <div className="text-sm text-right">
                    Page {currentVehPage} of {lastVehPage}
                  </div>

                </div>
              </div>

              {/* Pagination Top */}
              {lastVehPage > 1 && (
                <div className="flex gap-2 mt-4">
                  {/* Prev */}
                  <button
                    disabled={currentVehPage === 1}
                    onClick={() => fetchVehicle(currentVehPage - 1)}
                    className="px-2 py-1 ppa-add-form text-sm"
                  >
                    <FontAwesomeIcon
                      title="Prev"
                      icon={faChevronLeft}
                    />
                  </button>

                  {/* Next */}
                  <button
                    disabled={currentVehPage === lastVehPage}
                    onClick={() => fetchVehicle(currentVehPage + 1)}
                    className="px-2 py-1 ppa-add-form text-sm"
                  >
                    <FontAwesomeIcon
                      title="Next"
                      icon={faChevronRight}
                    />
                  </button>
                </div>
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
                  {loadingVeh ? (
                    Array.from({ length: 10 }).map((_, index) => (  // 5 skeleton rows
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
                    vehicleForm && vehicleForm?.length > 0 ? (
                      vehicleForm.map(getVehData => (
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