import React from "react";
import { Link } from "react-router";
import { useAction, useQuery, getProviderAppointments, markJobCompleted, updateProviderAppointment, sendProviderMessage, } from "wasp/client/operations";
import { CalendarClock, CheckCircle2, Clock3, MessageSquareText, Send, UserRound, } from "lucide-react";
import { useRoleGuard } from '../shared/useRoleGuard';
import { AddToCalendarDropdown } from "../client/components/AddToCalendarDropdown";
const formatStatus = (s) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const toDateTimeLocal = (value) => {
    if (!value)
        return "";
    const date = new Date(value);
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 16);
};
function ProviderMessageComposer({ requestId }) {
    const sendMessage = useAction(sendProviderMessage);
    const [body, setBody] = React.useState("");
    const [isSending, setIsSending] = React.useState(false);
    const [sendError, setSendError] = React.useState(null);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!body.trim())
            return;
        setSendError(null);
        setIsSending(true);
        try {
            await sendMessage({ requestId, body });
            setBody("");
        }
        catch (error) {
            setSendError(error?.message || "Could not send message. Please try again.");
        }
        finally {
            setIsSending(false);
        }
    };
    return (<div className="mt-4 space-y-1.5">
      {sendError && <p className="text-xs text-red-600">{sendError}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor={`provider-message-${requestId}`}>
          Message customer
        </label>
        <input id={`provider-message-${requestId}`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Send an update to the customer..." maxLength={1000} className="min-w-0 flex-1 rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A] placeholder:text-[#94A3B8]"/>
        <button type="submit" disabled={isSending || !body.trim()} className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors disabled:cursor-not-allowed disabled:opacity-50">
          <Send className="size-4"/> {isSending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>);
}
function AppointmentCard({ appt }) {
    const updateAppointment = useAction(updateProviderAppointment);
    const markCompletedFn = useAction(markJobCompleted);
    const [scheduledAt, setScheduledAt] = React.useState(toDateTimeLocal(appt.scheduledAt));
    const [providerNotes, setProviderNotes] = React.useState(appt.providerNotes || "");
    const [status, setStatus] = React.useState(appt.status || "PROPOSED");
    const [isSaving, setIsSaving] = React.useState(false);
    const [saveStatus, setSaveStatus] = React.useState('idle');
    const [saveError, setSaveError] = React.useState(null);
    const [completeError, setCompleteError] = React.useState(null);
    const [isCompleting, setIsCompleting] = React.useState(false);
    const [completed, setCompleted] = React.useState(appt.status === 'COMPLETED');
    const request = appt.serviceRequest;
    const messages = request?.communicationLogs || [];
    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        setSaveError(null);
        try {
            await updateAppointment({
                appointmentId: appt.id,
                scheduledAt: scheduledAt || undefined,
                status,
                providerNotes,
            });
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
        catch (error) {
            setSaveStatus('error');
            setSaveError(error?.message || "Could not update appointment.");
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleComplete = async () => {
        setIsCompleting(true);
        setCompleteError(null);
        try {
            await markCompletedFn({ appointmentId: appt.id });
            setCompleted(true);
        }
        catch (error) {
            setCompleteError(error?.message || "Error marking job complete.");
        }
        finally {
            setIsCompleting(false);
        }
    };
    return (<article className="space-y-5 rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#2563EB] border border-[#BFDBFE]">
              {formatStatus(appt.status)}
            </span>
            {request?.urgency && (<span className="rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#475569] border border-[#E2E8F0]">
                {request.urgency}
              </span>)}
          </div>
          <h2 className="text-xl font-bold leading-snug text-[#0F172A]">
            {request?.description || "Customer request"}
          </h2>
          <div className="mt-3 grid gap-2 text-sm text-[#475569] sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <UserRound className="size-4"/> {request?.name || "Customer"}
            </p>
            <p className="flex items-center gap-2">
              <CalendarClock className="size-4"/>{" "}
              {appt.scheduledAt
            ? new Date(appt.scheduledAt).toLocaleString()
            : "Pending scheduling"}
            </p>
          </div>
          {appt.scheduledAt && ['CONFIRMED', 'RESCHEDULED', 'PROPOSED'].includes(appt.status) && (<div className="mt-3">
              <AddToCalendarDropdown event={{
                title: `${request?.serviceCategory?.name || 'Service'} - ${request?.name || 'Customer'}`,
                description: `${request?.description || 'Service appointment'}\n\nCustomer: ${request?.name || 'N/A'}${request?.phone ? `\nPhone: ${request.phone}` : ''}\n\nBooked via The Helper`,
                startTime: new Date(appt.scheduledAt),
                endTime: new Date(new Date(appt.scheduledAt).getTime() + 60 * 60 * 1000),
                location: [request?.city, request?.postalCode].filter(Boolean).join(', ') || undefined,
            }}/>
            </div>)}
        </div>
        {!completed && (<div className="flex flex-col items-end gap-1.5">
            <button onClick={handleComplete} disabled={isCompleting} className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-[#22C55E] px-5 py-3 text-sm font-bold text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <CheckCircle2 className="size-4"/> {isCompleting ? 'Completing…' : 'Mark Completed'}
            </button>
            {completeError && <p className="text-xs text-red-600 text-right">{completeError}</p>}
          </div>)}
        {completed && (<span className="px-4 py-2 rounded-full bg-[#F0FDF4] text-[#15803D] text-sm font-bold border border-green-200">
            ✓ Completed
          </span>)}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#0F172A]">
            <Clock3 className="size-4 text-[#2563EB]"/> Booking controls
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-[#475569]">
              Appointment date and time
              <input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className="mt-2 w-full rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]"/>
            </label>
            <label className="block text-sm font-semibold text-[#475569]">
              Repair status
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 w-full rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]">
                <option value="PROPOSED">Proposed</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="RESCHEDULED">Rescheduled</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No show</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-[#475569]">
              Internal/provider notes
              <textarea rows={3} value={providerNotes} onChange={(event) => setProviderNotes(event.target.value)} className="mt-2 w-full resize-none rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A] placeholder:text-[#94A3B8]" placeholder="Parts needed, arrival window, access notes..."/>
            </label>
            <button onClick={handleSave} disabled={isSaving} className="w-full rounded-[18px] bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors disabled:cursor-not-allowed disabled:opacity-50">
              {isSaving ? "Saving..." : "Save booking update"}
            </button>
            {saveStatus === 'success' && (<p className="text-xs text-[#15803D] text-center">✓ Appointment updated</p>)}
            {saveStatus === 'error' && saveError && (<p className="text-xs text-red-600 text-center">{saveError}</p>)}
          </div>
        </div>

        <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0F172A]">
            <MessageSquareText className="size-4 text-[#2563EB]"/>{" "}
            Customer messages
          </div>
          <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 ? (<p className="text-sm text-[#475569]">
                No customer messages yet. Send the first update after
                scheduling.
              </p>) : (messages.map((message) => {
            const fromProvider = message.direction === "OUTBOUND";
            return (<div key={message.id} className={`flex ${fromProvider ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-[18px] px-4 py-3 text-sm ${fromProvider
                    ? "bg-[#2563EB] text-white"
                    : "bg-white border border-[#E2E8F0] text-[#0F172A]"}`}>
                      <p className="font-semibold">
                        {fromProvider ? "You" : message.from}
                      </p>
                      <p className="mt-1 leading-5">{message.body}</p>
                      <p className={`mt-2 text-[10px] opacity-70 ${fromProvider ? 'text-white' : 'text-[#475569]'}`}>
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>);
        }))}
          </div>
          {request?.id && <ProviderMessageComposer requestId={request.id}/>}
        </div>
      </div>
    </article>);
}
export default function ProviderAppointmentsPage() {
    useRoleGuard('PROVIDER');
    const { data: appts, isLoading, error } = useQuery(getProviderAppointments);
    return (<div className="mx-auto max-w-6xl space-y-8 p-8 bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#0F172A]">
            Bookings & Repairs
          </h1>
          <p className="mt-2 text-[#475569]">
            Set appointment details, update repair status, and message customers
            for accepted work.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/provider/dashboard" className="rounded-[18px] border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-bold text-[#0F172A] hover:border-[#2563EB] transition-colors">
            Dashboard
          </Link>
          <Link to="/provider/leads" className="rounded-[18px] bg-[#2563EB] px-4 py-2 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors">
            View leads
          </Link>
        </div>
      </div>

      {isLoading && (<div className="space-y-4">
          {[0, 1].map((item) => (<div key={item} className="rounded-[24px] border border-[#E2E8F0] bg-white p-6">
              <div className="h-5 w-1/2 animate-pulse rounded bg-[#EFF6FF]"/>
              <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-[#EFF6FF]"/>
              <div className="mt-6 h-24 animate-pulse rounded-[18px] bg-[#EFF6FF]"/>
            </div>))}
        </div>)}

      {!isLoading && error && (<div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8">
          <p className="text-lg font-semibold text-[#0F172A]">Appointments could not load</p>
          <p className="mt-2 text-sm text-[#475569]">
            Refresh the page and try again before updating bookings or sending
            messages.
          </p>
        </div>)}

      {!isLoading && !error && appts?.length === 0 && (<div className="rounded-[24px] border border-[#E2E8F0] bg-white p-10 text-center text-[#475569]">
          <p className="font-semibold text-[#0F172A]">No appointments yet</p>
          <p className="mt-2 text-sm">
            Accepted leads will appear here so you can add schedule details and
            customer updates.
          </p>
          <Link to="/provider/leads" className="mt-4 inline-block text-sm font-bold text-[#2563EB] hover:underline">
            Open lead inbox →
          </Link>
        </div>)}

      {!error && !!appts?.length && (<div className="space-y-6">
          {appts.map((appt) => (<AppointmentCard key={appt.id} appt={appt}/>))}
        </div>)}
    </div>);
}
//# sourceMappingURL=AppointmentsPage.jsx.map