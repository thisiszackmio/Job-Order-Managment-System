import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const NotFound = () => {

  const [firstDigit, setFirstDigit] = useState(null);
  const [secondDigit, setSecondDigit] = useState(null);
  const [thirdDigit, setThirdDigit] = useState(null);

  const randomNum = () => Math.floor(Math.random() * 9) + 1;

  useEffect(() => {
    let i = 0;
    const time = 30;
    
    const loop3 = setInterval(() => {
      if (i > 40) {
        clearInterval(loop3);
        setThirdDigit(4);
      } else {
        setThirdDigit(randomNum());
        i++;
      }
    }, time);

    const loop2 = setInterval(() => {
      if (i > 80) {
        clearInterval(loop2);
        setSecondDigit(0);
      } else {
        setSecondDigit(randomNum());
        i++;
      }
    }, time);

    const loop1 = setInterval(() => {
      if (i > 100) {
        clearInterval(loop1);
        setFirstDigit(4);
      } else {
        setFirstDigit(randomNum());
        i++;
      }
    }, time);

    return () => {
      clearInterval(loop1);
      clearInterval(loop2);
      clearInterval(loop3);
    };
  }, []);

  return (
    <div className="error" style={{ backgroundImage: "url('ppa_bg.png')" }}>
      <div className="container-floud">
        <div className="col-xs-12 ground-color text-center">
          <div className="container-error-404">
            <div className="clip">
              <div className="shadow">
                <span className="digit thirdDigit">{thirdDigit}</span>
              </div>
            </div>
            <div className="clip">
              <div className="shadow">
                <span className="digit secondDigit">{secondDigit}</span>
              </div>
            </div>
            <div className="clip">
              <div className="shadow">
                <span className="digit firstDigit">{firstDigit}</span>
              </div>
            </div>
            <div className="msg">Uh-Oh<span className="triangle"></span></div>
          </div>
          <h2 className="error-h1">The page doesn't exist</h2>
          <p className="description">We can't seem to find the page you're looking for</p>
          <div className="btn-area">
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
      </div>
    </div>
  );
};

export default NotFound;