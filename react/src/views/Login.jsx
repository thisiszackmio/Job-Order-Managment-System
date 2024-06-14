import axiosClient from "../axios";
import { useState } from "react"
import { useUserStateContext  } from "../context/ContextProvider";
import loadingAnimation from '../assets/loading.gif';

export default function Login() {

  return (
    <>
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row ppa-cover font-roboto" style={{ backgroundImage: "url('ppa_bg.png')" }}>
      <div className="lg:w-3/4 order-2 lg:order-1"></div>
      <div className="lg:w-1/4 order-1 lg:order-2 bg-white px-6 py-12 lg:px-8 ppa-col">
        
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-80 w-auto"
              src="ppa_logo.png"
              alt="Your Company"
            />     
            <div className="login-title mb-10">
              <div>Joint Local</div>
              <div>Management System</div>
            </div>

            {/* {error.__html && (
              <div className="mt-10 bg-red-500 rounded py-2 px-3 text-white"
              dangerouslySetInnerHTML={error} >
              </div>
            )} */}

          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* {isLoading ? (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white bg-opacity-100 z-50">
            <img
              className="mx-auto h-44 w-auto"
              src="ppa_logo_animationn_v4.gif"
              alt="Your Company"
            />
            <span className="ml-2 animate-heartbeat">Redirecting...</span>
          </div>
          ):()} */}
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="username" className="block form-label">
                Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    // value={username}
                    // onChange={(ev) => setUsername(ev.target.value)}
                    className="block w-full ppa-form"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block form-label">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    // value={password}
                    // onChange={(ev) => setPassword(ev.target.value)}
                    className="block w-full ppa-form"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="login-btn"
                >
                  Log in
                </button>
              </div>
            </form>
          
          </div>

      </div>
    </div>
    </>
  )
}
  