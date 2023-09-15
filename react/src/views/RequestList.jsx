import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Function to format the date as "Month Day, Year"
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default function RequestList()
{
  library.add(faCheck);
  const { userRole } = useUserStateContext();
  const [prePostRepair, setPrePostRepair] = useState([]);

  const [complain, setComplain] = useState('');

  useEffect( ()=>{
    axiosClient.get('/getrepair')
    .then(response => {
      const getRepair = response.data;
      setPrePostRepair(getRepair); // Update state when data arrives
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  },[]);

 const updateAction = (id) => {
    
 }

  return(
    <PageComponent title="Request List">
    {userRole === "admin" ?(
        <div className="mt-2">
        <div className="w-full overflow-x-auto">

          {/* Table */}
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Property No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Acquisition Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Acquisition Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Brand/Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Serial/Engine No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type of Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Complaint/Defect</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Immediate Supervisor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Supervisor Approval</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {prePostRepair.map((repair) => {
                return (
                  <tr key={repair.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(repair.date_of_request)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{repair.property_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(repair.acq_date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{repair.acq_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{repair.brand_model}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{repair.serial_engine_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{repair.type_of_property === 'Others' ? `Others: ${repair.property_other_specific}` : repair.type_of_property}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{repair.property_description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{repair.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{repair.complain}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{repair.supervisor_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{repair.supervisor_approval === 1 ? "Approved" : "Pending"}</td>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        <button 
                            onClick={() => updateAction(repair.id)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            <FontAwesomeIcon icon="check" />
                        </button>
                    </th>
                  </tr>
                );
            })}
            </tbody>
          </table>

        </div>
      </div>
    ): 
    (
    <div>Access Denied. Only admins can view this page.</div>
    )}
    </PageComponent>
  )
}