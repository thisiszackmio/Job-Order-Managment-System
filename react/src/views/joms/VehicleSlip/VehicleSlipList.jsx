import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../../../components/PageComponent";
import axiosClient from "../../../axios";
import loading_table from "/default/ring-loading.gif";
import { useUserStateContext } from "../../../context/ContextProvider";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function VehicleSlipList(){

  const { userCode } = useUserStateContext();

  // Restrictions Condition
  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const SuperAdmin = codes.includes("HACK");
  const DivisionManager = codes.includes("DM");
  const Access = Admin || GSO || DivisionManager || SuperAdmin ;

  // Loading
  const [loading, setLoading] = useState(true);

  // Vehicle Data 
  const [formlist, setFormList] = useState([]);

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

      {/* Table */}
      <div className="font-roboto ppa-form-box bg-white">
        <div className="ppa-form-header"> Vehicle Slip Form </div>

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
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">ID</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Date Request</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Purpose</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Place Visited</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Date Arrival</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Time Arrival</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Driver</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Vehicle</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">No Passengers</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Requestor</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Form Status</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#fff' }}>
              {loading ? (
                <tr>
                  <td colSpan={12} className="px-2 py-2 text-center table-font">
                    <div className="flex justify-center items-center">
                      <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                      <span className="loading-table">Loading</span>
                    </div>
                  </td>
                </tr>
              ):(
                Access ? (
                  currentList.length > 0 ? (
                    currentList.map((list)=>(
                      <tr key={list.id}>
                        <td className="px-2 py-2 text-base text-center font-bold table-font"><Link to={`/joms/vehicle/form/${list.id}`}>{list.id}</Link></td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.date_request}</td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.purpose}</td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.place_visited}</td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.date_arrival}</td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.time_arrival}</td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.driver ? list.driver : "None"}</td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.vehicle_type ? list.vehicle_type : "None"}</td>
                        <td className="px-2 py-2 text-sm w-1 text-center table-font">{list.passengers}</td>
                        <td className="px-2 py-2 text-sm text-left table-font">{list.requestor}</td>
                        <td className="px-2 py-2 text-sm text-center table-font">
                          {list.admin_approval == 1 && ("Approved")}
                          {list.admin_approval == 2 && ("Disapproved")}
                          {(list.admin_approval == 3 || list.admin_approval == 4 || list.admin_approval == 6) && ("Pending")}
                          {list.admin_approval == 5 && ("Closed by GSO")}
                        </td>
                      </tr>
                    ))
                  ):(
                    <tr>
                      <td colSpan={13} className="px-2 py-2 text-center text-sm text-gray-600">
                        No records found.
                      </td>
                    </tr>
                  )
                ):(
                  (() => { window.location = '/unauthorize'; return null; })()
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
  );

}