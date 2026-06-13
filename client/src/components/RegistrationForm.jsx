import { useState } from "react"
import api from "../api/axios.js"
import { useNavigate } from "react-router-dom";



function RegistrationForm({eventId}){
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [status,setStatus] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        organization: "",
    });

    async function  handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true)
        try{
            const payload = {...formData};
            const res =  await api.post(`/api/registrations/events/${eventId}/register`,payload)
            if(res){
                // navigate("/eventlisting")
                setStatus(res.data.status)
            }
        }
        catch(error){
            setError(error.response?.data?.message || "unable to register for the event at moment")
        }
        finally{
            setLoading(false)
        }
        
    }
function handleChange(e){
    const name  = e.target.name;
    const value = e.target.value;
    setFormData({
        ...formData,
        [name]:value
    })
}



return <>
    <form onSubmit={handleSubmit}>

    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="name" />
    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email" />
    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="phone" />
    <input type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="organization" />
    <button type="submit" disabled={loading}>submit</button> <br />
    {status && <p className="text-green-600">{status}</p>}
    {error && <p className="text-red-500">{error}</p>}
    </form>
    </>
}

export {RegistrationForm}