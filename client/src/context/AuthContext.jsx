import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

function AuthProvider({ children }) {
    const [user, setUser] = useState(()=>{
        const saved  = localStorage.getItem("user");
        return saved ? JSON.parse(saved):null;
    })
    const [token, setToken] = useState(() => localStorage.getItem("token"))



    function login(token, user) {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))

        setToken(token);
        setUser(user);
    }


    useEffect(()=>{
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user")
        if(savedToken&&savedUser){
            setToken(savedToken);
            setUser(JSON.parse(savedUser))
        }
    },[])
    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null)
        setUser(null)

    }

    const value = { user, token, login, logout }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
function useAuth(){
    const context = useContext(AuthContext)
    if(!context){
        throw new Error("useAuth must be used in auth provider")
    }
    return context
}
export {AuthProvider,useAuth}

