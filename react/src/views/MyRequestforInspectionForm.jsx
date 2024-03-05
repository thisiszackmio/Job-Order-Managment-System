import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import { useParams } from "react-router-dom";
import loadingAnimation from '/public/ppa_logo_animationn_v4.gif';
import { useUserStateContext } from "../context/ContextProvider";

export default function MyRequestForRepairInspection(){

  const { currentUser, userRole } = useUserStateContext();

  //Date Format
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const [loading, setLoading] = useState(false);
  const [displayRequest, setDisplayRequest] = useState([]);

  return (
  <PageComponent title="Pre/Post Repair Inspection Form">
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
    {/* Supervisor */}
    <div className="flex">
      <p className="text-sm leading-7 text-black w-20" style={{ paddingTop: '10px', paddingBottom: '10px' }}>Approver: </p>
        <span style={{ backgroundColor: '#f2f2f2', padding: '10px', fontFamily: 'Rockwell, serif' }}>
          John Doe
        </span>
    </div>

    {/* Display Table */}
    <div className="mt-4 overflow-x-auto">
      <table className="border-collapse font-arial" style={{ width: '2500px' }}>
        <thead>
          <tr className="bg-gray-100">
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">No.</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Date</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Property No</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Acquisition Date</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Acquisition Cost</th> 
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Brand/Model</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Serial/Engine No</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Type of Property</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Description </th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Location </th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Complain/Defect</th>
            <th className="px-1 py-3 text-center text-xs font-medium text-gray-600 uppercase border border-custom">Status</th>
          </tr>
        </thead>
        <tbody>
            <tr>
              <td className="px-1 py-2 text-center align-top border font-bold border-custom w-1">1</td>
              <td className="px-1 py-2 align-top border border-custom w-40">March 1, 2024</td>
              <td className="px-1 py-2 align-top border border-custom w-80">Test Property No</td>
              <td className="px-1 py-2 align-top border border-custom w-40">June 18, 2020</td>
              <td className="px-1 py-2 align-top border border-custom w-40">₱50000</td>
              <td className="px-1 py-2 align-top border border-custom w-56">Test Model</td>
              <td className="px-1 py-2 align-top border border-custom w-56">Test Serial</td>
              <td className="px-1 py-2 align-top border border-custom w-80">IT & Material</td>
              <td className="px-1 py-2 align-top border border-custom w-56">Test Description</td>
              <td className="px-1 py-2 align-top text-center border border-custom">Test Location</td>
              <td className="px-1 py-2 align-top border border-custom w-96">Test Complain</td>
              <td className="px-1 py-2 align-top border border-custom w-60">
              <span className="pending-status">Pending</span>
              </td>
            </tr>
            <tr>
              <td className="px-1 py-2 text-center align-top border font-bold border-custom w-1">2</td>
              <td className="px-1 py-2 align-top border border-custom w-40">March 1, 2024</td>
              <td className="px-1 py-2 align-top border border-custom w-80">Test Property No</td>
              <td className="px-1 py-2 align-top border border-custom w-40">June 18, 2020</td>
              <td className="px-1 py-2 align-top border border-custom w-40">₱50000</td>
              <td className="px-1 py-2 align-top border border-custom w-56">Test Model</td>
              <td className="px-1 py-2 align-top border border-custom w-56">Test Serial</td>
              <td className="px-1 py-2 align-top border border-custom w-80">IT & Material</td>
              <td className="px-1 py-2 align-top border border-custom w-56">Test Description</td>
              <td className="px-1 py-2 align-top text-center border border-custom">Test Location</td>
              <td className="px-1 py-2 align-top border border-custom w-96">Test Complain</td>
              <td className="px-1 py-2 align-top border border-custom w-60">
              <span className="disapproved-status">Disapproved by the Supervisor</span>
              </td>
            </tr>
            <tr>
              <td className="px-1 py-2 text-center align-top border font-bold border-custom w-1">3</td>
              <td className="px-1 py-2 align-top border border-custom w-40">March 1, 2024</td>
              <td className="px-1 py-2 align-top border border-custom w-80">Test Property No</td>
              <td className="px-1 py-2 align-top border border-custom w-40">June 18, 2020</td>
              <td className="px-1 py-2 align-top border border-custom w-40">₱50000</td>
              <td className="px-1 py-2 align-top border border-custom w-56">Test Model</td>
              <td className="px-1 py-2 align-top border border-custom w-56">Test Serial</td>
              <td className="px-1 py-2 align-top border border-custom w-80">IT & Material</td>
              <td className="px-1 py-2 align-top border border-custom w-56">Test Description</td>
              <td className="px-1 py-2 align-top text-center border border-custom">Test Location</td>
              <td className="px-1 py-2 align-top border border-custom w-96">Test Complain</td>
              <td className="px-1 py-2 align-top border border-custom w-60">
              <span className="approved-status">Approved by the Admin</span>
              </td>
            </tr>
            <tr>
              <td className="px-1 py-2 text-center align-top border font-bold border-custom w-1">4</td>
              <td className="px-1 py-2 align-top border border-custom w-40">March 1, 2024</td>
              <td className="px-1 py-2 align-top border border-custom w-80">Test Property No</td>
              <td className="px-1 py-2 align-top border border-custom w-40">June 18, 2020</td>
              <td className="px-1 py-2 align-top border border-custom w-40">₱50000</td>
              <td className="px-1 py-2 align-top border border-custom w-56">Test Model</td>
              <td className="px-1 py-2 align-top border border-custom w-56">Test Serial</td>
              <td className="px-1 py-2 align-top border border-custom w-80">IT & Material</td>
              <td className="px-1 py-2 align-top border border-custom w-56">Test Description</td>
              <td className="px-1 py-2 align-top text-center border border-custom">Test Location</td>
              <td className="px-1 py-2 align-top border border-custom w-96">Test Complain</td>
              <td className="px-1 py-2 align-top border border-custom w-60">
              <span className="finish-status">Done</span>
              </td>
            </tr>
        </tbody>
      </table>

    </div>
    <div className="text-right text-sm/[17px]">
      <i>Total of <b> 12 </b> Pre/Post Repair Request</i>
    </div>

  </>
  )}
  </PageComponent>
  );
}