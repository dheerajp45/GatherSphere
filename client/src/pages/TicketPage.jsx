import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * DATA: GET /api/registrations/ticket/:ticketToken (public)
 */
function TicketPage() {
  const { ticketToken } = useParams();
  const { token } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTicket() {
      setLoading(true);
      setTicket(null);
      setError("");
      try {
        const res = await api.get(`/api/registrations/ticket/${ticketToken}`);
        setTicket(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Cannot load ticket");
      } finally {
        setLoading(false);
      }
    }
    fetchTicket();
  }, [ticketToken]);

  const backTo = token ? "/dashboard" : "/eventlisting";
  const backLabel = token ? "Dashboard" : "Browse events";

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-neutral-50 py-12 md:py-16">
      <div className="mx-auto max-w-md px-6">
        <Link
          to={backTo}
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          ← {backLabel}
        </Link>

        {loading && (
          <p className="mt-12 text-center text-sm text-neutral-500">
            Loading ticket…
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

        {!loading && !error && !ticket?.ticketToken && (
          <p className="mt-8 text-center text-neutral-600">
            Ticket not available.
          </p>
        )}

        {!loading && !error && ticket?.ticketToken && (
          <div className="mt-8 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-200 bg-neutral-900 px-6 py-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                GatherSphere ticket
              </p>
              <h1 className="mt-1 text-lg font-bold text-white">
                {ticket.eventTitle}
              </h1>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">
                  Attendee
                </p>
                <p className="mt-0.5 font-semibold text-neutral-900">
                  {ticket.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">
                  Check-in status
                </p>
                {ticket.checkedInAt ? (
                  <p className="mt-0.5 text-sm font-medium text-green-700">
                    Checked in ·{" "}
                    {new Date(ticket.checkedInAt).toLocaleString("en-IN")}
                  </p>
                ) : (
                  <p className="mt-0.5 text-sm text-neutral-600">
                    Not checked in yet
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center border-t border-neutral-200 bg-white px-6 py-8">
              <div className="rounded-lg bg-white p-4 shadow-inner ring-1 ring-neutral-200">
                <QRCodeSVG
                  value={ticket.ticketToken}
                  size={280}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  includeMargin={true}
                  level="M"
                />
              </div>
              <p className="mt-4 text-center text-sm text-neutral-500">
                Show this QR code at the venue entrance
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default TicketPage;
