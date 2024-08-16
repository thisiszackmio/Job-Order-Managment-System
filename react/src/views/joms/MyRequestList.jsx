import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import loading_table from "/public/load_hehe.gif"
import { useUserStateContext } from "../../context/ContextProvider";

export default function MyRequest(){

  const { currentUserId } = useUserStateContext();

  // Loading
  const [loading, setLoading] = useState(true);

  // Variable
  const [inspectionForm, getInspectionForm] = useState('');

  // Get the Data
  const fetchInspectionRequest = () => {
    axiosClient
    .get(`/jomsmyrequest/${currentUserId?.id}`)
    .then((response) => {
      const responseData = response.data.inspection;

      const inspectionData = responseData.map((InspDet) => {
        return{
          id: InspDet.repair_id,
          property_number: InspDet.repair_property_number,
          type: InspDet.repair_type,
          description: InspDet.repair_description,
          complain: InspDet.repair_complain,
          supervisor: InspDet.repair_supervisor_name,
          remarks: InspDet.repair_remarks,
        }
      });

      getInspectionForm(inspectionData);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  // Get the useEffect
  useEffect(() => {
    if(currentUserId && currentUserId.id){
      fetchInspectionRequest();
    }
  }, [currentUserId]);

  return(
    <PageComponent title="My Request List">

      {/* Post Repair Form */}
      <div className="font-roboto ppa-form-box">
        <div className="ppa-form-header"> Pre/Post Repair Inspection Form </div>

        <div className="p-2 ppa-div-table" style={{ maxHeight: '400px', overflowY: 'auto'}}>
          <table className="ppa-table w-full mb-10 mt-2"> 
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Ctrl ID</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Property Number</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Type of Property</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Description</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Complain/Defect</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Approver</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#fff' }}>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-2 py-2 text-center table-font">
                  <div className="flex justify-center items-center">
                    <img className="h-10 w-auto mr-2" src={loading_table} alt="Loading" />
                    <span className="loading-table">Loading</span>
                  </div>
                </td>
              </tr>
            ):(
              inspectionForm.length > 0 ? (
                inspectionForm.map((getInspData)=>(
                  <tr key={getInspData.id}>
                    <td className="px-2 py-2 text-sm text-left table-font"><Link to={`/joms/inspection/form/${getInspData.id}`}>{getInspData.id}</Link></td>
                    <td className="px-2 py-2 text-sm text-left table-font">{getInspData.property_number ? getInspData.property_number : 'N/A'}</td>
                    <td className="px-2 py-2 text-sm text-left table-font">{getInspData.type}</td>
                    <td className="px-2 py-2 text-sm text-left table-font">{getInspData.description}</td>
                    <td className="px-2 py-2 text-sm text-left table-font">{getInspData.complain}</td>
                    <td className="px-2 py-2 text-sm text-left table-font">{getInspData.supervisor}</td>
                    <td className="px-2 py-2 text-sm text-left table-font">{getInspData.remarks}</td>
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan={7} className="px-3 py-2 text-center table-font"> No Data </td>
                </tr>
              )
            )}
            </tbody>
          </table>
        </div>

      </div>

    </PageComponent>
  );
}