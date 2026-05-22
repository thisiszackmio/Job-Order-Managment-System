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

  const { currentUserCode, currentUserId } = useUserStateContext();

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
  const [pageRestrict, setPageRestrict] = useState(true);

  const [formlist, setFormList] = useState([]);
  const [currentFacPage, setCurrentFacPage] = useState(1);
  const [lastFacPage, setLastFacPage] = useState(1);
  const [searchFac, setSearchFac] = useState('');

  const fetchFacilityList = async (page = 1, searchValue = searchFac) => {
    try{
      setLoading(true);
      
      const FacRes = await axiosClient.get(`/allfacility?facility_page=${page}&search=${searchValue}`);

      // console.log(FacRes.data.data);
      setFormList(FacRes.data.data);
      setCurrentFacPage(FacRes.data.current_page);
      setLastFacPage(FacRes.data.last_page);

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

  // Get User Employee's Data
  useEffect(() => { 
    if(currentUserId){
      fetchFacilityList();
    }
  }, [currentUserId]);

  // For search in Facility
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchFacilityList(1, searchFac);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchFac]);

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const roles = ["HACK", "AUS", "AM", "AUF", "PM", "DM", "GSO" ];
  const accessOnly = roles.some(role => codes.includes(role));

  return(
    <PageComponent title="Request List">
      {!pageRestrict ? (<Restrict />) : (
      <div className="mt-8">
        <div className="ppa-widget px-4 pb-6">
          <div className="joms-user-info-header text-left"> 
            Facility / Venue Form List
          </div>

          {/* Top */}
          <div className="pt-3">
            <div className="flex w-full justify-between items-center">

              {/* Search (LEFT) */}
              <input
                type="text"
                placeholder="Search here ..."
                value={searchFac}
                onChange={(e) =>
                  setSearchFac(e.target.value)
                }
                className="block w-1/4 focus:ring-0 ppa-form-field-en"
              />

              {/* Page Count (RIGHT) */}
              <div className="text-sm text-right">
                Page {currentFacPage} of {lastFacPage}
              </div>

            </div>
          </div>

          {/* Pagination Top */}
          {lastFacPage > 1 && (
            <div className="flex gap-2 mt-4">
              {/* Prev */}
              <button
                disabled={currentFacPage === 1}
                onClick={() => fetchFacilityList(currentFacPage - 1)}
                className="px-2 py-1 ppa-add-form text-sm"
              >
                <FontAwesomeIcon
                  title="Prev"
                  icon={faChevronLeft}
                />
              </button>

              {/* Next */}
              <button
                disabled={currentFacPage === lastFacPage}
                onClick={() => fetchFacilityList(currentFacPage + 1)}
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
          <div className="ppa-div-table overflow-x-auto md:overflow-x-visible">
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
                Array.from({ length: 25 }).map((_, index) => (  // 5 skeleton rows
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
                  </tr>
                ))
              ):(
                formlist.length > 0 ? (
                  formlist.map((list)=>(
                    <tr key={list.id}>
                      <td className="px-4 py-4 font-bold text-center ppa-table-body-id">
                        <Link
                          to={`/joms/facilityvenue/form/${list.fac_id}`}
                          className="group flex justify-center items-center"
                        >
                          {/* Initially show the ID */}
                          <span className="group-hover:hidden">{list.fac_id}</span>

                          {/* Show the View Icon on hover */}
                          <span className="hidden group-hover:inline-flex items-center text-black rounded-md">
                            <FontAwesomeIcon icon={faEye} />
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-left ppa-table-body">{formatDate(list.fac_date_request)}</td>
                      <td className="px-4 py-4 text-left ppa-table-body">{list.fac_request_office}</td>
                      <td className="px-4 py-4 text-left ppa-table-body">{list.fac_title_of_activity}</td>
                      <td className="px-4 py-4 text-left ppa-table-body">
                        {list.fac_date_start === list.fac_date_end ? (
                          `${formatDate(list.fac_date_start)} @ ${formatTime(list.fac_time_start)} to ${formatTime(list.fac_time_end)}`
                        ):(
                          `${formatDate(list.fac_date_start)} @ ${formatTime(list.fac_time_start)} to ${formatDate(list.fac_date_end)} @ ${formatTime(list.fac_time_end)}`
                        )}
                      </td>
                      <td className="px-4 py-4 text-left ppa-table-body">
                        {list.mph ? "MPH":null}
                        {list.conference ? "Conference":null}
                        {list.dorm ? "Dormitory":null}
                        {list.other ? "Others":null}
                      </td>
                      <td className="px-4 py-4 text-left ppa-table-body">{list.fac_requestor}</td>
                      <td className="px-4 py-4 text-left ppa-table-body">{list.fac_remarks}</td>
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

          {/* Pagination Bottom */}
          {lastFacPage > 1 && (
            <div className="flex gap-2 mt-4">
              {/* Prev */}
              <button
                disabled={currentFacPage === 1}
                onClick={() => fetchFacilityList(currentFacPage - 1)}
                className="px-2 py-1 ppa-add-form text-sm"
              >
                <FontAwesomeIcon
                  title="Prev"
                  icon={faChevronLeft}
                />
              </button>

              {/* Next */}
              <button
                disabled={currentFacPage === lastFacPage}
                onClick={() => fetchFacilityList(currentFacPage + 1)}
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
      )}
    </PageComponent>
  );

}