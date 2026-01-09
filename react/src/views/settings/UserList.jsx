import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import loading_table from "/default/ring-loading.gif";
import loadingAnimation from '/default/loading-new.gif';
import ppalogo from '/default/ppa_logo-st.png';
import { useUserStateContext } from "../../context/ContextProvider";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import Restrict from "../../components/Restrict";

export default function UserListJLMS(){
  const { currentUserCode } = useUserStateContext();

  // loading Function
  const [loading, setLoading] = useState(true);
  const [loadingArea, setLoadingArea] = useState(true);

  const [userList, setUserList] = useState([]);

  // Disable the Scroll on Popup
  useEffect(() => {
  
    // Define the classes to be added/removed
    const loadingClass = 'loading-show';

    // Function to add the class to the body
    const addLoadingClass = () => document.body.classList.add(loadingClass);

    // Function to remove the class from the body
    const removeLoadingClass = () => document.body.classList.remove(loadingClass);

    // Add or remove the class based on showPopup state
    if(loading) {
      addLoadingClass();
    }
    else {
      removeLoadingClass();
    }

    // Cleanup function to remove the class when the component is unmounted or showPopup changes
    return () => {
      removeLoadingClass();
    };
  }, [loading]);

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
      setLoading(false);
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
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Authorize = codes.includes("GSO") || codes.includes("DM") || codes.includes("AM") || codes.includes("PM") || codes.includes("HACK");

  return(
    <PageComponent title="Employee List">

      {Authorize ? (
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
                <th className="px-4 py-2 text-center ppa-table-header">ID</th>
                <th className="px-4 py-2 text-center ppa-table-header">Avatar</th>
                <th className="px-4 py-2 text-center ppa-table-header">Name</th>
                <th className="px-4 py-2 text-center ppa-table-header">Division</th>
                <th className="px-4 py-2 text-center ppa-table-header">Position</th>
                <th className="px-4 py-2 text-center ppa-table-header">Username</th>  
                <th className="px-4 py-2 text-center ppa-table-header">Clearance</th>
                <th className="px-4 py-2 text-center ppa-table-header">Status</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#fff' }}>
              {loadingArea ? (
                <tr>
                  <td colSpan={8} className="px-2 py-2 text-center text-sm text-gray-600">
                    <div className="flex justify-center items-center py-4">
                      <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                      <span className="loading-table">Loading Employee List</span>
                    </div>
                  </td>
                </tr>
              ):(
                currentUser.length > 0 ? (
                  currentUser.map((getData)=>(
                    <tr key={getData.id}>
                      <td className="px-3 py-2 text-center ppa-table-body">{getData.id}</td>
                      <td className="px-3 py-2 text-center ppa-table-body w-24"><img src={getData.avatar} className="ppa-avatar" alt="" /></td>
                      <td className="px-3 py-2 text-center ppa-table-body"><Link to={`/joms/userdetails/${getData.id}`}>{getData.name}</Link></td>
                      <td className="px-3 py-2 text-center ppa-table-body">{getData.division}</td>
                      <td className="px-3 py-2 text-center ppa-table-body">{getData.position}</td>
                      <td className="px-3 py-2 text-center ppa-table-body">{getData.username}</td>
                      <td className="px-3 py-2 text-center ppa-table-body">{getData.code_clearance}</td>
                      <td className="px-3 py-2 text-center ppa-table-body">
                        {getData.status == 0 && (<FontAwesomeIcon className="user-deleted" title="Deleted" icon={faCircle} />)}
                        {getData.status == 1 && (<FontAwesomeIcon className="user-active" title="Active" icon={faCircle} />)}
                        {getData.status == 2 && (<FontAwesomeIcon className="user-need" title="Not Activate" icon={faCircle} />)}
                      </td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={8} className="px-2 py-2 text-center text-sm text-gray-600">
                      No records found.
                    </td>
                  </tr>
                )
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
      ):(
        <Restrict />
      )}
      
    </PageComponent>
  );
}