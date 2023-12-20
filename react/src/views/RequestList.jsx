import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTimes, faEye, faStickyNote  } from '@fortawesome/free-solid-svg-icons';
import loadingAnimation from '../assets/loading.gif';
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
  const [prePostRepair, setPrePostRepair] = useState([]);
  const [getFacilityDet, setFacilityDet] = useState([]);

  const fetchTableData = () => {
    setLoading(true); // Set loading state to true when fetching data
    axiosClient
      .get('/requestrepair')
      .then((response) => {
        const responseData = response.data;
        const getRepair = Array.isArray(responseData) ? responseData : responseData.data;

        // Map the data and set it to your state
        const mappedData = getRepair.map((dataItem) => {
          // Extract inspection form and user details from each dataItem
          const { inspection_form, user_details } = dataItem;

          // Extract user details properties
          const { fname, mname, lname } = user_details;

          // Create a mapped data object
          return {
            id: inspection_form.id,
            date: formatDate(inspection_form.date_of_request),
            property_number: inspection_form.property_number,
            type_of_property: inspection_form.type_of_property,
            property_other_specific: inspection_form.property_other_specific,
            name: fname +' ' + mname+'. ' + lname,
            complain: inspection_form.complain,
            supervisorname: inspection_form.supervisor_name,
            supervisor_aprroval: inspection_form.supervisor_approval,
            admin_aprroval: inspection_form.admin_approval
          };
        });

        // Set the mapped data to your state using setPrePostRepair
        setPrePostRepair(mappedData);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

        if (facility_form.mph !== "0") {
          facilities.push("MPH");
        }
    
        if (facility_form.conference !== "0") {
          facilities.push("Conference Room");
        }
    
        if (facility_form.dorm !== "0") {
          facilities.push("Dormitory");
        }
    
        if (facility_form.other !== "0") {
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
          name: fname +' ' + mname+'. ' + lname,
        };
      });

      setFacilityDet(mappedData);
      console.log(mappedData);

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
  }, []);

  //Search Filter and Pagination
  const itemsPerPage = 100;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset page when searching
  };

  // Filter repairs based on search term
  // For Inspection Repair
  const filteredRepairs = prePostRepair.filter((repair) =>
    repair.property_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.type_of_property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // For Facility/Venue Request
  const filteredFacility = getFacilityDet.filter((facility) =>
    facility.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.tite_of_activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.type_facility.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // Paginate the filtered results
  // For Inspection Repair
  const currentRepair = filteredRepairs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // For Facility/Venue Rquest
  const currentFacility = filteredFacility.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );


  const pageCountRepair = Math.ceil(filteredRepairs.length / itemsPerPage);
  const pageCountFacility = Math.ceil(currentFacility.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return(
    <PageComponent title="Request List">
    {userRole === "admin" ?(
    <>
    {loading ? (
      <div className="flex items-center justify-center">
        <img src={loadingAnimation} alt="Loading" className="h-10 w-10" />
        <span className="ml-2">Loading Request List...</span>
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

      {/* Repair Inspection */}
      {activeTab === "tab1" && 
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
            <ReactPaginate
              previousLabel="Previous"
              nextLabel="Next"
              breakLabel="..."
              pageCount={pageCountRepair}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName="pagination"
              subContainerClassName="pages pagination"
              activeClassName="active"
            />
          </div>
          <table className="w-full border-collapse">
            <thead>
            {currentRepair.length > 0 ? (
              <tr className="bg-gray-100">
                <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border w-1 border-custom">Ctrl No</th>
                <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
                <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Property No</th>
                <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Type of Property</th>
                <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Complain</th>   
                <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Requestor</th>
                <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Action</th>
              </tr>
            ):null}
            </thead>
            <tbody>
            {currentRepair.length > 0 ? (
              currentRepair.map((repair) => (
                <tr key={repair.id}>
                  <td className="px-2 py-1 text-center border border-custom font-bold">{repair.id}</td>
                  <td className="px-2 py-1 text-center border border-custom">{formatDate(repair.date)}</td>
                  <td className="px-2 py-1 text-center border border-custom">{repair.property_number}</td>
                  {repair.type_of_property === "Others" ? (
                    <td className="px-2 py-1 text-center border border-custom">Others: <i>{repair.property_other_specific}</i></td>
                  ):(
                    <td className="px-2 py-1 text-center border border-custom">{repair.type_of_property}</td>
                  )}
                  <td className="px-2 py-1 text-center border border-custom">{repair.complain}</td>
                  <td className="px-2 py-1 text-center border border-custom">{repair.name}</td>
                  <td className="px-2 py-1 text-center border border-custom">
                    <div className="flex justify-center">
                      <Link to={`/repairinspectionform/${repair.id}`}>
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
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center border-0 border-custom"> No data </td>
              </tr>
            )}
            </tbody>
          </table>
          <div className="text-right text-sm/[17px]">
          {prePostRepair.length > 0 ? (
          <i>Total of <b> {prePostRepair.length} </b> Pre/Post Repair Request</i>
          ):null}
          </div>
        </div>
      }

      {activeTab === "tab2" && 
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
              />
          </div>
          <table className="w-full border-collapse">
            <thead>
            {currentFacility.length > 0 ? (
              <tr className="bg-gray-100">
                <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom w-1">Ctrl No</th>
                <th className="px-6 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
                <th className="px-6 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Title/Purpose of Activity</th>
                <th className="px-6 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date and Time of Activity (Start)</th>
                <th className="px-6 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date and Time of Activity (End)</th> 
                <th className="px-6 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Type of Facility/Venue</th>  
                <th className="px-6 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Requestor</th>
                <th className="px-6 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Action</th>
              </tr>
            ):null}    
            </thead>
            <tbody>
            {currentFacility.length > 0 ? (
              currentFacility.map((FacDet) => (
                <tr key={FacDet.id}>
                  <td className="px-2 py-1 text-center border border-custom w-1 font-bold">{FacDet.id}</td>
                  <td className="px-2 py-1 text-center border border-custom">{formatDate(FacDet.date)}</td>
                  <td className="px-2 py-1 text-center border border-custom w-40">{FacDet.tite_of_activity}</td>
                  <td className="px-2 py-1 text-center border border-custom w-40">{formatDateAct(FacDet.date_start)} @ {formatTimeAct(FacDet.time_start)}</td>
                  <td className="px-2 py-1 text-center border border-custom w-40">{formatDateAct(FacDet.date_end)} @ {formatTimeAct(FacDet.time_end)}</td>
                  <td className="px-2 py-1 text-center border border-custom"> {FacDet.type_facility} </td>
                  <td className="px-2 py-1 text-center border border-custom">{FacDet.name}</td>
                  <td className="px-2 py-1 text-center border border-custom">
                    <div className="flex justify-center">
                      <Link to={`/facilityvenueform/${FacDet.id}`}>
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
                <td colSpan={8} className="px-6 py-4 text-center border-0 border-custom"> No data </td>
              </tr>
            )}
            </tbody>
          </table>
          <div className="text-right text-sm/[17px]">
           {getFacilityDet.length > 0 ? (
           <i>Total of <b> {getFacilityDet.length} </b> Facility/Venue Request </i>
           ):null}
          </div>
        </div>
      }

      {activeTab === "tab3" && <div className="text-center">Coming Soon</div>}
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