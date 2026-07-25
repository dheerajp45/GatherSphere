import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import StatusBadge from "../components/StatusBadge.jsx";

const btnOutline =
  "inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const btnPrimary =
  "inline-flex items-center rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-violet-600/20 hover:bg-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const btnDanger =
  "inline-flex items-center rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

function formatEventDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatCard({ label, value, accent, icon }) {
  return (
    <div className={`rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 border-l-4 ${accent}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{label}</p>
        {icon && <div className="text-zinc-600">{icon}</div>}
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-white">{value ?? 0}</p>
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
  const [loadingActions, setLoadingActions] = useState({});

  const isActionLoading = (key) => !!loadingActions[key];
  const withLoading = async (key, fn) => {
    setLoadingActions(prev => ({ ...prev, [key]: true }));
    try { await fn(); } finally { setLoadingActions(prev => { const next = { ...prev }; delete next[key]; return next; }); }
  };

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

  const spinner = (
    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-zinc-950 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
              Your hub
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-2 text-zinc-400">
              Manage events you host and registrations you&apos;ve made.
            </p>
          </div>
          <Link to="/events/create" className={btnPrimary}>
            + Create event
          </Link>
        </div>

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

        {!loading && !error && (
          <>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Events hosted" value={stats?.eventsHosted} accent="border-l-violet-500" />
              <StatCard label="Upcoming events" value={stats?.upcomingEvents} accent="border-l-emerald-500" />
              <StatCard
                label="Total registrations"
                value={stats?.totalRegistrations}
                accent="border-l-amber-500"
              />
            </div>

            {/* ── Hosted Events ── */}
            <section className="mt-14">
              <h2 className="font-display text-xl font-bold text-white">
                My hosted events
                <span className="ml-2 text-base font-normal text-zinc-500">
                  ({hostedEvents.length})
                </span>
              </h2>

              {hostedEvents.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
                  <p className="text-zinc-400">You haven&apos;t created any events yet.</p>
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
                      className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display font-semibold text-white">
                          {event.title}
                        </h3>
                        <StatusBadge status={event.status} />
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">
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
                            disabled={isActionLoading(`publish_${event._id}`)}
                            onClick={() => withLoading(`publish_${event._id}`, () => publishEvent(event._id))}
                          >
                            {isActionLoading(`publish_${event._id}`) && spinner}
                            {isActionLoading(`publish_${event._id}`) ? "Publishing…" : "Publish"}
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
                            disabled={isActionLoading(`close_${event._id}`)}
                            onClick={() => withLoading(`close_${event._id}`, () => closeRegistrations(event._id))}
                          >
                            {isActionLoading(`close_${event._id}`) && spinner}
                            {isActionLoading(`close_${event._id}`) ? "Closing…" : "Close registrations"}
                          </button>
                        )}
                        <button
                          type="button"
                          className={btnDanger}
                          disabled={isActionLoading(`delete_${event._id}`)}
                          onClick={() => withLoading(`delete_${event._id}`, () => deleteEvent(event._id))}
                        >
                          {isActionLoading(`delete_${event._id}`) && spinner}
                          {isActionLoading(`delete_${event._id}`) ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* ── My Registrations ── */}
            <section className="mt-14">
              <h2 className="font-display text-xl font-bold text-white">
                My registrations
                <span className="ml-2 text-base font-normal text-zinc-500">
                  ({myRegistrations.length})
                </span>
              </h2>

              {myRegistrations.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
                  <p className="text-zinc-400">
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
                      className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {r.event?.slug ? (
                          <Link
                            to={`/event/${r.event.slug}`}
                            className="font-display font-semibold text-white hover:text-violet-300 transition-colors"
                          >
                            {r.event.title}
                          </Link>
                        ) : (
                          <span className="font-display font-semibold text-zinc-500">
                            Event unavailable
                          </span>
                        )}
                        <StatusBadge status={r.status} />
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">{r.name}</p>
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
                            disabled={isActionLoading(`cancel_${r._id}`)}
                            onClick={() =>
                              withLoading(`cancel_${r._id}`, () => cancelRegistration(r._id, r.email))
                            }
                          >
                            {isActionLoading(`cancel_${r._id}`) && spinner}
                            {isActionLoading(`cancel_${r._id}`) ? "Cancelling…" : "Cancel registration"}
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
