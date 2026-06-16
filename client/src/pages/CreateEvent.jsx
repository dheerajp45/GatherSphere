import { useState } from "react"
import api from "../api/axios.js"
import { useNavigate } from "react-router-dom";


function CreateEvent() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Tech",
        date: "",
        startTime: "",
        endTime: "",
        eventType: "offline",
        capacity: "",
        bannerImage: "",
        registrationMode: "auto",
        venue: { name: "", address: "", mapLink: "" },
        online: { platform: "", meetingLink: "" },
    });
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true)
        try {
            const payload = {...formData};
            if(!payload.bannerImage){
                delete payload.bannerImage;
            }

            if(payload.eventType ==="online"){
                delete payload.venue;
            }
            else{
                delete payload.online
            }
            const res = await api.post("/api/events", payload)
            if (res) {
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message || "unable to create event")
        } finally {
            setLoading(false)
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;

        if (name.startsWith("venue.")) {
            const key = name.split(".")[1];
            setFormData({
                ...formData,
                venue: {
                    ...formData.venue,
                    [key]: value
                }
            })
            return;
        }

        if (name.startsWith("online.")) {
            const key = name.split(".")[1];
            setFormData({
                ...formData,
                online: {
                    ...formData.online,
                    [key]: value
                }
            })
            return;
        }

        setFormData({
            ...formData,
            [name]: value
        })
    }
    return <>

        <form onSubmit={handleSubmit}>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="name" />
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description (min 50 characters)"
                rows={4}
            />

            <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Tech">Tech</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Arts">Arts</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
            </select>


            <input type="date" name="date" value={formData.date} onChange={handleChange} />
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />


            <select name="eventType" value={formData.eventType} onChange={handleChange}>
                <option value="offline">Offline</option>
                <option value="online">Online</option>
            </select>

            <input
                type="url"
                name="bannerImage"
                value={formData.bannerImage}
                onChange={handleChange}
                placeholder="Banner image URL (optional)"
            />
            <input
                type="number"
                name="capacity"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Capacity"
            />
            <select
  name="registrationMode"
  value={formData.registrationMode}
  onChange={handleChange}
>
  <option value="auto">Auto approval</option>
  <option value="manual">Manual approval</option>
</select>


            {formData.eventType === "offline" && (
                <>
                    <input
                        type="text"
                        name="venue.name"
                        value={formData.venue.name}
                        onChange={handleChange}
                        placeholder="Venue name *"
                    />
                    <input
                        type="text"
                        name="venue.address"
                        value={formData.venue.address}
                        onChange={handleChange}
                        placeholder="Venue address"
                    />
                    <input
                        type="url"
                        name="venue.mapLink"
                        value={formData.venue.mapLink}
                        onChange={handleChange}
                        placeholder="Google Maps link"
                    />
                </>
            )}


            {formData.eventType === "online" && (
                <>
                    <input
                        type="text"
                        name="online.platform"
                        value={formData.online.platform}
                        onChange={handleChange}
                        placeholder="Platform (Zoom, Meet, etc.)"
                    />
                    <input
                        type="url"
                        name="online.meetingLink"
                        value={formData.online.meetingLink}
                        onChange={handleChange}
                        placeholder="Meeting link *"
                    />
                </>
            )}
            <button type="submit" disabled={loading}>submit</button> <br />
            {error && <p className="text-red-500">{error}</p>}
        </form>
    </>
}


export default CreateEvent