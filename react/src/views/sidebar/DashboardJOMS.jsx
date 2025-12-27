import PageComponent from "../../components/PageComponent";
import { useUserStateContext } from "../../context/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import loading_table from "/default/ring-loading.gif";
import vehicleSlip from "/default/van.png";
import repair from "/default/mechanic.png"
import facilityicon from "/default/booking.png"
import locator from "/default/form.png"
import comingsoon from "/default/coming-soon.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from '@fortawesome/free-solid-svg-icons';

export default function DashboardJOMS(){
  const { currentUserId, currentUserName, currentUserCode } = useUserStateContext();

  const currentDate = formatDate(new Date());

  // Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Greeting
  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }

  // loading Function
  const [loading, setLoading] = useState(true);

  // Variable
  const [inspectionForm, getInspectionForm] = useState([]);
  const [facilityForm, getFacilityForm] = useState([]);
  const [vehicleForm, getVehicleForm] = useState([]);
  const [announceList, setAnnounceList] = useState([]);
  const [reqPersonnel, setReqPersonnel] = useState([]);

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
    });
  };

  //Get the Request data
  const fetchRequest = () => {
    axiosClient
    .get(`/jomsdashboard`)
    .then((response) => {
      const responseData = response.data;
      const InspectionForm = responseData.inspection;
      const FacilityForm = responseData.facility;
      const VehicleForm = responseData.vehicle;

      getInspectionForm(InspectionForm);
      getFacilityForm(FacilityForm);
      getVehicleForm(VehicleForm);
    })
    .finally(() => {
      setLoading(false);
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
    });
  };

  // Get most Request Personnel
  const fetchReqPersonnel = () => {
    axiosClient
    .get('/requestedpersonnel')
    .then((response) => {
      const getPersonnel = response.data;

      const dataPersonnel = getPersonnel.map((dataItem) => {
        return{
          id: dataItem.user_id,
          name: dataItem.user_name,
          avatar: dataItem.avatar,
          inspectionCount: dataItem.inspection_count,
          facilityCount: dataItem.facility_count,
          vehicleCount: dataItem.vehicle_count,
          totalReq: dataItem.no_of_requests,
        }
      });

      setReqPersonnel({dataPersonnel});
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // Get the useEffect
  useEffect(() => {
    if(currentUserId){
      fetchRequest();
      fetchAnnounce();
      fetchLogs();
      fetchTeam();
      fetchReqPersonnel();
    }
  }, [currentUserId]);

  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const APM = codes.includes("PM");

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
       loading ? (
          <div className="flex justify-center items-center pt-2 pb-8">
            <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
            <span className="loading-table">Loading Dashboard</span>
          </div>
       ):(
        <div>

          {/* Greetings */}
          <div>
            <div className="greeting">{getGreeting()} {currentUserName.gender == 'Male' ? "Sir":"Ma'am"} {APM && "APM"} {currentUserName.firstname}</div>
          </div>

          {/* Request Form */}
          <div className="grid grid-cols-4 gap-2 mt-6">

            {/* For Repair */}
            <div className="col-span-1 ppa-widget relative">
              <img className="joms-icons" src={repair} alt="Your Company"/>
              <div className="joms-dashboard-title pt-2 pr-4 text-right"> Inspection Repair </div>
              <div className="joms-count text-right pr-4">{inspectionForm?.count}</div>
              <div className="border-b border-gray-300 mx-4"></div>
              <div className="joms-word-count">No of Request Today: <strong>{inspectionForm?.today}</strong></div>
            </div>

            {/* For Facility */}
            <div className="col-span-1 ppa-widget relative">
              <img className="joms-icons" src={facilityicon} alt="Your Company"/>
              <div className="joms-dashboard-title pt-2 pr-4 text-right"> Facility/Venue </div>
              <div className="joms-count text-right pr-4">{facilityForm?.count}</div>
              <div className="border-b border-gray-300 mx-4"></div>
              <div className="joms-word-count">No of Request Today: <strong>{facilityForm?.today}</strong></div>
            </div>

            {/* For Vehicle Slip */}
            <div className="col-span-1 ppa-widget relative">
              <img className="joms-icons" src={vehicleSlip} alt="Your Company"/>
              <div className="joms-dashboard-title pt-2 pr-4 text-right"> Vehicle Slip </div>
              <div className="joms-count text-right pr-4">{vehicleForm?.count}</div>
              <div className="border-b border-gray-300 mx-4"></div>
              <div className="joms-word-count">No of Request Today: <strong>{vehicleForm?.today}</strong></div>
            </div>

            {/* For Locator Slip  */}
            <div className="col-span-1 ppa-widget relative">
              <img className="mx-auto joms-icons" src={locator} alt="Your Company"/>
              <div className="joms-dashboard-title pt-2 pr-4 text-right"> Locator Slip </div>
              <img className="mx-auto joms-comsing-soon" src={comingsoon} alt="Your Company"/>
              {/* <div className="joms-count text-right pr-4">{vehicleForm?.count}</div>
              <div className="border-b border-gray-300 mx-4"></div>
              <div className="joms-word-count">No of Request Today: <strong>{vehicleForm?.today}</strong></div> */}
            </div>

          </div>

          {/* Announcements */}
          <div className="ppa-widget mt-14 pb-2">
            <div className="joms-user-info-header text-left">Announcement Board</div>
            <div className="px-3 pb-3" style={{ minHeight: 'auto', maxHeight: '300px', overflowY: 'auto' }}>
              <table className="ppa-table w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-1 w-[60%] text-left ppa-table-header">Description</th>
                    <th className="px-4 py-1 w-[40%] text-left ppa-table-header">Date and Time</th>
                  </tr>
                </thead>
                <tbody>
                  {announceList?.mappedData?.length > 0 ? (
                    announceList?.mappedData?.map((getData)=>(
                      <tr key={getData.id}>
                        <td className="px-4 py-2 w-[60%] text-left ppa-table-body">{getData.details}</td>
                        <td className="px-4 py-2 w-[40%] text-left ppa-table-body">{getData.date_of_request}</td>
                      </tr>
                    ))
                  ):(
                    <tr>
                      <td colSpan={2} className="px-3 py-3 text-center ppa-table-body"> No Announcement </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* For Most Personel and Stats for the Request Form */}
          <div className="grid gap-3 grid-cols-[35%_65%] [@media(min-width:1440px)]:grid-cols-[22%_78%]">
            {/* Most Requested Personnel */}
            <div>
              <div className="ppa-widget mt-14 h-100">
                {/* Header */}
                <div className="joms-user-info-header text-left"> 
                  Most Requested Personnel
                </div>

                {/* List */}
                <div className="pl-4 pb-4 pr-4" style={{ minHeight: 'auto', maxHeight: '600px', overflowY: 'auto' }}>
                  {reqPersonnel?.dataPersonnel?.map((dataPersonnel) => (
                    <div key={dataPersonnel.id} className="relative ppa-req">
                      {/* Avatar */}
                      <img className="ppa-req-personnel" src={dataPersonnel.avatar} alt="Your Company"/>
                      <div className="ppa-req-name"> {dataPersonnel.name} </div>
                      <div className="ppa-req-insp"> Inspection Request: <strong>{dataPersonnel.inspectionCount}</strong> </div>
                      <div className="ppa-req-fac"> Facility Request: <strong>{dataPersonnel.facilityCount}</strong> </div>
                      <div className="ppa-req-veh"> Vehicle Request: <strong>{dataPersonnel.vehicleCount}</strong> </div>
                      <div className="ppa-req-total"> {dataPersonnel.totalReq} </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Logs */}
            <div>
              <div className="ppa-widget mt-14">
                <div className="joms-user-info-header text-left">Logs</div>
                <div className="joms-dashboard-title px-4 text-left pb-2"> As for <strong>{currentDate}</strong> </div>
                <div className="ppa-div-table px-4" style={{ minHeight: '475px', maxHeight: '475px', overflowY: 'auto' }}>
                  <table className="ppa-table w-full mb-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-1 py-1 w-[25%] text-left ppa-table-logs uppercase">Date</th>
                        <th className="px-1 py-1 w-[20%] text-left ppa-table-logs uppercase">Category</th>
                        <th className="px-1 py-1 w-[55%] text-left ppa-table-logs uppercase">Description</th>
                      </tr>
                    </thead>
                    <tbody style={{ backgroundColor: '#fff' }}>
                      {isLogs?.LogsData?.length > 0 ? (
                        isLogs?.LogsData?.map((Logs) => (
                          <tr key={Logs.id}>
                            <td className="px-1 py-1 w-[25%] text-left ppa-table-body-logs">{Logs?.date}</td>
                            <td className="px-1 py-1 w-[20%] text-left ppa-table-body-logs">{Logs?.category}</td>
                            <td className="px-1 py-1 w-[55%] text-left ppa-table-body-logs">{Logs?.message}</td>
                          </tr>
                        ))
                      ):(
                        <tr>
                          <td colSpan={3} className="px-4 py-4 ppa-table-body-logs text-center"> No Logs </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="ppa-widget mt-14">
            <div className="joms-user-info-header text-left">Members</div>
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
       )
      )}
    </PageComponent>
  )
}