import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import loading_table from "/default/ring-loading.gif";
import { useUserStateContext } from "../../context/ContextProvider";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function UserListJLMS(){

  const { userCode } = useUserStateContext();

  // Loading
  const [loadingArea, setLoadingArea] = useState(true);

  const [userList, setUserList] = useState([]);

  // Get User Employee's Data
  useEffect(() => {  
    axiosClient
    .get('/showusers')
    .then((response) => {
      const responseData = response.data;

      const mappedData = responseData.map((UserItem) => {
        return{
          id: UserItem.id,
          name: UserItem.name,
          username: UserItem.username,
          division: UserItem.division,
          position: UserItem.position,
          code_clearance: UserItem.code_clearance,
          avatar: UserItem.avatar,
          status: UserItem.status
        }
      });

      setUserList(mappedData)
    })
    .finally(() => {
      setLoadingArea(false);
    });

  }, []);

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

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Restrictions Condition
  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Authorize = codes.includes("HACK") || codes.includes("GSO") || codes.includes("DM") || codes.includes("AM") || codes.includes("PM");

  return(
    Authorize ? (
      <PageComponent title="Employee List">
        {/* Main Content */}
        <div className="font-roboto">
          {/* Search Filter */}
          <div className="mt-5 mb-4 flex">

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

          {/* Table */}
          <table className="ppa-table w-full mb-10 mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-3 text-center text-sm w-1 font-medium text-gray-600 uppercase">ID</th>
                <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Avatar</th>
                <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Name</th>
                <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Division</th>
                <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Position</th>
                <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Username</th>  
                <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Clearance</th>
                <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#fff' }}>
            {loadingArea ? (
              <tr>
                <td colSpan={8} className="px-2 py-4 text-center text-sm text-gray-600">
                  <div className="flex justify-center items-center">
                    <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                    <span className="loading-table">Loading Employees</span>
                  </div>
                </td>
              </tr>
            ):(
            <>
              {currentUser.length > 0 ? (
                currentUser.map((getData)=>(
                  <tr key={getData.id}>
                    <td className="px-3 py-2 text-center table-font">{getData.id}</td>
                    <td className="px-3 py-2 text-center table-font w-24"><img src={getData.avatar} className="ppa-avatar" alt="" /></td>
                    <td className="px-3 py-2 text-left table-font"><Link to={`/userdetails/${getData.id}`}>{getData.name}</Link></td>
                    <td className="px-3 py-2 text-center table-font">{getData.division}</td>
                    <td className="px-3 py-2 text-center table-font">{getData.position}</td>
                    <td className="px-3 py-2 text-center table-font">{getData.username}</td>
                    <td className="px-3 py-2 text-center table-font">{getData.code_clearance}</td>
                    <td className="px-3 py-2 text-center table-font">{getData.status == 1 || getData.status == 2 ? ("Active") : ("Deleted")}</td>
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan={8} className="px-2 py-2 text-center text-sm text-gray-600">
                    No records found.
                  </td>
                </tr>
              )}
            </>
            )}
            </tbody>
          </table>
          {/* Pagination */}
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
      </PageComponent>
    ):(
      (() => { window.location = '/unauthorize'; return null; })()
    )
  )
}