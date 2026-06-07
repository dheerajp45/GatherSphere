import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Navbar({children}){
    const {user , token , logout} = useAuth();
    let navigate = useNavigate();
function handleLogOut(){
    logout();
    navigate("/login");
}

    return<>
    {children}
    <h1>GatherSphere</h1>
    <button onClick={handleLogOut}>logout</button>

    {!token && !user &&     navigate("/login")}
    </>
}
export default Navbar