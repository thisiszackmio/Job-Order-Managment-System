import { Outlet } from "react-router-dom";

export default function GuestLayout(){

    return(
        <div>
            This is layout
            <Outlet />
        </div>
    )

}