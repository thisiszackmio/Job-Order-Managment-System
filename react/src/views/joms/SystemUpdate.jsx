import PageComponent from "../../components/PageComponent";

export default function SystemUpdate(){

  return(
    <PageComponent title="System Update Release Note">

      <h2 className="text-xl font-bold leading-7 text-gray-900"> Release: Job Order Management System v1.2.0 </h2>
      <p className="mt-2">We're excited to announce the release of version 1.2.0 of the Job Order Management System.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> What's New: </h2>
      <p className="mt-2"> We've made several improvements to enhance the system's performance and functionality.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> 1. Login Function Improvement </h2>
      <p className="mt-2"> - We've resolved an issue with the login process. Now, if a user is already logged in, you can simply click "Proceed" to continue without calling on the developer.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> 2. Login Restriction </h2>
      <p className="mt-2"> - Access has been restricted so that only the Job Order Management System (JOMS) can be logged into. Users will no longer be able to log in from the JLMS interface.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> 3. Maintenance Mode </h2>
      <p className="mt-2"> - A new Maintenance Mode feature has been added, allowing the system to be temporarily disabled for regular users during updates or critical changes. While active, only authorized users (e.g., Super Admin) will have access, ensuring secure and uninterrupted maintenance operations.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> 4. Request Form </h2>
      <p className="mt-2"> - Before submitting the form, the system will double-check it to help avoid misspellings.</p>
      <p className="mt-2"> - The requestor is not authorized to update or edit the form after submission.</p>
      <p className="mt-2"> - The requestor is authorized to cancel the request if the form is not approved by the Supervisor or Managers.</p>
      <p className="mt-2"> - When the form is complete, the requestor can print it as a PDF for their records.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> 5. Authorized Personnel </h2>
      <p className="mt-2"> - The Division Managers / Port Manager has the authority to approve or disapprove the form request.</p>
      <p className="mt-2"> - The GSO will have full control over the form, except for the approval and disapproval functions.</p>
      <p className="mt-2"> - The assigned personnel will have limited access to the form, such as Pre/Post inspection forms.</p>
      <p className="mt-2"> - There is a designated authorized personnel specifically for the vehicle slip form, responsible for assigning drivers and vehicles.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> 6. New Features of the System </h2>
      <p className="mt-2"> - Double-check the form before submitting.</p>
      <p className="mt-2"> - Cancel the form.</p>
      <p className="mt-2"> - Disable driver and vehicle if they are currently on travel.</p>
      <p className="mt-2"> - Maintenance mode page.</p>

      <h2 className="text-lg font-bold leading-7 text-gray-900 mt-6"> CONCLUSION </h2>
      <p className="mt-2">These updates are part of our ongoing efforts to improve the system’s reliability, user experience, and operational efficiency. We encourage all users to familiarize themselves with the new features and updated processes.</p>
      <p className="mt-2">If you encounter any issues, please inform the developer at IP phone: <b>4084</b>.</p>
      <p className="mt-2">Thank you for your continued use and support of JOMS.</p>

    </PageComponent>
  )

}