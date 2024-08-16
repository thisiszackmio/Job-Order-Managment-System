import PageComponent from "../../components/PageComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

export default function DashboardJOMS(){
  return (
    <PageComponent title="Dashboard">
      <div className="font-roboto">
  
        {/* Request Form */}
        <div className="grid grid-cols-5 gap-4 mt-10">

          {/* For Repair */}
          <div className="col-span-1 ppa-widget">
            <div className="joms-dashboard-title"> Pre/Post Repair Inspection Form </div>
            <div className="joms-count">1000</div>
            <div className="joms-word-count">Total Count</div>
            <div className="ppa-system-link"> Request Form </div>
          </div>

          {/* For Facility */}
          <div className="col-span-1 ppa-widget">
            <div className="joms-dashboard-title"> Facility / Venue Form </div>
            <div className="joms-count">1000</div>
            <div className="joms-word-count">Total Count</div>
            <div className="ppa-system-link"> Request Form </div>
          </div>

          {/* For Vehicle Slip */}
          <div className="col-span-1 ppa-widget">
            <div className="joms-dashboard-title"> Vehicle Slip </div>
            <div className="joms-count">1000</div>
            <div className="joms-word-count">Total Count</div>
            <div className="ppa-system-link"> Request Slip </div>
          </div>

          {/* For Equipment */}
          <div className="col-span-1 ppa-widget">
            <div className="joms-dashboard-title"> Equipment Form </div>
            <div className="joms-count">0</div>
            <div className="joms-word-count">Total Count</div>
            <div className="ppa-system-link"> (Coming Soon) </div>
          </div>

          {/* For Other */}
          <div className="col-span-1 ppa-widget">
            <div className="joms-dashboard-title"> Other Form Request </div>
            <div className="joms-count">0</div>
            <div className="joms-word-count">Total Count</div>
            <div className="ppa-system-link"> (Coming Soon) </div>
          </div>

        </div>

      </div>
    </PageComponent>
  );
}