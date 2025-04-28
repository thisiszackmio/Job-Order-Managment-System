import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../../../components/PageComponent";
import axiosClient from "../../../axios";
import loading_table from "/default/ring-loading.gif";
import { useUserStateContext } from "../../../context/ContextProvider";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faEye, faGear } from '@fortawesome/free-solid-svg-icons';
import Restrict from "../../../components/Restrict";

export default function VehicleSlipList(){

  const { currentUserCode } = useUserStateContext();

  // Restrictions Condition 
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const roles = ["AM", "GSO", "DM", "HACK", "PM", "AU"];
  const accessOnly = roles.some(role => codes.includes(role));

  // Loading
  const [loading, setLoading] = useState(true);

  // Vehicle Data 
  const [formlist, setFormList] = useState([]);

  // Disable the Scroll on Popup
  useEffect(() => {
  
    // Define the classes to be added/removed
    const loadingClass = 'loading-show';

    // Function to add the class to the body
    const addLoadingClass = () => document.body.classList.add(loadingClass);

    // Function to remove the class from the body
    const removeLoadingClass = () => document.body.classList.remove(loadingClass);

    // Add or remove the class based on showPopup state
    if(loading) {
      addLoadingClass();
    }
    else {
      removeLoadingClass();
    }

    // Cleanup function to remove the class when the component is unmounted or showPopup changes
    return () => {
      removeLoadingClass();
    };
  }, [loading]);

  // Get Data
  useEffect(() => {
    axiosClient
    .get('/allvehicleslip')
    .then((response) => {
      const VehicleSlipData = response.data;

      setFormList(VehicleSlipData);

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
    const requestor = list.requestor?.toLowerCase() || '';
    const driver = list.driver?.toLowerCase() || '';
    const vehicle_type = list.vehicle_type?.toLowerCase() || '';
    const date_request = list.date_request?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
  
    return (
      requestor.includes(search) ||
      driver.includes(search) ||
      vehicle_type.includes(search) ||
      date_request.includes(search)
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

  return (
    <PageComponent title="Request List">
      
      {loading ? (
        <div className="flex items-left h-20 space-x-4">
          {/* Loading Animation */}
          <FontAwesomeIcon
            icon={faGear}
            className="text-4xl text-blue-700 gear"
          />
          <span className="loading">Loading...</span>
        </div>
      ):(
        !accessOnly ? (
          <Restrict />
        ):(
          <div>
            {/* Table */}
            <div className="font-roboto ppa-form-box bg-white">
              <div className="ppa-form-header"> Vehicle Slip Request - All List </div>
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
                      <th className="w-10 px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">ID</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Date Request</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Purpose</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Place Visited</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Date Arrival</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Time Arrival</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Driver</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Vehicle</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">No Passengers</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Requestor</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Remarks</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: '#fff' }}>
                  {currentList.length > 0 ? (
                    currentList.map((list)=>(
                      <tr key={list.id}>
                        <td className="px-2 py-2 text-lg text-center font-bold table-font">
                          <Link
                            to={`/joms/vehicle/form/${list.id}`}
                            className="relative group inline-flex items-center"
                          >
                            {/* Initially show the ID */}
                            <span className="group-hover:hidden">{list.id}</span>

                            {/* Show the View Icon on hover */}
                            <span className="hidden group-hover:inline-flex items-center text-black rounded-md">
                              <FontAwesomeIcon icon={faEye} />
                            </span>
                          </Link>
                        </td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.date_request}</td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.purpose}</td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.place_visited}</td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.date_arrival}</td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.time_arrival}</td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.driver ? list.driver : "None"}</td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.vehicle_type ? list.vehicle_type : "None"}</td>
                        <td className="px-2 py-2 text-sm w-1 text-center table-font">{list.passengers}</td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.requestor}</td>
                        <td className="px-2 py-2 text-sm text-center table-font">{list.remarks}</td>
                      </tr>
                    ))
                  ):(
                    <tr>
                      <td colSpan={13} className="px-2 py-2 text-center text-sm text-gray-600">
                        No records found.
                      </td>
                    </tr>
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
          </div>
        )
      )}
      

    </PageComponent>
  );

}