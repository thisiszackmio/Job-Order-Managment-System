import { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import { useUserStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios";
import { Link } from "react-router-dom";
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Restrict from "../../components/Restrict";

export default function PendingRequest(){
  const { currentUserId, currentUserCode } = useUserStateContext();

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Loading
  const [loading, setLoading] = useState(true);

  // Variable
  const [pendingRequest, getPendingRequest] = useState([]);
  const [pageRestrict, setPageRestrict] = useState(true);

  // Get the Data
  const PendingRequest = () => {
    axiosClient
    .get(`/pendingrequest/${currentUserId}`)
    .then((response) => {
      const responsePenData = response.data.pending_approved;
      
      // Inspection
      const pendingData = responsePenData ? 
      responsePenData.map((PenDet) => {
        return{
          id: PenDet.id,
          type: PenDet.type,
          date_request: formatDate(PenDet.date_request),
          requestor: PenDet.requestor,
          remarks: PenDet.remarks
        }
      })
      :null ;

      getPendingRequest(pendingData);

      if(Access){
        setPageRestrict(true);
      }else{
        setPageRestrict(false);
      }

    })
    .finally(() => {
      setLoading(false);
    });
  };

  // Get the useEffect
  useEffect(() => {
    if(currentUserId){
      PendingRequest();
    }
  }, [currentUserId]);

  // Restrictions Condition
  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const roles = ["NERD", "AUS", "PM", "DM", "AM", "GSO", "AP"];
  const Access = roles.some(role => codes.includes(role));

  return(
    !pageRestrict ? (
      <Restrict />
    ):(
      <PageComponent title="Pending Request">
      {/* Pending List */}
      <div className="ppa-widget request-form px-4 pb-6 mt-8">
        <div className="joms-user-info-header text-left"> Pending Request </div>
        {/* Table */}
        <div className="px-4 ppa-div-table" style={{ maxHeight: '400px', overflowY: 'auto'}}>
          <table className="ppa-table w-full mb-10 mt-2"> 
            <thead>
              <tr>
                <th className="px-4 py-2 w-[10%] text-center ppa-table-header">#</th>
                <th className="px-4 py-2 w-[30%] text-left ppa-table-header">Type of Request</th>
                <th className="px-4 py-2 w-[30%] text-left ppa-table-header">Date of Request</th>
                <th className="px-4 py-2 w-[30%] text-left ppa-table-header">Requestor</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#fff' }}>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (  // 5 skeleton rows
                  <tr key={index}>
                    <td className="px-2 py-4 ppa-table-body">
                      <div className="skeleton h-4"></div>
                    </td>
                    <td className="px-2 py-2 ppa-table-body">
                      <div className="skeleton h-4"></div>
                    </td>
                    <td className="px-2 py-2 ppa-table-body">
                      <div className="skeleton h-4"></div>
                    </td>
                    <td className="px-2 py-2 ppa-table-body">
                      <div className="skeleton h-4"></div>
                    </td>
                  </tr>
                ))
              ):(
                pendingRequest && pendingRequest?.length > 0 ? (
                  pendingRequest.map((getPenData)=>(
                    <tr key={getPenData.id}>
                      <td className="px-4 py-2 font-bold text-center ppa-table-body-id">
                        {getPenData.type === 'Pre/Post Repair Inspection Form' ? (
                          <Link 
                            to={`/joms/inspection/form/${getPenData.id}`} 
                            className="group flex justify-center items-center"
                          >
                            {/* Initially show the ID */}
                            <span className="group-hover:hidden">{getPenData.id}</span>
                            
                            {/* Show the View Icon on hover */}
                            <span className="hidden group-hover:inline-flex items-center">
                              <FontAwesomeIcon icon={faEye} />
                            </span>
                          </Link>
                        ):getPenData.type === 'Facility / Venue Form' ? (
                          <Link 
                            to={`/joms/facilityvenue/form/${getPenData.id}`} 
                            className="group flex justify-center items-center"
                          >
                            {/* Initially show the ID */}
                            <span className="group-hover:hidden">{getPenData.id}</span>
                            
                            {/* Show the View Icon on hover */}
                            <span className="hidden group-hover:inline-flex items-center">
                              <FontAwesomeIcon icon={faEye} />
                            </span>
                          </Link>
                        ):(
                          <Link 
                            to={`/joms/vehicle/form/${getPenData.id}`} 
                            className="group flex justify-center items-center"
                          >
                            {/* Initially show the ID */}
                            <span className="group-hover:hidden">{getPenData.id}</span>
                            
                            {/* Show the View Icon on hover */}
                            <span className="hidden group-hover:inline-flex items-center">
                              <FontAwesomeIcon icon={faEye} />
                            </span>
                          </Link>
                        )}
                      </td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getPenData.type}</td>
                      <td className="px-4 py-2 text-left ppa-table-body">{getPenData.date_request}</td>
                      <td className="px-2 py-2 text-left ppa-table-body">{getPenData.requestor}</td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center ppa-table-body">
                      No records found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageComponent>
    )
  )
}