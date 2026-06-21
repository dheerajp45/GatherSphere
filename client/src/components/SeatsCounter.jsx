function SeatsCounter({ seatsLeft, capacity }) {
  const taken =
    capacity != null && seatsLeft != null ? capacity - seatsLeft : 0;
  const percent =
    capacity > 0 ? Math.min(100, Math.round((taken / capacity) * 100)) : 0;
  const isFull = seatsLeft === 0;

  return (
    <div className="space-y-2">
      {isFull ? (
        <p className="text-sm font-medium text-red-700">Event full</p>
      ) : (
        <p className="text-sm text-neutral-700">
          <span className="font-medium text-neutral-900">{seatsLeft}</span> of{" "}
          {capacity} seats remaining
        </p>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
        <div
          className={`h-full rounded-full transition-all ${isFull ? "bg-red-500" : "bg-neutral-900"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export { SeatsCounter };
