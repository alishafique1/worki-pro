import React from 'react';
interface CalendarEvent {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    location?: string;
}
interface AddToCalendarDropdownProps {
    event: CalendarEvent;
    /** Optional custom button text */
    buttonText?: string;
    /** Optional CSS class for the wrapper */
    className?: string;
}
/**
 * AddToCalendarDropdown component displays a dropdown button with options to:
 * - Add to Google Calendar (opens in new tab)
 * - Add to Outlook.com (opens in new tab)
 * - Download .ics file (works with Apple Calendar, Outlook desktop, etc.)
 *
 * Design uses The Helper tokens: Primary #2563EB, Border #E2E8F0
 */
export declare function AddToCalendarDropdown({ event, buttonText, className, }: AddToCalendarDropdownProps): React.JSX.Element;
export default AddToCalendarDropdown;
