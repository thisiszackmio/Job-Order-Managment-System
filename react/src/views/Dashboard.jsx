import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useUserStateContext } from "../context/ContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner, faEye  } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

// Function to format the date as "Month Day, Year"
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// To refrain return null on reloading the page
const storedUserData = JSON.parse(localStorage.getItem('USER'));

export default function Dashboard()
{
  library.add(faSpinner, faEye);
  const [isLoading , setLoading] = useState(true);

  const { currentUser } = useUserStateContext();
  const [assignPersonnel, setAssignPersonnel] = useState([]);
  const [hasError, setHasError] = useState('');


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

  const getID = () => storedUserData.id;

  //Check for the Assign Personnel List
  const fetchPersonneData = () => {
    axiosClient
    .get(`/getpersonnel/${storedUserData.id}`)
    .then((response) => {
      const responseData = response.data;
      const inspectionDetails = responseData.inspection_details;
    
      // Map the data to an array of IDs
      const mappedData = inspectionDetails.map((dataItem) => {
        return {
          id: dataItem.id,
          date_requested: dataItem.date_requested,
          requester: dataItem.requester,
          property_no: dataItem.property_no,
          description: dataItem.description,
          location: dataItem.location,
          complain: dataItem.complain,
        };
      });
    
      setAssignPersonnel(mappedData);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching personnel data:', error);

      if (error.response.data.message === 'No data'){
        setHasError('Not Allowed');
        setLoading(false);
      } else {
        setHasError('Not Assigned');
        setLoading(false);
      }
    });
  };

  useEffect(() => { fetchPersonneData(); }, []);

  return(
    <PageComponent title={`${getTimeOfDay()}! ${currentUser.fname}`}>
      {isLoading ? (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin />
          <span className="ml-2">Loading...</span>
        </div>
      ) : hasError === 'Not Allowed' ? (
        null
      ) : hasError === 'Not Assigned' ? (
        <div className="border border-solid border-gray-300 rounded-lg p-4">
          <h3 className="text-l font-normal leading-6 text-gray-900">You have not assign yet <b>{currentUser.fname}</b></h3>
        </div>
      ) : assignPersonnel ? (

        <div className="border border-solid border-gray-300 rounded-lg p-4">
          <h3 className="text-l font-normal leading-6 text-gray-900">Hello <b>{currentUser.fname}</b> you have a assign for you</h3>
        
          <div className="max-h-96 overflow-y-scroll mt-6">
            <table className="table-fixed border-collapse w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Date Requested</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Requester</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Property Number</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Complain</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">View</th>
                </tr>
              </thead>
              <tbody>
                {assignPersonnel.map((item) => (
                  <tr key={item.id}>
                    <td className="text-center whitespace-nowrap">{formatDate(item.date_requested)}</td>
                    <td className="text-center whitespace-nowrap">{item.requester}</td>
                    <td className="px-6 py-3 text-center">{item.property_no}</td>
                    <td className="text-center whitespace-nowrap">{item.description}</td>
                    <td className="text-center whitespace-nowrap">{item.location}</td>
                    <td className="px-6 py-3 text-center">{item.complain}</td>
                    <td className="text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <div className="flex justify-center">
                        <Link to={`/assign_personnel/${item.id}`}>
                          <button 
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded"
                            title="View Request"
                          >
                            <FontAwesomeIcon icon="eye" className="mr-0" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      ) : null}
    </PageComponent>
  )
}