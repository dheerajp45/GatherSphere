import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import EventFormFields, {
  buildEventPayload,
  handleEventFormChange,
  initialEventFormData,
} from "../components/EventFormFields.jsx";

function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialEventFormData);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/events", buildEventPayload(formData));
      if (res) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create event");
    } finally {
      setLoading(false);
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

        <h1 className="mt-4 text-3xl font-bold text-neutral-900">Create event</h1>
        <p className="mt-2 text-neutral-600">
          Your event starts as a draft. Publish it from the dashboard when ready.
        </p>

        <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 md:p-8">
          <EventFormFields
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={loading}
            error={error}
            submitLabel="Create event"
          />
        </div>
      </div>
    </main>
  );
}

export default CreateEvent;
