import React from "react";

const MaintenancePage = () => {
  return (
    <div
      className="min-h-screen ppa-cover font-roboto items-center justify-center flex flex-col"
    >
      <div className="container-fluid flex flex-col items-center text-center">
        {/* Image Section */}
        <img
          className="under-main mb-5"
          src="/default/zack-vector.png"
          alt="Under Maintenance"
        />

        {/* Text Section */}
        <div className="w-full ground-color">
          <h1 className="h-tag">BE RIGHT BACK GUYS!</h1>
          <h2 className="error-h1">JOMS is Under Maintenance</h2>
          <p className="description">
            The system is currently under maintenance. The developer is working hard to provide you with the best experience possible. Please bear with us during this time
          </p>
        </div>
      </div>
    </div>

  );
};


export default MaintenancePage;
