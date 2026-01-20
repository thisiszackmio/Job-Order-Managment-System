import { Link } from "react-router-dom";

export default function Restrict(){
  return(
    <div className="font-roboto items-center justify-center flex flex-col" >
      <div className="container-fluid flex flex-col items-center text-center mt-20">
        {/* Image Section */}
        <img
          className="restric-img"
          src="/default/padlock.png"
          alt="Under Maintenance"
        />

        {/* Text Section */}
        <div className="w-full">
          <h1 className="restric-htag">Access Denied</h1>
          <p className="restric-ptag">
            You cannot access this page because it is restricted.
          </p>
          <Link to={'/joms'}>
            <button className="btn-default py-2 px-4 mt-4" title="View Request">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}