import { useEffect } from "react";
import { useState } from "react"
import api from "../api/axios.js"


function DashBoard() {
    const [stats, setStats] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        setLoading(true);
        setEvents([]);
        setStats(null)
        setError("");
        (async () => {
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
    }, [])
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
                            <li key={event._id}> {event.title}</li>
                        ))}</ul>
                    }
                </div>

        }

    </>


}

export default DashBoard