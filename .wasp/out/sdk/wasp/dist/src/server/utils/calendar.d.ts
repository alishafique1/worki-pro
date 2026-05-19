/**
 * ICS calendar file generation for The Helper appointments.
 * Generates RFC 5545 compliant .ics files with VTIMEZONE for America/Toronto.
 */
interface CalendarEvent {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    organizerEmail: string;
    attendeeEmail: string;
}
/**
 * Generates a valid .ics file string that can be attached to emails.
 * The event uses UTC times and includes the America/Toronto timezone definition
 * for proper display in calendar applications.
 */
export declare function generateICS(event: CalendarEvent): string;
/**
 * Generate a Google Calendar link for adding an event
 * Format: https://calendar.google.com/calendar/render?action=TEMPLATE&text={title}&dates={start}/{end}&details={description}&location={location}
 */
export declare function generateGoogleCalendarLink(event: {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    location?: string;
}): string;
/**
 * Generate an Outlook.com calendar link for adding an event
 * Format: https://outlook.live.com/calendar/0/deeplink/compose?subject={title}&startdt={isoStart}&enddt={isoEnd}&body={description}
 */
export declare function generateOutlookCalendarLink(event: {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    location?: string;
}): string;
/**
 * Generate a data URI for downloading an .ics file directly in the browser
 */
export declare function generateICSDataUri(icsContent: string): string;
export {};
//# sourceMappingURL=calendar.d.ts.map