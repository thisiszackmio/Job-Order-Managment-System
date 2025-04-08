import { useEffect, useState } from "react";
import axiosClient from "../../axios";
import PageComponent from "../../components/PageComponent";
import loading_table from "/default/ring-loading.gif";
import loadingAnimation from '/default/loading-new.gif';
import ppalogo from '/default/ppa_logo-st.png';
import { useUserStateContext } from "../../context/ContextProvider";
import { Link } from "react-router-dom";

export default function DashboardJLMS(){
  const { currentUserName } = useUserStateContext();

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const currentDate = formatDate(new Date());

  // loading Function
  const [loading, setLoading] = useState(true);
  const [loadingArea, setLoadingArea] = useState(true);

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

  // Set Delay for Loading
  useEffect(() => {
    // Simulate an authentication check
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

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

  useEffect(() => {  
    fetchAnnounce();
    fetchLogs();
    fetchTeam();
  }, []);

  return(
    <PageComponent title={`Good Day! ${currentUserName?.firstname}`}>

      {/* Preload Screen */}
      {/* {(loading && announceList?.mappedData === undefined && isLogs?.LogsData === undefined && teams?.TeamData === undefined) && (
        <div className="pre-loading-screen z-50 relative flex justify-center items-center">
          <img className="mx-auto h-32 w-auto absolute" src={loadingAnimation} alt="Your Company" />
          <img className="mx-auto h-16 w-auto absolute ppg-logo-img" src={ppalogo} alt="Your Company" />
        </div>
      )} */}

      {/* Main */}
      <div className="font-roboto">

        {/* Announcement */}
        <div className="ppa-widget">
          <div className="ppa-widget-title">Announcement Board</div>
          {loadingArea ? (
            <div className="flex justify-center items-center py-4">
              <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
              <span className="loading-table">Loading Announcements</span>
            </div>
          ):(
            <div style={{ minHeight: 'auto', maxHeight: '300px', overflowY: 'auto' }}>
              <table className="ppa-table w-full">
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
          )}
        </div>

        {/* System Link */}
        <div className="grid grid-cols-5 gap-4 mt-6">

          {/* For AMS */}
          <div className="col-span-1 ppa-widget">

            <div className="ppa-system-abbr">
              <img className="mx-auto jlms-icons" src="default/asset.gif" alt="Your Company"/>  
              AMS
            </div>

            <div className="ppa-system-text">
              Asset Management System
            </div>

            <div className="ppa-system-link">
              Coming Soon
            </div>

          </div>

          {/* For JOMS */}
          <div className="col-span-1 ppa-widget relative">

            <div className="ppa-system-abbr joms">
              <img className="mx-auto jlms-icons" src="default/task-unscreen.gif" alt="Your Company"/>  
              JOMS
            </div>

            <div className="ppa-system-text">
              Job Order Management System
            </div>

            <Link to={`/joms`}> 
              <div className="ppa-system-link">
                Go to the System
              </div>
            </Link>

          </div>

          {/* For PPS */}
          <div className="col-span-1 ppa-widget">

            <div className="ppa-system-abbr">
              <img className="mx-auto jlms-icons" src="default/personnel-unscreen.gif" alt="Your Company"/>  
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
              <img className="mx-auto jlms-icons" src="default/folder-unscreen.gif" alt="Your Company"/>  
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
              <img className="mx-auto jlms-icons" src="default/file-info-unscreen.gif" alt="Your Company"/>  
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
            <div className="ppa-widget-title">Logs for {currentDate}</div>
            {(loadingArea) ? (
              <div className="flex justify-center items-center py-4">
                <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                <span className="loading-table">Loading Logs</span>
              </div>
            ):(
              !loading && (
                <div className="ppa-div-table" style={{ minHeight: '400px', maxHeight: '400px', overflowY: 'auto' }}>
                  <table className="ppa-table w-full mb-4">
                  {isLogs?.LogsData?.length > 0 && (
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-1 py-1 w-32 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                        <th className="px-1 py-1 w-18 text-center text-xs font-medium text-gray-600 uppercase">Category</th>
                        <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase">Description</th>
                      </tr>
                    </thead>
                  )}
                  <tbody style={{ backgroundColor: '#fff' }}>
                    {/* If meron data */}
                    {isLogs?.LogsData?.length > 0 && (
                      isLogs?.LogsData?.map((Logs) => (
                        <tr key={Logs.id}>
                          <td className="px-1 py-1 text-left table-font text-xs">{Logs?.date}</td>
                          <td className="px-1 py-1 text-center table-font text-xs">{Logs?.category}</td>
                          <td className="px-1 py-1 text-center table-font text-xs">{Logs?.message}</td>
                        </tr>
                      ))
                    )}
                    {/* Walang data */}
                    {isLogs?.LogsData && isLogs.LogsData.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-1 py-1 text-xs text-center border-0 border-custom"> No Logs </td>
                      </tr>
                    )}
                  </tbody>
                  </table>
                </div>
              )
            )}
          </div>

          {/* For Members */}
          <div className="col-span-1 ppa-widget">
            <div className="ppa-widget-title">PMO Members</div>
            {loadingArea ? (
              <div className="flex justify-center items-center py-4">
                <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
                <span className="loading-table">Loading Teams</span>
              </div>
            ):(
              <div className="members-container p-4 ppa-div-table" style={{ minHeight: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
                {teams?.TeamData?.map((TeamData)=>(
                <div key={TeamData.id} className="member-info">
                  <div className="team-avatar"><img src={TeamData.avatar} alt="Team" /></div>
                  <div className="team-name">{TeamData.name}</div>
                  <div className="team-position">{TeamData.position}</div>
                </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </PageComponent>
  );
}