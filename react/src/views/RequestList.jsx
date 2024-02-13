import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTimes, faEye, faStickyNote  } from '@fortawesome/free-solid-svg-icons';
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import ReactPaginate from "react-paginate";

// Function to format the date as "Month Day, Year"
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatDateAct(dateString) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatTimeAct(timeString) {
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

export default function RequestList()
{
  library.add(faCheck, faTimes, faEye, faStickyNote);

  const [activeTab, setActiveTab] = useState("tab1");

  const [loading, setLoading] = useState(true);

  const { userRole } = useUserStateContext();
  const [getVehicleSlip, setVehicleSlip] = useState([]);

  const fetchVehicleData = () => {
    setLoading(true);
    axiosClient
      .get('/vehicleform')
      .then((response) => {
        const responseData = response.data;
        const getVehicleSlip = Array.isArray(responseData) ? responseData : responseData.data;

        const mappedVehicleForms = getVehicleSlip.map((dataItem) => {
          // Extract inspection form and user details from each dataItem
          const { vehicleForms, passengersCount ,user_details } = dataItem;

          // Extract user details properties
          const { fname, mname, lname } = user_details;

          return{
            id: vehicleForms.id,
            date: formatDate(vehicleForms.date_of_request),
            purpose: vehicleForms.purpose,
            place_visited: vehicleForms.place_visited,
            date_arrival: formatDate(vehicleForms.date_arrival),
            time_arrival: vehicleForms.time_arrival,
            vehicle_type: vehicleForms.vehicle_type,
            driver: vehicleForms.driver,
            admin_approval: vehicleForms.admin_approval,
            passengersCount: passengersCount,
            requestor: `${fname} ${mname} ${lname}`,
          }
        });
  
        setVehicleSlip(mappedVehicleForms);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
 
  useEffect(() => { 
    fetchTableData(); 
    fetchFacilityData();
    fetchVehicleData();
  }, []);

  //Search Filter and Pagination
  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset page when searching
  };

  // For Vehicle Slip Request
  const filteredVehicle = getVehicleSlip.filter((vehicle) =>
    vehicle.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.place_visited.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.date_arrival.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.requestor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = ({ selected }) => {
    // Update the state with the new selected page
    setCurrentPage(selected);
  };

  // Paginate the filtered results


  const currentVehicleSlip = filteredVehicle.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );


  const pageCountVehicleSlip = Math.ceil(filteredVehicle.length / itemsPerPage);


  const displayPaginationVehicle = pageCountVehicleSlip > 1;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return(
    <PageComponent title="Request List">
    {userRole === "admin" ?(
    <>
    {loading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src={loadingAnimation}
        alt="Your Company"
      />
      <span className="ml-2 animate-heartbeat">Loading Request List</span>
    </div>
    ):(
      <>
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

      {/* Vehicle Slip Request List */}
      {activeTab === "tab3" && 
        <div>
          <div className="flex">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-4 p-2 border border-gray-300 rounded"
              />
            </div>
            {displayPaginationVehicle && (
              <ReactPaginate
                previousLabel="Previous"
                nextLabel="Next"
                breakLabel="..."
                pageCount={pageCountVehicleSlip}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName="pagination"
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
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border w-1 border-custom">Slip No</th>
                <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
                <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Purpose</th>
                <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Visited Place</th>
                <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date/Time of Arrival</th>   
                <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Vehicle</th>
                <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Driver</th>
                <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">No of Passengers</th>
                <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Requestor</th>
                <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentVehicleSlip.length > 0 ? (
                currentVehicleSlip.map((VehDet) => (
                  <tr key={VehDet.id}>
                    <td className="px-1 py-1 text-center border border-custom w-1 font-bold">{VehDet.id}</td>
                    <td className="px-1 py-1 text-center border border-custom w-24">{formatDateAct(VehDet.date)}</td>
                    <td className="px-1 py-1 text-center border border-custom">{VehDet.purpose}</td>
                    <td className="px-1 py-1 text-center border border-custom">{VehDet.place_visited}</td>
                    <td className="px-1 py-1 text-center border border-custom">{formatDateAct(VehDet.date_arrival)} @ {formatTimeAct(VehDet.time_arrival)}</td>
                    <td className="px-1 py-1 text-center border border-custom">{VehDet.vehicle_type}</td>
                    <td className="px-1 py-1 text-center border border-custom">{VehDet.driver}</td>
                    <td className="px-1 py-1 text-center border border-custom w-3">{VehDet.passengersCount}</td>
                    <td className="px-1 py-1 text-center border border-custom">{VehDet.requestor}</td>
                    <td className="px-1 py-1 text-center border border-custom">
                    <div className="flex justify-center">
                      <Link to={`/vehicleslipform/${VehDet.id}`}>
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
                  <td colSpan={10} className="px-6 py-4 text-center border-0 border-custom"> No data </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="text-right text-sm/[17px]">
           {getVehicleSlip.length > 0 ? (
           <i>Total of <b> {getVehicleSlip.length} </b> Vehicle Slip Request </i>
           ):null}
          </div>
        </div>
      }


      {activeTab === "tab4" && <div className="text-center">Coming Soon</div>}
      {activeTab === "tab5" && <div className="text-center">Coming Soon</div>}

      </div>
      </>
    )}
    </>
    ):(
      <div>Access Denied. Only admins can view this page.</div>
    )}
    </PageComponent>
  )
}