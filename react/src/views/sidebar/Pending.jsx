import { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import { useUserStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios";
import loading_table from "/default/ring-loading.gif";
import { Link } from "react-router-dom";
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PendingRequest(){

  const { currentUserId } = useUserStateContext();

  //Date Format 
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Loading
  const [loading, setLoading] = useState(true);

  // Variable
  const [pendingRequest, getPendingRequest] = useState([]);

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

  return(
    <PageComponent title="Pending Request">

      {/* Post Repair Form */}
      <div className="font-roboto ppa-form-box bg-white">
        <div className="ppa-form-header h-10"></div>

        {loading ? (
          <div className="flex justify-center items-center pt-2 pb-2">
            <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
            <span className="loading-table">Loading</span>
          </div>
        ):(
          <div className="p-2 ppa-div-table ppa-widget" style={{ maxHeight: '400px', overflowY: 'auto'}}>
            <table className="ppa-table w-full mb-10 mt-2"> 
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Ctrl No</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Type</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Date Request</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Requestor</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#fff' }}>
                {pendingRequest && pendingRequest?.length > 0 ? (
                  pendingRequest.map((getPenData)=>(
                    <tr key={getPenData.id}>
                      <td className="px-2 py-2 w-20 text-sm font-bold text-center table-font">
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
                      <td className="px-2 py-2 text-sm text-center table-font">{getPenData.type}</td>
                      <td className="px-2 py-2 text-sm text-center table-font">{getPenData.date_request}</td>
                      <td className="px-2 py-2 text-sm text-center table-font">{getPenData.requestor}</td>
                      <td className="px-2 py-2 text-sm text-center table-font">{getPenData.remarks}</td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan={5} className="px-2 py-2 text-center text-sm text-gray-600">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
      
    </PageComponent>
  )
}