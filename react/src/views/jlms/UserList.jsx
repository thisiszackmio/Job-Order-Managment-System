import React, { useEffect, useState } from "react";
import defaultImage from '/default/default-avatar.jpg'
import defaultEsig from '/default/default-esig.png'
import PageComponent from "../../components/PageComponent";

export default function UserListJLMS(){
  return(
    <PageComponent title="Employee List">
      {/* Main Content */}
      <div className="font-roboto">

        {/* Search Filter */}
        <div className="mt-5 mb-4 flex">

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

        {/* Count */}
        <div className="ml-4" style={{ position: "relative", bottom: "-18px" }}>
          <div className="text-right text-sm/[17px]">
          Total of 10 user's list
          </div>
        </div>

        </div>

        {/* Table */}
        <table className="ppa-table w-full mb-10 mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-3 text-center text-sm w-1 font-medium text-gray-600 uppercase">User ID</th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Avatar</th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Name</th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Division</th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Position</th>  
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">E-sig</th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Username</th>  
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Code CLR</th>
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: '#fff' }}>
            <tr>
              <td className="px-3 py-2 text-center table-font">1</td>
              <td className="px-3 py-2 text-center table-font w-24"><img src={defaultImage} className="ppa-avatar" alt="" /></td>
              <td className="px-3 py-2 text-center table-font">Zack-Mio A. Sermon (Link)</td>
              <td className="px-3 py-2 text-center table-font">Administrative Division</td>
              <td className="px-3 py-2 text-center table-font">Information System Analyst ll</td>
              <td className="px-3 py-2 text-center table-font w-40">Naa</td>
              <td className="px-3 py-2 text-center table-font">zackmio2024</td>
              <td className="px-3 py-2 text-center table-font">HACK, MEM</td>
              <td className="px-3 py-2 text-center table-font">Active</td>
            </tr>
          </tbody>
        </table>

      </div>

    </PageComponent>
  )
}