import PageComponent from "../../components/PageComponent";
import { Link } from "react-router-dom";

export default function AssestClassificationAMS(){
  return(
    <PageComponent title="Asset Classification">
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
            <Link to={`/ams/add-asset-classification`}>Add Classification</Link>
          </button>

        </div>

         {/* Table */}
         <table className="ppa-table w-full mb-10 mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Category Name</th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Category Code</th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Life Span</th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Action</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: '#fff' }}>
            <tr>
              <td className="px-1 py-2 text-center table-font"> FURNITURES & FIXTURES - RECLASSIFIED TO SEMI EXPENDABLE PROPERTY </td>
              <td className="px-1 py-2 text-center table-font"> FF </td>
              <td className="px-1 py-2 text-center table-font"> 2 </td>
              <td className="px-1 py-2 text-center table-font">
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