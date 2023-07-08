import { Navigate, Outlet, Route } from "react-router-dom"


const ProtectedRoute = (props:any) => {
    if(localStorage.getItem("token")){
        return <Outlet />
    } else {
       return  <Navigate to={'/login'} />
    }
} 

export default ProtectedRoute