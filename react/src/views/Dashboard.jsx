import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye  } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import loadingAnimation from '../assets/loading.gif';

// Function to format the date as "Month Day, Year"
function formatDate(dateString) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// To refrain return null on reloading the page
const storedUserData = JSON.parse(localStorage.getItem('USER'));

export default function Dashboard()
{
  library.add( faEye);
  const [isLoading , setLoading] = useState(true);

  const { currentUser } = useUserStateContext();
  const [assignPersonnel, setAssignPersonnel] = useState([]);
  const [getFormInspection, setFormInspection] = useState([]);
  const [getGSOInspection, setGSOInspection] = useState([]);
  const [getAdminInspection, setAdminInspection] = useState([]);
  const [getStatus, setStatus] = useState([]);
  const [hasError, setHasError] = useState('');


  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  //Check for the Assign Personnel List
  const fetchPersonneData = () => {
    axiosClient
    .get(`/getpersonnel/${storedUserData.id}`)
    .then((response) => {
      const responseData = response.data;
      const inspectionDetails = responseData.inspection_details;
      const inspectionStatus = responseData.inspection_status;
    
      // Map the data to an array of IDs
      const mappedData = inspectionDetails.map((dataItem) => {
        return {
          id: dataItem.id,
          date_requested: dataItem.date_requested,
          requester: dataItem.requester,
          property_no: dataItem.property_no,
          description: dataItem.description,
          location: dataItem.location,
          complain: dataItem.complain,
        };
      });

      const getStat = inspectionStatus.map((stats) => {
        return{
          status: stats.status
        };
      });
    
      setAssignPersonnel(mappedData);
      setStatus(getStat);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching personnel data:', error);

      if (error.response.data.message === 'No data'){
        setHasError('Not Allowed');
        setLoading(false);
      } else {
        setHasError('Not Assigned');
        setLoading(false);
      }
    });
  };

  //Get All the Inspection Form
  const fetchInspectionFormData = () => {
    axiosClient
      .get(`/inspectiondetails/${storedUserData.id}`)
      .then((response) => {
        const responseData = response.data;
        const getDet = responseData.inspection_form_details;

        const mappedData = getDet.map((getItem) => {
          return {
            id: getItem.id,
            date_requested: getItem.date_requested,
            requester: getItem.requester,
            property_no: getItem.property_no,
            description: getItem.description,
            location: getItem.location,
            complain: getItem.complain,
            supervisor_approval: getItem.supervisor_approval
          };
        });

        setFormInspection(mappedData);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  //For GSO
  const fetchGSOFormData = () => {
    axiosClient
      .get('/inspectiondetails')
      .then((response) => {
        const responseData = response.data;
        const gsoDet = responseData.inspection_details;

        const mappedData = gsoDet.map((gsoItem) => {
          return {
            id: gsoItem.id,
            date_requested: gsoItem.date_requested,
            requester: gsoItem.requester,
            property_no: gsoItem.property_no,
            description: gsoItem.description,
            location: gsoItem.location,
            complain: gsoItem.complain,
            supervisor_approval: gsoItem.supervisor_approval
          };
        });
        
        setGSOInspection(mappedData);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  // For Admin
  const fetchAdminFormData = () => {
    axiosClient
      .get('/inspectionadmin')
      .then((response) => {
        const responseData = response.data;
        const gsoDet = responseData.inspection_details;

        const mappedData = gsoDet.map((gsoItem) => {
          return {
            id: gsoItem.id,
            date_requested: gsoItem.date_requested,
            requester: gsoItem.requester,
            property_no: gsoItem.property_no,
            description: gsoItem.description,
            location: gsoItem.location,
            complain: gsoItem.complain,
            supervisor_approval: gsoItem.supervisor_approval
          };
        });
        
        setAdminInspection(mappedData);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => { 
    fetchPersonneData();
    fetchInspectionFormData();
    fetchGSOFormData();
    fetchAdminFormData();
  }, []);

  return(
    <PageComponent title={`${getTimeOfDay()}! ${currentUser.gender === 'Male' ? 'Sir' : 'Maam'} ${currentUser.fname}`}>

    {isLoading ? (
      <div className="flex items-center justify-center">
        <img src={loadingAnimation} alt="Loading" className="h-10 w-10" />
        <span className="ml-2">Loading Dashboard...</span>
      </div>
    ):(
    <>
    {/* For Notifications */}
    <div>
      {/* For Personnel Details */}
      {hasError === 'Not Allowed' ? ( null ) 
      : hasError === 'Not Assigned' ? (
        <div className="border border-solid border-gray-300 rounded-lg p-4">
          <h3 className="text-l font-normal leading-6 text-gray-900">You have not assign yet {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b></h3>
        </div>
      ) : assignPersonnel && (
      <>
        <div className="mt-6 pb-4">
          <h3 className="text-xl font-bold leading-6 text-gray-900">Notification</h3>
        </div>

        <div className="border border-solid border-gray-300 rounded-lg p-4">
          <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b> you have a assign for you</h3>
        
          <div className="max-h-96 overflow-y-scroll mt-6">
            <table className="table-auto border-collapse w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Control No</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Date Requested</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Requester</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Property Number</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Description</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Location</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Complain</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">View</th>
                </tr>
              </thead>
              <tbody>
              {getStatus.length > 0 ? (
              assignPersonnel.map((item) => (
              <tr key={item.id}>
                <td className="text-center whitespace-nowrap border-b-2 w-20 body-border">{item.id}</td>
                <td className="text-center whitespace-nowrap border-b-2 body-border">{formatDate(item.date_requested)}</td>
                <td className="text-center whitespace-nowrap border-b-2 body-border">{item.requester}</td>
                <td className="px-6 py-3 text-center border-b-2 body-border">{item.property_no}</td>
                <td className="text-center whitespace-nowrap border-b-2 body-border">{item.description}</td>
                <td className="text-center whitespace-nowrap border-b-2 body-border">{item.location}</td>
                <td className="px-6 py-3 text-center border-b-2 w-60 body-border">{item.complain}</td>
                <td className="text-center text-xs font-medium text-gray-600 w-24 uppercase tracking-wider border-b-2 body-border">
                  <div className="flex justify-center">
                    <Link to={`/repairinspectionform/${item.id}`}>
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
              ):(
              <tr>
                <td colSpan={8} className="text-center whitespace-nowrap border-b-2 body-border p-4">No Request for you</td>
              </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </>
      )}

      {/* For Supervisor */}
      {currentUser.code_clearance === 2 ? (
      <>
        <div className="mt-6 pb-4">
          <h3 className="text-xl font-bold leading-6 text-gray-900">Notification</h3>
        </div>

        <div className="border border-solid border-gray-300 rounded-lg p-4">
          <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b> you have a request that needs your approval</h3>
          
          <div className="max-h-96 overflow-y-scroll mt-6">
            <table className="table-fixed border-collapse w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Date Requested</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Requester</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Property Number</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Description</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Location</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Complain</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">View</th>
                </tr>
              </thead>
              <tbody>
              {getFormInspection && getFormInspection.length > 0 ? (
                getFormInspection.every(item => item.supervisor_approval === 1) ? (
                  <tr>
                    <td colSpan={7} className="text-center whitespace-nowrap p-5">
                      No Request for you Yet
                    </td>
                  </tr>
                ) : (
                  getFormInspection.map((item) => (
                    <tr key={item.id}>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{formatDate(item.date_requested)}</td>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{item.requester}</td>
                      <td className="px-6 py-3 text-center border-b-2 body-border">{item.property_no}</td>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{item.description}</td>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{item.location}</td>
                      <td className="px-6 py-3 text-center border-b-2 body-border">{item.complain}</td>
                      <td className="text-center text-xs font-medium text-gray-600 uppercase tracking-wider border-b-2 body-border">
                        <div className="flex justify-center">
                          <Link to={`/repairinspectionform/${item.id}`}>
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
                )
              ) : (
                <tr>
                  <td colSpan={7} className="text-center whitespace-nowrap p-5">No Request for you Yet</td>
                </tr>
              )}


              </tbody>
            </table>
          </div>

        </div>
      </>
      ): null }

      {/* For GSO or Authorize Person */}
      {currentUser.code_clearance === 3 ? (
      <>
        <div className="mt-6 pb-4">
          <h3 className="text-xl font-bold leading-6 text-gray-900">Notification</h3>
        </div>

        <div className="border border-solid border-gray-300 rounded-lg p-4">
          <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b> these are the forms that are approved by the Supervisor</h3>
          
          <div className="max-h-96 overflow-y-scroll mt-6">
            <table className="table-fixed border-collapse w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Date Requested</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Requester</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Property Number</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Description</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Location</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Complain</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">View</th>
                </tr>
              </thead>
              <tbody>
              {getGSOInspection && getGSOInspection.length > 0 ? (
                getGSOInspection.every(items => items.admin_approval === 0) ? (
                  <tr>
                    <td colSpan={7} className="text-center whitespace-nowrap p-5">
                      No Request for you Yet
                    </td>
                  </tr>
                ) : (
                  getGSOInspection.map((item) => (
                    <tr key={item.id}>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{formatDate(item.date_requested)}</td>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{item.requester}</td>
                      <td className="px-6 py-3 text-center border-b-2 body-border">{item.property_no}</td>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{item.description}</td>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{item.location}</td>
                      <td className="px-6 py-3 text-center border-b-2 body-border">{item.complain}</td>
                      <td className="text-center text-xs font-medium text-gray-600 uppercase tracking-wider border-b-2 body-border">
                        <div className="flex justify-center">
                          <Link to={`/repairinspectionform/${item.id}`}>
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
                )
              ) : (
                <tr>
                  <td colSpan={7} className="text-center whitespace-nowrap p-5">No Request for you Yet</td>
                </tr>
              )}


              </tbody>
            </table>
          </div>

        </div>
      </>
      ): null }

      {/* For the Manager */}
      {currentUser.code_clearance === 1 ? (
      <>
        <div className="mt-6 pb-4">
          <h3 className="text-xl font-bold leading-6 text-gray-900">Notification</h3>
        </div>

        <div className="border border-solid border-gray-300 rounded-lg px-2 py-4">
          <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b> these are the forms that are need to be approved</h3>
        
          <div className="max-h-96 overflow-y-scroll mt-6">
            <table className="table-fixed border-collapse w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Date Requested</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Requester</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Property Number</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Description</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Location</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Complain</th>
                  <th className="px-6 py-3 w-20 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">Part</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 border-b-2 border-custom">View</th>
                </tr>
              </thead>
              <tbody>
              {getAdminInspection && getAdminInspection.length > 0 || getFormInspection && getFormInspection.length > 0 ? (
                getAdminInspection.some(item => item.admin_approval === 0) || getFormInspection.some(item => item.supervisor_approval === 1) ? (
                  <tr>
                    <td colSpan={8} className="text-center whitespace-nowrap p-5">
                      No Request for you Yet
                    </td>
                  </tr>
                ) : (
                  <>
                  {getFormInspection.map((item) => (
                    <tr key={item.id}>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{formatDate(item.date_requested)}</td>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{item.requester}</td>
                      <td className="px-6 py-3 text-center border-b-2 body-border">{item.property_no}</td>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{item.description}</td>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{item.location}</td>
                      <td className="px-6 py-3 text-center border-b-2 body-border">{item.complain}</td>
                      <td className="text-center w-20 border-b-2 body-border">A</td>
                      <td className="text-center text-xs font-medium text-gray-600 uppercase tracking-wider border-b-2 body-border">
                        <div className="flex justify-center">
                          <Link to={`/repairinspectionform/${item.id}`}>
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
                  ))}
                  {getAdminInspection.map((item) => (
                    <tr key={item.id}>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{formatDate(item.date_requested)}</td>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{item.requester}</td>
                      <td className="px-6 py-3 text-center border-b-2 body-border">{item.property_no}</td>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{item.description}</td>
                      <td className="text-center whitespace-nowrap border-b-2 body-border">{item.location}</td>
                      <td className="px-6 py-3 text-center border-b-2 body-border">{item.complain}</td>
                      <td className="px-6 py-3 w-20 text-center border-b-2 body-border">B</td>
                      <td className="text-center text-xs font-medium text-gray-600 uppercase tracking-wider border-b-2 body-border">
                        <div className="flex justify-center">
                          <Link to={`/repairinspectionform/${item.id}`}>
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
                  ))}
                  </>
                 )
              ) : (
                <tr>
                  <td colSpan={8} className="text-center whitespace-nowrap p-5">No Request for you Yet</td>
                </tr>
              )}


              </tbody>
            </table>
          </div>
        
        </div>
      </>
      ): null }
    </div>
    </>
    )}
    
    </PageComponent>
  )
}