import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import loading_table from "/default/ring-loading.gif";
import { useUserStateContext } from "../context/ContextProvider";

export default function UserDetails(){

  const { currentUserId } = useUserStateContext();

  // Loading
  const [loadingArea, setLoadingArea] = useState(true);

  const [userDet, getUserDet] = useState([]);

  // Get the data
  useEffect(() => {
    axiosClient
    .get(`/userdetail/${currentUserId}`)
    .then((response) => {
      const userDet = response.data;

      getUserDet(userDet);
    })
    .finally(() => {
      setLoadingArea(false);
    });
  }, [currentUserId]);

  return (
    <PageComponent title="Employee Details">
      {loadingArea ? (
        <div className="flex justify-center items-center">
          <img className="h-10 w-auto mr-1" src={loading_table} alt="Loading" />
          <span className="loading-table">Loading User</span>
        </div>
      ):(
      <>
        {/* Detail */}
        <div className="grid grid-cols-[64%_34%] gap-5 mt-6">

          {/* User Details */}
          <div>
            <div className="ppa-widget">
              <div className="joms-user-info-header text-left"> USER INFORMATION </div>

              <div className="px-4 pb-4">

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
                <div className="flex items-center mt-3">
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
                <div className="flex items-center mt-3">
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
                <div className="flex items-center mt-3">
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
                <div className="flex items-center mt-3">
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
                <div className="flex items-center mt-3">
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

                {/* Esignature */}
                <div className="flex items-center mt-3">
                  <div className="w-56">
                    <label className="block text-lg font-bold leading-6 text-gray-900">
                    E-sig:
                    </label> 
                  </div>
                  <div className="w-full">
                    <div className="w-full pl-1 text-lg">
                    <img 
                      src={userDet.esig} 
                      alt="User Signature" 
                      className="ppa-esignature-prf" 
                      onContextMenu={(e) => e.preventDefault()}
                      draggable="false"
                    />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Right */}
          <div>
            <div className="ppa-widget">
              <div className="joms-user-info-header text-left"> DISPLAY PICTURE </div>
              <div className="px-4 pb-4 flex justify-center">
                <img
                  src={userDet.avatar}
                  className="user-image"
                  alt=""
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
              </div>
            </div>
          </div>

        </div>
      </>
      )}
    </PageComponent>
  );
}