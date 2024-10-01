import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import PageComponent from "../../components/PageComponent";
import loadingAnimation from '/ppa_logo_animationn_v4.gif';
import { useUserStateContext } from "../../context/ContextProvider";
import { Link } from "react-router-dom";

export default function DashboardJLMS(){

  const { currentUserId, userCode } = useUserStateContext();

  // Greetings
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

  // Loading
  const [loading, setLoading] = useState(true);

  const [announceList, setAnnounceList] = useState([]);
  const [isLogs, setLogs] = useState([]);
  const [teams, setTeams] = useState([]);

  // Disable the Scroll on Popup
  useEffect(() => {
    
    // Define the classes to be added/removed
    const loadingClass = 'loading-show';

    // Function to add the class to the body
    const addLoadingClass = () => document.body.classList.add(loadingClass);

    // Function to remove the class from the body
    const removeLoadingClass = () => document.body.classList.remove(loadingClass);

    // Add or remove the class based on showPopup state
   if(loading) {
      addLoadingClass();
    }
    else {
      removeLoadingClass();
    }

    // Cleanup function to remove the class when the component is unmounted or showPopup changes
    return () => {
      removeLoadingClass();
    };
  }, [loading]);

  // Get All the Data on Announcements
  const fetchAnnounce = async () => {
    axiosClient
    .get('/showannouncements/')
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
    });
  };

  // Show Logs
  const fetchLogs = () => {
    axiosClient
    .get('/getlogs')
    .then((response) => {
      const getlogs = response.data;

      const LogsData = getlogs.map((dataItem) => {
        const date = new Date(dataItem.created_at);

        // Format date
        const optionsDate = { month: 'short', day: 'numeric', timeZone: 'Asia/Manila' };
        const formattedDate = new Intl.DateTimeFormat('en-PH', optionsDate).format(date);

        // Format time
        const optionsTime = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false, timeZone: 'Asia/Manila' };
        const formattedTime = new Intl.DateTimeFormat('en-PH', optionsTime).format(date);

        return{
          id: dataItem.id,
          date: `${formattedDate} ${formattedTime}`,
          category: dataItem.category,
          message: dataItem.message,
        }
      });

      setLogs({LogsData});
    });
  };

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

  useEffect(() => {  
    fetchAnnounce();
    fetchLogs();
    fetchTeam();
  }, []);

  // Restrictions Condition
  const ucode = userCode;
  const codes = ucode.split(',').map(code => code.trim());
  const ProcurementTeam = codes.includes("PT") || codes.includes("HACK");

  return (
    <PageComponent title={`${getTimeOfDay()}! ${currentUserId?.gender === 'Male' ? 'Sir' : 'Maam'} ${currentUserId?.firstname}`}>
      {loading ? (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
          <img
            className="mx-auto h-44 w-auto"
            src={loadingAnimation}
            alt="Your Company"
          />
          <span className="loading-text loading-animation">
          {Array.from("Loading...").map((char, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>{char}</span>
          ))}
          </span>
        </div>
      ):(
      <div className="font-roboto">
        
        {/* Announcement */}
        <div className="ppa-widget">
          <div className="ppa-widget-title">Announcement Board</div>
          <div style={{ minHeight: 'auto', maxHeight: '300px', overflowY: 'auto' }}>
            <table className="ppa-table w-full">
              <tbody>
              {announceList?.mappedData.length > 0 ? (
                announceList?.mappedData?.map((getData)=>(
                  <tr key={getData.id}>
                    <td className="px-4 py-3 text-left table-font">{getData.details}</td>
                    <td className="px-4 py-3 text-center align-top w-1/4 table-font">{getData.date_of_request}</td>
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

        {/* System Link */}
        <div className="grid grid-cols-5 gap-4 mt-10">

          {/* For AMS */}
          <div className="col-span-1 ppa-widget">

            <div className="ppa-system-abbr">
              <img className="mx-auto" style={{ position: 'absolute', width: 'auto', height: '60px', left: '40px' }} src="asset.png" alt="Your Company"/>  
              AMS
            </div>

            <div className="ppa-system-text">
              Asset Management System
            </div>

            <div className="ppa-system-link">
              {ProcurementTeam ? ("(Coming Soon)"):("Unauthorize")}
            </div>

          </div>

          {/* For JOMS */}
          <div className="col-span-1 ppa-widget relative">

            <div className="ppa-system-abbr joms">
              <img className="mx-auto" style={{ position: 'absolute', width: 'auto', height: '50px', top: '5px', left: '40px' }} src="checklist.png" alt="Your Company"/>  
              JOMS
            </div>

            <div className="ppa-system-text">
              Job Order Management System
            </div>

            <div className="ppa-system-link">
              <Link to={`/joms`}> Go to the System </Link>
            </div>

          </div>

          {/* For PPS */}
          <div className="col-span-1 ppa-widget">

            <div className="ppa-system-abbr">
              <img className="mx-auto" style={{ position: 'absolute', width: 'auto', height: '60px', left: '40px' }} src="groups.png" alt="Your Company"/>  
              PPS
            </div>

            <div className="ppa-system-text px-4">
              Personnel Profiling System
            </div>

            <div className="ppa-system-link">
              (Coming Soon)
            </div>

          </div>

          {/* For DTS */}
          <div className="col-span-1 ppa-widget">

            <div className="ppa-system-abbr">
              <img className="mx-auto image-icon" style={{ position: 'absolute', width: 'auto', height: '60px', left: '40px' }} src="paper.png" alt="Your Company"/>  
              DTS
            </div>

            <div className="ppa-system-text">
              Document Tracking System
            </div>

            <div className="ppa-system-link">
              (Coming Soon)
            </div>

          </div>

          {/* For DIS */}
          <div className="col-span-1 ppa-widget">

            <div className="ppa-system-abbr">
              <img className="mx-auto" style={{ position: 'absolute', width: 'auto', height: '60px', left: '40px' }} src="fill.png" alt="Your Company"/>  
              DIS
            </div>

            <div className="ppa-system-text">
              Database of Issuance System
            </div>

            <div className="ppa-system-link">
              (Coming Soon)
            </div>

          </div>

        </div>

        {/* Logs and Members */}
        <div className="grid grid-cols-2 gap-4 mt-10">

          {/* For Logs */}
          <div className="col-span-1 ppa-widget">
            <div className="ppa-widget-title">Logs</div>
            <div className="ppa-div-table" style={{ minHeight: '200px', maxHeight: '400px', overflowY: 'auto' }}>
              <table className="ppa-table w-full mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-1 py-1 w-28 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                    <th className="px-1 py-1 w-22 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
                    <th className="px-1 py-1 text-left text-xs font-medium text-gray-600 uppercase">Message</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: '#fff' }}>
                  {isLogs?.LogsData?.length > 0 ? (
                    isLogs?.LogsData?.map((Logs) => (
                      <tr key={Logs.id}>
                        <td className="px-1 py-1 text-left table-font text-xs">{Logs?.date}</td>
                        <td className="px-1 py-1 text-left table-font text-xs">{Logs?.category}</td>
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
  );
}