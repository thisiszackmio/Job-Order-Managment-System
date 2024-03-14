import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
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

  return (
    <PageComponent title="My Vehicle Slip Form List">
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
          <table className="border-collapse font-roboto" style={{ width: '1800px' }}>
            <thead>
              <tr className="bg-gray-100">
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">No</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Purpose</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Visited Place</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date/Time of Arrival</th>   
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Vehicle</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Driver</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">No of Passengers</th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {currentUser.id == id || userRole === 'h4ck3rZ@1Oppa' ? (
              <>
              {displayRequestVehicle.mappedData.map((getData) => (
                <tr key={getData.id}>
                  <td className="px-1 py-2 align-top border text-center font-bold border-custom text-base w-1 table-font">{getData.id}</td>
                  <td className="px-1 py-2 align-top border border-custom text-base w-44 table-font">{formatDate(getData.date_requested)}</td>
                  <td className="px-1 py-2 align-top border border-custom text-base w-60 table-font">{getData.purpose}</td>
                  <td className="px-1 py-2 align-top border border-custom text-base w-60 table-font">{getData.place_visit}</td>
                  <td className="px-1 py-2 align-top border border-custom text-base w-72 table-font">{formatDate(getData.date_arrival)} @ {formatTime(getData.time_arrival)}</td>
                  <td className="px-1 py-2 align-top border border-custom text-base w-64 table-font">
                  <span dangerouslySetInnerHTML={{
                    __html: getData.vehicle_type === 'None' 
                      ? getData.vehicle_type 
                      : `<b>${getData.vehicle_type.split('=')?.[0]}</b>${getData.vehicle_type.split('=')?.[1]}`
                  }} />
                  </td>
                  <td className="px-1 py-2 align-top border border-custom w-56 text-base table-font">
                    {getData.driver}
                  </td>
                  <td className="px-1 py-2 align-top text-center border border-custom w-20 text-base table-font">
                    {getData.passenger == 'None' ? (getData.passenger):(getData.passengerCount)}
                  </td>
                  <td className="px-1 py-2 align-top border border-custom w-auto text-base table-font">
                  {getData.remarks == 5 && ("Pending")}
                  {getData.remarks == 4 && ("The GSO has received your request, filled out the data, and is now awaiting approval from the admin manager")}
                  {getData.remarks == 3 && ("The request has been disapproved by the Admin Manager")}
                  {getData.remarks == 2 && ("The request has been approved by the Admin Manager")}
                  {getData.remarks == 1 && ("The request is closed")}
                  </td>
                </tr>
              ))}
              </>
              ):(
                <td colSpan={12} className="px-1 py-2 text-center align-top border font-bold border-custom">You Cannot View This Table</td> 
              )}
              
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
  );

}