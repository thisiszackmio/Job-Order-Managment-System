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
            type: 'Pre-Post Repair Inspection Form',
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
            type: 'Pre-Post Repair Inspection Form',
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
            type: 'Pre-Post Repair Inspection Form',
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
        <>
        <div className="border border-solid border-gray-300 rounded-lg p-4">
        <div className="mt-0 pb-4">
          <h3 className="text-xl font-bold leading-6 text-gray-900">Notification</h3>
        </div>
          <h3 className="text-l font-normal leading-6 text-gray-900">No notifications for you today</h3>
        </div>
        </>
      ) : assignPersonnel && (
      <>
      <div className="border border-solid border-gray-300 rounded-lg p-4">
        <div className="pb-4">
          <h3 className="text-xl font-bold leading-6 text-gray-900">Notification</h3>
        </div>
        {getStatus.length > 0 ? (
          assignPersonnel.map((item) => (
            <Link to={`/repairinspectionform/${item.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                <h4 className="text-sm text-gray-400 italic">Date Requested: {formatDate(item.date_requested)}</h4>
                <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b> you have a assign for you.</h3>
            </Link>
          ))
        ):(
          <h3 className="text-l font-normal leading-6 text-gray-900">No new notifications for you today</h3>
        )}
          {/* <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b> you have a assign for you</h3> */}
      </div>
      </>
      )}

      {/* For Supervisor */}
      {currentUser.code_clearance === 2 ? (
      <>
      <div className="border border-solid border-gray-300 rounded-lg p-4">
        <div className="pb-4">
          <h3 className="text-xl font-bold leading-6 text-gray-900">Notification</h3>
        </div>

        {getFormInspection && getFormInspection.length > 0 ? (
          getFormInspection.every(item => item.supervisor_approval === 1) ? (
            <h3 className="text-l font-normal leading-6 text-gray-900">No new notifications for you today</h3>
          ):(
            getFormInspection.map((item) => (
              <Link to={`/repairinspectionform/${item.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                <h4 className="text-sm text-gray-400 italic">Date Requested: {formatDate(item.date_requested)}</h4>
                <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b> you have a request on <i>{item.type}</i> by <b>{item.requester}</b> and needs your approval</h3>
              </Link>
            ))
          )
        ):(
          <h3 className="text-l font-normal leading-6 text-gray-900">No new notifications for you today</h3>
        )}
      </div>
      </>
      ): null }

      {/* For GSO or Authorize Person */}
      {currentUser.code_clearance === 3 ? (
      <>
      <div className="border border-solid border-gray-300 rounded-lg p-4">
        <div className="pb-4">
          <h3 className="text-xl font-bold leading-6 text-gray-900">Notification</h3>
        </div>

        {getGSOInspection && getGSOInspection.length > 0 ? (
           getGSOInspection.every(items => items.admin_approval === 0) ? (
            <h3 className="text-l font-normal leading-6 text-gray-900">No new notifications for you today</h3>
           ):(
            getGSOInspection.map((item) => (
              <Link to={`/repairinspectionform/${item.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                <h4 className="text-sm text-gray-400 italic">Date Requested: {formatDate(item.date_requested)}</h4>
                {item.requester === 'Daisy P. Tangcalagan' ? (
                  <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b>, request on Maam <b>{item.requester}</b> </h3>
                ):(
                  <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b> the request on <i>{item.type}</i> by <b>{item.requester}</b> is noted by the supervisor</h3>
                )}
              </Link>
            ))
           )
        ):(
          <h3 className="text-l font-normal leading-6 text-gray-900">No new notifications for you today</h3>
        )}
        
          {/* <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b> these are the forms that are approved by the Supervisor</h3> */}

        </div>
      </>
      ): null }

      {/* <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b> these are the forms that are need to be approved</h3> */}

      {/* For the Manager */}
      {currentUser.code_clearance === 1 ? (
      <>
      <div className="border border-solid border-gray-300 rounded-lg px-2 py-4">
        <div className="pb-4">
          <h3 className="text-xl font-bold leading-6 text-gray-900">Notification</h3>
        </div>

        {getAdminInspection && getAdminInspection.length > 0 || getFormInspection && getFormInspection.length > 0 ? (
          getAdminInspection.some(item => item.admin_approval === 0) || getFormInspection.some(item => item.supervisor_approval === 1) ? (
            <h3 className="text-l font-normal leading-6 text-gray-900">No new notifications for you today</h3>
          ) : (
            <>
              {getFormInspection.map((item) => (
                <Link key={item.id} to={`/repairinspectionform/${item.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                  <h4 className="text-sm text-gray-400 italic">Date Requested: {formatDate(item.date_requested)}</h4>
                  <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b> here's the link on your request</h3>
                </Link>
              ))}
              {getAdminInspection.map((item) => (
                <Link key={item.id} to={`/repairinspectionform/${item.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
                  <h4 className="text-sm text-gray-400 italic">Date Requested: {formatDate(item.date_requested)}</h4>
                  {item.requester === 'Daisy P. Tangcalagan' ? (
                    <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b> your request needs approval</h3>
                  ):(
                    <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} <b>{currentUser.fname}</b> the request on <i>{item.type}</i> by <b>{item.requester}</b> is waiting for your approval</h3>
                  )}
                </Link>
              ))}
            </>
          )
        ) : (
          <h3 className="text-l font-normal leading-6 text-gray-900">No new notifications for you today</h3>
        )}
      </div>
      </>
      ): null }
    </div>
    </>
    )}
    
    </PageComponent>
  )
}