/**
 * Client-side calendar link generation utilities for The Helper.
 * Used to create "Add to Calendar" links for Google Calendar, Outlook, and .ics downloads.
 */
/**
 * Format a Date to Google Calendar format (YYYYMMDDTHHmmssZ)
 */
function formatGoogleDate(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}
/**
 * Generate a Google Calendar link for adding an event.
 * Opens in a new tab to create the event.
 */
export function generateGoogleCalendarLink(event) {
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
 * Generate an Outlook.com calendar link for adding an event.
 * Opens in a new tab to create the event.
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
 * Generate an ICS file content string for downloading.
 */
function generateICSContent(event) {
    const formatICSDateTime = (date) => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    };
    const escapeICSText = (text) => {
        return text
            .replace(/\\/g, '\\\\')
            .replace(/;/g, '\\;')
            .replace(/,/g, '\\,')
            .replace(/\n/g, '\\n');
    };
    const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}@thehelper.ca`;
    const dtstamp = formatICSDateTime(new Date());
    const dtstart = formatICSDateTime(event.startTime);
    const dtend = formatICSDateTime(event.endTime);
    // VTIMEZONE for America/Toronto (Eastern Time)
    const vtimezone = `BEGIN:VTIMEZONE
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
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//The Helper//thehelper.ca//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        vtimezone,
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${dtstart}`,
        `DTEND:${dtend}`,
        `SUMMARY:${escapeICSText(event.title)}`,
        `DESCRIPTION:${escapeICSText(event.description)}`,
    ];
    if (event.location) {
        lines.push(`LOCATION:${escapeICSText(event.location)}`);
    }
    lines.push('STATUS:CONFIRMED', 'SEQUENCE:0', 'END:VEVENT', 'END:VCALENDAR');
    return lines.join('\r\n');
}
/**
 * Download an ICS file by creating a temporary link and clicking it.
 */
export function downloadICSFile(event, filename = 'appointment.ics') {
    const icsContent = generateICSContent(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Clean up the object URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 100);
}
//# sourceMappingURL=calendarUtils.js.map