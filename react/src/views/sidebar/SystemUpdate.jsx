import PageComponent from "../../components/PageComponent";

export default function SystemUpdate(){

  return(
    <PageComponent title="System Update Release Note">

      <h2 className="text-xl font-bold leading-7 text-gray-900"> <b>Release:</b> Job Order Management System v1.2.0 </h2>
      <p className="mt-2">We’re excited to announce the release of version 1.2.1 of the Job Order Management System.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> What's New: </h2>
      <p className="mt-2"> We've made several improvements to enhance the system's performance and functionality.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> 1. Pending Request </h2>
      <p className="mt-2"> - The page now indicates access for <b>GSO</b>, <b>PM</b>, <b>AD</b>, and <b>Authorized Personnel</b>.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> 2. Request Forms </h2>
      <p className="mt-2"> - Fixed issues and optimized request forms.</p>
      <p className="mt-2"> - <b>Pre/Post Inspection Form</b>: GSO can now edit Parts A to D. If there is no Division Manager or Admin Manager approval, their signatures will not appear.</p>
      <p className="mt-2"> - <b>Vehicle Slip Form</b>: Added option for <i>Outside the City</i> with a note field (see form).</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> 3. Vehicle and Driver Availability </h2>
      <p className="mt-2"> New features for GSO and Authorized Personnel on the Vehicle Slip Form:</p>
      <p className="mt-2"> a. Driver and vehicle will auto-set to “Available” if manual update is missed.</p>
      <p className="mt-2"> b. If scheduled on the next date, and assigned, driver/vehicle will be marked “RESERVE.”</p>
      <p className="mt-2"> c. GSO and Authorized Personnel can manually mark driver/vehicle as “Not Available.”</p>
      <p className="mt-2"> d. Assignment of driver/vehicle will not proceed if date and time of arrival are not set.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> Upcoming Form </h2>
      <p className="mt-2"> <b>Personnel Locator Slip</b> <i>(coming soon)</i></p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> If you encounter any issues, please inform the developer: </h2>
      <p className="mt-2">IP Phone: <b>4084</b></p>
      <p className="mt-2">Server Room Phone: <b>228-5373</b>.</p>
      <p className="mt-2">Thank you for your continued use and support of JOMS.</p> 

    </PageComponent>
  )

}