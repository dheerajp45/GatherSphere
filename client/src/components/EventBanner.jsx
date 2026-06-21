import { useState } from "react";

/**
 * Shows event bannerImage URL when set; falls back to a colored block.
 */
function EventBanner({
  bannerImage,
  fallbackClassName = "bg-neutral-300",
  alt = "Event banner",
  className = "h-28 w-full",
}) {
  const [failed, setFailed] = useState(false);
  const hasImage = Boolean(bannerImage?.trim()) && !failed;

  if (hasImage) {
    return (
      <img
        src={bannerImage}
        alt={alt}
        className={`${className} object-cover`}
        onError={() => setFailed(true)}
      />
    );
  }

  return <div className={`${className} ${fallbackClassName}`} aria-hidden="true" />;
}

export default EventBanner;
