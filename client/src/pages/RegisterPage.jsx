import { useState } from "react"
import api from "../api/axios.js"
import { useAuth } from "../context/AuthContext.jsx"
import { Link } from "react-router-dom";


function RegisterPage() {
    const { login, user } = useAuth();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [profilePicture, setProfilePicture] = useState("")
    const[error,setError]=useState("");
    const[loading,setLoading]=useState(false);


async function handleSubmit(e){
    e.preventDefault();
    setError("");
    setLoading(true)
    try {
        const res = await api.post("/api/auth/register",{name,email,password,profilePicture})
        if(res){
            login(res.data.token,res.data.user)


        }
    } catch (error) {
        setError(error.response?.data?.message || "register failed")


    }finally{
        setLoading(false)
    }
}

    return <>
     <div className="bg-black text-white h-screen flex justify-center items-center">
      <h1 className="text-5xl font-bold">
      GatherSphere Register Page
      </h1>
      <form onSubmit={handleSubmit} >
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}placeholder="name" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}placeholder="email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}placeholder="pwd" />
            <input type="url" value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)}placeholder="dp url" />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" disabled={loading}>submit</button> <br />
            {loading?<p className="text-blue-700">register under process!!</p>: <p className="text-blue-700">submit</p>}
            {user && <p>hi - {user.name}</p>}
            <Link to="/login">Have an account</Link>


        </form>
    </div>
        </>
}

export default RegisterPage