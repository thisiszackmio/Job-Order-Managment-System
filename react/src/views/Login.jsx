import axiosClient from "../axios";
import { useState } from "react"
import { useUserStateContext  } from "../context/ContextProvider";
import loadingAnimation from '../assets/loading.gif';

export default function Login() {

  return (
    <>
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row ppa-cover font-roboto" style={{ backgroundImage: "url('ppa_bg.png')" }}>
      <div className="lg:w-3/4 order-2 lg:order-1"></div>
      <div className="lg:w-1/4 order-1 lg:order-2 bg-white px-6 py-10 lg:px-8 ppa-col">
        
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="login-logo"
              src="ppa_logo.png"
              alt="Your Company"
            />     
            <div className="mb-10 login-title">
              <div>Joint Local</div>
              <div>Management System</div>
            </div>

          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">

              {/* Username */}
              <div>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    placeholder="Username"
                    // value={username}
                    // onChange={(ev) => setUsername(ev.target.value)}
                    className="block w-full ppa-form"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between">
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
                    placeholder="Password"
                    // value={password}
                    // onChange={(ev) => setPassword(ev.target.value)}
                    className="block w-full ppa-form"
                  />
                </div>
              </div>

              <div>
                <button type="submit" className="w-full login-btn" >
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
  