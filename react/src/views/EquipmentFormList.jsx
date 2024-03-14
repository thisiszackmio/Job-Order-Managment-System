import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { Link } from "react-router-dom";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import { useUserStateContext } from "../context/ContextProvider";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

export default function MyRequestEquipmentForm(){

  const { currentUser, userRole } = useUserStateContext();

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

  const [loading, setLoading] = useState(true);
  const [displayRequest, setDisplayRequest] = useState([]);

  // Get the data
  const fetchEquipmentForm = () => {
    axiosClient
    .get('/equipmentform')
    .then((response) => {
      const responseData = response.data;
      
      const equipmentFormDet = responseData.map((item) => {
        const equipmentForm = item.equipmentForm;
        const requestorName = item.requestorName;

        return {
          id: equipmentForm.id,
          date_request: formatDate(equipmentForm.date_request),
          type: equipmentForm.type_of_equipment,
          purpose: equipmentForm.title_of_activity,
          datetime: formatDate(equipmentForm.date_of_activity) + ' @ ' + formatTime(equipmentForm.time_start) + ' to ' + formatTime(equipmentForm.time_end),
          dm_approvel: equipmentForm.division_manager_approval,
          am_approvel: equipmentForm.admin_manager_approval,
          hm_approvel: equipmentForm.harbor_master_approval,
          mm_approvel: equipmentForm.port_manager_approval,
          requestor: requestorName
        }
      });

      setLoading(false);

      //console.log(equipmentFormDet);
      setDisplayRequest(equipmentFormDet);
    })
    .catch((error) => {
      setLoading(false);
        console.error('Error fetching data:', error);
    });
  };

  useEffect(()=>{
    fetchEquipmentForm();
  },[]);

  //Search Filter and Pagination
  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const filteredEquipment = displayRequest.filter((equipment) =>
    equipment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.requestor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.date_request.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const EquipmentFormDetail = filteredEquipment.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const pageCountRepair = Math.ceil(filteredEquipment.length / itemsPerPage);

  const displayPaginationEquipment = pageCountRepair > 1;

  // Restrictions
  const Authority = userRole == 'h4ck3rZ@1Oppa' || userRole == '4DmIn@Pp4' || userRole == 'Pm@PP4';

  return Authority ? (
  <PageComponent title="Equipment Form List">
  {loading ? (
  <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
    <img
      className="mx-auto h-44 w-auto"
      src={loadingAnimation}
      alt="Your Company"
    />
    <span className="ml-2 animate-heartbeat">Loading Equipment Form List</span>
  </div>
  ):(
  <>

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
          {displayRequest.length > 0 ? (
          <i>Total of <b> {displayRequest.length} </b> Equipment Form Request </i>
          ):null}
        </div>
      </div>
    </div>

    <div className="mt-4 overflow-x-auto">
      <table className="border-collapse font-arial" style={{ width: '1500px' }}>
        <thead>
          <tr className="bg-gray-100">
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">No.</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date of Request</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Type of Equipment</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Purpose</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date and Time of Activity</th>   
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Requestor</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Status</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Action</th>
          </tr>
        </thead>
        <tbody>
        {displayRequest.length > 0 ? (
        <>
          {EquipmentFormDetail.map((equip) => (
            <tr key={equip.id}>
              <td className="px-1 py-2 text-center align-top border table-font border-custom w-1 font-bold">{equip.id}</td>
              <td className="px-1 py-2 align-top border border-custom table-font w-40">{equip.date_request}</td>
              <td className="px-1 py-2 align-top border border-custom table-font w-40">{equip.type}</td>
              <td className="px-1 py-2 align-top border border-custom table-font w-64">{equip.purpose}</td>
              <td className="px-1 py-2 align-top border border-custom table-font w-72">{equip.datetime}</td>
              <td className="px-1 py-2 align-top border border-custom table-font w-56">{equip.requestor}</td>
              <td className="px-1 py-2 align-top border border-custom table-font">
                {equip.type == 'Firetruck' || equip.type == 'Manlift' ? (
                <>
                  {equip.dm_approvel == 0 && (<span className="pending-status">Pending</span>)}
                  {equip.dm_approvel == 2 && (<span className="disapproved-status">Disapproved by the Division Manager</span>)}
                  {equip.dm_approvel == 1 && (<span className="approved-status">Approved by the Division Manager</span>)}
                  {equip.dm_approvel == 1 && equip.hm_approvel == 1 && equip.am_approvel == 2 && (<span className="disapproved-status">Disapproved by the Admin Manager</span>)}
                  {equip.dm_approvel == 1 && equip.hm_approvel == 1 && equip.am_approvel == 1 && (<span className="approved-status">Approved by the Admin</span>)}
                </>
                ):(
                <>
                  {equip.dm_approvel == 0 && (<span className="pending-status">Pending</span>)}
                  {equip.dm_approvel == 2 && (<span className="disapproved-status">Disapproved by the Division Manager</span>)}
                  {equip.dm_approvel == 1 && (<span className="approved-status">Approved by the Division Manager</span>)}
                  {equip.dm_approvel == 1 && equip.hm_approvel == 2 && (<span className="disapproved-status">Disapproved by the Harbor Master</span>)}
                  {equip.dm_approvel == 1 && equip.hm_approvel == 1 && (<span className="approved-status">Approved by the Harbor Master</span>)}
                  {equip.dm_approvel == 1 && equip.hm_approvel == 1 && equip.am_approvel == 2 && (<span className="disapproved-status">Disapproved by the Admin Manager</span>)}
                  {equip.dm_approvel == 1 && equip.hm_approvel == 1 && equip.am_approvel == 1 && (<span className="approved-status">Approved by the Admin</span>)}
                  {equip.dm_approvel == 1 && equip.hm_approvel == 1 && equip.am_approvel == 1 && equip.mm_approvel == 2 && (<span className="disapproved-status">Disapproved by the Acting Port Manager</span>)}
                  {equip.dm_approvel == 1 && equip.hm_approvel == 1 && equip.am_approvel == 1 && equip.mm_approvel == 1 && (<span className="approved-status">Approved by the Acting Port Manager</span>)}
                </>
                )}
              </td>
              <td className="px-1 py-2 align-top border border-custom table-font w-1">
                <div className="flex justify-center">
                  <Link to={`/equipmentform/${equip.id}`}>
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
        </>
        ):(
          <tr>
            <td colSpan={8} className="px-6 py-4 text-center border-0 border-custom"> No data </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
    {displayPaginationEquipment && (
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