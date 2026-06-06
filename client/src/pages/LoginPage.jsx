import { useState } from "react"
import api from "../api/axios.js"
import {useAuth} from "../context/AuthContext.jsx"
import { Link } from "react-router-dom";


function LoginPage(){
    const {login,user} = useAuth();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const[error,setError]=useState("");
    const[loading,setLoading]=useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setError("")
        setLoading(true)
        try {
            const res = await api.post("/api/auth/login",{email,password})
            if(res){
                login(res.data.token,res.data.user)

            }
        } catch (err) {
            setError(err.response?.data?.message || "Login Failed")

        } finally {
            setLoading(false)
        }
    }

    return (<>
     <div className="bg-black text-white h-screen flex justify-center items-center">
      <h1 className="text-5xl font-bold">
      {/* GatherSphere login Page */}
      </h1>
      <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}placeholder="enter email"></input>
                <input type="password" value={password}  onChange={(e)=>setPassword(e.target.value)}placeholder="enter pwd"></input>
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" disabled={loading}></button> <br />
                {loading?<p className="text-blue-700">logging in!!</p>: <p className="text-blue-700">submit</p>}
                {user && <p>hi - {user.name}</p>}
                <Link to="/register">Dont have an account?</Link>

            </form>
    </div>
    
            
    </>

    )
}

export default LoginPage

