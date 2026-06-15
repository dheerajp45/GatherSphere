import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js"
import { RegistrationForm } from "../components/RegistrationForm.jsx";
import { SeatsCounter } from "../components/SeatsCounter.jsx";
function EventDetailPage() {
    const [event, setEvent] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [seats,setSeats] = useState("");
    let {slug} = useParams();



    useEffect(() => { 
        setLoading(true);
        setEvent(null);
        setError("");
        (async () => {

           
            try {
                const res = await api.get(`/api/events/${slug}`);
                if(res){
                     setEvent(res.data.req_slug_event);
                     setSeats(res.data.seatsLeft)
                    }
            } catch (error) {
                setError(error.response?.data?.message || "Cannot get event")
            } finally {
                setLoading(false)

            }

        })()
    }, [slug])

    return <div className="bg-black text-white h-screen flex justify-center items-center">
        <h1 className="text-5xl font-bold">GatherSphere dedicated event  page</h1>
        {
            loading ? <p className="text-blue-700">Fetching data</p>
                : error ? <p className="text-red-700">{error}</p>
                    : !event ? <p className="text-green-700">No events found</p>
                        :(<><h3>{event.title}</h3>  <br /> <p>{event.description}</p>
                       <SeatsCounter capacity={event.capacity} seatsLeft={seats}/>
                       {event.status ==="registration_closed" && <p className="text-red-700">event registraitons closed</p>}
                       {event.status === "published" && <RegistrationForm eventId={event._id} />}

                        </>
                        )
      }

    </div>
}

export default EventDetailPage