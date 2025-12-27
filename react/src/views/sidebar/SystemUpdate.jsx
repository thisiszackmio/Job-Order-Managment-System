import PageComponent from "../../components/PageComponent";

export default function SystemUpdate(){

  return(
    <PageComponent title="System Update Release Note">

      <h2 className="text-xl font-bold leading-7 text-gray-900"> <b>Release:</b> Job Order Management System v1.2.2 </h2>
      <p className="mt-2">We’re excited to announce the release of version 1.2.2 of the Job Order Management System.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> What's New: </h2>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> Overall: </h2>
      <p className="mt-2"> - Revamped the entire design to make the system more aesthetic and user-friendly.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> Sidebar: </h2>
      <p className="mt-2"> - Added page highlighting to clearly indicate the current page being viewed.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> Dashboard: </h2>
      <p className="mt-2"> - Updated icons in the Forms Detail section.</p>
      <p className="mt-2"> - Added a new section: “Most Requested Personnel.”</p>
      <p className="mt-2"> - Moved the Profile access to the top-right corner of the page.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> Bug Fixes: </h2>
      <p className="mt-2"> - Fixed issues with editing details in the Vehicle Slip Form.</p>
      <p className="mt-2"> - Implemented automatic availability updates for drivers and vehicles when there are no schedules.</p>
      <p className="mt-2"> - Enabled editing functionality for forms.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> Upcoming Form </h2>
      <p className="mt-2"> <b>Personnel Locator Slip</b> <i>(coming soon)</i></p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> If you encounter any issues, please inform the developer: </h2>
      <p className="mt-2">IP Phone: <b>4084</b></p>
      <p className="mt-2">Server Room Phone: <b>228-5373</b>.</p>
      <p className="mt-2">Thank you for your continued use and support of JOMS.</p>

    </PageComponent>
  )

}