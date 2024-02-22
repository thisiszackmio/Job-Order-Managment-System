import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from "react-router-dom";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';

export default function MyRequest(){
  const {id} = useParams();

  const[displayRequestEquipment, setDisplayRequestEquipment] = useState([]);

  const [activeTab, setActiveTab] = useState("tab1");
  
  library.add(faEye);
  const [loading, setLoading] = useState(true);

  //Get all the Request on the Equipment
  const fetchEquipmentForm = () => {
    axiosClient
    .get(`/myequipmentformrequest/${id}`)
    .then((response) => {
      const responseData = response.data;
      const viewEquipmentFormData = responseData.view_equipment;
      
      const mappedData = viewEquipmentFormData.map((dataItem) => {
        return{
          id: dataItem.id,
          type: dataItem.type_of_equipment,
          date_request: dataItem.date_request,
          title: dataItem.title_of_activity,
          date_activity: dataItem.date_of_activity,
          time_start: dataItem.time_start,
          time_end: dataItem.time_end,
          dm_approvel: dataItem.division_manager_approval,
          am_approvel: dataItem.admin_manager_approval,
          hm_approvel: dataItem.harbor_master_approval,
          mm_approvel: dataItem.port_manager_approval
        }
      });

      setDisplayRequestEquipment({mappedData:mappedData});
    })
    .catch((error) => {
      setLoading(false);
        console.error('Error fetching data:', error);
    });
  }

  useEffect(()=>{
    fetchEquipmentForm();
  },[id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  return(
    <PageComponent title="My Request List">
    {loading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src={loadingAnimation}
        alt="Your Company"
      />
      <span className="ml-2 animate-heartbeat">Loading My Request List</span>
    </div>
    ):(
    <>


      <div className="mt-4">

        {/* Request For the Equipment Slip */}
        {activeTab === "tab4" && (
          <div>
            <table className="border-collapse w-full">
              <thead>
                {displayRequestEquipment?.mappedData?.length > 0 ? (
                <tr className="bg-gray-100">
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border w-1 border-custom">Ctrl No</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Type of Equipment</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Purpose of Activity</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date of Activity</th>   
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Time of Activity (START and END)</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Status</th>
                  <th className="px-1 py-0.5 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Action</th>
                </tr>
                ):null}
              </thead>
              <tbody>
              {displayRequestEquipment?.mappedData?.length > 0 ? (
                displayRequestEquipment?.mappedData?.map((getDataE) => (
                  <tr key={getDataE.id}>
                    <td className="px-1 py-1 text-center border border-custom w-1 font-bold">{getDataE.id}</td>
                    <td className="px-1 py-1 text-center border border-custom">{formatDate(getDataE.date_request)}</td>
                    <td className="px-1 py-1 text-center border border-custom">{getDataE.type}</td>
                    <td className="px-1 py-1 text-center border border-custom">{getDataE.title}</td>
                    <td className="px-1 py-1 text-center border border-custom">{formatDate(getDataE.date_activity)}</td>
                    <td className="px-2 py-1 w-40 text-center border border-custom">{formatTime(getDataE.time_start)} - {formatTime(getDataE.time_end)}</td>
                    <td className="px-1 py-1 text-center border border-custom">
                    {getDataE.type != 'Rescue Boat' ? (
                      getDataE.dm_approvel == 0 && getDataE.am_approvel == 0 ? ("Pending Approval"):
                      getDataE.dm_approvel == 1 && getDataE.am_approvel == 0 ? ("Approved by your DM"):
                      getDataE.dm_approvel == 1 && getDataE.am_approvel == 1 ? ("Approved by the Admin"):null
                    ):("ako ni")}
                    </td>
                    <td className="px-1 py-1 text-center border border-custom">
                      <div className="flex justify-center">
                        <Link to={`/equipmentform/${getDataE.id}`}>
                          <button 
                            className="bg-green-500 hover-bg-green-700 text-white font-bold py-1 px-2 rounded"
                            title="View Request"
                          >
                            <FontAwesomeIcon icon="eye" className="mr-0" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan="7" className="px-6 py-6 text-center font-bold whitespace-nowrap">No Request for yoou today</td>
                </tr>
              )}
              </tbody>
              
            </table>
            <div className="text-right text-sm/[17px]">
            {displayRequestEquipment.mappedData.length > 0 ? (
            <i>Total of <b> {displayRequestEquipment.mappedData.length} </b> Pre/Post Repair Request</i>
            ):null}
            </div>
          </div>
        )}


        {activeTab === "tab5" && <div className="text-center">Coming Soon</div>}

      </div>

    </>
    )}
    </PageComponent>
  );
}