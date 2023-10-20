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

  const [activeTab, setActiveTab] = useState("tab1");
  const [displayRequest, setDisplayRequest] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const { userRole, currentUser } = useUserStateContext();
  const [prePostRepair, setPrePostRepair] = useState([]);

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
            property_number: inspection_form.property_number,
            type_of_property: inspection_form.type_of_property,
            property_other_specific: inspection_form.property_other_specific,
            name: fname +' ' + mname+'. ' + lname,
            complain: inspection_form.complain,
            supervisorname: inspection_form.supervisor_name,
            supervisor_aprroval: inspection_form.supervisor_approval,
            admin_aprroval: inspection_form.admin_approval,
            remarks: inspection_form.remarks
          };
        });

        //console.log(mappedData);

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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return(
    <PageComponent title="Request List">
    {userRole === "admin" ?(
    <>
      <div className="flex">
        {/* Tab 1 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab1"
              ? "bg-gray-200 border-b-4 border-gray-800"
              : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab1")}
        >
          Request for Repair Inspection
        </button>
        {/* Tab 2 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab2"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab2")}
        >
          Request for use of Facility/Venue
        </button>
        {/* Tab 3 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab3"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab3")}
        >
          Request for Vehicle Slip
        </button>
        {/* Tab 4 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab4"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab4")}
        >
          Request for use of Manlift
        </button>
        {/* Tab 5 */}
        <button
          className={`w-full px-4 py-2 m-0 ${
            activeTab === "tab5"
            ? "bg-gray-200 border-b-4 border-gray-800"
            : "bg-gray-200 border-b-4 border-transparent hover:border-gray-500"
          }`}
          onClick={() => handleTabClick("tab5")}
        >
          Other Request
        </button>
      </div>

      <div className="mt-4">
      {activeTab === "tab1" && 
      <div>
        {loading ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center whitespace-nowrap">
                <FontAwesomeIcon icon={faSpinner} spin /> Loading...
              </td>
            </tr>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse mb-10">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 w-1 border-custom">Control No</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Date</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Property No</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Type of Property</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Complain</th>   
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Requestor</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Remarks</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase border-2 border-custom">Action</th>
                  </tr>
                </thead>
                <tbody>
                {prePostRepair.length > 0 ? (
                  prePostRepair.map((repair) => (
                    <tr key={repair.id}>
                      <td className="px-6 py-4 text-center border-2 border-custom">{repair.id}</td>
                      <td className="px-6 py-4 text-center border-2 border-custom">{formatDate(repair.date)}</td>
                      <td className="px-6 py-4 text-center border-2 border-custom">{repair.property_number}</td>
                      {repair.type_of_property === "Others" ? (
                        <td className="px-6 py-4 text-center border-2 border-custom">Others: <i>{repair.property_other_specific}</i></td>
                      ):(
                        <td className="px-6 py-4 text-center border-2 border-custom">{repair.type_of_property}</td>
                      )}
                      <td className="px-6 py-4 text-center border-2 border-custom">{repair.complain}</td>
                      <td className="px-6 py-4 text-center border-2 border-custom">{repair.name}</td>
                      <td className="px-6 py-4 text-center border-2 border-custom">
                      {repair.remarks === "The Request has been close you can view it now" ? "The Request is close" 
                      : repair.remarks === "The Inspector has completed your request. Waiting for GSO to close the request to view the form." ? "Needs to be close" 
                      : "Pending"}
                      </td>
        
                      <td className="px-6 py-4 text-center border-2 border-custom">
                        <div className="flex justify-center">
                          <Link to={`/repairinspectionform/${repair.id}`}>
                            <button 
                              className="bg-green-500 hover-bg-green-700 text-white font-bold py-2 px-2 rounded"
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
                    <td colSpan={8} className="px-6 py-4 text-center border-0 border-custom"> No data </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
        )}
      </div>
      }


      {activeTab === "tab2" && <div>Coming Soon</div>}
      {activeTab === "tab3" && <div>Coming Soon</div>}
      {activeTab === "tab4" && <div>Coming Soon</div>}
      {activeTab === "tab5" && <div>Coming Soon</div>}
      </div>

    </>
    ): 
    (
    <div>Access Denied. Only admins can view this page.</div>
    )}
    </PageComponent>
  )
}