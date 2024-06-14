import PageComponent from "../components/PageComponent";
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

        {/* Logs and Pending Request */}
        <div className="grid grid-cols-2 gap-4 mt-10">

          {/* For Pending Request for user */}
          <div className="ppa-widget col-span-1">
            <div className="ppa-widget-title">Pending Request</div>
            <div className="ppa-div-table" style={{ minHeight: '300px', maxHeight: '300px', overflowY: 'auto' }}>
              <table className="w-full">
                <tbody>

                  {/* For Inspection Form */}
                  <tr>
                    <td colSpan="3" className="pending-title pb-3"> Repair Inspection Request </td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="p-2">Control No. 1</td>
                    <td className="p-2">Test Here</td>
                    <td className="p-2 text-center">
                      <Link to={`/repairinspectionform/`}>
                        <button className="text-green-600 font-bold" title="View Request">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </Link>
                    </td>
                  </tr>

                  {/* For Facility Form */}
                  <tr>
                    <td colSpan="3" className="pending-title pb-3"> Facility / Venue Request </td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="p-2">Control No. 1</td>
                    <td className="p-2">Test Here</td>
                    <td className="p-2 text-center">
                      <Link to={`/repairinspectionform/`}>
                        <button className="text-green-600 font-bold" title="View Request">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </Link>
                    </td>
                  </tr>

                  {/* For Vehicle Slip */}
                  <tr>
                    <td colSpan="3" className="pending-title pb-3"> Vehicle Slip </td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="p-2">Control No. 1</td>
                    <td className="p-2">Test Here</td>
                    <td className="p-2 text-center">
                      <Link to={`/repairinspectionform/`}>
                        <button className="text-green-600 font-bold" title="View Request">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </Link>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

          {/* For Pending Request for user */}
          <div className="ppa-widget col-span-1">
            <div className="ppa-widget-title">Logs (June)</div>
            <div className="ppa-div-table" style={{ minHeight: '300px', maxHeight: '300px', overflowY: 'auto' }}>
              <table className="ppa-table w-full">
                <tbody>
                  <tr>
                    <td className="px-1 py-2 align-top table-font text-center">January 1, 1980</td>
                    <td className="px-1 py-2 align-top table-font w-9/12 pl-3">This is test only</td>
                  </tr>
                  <tr>
                    <td className="px-1 py-2 align-top table-font text-center">January 1, 1980</td>
                    <td className="px-1 py-2 align-top table-font w-9/12 pl-3">This is test only</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </PageComponent>
  );
}