import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTimes, faEye, faStickyNote, faSpinner  } from '@fortawesome/free-solid-svg-icons';

// Function to format the date as "Month Day, Year"
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default function RequestList()
{
  library.add(faCheck, faTimes, faEye, faStickyNote, faSpinner);
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const { userRole, currentUser } = useUserStateContext();
  const [prePostRepair, setPrePostRepair] = useState([]);

  const userClearance = currentUser.code_clearance;
  const userID = currentUser.id;

  const fetchTableData = () => {
    setLoading(true); // Set loading state to true when fetching data
    axiosClient
      .get('/requestrepair')
      .then((response) => {
        const responseData = response.data;
        const getRepair = Array.isArray(responseData) ? responseData : responseData.data;

        // Map the data and set it to your state
        const mappedData = getRepair.map((dataItem) => {
          // Extract inspection form and user details from each dataItem
          const { inspection_form, user_details } = dataItem;

          // Extract user details properties
          const { fname, mname, lname } = user_details;

          // Create a mapped data object
          return {
            id: inspection_form.id,
            date: formatDate(inspection_form.date_of_request),
            name: fname +' ' + mname+'. ' + lname,
            complain: inspection_form.complain,
            supervisorname: inspection_form.supervisor_name,
            supervisor_aprroval: inspection_form.supervisor_approval,
            admin_aprroval: inspection_form.admin_approval
          };
        });

        // Set the mapped data to your state using setPrePostRepair
        setPrePostRepair(mappedData);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => { fetchTableData(); }, []);

  const closePopup = () => { 
    setShowPopup(false); 
    setShowDetails(false);
  };

 // Supervisor click on approval 
 function handleApproveClick(id){

  // alert(id);
  const confirmed = window.confirm('Do you want to approve the request?');

  if(confirmed) {
    axiosClient.put(`/approve/${id}`)
    .then((response) => {
      setPopupMessage('Form Approve Successfully');
      setShowPopup(true);
      fetchTableData();
    })
    .catch((error) => {
      console.error(error);
      setPopupMessage('Failed to approve the form. Please try again later.');
      setShowPopup(true);
    });
  }

 };

  function handleDisapproveClick(id){
    //alert(id);
    const confirmed = window.confirm('Are you sure to disapprove the request?');

    if(confirmed) {
      axiosClient.put(`/disapprove/${id}`)
    .then((response) => {
      setPopupMessage('Form Disapprove Successfully');
      setShowPopup(true);
      fetchTableData();
    })
    .catch((error) => {
      console.error(error);
      setPopupMessage('Failed to approve the form. Please try again later.');
      setShowPopup(true);
    });
    }
    else{
      setPopupMessage('You change your mind');
      setShowPopup(true);
    }
  }

  return(
    <PageComponent title="Request List">
    {userRole === "admin" ?(
      <div className="mt-2">
        <div className="w-full overflow-x-auto">

          {/* Table */}
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Date of Requested</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Requested by</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Complain/Defect</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Supervisor Approval</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Admin Division Manager Approval</th>   
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center whitespace-nowrap">
                  <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                </td>
              </tr>
            ) : (
              prePostRepair.some((repair) => {
                const hasCorrectClearance = userClearance === 3;
                const isSupervisor = repair.supervisorname === userID;
                return hasCorrectClearance || isSupervisor;
              }) ? (
                prePostRepair.map((repair) => (
                  <tr key={repair.id}>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{repair.date}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{repair.name}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{repair.complain}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                    {
                      repair.supervisor_aprroval === 1
                      ? "Approved"
                      : repair.supervisor_aprroval === 2
                      ? "Disapproved" : "Pending"
                    }
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                    {
                      repair.admin_aprroval === 1
                      ? "Approved"
                      : repair.admin_aprroval === 2
                      ? "Disapproved" : "Pending"
                    }
                    </td>
                    {repair.supervisor_aprroval === 0 && (
                    <td className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <div className="flex">
                        <button 
                          onClick={() => handleApproveClick(repair.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                          title="Approve"
                        >
                          <FontAwesomeIcon icon="check" className="mr-0" />
                        </button>
                        <button 
                          onClick={() => handleDisapproveClick(repair.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ml-2"
                          title="Disapprove"
                        >
                          <FontAwesomeIcon icon="times" className="mr-0" />
                        </button>
                        <Link to={`/view_request_inspection/${repair.id}`}>
                          <button 
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded ml-2"
                            title="View Request"
                          >
                            <FontAwesomeIcon icon="eye" className="mr-0" />
                          </button>
                        </Link>
                      </div>
                    </td>
                    )}
                    { (repair.supervisor_aprroval === 1 || repair.supervisor_aprroval === 2) && (
                      <td className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                        <Link to={`/view_request_inspection/${repair.id}`}>
                          <button 
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded ml-2"
                            title="View Request"
                          >
                            <FontAwesomeIcon icon="eye" className="mr-0" />
                          </button>
                        </Link>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-center whitespace-nowrap" colSpan="6">No request approval for you yet</td>
                </tr>
              )
            )}
            </tbody>
          </table>

          {/* Show Successfull Popup */}
          {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
           {/* Semi-transparent black overlay */}
           <div
             className="fixed inset-0 bg-black opacity-40" // Close on overlay click
           ></div>
           {/* Popup content with background blur */}
           <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg">
             <p className="text-lg">{popupMessage}</p>
             <div className="flex justify-center mt-4">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
           </div>
          </div>
          )}

        </div>
      </div>

      
    ): 
    (
    <div>Access Denied. Only admins can view this page.</div>
    )}
    </PageComponent>
  )
}