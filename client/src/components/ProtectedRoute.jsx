import {useAuth} from "../context/AuthContext.jsx"
import { Navigate } from "react-router-dom";
 function ProtectedRoute({children}){
    const {token} = useAuth();
    if(!token){
        return  <Navigate to="/login" replace />
    }
    return children
 }
 export default ProtectedRoute;