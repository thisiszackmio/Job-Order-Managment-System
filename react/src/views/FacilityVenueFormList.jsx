import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import ReactPaginate from "react-paginate";
import Forbidden from "../components/403";

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

export default function FacilityVenueRequestList() {

  const [loading, setLoading] = useState(true);

  const { currentUser } = useUserStateContext();
  const [getFacilityDet, setFacilityDet] = useState([]);

  const fetchFacilityData = () => {
    setLoading(true);
    axiosClient
    .get('/facilityform')
    .then((response) => {
      const responseData = response.data;
      const getFacility = Array.isArray(responseData) ? responseData : responseData.data;

      const mappedData = getFacility.map((dataItem) => {

        const { facility_form, user_details } = dataItem;

        const { fname, mname, lname } = user_details;

        const facilities = [];

        if (facility_form.mph == 1) {
          facilities.push("MPH");
        }
    
        if (facility_form.conference == 1) {
          facilities.push("Conference Room");
        }
    
        if (facility_form.dorm == 1) {
          facilities.push("Dormitory");
        }
    
        if (facility_form.other == 1) {
          facilities.push("Other");
        }

        const result = facilities.join(', ');

        return {
          id: facility_form.id,
          date: formatDate(facility_form.date_requested),
          tite_of_activity: facility_form.title_of_activity,
          date_start: facility_form.date_start,
          time_start: facility_form.time_start,
          date_end: facility_form.date_end,
          time_end: facility_form.time_end,
          type_facility: result,
          remarks: facility_form.remarks,
          name: fname +' ' + mname+'. ' + lname,
        };
      });

      setFacilityDet(mappedData);

    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => { 
    fetchFacilityData();
  }, []);

  //Search Filter and Pagination
  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset page when searching
  };

  // For Facility/Venue Request
  const filteredFacility = getFacilityDet.filter((facility) =>
    facility.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.tite_of_activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.type_facility.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = ({ selected }) => {
    // Update the state with the new selected page
    setCurrentPage(selected);
  };

  // Paginate the filtered results
  // For Inspection Repair
  const currentFacility = filteredFacility.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const pageCountFacility = Math.ceil(filteredFacility.length / itemsPerPage);
  const displayPaginationFacility = pageCountFacility > 1;

  //Restrictions
  const requestlistClearance = [1, 2, 3, 4, 6, 10];
  const here = requestlistClearance.includes(currentUser.code_clearance);
  const User = here;

  return User ? (
  <PageComponent title="Facility / Venue Form Request List">
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
           {getFacilityDet.length > 0 ? (
           <i>Total of <b> {getFacilityDet.length} </b> Facility/Venue Request </i>
           ):null}
          </div>
        </div>
      </div>

      {/* Facility / Venue List */}
      <div className="overflow-x-auto">
        <table className="border-collapse" style={{ width: '1450px' }}>
          <thead>
          {currentFacility.length > 0 ? (
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">No</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Title/Purpose of Activity</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date and Time of Activity (Start and End)</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Type of Facility/Venue</th>  
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Requestor</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Action</th>
            </tr>
          ):null}    
          </thead>
          <tbody>
          {currentFacility.length > 0 ? (
            currentFacility.map((FacDet) => (
              <tr key={FacDet.id}>
                <td className="px-1 py-1 text-center border border-custom w-1 font-bold">{FacDet.id}</td>
                <td className="px-1 py-1 text-center border border-custom w-40">{formatDate(FacDet.date)}</td>
                <td className="px-1 py-1 text-center border border-custom w-56">{FacDet.tite_of_activity}</td>
                <td className="px-1 py-1 text-center border border-custom w-96">
                {FacDet.date_start === FacDet.date_end ? (
                  `${formatDateAct(FacDet.date_start)} @ ${formatTimeAct(FacDet.time_start)} to ${formatTimeAct(FacDet.time_end)}`
                ) : (
                  `${formatDateAct(FacDet.date_start)} @ ${formatTimeAct(FacDet.time_start)} to ${formatDateAct(FacDet.date_end)} @ ${formatTimeAct(FacDet.time_end)}`
                )}
                </td>
                <td className="px-1 py-1 text-center border border-custom"> {FacDet.type_facility} </td>
                <td className="px-1 py-1 text-center border border-custom">{FacDet.name}</td>
                <td className="px-1 py-1 text-center border border-custom">
                  {FacDet.remarks == "Approved" && (<span className="approved-status">{FacDet.remarks}</span>)}
                  {FacDet.remarks == "Disapproved" && (<span className="disapproved-status">{FacDet.remarks}</span>)}
                  {FacDet.remarks == "Pending" && (<span className="pending-status">{FacDet.remarks}</span>)}
                  {FacDet.remarks == "Closed" && (
                    <>
                    <div className="flex justify-center">
                      <span className="approved-status">Approved</span> 
                      <span className="done-status ml-1">{FacDet.remarks}</span>
                    </div>
                    </>
                  )}
                </td>
                <td className="px-1 py-4 text-center border border-custom">
                  <div className="flex justify-center">
                  <Link to={`/facilityvenueform/${FacDet.id}`}>
                    <button 
                      className="bg-green-600 hover:bg-green-500 text-white py-1 px-2 rounded"
                      title="View Request"
                    >
                      View
                    </button>
                  </Link>
                  </div>
                </td>
              </tr>
            ))
          ):(
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center border-0 border-custom"> No data </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {/* For Pagination */}
      {displayPaginationFacility && (
        <ReactPaginate
          previousLabel="Previous"
          nextLabel="Next"
          breakLabel="..."
          pageCount={pageCountFacility}
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
    (() => {
      window.location = '/forbidden';
      return null; // Return null to avoid any unexpected rendering
    })()
  );
  
}

