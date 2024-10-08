import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import loadingAnimation from '/ppa_logo_animationn_v4.gif';
import { useUserStateContext } from "../../context/ContextProvider";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function UserListJLMS(){

  const { userCode } = useUserStateContext();

  // Loading
  const [loading, setLoading] = useState(true);

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
  const Authorize = codes.includes("HACK") || codes.includes("GSO");

  return(
    Authorize ? (
      <PageComponent title="Employee List">
        {loading ? (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
            <img
              className="mx-auto h-44 w-auto"
              src={loadingAnimation}
              alt="Your Company"
            />
            <span className="loading-text loading-animation">
            {Array.from("Loading...").map((char, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>{char}</span>
            ))}
            </span>
          </div>
        ):(
        <>
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
                  Total of {currentUser.length} user's list
                </div>
              </div>

            </div>

            {/* Table */}
            <table className="ppa-table w-full mb-10 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-3 text-center text-sm w-1 font-medium text-gray-600 uppercase">User ID</th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Avatar</th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Name</th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Division</th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Position</th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Username</th>  
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Code CLR</th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#fff' }}>
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
                    <td className="px-3 py-2 text-center table-font">{getData.status == 1 ? ("Active") : ("Deleted")}</td>
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan={8} className="px-2 py-2 text-center text-sm text-gray-600">
                    No records found.
                  </td>
                </tr>
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
        </>
        )}
      </PageComponent>
    ):(
      (() => { window.location = '/unauthorize'; return null; })()
    )
  )
}