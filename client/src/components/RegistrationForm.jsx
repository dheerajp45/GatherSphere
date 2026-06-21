import { useState } from "react";
import api from "../api/axios.js";
import StatusBadge from "./StatusBadge.jsx";
import { authInputClass, authLabelClass } from "./AuthPageShell.jsx";

function RegistrationForm({ eventId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);
    try {
      const res = await api.post(
        `/api/registrations/events/${eventId}/register`,
        { ...formData },
      );
      if (res) {
        setStatus(res.data.status);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to register for this event right now",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  if (status) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="text-sm font-medium text-neutral-900">
          Registration submitted
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-sm text-neutral-600">Status:</span>
          <StatusBadge status={status} />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reg-name" className={authLabelClass}>
          Full name
        </label>
        <input
          id="reg-name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          className={authInputClass}
          required
        />
      </div>

      <div>
        <label htmlFor="reg-email" className={authLabelClass}>
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className={authInputClass}
          required
        />
      </div>

      <div>
        <label htmlFor="reg-phone" className={authLabelClass}>
          Phone
        </label>
        <input
          id="reg-phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone number"
          className={authInputClass}
          required
        />
      </div>

      <div>
        <label htmlFor="reg-org" className={authLabelClass}>
          Organization{" "}
          <span className="font-normal text-neutral-400">(optional)</span>
        </label>
        <input
          id="reg-org"
          type="text"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          placeholder="Company or college"
          className={authInputClass}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Register"}
      </button>
    </form>
  );
}

export { RegistrationForm };
