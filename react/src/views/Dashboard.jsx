import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";

// Function to format the date as "Month Day, Year"
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default function Dashboard()
{
  const { currentUser, userToken, userRole, setUserRole  } = useUserStateContext();
  const [prePostRepair, setPrePostRepair] = useState([]);
  const [request, setRequest] = useState('');

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

  // Get your Request on Repair
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

  useEffect(() => {
    // Replace this with your actual API call logic
    const fetchUserRoleFromAPI = async () => {
      try {
        const response = await fetch('/login');
        const data = await response.json();
        
        // Assuming the API response contains the user's role
        const newUserRole = data.userRole;

        // Update the user's role in the context
        setUserRole(newUserRole);
      } catch (error) {
        console.error(error);
      }
    };

    // Call the function to fetch the user's role
    fetchUserRoleFromAPI();
  }, []);

  return(
    <PageComponent title={`${getTimeOfDay()}! ${currentUser.fname}`}>
       {/* <p>User Role: {userRole}</p> */}
      <div class="relative flex gap-x-3">
        <div class="flex h-7 text-lg items-center">
          <label for="table_no" class="font-medium text-gray-900">Your Request:</label>
        </div>
        <div class="leading-6 text-lg">
          <select 
            name="request" 
            id="request" 
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            value={request}
            onChange={ev => setRequest(ev.target.value)}
          >
            <option value="" disabled>Select an option</option>
            <option value="Request for Pre/Post Repair Inspection">Request for Pre/Post Repair Inspection</option>
            <option value="Request for the use of Facility / Venue">Request for the use of Facility / Venue</option>
            <option value="Request for Vehicle Slip">Request for Vehicle Slip</option>
            <option value="Request for the use of Manlift">Request for the use of Manlift</option>
            <option value="Request for Repair/Trouble Shooting">Request for Repair/Trouble Shooting</option>
          </select>
        </div>
      </div>
      {/* Request for Repair */}
      {request === "Request for Pre/Post Repair Inspection" && (
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {prePostRepair.map((repair) => {
              if (currentUser.id === repair.id) {
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
                  </tr>
                );
              }
              return (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-center" colSpan="12">No Request</td>
                </tr>
              ); 
            })}
            </tbody>
          </table>

        </div>
      </div>
      )}
    </PageComponent>
  )
}