import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";
import { RegistrationForm } from "../components/RegistrationForm.jsx";
import { SeatsCounter } from "../components/SeatsCounter.jsx";
import EventBanner from "../components/EventBanner.jsx";

function formatEventDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-zinc-800/60 py-3.5 sm:flex-row sm:gap-4">
      <dt className="w-32 shrink-0 text-sm font-semibold text-zinc-500">
        {label}
      </dt>
      <dd className="text-sm text-zinc-200">{value}</dd>
    </div>
  );
}

/**
 * DATA: GET /api/events/:slug → event + seatsLeft
 */
function EventDetailPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [seatsLeft, setSeatsLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setEvent(null);
      setSeatsLeft(null);
      setError("");
      try {
        const res = await api.get(`/api/events/${slug}`);
        setEvent(res.data.req_slug_event);
        setSeatsLeft(res.data.seatsLeft);
      } catch (err) {
        setError(err.response?.data?.message || "Cannot load this event");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [slug]);

  const canRegister = event?.status === "published";

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-zinc-950 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Link
          to="/eventlisting"
          className="text-sm font-medium text-zinc-500 hover:text-violet-400 transition-colors"
        >
          ← All events
        </Link>

        {loading && (
          <div className="mt-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500"></div>
          </div>
        )}

        {error && (
          <p
            className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {!loading && !error && !event && (
          <p className="mt-8 text-zinc-400">Event not found.</p>
        )}

        {!loading && !error && event && (
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* ── Main Content ── */}
            <div className="lg:col-span-2">
              <EventBanner
                fallbackClassName="bg-gradient-to-br from-violet-600/60 to-indigo-700/60"
                className="h-48 w-full rounded-2xl md:h-64"
              />

              <span className="mt-6 inline-block rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                {event.category}
              </span>

              <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">
                {event.title}
              </h1>

              {event.status === "registration_closed" && (
                <p className="mt-3 text-sm font-semibold text-red-400">
                  Registrations closed
                </p>
              )}

              {event.status === "completed" && (
                <p className="mt-3 text-sm font-medium text-zinc-500">
                  This event has ended.
                </p>
              )}

              {event.status === "cancelled" && (
                <p className="mt-3 text-sm font-semibold text-red-400">
                  This event was cancelled.
                </p>
              )}

              <p className="mt-6 whitespace-pre-wrap text-zinc-300 leading-relaxed">
                {event.description}
              </p>

              <dl className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5">
                <DetailRow label="Date" value={formatEventDate(event.date)} />
                <DetailRow
                  label="Time"
                  value={`${event.startTime} – ${event.endTime}`}
                />
                <DetailRow
                  label="Type"
                  value={
                    event.eventType === "online" ? "Online" : "In person"
                  }
                />
                {event.eventType === "offline" && (
                  <>
                    <DetailRow label="Venue" value={event.venue?.name} />
                    <DetailRow label="Address" value={event.venue?.address} />
                    {event.venue?.mapLink && (
                      <DetailRow
                        label="Map"
                        value={
                          <a
                            href={event.venue.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-400 underline hover:text-violet-300 transition-colors"
                          >
                            Open in maps
                          </a>
                        }
                      />
                    )}
                  </>
                )}
                {event.eventType === "online" && (
                  <>
                    <DetailRow label="Platform" value={event.online?.platform} />
                    {event.online?.meetingLink && (
                      <DetailRow
                        label="Link"
                        value={
                          <a
                            href={event.online.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-all text-violet-400 underline hover:text-violet-300 transition-colors"
                          >
                            Join meeting
                          </a>
                        }
                      />
                    )}
                  </>
                )}
              </dl>
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl">
                <div>
                  <h2 className="font-display font-semibold text-white">Capacity</h2>
                  <div className="mt-3">
                    <SeatsCounter
                      capacity={event.capacity}
                      seatsLeft={seatsLeft}
                    />
                  </div>
                </div>

                {canRegister && seatsLeft === 0 && (
                  <p className="text-sm text-amber-400">
                    Event is full — you may be added to the waitlist.
                  </p>
                )}

                {canRegister && (
                  <div>
                    <h2 className="font-display font-semibold text-white">
                      Register for this event
                    </h2>
                    <div className="mt-4">
                      <RegistrationForm eventId={event._id} />
                    </div>
                  </div>
                )}

                {event.status === "registration_closed" && (
                  <p className="text-sm text-zinc-500">
                    The host is no longer accepting registrations.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default EventDetailPage;
