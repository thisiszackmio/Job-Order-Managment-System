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
  const { currentUserId, currentUserCode } = useUserStateContext();

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const [loading, setLoading] = useState(true);
  const [pageRestrict, setPageRestrict] = useState(true);

  // Get User Employee's Data
  const [formlist, setFormList] = useState([]);

  const fetchInspectionList = async () => {
    try{
      const response = await axiosClient.get('/allinspection');
      const dataInspection = response.data;

      setFormList(dataInspection);

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
      fetchInspectionList();
    }
  }, [currentUserId]);

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
  const roles = ["HACK", "AUS", "AM", "AUI", "PM", "DM", "GSO" ];
  const accessOnly = roles.some(role => codes.includes(role));

  return (
    pageRestrict ? (
      <PageComponent title="Request List">
        {/* Main */}
        <div className="mt-8">
          <div className="ppa-widget px-4 pb-6">
            {/* Header */}
            <div className="joms-user-info-header text-left"> 
              Pre/Post Repair Inspection Form List
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
                    <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Type of Property</th>
                    <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Description</th>
                    <th className="px-4 py-2 w-[20%] text-left ppa-table-header">Complain/Defect</th>
                    <th className="px-4 py-2 w-[15%] text-left ppa-table-header">Requestor</th>
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
                      </tr>
                    ))
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
  )

}