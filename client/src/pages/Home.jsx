import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import EventBanner from "../components/EventBanner.jsx";

/**
 * Guest landing only — login, register, explore events.
 * Logged-in users are redirected to /eventlisting (GuestRoute in App.jsx).
 */

const CARD_ACCENTS = [
  "bg-blue-600",
  "bg-violet-600",
  "bg-teal-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-indigo-600",
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
  },
  {
    step: 2,
    title: "Create event",
    description: "Add details, set capacity, and publish your event page.",
  },
  {
    step: 3,
    title: "Share link",
    description: "Send your public event link so people can register.",
  },
  {
    step: 4,
    title: "Manage & check in",
    description: "Approve registrations, send tickets, and scan QR codes on event day.",
  },
];

const ORGANIZER_FEATURES = [
  {
    id: 1,
    title: "Event pages",
    description: "Create offline or online events, publish when ready, and share a public link.",
  },
  {
    id: 2,
    title: "Manage registrations",
    description: "Approve or reject signups, handle waitlists, and track capacity in real time.",
  },
  {
    id: 3,
    title: "QR tickets",
    description: "Approved attendees get a digital ticket with a scannable QR code.",
  },
  {
    id: 4,
    title: "Check-in",
    description: "Scan tickets at the door or mark attendance manually from your dashboard.",
  },
];

// /** Same categories as Create Event / event schema. */
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
    <main className="min-h-screen bg-neutral-100">
      {/* 1 — Hero (basic — polish later) */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            Your events. Your community.
          </p>

          <h1 className="mt-3 max-w-2xl text-4xl font-bold text-neutral-900 md:text-5xl">
            Host events. Build communities.
          </h1>

          <p className="mt-4 max-w-xl text-base text-neutral-600 md:text-lg">
            Discover events near you, register in seconds, or create an account
            to host and manage registrations.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/eventlisting"
              className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Browse events
            </Link>
            <Link
              to="/register"
              className="rounded-lg border border-neutral-900 bg-white px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
            >
              Create account
            </Link>
          </div>

          <p className="mt-6 text-sm text-neutral-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-neutral-900 underline hover:text-neutral-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </section>

      {/* 2 — Categories (basic — filter on listing page later) */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            Explore events by category
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to="/eventlisting"
                className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:border-neutral-900 hover:bg-neutral-100"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Featured events (GET /api/events, first 3) */}
      <section className="border-t border-neutral-200 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-neutral-900">Featured events</h2>
            <Link
              to="/eventlisting"
              className="text-sm font-medium text-neutral-700 underline hover:text-neutral-900"
            >
              View all events →
            </Link>
          </div>

          {featuredLoading && (
            <p className="mt-8 text-center text-sm text-neutral-500">
              Loading events…
            </p>
          )}

          {featuredError && (
            <p
              className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {featuredError}
            </p>
          )}

          {!featuredLoading && !featuredError && featuredEvents.length === 0 && (
            <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center">
              <p className="font-medium text-neutral-900">No events yet</p>
              <p className="mt-2 text-sm text-neutral-600">
                Be the first to host — create an account and publish an event.
              </p>
            </div>
          )}

          {!featuredLoading && !featuredError && featuredEvents.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((event, index) => (
                <Link
                  key={event._id}
                  to={`/event/${event.slug}`}
                  className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
                >
                  <EventBanner
                    bannerImage={event.bannerImage}
                    fallbackClassName={CARD_ACCENTS[index % CARD_ACCENTS.length]}
                    alt={event.title}
                    className="h-28 w-full"
                  />
                  <div className="space-y-2 p-4">
                    <p className="text-sm text-neutral-500">
                      {formatEventDate(event.date)}
                      {event.startTime && event.endTime
                        ? ` · ${event.startTime}–${event.endTime}`
                        : ""}
                    </p>
                    <h3 className="font-semibold text-neutral-900">{event.title}</h3>
                    <p className="text-sm text-neutral-600">{eventLocation(event)}</p>
                    <p className="text-sm text-neutral-500">
                      Capacity: {event.capacity}
                    </p>
                    <span className="inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                      {event.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4 — Organizer intro (basic) */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            For organizers
          </p>

          <h2 className="mt-3 max-w-2xl text-3xl font-bold text-neutral-900 md:text-4xl">
            Everything you need to run an event.
          </h2>

          <p className="mt-4 max-w-2xl text-base text-neutral-600 md:text-lg">
            Create event pages, manage registrations, approve attendees, send
            tickets with QR codes, and check people in on event day — all in one
            place.
          </p>

          <Link
            to="/register"
            className="mt-6 inline-block text-sm font-medium text-neutral-900 underline hover:text-neutral-700"
          >
            Get started as a host →
          </Link>
        </div>
      </section>

      {/* 5 — Feature cards (basic) */}
      <section className="border-t border-neutral-200 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {ORGANIZER_FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="rounded-xl border border-neutral-200 bg-neutral-50 p-6"
              >
                <h3 className="font-semibold text-neutral-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — How it works (basic) */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-sm font-medium uppercase tracking-wide text-neutral-500">
            How it works
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — CTA (basic) */}
      <section className="border-t border-neutral-200 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-stone-100 px-8 py-10 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
                Ready to host your next event?
              </h2>
              <p className="mt-2 max-w-xl text-neutral-600">
                Join GatherSphere and start building your community today.
              </p>
            </div>

            <Link
              to="/register"
              className="shrink-0 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Get started →
            </Link>
          </div>
        </div>
      </section>

      {/* 8 — Footer (basic) */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <Link to="/" className="text-lg font-bold text-neutral-900">
                GatherSphere
              </Link>
              <p className="mt-2 max-w-xs text-sm text-neutral-600">
                Discover events, host gatherings, and manage registrations in one place.
              </p>
            </div>

            <nav className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium text-neutral-900">Explore</p>
                <Link to="/eventlisting" className="block text-neutral-600 hover:text-neutral-900">
                  Browse events
                </Link>
                <Link to="/register" className="block text-neutral-600 hover:text-neutral-900">
                  Create account
                </Link>
                <Link to="/login" className="block text-neutral-600 hover:text-neutral-900">
                  Log in
                </Link>
              </div>
            </nav>
          </div>

          <div className="mt-10 border-t border-neutral-200 pt-6 text-center">
            <p className="text-sm text-neutral-500">Made by Dheeraj</p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dheeraj on GitHub"
              className="mt-3 inline-block text-neutral-700 hover:text-neutral-900"
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
