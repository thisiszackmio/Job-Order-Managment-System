import React from "react";
import PageComponent from "../components/PageComponent";
import { useUserStateContext } from "../context/ContextProvider";
import { useState, useEffect } from "react";
import axiosClient from "../axios";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner  } from '@fortawesome/free-solid-svg-icons';

export default function AdminMangerViewRequest(){
  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  library.add(faSpinner);
  const { userRole, currentUser } = useUserStateContext();
  const [isLoading, setIsLoading] = useState(true);

  const {id} = useParams();

  const[displayRequest, setDisplayRequest] = useState([]);
  const[adminForm, setAdminForm] = useState([]);

  // Display the Details
  const fetchUser = () => {
    axiosClient
    .get(`/requestrepair/${id}`)
    .then((response) => {
        const responseData = response.data;
        const viewRequestData = responseData.view_request;
        const userDetails = responseData.user_details;
        const gsoDetails = responseData.gso_user_details;
        const manegerDetails = responseData.manager_user_details;

        setDisplayRequest({
            viewRequestData: viewRequestData,
            userDetails: userDetails,
            gsoDetails: gsoDetails,
            manegerDetails: manegerDetails,
          });

        setIsLoading(false);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
    }

  //for the Part B display
  const fetchAdmin = () => {
    axiosClient
    .get(`/inspectionformtwo/${id}`)
    .then((response) => {
      const responseData = response.data;

      const inspecId = responseData.partB.inspection__form_id;
      const dateOfFilling = responseData.partB.date_of_filling;
      const dateOfLastRepair = responseData.partB.date_of_last_repair;
      const natureOfLastRepair = responseData.partB.nature_of_last_repair;
      const InspectorName = responseData.inspector_name;

      setAdminForm({
        inspecId: inspecId,
        dateOfFilling: dateOfFilling,
        dateOfLastRepair: dateOfLastRepair,
        natureOfLastRepair: natureOfLastRepair,
        InspectorName: InspectorName
      })

    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  useEffect(()=>{
    fetchUser();
    fetchAdmin();
  },[id]);

  // Supervisor click on approval 
  function handleApproveClick(id){

    //alert(id);
    const confirmed = window.confirm('Do you want to approve the request?');

    if(confirmed) {
      axiosClient.put(`/admin_approve/${id}`)
      .then((response) => {
        setPopupMessage('Thank you for your Approval');
        setShowPopup(true);
      })
      .catch((error) => {
        console.error(error);
        setPopupMessage('Failed to approve the form. Please try again later.');
        setShowPopup(true);
      });
    }else{
      alert('You change your mind');
    }

  }

  function handleDisapproveClick(id){
    //alert(id);
    const confirmed = window.confirm('Are you sure to disapprove the request?');

    if(confirmed) {
      axiosClient.put(`/admin_disapprove/${id}`)
      .then((response) => {
        setPopupMessage('Disapprove Successfully');
        setShowPopup(true);
      })
      .catch((error) => {
        console.error(error);
        setPopupMessage('Failed to approve the form. Please try again later.');
        setShowPopup(true);
      });
    }
    else{
      alert('You change your mind');
    }
  }

  
  
  return(
    <PageComponent title="Pre-Repair/Post Repair Inspection Form">
    <div>
    {isLoading ? (
      <div className="flex items-center justify-center h-screen">
        <FontAwesomeIcon icon={faSpinner} spin />
        <span className="ml-2">Loading...</span>              
      </div>  
      ) : userRole === 'admin' ? (
        <div>
        {/* Check if userDetails is defined before accessing properties */}
        {displayRequest.userDetails ? (
          <div>
            {/* Part A */}
            <div className="mt-6">
              <h3 className="text-xl font-normal leading-6 text-gray-900">Part A: To be filled-up by Requesting Party</h3>
            </div>
            {/* ... */}
            <div className="mt-6">
              <div className="flex">
                <div className="w-36">
                  <strong>Date</strong> 
                </div>
                <div className="w-64 border-b border-black pl-1">
                  <span>{formatDate(displayRequest.viewRequestData.date_of_request)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                {/* ... */}
                <div className="mt-10">
                  <div className="flex">
                    <div className="w-1/4">
                      <strong>Property No</strong> 
                    </div>
                    <div className="w-64 border-b border-black pl-1">
                      <span>{displayRequest.viewRequestData.property_number}</span>
                    </div>
                  </div>
                </div>
                {/* ... */}
                <div className="mt-2">
                  <div className="flex">
                    <div className="w-1/4">
                      <strong>Acquisition Date</strong>
                    </div>
                    <div className="w-64 border-b border-black pl-1">
                      <span>{formatDate(displayRequest.viewRequestData.acq_date)}</span>
                    </div> 
                  </div>
                </div>
                {/* ... */}
                <div className="mt-2">
                  <div className="flex">
                    <div className="w-1/4">
                      <strong>Acquisition Cost</strong> 
                    </div>
                    <div className="w-64 border-b border-black pl-1">
                      <span>{displayRequest.viewRequestData.acq_cost}</span>
                    </div>
                  </div>
                </div>
                {/* ... */}
                <div className="mt-2">
                  <div className="flex">
                    <div className="w-1/4">
                      <strong>Brand/Model</strong> 
                    </div>
                    <div className="w-64 border-b border-black pl-1">
                      <span>{displayRequest.viewRequestData.brand_model}</span>
                    </div>
                  </div>
                </div>
                {/* ... */}
                <div className="mt-2">
                  <div className="flex">
                    <div className="w-1/4">
                      <strong>Serial/Engine No.</strong> 
                    </div>
                    <div className="w-64 border-b border-black pl-1">
                      <span>{displayRequest.viewRequestData.serial_engine_no}</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="col-span-1">
                {/* ... */}
                <div className="mt-8">
                  <div className="flex">
                    <div className="w-1/4">
                      <strong>Type of Property</strong> 
                    </div>
                    <div className="w-68">
                    {displayRequest.viewRequestData.type_of_property === 'Vehicle Supplies & Materials' ? (
                      <div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 border border-black mr-2 flex items-center justify-center text-black font-bold">X</div>
                          <span>Vehicle Supplies & Materials</span>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 border border-black mr-2 mt-1"></div>
                          <span>IT Equipment & Related Materials</span>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 border border-black mr-2 mt-1"></div>
                          <span>Others: Specify</span>
                        </div>
                      </div>
                    ) : displayRequest.viewRequestData.type_of_property === 'IT Equipment & Related Materials' ? (
                      <div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 border border-black mr-2 mt-1"></div>
                          <span>Vehicle Supplies & Materials</span>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 border border-black mr-2 flex items-center justify-center text-black font-bold mt-1">X</div>
                          <span>IT Equipment & Related Materials</span>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 border border-black mr-2 mt-1"></div>
                          <span>Others: Specify</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 border border-black mr-2 mt-1"></div>
                          <span>Vehicle Supplies & Materials</span>
                        </div>

                        <div className="flex items-center">
                        <div className="w-8 h-8 border border-black mr-2 mt-1"></div>
                          <span>IT Equipment & Related Materials</span>
                        </div>

                        <div className="flex items-center">
                          <div className="w-8 h-8 border border-black mr-2 flex items-center justify-center text-black font-bold mt-1">X</div>
                          <div>
                            <span  className="mr-2">Others:</span>
                            <span className="w-70 border-b border-black">{displayRequest.viewRequestData.property_other_specific}</span>
                          </div>
                        </div>
                      </div>
                    )}        
                    </div>
                  </div>
                </div>
                {/* ... */}
                <div className="mt-2">
                  <div className="flex">
                    <div className="w-60">
                      <strong>Description</strong> 
                    </div>
                    <div className="w-64 border-b border-black pl-1">
                      <span>{displayRequest.viewRequestData.property_description}</span>
                    </div>
                  </div>
                </div>
                {/* ... */}
                <div className="mt-2">
                  <div className="flex">
                    <div className="w-60">
                      <strong>Location (Div/Section/Unit)</strong> 
                    </div>
                    <div className="w-64 border-b border-black pl-1">
                      <span>{displayRequest.viewRequestData.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2">
                <div className="flex">
                  <div className="w-44">
                    <strong>Complain/Defect</strong>
                  </div>
                  <div className="w-full border-b border-black pl-1">
                    <span>{displayRequest.viewRequestData.complain}</span>
                  </div>
                </div>
            </div>

            {/* For Signature */}
            <div className="mt-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> REQUESTED BY: </label>

                  <div className="mt-10">
                    <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                      <div>
                      <img src={displayRequest.userDetails.requestor_signature} alt="User Signature" style={{ position: 'absolute', width: '80%', top: '-54px', }} />
                      </div>
                      <span>{displayRequest.userDetails.enduser}</span>
                    </div>
                    <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> End-User </label>
                  </div>

                </div>

                <div className="col-span-1">
                  <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> NOTED: </label>

                  <div className="mt-10">
                    <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                    {displayRequest.viewRequestData.supervisor_approval === 0 || displayRequest.viewRequestData.supervisor_approval === 2 ? (
                      <span>{displayRequest.userDetails.supervisor}</span>
                    ) : (
                      <div>
                        <img
                          src={displayRequest.userDetails.supervisor_signature}
                          alt="User Signature"
                          style={{ position: 'absolute', width: '80%', top: '-54px' }}
                        />
                        <span>{displayRequest.userDetails.supervisor}</span>
                      </div>
                    )}
                    </div>
                    <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> Immediate Supervisor </label>
                  </div>

                </div>
              </div>
            </div>

            {/* Part B */}
            <div className="mt-16">
              <h3 className="text-xl font-normal leading-6 text-gray-900">Part B: To be filled-up by Administrative Division</h3>

              {/* Date */}
              <div className="mt-10">
                <div className="flex">
                  <div className="w-36">
                    <strong>Date</strong> 
                  </div>
                  <div className="w-64 border-b border-black pl-1">
                    <span>{formatDate(adminForm.dateOfFilling)}</span>
                  </div>
                </div>
              </div>

              {/* Date of Last Repair */}
              <div className="mt-8">
                <div className="flex">
                  <div className="w-44">
                    <strong>Date of Last Repair</strong> 
                  </div>
                  <div className="w-64 border-b border-black pl-1">
                    <span>{formatDate(adminForm.dateOfLastRepair)}</span>
                  </div>
                </div>
              </div>

              {/* Nature of Repair */}
              <div className="mt-4">
                <div className="flex">
                  <div className="w-52">
                    <strong>Nature of Last Repair</strong>
                  </div>
                  <div className="w-full border-b border-black pl-1">
                    <span>{adminForm.natureOfLastRepair}</span>
                  </div>
                </div>
              </div>

              {/* Assign Personnel */}
              <div className="mt-4">
                <div className="flex">
                  <div className="w-44">
                    <strong>Assign Perosonnel</strong> 
                  </div>
                  <div className="w-64 border-b border-black pl-1">
                    <span>{adminForm.InspectorName}</span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="mt-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> REQUESTED BY: </label>

                    <div className="mt-10">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                        <div>
                        <img src={displayRequest.gsoDetails.gso_signature} alt="User Signature" style={{ position: 'absolute', width: '80%', top: '-54px', }} />
                        </div>
                        <span>{displayRequest.gsoDetails.gso_name}</span>
                      </div>
                      <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> End-User </label>
                    </div>

                  </div>

                  <div className="col-span-1">
                    <label htmlFor="type_of_property" className="block text-sm font-medium leading-6 text-gray-900"> NOTED: </label>

                    <div className="mt-10">
                      <div className="w-64 mx-auto border-b text-center border-black pl-1" style={{ position: 'relative' }}>
                      {displayRequest.viewRequestData.admin_approval === 0 || displayRequest.viewRequestData.admin_approval === 2 ? (
                        <span>{displayRequest.manegerDetails.manager_name}</span>
                      ) : (
                        <div>
                          <img
                            src={displayRequest.manegerDetails.manager_signature}
                            alt="User Signature"
                            style={{ position: 'absolute', width: '80%', top: '-90px', left: '32px' }}
                          />
                          <span>{displayRequest.manegerDetails.manager_name}</span>
                        </div>
                      )}
                      </div>
                      <label htmlFor="type_of_property" className="block text-sm text-center font-medium italic leading-6 text-gray-900"> Immediate Supervisor </label>
                    </div>

                  </div>
                </div>
              </div>

              <div className="mt-10">
                <div className="flex">
                  <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                    onClick={() => {
                      window.location.href = '/admin_manager_request';
                    }}
                  >
                    Back
                  </button>
                  
                  {displayRequest.viewRequestData.admin_approval === 0 ? (
                    <div>
                      <button 
                        onClick={() => handleApproveClick(adminForm.inspecId)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleDisapproveClick(adminForm.inspecId)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
                      >
                        Disapprove
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

            </div>

            {/* ---------------------------- */}

            {/* Show Popup */}
            {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Semi-transparent black overlay */}
            <div
              className="fixed inset-0 bg-black opacity-40" // Close on overlay click
            ></div>
            {/* Popup content with background blur */}
            <div className="absolute p-6 rounded-lg shadow-md bg-white backdrop-blur-lg">
              <p className="text-lg">{popupMessage}</p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    window.location.href = '/admin_manager_request';
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
            </div>
            )}
            
          </div>
        ) : (
          <div>User details not available.</div>
        )}
        </div>
      ) : (
        <div>Access Denied. Only admins can view this page.</div>
      )}
    </div>
    </PageComponent>
  );
}