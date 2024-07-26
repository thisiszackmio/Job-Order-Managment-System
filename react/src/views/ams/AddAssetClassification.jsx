import PageComponent from "../../components/PageComponent";
import { Link } from "react-router-dom";

export default function AddAssestClassificationAMS(){
  return(
    <PageComponent title="Add Asset Classification">
      <div className="font-roboto content-here">
        
        <form action="">

          {/* Category Name */}
          <div className="flex items-center mt-6">
            <div className="w-60">
              <label htmlFor="rep_type_of_property" className="block text-base font-medium leading-6 text-black">
                Category Name:
              </label> 
            </div>
            <div className="w-1/2">
              <input 
                type="text" 
                name="officer-position" 
                id="officer-position" 
                // value={typeOfProperty}
                // onChange={ev => setInspectionDate(ev.target.value)}
                className="block w-full ppa-form"
              />
            </div>
          </div>

          {/* Category Code */}
          <div className="flex items-center mt-6 ">
            <div className="w-60">
              <label htmlFor="rep_date" className="block text-base leading-6 text-black"> 
                Category Code: 
              </label> 
            </div>
            <div className="w-1/2">
              <input 
                type="text" 
                name="officer-position" 
                id="officer-position" 
                // value={typeOfProperty}
                // onChange={ev => setInspectionDate(ev.target.value)}
                className="block w-full ppa-form"
              />
            </div>
          </div>

          {/* Asset Classification Lifespan */}
          <div className="flex items-center mt-6 ">
            <div className="w-60">
              <label htmlFor="rep_date" className="block text-base leading-6 text-black"> 
                Asset Classification Lifespan: 
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
              <Link to={`/ams/asset-classification`}> Cancel </Link>
            </button>
          </div>

        </form>

      </div>
    </PageComponent>
  );
}