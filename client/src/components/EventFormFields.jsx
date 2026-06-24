import { authInputClass, authLabelClass } from "./AuthPageShell.jsx";

const selectClass = `${authInputClass} bg-white`;
const sectionTitle = "text-sm font-semibold uppercase tracking-wide text-slate-500";

const CATEGORIES = [
  "Tech",
  "Business",
  "Education",
  "Arts",
  "Sports",
  "Other",
];

function EventFormFields({
  formData,
  onChange,
  onSubmit,
  submitting,
  error,
  submitLabel,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <section className="space-y-4">
        <h2 className={sectionTitle}>Basic info</h2>
        <div>
          <label htmlFor="title" className={authLabelClass}>
            Event title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="React Summit 2026"
            className={authInputClass}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className={authLabelClass}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Tell people what this event is about (min 50 characters)"
            rows={5}
            className={authInputClass}
            required
            minLength={50}
          />
        </div>
        <div>
          <label htmlFor="category" className={authLabelClass}>
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={onChange}
            className={selectClass}
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>Schedule</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="date" className={authLabelClass}>
              Date
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={onChange}
              className={authInputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="startTime" className={authLabelClass}>
              Start time
            </label>
            <input
              id="startTime"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={onChange}
              className={authInputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="endTime" className={authLabelClass}>
              End time
            </label>
            <input
              id="endTime"
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={onChange}
              className={authInputClass}
              required
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>Event type</h2>
        <div>
          <label htmlFor="eventType" className={authLabelClass}>
            Online or in person
          </label>
          <select
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={onChange}
            className={selectClass}
            required
          >
            <option value="offline">In person (offline)</option>
            <option value="online">Online</option>
          </select>
        </div>

        {formData.eventType === "offline" && (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <label htmlFor="venue-name" className={authLabelClass}>
                Venue name
              </label>
              <input
                id="venue-name"
                type="text"
                name="venue.name"
                value={formData.venue.name}
                onChange={onChange}
                placeholder="Convention center"
                className={authInputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="venue-address" className={authLabelClass}>
                Address
              </label>
              <input
                id="venue-address"
                type="text"
                name="venue.address"
                value={formData.venue.address}
                onChange={onChange}
                placeholder="Street, city"
                className={authInputClass}
              />
            </div>
            <div>
              <label htmlFor="venue-map" className={authLabelClass}>
                Map link
              </label>
              <input
                id="venue-map"
                type="url"
                name="venue.mapLink"
                value={formData.venue.mapLink}
                onChange={onChange}
                placeholder="Google Maps URL"
                className={authInputClass}
              />
            </div>
          </div>
        )}

        {formData.eventType === "online" && (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <label htmlFor="online-platform" className={authLabelClass}>
                Platform
              </label>
              <input
                id="online-platform"
                type="text"
                name="online.platform"
                value={formData.online.platform}
                onChange={onChange}
                placeholder="Zoom, Google Meet, etc."
                className={authInputClass}
              />
            </div>
            <div>
              <label htmlFor="online-link" className={authLabelClass}>
                Meeting link
              </label>
              <input
                id="online-link"
                type="url"
                name="online.meetingLink"
                value={formData.online.meetingLink}
                onChange={onChange}
                placeholder="https://…"
                className={authInputClass}
                required
              />
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className={sectionTitle}>Registration</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="capacity" className={authLabelClass}>
              Capacity
            </label>
            <input
              id="capacity"
              type="number"
              name="capacity"
              min="1"
              value={formData.capacity}
              onChange={onChange}
              placeholder="100"
              className={authInputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="registrationMode" className={authLabelClass}>
              Approval mode
            </label>
            <select
              id="registrationMode"
              name="registrationMode"
              value={formData.registrationMode}
              onChange={onChange}
              className={selectClass}
            >
              <option value="auto">Auto approval</option>
              <option value="manual">Manual approval</option>
            </select>
          </div>
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting && <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}{submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

export const initialEventFormData = {
  title: "",
  description: "",
  category: "Tech",
  date: "",
  startTime: "",
  endTime: "",
  eventType: "offline",
  capacity: "",
  registrationMode: "auto",
  venue: { name: "", address: "", mapLink: "" },
  online: { platform: "", meetingLink: "" },
};

export function buildEventPayload(formData) {
  const payload = { ...formData };
  if (payload.eventType === "online") {
    delete payload.venue;
  } else {
    delete payload.online;
  }
  return payload;
}

export function handleEventFormChange(formData, setFormData, e) {
  const { name, value } = e.target;

  if (name.startsWith("venue.")) {
    const key = name.split(".")[1];
    setFormData({
      ...formData,
      venue: { ...formData.venue, [key]: value },
    });
    return;
  }

  if (name.startsWith("online.")) {
    const key = name.split(".")[1];
    setFormData({
      ...formData,
      online: { ...formData.online, [key]: value },
    });
    return;
  }

  setFormData({ ...formData, [name]: value });
}

export default EventFormFields;
