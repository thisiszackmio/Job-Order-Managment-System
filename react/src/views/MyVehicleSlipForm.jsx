import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import ForbiddenComponent from "../components/403";
import { Link, useParams } from "react-router-dom";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import { useUserStateContext } from "../context/ContextProvider";

export default function MyRequestVehicleSlip(){

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function formatTime(timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    let amOrPm = 'am';
    let formattedHours = parseInt(hours, 10);
  
    if (formattedHours >= 12) {
      amOrPm = 'pm';
      if (formattedHours > 12) {
        formattedHours -= 12;
      }
    }
  
    const formattedTime = `${formattedHours}:${minutes}${amOrPm}`;
    return formattedTime;
  }

  const {id} = useParams();

  const { currentUser, userRole } = useUserStateContext();

  const [loading, setLoading] = useState(true);

  const[displayRequestVehicle, setDisplayRequestVehicle] = useState([]);

  const fetchVehicleSlipForm = () => {
    axiosClient
    .get(`/myvehicleformrequest/${id}`)
    .then((response) => {
      const responseData = response.data;
      const viewVehicleSlipData = responseData.view_vehicle;
      const countPassengers = responseData.passenger_count;

      const mappedData = viewVehicleSlipData.map((dataItem, index) => {
        return{
          id: dataItem.id,
          date_requested: dataItem.date_of_request,
          purpose: dataItem.purpose,
          passenger: dataItem.passengers,
          passengerCount: countPassengers[index].passengers_count,
          place_visit: dataItem.place_visited,
          date_arrival: dataItem.date_arrival,
          time_arrival: dataItem.time_arrival,
          vehicle_type: dataItem.vehicle_type,
          driver: dataItem.driver,
          remarks: dataItem.admin_approval
        }
      });

      setDisplayRequestVehicle({mappedData:mappedData});
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
        console.error('Error fetching data:', error);
    });
  }

  useEffect(() => { 
    fetchVehicleSlipForm();
  }, []);

  //Restrict
  const Users = currentUser.id == id || userRole == 'hackers';

  return Users ? (
    <PageComponent title="Vehicle Slip Form">
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
      <div className="mt-4 overflow-x-auto">
        {displayRequestVehicle.mappedData.length > 0 ? (
          <table className="border-collapse">
            <thead>
              <tr className="bg-gray-100">
                  <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
                  <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Purpose</th>
                  <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Visited Place</th>
                  <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date/Time of Arrival</th>   
                  <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Vehicle</th>
                  <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Driver</th>
                  <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">No of Passengers</th>
                  <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayRequestVehicle.mappedData.map((getData) => (
                <tr key={getData.id}>
                  <td className="px-3 py-1 align-top border border-custom w-40 text-base">{formatDate(getData.date_requested)}</td>
                  <td className="px-3 py-1 align-top border border-custom w-60 text-base">{getData.purpose}</td>
                  <td className="px-3 py-1 align-top border border-custom w-60 text-base">{getData.place_visit}</td>
                  <td className="px-3 py-1 align-top border border-custom w-72 text-base">{formatDate(getData.date_arrival)} @ {formatTime(getData.time_arrival)}</td>
                  <td className="px-3 py-1 align-top border border-custom w-80 text-base">
                  <span dangerouslySetInnerHTML={{
                    __html: getData.vehicle_type === 'None' 
                      ? getData.vehicle_type 
                      : `<b>${getData.vehicle_type.split('=')?.[0]}</b>${getData.vehicle_type.split('=')?.[1]}`
                  }} />
                  </td>
                  <td className="px-3 py-1 align-top border border-custom w-56 text-base">
                    {getData.driver}
                  </td>
                  <td className="px-3 py-1 align-top text-center border border-custom w-20 text-base">
                    {getData.passenger == 'None' ? (getData.passenger):(getData.passengerCount)}
                  </td>
                  <td className="px-3 py-1 align-top border border-custom w-auto text-base">
                  {getData.remarks == 5 && (<span className="pending-status">Pending</span>)}
                  {getData.remarks == 4 && (<span className="pending-status">Waiting on Admin's Approval</span>)}
                  {getData.remarks == 3 && (<span className="disapproved-status">Disapproved</span>)}
                  {getData.remarks == 2 && (<span className="approved-status">Approved</span>)}
                  {getData.remarks == 1 && (<span className="finish-status">Closed</span>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ):(
          <div className="px-6 py-6 text-center font-bold whitespace-nowrap">No Request for you Yet</div>
        )}
      </div>
      <div className="text-right text-sm/[17px]">
        {displayRequestVehicle.mappedData.length > 0 ? (
          <i>Total of <b> {displayRequestVehicle.mappedData.length} </b> Vehicle Slip Request</i>
        ) : null}
      </div>
    </>  
    )}
    </PageComponent>
  ):(
    <ForbiddenComponent />
  );

}