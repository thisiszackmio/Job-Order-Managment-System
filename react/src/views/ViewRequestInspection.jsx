import React from "react";
import PageComponent from "../components/PageComponent";
import { useUserStateContext } from "../context/ContextProvider";
import { useState, useEffect } from "react";
import axiosClient from "../axios";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner  } from '@fortawesome/free-solid-svg-icons';

export default function ViewRequest(){
  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  library.add(faSpinner);
  const { userRole, currentUser } = useUserStateContext();
  const [isLoading, setIsLoading] = useState(true);

  const {id} = useParams();

  const[displayRequest, setDisplayRequest] = useState([]);

  const fetchUser = () => {
    axiosClient
    .get(`/requestrepair/${id}`)
    .then((response) => {
        const responseData = response.data;
        const viewRequestData = responseData.view_request;
        const userDetails = responseData.user_details;

        setDisplayRequest({
            viewRequestData: viewRequestData,
            userDetails: userDetails,
          });

          console.log(responseData);

        setIsLoading(false);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
    }

  useEffect(()=>{
    fetchUser();
  },[id]);
  
  return(
    <PageComponent title="View Request">
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
            <h2 className="text-2xl font-semibold leading-7 text-gray-900"> Pre-Repair/Post Repair Inspection Form </h2>
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
                    {displayRequest.viewRequestData.supervisor_approval === 0 ? (
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
            
            <div className="mt-10">
              <div className="flex">
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                  onClick={() => {
                    window.location.href = '/request_list';
                  }}
                >
                  Back
                </button>
                {currentUser.code_clearance === 3 && displayRequest.viewRequestData.supervisor_approval === 1 && (
                  <button 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      window.location.href = '/request_list';
                    }}
                  >
                    Proceed to Part B
                  </button>
                )}
              </div>
            </div>
            
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