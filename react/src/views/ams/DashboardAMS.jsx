import { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import loadingAnimation from '/default/ppa_logo_animationn_v4.gif';
import loading_table from "/default/ring-loading.gif";

export default function DashboardAMS(){

  // Loading
  const [loading, setLoading] = useState(true);
  const [loadingArea, setLoadingArea] = useState(true);

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

  // Set Delay for Loading
  useEffect(() => {
    // Simulate an authentication check
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  return (
    <PageComponent title="AMS Dashboard">

      {/* Preload Screen */}
      {loading && (
        <div className="pre-loading-screen z-50">
          <img className="mx-auto h-44 w-auto" src={loadingAnimation} alt="Your Company" />
          <span className="loading-text loading-animation">
          {Array.from("Loading...").map((char, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>{char}</span>
          ))}
          </span>
        </div>
      )}

      {/* Form Count */}
      <div className="grid grid-cols-3 gap-4">

        {/* Motor Vehicles */}
        <div className="col-span-1 ppa-widget">
          <div className="joms-dashboard-title"> Motor Vehicles </div>
          <div className="joms-count">8</div>
          <div className="joms-word-count">Total Count</div>
        </div>

        {/* Information Communication Technology */}
        <div className="col-span-1 ppa-widget">
          <div className="joms-dashboard-title"> Information Communication Technology </div>
          <div className="joms-count">2</div>
          <div className="joms-word-count">Total Count</div>
        </div>

        {/* Information Communication Technology */}
        <div className="col-span-1 ppa-widget">
          <div className="joms-dashboard-title"> Land, Building & Structures </div>
          <div className="joms-count">16</div>
          <div className="joms-word-count">Total Count</div>
        </div>

      </div>

    </PageComponent>
  );
}