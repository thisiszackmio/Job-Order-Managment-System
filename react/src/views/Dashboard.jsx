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

  const [getSupInspNoti, setSupInspNoti] = useState([]);
  const [getGSOInspNoti, setGSOInspNoti] = useState([]);
  const [getAdminInspNoti, setAdminInspNoti] = useState([]);
  const [getPersonnelNoti, setPersonnelNoti] = useState([]);

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

  //Get Supervisor Notification
  const fetchSupNoti = () => {
    axiosClient
    .get(`/supnotification/${storedUserData.id}`)
    .then((response) => {
      const responseData = response.data;
      const getSupInspDet = responseData.supDet;

      const mappedData = getSupInspDet.map((SInspItem) => {
        return {
          type: 'Pre-Repair/Post Repair Inspect Form',
          id: SInspItem.id,
          date_request: SInspItem.date_of_request,
        };
      });

      setSupInspNoti(mappedData);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  //Get GSO Notification
  const fetchGSONoti = () => {
    axiosClient
    .get('/gsonotification')
    .then((response) => {
      const responseData = response.data;
      const getGSOInspDet = responseData.gsoDet;
      const getGSOFacDet = responseData.gsoFacDet;

      const mappedData = getGSOInspDet.map((GInspItem) => {
        return {
          type: 'Pre-Repair/Post Repair Inspect Form',
          id: GInspItem.id,
          date_request: GInspItem.date_of_request,
        };
      });

      const FacilityData = getGSOFacDet.map((GFacItem) => {
        return{
          type: 'Request for the use of Facility / Venue',
          id: GFacItem.id,
          date_request: GFacItem.date_requested
        };
      });

      setGSOInspNoti({
        mappedData,
        FacilityData
      });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  //Get Admin Notification
  const fetchAdminNoti = () => {
    axiosClient
    .get('/adminnotification')
    .then((response) => {
      const responseData = response.data;
      const getAdminInspDet = responseData.adminDet;
      const getAdminFacDet = responseData.adminFacDet;

      const mappedData = getAdminInspDet.map((AInspItem) => {
        return{
          type: 'Pre-Repair/Post Repair Inspect Form',
          id: AInspItem.id,
          date_request: AInspItem.date_of_request,
        };
      });

      const FacilityData = getAdminFacDet.map((AFacItem) => {
        return{
          type: 'Request for the use of Facility / Venue',
          id: AFacItem.id,
          date_request: AFacItem.date_requested,
        };
      });

      setAdminInspNoti({
        mappedData, 
        FacilityData
      });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  //Personnel Notification
  const fetchPersonnelNoti = () => {
    axiosClient
    .get(`/personnelnotification/${storedUserData.id}`)
    .then((response) => {
      const responseData = response.data;
      const personnelDet = responseData.inspectorDet;
      const personnelID = responseData.assignID;

      const mappedData = personnelDet.map((PInspItem) => {
        return{
          type: 'Pre-Repair/Post Repair Inspect Form',
          id: PInspItem.inspection__form_id,
          status: PInspItem.close
        };
      });

      setPersonnelNoti({
        personnelID:personnelID,
        mappedData:mappedData
      });


    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  useEffect(() => {
    fetchSupNoti();
    fetchGSONoti();
    fetchAdminNoti();
    fetchPersonnelNoti();
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

    {/* For Supervisor Notification */}
    {currentUser.code_clearance === 2 ? (
    <>
    <div className="border border-solid border-gray-300 rounded-lg p-4">

      <div className="pb-4">
        <h3 className="text-xl font-bold leading-6 text-gray-900">Notification</h3>
      </div>

      {getSupInspNoti && getSupInspNoti.length > 0 ? (
      getSupInspNoti.map((SupItem) => (
        <div key={SupItem.id}>
          <Link to={`/repairinspectionform/${SupItem.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
          <h4 className="text-sm text-gray-400 italic">Date Requested: {formatDate(SupItem.date_request)} ({SupItem.type})</h4>
          <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}, there is a request for you that has need your approval</h3>
          </Link>
        </div>
      ))
      ):(
      <h3 className="text-l font-normal leading-6 text-gray-900">No new notifications for you today</h3>
      )}

    </div>
    </>
    ):null}

    {/* For GSO Notification */}
    {currentUser.code_clearance === 3 ? (
    <>
    <div className="border border-solid border-gray-300 rounded-lg p-4">

      <div className="pb-4">
        <h3 className="text-xl font-bold leading-6 text-gray-900">Notification</h3>
      </div>

    {getGSOInspNoti?.mappedData?.length > 0 || getGSOInspNoti?.FacilityData?.length > 0 ? (
    <>
      {/* For Inspection Request */}
      {getGSOInspNoti.mappedData.map((GSOItem) => (
        <div key={GSOItem.id}>
          <Link to={`/repairinspectionform/${GSOItem.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
            <h4 className="text-sm text-gray-400 italic">Date Requested: {formatDate(GSOItem.date_request)} ({GSOItem.type})</h4>
            <h3 className="text-l font-normal leading-6 text-gray-900">
              Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}, there is a request and already approved by the supervisor
            </h3>
          </Link>
        </div>
      ))}

      {/* For Facility Request */}
      {getGSOInspNoti.FacilityData.map((GSOItem) => (
      <div key={GSOItem.id}>
        <Link to={`/facilityvenueform/${GSOItem.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
          <h4 className="text-sm text-gray-400 italic">Date Requested: {formatDate(GSOItem.date_request)} ({GSOItem.type})</h4>
          <h3 className="text-l font-normal leading-6 text-gray-900">
            Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}, there is a request for the Facility and Venue
          </h3>
        </Link>
      </div>
      ))}
    </>
    ):(
      <h3 className="text-l font-normal leading-6 text-gray-900">No new notifications for you today</h3>
    )}

    </div>
    </>
    ):null}

    {/* For Admin Manager Notification */}
    {currentUser.code_clearance === 1 ? (
    <>
    <div className="border border-solid border-gray-300 rounded-lg p-4">

      <div className="pb-4">
        <h3 className="text-xl font-bold leading-6 text-gray-900">Notification</h3>
      </div>

      {getAdminInspNoti?.mappedData?.length > 0 || getAdminInspNoti?.FacilityData?.length > 0 ? (
      <>

        {/* For Inspection Request */}
        {getAdminInspNoti.mappedData.map((AdminItem) => (
          <div key={AdminItem.id}>
            <Link to={`/repairinspectionform/${AdminItem.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
            <h4 className="text-sm text-gray-400 italic">Date Requested: {formatDate(AdminItem.date_request)} ({AdminItem.type})</h4>
            <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}, there is a request and need your approval</h3>
            </Link>
          </div>
        ))}

        {/* For Facility Request */}
        {getAdminInspNoti.FacilityData.map((AdminFacItem) => (
          <div key={AdminFacItem.id}>
            <Link to={`/facilityvenueform/${AdminFacItem.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
            <h4 className="text-sm text-gray-400 italic">Date Requested: {formatDate(AdminFacItem.date_request)} ({AdminFacItem.type})</h4>
            <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}, there is a request and need your approval</h3>
            </Link>
          </div>
        ))}

      </>
      ):(
        <h3 className="text-l font-normal leading-6 text-gray-900">No new notifications for you today</h3>
      )}

    </div>
    </>
    ):null}

    {/* For the Personnel Assign Notification */}
    {currentUser.id === getPersonnelNoti.personnelID ? (
    <>
    <div className="border border-solid border-gray-300 rounded-lg p-4">

      <div className="pb-4">
        <h3 className="text-xl font-bold leading-6 text-gray-900">Notification</h3>
      </div>
      {getPersonnelNoti?.mappedData?.length > 0 ? (
        getPersonnelNoti.mappedData.map((PerItem) => (
          <div key={PerItem.id}>
            {PerItem.status === 4 ? (
              <Link to={`/repairinspectionform/${PerItem.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
              <h4 className="text-sm text-gray-400 italic">Request Type: ({PerItem.type})</h4>
              <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}, there is a assign for you</h3>
              </Link>
            ):(
              <Link to={`/repairinspectionform/${PerItem.id}`} className="hover:bg-gray-100 block p-4 border-b border-gray-300 transition duration-300">
              <h4 className="text-sm text-gray-400 italic">Request Type: ({PerItem.type})</h4>
              <h3 className="text-l font-normal leading-6 text-gray-900">Hello {currentUser.gender === 'Male' ? 'Sir' : 'Maam'} {currentUser.fname}, there is another form to be filled</h3>
              </Link>
            )}
          </div>
        ))
      ):(<h3 className="text-l font-normal leading-6 text-gray-900">No new notifications for you today</h3>)}

    </div>
    </>
    ) : null}

    </div>
    </>
    )}
    
    </PageComponent>
  )
}