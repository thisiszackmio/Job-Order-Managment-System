import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import loadingIcon from "/default/img/ring-loading.gif";
import axiosClient from "../axios";
import { Link } from "react-router-dom";

export default function DateLogs(){
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

  const currentDate = formatDate(new Date());

  // loading Function
  const [loading, setLoading] = useState(true);

  // --- Date Logs --- //
  const [dateLogs, setDateLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await axiosClient.get('/datelogs');
      const dataLogs = response.data;

      // console.log(dataLogs);
      if(dataLogs){
        setDateLogs(dataLogs);
      }

    } catch(error){
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // execute the function
    useEffect(() => {
      fetchLogs();
    }, []);

  return(
    <PageComponent title="Date Logs">
      {/* Reports */}
      <div className="ppa-widget px-4 pb-6 mt-12">
        <div className="joms-user-info-header">Logs</div>
        <div className="joms-user-info-sub-header">
          <div className="joms-dashboard-title"> As of {currentDate} </div>
          <Link  to="/joms" className="px-4 py-2 btn-primary" >
            Back to Dashboard
          </Link> 
        </div>
        <table className="ppa-table w-full mt-8">
          <thead>
            <tr>
              <th className="p-3 w-[30%] text-left ppa-table-header">Datetime</th>
              <th className="p-3 w-[20%] text-left ppa-table-header">Category</th>
              <th className="p-3 w-[60%] text-left ppa-table-header">Description</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-3 text-center ppa-table-body">
                  <div className="flex justify-center items-center">
                    <img className="h-6 w-auto mr-1" src={loadingIcon} alt="Loading" />
                    <span className="loading-table">Loading</span>
                  </div>
                </td>
              </tr>
            ):(
              dateLogs?.length > 0 ? (
                dateLogs.map(item => (
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
    </PageComponent>
  );
}