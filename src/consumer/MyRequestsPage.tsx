import React from "react";
import { Link } from "wasp/client/router";
import {
  useAction,
  useQuery,
  getMyRequests,
  sendCustomerMessage,
} from "wasp/client/operations";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Send,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const statusColor = (s: string) => {
  if (["COMPLETED", "REWARD_APPROVED"].includes(s))
    return "bg-[#567a58] text-white";
  if (["BOOKED", "ACCEPTED_BY_PROVIDER"].includes(s))
    return "bg-blue-900/50 text-blue-300";
  if (["NEW", "QUALIFYING", "QUALIFIED", "ASSIGNED"].includes(s))
    return "bg-[var(--surface-overlay)] text-[var(--accent)]";
  if (["LOST", "INVALID", "SPAM", "CLOSED"].includes(s))
    return "bg-[var(--surface-overlay)] text-[var(--text-tertiary)]";
  return "bg-[var(--surface-overlay)] text-[var(--text-secondary)]";
};

const urgencyStyle = (u: string) => {
  if (u === "EMERGENCY") return "bg-red-900/40 text-red-300";
  if (u === "PLANNED")
    return "bg-[var(--surface-overlay)] text-[var(--text-tertiary)]";
  return "bg-[var(--surface-overlay)] text-[var(--text-secondary)]";
};

const formatStatus = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (value?: string | Date | null) => {
  if (!value) return "Not scheduled yet";
  return new Date(value).toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function RequestTimeline({ status }: { status: string }) {
  const steps = [
    { key: "NEW", label: "Request received" },
    { key: "ASSIGNED", label: "Provider matched" },
    { key: "BOOKED", label: "Booking confirmed" },
    { key: "COMPLETED", label: "Repair completed" },
  ];
  const rank = [
    "NEW",
    "QUALIFYING",
    "QUALIFIED",
    "ASSIGNED",
    "ACCEPTED_BY_PROVIDER",
    "BOOKED",
    "COMPLETED",
  ].indexOf(status);

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {steps.map((step, index) => {
        const stepRank = ["NEW", "ASSIGNED", "BOOKED", "COMPLETED"].indexOf(
          step.key,
        );
        const done = rank >= stepRank;
        return (
          <div key={step.key} className="flex items-center gap-2 text-xs">
            <span
              className={`flex size-6 items-center justify-center rounded-full ${
                done
                  ? "bg-[var(--accent)] text-black"
                  : "bg-[var(--surface-overlay)] text-[var(--text-secondary)]"
              }`}
            >
              {done ? <CheckCircle2 className="size-3.5" /> : index + 1}
            </span>
            <span
              className={
                done
                  ? "font-semibold text-foreground"
                  : "text-[var(--text-secondary)]"
              }
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MessageComposer({ requestId }: { requestId: string }) {
  const sendMessage = useAction(sendCustomerMessage);
  const [body, setBody] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!body.trim()) return;
    setIsSending(true);
    try {
      await sendMessage({ requestId, body });
      setBody("");
    } catch (error: any) {
      alert(error?.message || "Could not send message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col gap-3 sm:flex-row"
    >
      <label className="sr-only" htmlFor={`message-${requestId}`}>
        Message provider
      </label>
      <input
        id={`message-${requestId}`}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Ask a question or share an update..."
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
  );
}

function RequestCard({ req }: { req: any }) {
  const appointment = req.appointments?.[0];
  const provider = appointment?.provider || req.assignedProvider;
  const messages = req.communicationLogs || [];

  return (
    <article className="space-y-5 rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="min-w-0">
          <p className="text-sm font-medium leading-snug text-[var(--text-primary)] md:text-base">
            {req.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor(
                req.status,
              )}`}
            >
              {formatStatus(req.status)}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${urgencyStyle(
                req.urgency,
              )}`}
            >
              {req.urgency.charAt(0) + req.urgency.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
        <div className="rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-base)] p-4 md:min-w-[260px]">
          <div className="flex items-center gap-2 text-sm font-bold">
            <CalendarClock className="size-4 text-[var(--accent)]" /> Booking
          </div>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {formatDate(appointment?.scheduledAt)}
          </p>
          {appointment?.status && (
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              Appointment status: {formatStatus(appointment.status)}
            </p>
          )}          {!appointment?.scheduledAt &&
            ['ASSIGNED', 'ACCEPTED_BY_PROVIDER', 'QUALIFIED'].includes(req.status) && (
              <a
                href={`/book/${req.id}`}
                className="mt-3 inline-flex items-center gap-1.5 rounded-[14px] bg-[var(--accent)] px-3 py-2 text-xs font-bold text-black hover:opacity-90 transition-opacity"
              >
                📅 Book Appointment
              </a>
            )}        </div>
      </div>

      <RequestTimeline status={req.status} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-base)] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold">
            <ShieldCheck className="size-4 text-[var(--accent)]" /> Provider
          </div>
          {provider ? (
            <div className="space-y-1 text-sm text-[var(--text-secondary)]">
              <p className="font-semibold text-foreground">
                {provider.businessName}
              </p>
              {provider.phone && <p>{provider.phone}</p>}
              {provider.email && <p>{provider.email}</p>}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">
              We are still matching your request with the right local provider.
            </p>
          )}
        </div>
        <div className="rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-base)] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold">
            <Clock3 className="size-4 text-[var(--accent)]" /> Request details
          </div>
          <div className="space-y-1 text-sm text-[var(--text-secondary)]">
            <p>Requested {new Date(req.createdAt).toLocaleDateString()}</p>
            {(req.city || req.postalCode) && (
              <p>{[req.city, req.postalCode].filter(Boolean).join(", ")}</p>
            )}
            {req.estimatedSchedule && (
              <p>Timeline: {req.estimatedSchedule.replace(/_/g, " ")}</p>
            )}
            {req.preferredTime && (
              <p>Best contact time: {req.preferredTime.replace(/_/g, " ")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-base)] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold">
          <MessageSquareText className="size-4 text-[var(--accent)]" /> Messages
        </div>
        <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">
              No messages yet. Once a provider is assigned, you can coordinate
              here.
            </p>
          ) : (
            messages.map((message: any) => {
              const fromCustomer = message.direction === "INBOUND";
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    fromCustomer ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-[18px] px-4 py-3 text-sm ${
                      fromCustomer
                        ? "bg-[var(--accent)] text-black"
                        : "bg-[var(--surface-raised)] text-foreground"
                    }`}
                  >
                    <p className="font-semibold">
                      {fromCustomer ? "You" : message.from}
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
        <MessageComposer requestId={req.id} />
      </div>
    </article>
  );
}

export default function MyRequestsPage() {
  const { data: requests, isLoading, error } = useQuery(getMyRequests);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My Bookings & Repairs
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Track service request status, booking details, and messages in one
            place.
          </p>
        </div>
        <Link
          to="/request-service"
          className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black"
        >
          <Wrench className="size-4" /> Request Service
        </Link>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-5"
            >
              <div className="h-5 w-1/2 animate-pulse rounded bg-[var(--surface-overlay)]" />
              <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-[var(--surface-overlay)]" />
              <div className="mt-6 h-16 animate-pulse rounded-[18px] bg-[var(--surface-overlay)]" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-8">
          <p className="text-lg font-semibold">Requests could not load</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Refresh the page and try again. If this keeps happening, contact
            Worki support with the email on your account.
          </p>
        </div>
      )}

      {!isLoading && !error && !requests?.length && (
        <div className="flex flex-col items-center space-y-3 rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-12 text-center">
          <Wrench className="size-10 text-[var(--accent)]" />
          <p className="text-lg font-semibold">No service requests yet</p>
          <p className="text-sm text-[var(--text-tertiary)]">
            Submit your first request to start tracking booking updates and
            messages.
          </p>
          <Link
            to="/request-service"
            className="mt-2 rounded-[22px] bg-[var(--accent)] px-6 py-2.5 text-sm font-bold text-black"
          >
            Request a Service
          </Link>
        </div>
      )}

      {!error && !!requests?.length && (
        <div className="space-y-5">
          {requests.map((req: any) => (
            <RequestCard key={req.id} req={req} />
          ))}
        </div>
      )}
    </div>
  );
}
