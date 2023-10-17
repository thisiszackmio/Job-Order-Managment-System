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

export default function AdminRequestList()
{
  library.add(faCheck, faTimes, faEye, faStickyNote, faSpinner);
  const [loading, setLoading] = useState(true);

  const { userRole, currentUser } = useUserStateContext();
  const [prePostRepair, setPrePostRepair] = useState([]);

  const fetchTableData = () => {
    setLoading(true); // Set loading state to true when fetching data
    axiosClient
    .get('/inspectionformtwo')
    .then((response) => {
      const responseData = response.data;
      const requestListData = responseData.request_list;
      const personnelData = responseData.personnel;

      const processedData = requestListData.map((item) => {

        const { complain, date_of_request, full_name, id, property_no, approval } = item;

        const personnelItem = personnelData.find((p) => p.id === item.personnel_id);

        const personnel_name = personnelItem ? personnelItem.personnel_name : '';

        const processedItem = {
          complain,
          date_of_request,
          full_name,
          id,
          property_no,
          personnel_name,
          approval,
        };

        return processedItem;
      });

      // Log the processed data
      setPrePostRepair(processedData);
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Property No.</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Complain/Defect</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Assign Property Inspector</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Remarks</th>   
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">View</th>
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
              prePostRepair.length > 0 ? (
                prePostRepair.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{formatDate(item.date_of_request)}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{item.full_name}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{item.property_no}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{item.complain}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{item.personnel_name}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {item.approval === 1 ? "Approved" : item.approval === 2 ? "Disapprove" : "Need Approval"}
                    </td>
                    <td className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <div className="flex justify-center">
                        <Link to={`/admin_manager_view_inspection_request/${item.id}`}>
                          <button 
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded"
                            title="View Request"
                          >
                            <FontAwesomeIcon icon="eye" className="mr-0" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-center whitespace-nowrap" colSpan="6">No Request Needs to Approval Yet</td>
                </tr>
              )
            )}
            </tbody>
          </table>

        </div>
      </div>

      
    ): 
    (
    <div>Access Denied. Only admins can view this page.</div>
    )}
    </PageComponent>
  )
}