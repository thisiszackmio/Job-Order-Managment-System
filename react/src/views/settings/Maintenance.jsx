import PageComponent from "../../components/PageComponent";
import { useUserStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios";
import Restrict from "../../components/Restrict";
import noPhone from "/default/no-phone.png";
import { useEffect, useState } from "react";

export default function Maintenance(){

  const { currentUserCode } = useUserStateContext();

  const [updating, setUpdating] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
    
  // Detect Mobile Screen
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    };

    checkScreen(); // run on load
    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const ucode = currentUserCode;
  const codes = ucode.split(',').map(code => code.trim());
  const SuperAdmin = codes.includes("HACK");

  useEffect(() => {
    axiosClient.get("settings/maintenance").then(res => {
      setMaintenance(res.data.maintenance);
    });
  }, []);

  const toggleMaintenance = () => {
    setUpdating(true);

    const newMode = maintenance ? "off" : "on";
    axiosClient.post("settings/maintenance/update", { mode: newMode });
    setMaintenance(!maintenance);
    setUpdating(false);
  };

  return(
    <PageComponent title="General Settings">
      {!isMobile ? (
        SuperAdmin ? (
        <div className="flex items-center mt-4">
          <div className="w-95">
            <label htmlFor="rep_date" className="block text-lg leading-6 text-black"> 
              Maintenance Mode Activation: 
            </label> 
          </div>
          <div className="w-1/2">
            <button
              onClick={toggleMaintenance}
              disabled={updating}
              style={{
                backgroundColor: maintenance ? '#132E51' : '#808080',
              }}
              className="w-[50px] h-6 flex items-center justify-between rounded-full px-1 transition-colors duration-300 ml-10 relative"
            >
              <span className={`text-[10px] font-bold text-white z-10 transition-opacity duration-200 ${maintenance ? 'opacity-100' : 'opacity-0'}`}>
                ON
              </span>
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 absolute ${
                  maintenance ? "translate-x-[25px]" : "translate-x-0"
                }`}
                style={{ left: '2px', top: '2px' }}
              ></div>
              <span className={`text-[10px] font-bold text-white z-10 transition-opacity duration-200 ${!maintenance ? 'opacity-100' : 'opacity-0'}`}>
                OFF
              </span>
            </button>
          </div>
        </div>
      ):(<Restrict />)
      ):(
        <div className="min-h-100 font-roboto items-center justify-center flex flex-col">
        <div className="container-fluid flex flex-col items-center text-center">

          {/* Image Section */}
          <img
            className="no-phone mb-5"
            src={noPhone}
            alt="Under Maintenance"
          />

          {/* Text Section */}
          <div className="w-full">
            <h1 className="no-phone-tag">SORRY!</h1>
            <p className="description">
              This page is not accessible on mobile devices.
            </p>
          </div>

        </div>
      </div>
      )}
    </PageComponent>
  );
}