import PageComponent from "../../components/PageComponent";
import { Link } from "react-router-dom";

export default function AddAccountableOfficerAMS(){
  return(
    <PageComponent title="Add Accountable Officer">
      <div className="font-roboto content-here">
        
        <form action="">

          {/* Officer Name */}
          <div className="flex items-center mt-6">
            <div className="w-60">
              <label htmlFor="rep_type_of_property" className="block text-base font-medium leading-6 text-black">
                Officer Name:
              </label> 
            </div>
            <div className="w-1/2">
              <select 
              name="officer-name" 
              id="officer-name" 
              // value={typeOfProperty}
              // onChange={ev => {
              //   setTypeOfProperty(ev.target.value);
              // }}
              className="block w-full ppa-form"
              >
                <option value="" disabled>Select an Officer</option>
                <option value="1">Zack-Mio A. Sermon</option>
              </select>
            </div>
          </div>

          {/* Create a condition if the user choose the officer */}

          {/* Position */}
          <div className="flex items-center mt-6 ">
            <div className="w-60">
              <label htmlFor="rep_date" className="block text-base leading-6 text-black"> 
                Position: 
              </label> 
            </div>
            <div className="w-1/2">
              <input 
                type="text" 
                name="officer-position" 
                id="officer-position" 
                defaultValue="Nerd"
                // onChange={ev => setInspectionDate(ev.target.value)}
                className="block w-full ppa-form"
                readOnly
              />
            </div>
          </div>

          {/* PAR Number */}
          <div className="flex items-center mt-6 ">
            <div className="w-60">
              <label htmlFor="rep_date" className="block text-base leading-6 text-black"> 
                PAR Number: 
              </label> 
            </div>
            <div className="w-1/2">
              <input 
                type="text" 
                name="par-number" 
                id="par-number" 
                //value={typeOfProperty}
                // onChange={ev => setInspectionDate(ev.target.value)}
                className="block w-full ppa-form"
              />
            </div>
          </div>

          {/* Button */}
          <div className="mt-10">
            {/* Edit Button */}
            <button className="btn-default mr-2">
              Submit
            </button>

            {/* Cancel Button */}
            <button className="btn-cancel">
              <Link to={`/ams/accountable-officer`}> Cancel </Link>
            </button>
          </div>

        </form>

      </div>
    </PageComponent>
  );
}