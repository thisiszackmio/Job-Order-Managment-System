import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../../../components/PageComponent";
import axiosClient from "../../../axios";
import loading_table from "/load_hehe.gif"
import { useUserStateContext } from "../../../context/ContextProvider";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function FacilityVenueFormList(){

  const { userCode } = useUserStateContext();

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
    .get('/allfacility/')
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
    .finally(() => {
      setLoading(false);
    });
  }, []);

  //Search Filter and Pagination
  const itemsPerPage = 25;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset page when searching
  };

  const filteredList = formlist.filter((list) => {
    const request_office = list.request_office?.toLowerCase() || '';
    const title_activity = list.title_activity?.toLowerCase() || '';
    const requestor = list.requestor?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
  
    return (
      requestor.includes(search) ||
      request_office.includes(search) ||
      title_activity.includes(search)
    );
  });

  const pageCountUser = Math.ceil(filteredList.length / itemsPerPage);
  const displayPaginationUser = pageCountUser > 1;

  const currentList = filteredList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Restrictions Condition
  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const SuperAdmin = codes.includes("HACK");
  const Access = Admin || GSO || SuperAdmin;

  return Access ? (
    <PageComponent title="Request List">

      {/* Post Repair Form */}
      <div className="font-roboto ppa-form-box bg-white">
        <div className="ppa-form-header"> Facility / Venue Form List </div>

        <div className="p-2 ppa-div-table relative overflow-x-auto shadow-md sm:rounded-lg">

          {/* Search Filter */}
          <div className="mt-2 mb-4 flex">

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
                Total of <b>{currentList.length}</b> Request list
              </div>
            </div>

          </div>

          <table className="ppa-table w-full mb-10 mt-2">
            <thead className="bg-gray-100">
              <tr className="bg-gray-100">
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Ctrl ID</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date Request</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Request Office</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Activity</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Facility/Venue</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Requestor</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#fff' }}>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-2 py-2 text-center table-font">
                  <div className="flex justify-center items-center">
                    <img className="h-10 w-auto mr-2" src={loading_table} alt="Loading" />
                    <span className="loading-table">Loading</span>
                  </div>
                </td>
              </tr>
            ):(
              currentList.length > 0 ? (
                currentList.map((list)=>(
                  <tr key={list.id}>
                    <td className="px-2 py-2 text-base text-center font-bold table-font"><Link to={`/joms/facilityvenue/form/${list.id}`}>{list.id}</Link></td>
                    <td className="px-2 py-2 text-sm text-left table-font">{formatDate(list.date_request)}</td>
                    <td className="px-2 py-2 text-sm text-left table-font">{list.request_office}</td>
                    <td className="px-2 py-2 text-sm text-left table-font">{list.title_activity}</td>
                    <td className="px-2 py-2 text-sm text-left w-1/4 table-font">
                      {list.date_start === list.date_end ? (
                        `${formatDate(list.date_start)} @ ${formatTime(list.time_start)} to ${formatTime(list.time_end)}`
                      ):(
                        `${formatDate(list.date_start)} @ ${formatTime(list.time_start)} to ${formatDate(list.date_end)} @ ${formatTime(list.time_end)}`
                      )}
                    </td>
                    <td className="px-2 py-2 text-sm text-left table-font">{list.facility}</td>
                    <td className="px-2 py-2 text-sm text-left table-font">{list.requestor}</td>
                    <td className="px-2 py-2 text-sm text-left table-font">{list.remarks}</td>
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan={8} className="px-2 py-2 text-center text-sm text-gray-600">
                    No records found.
                  </td>
                </tr>
              )
            )}
            </tbody>
          </table>
          {displayPaginationUser && (
            <ReactPaginate
              previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
              nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
              breakLabel="..."
              pageCount={pageCountUser}
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

      </div>

    </PageComponent>
  ):(
    (() => { window.location = '/unauthorize'; return null; })()
  );

}