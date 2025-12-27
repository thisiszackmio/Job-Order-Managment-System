import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import loading_table from "/default/ring-loading.gif";
import { useUserStateContext } from "../../context/ContextProvider";
import Restrict from "../../components/Restrict";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faEye } from '@fortawesome/free-solid-svg-icons';

export default function InspectionFormList(){

  const { currentUserCode } = useUserStateContext();

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Loading
  const [loading, setLoading] = useState(true);

  const [formlist, setFormList] = useState([]);

  // Get User Employee's Data
  useEffect(() => {  
    axiosClient
    .get('/allinspection')
    .then((response) => {
      const InspectionFormList = response.data;

      setFormList(InspectionFormList);

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
    const requestor = list.requestor?.toLowerCase() || '';
    const location = list.location?.toLowerCase() || '';
    const propertyNumber = list.property_number?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
  
    return (
      dateRequest.includes(search) ||
      requestor.includes(search) ||
      location.includes(search) ||
      propertyNumber.includes(search)
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
  const SuperAdmin = codes.includes("HACK");
  const DivisionManager = codes.includes("DM");
  const AssignPersonnel = codes.includes("AP");
  const PortManager = codes.includes("PM");
  const Access = Admin || GSO || DivisionManager || SuperAdmin || PortManager || AssignPersonnel;

  return (
    <PageComponent title="Request List">
      {Access ? (
        <div className="ppa-widget mt-8">
          <div className="joms-user-info-header text-left"> 
            Pre/Post Repair Inspection Form List
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
                    <th className="px-4 py-2 w-[5%] text-center ppa-table-header">#</th>
                    <th className="px-4 py-2 w-[10%] text-left ppa-table-header">Date Request</th>
                    <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Type of Property</th>
                    <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Description</th>
                    <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Complain/Defect</th>
                    <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Requestor</th>
                    <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Remarks</th>
                  </tr>
                </thead>
                <tbody className="ppa-tbody" style={{ backgroundColor: '#fff' }}>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-2 py-5 text-center ppa-table-body">
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
                          <td className="px-4 py-2 font-bold text-center ppa-table-body-id">
                            <Link
                              to={`/joms/inspection/form/${list.id}`}
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
                          <td className="px-4 py-2 text-left ppa-table-body">{formatDate(list.date_request)}</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{list.type}</td>
                          <td className="px-4 py-2 text-left ppa-table-body">{list.description}</td>
                          <td className="px-4 py-4 text-left ppa-table-body">{list.complain}</td>
                          <td className="px-4 py-4 text-left ppa-table-body">{list.requestor}</td>
                          <td className="px-4 py-4 text-left ppa-table-body">{list.remarks}</td>
                        </tr>
                      ))
                    ):(
                      <tr>
                        <td colSpan={7} className="px-2 py-5 text-center ppa-table-body">
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
  )

}