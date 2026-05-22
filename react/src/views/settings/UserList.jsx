import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import loading_table from "/default/ring-loading.gif";
import { useUserStateContext } from "../../context/ContextProvider";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import Restrict from "../../components/Restrict";

export default function UserListJLMS(){
  const { currentUserId, currentUserCode } = useUserStateContext();

  // loading Function
  const [loading, setLoading] = useState(true);

  // Page Restrict
  const [pageRestrict, setPageRestrict] = useState(true);

  // User List
  const [userList, setUserList] = useState([]);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [lastUserPage, setLastUserPage] = useState(1);
  const [searchUser, setSearchUser] = useState('');

  const fetchUserList = async (page = 1, searchValue = searchUser) => {
    try{
      setLoading(true);
      const UserRes = await axiosClient.get(`/showusers?user_page=${page}&search=${searchValue}`);

      // console.log(UserRes.data.data);
      setUserList(UserRes.data.data);
      setCurrentUserPage(UserRes.data.current_page);
      setLastUserPage(UserRes.data.last_page);

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

  // Update Remove user
  const RemoveUserData = async () => {
    try{
      setLoading(true);
      const UserRes = await axiosClient.put(`/permamentdeleteuser`);

      console.log("Some user's are deleted");

    }catch(error){
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const clearanceOrder = [ 'PM', 'AM', 'DM', 'GSO', 'HACK', 'AUS', 'AUI', 'AUF', 'AUV', 'SEC', 'AP', 'MEM' ];

  useEffect(() => { 
    if(currentUserId){
      fetchUserList();
      RemoveUserData();
    }
  }, [currentUserId]);

  // For search in User
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUserList(1, searchUser);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchUser]);

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const roles = ["HACK", "AUS"];
  const accessOnly = roles.some(role => codes.includes(role));

  return(
    !pageRestrict ? (<Restrict />):(
      <PageComponent title="Employee List">
        <div className="ppa-widget request-form px-4 pb-6 mt-8">
          {/* Header */}
          <div className="joms-user-info-header text-left"> 
            Employee's Lists
          </div>

          {/* Top */}
          <div className="pt-3">
            <div className="flex w-full justify-between items-center">

              {/* Search (LEFT) */}
              <input
                type="text"
                placeholder="Search here ..."
                value={searchUser}
                onChange={(e) =>
                  setSearchUser(e.target.value)
                }
                className="block w-1/4 focus:ring-0 ppa-form-field-en"
              />

              {/* Page Count (RIGHT) */}
              <div className="text-sm text-right px-2">
                Page {currentUserPage} of {lastUserPage}
              </div>

            </div>
          </div>

          {/* Pagination Top */}
          {lastUserPage > 1 && !loading && (
            <div className="flex gap-2 mt-4 items-center">
              {/* Prev */}
              <button
                disabled={currentUserPage === 1}
                onClick={() => fetchUserList(currentUserPage - 1)}
                className="px-2 py-1 ppa-add-form text-sm"
              >
                <FontAwesomeIcon
                  title="Prev"
                  icon={faChevronLeft}
                />
              </button>

              {/* Page Numbers */}
              {(() => {
                const pages = [];

                // Always show first page
                pages.push(1);

                // Current page range
                for (
                  let i = Math.max(2, currentUserPage - 1);
                  i <= Math.min(lastUserPage - 1, currentUserPage + 1);
                  i++
                ) {
                  pages.push(i);
                }

                // Always show last page
                if (lastUserPage > 1) {
                  pages.push(lastUserPage);
                }

                // Remove duplicates
                const uniquePages = [...new Set(pages)];

                return uniquePages.map((page, index) => {
                  const prevPage = uniquePages[index - 1];

                  return (
                    <React.Fragment key={page}>

                      {/* Show dots */}
                      {prevPage && page - prevPage > 1 && (
                        <span className="px-2">...</span>
                      )}

                      {/* Page Button */}
                      <button
                        onClick={() => fetchUserList(page)}
                        className={`px-3 py-1 text-sm rounded ${
                          currentUserPage === page
                            ? 'ppa-form-confirm text-white'
                            : 'ppa-add-form'
                        }`}
                      >
                        {page}
                      </button>

                    </React.Fragment>
                  );
                });
              })()}

              {/* Next */}
              <button
                disabled={currentUserPage === lastUserPage}
                onClick={() => fetchUserList(currentUserPage + 1)}
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
                  <th className="px-4 py-2 w-[8%] text-center ppa-table-header">Avatar</th>
                  <th className="px-4 py-2 w-[12%] text-center ppa-table-header">User ID</th>
                  <th className="px-4 py-2 text-left ppa-table-header">Name</th>
                  <th className="px-4 py-2 text-left ppa-table-header">Division</th>
                  <th className="px-4 py-2 text-left ppa-table-header">Position</th>
                  <th className="px-4 py-2 text-center ppa-table-header">Badge</th>
                  <th className="px-4 py-2 text-center ppa-table-header">Username</th>
                  <th className="px-4 py-2 text-center ppa-table-header">Status</th>
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
                    <td className="px-2 py-2 ppa-table-body">
                      <div className="skeleton h-4"></div>
                    </td>
                  </tr>
                  ))
              ):(
                userList && userList?.length > 0 ? (
                  userList.map(getData => (
                    <tr key={getData.id}>
                      <td className="px-3 py-2 text-center ppa-table-body w-24"><img src={getData.avatar} className="ppa-avatar" alt="" /></td>
                      <td className="px-3 py-2 text-center ppa-table-body">{getData.joms_id ? getData.joms_id : "Null"}</td>
                      <td className="px-3 py-2 text-left ppa-table-body"><Link to={`/joms/userdetails/${getData.id}`}><strong>{getData.name}</strong></Link></td>
                      <td className="px-3 py-2 text-left ppa-table-body">{getData.division}</td>
                      <td className="px-3 py-2 text-left ppa-table-body">{getData.position}</td>
                      <td className="px-3 py-2 text-center ppa-table-body">
                        <div className="flex flex-col gap-1">

                          {getData?.code_clearance
                            ?.split(',')
                            .map(item => item.trim())
                            .sort(
                              (a, b) =>
                                clearanceOrder.indexOf(a) - clearanceOrder.indexOf(b)
                            )
                            .map((code, index, arr) => (
                              <div
                                key={index}
                                className={`w-auto badge-list badge-${code} ${
                                  index === arr.length - 1
                                    ? 'rounded-tr-[4px] rounded-br-[4px]'
                                    : ''
                                }`}
                              >
                                {code}
                              </div>
                            ))}

                        </div>
                      </td>
                      <td className="px-3 py-2 text-center ppa-table-body">{getData.username}</td>
                      <td className="px-3 py-2 text-center ppa-table-body">
                        {getData.status == 0 && (<span className="user-deleted" title="Deleted"> Deactivate </span>)}
                        {getData.status == 1 && (<span className="user-active" title="Active"> Active </span>)}
                        {getData.status == 2 && (<span className="user-need" title="Not Activate"> Need Activate </span>)}
                      </td>
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
        </div>
      </PageComponent>
    )
  );
}