import React, { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import loading_table from "/default/ring-loading.gif";
import { useUserStateContext } from "../context/ContextProvider";

export default function UserDetails(){
  const { currentUserId } = useUserStateContext();

  const [loading, setLoading] = useState(true);

  // --- Get Details --- //
  const [userDet, getUserDet] = useState([]);

  const fetchUserDet = async () => {
    try {
      const response = await axiosClient.get(`/userdetail/${currentUserId}`);
      const dataUserDet = response.data;

      getUserDet(dataUserDet);

    } catch(error){
        console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    if(currentUserId){
      fetchUserDet();
    }
  }, [currentUserId]);

  const clearanceOrder = [ 'PM', 'AM', 'DM', 'GSO', 'HACK', 'AUS', 'AUI', 'AUF', 'AUV', 'SEC', 'AP', 'MEM' ];

  const sortedClearance =
  userDet?.code_clearance
    ?.split(',')
    .map(item => item.trim())
    .sort((a, b) => clearanceOrder.indexOf(a) - clearanceOrder.indexOf(b)) || [];

  return (
    <PageComponent title="Employee Details">
      <div className="ppa-widget request-form px-4 pb-6 mt-8">
        {/* Header */}
        <div className="joms-user-info-header text-left"> Profile Details </div>

        {/* Det */}
        <div className="detail-container mt-5">
          {/* Avatar and Esig */}
          <div>
            {/* Avatar */}
            <div>
              {loading ? (
                <div className="skeleton-user-image w-full"></div>
              ):(
                <img
                  src={userDet.avatar}
                  alt="User"
                  className="user-image mx-auto"
                  loading="lazy"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
              )}
            </div>

            {/* Esig */}
            <div className="mt-5">
              {loading ? (
                <div className="skeleton-signature"></div>
              ) : (
                <img
                  src={userDet?.esig}
                  alt="User Signature"
                  className="ppa-esignature-prf mx-auto"
                  loading="lazy"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            {/* User ID */}
            <div className="flex items-stretch mt-10 md:mt-0">
              {/* Label */}
              <div className="w-28 md:w-52 flex form-title items-center">
                <label>
                  User ID
                </label>
              </div>
              {/* Content */}
              <div className="flex w-full">
                {loading ? (
                  <div className="skeleton-form w-full md:w-1/2"></div>
                ) : (
                  <div className="w-full md:w-1/2">
                    <div className="w-full h-full ppa-form-confirm flex items-center">
                      {userDet?.userId}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Fullname */}
            <div className="flex items-stretch mt-2">
              {/* Label */}
              <div className="w-28 md:w-52 flex form-title items-center">
                <label> 
                  Name 
                </label> 
              </div>
              {/* Content */}
              <div className="flex w-full">
                {loading ? (
                  <div className="skeleton-form w-full md:w-1/2"></div>
                ):(
                <>
                  <div className="w-full md:w-1/2">
                    <div className="w-full h-full ppa-form-confirm flex items-center">
                      {userDet.name}
                    </div>
                  </div>
                </>
                )}
              </div>
            </div>

            {/* Position */}
            <div className="flex items-stretch mt-2">
              {/* Label */}
              <div className="w-28 md:w-52 flex form-title items-center">
                <label> 
                  Position 
                </label> 
              </div>
              {/* Content */}
              <div className="flex w-full">
                {loading ? (
                  <div className="skeleton-form w-full md:w-1/2"></div>
                ):(
                <>
                  <div className="w-full md:w-1/2">
                    <div className="w-full h-full ppa-form-confirm flex items-center">
                      {userDet?.position}
                    </div>
                  </div>
                </>
                )}
              </div>
            </div>

            {/* Division */}
            <div className="flex items-stretch mt-2">
              {/* Label */}
              <div className="w-28 md:w-52 flex form-title items-center">
                <label> 
                  Division 
                </label> 
              </div>
              {/* Content */}
              <div className="flex w-full">
                {loading ? (
                  <div className="skeleton-form w-full md:w-1/2"></div>
                ):(
                <>
                  <div className="w-full md:w-1/2">
                    <div className="w-full h-full ppa-form-confirm flex items-center">
                      {userDet?.division}
                    </div>
                  </div>
                </>
                )}
              </div>
            </div>

            {/* Username */}
            <div className="flex items-stretch mt-2">
              {/* Label */}
              <div className="w-28 md:w-52 flex form-title items-center">
                <label> 
                  Username 
                </label> 
              </div>
              {/* Content */}
              <div className="flex w-full">
                {loading ? (
                  <div className="skeleton-form w-full md:w-1/2"></div>
                ):(
                <>
                  <div className="w-full md:w-1/2">
                    <div className="w-full h-full ppa-form-confirm flex items-center">
                      {userDet?.username}
                    </div>
                  </div>
                </>
                )}
              </div>
            </div>

            {/* Badge */}
            <div className="flex items-stretch mt-2">
              {/* Label */}
              <div className="w-28 md:w-52 flex form-title items-center">
                <label> 
                  Badge 
                </label> 
              </div>
              {/* Content */}
              <div className="flex w-full">
                {loading ? (
                  <div className="skeleton-form w-1/2"></div>
                ):(
                <>
                  <div className="flex w-full md:w-1/2">
                    {sortedClearance.map((code, index) => (
                        <div
                          key={index}
                          className={`w-full h-full flex items-center badge badge-${code} ${
                            index === sortedClearance.length - 1
                              ? 'rounded-tr-[4px] rounded-br-[4px]'
                              : ''
                          }`}
                        >
                          {code}
                        </div>
                      ))}
                  </div>
                </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageComponent>
  );
}