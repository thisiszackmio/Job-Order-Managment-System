import PageComponent from "../../components/PageComponent";
import { useUserStateContext } from "../../context/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import loadingAnimation from '/default/loading-new.gif';
import ppalogo from '/default/ppa_logo-st.png';
import loading_table from "/default/ring-loading.gif";
import VehicleSlip from "/default/Vehicle_Slip.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faGear } from '@fortawesome/free-solid-svg-icons';

export default function DashboardJOMS(){
  const { currentUserId, currentUserCode } = useUserStateContext();

  const currentDate = formatDate(new Date());

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // loading Function
  const [loading, setLoading] = useState(true);
  const [loadingArea, setLoadingArea] = useState(true);

  // Variable
  const [inspectionForm, getInspectionForm] = useState([]);
  const [facilityForm, getFacilityForm] = useState([]);
  const [vehicleForm, getVehicleForm] = useState([]);
  const [onTravel, getOnTravel] = useState([]);

  const [pending, getPending] = useState([]);
  const [pendingApproval, getPendingApproval] = useState([]);

  const [announceList, setAnnounceList] = useState([]);

  // Get All the Data on Announcements
  const fetchAnnounce = async () => {
    axiosClient
    .get('/showannouncements')
    .then((response) => {
      const responseData = response.data;

      const mappedData = responseData.map((dataItem) => {
        const date = new Date(dataItem.created_at);

        // Format date
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Manila' };
        const formattedDate = new Intl.DateTimeFormat('en-PH', optionsDate).format(date);

        // Format time
        const optionsTime = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZone: 'Asia/Manila' };
        const formattedTime = new Intl.DateTimeFormat('en-PH', optionsTime).format(date);

        return{
          id: dataItem.id,
          date_of_request: `${formattedDate} at ${formattedTime}`,
          details: dataItem.details,
        }
      });

      setAnnounceList({mappedData});
    })
    .finally(() => {
      setLoading(false);
      setLoadingArea(false);
    });
  };

  //Get the Request data
  const fetchRequest = () => {
    axiosClient
    .get(`/jomsdashboard`)
    .then((response) => {
      const responseData = response.data;
      // const InspectionForm = responseData.inspection_count;
      // const FacilityForm = responseData.facility_count;
      const VehicleForm = responseData.vehicle;

      // getInspectionForm(InspectionForm);
      // getFacilityForm(FacilityForm);
      getVehicleForm(VehicleForm);
    })
    .finally(() => {
      setLoading(false);
      setLoadingArea(false);
    });
  }

  const [isLogs, setLogs] = useState([]);

  // Show Logs
  const fetchLogs = () => {
    axiosClient
    .get('/getlogs')
    .then((response) => {
      const getlogs = response.data;

      const LogsData = getlogs.map((dataItem) => {
        const date = new Date(dataItem.created_at);

        // Format date
        const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Manila' };
        const formattedDate = new Intl.DateTimeFormat('en-CA', optionsDate).format(date);

        // Format time
        const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Asia/Manila' };
        let formattedTime = new Intl.DateTimeFormat('en-US', optionsTime).format(date);
        formattedTime = formattedTime.replace(/\s/g, '');

        return{
          id: dataItem.id,
          date: `${formattedDate} ${formattedTime}`,
          category: dataItem.category,
          message: dataItem.message,
        }
      });

      setLogs({LogsData});
    })
    .finally(() => {
      setLoading(false);
      setLoadingArea(false);
    });
  };

  const [teams, setTeams] = useState([]);

  // Show Team
  const fetchTeam = () => {
    axiosClient
    .get('/teams')
    .then((response) => {
      const getTeam = response.data;

      const TeamData = getTeam.map((dataItem) => {
        return{
          id: dataItem.id,
          name: dataItem.name,
          position: dataItem.position,
          division: dataItem.division,
          avatar: dataItem.avatar,
        }
      });

      setTeams({TeamData});
    })
    .finally(() => {
      setLoading(false);
      setLoadingArea(false);
    });
  };

  // Get the useEffect
  useEffect(() => {
    if(currentUserId){
      fetchRequest();
      fetchAnnounce();
      fetchLogs();
      fetchTeam();
    }
  }, [currentUserId]);

  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const Admin = codes.includes("AM");
  const GSO = codes.includes("GSO");
  const PersonAuthority = codes.includes("AU");
  const SuperAdmin = codes.includes("HACK");
  const roles = ["AM", "GSO", "DM", "PM", "AP", "AU"];
  const accessOnly = roles.some(role => codes.includes(role));

  return(
    <PageComponent title="JOMS Dashboard">

      {/* Preload Screen */}
      {(loading && inspectionForm && facilityForm && vehicleForm) ? (
        <div className="flex items-left h-20 space-x-4">
          {/* Loading Animation */}
          <FontAwesomeIcon
            icon={faGear}
            className="text-4xl text-blue-700 gear"
          />
          <span className="loading">Loading...</span>
        </div>
      ):(
        <div className="font-roboto">

          {/* Announcements */}
          <div className="ppa-widget mb-6">
            <div className="ppa-widget-title">Announcement Board</div>
            <div className="p-3" style={{ minHeight: 'auto', maxHeight: '300px', overflowY: 'auto' }}>
              <table className="ppa-table w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-1 py-1 w-32 text-left text-xs font-medium text-gray-600 uppercase">Description</th>
                    <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase">Date and Time</th>
                  </tr>
                </thead>
                <tbody>
                  {announceList?.mappedData?.length > 0 ? (
                    announceList?.mappedData?.map((getData)=>(
                      <tr key={getData.id}>
                        <td className="px-4 py-3 text-left text-table-body table-font w-2/3">{getData.details}</td>
                        <td className="px-4 py-3 text-center text-table-body align-top w-1/3">{getData.date_of_request}</td>
                      </tr>
                    ))
                  ):(
                    <tr>
                      <td colSpan={2} className="px-3 py-2 text-center table-font"> No Announcement </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Request Form */}
          <div className="grid grid-cols-3 gap-2">

            {/* For Repair */}
            <div className="col-span-1 ppa-widget relative">
              <div className="joms-dashboard-title"> Pre/Post Repair Inspection Form </div>
            </div>

            {/* For Facility */}
            <div className="col-span-1 ppa-widget relative">
              <div className="joms-dashboard-title"> Facility / Venue Form </div>
            </div>

            {/* For Vehicle Slip */}
            <div className="col-span-1 ppa-widget relative">
              <div className="joms-dashboard-title"> Vehicle Slip </div>
              <img className="mx-auto joms-icons" src={VehicleSlip} alt="Your Company"/>
              <div className="joms-count">{vehicleForm?.count}</div>
              <div className="joms-word-count">Approve Form: <strong>{vehicleForm?.approval}</strong></div>
              <div className="joms-word-count">Disapprove Form: <strong>{vehicleForm?.disapproval}</strong></div>
              <div className="joms-word-count">Cancel Form: <strong>{vehicleForm?.cancel}</strong></div>
              <div className="joms-word-count">Pending for approval: <strong>{vehicleForm?.pendingApproval}</strong></div>
              <div className="joms-word-count">Pending for assign vehicle and driver: <strong>{vehicleForm?.pendingAssignment}</strong></div>
              <Link to={`/joms/vehicle/form`}> <div className="ppa-system-link"> Go to Request Form </div></Link>
            </div>

          </div>

          {/* For the Logs and Team Members */}
          <div className="grid grid-cols-2 gap-4 mt-10">

            {/* Logs */}
            <div className="col-span-1 ppa-widget">
              <div className="ppa-widget-title">Logs for {currentDate}</div>
              <div className="ppa-div-table" style={{ minHeight: '400px', maxHeight: '400px', overflowY: 'auto' }}>
                <table className="ppa-table w-full mb-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-1 py-1 w-32 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                      <th className="px-1 py-1 w-18 text-center text-xs font-medium text-gray-600 uppercase">Category</th>
                      <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase">Description</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: '#fff' }}>
                    {isLogs?.LogsData?.length > 0 ? (
                      isLogs?.LogsData?.map((Logs) => (
                        <tr key={Logs.id}>
                          <td className="px-1 py-1 text-left table-font text-xs">{Logs?.date}</td>
                          <td className="px-1 py-1 text-center table-font text-xs">{Logs?.category}</td>
                          <td className="px-1 py-1 text-left table-font text-xs">{Logs?.message}</td>
                        </tr>
                      ))
                    ):(
                      <tr>
                        <td colSpan={3} className="px-1 py-1 text-xs text-center border-0 border-custom"> No Logs </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* For Members */}
            <div className="col-span-1 ppa-widget">
              <div className="ppa-widget-title">PMO Members</div>
              <div className="members-container p-4 ppa-div-table" style={{ minHeight: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
              {teams?.TeamData?.map((TeamData)=>(
                <div key={TeamData.id} className="member-info">
                  <div className="team-avatar"><img src={TeamData.avatar} alt="Team" /></div>
                  <div className="team-name">{TeamData.name}</div>
                  <div className="team-position">{TeamData.position}</div>
                </div>
              ))}
              </div>
            </div>

          </div>

        </div>
      )}

      
      
    </PageComponent>
  )
}