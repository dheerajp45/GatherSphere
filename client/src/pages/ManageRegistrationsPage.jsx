import { useState, useEffect } from "react";
import api from "../api/axios";
import { useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge.jsx";

function ManageRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [event, setEvent] = useState(null);
  const { eventId } = useParams();
  async function fetchData() {
    setLoading(true);
    setRegistrations([]);
    setError("");
    (async () => {
      try {
        const registrationsResult = await api.get(
          `/api/registrations/events/${eventId}`,
        );
        setRegistrations(registrationsResult.data.registration);

        const eventDetails = await api.get(`/api/events/my/event/${eventId}`);
        setEvent(eventDetails.data.event);
      } catch (error) {
        setError(error.response?.data?.message || "Cannot get data");
      } finally {
        setLoading(false);
      }
    })();
  }
  useEffect(() => {
    fetchData();
  }, [eventId]);

  async function handleApprove(registrationId) {
    try {
      await api.patch(`/api/registrations/${registrationId}/approve`);
      await fetchData();
    } catch (error) {
      setError(error.response?.data?.message || "Action failed");
    }
  }

  async function handleReject(registrationId) {
    try {
      await api.patch(`/api/registrations/${registrationId}/reject`);
      await fetchData();
    } catch (error) {
      setError(error.response?.data?.message || "Action failed");
    }
  }
  const approvedCount = registrations.filter(
    (r) => r.status === "approved",
  ).length;
  return (
    <>
      Registation page
      {loading ? (
        <p className="text-blue-700">getting the data</p>
      ) : error ? (
        <p className="text-red-700">{error}</p>
      ) : (
        <div>
          {event && (
            <>
              <h1>{event.title}</h1>-----
              <h2>total capacity = {event.capacity}</h2>
              <h2>remaining capacity = {event.capacity - approvedCount}</h2>
            </>
          )}
          {registrations.length === 0 ? (
            <p className="text-green-700">No registrations Found</p>
          ) : (
            <ul className="list-disc list-inside space-y-2 text-grey">
              {registrations.map((r) => (
                <li key={r._id}>
                  {r.name}----{r.email}---{r.phone}--
                  <StatusBadge status={r.status} /> ---
                  {(r.status === "pending" ||
                    r.status === "waitlisted" ||
                    r.status === "rejected") && (
                    <button onClick={() => handleApprove(r._id)}>
                      Approve
                    </button>
                  )}
                  {r.status !== "rejected" && r.status !== "cancelled" && (
                    <button onClick={() => handleReject(r._id)}>Reject</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

export default ManageRegistrationsPage;
