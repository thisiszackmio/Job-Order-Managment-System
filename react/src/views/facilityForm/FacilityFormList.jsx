import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import loading_table from "/default/ring-loading.gif";
import { useUserStateContext } from "../../context/ContextProvider";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faEye } from '@fortawesome/free-solid-svg-icons';
import Restrict from "../../components/Restrict";

export default function FacilityVenueFormList(){

  const { currentUserCode } = useUserStateContext();

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

  const [formlist, setFormList] = useState([]);

  // Get User Employee's Data
  useEffect(() => {  
    axiosClient
    .get('/allfacility')
    .then((response) => {
      const FacilityFormList = response.data;

      const mappedData = FacilityFormList.map((dataItem) => {
        const facilities = [];

        if(dataItem.mph == 1){ facilities.push("MPH"); }
        if(dataItem.conference == 1){ facilities.push("Conference Room"); }
        if(dataItem.dorm == 1){ facilities.push("Dormitory"); }
        if(dataItem.other == 1){ facilities.push("Other"); }
        const resultFacilities = facilities.join(', ');

        return{
          id: dataItem.id,
          date_request: dataItem.date_request,
          request_office: dataItem.request_office,
          title_activity: dataItem.title_activity,
          date_start: dataItem.date_start,
          time_start: dataItem.time_start,
          date_end: dataItem.date_end,
          time_end: dataItem.time_end,
          facility: resultFacilities,
          requestor: dataItem.requestor,
          remarks: dataItem.remarks,
        }
      })

      setFormList(mappedData);

    })
    .catch((error)=>{
      setShowPopup(true);
      setPopupContent('error');
      setPopupMessage(error.response.status);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  //Search Filter and Pagination
  const itemsPerPage = 30;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset page when searching
  };

  const filteredList = formlist.filter((list) => {
    const dateRequest = formatDate(list.date_request)?.toLowerCase() || '';
    const request_office = list.request_office?.toLowerCase() || '';
    const title_activity = list.title_activity?.toLowerCase() || '';
    const requestor = list.requestor?.toLowerCase() || '';
    const facility = list.facility?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
  
    return (
      dateRequest.includes(search) ||
      requestor.includes(search) ||
      request_office.includes(search) ||
      facility.includes(search) ||
      title_activity.includes(search)
    );
  });

  const pageCountUser = Math.ceil(filteredList.length / itemsPerPage);
  const displayPaginationUser = pageCountUser > 1;

  // Calculate range for display
  const startIndex = currentPage * itemsPerPage + 1;
  const endIndex = Math.min((currentPage + 1) * itemsPerPage, filteredList.length);

  const currentList = filteredList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const DivisionManager = codes.includes("DM");
  const SuperAdmin = codes.includes("HACK");
  const PortManager = codes.includes("PM");
  const Access = Admin || GSO || DivisionManager || PortManager || SuperAdmin;

  return(
    <PageComponent title="Request List">
      {Access ? (
      <div className="ppa-widget mt-8">
        <div className="joms-user-info-header text-left"> 
          Facility / Venue Form List
        </div>
        <div className="px-4 pb-6">

          {/* Search Filter */}
          <div className="flex">

            {/* Search */}
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search Here"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-96 p-2 border border-gray-300 rounded text-sm"
              />
            </div>

            {/* Count */}
            <div className="ml-4" style={{ position: "relative", bottom: "-18px" }}>
              <div className="text-right text-sm/[17px]">
                Total of{" "}
                {pageCountUser > 1 ? (
                  <b>{startIndex} - {endIndex}</b>
                ) : (
                  <b>{filteredList.length}</b>
                )}{" "}
                out of <b>{filteredList.length}</b> Request list
              </div>
            </div>

          </div>

          {/* Top Pagination */}
          <div className="mt-6">
            {displayPaginationUser && (
              <ReactPaginate
                previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                breakLabel="..."
                pageCount={pageCountUser}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                forcePage={currentPage}
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

          {/* Table */}
          <div className="ppa-div-table">
            <table className="ppa-table w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 w-[5%]  text-center ppa-table-header">#</th>
                  <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Date Request</th>
                  <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Request Office</th>
                  <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Activity</th>
                  <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Date</th>
                  <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Facility/Venue</th>
                  <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Requestor</th>
                  <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Remarks</th>
                </tr>
              </thead>
              <tbody className="ppa-tbody" style={{ backgroundColor: '#fff' }}>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-2 py-5 text-center ppa-table-body">
                      <div className="flex justify-center items-center">
                        <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                        <span className="loading-table">Loading List</span>
                      </div>
                    </td>
                  </tr>
                ):(
                  currentList.length > 0 ? (
                    currentList.map((list)=>(
                      <tr key={list.id}>
                        <td className="px-4 py-4 font-bold text-center ppa-table-body-id">
                          <Link
                            to={`/joms/facilityvenue/form/${list.id}`}
                            className="group flex justify-center items-center"
                          >
                            {/* Initially show the ID */}
                            <span className="group-hover:hidden">{list.id}</span>

                            {/* Show the View Icon on hover */}
                            <span className="hidden group-hover:inline-flex items-center text-black rounded-md">
                              <FontAwesomeIcon icon={faEye} />
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-left ppa-table-body">{formatDate(list.date_request)}</td>
                        <td className="px-4 py-4 text-left ppa-table-body">{list.request_office}</td>
                        <td className="px-4 py-4 text-left ppa-table-body">{list.title_activity}</td>
                        <td className="px-4 py-4 text-left ppa-table-body">
                          {list.date_start === list.date_end ? (
                            `${formatDate(list.date_start)} @ ${formatTime(list.time_start)} to ${formatTime(list.time_end)}`
                          ):(
                            `${formatDate(list.date_start)} @ ${formatTime(list.time_start)} to ${formatDate(list.date_end)} @ ${formatTime(list.time_end)}`
                          )}
                        </td>
                        <td className="px-4 py-4 text-left ppa-table-body">{list.facility}</td>
                        <td className="px-4 py-4 text-left ppa-table-body">{list.requestor}</td>
                        <td className="px-4 py-4 text-left ppa-table-body">{list.remarks}</td>
                      </tr>
                    ))
                  ):(
                    <tr>
                      <td colSpan={8} className="px-2 py-5 text-center ppa-table-body">
                        No records found
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination */}
          {displayPaginationUser && (
            <ReactPaginate
              previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
              nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
              breakLabel="..."
              pageCount={pageCountUser}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              forcePage={currentPage}
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
      </div>
      ):(
        <Restrict />
      )}
    </PageComponent>
  );

}