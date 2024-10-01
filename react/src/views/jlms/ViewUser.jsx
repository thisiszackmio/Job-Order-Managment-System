import React, { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import axiosClient from "../../axios";
import loadingAnimation from '/ppa_logo_animationn_v4.gif';
import { useUserStateContext } from "../../context/ContextProvider";

export default function UserDetails(){

  const { currentUserId } = useUserStateContext();

  // Loading
  const [loading, setLoading] = useState(true);

  const [userDet, getUserDet] = useState([]);

  // Disable the Scroll on Popup
  useEffect(() => {
    
    // Define the classes to be added/removed
    const loadingClass = 'loading-show';

    // Function to add the class to the body
    const addLoadingClass = () => document.body.classList.add(loadingClass);

    // Function to remove the class from the body
    const removeLoadingClass = () => document.body.classList.remove(loadingClass);

    // Add or remove the class based on showPopup state
    if(loading) {
      addLoadingClass();
    }
    else {
      removeLoadingClass();
    }

    // Cleanup function to remove the class when the component is unmounted or showPopup changes
    return () => {
      removeLoadingClass();
    };
  }, [loading]);

  // Get the data
  useEffect(() => {
    axiosClient
    .get(`/userdetail/${currentUserId.id}`)
    .then((response) => {
      const userDet = response.data;

      getUserDet(userDet);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [currentUserId.id]);

  return loading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
      <img
        className="mx-auto h-44 w-auto"
        src={loadingAnimation}
        alt="Your Company"
      />
      <span className="loading-text loading-animation">
      {Array.from("Loading...").map((char, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>{char}</span>
      ))}
      </span>
    </div>
  ):(
    <PageComponent title="Employee Details">
      {/* Main Content */}
      <div className="font-roboto">

        {/* Employee List */}
        <div className="grid grid-cols-2 gap-4 mt-8">

          {/* User Details */}
          <div className="col-span-1">

            {/* Account Status*/}
            <div className="flex items-center">
              <div className="w-56">
                <label className="block text-lg font-bold leading-6 text-gray-900">
                  User Status:
                </label> 
              </div>
              <div className="w-full pl-1 text-lg">
                {userDet?.status == 1 ? ("Active"):("Deleted")}
              </div>
            </div>

            {/* User ID */}
            <div className="flex items-center mt-5">
              <div className="w-56">
                <label className="block text-lg font-bold leading-6 text-gray-900">
                  User ID:
                </label> 
              </div>
              <div className="w-full pl-1 text-lg">
                {userDet?.id}
              </div>
            </div>

            {/* User Name */}
            <div className="flex items-center mt-5">
              <div className="w-56">
                <label className="block text-lg font-bold leading-6 text-gray-900">
                  Name:
                </label> 
              </div>
              <div className="w-full pl-1 text-lg">
                {userDet.name}
              </div>
                  
            </div>

            {/* Position */}
            <div className="flex items-center mt-5">
              <div className="w-56">
                <label className="block text-lg font-bold leading-6 text-gray-900">
                Position:
                </label> 
              </div>
              <div className="w-full pl-1 text-lg">
                {userDet.position}
              </div>   
            </div>

            {/* Division */}
            <div className="flex items-center mt-5">
              <div className="w-56">
                <label className="block text-lg font-bold leading-6 text-gray-900">
                Division:
                </label> 
              </div>
              <div className="w-full pl-1 text-lg">
                {userDet.division}
              </div>
            </div>

            {/* Username */}
            <div className="flex items-center mt-5">
              <div className="w-56">
                <label className="block text-lg font-bold leading-6 text-gray-900">
                Username:
                </label> 
              </div>
              <div className="w-full">
                <div className="w-full pl-1 text-lg">
                {userDet.username}
                </div>
              </div>
            </div>

          </div>

          {/* Image */}
          <div className="col-span-1">
            <div className="col-span-1 flex flex-col items-center">
              {/* Avatar */}
              <div>
                <img src={userDet.avatar} className="user-image" alt="" onContextMenu={(e) => e.preventDefault()} draggable="false" />
              </div>
              {/* Esiga */}
              <div className="esig-area flex flex-col items-center border-b border-black relative">
                <img 
                  src={userDet.esig} 
                  alt="User Signature" 
                  className="ppa-esignature-prf" 
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
                <span className="text-base font-bold ppa-user-name">{userDet.name}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </PageComponent>
  );
}