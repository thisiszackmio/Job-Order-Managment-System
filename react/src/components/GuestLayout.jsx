import { Navigate, Outlet } from "react-router-dom";
import { useUserStateContext } from "../context/ContextProvider";

export default function GuestLayout(){

    const { userToken } = useUserStateContext();

    if(userToken){
        return <Navigate to='/' />
    }

    return(
        <div>
            <Outlet />
        </div>
    )

}