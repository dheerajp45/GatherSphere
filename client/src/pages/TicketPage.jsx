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
    <main className="min-h-[calc(100vh-4.5rem)] bg-zinc-950 py-12 md:py-20">
      <div className="mx-auto max-w-md px-6">
        <Link
          to={backTo}
          className="text-sm font-medium text-zinc-500 hover:text-violet-400 transition-colors"
        >
          ← {backLabel}
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

        {!loading && !error && !ticket?.ticketToken && (
          <p className="mt-8 text-center text-zinc-500">
            Ticket not available.
          </p>
        )}

        {!loading && !error && ticket?.ticketToken && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
            {/* Ticket Header */}
            <div className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-br from-violet-600/20 via-zinc-900 to-indigo-600/20 px-6 py-6 text-center">
              <div className="glow-blob w-40 h-40 bg-violet-500/20 -top-10 left-1/2 -translate-x-1/2"></div>
              <p className="relative z-10 text-xs font-semibold uppercase tracking-widest text-violet-400">
                GatherSphere Ticket
              </p>
              <h1 className="relative z-10 mt-2 font-display text-xl font-bold text-white">
                {ticket.eventTitle}
              </h1>
            </div>

            {/* Dotted separator with notch effect */}
            <div className="relative flex items-center px-4">
              <div className="absolute -left-3 h-6 w-6 rounded-full bg-zinc-950"></div>
              <div className="w-full border-t border-dashed border-zinc-700"></div>
              <div className="absolute -right-3 h-6 w-6 rounded-full bg-zinc-950"></div>
            </div>

            {/* Ticket Details */}
            <div className="space-y-4 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Attendee
                </p>
                <p className="mt-1 font-semibold text-white">
                  {ticket.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Check-in status
                </p>
                {ticket.checkedInAt ? (
                  <p className="mt-1 text-sm font-medium text-emerald-400">
                    ✓ Checked in ·{" "}
                    {new Date(ticket.checkedInAt).toLocaleString("en-IN")}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-zinc-400">
                    Not checked in yet
                  </p>
                )}
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center border-t border-zinc-800 bg-zinc-900/40 px-6 py-8">
              <div className="rounded-2xl bg-white p-5 shadow-lg">
                <QRCodeSVG
                  value={ticket.ticketToken}
                  size={220}
                  bgColor="#FFFFFF"
                  fgColor="#09090b"
                  includeMargin={true}
                  level="M"
                />
              </div>
              <p className="mt-5 text-center text-sm text-zinc-500">
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
