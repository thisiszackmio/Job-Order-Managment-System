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

  return (
    <PageComponent title="Employee Details">
      <div className="ppa-widget request-form px-4 pb-6 mt-8">
        {/* Header */}
        <div className="joms-user-info-header text-left"> 
          User Details
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <img className="h-6 w-auto mr-1" src={loading_table} alt="Loading" />
            <span className="loading-table">Loading User</span>
          </div>
        ):(
        <>
          {/* Detail */}
          <div className="detail-container mt-5">
            {/* Avatar and Esig */}
            <div>
              {/* Avatar */}
              <div>
                <img
                  src={userDet.avatar}
                  alt="User"
                  className="user-image mx-auto"
                  loading="lazy"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
              </div>
              {/* Esig */}
              <div className="mt-4">
                <img
                  src={userDet?.esig}
                  alt="User Signature"
                  className="ppa-esignature-prf mb-2 mx-auto"
                  loading="lazy"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
              </div>
            </div>

            {/* Details */}
            <div>
              {/* User ID */}
              <div className="flex items-center mt-3">
                <div className="w-36">
                  <label className="det-form-title">
                    User ID:
                  </label> 
                </div>
                <div className="w-full">
                  <div className="w-1/2">
                    {userDet?.id}
                  </div>
                </div>
              </div>

              {/* User Name */}
              <div className="flex items-center mt-3">
                <div className="w-36">
                  <label className="det-form-title">
                    User Name:
                  </label> 
                </div>
                <div className="w-full">
                  <div className="w-1/2">
                    {userDet?.name}
                  </div>
                </div>
              </div>

              {/* Position */}
              <div className="flex items-center mt-3">
                <div className="w-36">
                  <label className="det-form-title">
                    Position:
                  </label> 
                </div>
                <div className="w-full">
                  <div className="w-1/2">
                    {userDet?.position}
                  </div>
                </div>
              </div>

              {/* Division */}
              <div className="flex items-center mt-3">
                <div className="w-36">
                  <label className="det-form-title">
                    Division:
                  </label> 
                </div>
                <div className="w-full">
                  <div className="w-1/2">
                    {userDet?.division}
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div className="flex items-start mt-3">
                <div className="w-36">
                  <label className="det-form-title">
                    Badge:
                  </label> 
                </div>
                <div className="w-full">
                  <div className="w-1/2 flex flex-wrap gap-2">
                    {userDet?.code_clearance
                      ?.split(',')
                      .map((badge, index) => (
                        <span key={index} className={`badge-${badge.trim()}`}>
                          {badge.trim()}
                        </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        )}
      </div>
    </PageComponent>
  );
}