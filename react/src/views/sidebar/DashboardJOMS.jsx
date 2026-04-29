import PageComponent from "../../components/PageComponent";
import { useUserStateContext } from "../../context/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import vehicleSlip from "/default/img/van.png";
import repair from "/default/img/mechanic.png"
import facilityicon from "/default/img/booking.png"
import locator from "/default/img/form.png"
import { Link } from "react-router-dom";

export default function DashboardJOMS(){
  const { currentUserId, currentUserName, currentUserCode } = useUserStateContext();

  const currentDate = formatDate(new Date());

  // Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  //Time Format
  function formatTime(dateString) {
    const date = new Date(dateString);

    return date.toLocaleString("en-PH", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
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
  const [announcementLoading, setAnnouncementLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [personnelLoading, setPersonnelLoading] = useState(true);

  // ---- For Number of Request ---- //
  const [totalReq, setTotalReq] = useState({
    inspection: { today: 0, count: 0 },
    facility: { today: 0, count: 0 },
    vehicle: { today: 0, count: 0 }
  });

  const fetchTotalRequest = async () => {
    try {
      const response = await axiosClient.get('/jomsdashboard');
      const dataTotalReq = response.data;

      // console.log(dataTotalReq);

      if(dataTotalReq){
        setTotalReq({
          inspection: dataTotalReq.inspection ?? { today: 0, count: 0 },
          facility: dataTotalReq.facility ?? { today: 0, count: 0 },
          vehicle: dataTotalReq.vehicle ?? { today: 0, count: 0 }
        });
      }

    } catch(error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  // ---- For Announcement ---- //
  const [announceList, setAnnounceList] = useState([]);

  const fetchAnnouncement = async () => {
    try{
      const response = await axiosClient.get('/showannouncements');
      const dataAnnouncement = response.data;

      // console.log(dataAnnouncement);

      if(dataAnnouncement){
        setAnnounceList(dataAnnouncement);
      }

    } catch(error){
      console.error(error);
    } finally {
      setAnnouncementLoading(false);
    }
  };

  // ---- For Reports ---- //
  const [reportData, setReportData] = useState({
    inspection: { approve: 0, disapprove: 0, pending: 0, cancel: 0 },
    facility: { approve: 0, disapprove: 0, pending: 0, cancel: 0 },
    vehicle: { approve: 0, disapprove: 0, pending: 0, cancel: 0 }
  });

  const fetchReports = async () => {
    try {
      const response = await axiosClient.get('/requestgraph');
      const dataReportData = response.data;

      // console.log(dataReportData);

      if(dataReportData){
        setReportData({
          inspection: dataReportData.inspection ?? { approve: 0, disapprove: 0, pending: 0, cancel: 0 },
          facility: dataReportData.facility ?? { approve: 0, disapprove: 0, pending: 0, cancel: 0 },
          vehicle: dataReportData.vehicle ?? { approve: 0, disapprove: 0, pending: 0, cancel: 0 }
        });
      }

    } catch(error) {
      console.error(error);
    } finally {
      setReportsLoading(false);
    }
  }

  // ---- For Logs ---- //
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await axiosClient.get('/getlogs');
      const dataLogs = response.data;

      // console.log(dataLogs);
      if(dataLogs){
        setLogs(dataLogs);
      }

    } catch(error){
      console.error(error);
    } finally {
      setLogsLoading(false);
    }
  }

  // --- For Most Requested Personnel --- //
  const [reqPersonnel, setReqPersonnel] = useState({
    inspection: null,
    facility: null,
    vehicle: null
  });

  const fetchMostReq = async () => {
    try {
      const response = await axiosClient.get('/mostreq');
      const dataMostReq = response.data;

      if(dataMostReq){
        setReqPersonnel(dataMostReq);
      }

    } catch(error){
      console.error(error);
    } finally {
      setListLoading(false);
    }
  }

  // --- For Check all Members --- //
  const [teams, setTeams] = useState([]);

  const fetchTeams = async () => {
    try {
      const response = await axiosClient.get('/teams');
      const dataTeam = response.data;

      // console.log(dataTeam);
      if(dataTeam){
        setTeams(dataTeam);
      }

    } catch(error){
      console.error(error);
    } finally {
      setPersonnelLoading(false);
    }
  }

  // execute the function
  useEffect(() => {
    if (currentUserId) {
      fetchTotalRequest();
      fetchAnnouncement();
      fetchReports();
      fetchLogs();
      fetchMostReq();
      fetchTeams();
    }
  }, [currentUserId]);

  // Codes
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const APM = codes.includes("PM");

  return(
  <PageComponent title="Dashboard">
    {/* Greetings */}
    <div className="greet-section">
      <div className="greeting">
        {getGreeting()} {currentUserName.gender == 'Male' ? "Sir":"Ma'am"} {APM && "APM"} {currentUserName.firstname}
      </div>
    </div>

    {/* Announcements */}
    <div className="ppa-widget px-4 pb-5 mt-10">
      <div className="joms-user-info-header">Announcement Board</div>
      <div style={{ minHeight: 'auto', maxHeight: '300px', overflowY: 'auto' }}>
        <table className="ppa-table w-full">
          <thead>
            <tr>
              <th className="p-3 w-[80%] text-left ppa-table-header">Description</th>
              <th className="p-3 w-[20%] text-left ppa-table-header">Date and Time</th>
            </tr>
          </thead>
          <tbody>
            {announcementLoading ? (
              Array.from({ length: 1 }).map((_, index) => (  // 5 skeleton rows
                <tr key={index}>
                  <td className="p-3 ppa-table-body">
                    <div className="skeleton h-4"></div>
                  </td>
                  <td className="p-3 ppa-table-body">
                    <div className="skeleton h-4"></div>
                  </td>
                </tr>
              ))
            ):(
              announceList?.length > 0 ? (
                announceList.map(item => (
                  <tr key={item.id}>
                    <td className="p-3 text-left ppa-table-body">{item.details}</td>
                    <td className="p-3 text-left ppa-table-body">{formatDate(item.created_at)}</td>
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan={2} className="p-3 text-center ppa-table-body"> No Announcement </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Request Form */}
    <div className="grid mt-10 request-counts">
      {/* For Repair */}
      <div className="col-span-1 ppa-widget-col relative p-4">
        <img className="joms-icons" src={repair} alt="Your Company"/>
        <div className="joms-dashboard-title"> Inspection Repair Request </div>
        <div className="joms-count flex">
          {formLoading ? (
            <div className="skeleton h-10 w-3/4 mb-2"></div>
          ):(totalReq.inspection.count)}
        </div>
        <div className="border-b border-gray-300"></div>
        {formLoading ? (
          <div className="skeleton h-5 mt-3 w-full"></div>
        ):(
          <div className="joms-word-count">No of Request Today: <strong>{totalReq.inspection.today}</strong></div>
        )}
      </div>
      {/* For Facility */}
      <div className="col-span-1 ppa-widget-col relative p-4">
        <img className="joms-icons" src={facilityicon} alt="Your Company"/>
        <div className="joms-dashboard-title"> Facility/Venue Request </div>
        <div className="joms-count">
          {formLoading ? (
            <div className="skeleton h-10 w-3/4 mb-2"></div>
          ):(totalReq.facility.count)}
        </div>
        <div className="border-b border-gray-300"></div>
        {formLoading ? (
          <div className="skeleton h-5 mt-3 w-full"></div>
        ):(
          <div className="joms-word-count">No of Request Today: <strong>{totalReq.facility.today}</strong></div>
        )}
      </div>
      {/* For Vehicle Slip */}
      <div className="col-span-1 ppa-widget-col relative mobile-form p-4">
        <img className="joms-icons" src={vehicleSlip} alt="Your Company"/>
        <div className="joms-dashboard-title"> Vehicle Slip Request </div>
        <div className="joms-count">
          {formLoading ? (
            <div className="skeleton h-10 w-3/4 mb-2"></div>
          ):(totalReq.vehicle.count)}
        </div>
        <div className="border-b border-gray-300"></div>
        {formLoading ? (
          <div className="skeleton h-5 mt-3 w-full"></div>
        ):(
          <div className="joms-word-count">No of Request Today: <strong>{totalReq.vehicle.today}</strong></div>
        )}
      </div>

      {/* For Locator Slip */}
      <div className="col-span-1 ppa-widget-col relative mobile-form p-4">
        <img className="joms-icons" src={locator} alt="Your Company"/>
        <div className="joms-dashboard-title"> Locator Slip Request </div>
        <div className="joms-count">
          {formLoading ? (
            <div className="skeleton h-10 w-3/4 mb-2"></div>
          ):("Coming Soon")}
        </div>
      </div>
    </div>

    {/* Most Requested Personnel */}
    <div className="ppa-widget px-4 pb-5 mt-14">
      <div className="joms-user-info-header">Most Requested Personnel</div>
      <div className="grid request-personnel">
        {/* For Inspection Repair */}
        <div className="col-span-1 relative p-4 flex items-center">
          <div className="w-full">
            <div className="joms-dashboard-title"> Inspection Repair Request </div>
            <div className="mt-3 flex items-center gap-3">        
              {/* Avatar */}
              <div className="joms-mp-name">
                {listLoading ? 
                  <div className="skeleton-circle" style={{ width: '70px', height: '70px' }}></div> : 
                  <img className="joms-most" src={reqPersonnel?.inspection?.avatar_url} alt="Personnel Avatar" />
                }
              </div>
              {/* Name + Total */}
              <div className="flex flex-col">
                <div className="joms-mp-name">
                  {listLoading ? <div className="skeleton h-4 w-32 mb-1"></div> : reqPersonnel?.inspection?.user_name}
                </div>
                <div className="flex items-center gap-2">
                  {listLoading ? 
                    <div className="skeleton h-4 w-32 mb-1 mt-3"></div> : 
                    <>
                      <div className="joms-mp-total">
                        {reqPersonnel?.inspection?.inspection_total}
                      </div>
                      <div className="default-sm-text">
                        Total Request
                      </div>
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* For Facility/Venue */}
        <div className="col-span-1 relative p-4 flex items-center">
          <div className="w-full">
            <div className="joms-dashboard-title"> Facility/Venue Request </div>
            <div className="mt-3 flex items-center gap-3">        
              {/* Avatar */}
              <div className="joms-mp-name">
                {listLoading ? 
                  <div className="skeleton-circle" style={{ width: '70px', height: '70px' }}></div> : 
                  <img className="joms-most" src={reqPersonnel?.facility?.avatar_url} alt="Personnel Avatar" />
                }
              </div>
              {/* Name + Total */}
              <div className="flex flex-col">
                <div className="joms-mp-name">
                  {listLoading ? <div className="skeleton h-4 w-32 mb-1"></div> : reqPersonnel?.facility?.user_name}
                </div>
                <div className="flex items-center gap-2">
                  {listLoading ? 
                    <div className="skeleton h-4 w-32 mb-1 mt-3"></div> : 
                    <>
                      <div className="joms-mp-total">
                        {reqPersonnel?.facility?.facility_total}
                      </div>
                      <div className="default-sm-text">
                        Total Request
                      </div>
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* For Vehicle Slip */}
        <div className="col-span-1 relative p-4 flex items-center">
          <div className="w-full">
            <div className="joms-dashboard-title"> Vehicle Slip Request </div>
            <div className="mt-3 flex items-center gap-3">        
              {/* Avatar */}
              <div className="joms-mp-name">
                {listLoading ? <div className="skeleton-circle" style={{ width: '70px', height: '70px' }}></div> : 
                <img className="joms-most" src={reqPersonnel?.vehicle?.avatar_url} alt="Personnel Avatar" />
              }
              </div>
              {/* Name + Total */}
              <div className="flex flex-col">
                <div className="joms-mp-name">
                  {listLoading ? <div className="skeleton h-4 w-32 mb-1"></div> : reqPersonnel?.vehicle?.user_name}
                </div>
                <div className="flex items-center gap-2">
                  {listLoading ? 
                    <div className="skeleton h-4 w-32 mb-1 mt-3"></div> : 
                    <>
                      <div className="joms-mp-total">
                        {reqPersonnel?.vehicle?.vehicle_total}
                      </div>
                      <div className="default-sm-text">
                        Total Request
                      </div>
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Reports and Logs */}
    <div className="grid gap-6 grid-cols-2 mt-14 margin-page">
      {/* Reports */}
      <div className="ppa-widget-col px-4 pb-4 col-span-1">
        <div className="joms-user-info-header">Reports</div>
        <div style={{ minHeight: 'auto', maxHeight: '300px', overflowY: 'auto' }}>
          <table className="ppa-table w-full">
            <thead>
              <tr>
                <th className="p-3 w-[40%] text-left ppa-table-header">Request</th>
                <th className="p-3 w-[15%] text-center ppa-table-header">Approve</th>
                <th className="p-3 w-[15%] text-center ppa-table-header">Disapprove</th>
                <th className="p-3 w-[15%] text-center ppa-table-header">Pending</th>
                <th className="p-3 w-[15%] text-center ppa-table-header">Cancel</th>
              </tr>
            </thead>
            <tbody>
              {/* For the Inspection Form */}
              <tr>
                <td className="p-3 ppa-table-report">
                  <div className="flex relative items-center">
                    <img className="joms-icons-report" src={repair} alt="Your Company"/>
                    <div className="ml-4 joms-title-report"> Inspection Repair </div>
                  </div>
                </td>
                {reportsLoading ? (
                  <td colSpan={4} className="p-3 ppa-table-report">
                    <div className="skeleton h-4 w-full"></div>
                  </td>
                ):(
                <>
                  <td className="p-3 ppa-table-report text-center"> {reportData.inspection.approve} </td>
                  <td className="p-3 ppa-table-report text-center"> {reportData.inspection.disapprove} </td>
                  <td className="p-3 ppa-table-report text-center"> {reportData.inspection.pending} </td>
                  <td className="p-3 ppa-table-report text-center"> {reportData.inspection.cancel} </td>
                </>
                )}
              </tr>
              {/* For the Facility Form */}
              <tr>
                <td className="p-3 ppa-table-report">
                  <div className="flex relative items-center">
                    <img className="joms-icons-report" src={facilityicon} alt="Your Company"/>
                    <div className="ml-4 joms-title-report"> Facility/Venue </div>
                  </div>
                </td>
                {reportsLoading ? (
                  <td colSpan={4} className="p-3 ppa-table-report">
                    <div className="skeleton h-4 w-full"></div>
                  </td>
                ):(
                <>
                  <td className="p-3 ppa-table-report text-center"> {reportData.facility.approve} </td>
                  <td className="p-3 ppa-table-report text-center"> {reportData.facility.disapprove} </td>
                  <td className="p-3 ppa-table-report text-center"> {reportData.facility.pending} </td>
                  <td className="p-3 ppa-table-report text-center"> {reportData.facility.cancel} </td>
                </>
                )}
              </tr>
              {/* For the Vehicle Slip */}
              <tr>
                <td className="p-3 ppa-table-report">
                  <div className="flex relative items-center">
                    <img className="joms-icons-report" src={vehicleSlip} alt="Your Company"/>
                    <div className="ml-4 joms-title-report"> Vehicle Slip </div>
                  </div>
                </td>
                {reportsLoading ? (
                  <td colSpan={4} className="p-3 ppa-table-report">
                    <div className="skeleton h-4 w-full"></div>
                  </td>
                ):(
                <>
                  <td className="p-3 ppa-table-report text-center"> {reportData.vehicle.approve} </td>
                  <td className="p-3 ppa-table-report text-center"> {reportData.vehicle.disapprove} </td>
                  <td className="p-3 ppa-table-report text-center"> {reportData.vehicle.pending} </td>
                  <td className="p-3 ppa-table-report text-center"> {reportData.vehicle.cancel} </td>
                </>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Logs */}
      <div className="ppa-widget-col px-4 pb-4 col-span-1">
        <div className="joms-user-info-header">Logs</div>
        <div style={{ minHeight: 'auto', maxHeight: '300px', overflowY: 'auto' }}>
          <div className="joms-user-info-sub-header">
            <div className="joms-dashboard-title"> As of {currentDate} </div>
            <Link  to="/joms/datelogs" className="py-2 px-4 btn-primary" >
              Show All Logs
            </Link> 
          </div>
          
          <table className="ppa-table w-full">
            <thead>
              <tr>
                <th className="p-3 w-[30%] text-left ppa-table-header">Datetime</th>
                <th className="p-3 w-[20%] text-left ppa-table-header">Category</th>
                <th className="p-3 w-[60%] text-left ppa-table-header">Description</th>
              </tr>
            </thead>
            <tbody>
              {logsLoading ? (
                Array.from({ length: 3 }).map((_, index) => (  // 5 skeleton rows
                  <tr key={index}>
                    <td className="p-3 ppa-table-logs">
                      <div className="skeleton h-4"></div>
                    </td>
                    <td className="p-3">
                      <div className="skeleton h-4 ppa-table-logs"></div>
                    </td>
                    <td className="p-3">
                      <div className="skeleton h-4 ppa-table-logs"></div>
                    </td>
                  </tr>
                ))
              ):(
                logs?.length > 0 ? (
                  logs.map(item => (
                    <tr key={item.id}>
                      <td className="p-3 text-left ppa-table-logs">{formatDate(item.created_at)} {formatTime(item.created_at)}</td>
                      <td className="p-3 text-left ppa-table-logs">{item.category}</td>
                      <td className="p-3 text-left ppa-table-logs">{item.message}</td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={3} className="p-3 text-center ppa-table-body"> No Logs </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Personnel */}
    <div className="ppa-widget px-4 pb-4 mt-14">
      <div className="joms-user-info-header">Personnels</div>
      <div className="members-container" style={{ minHeight: '300px', maxHeight: '500px', overflowY: 'auto' }}>
        {personnelLoading ? (
          Array.from({ length: 12 }).map((_, index) => (  // 5 skeleton rows
            <div className="member-info pb-5">
              <div className="team-avatar"><div className="skeleton-circle" style={{ width: '1.2in', height: '1.2in', margin: 'auto' }}></div></div>
              <div className="team-name"><div className="skeleton h-4 w-32"></div> </div>
              <div className="team-position"><div className="skeleton h-4 w-32 mt-3"></div> </div>
            </div>
          ))
        ):(
          teams.map(item => (
            <div key={item.id} className="member-info">
              <div className="team-avatar"><img src={item.avatar} alt="Team" /></div>
              <div className="team-name">{item.name}</div>
              <div className="team-position">{item.position}</div>
            </div>
          ))
        )}
      </div>
    </div>
  </PageComponent>
  );
}