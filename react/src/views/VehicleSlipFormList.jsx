import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import ReactPaginate from "react-paginate";
import Forbidden from "../components/403";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

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

export default function VehicleSlipFormList(){

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

  const currentVehicleSlip = filteredVehicle.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const pageCountVehicleSlip = Math.ceil(filteredVehicle.length / itemsPerPage);
  const displayPaginationVehicle = pageCountVehicleSlip > 1;

  //Restrictions
  const User = userRole == "admin" || userRole == "hackers";

  return User ? (
  <PageComponent title="Vehicle Slip Request List">
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
    <div>

      <div className="flex justify-end">
        <div className="align-right">
          {/* For Search Field */}
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="mb-4 p-2 border border-gray-300 rounded"
          />
          {/* Count for List */}
          <div className="text-right text-sm/[17px]">
            {getVehicleSlip.length > 0 ? (
            <i>Total of <b> {getVehicleSlip.length} </b> Vehicle Slip Request </i>
            ):null}
          </div>
        </div>
      </div>

      {/* Vehicle Slip Form */}
      <div className="overflow-x-auto">
        {currentVehicleSlip.length > 0 ? (
          <table className="border-collapse" style={{ width: '1440px' }}>
            <thead>
              <tr className="bg-gray-100">
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border w-1 border-custom">No</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Purpose</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Visited Place</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date/Time of Arrival</th>   
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Vehicle</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Driver</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">No of Passengers</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Requestor</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Status</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Action</th>
              </tr>
            </thead>
            <tbody>
            {currentVehicleSlip.map((VehDet) => (
              <tr key={VehDet.id}>
                <td className="px-3 py-1 align-top border border-custom w-1 font-bold">{VehDet.id}</td>
                <td className="px-3 py-1 align-top border border-custom w-48">{VehDet.date}</td>
                <td className="px-3 py-1 align-top border border-custom w-56">{VehDet.purpose}</td>
                <td className="px-3 py-1 align-top border border-custom w-56">{VehDet.place_visited}</td>
                <td className="px-3 py-1 align-top border border-custom w-60">{VehDet.date_arrival} @ {formatTime(VehDet.time_arrival)}</td>
                <td className="px-3 py-1 align-top border border-custom w-96">{VehDet.vehicle_type}</td>
                <td className="px-3 py-1 align-top border border-custom w-56">{VehDet.driver}</td>
                <td className="px-3 py-1 align-top text-center border border-custom w-20">{VehDet.passengersCount}</td>
                <td className="px-3 py-1 align-top border border-custom w-56">{VehDet.requestor}</td>
                <td className="px-3 py-1 align-top border border-custom w-72">
                {VehDet.admin_approval == 5 && (<span className="pending-status">Pending</span>)}
                {VehDet.admin_approval == 4 && (<span className="pending-status">Waiting on Admin's Approval</span>)}
                {VehDet.admin_approval == 3 && (<span className="disapproved-status">Disapproved</span>)}
                {VehDet.admin_approval == 2 && (<span className="approved-status">Approved</span>)}
                {VehDet.admin_approval == 1 && (<span className="finish-status">Closed</span>)}
                </td>
                <td className="px-3 py-1 align-top border border-custom w-12">
                    <div className="flex justify-center">
                      <Link to={`/vehicleslipform/${VehDet.id}`}>
                        <button 
                          className="text-green-600 font-bold py-1 px-2"
                          title="View Request"
                        >
                          <FontAwesomeIcon icon={faEye} /> 
                        </button>
                      </Link>
                    </div>
                  </td>
              </tr>
            ))}
            </tbody>
          </table>
        ):(
          <tr>
            <td colSpan={8} className="px-6 py-4 text-center border-0 border-custom"> No data </td>
          </tr>
        )}
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
  </>  
  )}
  </PageComponent>
  ):(
  <Forbidden />
  );

}