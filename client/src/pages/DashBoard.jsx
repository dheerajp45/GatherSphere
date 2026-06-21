import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import StatusBadge from "../components/StatusBadge.jsx";

const btnOutline =
  "rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50";
const btnPrimary =
  "rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800";
const btnDanger =
  "rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50";

function formatEventDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-neutral-900">{value ?? 0}</p>
    </div>
  );
}

/**
 * DATA:
 *   GET /api/dashboard/stats
 *   GET /api/events/my/events
 *   GET /api/dashboard/myregistrations
 */
function DashBoard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [hostedEvents, setHostedEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const [statsRes, eventsRes, regsRes] = await Promise.all([
        api.get("/api/dashboard/stats"),
        api.get("/api/events/my/events"),
        api.get("/api/dashboard/myregistrations"),
      ]);
      setStats(statsRes.data);
      setHostedEvents(eventsRes.data.eventdetails ?? []);
      setMyRegistrations(regsRes.data.myRegistrations ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Cannot load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  []
  async function publishEvent(id) {
    try {
      await api.patch(`/api/events/${id}/status`, { status: "published" });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish event");
    }
  }
  
  async function deleteEvent(id) {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/api/events/${id}`);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event");
    }
  }

  async function closeRegistrations(eventId) {
    try {
      await api.patch(`/api/events/${eventId}/status`, {
        status: "registration_closed",
      });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to close registrations");
    }
  }

  async function cancelRegistration(registrationId, email) {
    try {
      await api.delete(`/api/registrations/${registrationId}`, {
        data: { email },
      });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Cancel failed");
    }
  }

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-neutral-50 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
              Your hub
            </p>
            <h1 className="mt-2 text-3xl font-bold text-neutral-900">Dashboard</h1>
            <p className="mt-2 text-neutral-600">
              Manage events you host and registrations you&apos;ve made.
            </p>
          </div>
          <Link to="/events/create" className={btnPrimary}>
            + Create event
          </Link>
        </div>

        {loading && (
          <p className="mt-12 text-center text-sm text-neutral-500">Loading…</p>
        )}

        {error && (
          <p
            className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Events hosted" value={stats?.eventsHosted} />
              <StatCard label="Upcoming events" value={stats?.upcomingEvents} />
              <StatCard
                label="Total registrations"
                value={stats?.totalRegistrations}
              />
            </div>

            <section className="mt-12">
              <h2 className="text-xl font-bold text-neutral-900">
                My hosted events
                <span className="ml-2 text-base font-normal text-neutral-500">
                  ({hostedEvents.length})
                </span>
              </h2>

              {hostedEvents.length === 0 ? (
                <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-8 text-center">
                  <p className="text-neutral-600">You haven&apos;t created any events yet.</p>
                  <Link
                    to="/events/create"
                    className={`mt-4 inline-block ${btnPrimary}`}
                  >
                    Create your first event
                  </Link>
                </div>
              ) : (
                <ul className="mt-6 space-y-4">
                  {hostedEvents.map((event) => (
                    <li
                      key={event._id}
                      className="rounded-xl border border-neutral-200 bg-white p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-neutral-900">
                          {event.title}
                        </h3>
                        <StatusBadge status={event.status} />
                      </div>
                      <p className="mt-1 text-sm text-neutral-600">
                        {formatEventDate(event.date)} · {event.category} ·{" "}
                        {event.eventType}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={btnOutline}
                          onClick={() => navigate(`/events/edit/${event._id}`)}
                        >
                          Edit
                        </button>
                        {event.status === "draft" && (
                          <button
                            type="button"
                            className={btnPrimary}
                            onClick={() => publishEvent(event._id)}
                          >
                            Publish
                          </button>
                        )}
                        <button
                          type="button"
                          className={btnOutline}
                          onClick={() =>
                            navigate(`/events/${event._id}/registrations`)
                          }
                        >
                          Manage registrations
                        </button>
                        {event.slug && (
                          <Link
                            to={`/event/${event.slug}`}
                            className={btnOutline}
                          >
                            Public page
                          </Link>
                        )}
                        {event.status !== "registration_closed" && (
                          <button
                            type="button"
                            className={btnOutline}
                            onClick={() => closeRegistrations(event._id)}
                          >
                            Close registrations
                          </button>
                        )}
                        <button
                          type="button"
                          className={btnDanger}
                          onClick={() => deleteEvent(event._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mt-12">
              <h2 className="text-xl font-bold text-neutral-900">
                My registrations
                <span className="ml-2 text-base font-normal text-neutral-500">
                  ({myRegistrations.length})
                </span>
              </h2>

              {myRegistrations.length === 0 ? (
                <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-8 text-center">
                  <p className="text-neutral-600">
                    You haven&apos;t registered for any events yet.
                  </p>
                  <Link
                    to="/eventlisting"
                    className={`mt-4 inline-block ${btnOutline}`}
                  >
                    Browse events
                  </Link>
                </div>
              ) : (
                <ul className="mt-6 space-y-4">
                  {myRegistrations.map((r) => (
                    <li
                      key={r._id}
                      className="rounded-xl border border-neutral-200 bg-white p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {r.event?.slug ? (
                          <Link
                            to={`/event/${r.event.slug}`}
                            className="font-semibold text-neutral-900 hover:underline"
                          >
                            {r.event.title}
                          </Link>
                        ) : (
                          <span className="font-semibold text-neutral-900">
                            Event unavailable
                          </span>
                        )}
                        <StatusBadge status={r.status} />
                      </div>
                      <p className="mt-1 text-sm text-neutral-600">{r.name}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {r.status === "approved" && r.ticketToken && (
                          <button
                            type="button"
                            className={btnPrimary}
                            onClick={() =>
                              navigate(`/ticket/${r.ticketToken}`)
                            }
                          >
                            View ticket
                          </button>
                        )}
                        {r.status !== "cancelled" && r.status !== "rejected" && (
                          <button
                            type="button"
                            className={btnOutline}
                            onClick={() =>
                              cancelRegistration(r._id, r.email)
                            }
                          >
                            Cancel registration
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default DashBoard;
