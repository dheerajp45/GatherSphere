/**
 * Colored placeholder for event cards (banner images deferred to v2).
 */
function EventBanner({
  fallbackClassName = "bg-neutral-300",
  className = "h-28 w-full",
}) {
  return <div className={`${className} ${fallbackClassName}`} aria-hidden="true" />;
}

export default EventBanner;
