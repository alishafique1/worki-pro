/**
 * ICS calendar file generation for The Helper appointments.
 * Generates RFC 5545 compliant .ics files with VTIMEZONE for America/Toronto.
 */
/**
 * Format a Date to ICS datetime string (YYYYMMDDTHHmmss)
 */
function formatICSDateTime(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}
/**
 * Generate a unique identifier for the calendar event
 */
function generateUID() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}@thehelper.ca`;
}
/**
 * Escape special characters in ICS text fields
 */
function escapeICSText(text) {
    return text
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
}
/**
 * VTIMEZONE component for America/Toronto (Eastern Time)
 * Includes both EST (standard) and EDT (daylight saving) rules
 */
const VTIMEZONE_TORONTO = `BEGIN:VTIMEZONE
TZID:America/Toronto
X-LIC-LOCATION:America/Toronto
BEGIN:DAYLIGHT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:EDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:EST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE`;
/**
 * Generates a valid .ics file string that can be attached to emails.
 * The event uses UTC times and includes the America/Toronto timezone definition
 * for proper display in calendar applications.
 */
export function generateICS(event) {
    const uid = generateUID();
    const dtstamp = formatICSDateTime(new Date());
    const dtstart = formatICSDateTime(event.startTime);
    const dtend = formatICSDateTime(event.endTime);
    const summary = escapeICSText(event.title);
    const description = escapeICSText(event.description);
    const location = event.location ? escapeICSText(event.location) : '';
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//The Helper//thehelper.ca//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:REQUEST',
        VTIMEZONE_TORONTO,
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${dtstart}`,
        `DTEND:${dtend}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
    ];
    if (location) {
        lines.push(`LOCATION:${location}`);
    }
    lines.push(`ORGANIZER;CN=The Helper:mailto:${event.organizerEmail}`, `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=FALSE;CN=${event.attendeeEmail}:mailto:${event.attendeeEmail}`, 'STATUS:CONFIRMED', 'SEQUENCE:0', 'END:VEVENT', 'END:VCALENDAR');
    return lines.join('\r\n');
}
/**
 * Generate a Google Calendar link for adding an event
 * Format: https://calendar.google.com/calendar/render?action=TEMPLATE&text={title}&dates={start}/{end}&details={description}&location={location}
 */
export function generateGoogleCalendarLink(event) {
    // Google Calendar expects dates in YYYYMMDDTHHmmssZ format
    const formatGoogleDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        dates: `${formatGoogleDate(event.startTime)}/${formatGoogleDate(event.endTime)}`,
        details: event.description,
    });
    if (event.location) {
        params.set('location', event.location);
    }
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
/**
 * Generate an Outlook.com calendar link for adding an event
 * Format: https://outlook.live.com/calendar/0/deeplink/compose?subject={title}&startdt={isoStart}&enddt={isoEnd}&body={description}
 */
export function generateOutlookCalendarLink(event) {
    const params = new URLSearchParams({
        subject: event.title,
        startdt: event.startTime.toISOString(),
        enddt: event.endTime.toISOString(),
        body: event.description,
        path: '/calendar/action/compose',
    });
    if (event.location) {
        params.set('location', event.location);
    }
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
/**
 * Generate a data URI for downloading an .ics file directly in the browser
 */
export function generateICSDataUri(icsContent) {
    const base64 = Buffer.from(icsContent).toString('base64');
    return `data:text/calendar;base64,${base64}`;
}
//# sourceMappingURL=calendar.js.map