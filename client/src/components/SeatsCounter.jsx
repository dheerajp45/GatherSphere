function SeatsCounter({ seatsLeft, capacity }) {
  const taken =
    capacity != null && seatsLeft != null ? capacity - seatsLeft : 0;
  const percent =
    capacity > 0 ? Math.min(100, Math.round((taken / capacity) * 100)) : 0;
  const isFull = seatsLeft === 0;

  const barColor = isFull
    ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
    : "bg-gradient-to-r from-violet-500 to-indigo-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]";

  return (
    <div className="space-y-2">
      {isFull ? (
        <p className="text-sm font-medium text-red-400">Event full</p>
      ) : (
        <p className="text-sm text-zinc-400">
          <span className="font-semibold text-white">{seatsLeft}</span> of{" "}
          {capacity} seats remaining
        </p>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export { SeatsCounter };
