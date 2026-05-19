/**
 * Client-side calendar link generation utilities for The Helper.
 * Used to create "Add to Calendar" links for Google Calendar, Outlook, and .ics downloads.
 */
interface CalendarEventParams {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    location?: string;
}
/**
 * Generate a Google Calendar link for adding an event.
 * Opens in a new tab to create the event.
 */
export declare function generateGoogleCalendarLink(event: CalendarEventParams): string;
/**
 * Generate an Outlook.com calendar link for adding an event.
 * Opens in a new tab to create the event.
 */
export declare function generateOutlookCalendarLink(event: CalendarEventParams): string;
/**
 * Download an ICS file by creating a temporary link and clicking it.
 */
export declare function downloadICSFile(event: CalendarEventParams, filename?: string): void;
export {};
//# sourceMappingURL=calendarUtils.d.ts.map