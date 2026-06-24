import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import EventBanner from "../components/EventBanner.jsx";

const CARD_ACCENTS = [
  "bg-blue-600",
  "bg-violet-600",
  "bg-teal-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-indigo-600",
];

function formatEventDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function eventLocation(event) {
  if (event.eventType === "online") return "Online";
  return event.venue?.name || "Offline";
}

/**
 * DATA: GET /api/events → eventdetails[]
 */
function EventListingPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/events");
        setEvents(res.data.eventdetails ?? []);
      } catch (err) {
        setError(err.response?.data?.message || "Cannot load events");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-neutral-50 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
          Discover
        </p>
        <h1 className="mt-2 text-3xl font-bold text-neutral-900 md:text-4xl">
          Browse events
        </h1>
        <p className="mt-2 text-neutral-600">
          {loading
            ? "Loading events…"
            : `${events.length} published event${events.length === 1 ? "" : "s"}`}
        </p>

        {loading && (
          <p className="mt-12 text-center text-sm text-neutral-500">
            Loading events…
          </p>
        )}

        {error && (
          <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="mt-12 rounded-xl border border-neutral-200 bg-white p-10 text-center">
            <p className="font-medium text-neutral-900">No events yet</p>
            <p className="mt-2 text-sm text-neutral-600">
              Check back soon — new events are added by hosts on GatherSphere.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block text-sm font-medium text-neutral-900 underline hover:text-neutral-700"
            >
              Back to home
            </Link>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <Link
                key={event._id}
                to={`/event/${event.slug}`}
                className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
              >
                <EventBanner
                  fallbackClassName={CARD_ACCENTS[index % CARD_ACCENTS.length]}
                  className="h-40 w-full"
                />
                <div className="space-y-2 p-4">
                  <p className="text-sm text-neutral-500">
                    {formatEventDate(event.date)} · {event.startTime}–
                    {event.endTime}
                  </p>
                  <h2 className="font-semibold text-neutral-900">{event.title}</h2>
                  <p className="text-sm text-neutral-600">
                    {eventLocation(event)}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Capacity: {event.capacity}
                  </p>
                  <span className="inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                    {event.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default EventListingPage;
