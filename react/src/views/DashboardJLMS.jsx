import PageComponent from "../components/PageComponent";

export default function DashboardJLMS(){
  return (
    <PageComponent title="Dashboard">
      <div className="font-roboto">
        
        {/* Announcement */}
        <div className="ppa-widget">
          <div className="ppa-widget-title">Announcement Board</div>
          <div className="ppa-div-table" style={{ minHeight: '300px', maxHeight: '300px', overflowY: 'auto' }}>
            <table className="ppa-table w-full">
              <tbody>
                <tr>
                  <td className="px-1 py-2 align-top table-font w-4/5 text-left">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</td>
                  <td className="px-1 py-2 align-top table-font text-center">Jan 1, 1980</td>
                </tr>
                <tr>
                  <td className="px-1 py-2 align-top table-font w-4/5 text-left">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure.</td>
                  <td className="px-1 py-2 align-top table-font text-center">Jan 1, 1980</td>
                </tr>
                <tr>
                  <td className="px-1 py-2 align-top table-font w-4/5 text-left">Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</td>
                  <td className="px-1 py-2 align-top table-font text-center">Jan 1, 1980</td>
                </tr>
                <tr>
                  <td className="px-1 py-2 align-top table-font w-4/5 text-left">Sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.</td>
                  <td className="px-1 py-2 align-top table-font text-center">Jan 1, 1980</td>
                </tr>
                <tr>
                  <td className="px-1 py-2 align-top table-font w-4/5 text-left">Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris.</td>
                  <td className="px-1 py-2 align-top table-font text-center">Jan 1, 1980</td>
                </tr>
                <tr>
                  <td className="px-1 py-2 align-top table-font w-4/5 text-left">Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</td>
                  <td className="px-1 py-2 align-top table-font text-center">Jan 1, 1980</td>
                </tr>
                <tr>
                  <td className="px-1 py-2 align-top table-font w-4/5 text-left">Sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.</td>
                  <td className="px-1 py-2 align-top table-font text-center">Jan 1, 1980</td>
                </tr>
                <tr>
                  <td className="px-1 py-2 align-top table-font w-4/5 text-left">Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris.</td>
                  <td className="px-1 py-2 align-top table-font text-center">Jan 1, 1980</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* System Link */}
        <div className="grid grid-cols-5 gap-4 mt-10">

          {/* For AMS */}
          <div className="col-span-1 ppa-widget">

            <div className="ppa-system-abbr">
              <img className="mx-auto" style={{ position: 'absolute', width: 'auto', height: '60px', left: '40px' }} src="asset.png" alt="Your Company"/>  
              AMS
            </div>

            <div className="ppa-system-text">
              Asset Management System
            </div>

            <div className="ppa-system-link">
              Go to the System
            </div>

          </div>

          {/* For JOMS */}
          <div className="col-span-1 ppa-widget">

            <div className="ppa-system-abbr">
              <img className="mx-auto" style={{ position: 'absolute', width: 'auto', height: '50px', top: '5px', left: '40px' }} src="checklist.png" alt="Your Company"/>  
              JOMS
            </div>

            <div className="ppa-system-text">
              Job Order Management System
            </div>

            <div className="ppa-system-link">
              Go to the System
            </div>

          </div>

          {/* For PPS */}
          <div className="col-span-1 ppa-widget">

            <div className="ppa-system-abbr">
              <img className="mx-auto" style={{ position: 'absolute', width: 'auto', height: '60px', left: '40px' }} src="groups.png" alt="Your Company"/>  
              PPS
            </div>

            <div className="ppa-system-text">
              Personnel Profiling System
            </div>

            <div className="ppa-system-link">
              (Coming Soon)
            </div>

          </div>

          {/* For DTS */}
          <div className="col-span-1 ppa-widget">

            <div className="ppa-system-abbr">
              <img className="mx-auto image-icon" style={{ position: 'absolute', width: 'auto', height: '60px', left: '40px' }} src="paper.png" alt="Your Company"/>  
              DTS
            </div>

            <div className="ppa-system-text">
              Document Tracking System
            </div>

            <div className="ppa-system-link">
              (Coming Soon)
            </div>

          </div>

          {/* For DIS */}
          <div className="col-span-1 ppa-widget">

            <div className="ppa-system-abbr">
              <img className="mx-auto" style={{ position: 'absolute', width: 'auto', height: '60px', left: '40px' }} src="fill.png" alt="Your Company"/>  
              DIS
            </div>

            <div className="ppa-system-text">
              Database of Issuance System
            </div>

            <div className="ppa-system-link">
              (Coming Soon)
            </div>

          </div>

        </div>

      </div>
    </PageComponent>
  );
}