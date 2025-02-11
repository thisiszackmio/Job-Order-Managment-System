import { Link } from "react-router-dom";

export default function Restrict(){
  return(
    <div className="res-container font-roboto">
      <div className="res-title">Access Denied</div>
      <div className="res-des">You are not allowed to access this page. If you need access, contact the developer for permission.</div>
      <div className="res-btnarea">
        <Link to={'/'}>
          <button className="btn-default res-btn" title="View Request">
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}