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
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
        </div>
        <p className="text-sm font-medium text-slate-900">
          Registration submitted
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-600">Status:</span>
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
          <span className="font-normal text-slate-400">(optional)</span>
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
        className="inline-flex items-center justify-center w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}{loading ? "Submitting…" : "Register"}
      </button>
    </form>
  );
}

export { RegistrationForm };
