import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

export default function RepairRequestList(){

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const { currentUser, userRole } = useUserStateContext();

  const [loading, setLoading] = useState(true);

  const [prePostRepair, setPrePostRepair] = useState([]);

  // Get All the data
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
            supervisor_approval: inspection_form.supervisor_approval,
            admin_approval: inspection_form.admin_approval,
            inspector_status: inspection_form.inspector_status
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

  useEffect(() => { 
    fetchTableData(); 
  }, []);

  //Search Filter and Pagination
  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const filteredRepairs = prePostRepair.filter((repair) =>
    repair.property_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.type_of_property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const currentRepair = filteredRepairs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const pageCountRepair = Math.ceil(filteredRepairs.length / itemsPerPage);

  const displayPaginationRepair = pageCountRepair > 1;

  //Restrictions
  const requestlistClearance = [1, 2, 3, 4, 6, 10];
  const Codezz = requestlistClearance.includes(currentUser.code_clearance);
  const authorize = userRole == 'admin' || userRole == 'personnels' || userRole == 'hackers'
  const Users = Codezz || authorize;

  return Users ? (
  <PageComponent title="Pre/Post Repair Inspection Form Request List">
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
  <div>

    {/* Top Layer */}
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
          {prePostRepair.length > 0 ? (
          <i>Total of <b> {prePostRepair.length} </b> Facility/Venue Request </i>
          ):null}
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="border-collapse" style={{ width: '1650px' }}>
        <thead>
          {currentRepair.length > 0 ? (
            <tr className="bg-gray-100">
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">No</th>
              <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
              <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Property No</th>
              <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Type of Property</th>
              <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Complain</th>   
              <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Requestor</th>
              <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Status</th>
              <th className="px-2 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Action</th>
            </tr>
            ):null}
        </thead>
        <thead>
        {currentRepair.length > 0 ? (
        currentRepair.map((repair) => (
        <tr key={repair.id}>
          <td className="px-1 py-2 text-center align-top border border-custom w-1 font-bold">{repair.id}</td>
          <td className="px-1 py-2 align-top border border-custom w-40">{repair.date}</td>
          <td className="px-1 py-2 align-top border border-custom w-80">{repair.property_number}</td>
          {repair.type_of_property === "Others" ? (
          <td className="px-1 py-2 align-top border border-custom w-80">Others: <i>{repair.property_other_specific}</i></td>
          ):(
          <td className="px-1 py-2 align-top border border-custom w-80">{repair.type_of_property}</td>
          )}
          <td className="px-1 py-2 align-top border border-custom w-56">{repair.complain}</td>
          <td className="px-1 py-2 align-top border border-custom w-56">{repair.name}</td>
          <td className="px-1 py-2 align-top border border-custom w-60">
          {repair.supervisor_approval == 0 && repair.admin_approval == 0 && (<span className="pending-status">Pending</span>)}
          {repair.supervisor_approval == 2 && repair.admin_approval == 0 && (<span className="disapproved-status">Disapproved by the Supervisor</span>)}
          {repair.supervisor_approval == 1 && repair.admin_approval == 4 && (<span className="approved-status">Approved by the Supervisor</span>)}
          {repair.supervisor_approval === 1 && repair.admin_approval == 3 && (<span className="pending-status">Pending on Admin's Approval</span>)}
          {repair.supervisor_approval === 1 && repair.admin_approval == 2 && repair .inspector_status == 3 && (<span className="disapproved-status">Disapproved by the Admin</span>)}
          {repair.supervisor_approval === 1 && repair.admin_approval == 1 && repair.inspector_status == 3 && (<span className="approved-status">Approved by the Admin</span>)}
          {repair.admin_approval === 1 && repair.inspector_status == 2 && (<span className="checking-status">Checking</span>)}
          {repair.admin_approval === 1 && repair.inspector_status == 1 && (<span className="finish-status">Done</span>)}
          </td>
          <td className="px-1 py-1 text-center border border-custom">
            <div className="flex justify-center">
              <Link to={`/repairinspectionform/${repair.id}`}>
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
        ))
        ):(
        <tr>
          <td colSpan={6} className="px-6 py-4 text-center border-0 border-custom"> No data </td>
        </tr>
        )}
        </thead>
      </table>
    </div>
    {displayPaginationRepair && (
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
  )}  
  </PageComponent>
  ):(
    (() => {
      window.location = '/forbidden';
      return null; // Return null to avoid any unexpected rendering
    })()
  );
}