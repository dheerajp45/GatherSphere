import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import EventBanner from "../components/EventBanner.jsx";

const CARD_ACCENTS = [
  "bg-gradient-to-br from-indigo-600/80 to-violet-700/80",
  "bg-gradient-to-br from-violet-600/80 to-purple-700/80",
  "bg-gradient-to-br from-teal-600/80 to-cyan-700/80",
  "bg-gradient-to-br from-amber-600/80 to-orange-700/80",
  "bg-gradient-to-br from-rose-600/80 to-pink-700/80",
  "bg-gradient-to-br from-sky-600/80 to-blue-700/80",
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
    <main className="min-h-[calc(100vh-4.5rem)] bg-zinc-950 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
          Discover
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
          Browse events
        </h1>
        <p className="mt-2 text-zinc-400">
          {loading
            ? "Loading events…"
            : `${events.length} published event${events.length === 1 ? "" : "s"}`}
        </p>

        {loading && (
          <div className="mt-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500"></div>
          </div>
        )}

        {error && (
          <p className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
            <p className="font-display font-semibold text-zinc-200">No events yet</p>
            <p className="mt-2 text-sm text-zinc-500">
              Check back soon — new events are added by hosts on GatherSphere.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
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
                className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 glow-card"
              >
                <div className="overflow-hidden">
                  <EventBanner
                    fallbackClassName={CARD_ACCENTS[index % CARD_ACCENTS.length]}
                    className="h-40 w-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2 p-5">
                  <p className="text-sm text-zinc-500">
                    {formatEventDate(event.date)} · {event.startTime}–
                    {event.endTime}
                  </p>
                  <h2 className="font-display font-semibold text-white group-hover:text-violet-300 transition-colors">
                    {event.title}
                  </h2>
                  <p className="text-sm text-zinc-400">
                    {eventLocation(event)}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Capacity: {event.capacity}
                  </p>
                  <span className="inline-block rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
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
