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
  const { currentUser } = useUserStateContext();
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

  return(
    <PageComponent title={`${getTimeOfDay()}! ${currentUser.fname}`}>
       
    </PageComponent>
  )
}