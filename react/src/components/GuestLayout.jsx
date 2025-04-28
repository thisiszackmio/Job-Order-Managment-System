import { Navigate, Outlet } from "react-router-dom";
import { useUserStateContext } from "../context/ContextProvider";

export default function GuestLayout(){

    const { currentUserToken } = useUserStateContext();

    // if(currentUserToken){
    //     return <Navigate to='/' />
    // }

    return(
        <div>
            <Outlet />
        </div>
    )

}