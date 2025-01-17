import React from "react";

const MaintenancePage = () => {
  return (
    <div
      className="min-h-screen ppa-cover font-roboto items-center justify-center flex flex-col"
      style={{ backgroundImage: "url('default/ppa_bg.png')" }}
    >
      <div className="container-fluid flex flex-col items-center text-center">
        {/* Image Section */}
        <img
          className="under-main mb-5"
          src="default/under.png"
          alt="Under Maintenance"
        />

        {/* Text Section */}
        <div className="w-full ground-color">
          <h2 className="error-h1">Under Construction</h2>
          <p className="description">
            The system is under construction. We are working very hard to give you
            the best experience with this one.
          </p>
        </div>
      </div>
    </div>

  );
};


export default MaintenancePage;
