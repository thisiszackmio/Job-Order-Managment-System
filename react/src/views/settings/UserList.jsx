import { useEffect, useState } from "react";
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
  const [pageRestrict, setPageRestrict] = useState(true);

  // User List
  const [userList, setUserList] = useState([]);

  const fetchUserList = async () => {
    try {
      const response = await axiosClient.get(`/showusers`);
      const dataUserList = response.data;

      setUserList(dataUserList);

      if(Access) {
        setPageRestrict(true);
      } else {
        setPageRestrict(false);
      }

    }catch(error){
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    if(currentUserId){
      fetchUserList();
    }
  }, [currentUserId]);

  //Search Filter and Pagination
  const itemsPerPage = 25;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset page when searching
  };

  const filteredUser = userList.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCountUser = Math.ceil(filteredUser.length / itemsPerPage);
  const displayPaginationUser = pageCountUser > 1;

  const currentUser = filteredUser.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const roles = ["NERD", "AUS"];
  const Access = roles.some(role => codes.includes(role));

  return(
    !pageRestrict ? (
      <Restrict />
    ):(
    <PageComponent title="Employee List">
      <div className="ppa-widget request-form px-4 pb-6 mt-8">
        {/* Header */}
        <div className="joms-user-info-header text-left"> 
          Employee's Lists
        </div>
        {/* Table */}
        <div className="mt-4">
          {/* Search Filter */}
          <div className="mb-4 flex">
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
                Total of {userList.length} user's list
              </div>
            </div>
          </div>
          {/* Top Pagination */}
          <div>
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
                activeClassName="active"
              />
            )}
          </div>
          {/* List */}
          <div className="ppa-div-table mt-4 pb-3 overflow-x-auto md:overflow-x-visible">
            <table className="ppa-table w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-center ppa-table-header">ID</th>
                  <th className="px-4 py-2 text-center ppa-table-header">Avatar</th>
                  <th className="px-4 py-2 text-left ppa-table-header">Name</th>
                  <th className="px-4 py-2 text-left ppa-table-header">Division</th>
                  <th className="px-4 py-2 text-left ppa-table-header">Position</th>
                  <th className="px-4 py-2 text-left ppa-table-header">Username</th>  
                  <th className="px-4 py-2 text-left ppa-table-header">Badge</th>
                  <th className="px-4 py-2 text-center ppa-table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-2 py-5 text-center ppa-table-body">
                      <div className="flex justify-center items-center">
                        <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                        <span className="loading-table">Loading List</span>
                      </div>
                    </td>
                  </tr>
                ):(
                  currentUser.length > 0 ? (
                    currentUser.map((getData)=>(
                      <tr key={getData.id}>
                        <td className="px-3 py-2 text-center ppa-table-body">{getData.id}</td>
                        <td className="px-3 py-2 text-center ppa-table-body w-24"><img src={getData.avatar} className="ppa-avatar" alt="" /></td>
                        <td className="px-3 py-2 text-left ppa-table-body"><Link to={`/joms/userdetails/${getData.id}`}><strong>{getData.name}</strong></Link></td>
                        <td className="px-3 py-2 text-left ppa-table-body">{getData.division}</td>
                        <td className="px-3 py-2 text-left ppa-table-body">{getData.position}</td>
                        <td className="px-3 py-2 text-left ppa-table-body">{getData.username}</td>
                        <td className="px-3 py-2 text-left ppa-table-body">
                          <div className="flex flex-col gap-1">
                            {getData.code_clearance.split(",").map((code, index) => (
                              <span key={index} className={`badge badge-${code.trim()}`}>
                                {code.trim()}
                              </span>
                            ))}
                          </div>
                        </td>
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
              activeClassName="active"
            />
          )}
        </div>
      </div>
    </PageComponent>
    )
  );
}