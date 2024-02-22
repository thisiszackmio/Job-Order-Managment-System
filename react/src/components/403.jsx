import React from "react";
import { Link } from "react-router-dom";

export default function Forbidden(){
    return(
        <>
        <div class="Forbidden-content">
          <div class="noentry">
            <p className="entry-p">403</p>
            <p className="sign-txt">Forbidden</p>
          </div>
          <div class="forbidden-message">
            <h1>What are you doing?</h1>
            <p>You are not allowed to go there!</p>
          </div>
          <div>
            <Link to={'/'}>
              <button 
                className="bg-blue-700 text-lg hover-bg-green-700 text-white font-bold py-3 px-6 rounded"
                title="View Request"
              >
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
        </>
    )
}