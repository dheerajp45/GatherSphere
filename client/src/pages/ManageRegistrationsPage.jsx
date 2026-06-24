import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge.jsx";
import { SeatsCounter } from "../components/SeatsCounter.jsx";

const btnOutline =
  "inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const btnPrimary =
  "inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const btnSuccess =
  "inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const btnDanger =
  "inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

function attendanceLabel(status) {
  if (status === "attended") return "Attended";
  if (status === "absent") return "Absent";
  return "Not marked";
}

/**
 * DATA:
 *   GET /api/registrations/events/:eventId
 *   GET /api/events/my/event/:eventId
 */
function ManageRegistrationsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingActions, setLoadingActions] = useState({});

  const isActionLoading = (key) => !!loadingActions[key];
  const withLoading = async (key, fn) => {
    setLoadingActions(prev => ({ ...prev, [key]: true }));
    try { await fn(); } finally { setLoadingActions(prev => { const next = { ...prev }; delete next[key]; return next; }); }
  };

  const approvedCount = registrations.filter((r) => r.status === "approved").length;
  const seatsRemaining = event != null ? event.capacity - approvedCount : null;

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const [regsRes, eventRes] = await Promise.all([
        api.get(`/api/registrations/events/${eventId}`),
        api.get(`/api/events/my/event/${eventId}`),
      ]);
      setRegistrations(regsRes.data.registration ?? []);
      setEvent(eventRes.data.event);
    } catch (err) {
      setError(err.response?.data?.message || "Cannot load registrations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [eventId]);

  async function approve(registrationId) {
    try {
      await api.patch(`/api/registrations/${registrationId}/approve`);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Approve failed");
    }
  }

  async function reject(registrationId) {
    try {
      await api.patch(`/api/registrations/${registrationId}/reject`);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Reject failed");
    }
  }

  async function markAttendance(attendanceStatus, registrationId) {
    try {
      await api.patch(`/api/registrations/${registrationId}/attendance`, {
        attendanceStatus,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Attendance update failed");
    } finally {
      await fetchData();
    }
  }

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-slate-50 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Link
          to="/dashboard"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Dashboard
        </Link>

        {loading && (
          <p className="mt-8 text-center text-sm text-slate-500">Loading…</p>
        )}

        {error && (
          <p
            className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        {!loading && event && (
          <>
            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {event.title}
                  </h1>
                  <StatusBadge status={event.status} />
                </div>
                <p className="mt-2 text-slate-600">Manage registrations</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={btnPrimary}
                  onClick={() =>
                    navigate("/camera", {
                      state: {
                        returnTo: `/events/${eventId}/registrations`,
                      },
                    })
                  }
                >
                  Scan QR check-in
                </button>
                {event.slug && (
                  <Link to={`/event/${event.slug}`} className={btnOutline}>
                    Public page
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-5 border-l-4 border-l-indigo-500">
                <p className="text-sm text-slate-500">Capacity</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {event.capacity}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 border-l-4 border-l-emerald-500">
                <p className="text-sm text-slate-500">Approved</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {approvedCount}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 border-l-4 border-l-amber-500">
                <p className="text-sm text-slate-500">Seats remaining</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {seatsRemaining}
                </p>
                <div className="mt-3">
                  <SeatsCounter
                    capacity={event.capacity}
                    seatsLeft={seatsRemaining}
                  />
                </div>
              </div>
            </div>

            <section className="mt-12">
              <h2 className="text-xl font-bold text-slate-900">
                Registrations
                <span className="ml-2 text-base font-normal text-slate-500">
                  ({registrations.length})
                </span>
              </h2>

              {registrations.length === 0 ? (
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center">
                  <p className="text-slate-600">No registrations yet.</p>
                </div>
              ) : (
                <ul className="mt-6 space-y-4">
                  {registrations.map((r) => (
                    <li
                      key={r._id}
                      className="rounded-xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-slate-900">
                              {r.name}
                            </p>
                            <StatusBadge status={r.status} />
                          </div>
                          <p className="mt-1 text-sm text-slate-600">
                            {r.email} · {r.phone}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Attendance:{" "}
                            <span className="font-medium text-slate-700">
                              {attendanceLabel(r.attendanceStatus)}
                            </span>
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(r.status === "pending" ||
                            r.status === "waitlisted" ||
                            r.status === "rejected") && (
                            <button
                              type="button"
                              className={btnSuccess}
                              disabled={isActionLoading(`approve_${r._id}`)}
                              onClick={() => withLoading(`approve_${r._id}`, () => approve(r._id))}
                            >
                              {isActionLoading(`approve_${r._id}`) && <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                              {isActionLoading(`approve_${r._id}`) ? "Approving…" : "Approve"}
                            </button>
                          )}
                          {r.status !== "rejected" &&
                            r.status !== "cancelled" &&
                            r.attendanceStatus !== "attended" && (
                              <button
                                type="button"
                                className={btnDanger}
                                disabled={isActionLoading(`reject_${r._id}`)}
                                onClick={() => withLoading(`reject_${r._id}`, () => reject(r._id))}
                              >
                                {isActionLoading(`reject_${r._id}`) && <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                                {isActionLoading(`reject_${r._id}`) ? "Rejecting…" : "Reject"}
                              </button>
                            )}
                          {r.status === "approved" &&
                            r.attendanceStatus === "not_marked" && (
                              <>
                                <button
                                  type="button"
                                  className={btnOutline}
                                  disabled={isActionLoading(`attended_${r._id}`)}
                                  onClick={() =>
                                    withLoading(`attended_${r._id}`, () => markAttendance("attended", r._id))
                                  }
                                >
                                  {isActionLoading(`attended_${r._id}`) && <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                                  {isActionLoading(`attended_${r._id}`) ? "Marking…" : "Mark attended"}
                                </button>
                                <button
                                  type="button"
                                  className={btnOutline}
                                  disabled={isActionLoading(`absent_${r._id}`)}
                                  onClick={() =>
                                    withLoading(`absent_${r._id}`, () => markAttendance("absent", r._id))
                                  }
                                >
                                  {isActionLoading(`absent_${r._id}`) && <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                                  {isActionLoading(`absent_${r._id}`) ? "Marking…" : "Mark absent"}
                                </button>
                              </>
                            )}
                        </div>
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

export default ManageRegistrationsPage;
