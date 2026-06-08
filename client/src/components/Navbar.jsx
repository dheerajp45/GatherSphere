import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Navbar({children}){
    const {user , token , logout} = useAuth();
    let navigate = useNavigate();
function handleLogOut(){
    logout();
    navigate("/")
}

    return<>
    <h1><Link to={"/dashboard"}>GatherSphere</Link></h1>
    {token? <>
        <button onClick={handleLogOut}>logout</button>
        <Link to={"/eventlisting"}>event listings</Link>

    </>

    : <Link to={"/"}>register/login</Link>}
    {children}

    </>
}
export default Navbar