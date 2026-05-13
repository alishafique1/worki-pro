import React from "react";
import { Link } from "react-router";
import {
  useAction,
  useQuery,
  getProviderAppointments,
  markJobCompleted,
  updateProviderAppointment,
  sendProviderMessage,
} from "wasp/client/operations";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Send,
  UserRound,
} from "lucide-react";
import { useRoleGuard } from '../shared/useRoleGuard';

const formatStatus = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const toDateTimeLocal = (value?: string | Date | null) => {
  if (!value) return "";
  const date = new Date(value);
  const offsetDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  );
  return offsetDate.toISOString().slice(0, 16);
};

function ProviderMessageComposer({ requestId }: { requestId: string }) {
  const sendMessage = useAction(sendProviderMessage);
  const [body, setBody] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [sendError, setSendError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!body.trim()) return;
    setSendError(null);
    setIsSending(true);
    try {
      await sendMessage({ requestId, body });
      setBody("");
    } catch (error: any) {
      setSendError(error?.message || "Could not send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-4 space-y-1.5">
      {sendError && <p className="text-xs text-red-400">{sendError}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor={`provider-message-${requestId}`}>
          Message customer
        </label>
        <input
          id={`provider-message-${requestId}`}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Send an update to the customer..."
          maxLength={1000}
          className="min-w-0 flex-1 rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-base)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30"
        />
        <button
          type="submit"
          disabled={isSending || !body.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="size-4" /> {isSending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

function AppointmentCard({ appt }: { appt: any }) {
  const updateAppointment = useAction(updateProviderAppointment);
  const markCompletedFn = useAction(markJobCompleted);
  const [scheduledAt, setScheduledAt] = React.useState(
    toDateTimeLocal(appt.scheduledAt),
  );
  const [providerNotes, setProviderNotes] = React.useState(
    appt.providerNotes || "",
  );
  const [status, setStatus] = React.useState(appt.status || "PROPOSED");
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [completeError, setCompleteError] = React.useState<string | null>(null);
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
    } catch (error: any) {
      setSaveStatus('error');
      setSaveError(error?.message || "Could not update appointment.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    setCompleteError(null);
    try {
      await markCompletedFn({ appointmentId: appt.id });
      setCompleted(true);
    } catch (error: any) {
      setCompleteError(error?.message || "Error marking job complete.");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <article className="space-y-5 rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--surface-overlay)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              {formatStatus(appt.status)}
            </span>
            {request?.urgency && (
              <span className="rounded-full bg-[var(--surface-overlay)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                {request.urgency}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold leading-snug">
            {request?.description || "Customer request"}
          </h2>
          <div className="mt-3 grid gap-2 text-sm text-[var(--text-secondary)] sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <UserRound className="size-4" /> {request?.name || "Customer"}
            </p>
            <p className="flex items-center gap-2">
              <CalendarClock className="size-4" />{" "}
              {appt.scheduledAt
                ? new Date(appt.scheduledAt).toLocaleString()
                : "Pending scheduling"}
            </p>
          </div>
        </div>
        {!completed && (
          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-[#567a58] px-5 py-3 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="size-4" /> {isCompleting ? 'Completing…' : 'Mark Completed'}
            </button>
            {completeError && <p className="text-xs text-red-400 text-right">{completeError}</p>}
          </div>
        )}
        {completed && (
          <span className="px-4 py-2 rounded-full bg-[#567a58]/20 text-[#567a58] text-sm font-bold border border-[#567a58]/30">
            ✓ Completed
          </span>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-base)] p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold">
            <Clock3 className="size-4 text-[var(--accent)]" /> Booking controls
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-[var(--text-secondary)]">
              Appointment date and time
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) => setScheduledAt(event.target.value)}
                className="mt-2 w-full rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-raised)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30"
              />
            </label>
            <label className="block text-sm font-semibold text-[var(--text-secondary)]">
              Repair status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="mt-2 w-full rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-raised)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30"
              >
                <option value="PROPOSED">Proposed</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="RESCHEDULED">Rescheduled</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No show</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-[var(--text-secondary)]">
              Internal/provider notes
              <textarea
                rows={3}
                value={providerNotes}
                onChange={(event) => setProviderNotes(event.target.value)}
                className="mt-2 w-full resize-none rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-raised)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30"
                placeholder="Parts needed, arrival window, access notes..."
              />
            </label>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full rounded-[18px] bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save booking update"}
            </button>
            {saveStatus === 'success' && (
              <p className="text-xs text-green-400 text-center">✓ Appointment updated</p>
            )}
            {saveStatus === 'error' && saveError && (
              <p className="text-xs text-red-400 text-center">{saveError}</p>
            )}
          </div>
        </div>

        <div className="rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-base)] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold">
            <MessageSquareText className="size-4 text-[var(--accent)]" />{" "}
            Customer messages
          </div>
          <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">
                No customer messages yet. Send the first update after
                scheduling.
              </p>
            ) : (
              messages.map((message: any) => {
                const fromProvider = message.direction === "OUTBOUND";
                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      fromProvider ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[18px] px-4 py-3 text-sm ${
                        fromProvider
                          ? "bg-[var(--accent)] text-black"
                          : "bg-[var(--surface-raised)] text-foreground"
                      }`}
                    >
                      <p className="font-semibold">
                        {fromProvider ? "You" : message.from}
                      </p>
                      <p className="mt-1 leading-5">{message.body}</p>
                      <p className="mt-2 text-[10px] opacity-70">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {request?.id && <ProviderMessageComposer requestId={request.id} />}
        </div>
      </div>
    </article>
  );
}

export default function ProviderAppointmentsPage() {
  useRoleGuard('PROVIDER');
  const { data: appts, isLoading, error } = useQuery(getProviderAppointments);

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Bookings & Repairs
          </h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Set appointment details, update repair status, and message customers
            for accepted work.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/provider/dashboard"
            className="rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-raised)] px-4 py-2 text-sm font-bold hover:border-[var(--accent)]"
          >
            Dashboard
          </Link>
          <Link
            to="/provider/leads"
            className="rounded-[18px] bg-[var(--accent)] px-4 py-2 text-sm font-bold text-black"
          >
            View leads
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-6"
            >
              <div className="h-5 w-1/2 animate-pulse rounded bg-[var(--surface-overlay)]" />
              <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-[var(--surface-overlay)]" />
              <div className="mt-6 h-24 animate-pulse rounded-[18px] bg-[var(--surface-overlay)]" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-8">
          <p className="text-lg font-semibold">Appointments could not load</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Refresh the page and try again before updating bookings or sending
            messages.
          </p>
        </div>
      )}

      {!isLoading && !error && appts?.length === 0 && (
        <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-10 text-center text-[var(--text-secondary)]">
          <p className="font-semibold text-foreground">No appointments yet</p>
          <p className="mt-2 text-sm">
            Accepted leads will appear here so you can add schedule details and
            customer updates.
          </p>
          <Link
            to="/provider/leads"
            className="mt-4 inline-block text-sm font-bold text-[var(--accent)] hover:underline"
          >
            Open lead inbox →
          </Link>
        </div>
      )}

      {!error && !!appts?.length && (
        <div className="space-y-6">
          {appts.map((appt: any) => (
            <AppointmentCard key={appt.id} appt={appt} />
          ))}
        </div>
      )}
    </div>
  );
}
