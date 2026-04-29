import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import loading_table from "/default/ring-loading.gif";
import { useUserStateContext } from "../../context/ContextProvider";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faEye, faGear } from '@fortawesome/free-solid-svg-icons';
import Restrict from "../../components/Restrict";

export default function VehicleSlipList(){
  const { currentUserId, currentUserCode } = useUserStateContext();

  // Loading
  const [loading, setLoading] = useState(true);

  const [pageRestrict, setPageRestrict] = useState(true);

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

  // Vehicle Data 
  const [formlist, setFormList] = useState([]);

  const fetchVehicleList = async () => {
    try{
      const response = await axiosClient.get('/allvehicleslip');
      const dataVehicle = response.data;

      setFormList(dataVehicle);

      if(accessOnly){
        setPageRestrict(true);
      }else{
        setPageRestrict(false);
      }

    }catch(error){
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(currentUserId){
      fetchVehicleList();
    }
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
  const roles = ["HACK", "AUS", "AM", "AUV", "PM", "DM", "GSO" ];
  const accessOnly = roles.some(role => codes.includes(role));

  return (
    pageRestrict ? (
      <PageComponent title="Request List">
        {/* Main */}
        <div className="mt-8">
          <div className="ppa-widget px-4 pb-6">
            {/* Header */}
            <div className="joms-user-info-header text-left"> 
              Vehicle Slip Request List
            </div>

            {/* Search */}
            <div className="pt-3">
              {/* Search Filter */}
              <div className="md:flex">
                {/* Search */}
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="Search Here"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="block w-1/4 focus:ring-0 ppa-form-field-en"
                    disabled={loading}
                  />
                </div>

                {/* Count */}
                <div className="md:ml-4" style={{ position: "relative", bottom: "-18px" }}>
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
            </div>

            {/* Top Pagination */}
            <div className="mt-6">
              {displayPaginationUser && !loading && (
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
                  activeClassName="active"
                />
              )}
            </div>

            {/* Table */}
            <div className="ppa-div-table mt-8 pb-3 overflow-x-auto md:overflow-x-visible">
              <table className="ppa-table w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 w-[5%] text-center ppa-table-header">#</th>
                    <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Date Request</th>
                    <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Place Visited</th>
                    <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Date Arrival</th>
                    <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Time Arrival</th>
                    <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Driver</th>
                    <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Vehicle</th>
                    <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Requestor</th>
                    <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Remarks</th>
                  </tr>
                </thead>
                <tbody className="ppa-tbody" style={{ backgroundColor: '#fff' }}>
                  {loading ? (
                    Array.from({ length: 30 }).map((_, index) => (  // 5 skeleton rows
                      <tr key={index}>
                        <td className="p-3 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="p-3 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="p-3 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="p-3 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="p-3 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="p-3 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="p-3 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="p-3 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                        <td className="p-3 ppa-table-body">
                          <div className="skeleton h-4"></div>
                        </td>
                      </tr>
                    ))
                  ):(
                    currentList.length > 0 ? (
                      currentList.map((list)=>(
                        <tr key={list.id}>
                          <td className="px-4 py-2 font-bold text-center ppa-table-body-id">
                            <Link
                              to={`/joms/vehicle/form/${list.id}`}
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
                          <td className="px-4 py-2 text-left ppa-table-body">{list.date_request}</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{list.place_visited}</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{list.date_arrival}</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{list.time_arrival}</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{list.driver ? list.driver : "None"}</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{list.vehicle_type ? list.vehicle_type : "None"}</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{list.requestor}</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{list.remarks}</td>
                        </tr>
                      ))
                    ):(
                      <tr>
                        <td colSpan={9} className="px-2 py-5 text-center ppa-table-body">
                          No records found
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination */}
            {displayPaginationUser && !loading && (
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
      </PageComponent>
    ):(
      <Restrict />
    )
  );

}