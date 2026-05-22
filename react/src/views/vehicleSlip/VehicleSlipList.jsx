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
  const [loadingList, setLoadingList] = useState(true);

  const [pageRestrict, setPageRestrict] = useState(true);

  const [vehicleData, setVehicleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState('');

  const fetchVehicleData = async (page = 1, searchValue = search) => {
  try {
    setLoadingList(true);

    const res = await axiosClient.get(
      `/allvehicleslip?page=${page}&search=${searchValue}`
    );

    setVehicleData(res.data.data);
    setCurrentPage(res.data.current_page);
    setLastPage(res.data.last_page);

    if(accessOnly){
      setPageRestrict(true);
    }else{
      setPageRestrict(false);
    }

  } catch (err) {
    console.error(err);
  } finally {
    setLoadingList(false);
  }
};

  useEffect(() => {
    fetchVehicleData();
  }, []);

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const roles = ["HACK", "AUS", "AM", "AUV", "PM", "DM", "GSO" ];
  const accessOnly = roles.some(role => codes.includes(role));

  return (
    !pageRestrict ? (<Restrict />):
    (
    <PageComponent title="Request List">
      {/* Main */}
      <div className="mt-8">
        <div className="ppa-widget px-4 pb-6">
          {/* Header */}
          <div className="joms-user-info-header text-left"> 
            Vehicle Slip Request List
          </div>

          {/* Top */}
          <div className="pt-3">
            <div className="flex w-full justify-between items-center">

              {/* Search (LEFT) */}
              <input
                type="text"
                placeholder="Search vehicle, driver, purpose..."
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  fetchVehicleData(1, value);
                }}
                className="block w-1/4 focus:ring-0 ppa-form-field-en"
              />

              {/* Page Count (RIGHT) */}
              <div className="text-sm text-right">
                Page {currentPage} of {lastPage}
              </div>

            </div>
          </div>

          {/* Pagination Top */}
          {lastPage > 1 && (
            <div className="flex gap-2 mt-4">
              {/* Prev */}
              <button
                disabled={currentPage === 1}
                onClick={() => fetchVehicleData(currentPage - 1)}
                className="px-2 py-1 ppa-add-form text-sm"
              >
                <FontAwesomeIcon
                  title="Prev"
                  icon={faChevronLeft}
                />
              </button>

              {/* Next */}
              <button
                disabled={currentPage === lastPage}
                onClick={() => fetchVehicleData(currentPage + 1)}
                className="px-2 py-1 ppa-add-form text-sm"
              >
                <FontAwesomeIcon
                  title="Next"
                  icon={faChevronRight}
                />
              </button>
            </div>
          )}

          {/* Table */}
          <div className="ppa-div-table mt-4 overflow-x-auto md:overflow-x-visible">
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
              <tbody className="ppa-tbody">
                {loadingList ? (
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
                  vehicleData.length > 0 ? (
                    vehicleData.map((list) => (
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

          {/* Pagination Bottom */}
          {lastPage > 1 && (
            <div className="flex gap-2 mt-4">
              {/* Prev */}
              <button
                disabled={currentPage === 1}
                onClick={() => fetchVehicleData(currentPage - 1)}
                className="px-2 py-1 ppa-add-form text-sm"
              >
                <FontAwesomeIcon
                  title="Prev"
                  icon={faChevronLeft}
                />
              </button>

              {/* Next */}
              <button
                disabled={currentPage === lastPage}
                onClick={() => fetchVehicleData(currentPage + 1)}
                className="px-2 py-1 ppa-add-form text-sm"
              >
                <FontAwesomeIcon
                  title="Next"
                  icon={faChevronRight}
                />
              </button>
            </div>
          )}

        </div>
      </div>
    </PageComponent>
    )
  );

}