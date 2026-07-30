import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ExternalLink, Download } from 'lucide-react';
import { generateGoogleCalendarLink, generateOutlookCalendarLink, downloadICSFile, } from '../calendarUtils';
/**
 * AddToCalendarDropdown component displays a dropdown button with options to:
 * - Add to Google Calendar (opens in new tab)
 * - Add to Outlook.com (opens in new tab)
 * - Download .ics file (works with Apple Calendar, Outlook desktop, etc.)
 *
 * Design uses The Helper tokens: Primary #2563EB, Border #E2E8F0
 */
export function AddToCalendarDropdown({ event, buttonText = 'Add to Calendar', className = '', }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);
    const handleGoogleClick = () => {
        window.open(generateGoogleCalendarLink(event), '_blank', 'noopener,noreferrer');
        setIsOpen(false);
    };
    const handleOutlookClick = () => {
        window.open(generateOutlookCalendarLink(event), '_blank', 'noopener,noreferrer');
        setIsOpen(false);
    };
    const handleICSDownload = () => {
        downloadICSFile(event, 'the-helper-appointment.ics');
        setIsOpen(false);
    };
    return (<div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center gap-1.5 rounded-[14px] border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-bold text-[#2563EB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-colors">
        <Calendar className="size-3.5"/>
        {buttonText}
        <ChevronDown className={`size-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
      </button>

      {isOpen && (<div className="absolute right-0 z-20 mt-1.5 w-48 rounded-[14px] border border-[#E2E8F0] bg-white shadow-lg">
          <div className="py-1">
            <button type="button" onClick={handleGoogleClick} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#0F172A] hover:bg-[#F8FAFC] transition-colors">
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path d="M6 12a6 6 0 106 6V6" stroke="#4285F4" strokeWidth="2" strokeLinecap="round"/>
                <path d="M18 12a6 6 0 10-6 6V6" stroke="#EA4335" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 6a6 6 0 106 6H6" stroke="#FBBC05" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 18a6 6 0 10-6-6h12" stroke="#34A853" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Google Calendar
              <ExternalLink className="ml-auto size-3 text-[#94A3B8]"/>
            </button>

            <button type="button" onClick={handleOutlookClick} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#0F172A] hover:bg-[#F8FAFC] transition-colors">
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="#0078D4" strokeWidth="2"/>
                <path d="M3 9l9 5 9-5" stroke="#0078D4" strokeWidth="2"/>
              </svg>
              Outlook.com
              <ExternalLink className="ml-auto size-3 text-[#94A3B8]"/>
            </button>

            <div className="mx-3 my-1 h-px bg-[#E2E8F0]"/>

            <button type="button" onClick={handleICSDownload} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#0F172A] hover:bg-[#F8FAFC] transition-colors">
              <Download className="size-4 text-[#475569]"/>
              Download .ics
            </button>
          </div>
        </div>)}
    </div>);
}
export default AddToCalendarDropdown;
