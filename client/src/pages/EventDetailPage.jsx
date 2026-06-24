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
    <div className="flex flex-col gap-0.5 border-b border-neutral-100 py-3 sm:flex-row sm:gap-4">
      <dt className="w-32 shrink-0 text-sm font-medium text-neutral-500">
        {label}
      </dt>
      <dd className="text-sm text-neutral-900">{value}</dd>
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
    <main className="min-h-[calc(100vh-4.5rem)] bg-neutral-50 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Link
          to="/eventlisting"
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          ← All events
        </Link>

        {loading && (
          <p className="mt-8 text-center text-sm text-neutral-500">
            Loading event…
          </p>
        )}

        {error && (
          <p
            className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        {!loading && !error && !event && (
          <p className="mt-8 text-neutral-600">Event not found.</p>
        )}

        {!loading && !error && event && (
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EventBanner
                fallbackClassName="bg-neutral-200"
                className="h-48 w-full rounded-xl md:h-64"
              />

              <span className="mt-6 inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                {event.category}
              </span>

              <h1 className="mt-3 text-3xl font-bold text-neutral-900 md:text-4xl">
                {event.title}
              </h1>

              {event.status === "registration_closed" && (
                <p className="mt-3 text-sm font-medium text-red-700">
                  Registrations closed
                </p>
              )}

              {event.status === "completed" && (
                <p className="mt-3 text-sm font-medium text-neutral-600">
                  This event has ended.
                </p>
              )}

              {event.status === "cancelled" && (
                <p className="mt-3 text-sm font-medium text-red-700">
                  This event was cancelled.
                </p>
              )}

              <p className="mt-6 whitespace-pre-wrap text-neutral-700 leading-relaxed">
                {event.description}
              </p>

              <dl className="mt-8 rounded-xl border border-neutral-200 bg-white px-5">
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
                            className="text-neutral-900 underline hover:text-neutral-600"
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
                            className="break-all text-neutral-900 underline hover:text-neutral-600"
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

            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div>
                  <h2 className="font-semibold text-neutral-900">Capacity</h2>
                  <div className="mt-3">
                    <SeatsCounter
                      capacity={event.capacity}
                      seatsLeft={seatsLeft}
                    />
                  </div>
                </div>

                {canRegister && seatsLeft === 0 && (
                  <p className="text-sm text-amber-800">
                    Event is full — you may be added to the waitlist.
                  </p>
                )}

                {canRegister && (
                  <div>
                    <h2 className="font-semibold text-neutral-900">
                      Register for this event
                    </h2>
                    <div className="mt-4">
                      <RegistrationForm eventId={event._id} />
                    </div>
                  </div>
                )}

                {event.status === "registration_closed" && (
                  <p className="text-sm text-neutral-600">
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
