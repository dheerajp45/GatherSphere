function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function baseLayout({ preheader, title, bodyHtml, ctaLabel, ctaHref }) {
  const safeTitle = escapeHtml(title);
  const safePreheader = escapeHtml(preheader);

  const ctaBlock =
    ctaLabel && ctaHref
      ? `
        <tr>
          <td style="padding: 0 32px 32px;">
            <a href="${escapeHtml(ctaHref)}" style="display: inline-block; background-color: #171717; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px;">
              ${escapeHtml(ctaLabel)}
            </a>
          </td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${safePreheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; overflow: hidden;">
            <tr>
              <td style="padding: 28px 32px 12px;">
                <p style="margin: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #737373;">GatherSphere</p>
                <h1 style="margin: 12px 0 0; font-size: 24px; line-height: 1.3; color: #171717;">${safeTitle}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 32px 24px; font-size: 15px; line-height: 1.6; color: #404040;">
                ${bodyHtml}
              </td>
            </tr>
            ${ctaBlock}
            <tr>
              <td style="padding: 0 32px 28px; font-size: 12px; line-height: 1.5; color: #737373;">
                You received this email because of activity on GatherSphere.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function registrationReceivedEmail({ eventTitle, status, ticketUrl }) {
  const safeEvent = escapeHtml(eventTitle);
  let message = `Thanks for registering for <strong>${safeEvent}</strong>.`;
  let textExtra = "";

  if (status === "waitlisted") {
    message += "<br /><br />You are on the <strong>waitlist</strong>. We will email you if a spot opens up.";
    textExtra = " You are on the waitlist.";
  } else if (status === "pending") {
    message += "<br /><br />Your registration is <strong>pending</strong> host approval.";
    textExtra = " Your registration is pending approval.";
  } else if (status === "approved" && ticketUrl) {
    message += "<br /><br />You are <strong>approved</strong>. Your ticket is ready.";
    textExtra = ` Your ticket: ${ticketUrl}`;
  }

  const subject = `Registration received — ${eventTitle}`;
  const text = `Registration received for "${eventTitle}".${textExtra}${ticketUrl ? `\nTicket: ${ticketUrl}` : ""}`;
  const html = baseLayout({
    preheader: `Registration received for ${eventTitle}`,
    title: "Registration received",
    bodyHtml: `<p style="margin: 0 0 16px;">${message}</p>`,
    ctaLabel: ticketUrl ? "View your ticket" : undefined,
    ctaHref: ticketUrl,
  });

  return { subject, text, html };
}

function registrationApprovedEmail({ eventTitle, ticketUrl, fromWaitlist = false }) {
  const safeEvent = escapeHtml(eventTitle);
  const intro = fromWaitlist
    ? `A spot opened up for <strong>${safeEvent}</strong>. You have been approved.`
    : `You have been approved for <strong>${safeEvent}</strong>.`;

  const subject = `Registration approved — ${eventTitle}`;
  const text = `${fromWaitlist ? "A spot opened up. " : ""}You are approved for "${eventTitle}".\nTicket: ${ticketUrl}`;
  const html = baseLayout({
    preheader: `You are approved for ${eventTitle}`,
    title: "You're approved",
    bodyHtml: `<p style="margin: 0 0 16px;">${intro}</p><p style="margin: 0;">Your digital ticket is ready below.</p>`,
    ctaLabel: "View your ticket",
    ctaHref: ticketUrl,
  });

  return { subject, text, html };
}

function registrationRejectedEmail({ eventTitle }) {
  const safeEvent = escapeHtml(eventTitle);
  const subject = `Registration not approved — ${eventTitle}`;
  const text = `Your registration for "${eventTitle}" was not approved.`;
  const html = baseLayout({
    preheader: `Update on your registration for ${eventTitle}`,
    title: "Registration not approved",
    bodyHtml: `<p style="margin: 0;">Your registration for <strong>${safeEvent}</strong> was not approved.</p>`,
  });

  return { subject, text, html };
}

function registrationCancelledEmail({ eventTitle }) {
  const safeEvent = escapeHtml(eventTitle);
  const subject = `Registration cancelled — ${eventTitle}`;
  const text = `Your registration for "${eventTitle}" has been cancelled.`;
  const html = baseLayout({
    preheader: `Registration cancelled for ${eventTitle}`,
    title: "Registration cancelled",
    bodyHtml: `<p style="margin: 0;">Your registration for <strong>${safeEvent}</strong> has been cancelled.</p>`,
  });

  return { subject, text, html };
}

function registrationsClosedEmail({ eventTitle }) {
  const safeEvent = escapeHtml(eventTitle);
  const subject = `Registrations closed — ${eventTitle}`;
  const text = `Registrations for "${eventTitle}" are now closed. Your registration was not approved.`;
  const html = baseLayout({
    preheader: `Registrations closed for ${eventTitle}`,
    title: "Registrations closed",
    bodyHtml: `<p style="margin: 0;">Registrations for <strong>${safeEvent}</strong> are now closed. Your registration was not approved.</p>`,
  });

  return { subject, text, html };
}

export {
  registrationReceivedEmail,
  registrationApprovedEmail,
  registrationRejectedEmail,
  registrationCancelledEmail,
  registrationsClosedEmail,
};
