import { useEffect } from "react";
import { useState } from "react"
import api from "../api/axios.js"
import { useNavigate } from "react-router-dom";


function DashBoard() {
    const [stats, setStats] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    let navigate = useNavigate();

    async function fetchData() {
        setLoading(true);
        setEvents([]);
        setStats(null)
        setError("");
        (async  ()=> {
            try {
                const statsRes = await api.get(`/api/dashboard/stats`);
                const eventsRes = await api.get(`/api/events/my/events`)
                setEvents(eventsRes.data.eventdetails)
                setStats(statsRes.data)
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

    function editRedirect(id){
      
        navigate(`/events/edit/${id}`)
    
    }
    async function statuschange(id){
        await api.patch(`/api/events/${id}/status`, {
            "status": "published"
        }); 
        await fetchData();
    }
    async function deleteEvent(id){
        await api.delete(`/api/events/${id}`)
        await fetchData();
    }
    function manageRegistrations(id){
        navigate(`/events/${id}/registrations`)
    }

    async function closeRegistrations(eventId){
        try {
            await api.patch(`/api/events/${eventId}/status`, { status: "registration_closed" });
            await fetchData();
        } catch (error) {
            setError(error.response?.data?.message || "Failed to close registration");
        }

    }
    return <>
        dashboard page
        {loading ? <p className="text-blue-700">getting the data</p>
            : error ? <p className="text-red-700" >{error}</p>
                : <div>
                    eventshosted = {stats.eventsHosted} <br></br>
                    upcomingEvents = {stats.upcomingEvents}<br></br>
                    totalRegistrations={stats.totalRegistrations}
                    <hr /><hr />
                    {
                        events.length===0? <p className="text-green-700">No events Found</p>
                        :<ul className="list-disc list-inside space-y-2 text-grey">
                        {events.map((event) => (
                            <li key={event._id}> {event.title}  ---------  
                            <button onClick={()=>editRedirect(event._id)}>
                                edit the event
                                </button>------ 
                                {event.status} 
                                {event.status==="draft"&&<>------<button onClick={()=>statuschange(event._id)}>status change</button></>}-------
                                <><button onClick={()=>deleteEvent(event._id)}>delete</button>------
                                <button onClick={()=>manageRegistrations(event._id)}>manage registrations</button>----
                                {event.status!=="registration_closed" && <button onClick={()=>closeRegistrations(event._id)}>close registrations</button>}</>
                                </li> 
                        ))}
                        </ul>
                    }
                </div>

        }

    </>


}

export default DashBoard