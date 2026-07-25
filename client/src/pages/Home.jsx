import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import EventBanner from "../components/EventBanner.jsx";

/**
 * Guest landing only — login, register, explore events.
 * Logged-in users are redirected to /eventlisting (GuestRoute in App.jsx).
 */

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

const GITHUB_URL = "https://github.com/dheerajp45";

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Create account",
    description: "Sign up free and log in to your dashboard.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    step: 2,
    title: "Create event",
    description: "Add details, set capacity, and publish your event page.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
  {
    step: 3,
    title: "Share link",
    description: "Send your public event link so people can register.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
      </svg>
    ),
  },
  {
    step: 4,
    title: "Manage & check in",
    description: "Approve registrations, send tickets, and scan QR codes on event day.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

const ORGANIZER_FEATURES = [
  {
    id: 1,
    title: "Event pages",
    description: "Create offline or online events, publish when ready, and share a public link.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Manage registrations",
    description: "Approve or reject signups, handle waitlists, and track capacity in real time.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "QR tickets",
    description: "Approved attendees get a digital ticket with a scannable QR code.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Check-in",
    description: "Scan tickets at the door or mark attendance manually from your dashboard.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
      </svg>
    ),
  },
];

const CATEGORIES = ["Tech", "Business", "Education", "Arts", "Sports", "Other"];

const FEATURED_LIMIT = 3;

function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState("");

  useEffect(() => {
    async function fetchFeaturedEvents() {
      setFeaturedLoading(true);
      setFeaturedError("");
      try {
        const res = await api.get("/api/events");
        const events = res.data.eventdetails ?? [];
        setFeaturedEvents(events.slice(0, FEATURED_LIMIT));
      } catch (err) {
        setFeaturedError(err.response?.data?.message || "Cannot load events");
      } finally {
        setFeaturedLoading(false);
      }
    }
    fetchFeaturedEvents();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* ─── 1 · Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-mesh py-20 md:py-32">
        {/* Decorative blobs */}
        <div className="glow-blob w-96 h-96 bg-violet-600/15 -top-20 -left-32"></div>
        <div className="glow-blob w-80 h-80 bg-indigo-500/10 top-40 right-0"></div>

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Your events. Your community.
          </p>

          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
            Host events.{" "}
            <span className="text-gradient">Build communities.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-zinc-400 leading-relaxed">
            Discover events near you, register in seconds, or create an account
            to host and manage registrations — all in one platform.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/eventlisting"
              id="hero-browse-events"
              className="rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-500 hover:shadow-violet-500/30 transition-all duration-300"
            >
              Browse events
            </Link>
            <Link
              to="/register"
              id="hero-create-account"
              className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-7 py-3.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-300"
            >
              Create account
            </Link>
          </div>

          <p className="mt-8 text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
            >
              Log in →
            </Link>
          </p>
        </div>
      </section>

      {/* ─── 2 · Categories ───────────────────────────────────── */}
      <section className="border-t border-zinc-800/60 bg-zinc-950 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Explore by category
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to="/eventlisting"
                className="rounded-full border border-zinc-700/70 bg-zinc-900/50 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300 transition-all duration-200"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3 · Featured events ──────────────────────────────── */}
      <section className="border-t border-zinc-800/60 bg-zinc-950 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-white">Featured events</h2>
            <Link
              to="/eventlisting"
              className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all events →
            </Link>
          </div>

          {featuredLoading && (
            <p className="mt-10 text-center text-sm text-zinc-500">
              Loading events…
            </p>
          )}

          {featuredError && (
            <p
              className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              role="alert"
            >
              {featuredError}
            </p>
          )}

          {!featuredLoading && !featuredError && featuredEvents.length === 0 && (
            <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
              <p className="font-semibold text-zinc-200">No events yet</p>
              <p className="mt-2 text-sm text-zinc-500">
                Be the first to host — create an account and publish an event.
              </p>
            </div>
          )}

          {!featuredLoading && !featuredError && featuredEvents.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((event, index) => (
                <Link
                  key={event._id}
                  to={`/event/${event.slug}`}
                  className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 glow-card"
                >
                  <EventBanner
                    fallbackClassName={CARD_ACCENTS[index % CARD_ACCENTS.length]}
                    className="h-32 w-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="space-y-2 p-5">
                    <p className="text-sm text-zinc-500">
                      {formatEventDate(event.date)}
                      {event.startTime && event.endTime
                        ? ` · ${event.startTime}–${event.endTime}`
                        : ""}
                    </p>
                    <h3 className="font-display font-semibold text-white group-hover:text-violet-300 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-zinc-400">{eventLocation(event)}</p>
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
      </section>

      {/* ─── 4 · For organizers ───────────────────────────────── */}
      <section className="relative border-t border-zinc-800/60 bg-gradient-mesh py-14 md:py-20 overflow-hidden">
        <div className="glow-blob w-80 h-80 bg-indigo-600/10 -bottom-20 -right-20"></div>
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            For organizers
          </p>

          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold text-white md:text-4xl">
            Everything you need to run an event.
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-zinc-400 leading-relaxed">
            Create event pages, manage registrations, approve attendees, send
            tickets with QR codes, and check people in on event day — all in one
            place.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-block text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            Get started as a host →
          </Link>
        </div>
      </section>

      {/* ─── 5 · Feature cards ────────────────────────────────── */}
      <section className="border-t border-zinc-800/60 bg-zinc-950 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {ORGANIZER_FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 glow-card"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  {feature.icon}
                </div>
                <h3 className="mt-4 font-display font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6 · How it works ─────────────────────────────────── */}
      <section className="border-t border-zinc-800/60 bg-zinc-950 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-zinc-500">
            How it works
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/15 text-violet-400 ring-1 ring-violet-500/25">
                  {item.icon}
                </div>
                <h3 className="mt-5 font-display font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7 · CTA ──────────────────────────────────────────── */}
      <section className="border-t border-zinc-800/60 bg-zinc-950 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-violet-600/10 via-zinc-900/80 to-indigo-600/10 px-8 py-12 md:flex-row md:items-center md:px-12">
            <div className="glow-blob w-60 h-60 bg-violet-500/20 -top-10 -right-10"></div>
            <div className="relative z-10">
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                Ready to host your next event?
              </h2>
              <p className="mt-3 max-w-xl text-zinc-400">
                Join GatherSphere and start building your community today.
              </p>
            </div>

            <Link
              to="/register"
              className="relative z-10 shrink-0 rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-500 transition-all duration-300"
            >
              Get started →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 8 · Footer ───────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/60 bg-zinc-950 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <Link to="/" className="font-display text-xl font-bold text-gradient">
                GatherSphere
              </Link>
              <p className="mt-3 max-w-xs text-sm text-zinc-500 leading-relaxed">
                Discover events, host gatherings, and manage registrations in one place.
              </p>
            </div>

            <nav className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
              <div className="space-y-3">
                <p className="font-semibold text-zinc-300">Explore</p>
                <Link to="/eventlisting" className="block text-zinc-500 hover:text-zinc-300 transition-colors">
                  Browse events
                </Link>
                <Link to="/register" className="block text-zinc-500 hover:text-zinc-300 transition-colors">
                  Create account
                </Link>
                <Link to="/login" className="block text-zinc-500 hover:text-zinc-300 transition-colors">
                  Log in
                </Link>
              </div>
            </nav>
          </div>

          <div className="mt-12 border-t border-zinc-800/60 pt-8 text-center">
            <p className="text-sm text-zinc-600">Made by Dheeraj</p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dheeraj on GitHub"
              className="mt-3 inline-block text-zinc-500 hover:text-violet-400 transition-colors"
            >
              <svg className="h-6 w-6" aria-hidden="true">
                <use href="/icons.svg#github-icon" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Home;
