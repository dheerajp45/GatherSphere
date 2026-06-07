import { useEffect } from "react";
import { useState } from "react"
import api from "../api/axios.js"
import { Link } from "react-router-dom";
function EventListingPage() {



    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/api/events");
                setEvents(res.data.eventdetails)

            } catch (error) {
                setError(error.response?.data?.message || "Cannot get events list")
            } finally {
                setLoading(false)

            }

        })()
    }, [])




    return <>
        <div className="bg-black text-white h-screen flex justify-center items-center">
            <h1 className="text-5xl font-bold">GatherSphere event list page</h1>

            {loading ? <p className="text-blue-700">Fetching data</p>
                : error ? <p className="text-red-700">{error}</p>
                    : events.length === 0 ? <p className="text-green-700">No events found</p>
                        : <ul className="list-disc list-inside space-y-2 text-white">
                            {events.map((event) => (
                                <li key={event._id}> <Link to={`/event/${event.slug}`}>{event.title}</Link></li>
                            ))}</ul>}

        </div>
    </>

}

export default EventListingPage