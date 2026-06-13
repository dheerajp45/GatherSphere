function StatusBadge({ status }) {
    const styles = {
      pending: {
        backgroundColor: "#FEF3C7",
        color: "#92400E",
      },
      approved: {
        backgroundColor: "#D1FAE5",
        color: "#065F46",
      },
      waitlisted: {
        backgroundColor: "#DBEAFE",
        color: "#1E40AF",
      },
      rejected: {
        backgroundColor: "#FEE2E2",
        color: "#991B1B",
      },
      cancelled: {
        backgroundColor: "#FCE7F3",
        color: "#9D174D",
      },
    };
  
    const badgeStyle = styles[status?.toLowerCase()] || {
      backgroundColor: "#E0E7FF",
      color: "#3730A3",
    };
  
    return (
      <span
        style={{
          ...badgeStyle,
          padding: "4px 10px",
          borderRadius: "9999px",
          fontSize: "0.875rem",
          fontWeight: "600",
          display: "inline-block",
          textTransform: "capitalize",
        }}
      >
        {status}
      </span>
    );
  }
  
  export  default StatusBadge