import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import StatusBadge from "../components/StatusBadge.jsx";

const btnOutline =
  "inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const btnPrimary =
  "inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const btnDanger =
  "inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

function formatEventDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 border-l-4 ${accent}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value ?? 0}</p>
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

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-slate-50 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Your hub
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-slate-600">
              Manage events you host and registrations you&apos;ve made.
            </p>
          </div>
          <Link to="/events/create" className={btnPrimary}>
            + Create event
          </Link>
        </div>

        {loading && (
          <p className="mt-12 text-center text-sm text-slate-500">Loading…</p>
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
              <StatCard label="Events hosted" value={stats?.eventsHosted} accent="border-l-indigo-500" />
              <StatCard label="Upcoming events" value={stats?.upcomingEvents} accent="border-l-emerald-500" />
              <StatCard
                label="Total registrations"
                value={stats?.totalRegistrations}
                accent="border-l-amber-500"
              />
            </div>

            <section className="mt-12">
              <h2 className="text-xl font-bold text-slate-900">
                My hosted events
                <span className="ml-2 text-base font-normal text-slate-500">
                  ({hostedEvents.length})
                </span>
              </h2>

              {hostedEvents.length === 0 ? (
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center">
                  <p className="text-slate-600">You haven&apos;t created any events yet.</p>
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
                      className="rounded-xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {event.title}
                        </h3>
                        <StatusBadge status={event.status} />
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
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
                            {isActionLoading(`publish_${event._id}`) && <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
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
                            {isActionLoading(`close_${event._id}`) && <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                            {isActionLoading(`close_${event._id}`) ? "Closing…" : "Close registrations"}
                          </button>
                        )}
                        <button
                          type="button"
                          className={btnDanger}
                          disabled={isActionLoading(`delete_${event._id}`)}
                          onClick={() => withLoading(`delete_${event._id}`, () => deleteEvent(event._id))}
                        >
                          {isActionLoading(`delete_${event._id}`) && <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                          {isActionLoading(`delete_${event._id}`) ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mt-12">
              <h2 className="text-xl font-bold text-slate-900">
                My registrations
                <span className="ml-2 text-base font-normal text-slate-500">
                  ({myRegistrations.length})
                </span>
              </h2>

              {myRegistrations.length === 0 ? (
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center">
                  <p className="text-slate-600">
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
                      className="rounded-xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {r.event?.slug ? (
                          <Link
                            to={`/event/${r.event.slug}`}
                            className="font-semibold text-slate-900 hover:underline"
                          >
                            {r.event.title}
                          </Link>
                        ) : (
                          <span className="font-semibold text-slate-900">
                            Event unavailable
                          </span>
                        )}
                        <StatusBadge status={r.status} />
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{r.name}</p>
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
                            {isActionLoading(`cancel_${r._id}`) && <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
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
