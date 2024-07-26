import PageComponent from "../../components/PageComponent";
import { Link } from "react-router-dom";

export default function AccountableOfficerAMS(){
  return(
    <PageComponent title="Accountable Officer">
      <div className="font-roboto content-here">
        
        {/* Search and User List */}
        <div className="mt-10 mb-4 flex">

          {/* Search */}
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search Here"
              // value={searchTerm}
              // onChange={handleSearchChange}
              className="w-96 p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Add Accountable Officer Button */}
          <button className="btn-add">
            <Link to={`/ams/add-accountable-officer`}>Add Officer</Link>
          </button>

        </div>

         {/* Table */}
         <table className="ppa-table w-full mb-10 mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Accountable Name</th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Position</th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Assign PAR Number</th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Action</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: '#fff' }}>
            <tr>
              <td className="px-1 py-2 text-center w-64 table-font"> Zack-Mio A. Sermon </td>
              <td className="px-1 py-2 text-center w-64 table-font"> Nerd IT </td>
              <td className="px-1 py-2 text-center w-64 table-font"> 10101 </td>
              <td className="px-1 py-2 text-center w-64 table-font">
                <div className="flex justify-center">

                  {/* Edit Button */}
                  <button className="btn-default mr-2">
                    Edit
                  </button>

                  {/* Cancel Button */}
                  <button className="btn-cancel">
                    Delete
                  </button>

                </div>
              </td>
            </tr>
          </tbody>
         </table>

         {/* Count */}
         <div className="ml-4" style={{ position: "relative", bottom: "-18px" }}>
            <div className="text-right text-sm/[17px]">
            Total of 2 user's list
            </div>
          </div>

      </div>
    </PageComponent>
  );
}