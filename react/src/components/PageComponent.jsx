import React from "react";
import TopNav from "./TopNav";

export default function PageComponent({title, buttons = '', children}){
    return(
        <>
        <header className="bg-white shadow flex justify-between items-center">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-roboto">{title}</h1>
          </div>
          <TopNav />
        </header>
        <main>
          <div className="py-6 sm:px-6 lg:px-8">
             {children}
          </div>
        </main>  
        </>
    )
}