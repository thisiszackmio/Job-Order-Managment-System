import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench , faIndustry , faReceipt} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

// To refrain return null on reloading the page
const storedUserData = JSON.parse(localStorage.getItem('USER'));

export default function Dashboard()
{
  const [isLoading , setLoading] = useState(true);
  const [isStatus, setStatus] = useState([]);
  const [isLogs, setLogs] = useState([]);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonthName = monthNames[currentMonth];

  const { currentUser } = useUserStateContext();

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

  // Query
  const fetchCountRequest = () => {
    axiosClient
    .get('/getcount')
    .then((response) => {
      const responseData = response.data;

      const totalInspectionReq = responseData.inspection_count;
      const totalInspectionApprove = responseData.inspection_approve;
      const totalInspectionDisapprove = responseData.inspection_disapprove;
      const totalInspectionPending = responseData.inspection_pending;

      const totalFacilityReq = responseData.facility_count;
      const totalFacilityApprove = responseData.facility_approve;
      const totalFacilityDisapprove = responseData.facility_disapprove;
      const totalFacilityPending = responseData.facility_pending;

      const totalVehicleReq = responseData.vehicle_count;
      const totalVehicleApprove = responseData.vehicle_approve;
      const totalVehicleDisapprove = responseData.vehicle_disapprove;
      const totalVehiclePending = responseData.vehicle_pending;

      setStatus({
        totalInspectionReq,
        totalInspectionApprove,
        totalInspectionDisapprove,
        totalInspectionPending,
        totalFacilityReq,
        totalFacilityApprove,
        totalFacilityDisapprove,
        totalFacilityPending,
        totalVehicleReq,
        totalVehicleApprove,
        totalVehicleDisapprove,
        totalVehiclePending
      });
    })
    .catch((error) => {
      console.error('Error fetching Supervisor Notification data:', error);
      setLoading(false);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const fetchLogs = () => {
    axiosClient
    .get('/getlogs')
    .then((response) => {
      const getlogs = response.data;

      const authLogs = getlogs
      ? getlogs.map((logs) => {

        const createdAtDate = new Date(logs.created_at);
        const formattedDate = createdAtDate.toLocaleString('en-US', {
          month: 'short', 
          day: 'numeric',
          year: 'numeric', 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true, 
        });

        return {
          id: logs.id,
          remarks: logs.remarks,
          createdAt: formattedDate
        }
      })
      :null;

      setLogs(authLogs);
    })
    .catch((error) => {
      console.error('Error fetching Supervisor Notification data:', error);
      setLoading(false);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCountRequest();
    fetchLogs();
  },[]);

  return(
    <PageComponent title={`${getTimeOfDay()}! ${currentUser.gender === 'Male' ? 'Sir' : 'Maam'} ${currentUser.fname}`}>

    {isLoading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src="ppa_logo_animationn_v4.gif"
        alt="Your Company"
      />
      <span className="ml-2 animate-heartbeat">Loading Dashboard</span>
    </div>
    ):(
    <div className="font-roboto">

      <div className="title">
        <h2>Request Status</h2>
      </div>
      
      {/* Form Count */}
      <div className="grid grid-cols-5 gap-4">

        {/* For Inspection */}
        <div className="col-span-1 inspection-sec">

          <div className="form-title">Repair Inspection Request</div>

          <div className="flex">
            <div className="flex-grow icon-here"><FontAwesomeIcon icon={faWrench} size="3x" /></div>
            <div className="count-det">{isStatus.totalInspectionReq}</div>
          </div>

          <div className="flex">
            <div className="text-white">Form Approved:</div>
            <div className="ml-2 text-white font-bold">{isStatus.totalInspectionApprove}</div>
          </div>

          <div className="flex">
            <div className="text-white">Form Disapproved:</div>
            <div className="ml-2 text-white font-bold">{isStatus.totalInspectionDisapprove}</div>
          </div>

          <div className="flex">
            <div className="text-white">Form Pending:</div>
            <div className="ml-2 text-white font-bold">{isStatus.totalInspectionPending}</div>
          </div>

        </div>

        {/* For Facility */}
        <div className="col-span-1 facility-sec">

          <div className="form-title">Facility/Venue Request</div>

          <div className="flex">
            <div className="flex-grow icon-here"><FontAwesomeIcon icon={faIndustry} size="3x" /></div>
            <div className="count-det">{isStatus.totalFacilityReq}</div>
          </div>

          <div className="flex">
            <div className="text-white">Form Approved:</div>
            <div className="ml-2 text-white font-bold">{isStatus.totalFacilityApprove}</div>
          </div>

          <div className="flex">
            <div className="text-white">Form Disapproved:</div>
            <div className="ml-2 text-white font-bold">{isStatus.totalFacilityDisapprove}</div>
          </div>

          <div className="flex">
            <div className="text-white">Form Pending:</div>
            <div className="ml-2 text-white font-bold">{isStatus.totalFacilityPending}</div>
          </div>

        </div>

        {/* For Vehicle */}
        <div className="col-span-1 vehicle-sec">

          <div className="form-title">Vehicle Slip Request</div>

          <div className="flex">
            <div className="flex-grow icon-here"><FontAwesomeIcon icon={faReceipt} size="3x" /></div>
            <div className="count-det">{isStatus.totalVehicleReq}</div>
          </div>

          <div className="flex">
            <div className="text-white">Form Approved:</div>
            <div className="ml-2 text-white font-bold">{isStatus.totalVehicleApprove}</div>
          </div>

          <div className="flex">
            <div className="text-white">Form Disapproved:</div>
            <div className="ml-2 text-white font-bold">{isStatus.totalVehicleDisapprove}</div>
          </div>

          <div className="flex">
            <div className="text-white">Form Pending:</div>
            <div className="ml-2 text-white font-bold">{isStatus.totalVehiclePending}</div>
          </div>

        </div>

        {/* For Equipment */}
        <div className="col-span-1 equipment-sec">

          <div className="form-title">Equipment Request</div>

          <div className="text-2xl font-bold text-white">
            Coming Soon!
          </div>

        </div>

        {/* For Other */}
        <div className="col-span-1 other-sec">

          <div className="form-title">Other Request</div>

          <div className="text-2xl font-bold text-white">
            Coming Soon!
          </div>

        </div>

      </div>

      {/* Logs */}
      <div className="section p-5 mt-10">

        <div className="title">
          <h2>Logs (Month of {currentMonthName})</h2>
        </div>

        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>

          <table className="border-collapse w-full mb-4 mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-1 py-1 text-center text-sm font-medium text-gray-600 uppercase border border-custom">Date and Time</th>
                <th className="px-1 py-1 text-center text-sm font-medium text-gray-600 uppercase border border-custom">Activity</th>
              </tr>
            </thead>
            <tbody>
              {isLogs.length > 0 ? (
                isLogs.map((Logs) => (
                  <tr key={Logs.id}>
                    <td className="px-1 py-2 align-top border border-custom table-font text-center">{Logs.createdAt}</td>
                    <td className="px-1 py-2 align-top border border-custom table-font w-9/12 pl-3">{Logs.remarks}</td>
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan={6} className="px-6 py-2 text-center border-0 border-custom"> No data </td>
                </tr>
              )}
            </tbody>
          </table>
          
        </div>

          {/* Back button */}
          {/* <div className="text-center">
            <button className="px-6 py-2 btn-default">
              <Link to="/">Show All Logs</Link>
            </button>
          </div> */}

      </div>

    </div>
    )}
    
    </PageComponent>
  )
}