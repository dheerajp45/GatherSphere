/** Field schemas reused across pages that display event data. */

export const PUBLIC_EVENT_LIST_FIELDS = [
  { key: "title", label: "Title" },
  {
    label: "Page",
    get: (e) => `/event/${e.slug}`,
  },
  { key: "slug", label: "Slug" },
  { key: "category", label: "Category" },
  { key: "date", label: "Date" },
  { key: "startTime", label: "Start" },
  { key: "endTime", label: "End" },
  { key: "eventType", label: "Type" },
  { key: "status", label: "Status" },
  { key: "capacity", label: "Capacity" },
];

export const HOST_EVENT_FIELDS = [
  ...PUBLIC_EVENT_LIST_FIELDS,
  { key: "registrationMode", label: "Registration mode" },
];

export const EVENT_DETAIL_FIELDS = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "category", label: "Category" },
  { key: "date", label: "Date" },
  { key: "startTime", label: "Start" },
  { key: "endTime", label: "End" },
  { key: "eventType", label: "Type" },
  { key: "status", label: "Status" },
  { key: "capacity", label: "Capacity" },
  { key: "registrationMode", label: "Registration mode" },
  { key: "venue", label: "Venue" },
  { key: "online", label: "Online" },
];

export const REGISTRATION_HOST_FIELDS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "organization", label: "Organization" },
  { key: "status", label: "Status" },
  { key: "attendanceStatus", label: "Attendance" },
];

export const MY_REGISTRATION_FIELDS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "attendanceStatus", label: "Attendance" },
  { key: "ticketToken", label: "Ticket token" },
  {
    key: "event",
    label: "Event",
    get: (r) => (r.event ? `${r.event.title} (${r.event.slug})` : null),
  },
];

export const DASHBOARD_STATS_FIELDS = [
  { key: "eventsHosted", label: "Events hosted" },
  { key: "upcomingEvents", label: "Upcoming events" },
  { key: "totalRegistrations", label: "Total registrations" },
];

export const TICKET_FIELDS = [
  { key: "name", label: "Attendee" },
  { key: "eventTitle", label: "Event" },
  { key: "ticketToken", label: "Ticket token" },
  {
    key: "checkedInAt",
    label: "Checked in",
    get: (t) =>
      t.checkedInAt
        ? new Date(t.checkedInAt).toLocaleString()
        : "Not checked in yet",
  },
];
