import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import StatusBadge from "../components/StatusBadge.jsx";
import EventFormFields, {
  buildEventPayload,
  handleEventFormChange,
  initialEventFormData,
} from "../components/EventFormFields.jsx";

function EditEvent() {
  const navigate = useNavigate();
  const { event_ID } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialEventFormData);

  useEffect(() => {
    setLoading(true);
    setEvent(null);
    setError("");
    (async () => {
      try {
        const res = await api.get(`/api/events/my/event/${event_ID}`);
        const found = res.data.event;

        if (found) {
          setEvent(found);
          setFormData({
            title: found.title,
            description: found.description,
            category: found.category,
            date: found.date?.slice(0, 10),
            startTime: found.startTime,
            endTime: found.endTime,
            eventType: found.eventType,
            capacity: found.capacity,
            registrationMode: found.registrationMode || "auto",
            venue: found.venue || { name: "", address: "", mapLink: "" },
            online: found.online || { platform: "", meetingLink: "" },
          });
        } else {
          setError("Event not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Cannot load event");
      } finally {
        setLoading(false);
      }
    })();
  }, [event_ID]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.put(
        `/api/events/${event_ID}`,
        buildEventPayload(formData),
      );
      if (res) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save changes");
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e) {
    handleEventFormChange(formData, setFormData, e);
  }

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-neutral-50 py-12 md:py-16">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          to="/dashboard"
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          ← Dashboard
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-neutral-900">Edit event</h1>
          {event?.status && <StatusBadge status={event.status} />}
        </div>

        {loading && (
          <p className="mt-8 text-sm text-neutral-500">Loading event…</p>
        )}

        {error && !event && !loading && (
          <p
            className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        {!loading && event && (
          <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 md:p-8">
            <EventFormFields
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              submitting={submitting}
              error={error}
              submitLabel="Save changes"
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default EditEvent;
