import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import { useUserStateContext } from "../context/ContextProvider";
import axiosClient from "../axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useParams } from "react-router-dom";

export default function MyRequest(){
  const { currentUser } = useUserStateContext();
  const {id} = useParams();

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

  const[displayRequest, setDisplayRequest] = useState([]);
  const [inputErrors, setInputErrors] = useState('');

  const [activeTab, setActiveTab] = useState("tab1");
  
  library.add(faSpinner);
  const [loading, setLoading] = useState(true);

  const fetchUser = () => {
    axiosClient
    .get(`/myinspecreq/${id}`)
    .then((response) => {
        const responseData = response.data;
        const viewRequestData = responseData.view_request;
        const userDetails = responseData.my_user;

        setDisplayRequest({
          viewRequestData: viewRequestData,
          userDetails: userDetails,
        });

        setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
        console.error('Error fetching data:', error);
    });
  }

    useEffect(()=>{
      fetchUser();
    },[id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  return(
    <PageComponent title="My Request List">
    {/* {currentUser.fname} */}

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
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Date of Requested</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Property No.</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Acquisition Date</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Acquisition Cost</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Brand/Model</th>   
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Serial/Engine No.</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Type of Property</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Complain/Defect</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                  {displayRequest.viewRequestData ? (
                    <tr>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{formatDate(displayRequest.viewRequestData.date_of_request)}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{displayRequest.viewRequestData.property_number}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{formatDate(displayRequest.viewRequestData.acq_date)}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{displayRequest.viewRequestData.acq_cost}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{displayRequest.viewRequestData.brand_model}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{displayRequest.viewRequestData.serial_engine_no}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{displayRequest.viewRequestData.type_of_property}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{displayRequest.viewRequestData.property_description}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{displayRequest.viewRequestData.location}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{displayRequest.viewRequestData.complain}</td>
                      {(displayRequest.viewRequestData.supervisor_approval === 0 && displayRequest.viewRequestData.admin_approval === 0) && 
                      (
                        <td className="px-6 py-4 text-center whitespace-nowrap">Waiting for Supervisor Approval</td>
                      )}
                      {(displayRequest.viewRequestData.supervisor_approval === 1 && displayRequest.viewRequestData.admin_approval === 0) && 
                      (
                        <td className="px-6 py-4 text-center whitespace-nowrap">Waiting for Maam Daisy's Approval</td>
                      )}
                    </tr>
                  ):(
                    <tr>
                      <td colSpan="10" className="px-6 py-4 text-center whitespace-nowrap">No Request</td>
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

    </PageComponent>
  );
}