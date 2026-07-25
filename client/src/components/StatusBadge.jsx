const STATUS_STYLES = {
  pending: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    ring: "ring-amber-500/30",
  },
  approved: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    ring: "ring-emerald-500/30",
  },
  published: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    ring: "ring-emerald-500/30",
  },
  waitlisted: {
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    ring: "ring-sky-500/30",
  },
  rejected: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    ring: "ring-red-500/30",
  },
  cancelled: {
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    ring: "ring-pink-500/30",
  },
  draft: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    ring: "ring-zinc-500/30",
  },
  registration_closed: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    ring: "ring-orange-500/30",
  },
  completed: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    ring: "ring-violet-500/30",
  },
};

const FALLBACK = {
  bg: "bg-indigo-500/10",
  text: "text-indigo-400",
  ring: "ring-indigo-500/30",
};

function StatusBadge({ status }) {
  const key = status?.toLowerCase().replace(/ /g, "_");
  const style = STATUS_STYLES[key] || FALLBACK;

  const label = status
    ? status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Unknown";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${style.bg} ${style.text} ${style.ring}`}
    >
      {label}
    </span>
  );
}

export default StatusBadge;