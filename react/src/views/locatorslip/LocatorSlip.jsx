import { useEffect, useState } from "react";
import PageComponent from "../../components/PageComponent";
import moment from "moment-timezone";
import { useUserStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios";

export default function LocatorSlipForm(){
  const { currentUserId, currentUserName } = useUserStateContext();

  const [confirmation, setConfirmation] = useState(false);
  const today = moment().tz('Asia/Manila').format('YYYY-MM-DD');

  const [selectedLocatorType, setSelectedLocatorType] = useState('');
  const [onlyme, setOnlyme] = useState(true);

  const [requestors, setRequestors] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredRequestors, setFilteredRequestors] = useState([]);
  const [selected, setSelected] = useState(null);
  
  const [selectedService, setSelectedService] = useState('');
  const [timeReq, setTimeReq] = useState('');
  const [reqPlace, setReqPlace] = useState('');
  const [reqPurpose, setReqPurpose] = useState('');
  const [timeReturnReq, setTimeReturnReq] = useState('');

  // Fetch all requestors
  useEffect(() => {
    axiosClient
      .get(`/getlocreq/${currentUserId}`)
      .then((response) => {
        setRequestors(response.data);
      })
      .catch((err) => console.error(err));
  }, [currentUserId]);

  // Filter requestors as user types
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredRequestors([]);
    } else {
      const filtered = requestors.filter((r) => {
        const fullName = `${r.firstname} ${r.middlename}. ${r.lastname}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
      });
      setFilteredRequestors(filtered);
    }
  }, [search, requestors]);

  // Handle selection of a requestor
  const handleSelect = (r) => {
    setSelected(r);
    setSearch(`${r.firstname} ${r.middlename} ${r.lastname}`);
    setFilteredRequestors([]);
  };
  
  function handleConfirm(){
    const Data ={
      type: selectedLocatorType,
      req_id: currentUserId,
      req_name: currentUserName.name,
      req_use_id: onlyme ? currentUserId : selected.id,
      req__use_name: onlyme ? currentUserName.name : `${selected.firstname} ${selected.middlename}. ${selected.lastname}`,
      time: timeReq,
      place: reqPlace,
      purpose: reqPurpose,
      return: timeReturnReq
    }

    console.log(Data);
  }

  return(
    <PageComponent title="Request Form">
      {/* Form Content */}
      <div className="ppa-widget mt-8">
        <div className="joms-user-info-header text-left"> 
          Request for Locator Slip
        </div>

        <div className="pb-2 px-4">
          {confirmation ? (
            "True"
          ):(
          <div className="form-container">

            {/* Title */}
            <div>
              <h2 className="text-base font-bold leading-7 text-gray-900"> Fill up the Form </h2>
              <p className="text-xs font-bold text-red-500">* - fields that need to be filled out</p>
              <p className="mt-2 text-xs font-bold text-black-500"> <span className="text-red-500">Note:</span> If you need a service, please request a vehicle slip or select an existing slip.</p>
            </div>

            {/* Form */}
            <div className="md:grid md:grid-cols-2">
              <div className="col-span-1 pr-4">
                {/* Type of Locator */}
                <div className="items-center mt-2 md:mt-4 font-roboto">
                  <div className="font-roboto w-full pb-2">
                    <label htmlFor="ls_type" className="form-title flex">
                      Need Service Vehicle?
                    </label>
                  </div>
                  <div className="w-full flex items-center space-x-10 md:space-x-20">

                    {/* Yes */}
                    <div className="flex items-center">
                      <input
                        id="service-checkbox"
                        type="checkbox"
                        checked={selectedService === "Yes"}
                        onChange={() => setSelectedService("Yes")}
                        className="h-6 w-6 text-indigo-900 border-black-500 rounded focus:ring-gray-400"
                      />
                      <label
                        htmlFor="official-checkbox"
                        className="ml-2 text-base leading-6 text-black"
                      >
                        Yes
                      </label>
                    </div>

                    {/* No */}
                    <div className="flex items-center">
                      <input
                        id="personal-checkbox"
                        type="checkbox"
                        checked={selectedService === "No"}
                        onChange={() => setSelectedService("No")}
                        className="h-6 w-6 text-indigo-900 border-black-500 rounded focus:ring-gray-400"
                      />
                      <label
                        htmlFor="personal-checkbox"
                        className="ml-2 text-base leading-6 text-black"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="mt-10 pb-4 mobile-btn flex justify-center md:justify-start">
              <button 
                onClick={handleConfirm} 
                className="w-full md:w-auto py-2 px-4 text-sm btn-default-form">
                Submit
              </button>
            </div>

          </div>
          )}
        </div>
      </div>
    </PageComponent>
  );
}