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
    const requestor = list.requestor?.toLowerCase() || '';
    const location = list.location?.toLowerCase() || '';
    const propertyNumber = list.property_number?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
  
    return (
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
        <div className="font-roboto ppa-form-box bg-white">
          <div className="ppa-form-header"> Pre/Post Repair Inspection Form List </div>
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
            <table className="ppa-table w-full mb-10 mt-2">
              <thead className="bg-gray-100">
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Ctrl ID</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date Request</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Property Number</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Acquisition Date</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Acquisition Cost</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Brand/Model</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Serial/Engine No.</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Type of Property</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Description</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Location</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Complain</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Requestor</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#fff' }}>
              {loading ? (
                <tr>
                  <td colSpan={13} className="px-2 py-2 text-center table-font">
                    <div className="flex justify-center items-center">
                      <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                      <span className="loading-table">Loading</span>
                    </div>
                  </td>
                </tr>
              ):(
                currentList.length > 0 ? (
                  currentList.map((list)=>(
                    <tr key={list.id}>
                      <td className="px-2 py-2 text-lg text-center font-bold table-font">
                        <Link
                          to={`/joms/inspection/form/${list.id}`}
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
                      <td className="px-2 py-2 text-sm text-left table-font">{formatDate(list.date_request)}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{list.property_number ? list.property_number : 'N/A'}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{list.acquisition_date ? formatDate(list.acquisition_date) : 'N/A'}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">
                        {list.acquisition_cost ? 
                          new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP'
                          }).format(list.acquisition_cost) 
                          : 'N/A'}
                      </td>
                      <td className="px-2 py-2 text-sm text-left table-font">{list.brand_model ? list.brand_model : 'N/A'}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{list.serial_engine_no ? list.serial_engine_no : 'N/A'}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{list.type}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{list.description}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{list.location}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{list.complain}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{list.requestor}</td>
                      <td className="px-2 py-2 text-sm text-left table-font">{list.remarks}</td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={13} className="px-2 py-2 text-center text-sm text-gray-600">
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