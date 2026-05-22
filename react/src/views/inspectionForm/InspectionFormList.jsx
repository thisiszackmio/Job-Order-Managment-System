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
  const [currentInspPage, setCurrentInspPage] = useState(1);
  const [lastInspPage, setLastInspPage] = useState(1);
  const [searchInsp, setSearchInsp] = useState('');

  const fetchInspectionList = async (page = 1, searchValue = searchInsp) => {
    try{
      setLoading(true);
      const InspRes = await axiosClient.get(`/allinspection?inspection_page=${page}&search=${searchValue}`);
      
      // console.log(InspRes.data.last_page);
      setFormList(InspRes.data.data);
      setCurrentInspPage(InspRes.data.current_page);
      setLastInspPage(InspRes.data.last_page);

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

  // For search in Inspection
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchInspectionList(1, searchInsp);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchInsp]);

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

            {/* Top */}
            <div className="pt-3">
              <div className="flex w-full justify-between items-center">

                {/* Search (LEFT) */}
                <input
                  type="text"
                  placeholder="Search here ..."
                  value={searchInsp}
                  onChange={(e) =>
                    setSearchInsp(e.target.value)
                  }
                  className="block w-1/4 focus:ring-0 ppa-form-field-en"
                />

                {/* Page Count (RIGHT) */}
                <div className="text-sm text-right px-2">
                  Page {currentInspPage} of {lastInspPage}
                </div>

              </div>
            </div>

            {/* Pagination Top */}
            {lastInspPage > 1 && (
              <div className="flex gap-2 mt-4">
                {/* Prev */}
                <button
                  disabled={currentInspPage === 1}
                  onClick={() => fetchInspectionList(currentInspPage - 1)}
                  className="px-2 py-1 ppa-add-form text-sm"
                >
                  <FontAwesomeIcon
                    title="Prev"
                    icon={faChevronLeft}
                  />
                </button>

                {/* Next */}
                <button
                  disabled={currentInspPage === lastInspPage}
                  onClick={() => fetchInspectionList(currentInspPage + 1)}
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
            <div className="ppa-div-table mt-2 pb-3 overflow-x-auto md:overflow-x-visible">
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
                  Array.from({ length: 25 }).map((_, index) => (  // 5 skeleton rows
                    <tr key={index}>
                      <td className="px-2 py-4 ppa-table-body">
                        <div className="skeleton h-4"></div>
                      </td>
                      <td className="px-2 py-2 ppa-table-body">
                        <div className="skeleton h-4"></div>
                      </td>
                      <td className="px-2 py-2 ppa-table-body">
                        <div className="skeleton h-4"></div>
                      </td>
                      <td className="px-2 py-2 ppa-table-body">
                        <div className="skeleton h-4"></div>
                      </td>
                      <td className="px-2 py-2 ppa-table-body">
                        <div className="skeleton h-4"></div>
                      </td>
                      <td className="px-2 py-2 ppa-table-body">
                        <div className="skeleton h-4"></div>
                      </td>
                      <td className="px-2 py-2 ppa-table-body">
                        <div className="skeleton h-4"></div>
                      </td>
                    </tr>
                  ))
                ):(
                  formlist && formlist?.length > 0 ? (
                    formlist.map(list => (
                      <tr key={list.id}>
                        <td className="px-4 py-2 font-bold text-center ppa-table-body-id">
                          <Link
                            to={`/joms/inspection/form/${list.repair_id}`}
                            className="group flex justify-center items-center"
                          >
                            {/* Initially show the ID */}
                            <span className="group-hover:hidden">{list.repair_id}</span>

                            {/* Show the View Icon on hover */}
                            <span className="hidden group-hover:inline-flex items-center text-black rounded-md">
                              <FontAwesomeIcon icon={faEye} />
                            </span>
                          </Link>
                        </td>
                        <td className="px-2 py-2 md:px-4 md:py-2 w-[10%] text-left ppa-table-body">{formatDate(list.repair_date_request)}</td>
                        <td className="px-2 py-2 md:px-4 md:py-2 w-[15%] text-left ppa-table-body">{list.repair_type}</td>
                        <td className="px-2 py-2 md:px-4 md:py-2 w-[15%] text-left ppa-table-body">{list.repair_description}</td>
                        <td className="px-2 py-2 md:px-4 md:py-2 w-[15%] text-left ppa-table-body">{list.repair_complain}</td>
                        <td className="px-2 py-2 md:px-4 md:py-2 w-[15%] text-left ppa-table-body">{list.repair_requestor}</td>
                        <td className="px-2 py-2 md:px-4 md:py-2 w-[15%] text-left ppa-table-body">{list.repair_remarks}</td>
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

            {/* Pagination Bottom */}
            {lastInspPage > 1 && (
              <div className="flex gap-2 mt-2">
                {/* Prev */}
                <button
                  disabled={currentInspPage === 1}
                  onClick={() => fetchInspectionList(currentInspPage - 1)}
                  className="px-2 py-1 ppa-add-form text-sm"
                >
                  <FontAwesomeIcon
                    title="Prev"
                    icon={faChevronLeft}
                  />
                </button>

                {/* Next */}
                <button
                  disabled={currentInspPage === lastInspPage}
                  onClick={() => fetchInspectionList(currentInspPage + 1)}
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
    ):(
      <Restrict />
    )
  )

}