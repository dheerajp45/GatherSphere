import { useState,useEffect } from "react";
import api from "../api/axios";
import { useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge.jsx"



function ManageRegistrationsPage(){
   const  [registrations , setRegistrations ] = useState([]);
    const [loading,setLoading] = useState(true)
    const [error,setError]=useState("");
    const { eventId } = useParams();
    async function fetchData() {
        setLoading(true);
        setRegistrations([]);
        setError("");
        (async  ()=> {
            try {
                const registrationsResult = await api.get(`/api/registrations/events/${eventId}`);
                setRegistrations(registrationsResult.data.registration)
            } catch (error) {
                setError(error.response?.data?.message || "Cannot get data")
            }
            finally {
                setLoading(false)

            }
        })();
    }
    useEffect(() => {
        fetchData();
    }, [])

    return<>
    Registation page

{
    loading?
    <p className="text-blue-700">getting the data</p>
            : error ? <p className="text-red-700" >{error}</p>
            :<div>
                {
                    registrations.length===0? <p className="text-green-700">No events Found</p>
                    :<ul className="list-disc list-inside space-y-2 text-grey">
                     {   registrations.map((r)=>(
                            <li key={r._id}>
                                {r.name}----{r.email}---{r.phone}--<StatusBadge status={r.status} /> 
                                </li>
                        ))}
                    </ul>
                }
            </div>
}

    </>
}

export default ManageRegistrationsPage