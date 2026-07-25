/**
 * Colored placeholder for event cards (banner images deferred to v2).
 * Uses dark-friendly gradient fallbacks instead of bright blocks.
 */
function EventBanner({
  fallbackClassName = "bg-gradient-to-br from-zinc-800 to-zinc-900",
  className = "h-28 w-full",
}) {
  return <div className={`${className} ${fallbackClassName}`} aria-hidden="true" />;
}

export default EventBanner;
