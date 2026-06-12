import React from "react";
import { Link } from 'react-router';
import {
  useAction,
  useQuery,
  getMyRequests,
  sendCustomerMessage,
} from "wasp/client/operations";
import { useRoleGuard } from '../shared/useRoleGuard';
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Send,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { AddToCalendarDropdown } from "../client/components/AddToCalendarDropdown";

const statusColor = (s: string) => {
  if (["COMPLETED", "REWARD_APPROVED"].includes(s))
    return "bg-[#F0FDF4] text-[#15803D] border border-green-200";
  if (["BOOKED", "ACCEPTED_BY_PROVIDER"].includes(s))
    return "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]";
  if (["NEW", "QUALIFYING", "QUALIFIED", "ASSIGNED"].includes(s))
    return "bg-[#FEF3C7] text-amber-700 border border-[#FDE68A]";
  if (["LOST", "INVALID", "SPAM", "CLOSED"].includes(s))
    return "bg-[#FEF2F2] text-red-600 border border-red-200";
  return "bg-[#FEF3C7] text-amber-700 border border-[#FDE68A]";
};

const urgencyStyle = (u: string) => {
  if (u === "EMERGENCY") return "bg-red-50 text-red-600 border border-red-200";
  if (u === "URGENT") return "bg-amber-50 text-amber-700 border border-amber-200";
  if (u === "SOON") return "bg-blue-50 text-blue-600 border border-blue-200";
  if (u === "PLANNED") return "bg-slate-50 text-slate-500 border border-slate-200";
  return "bg-slate-50 text-slate-500 border border-slate-200";
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
                  ? "bg-[#2563EB] text-white"
                  : "bg-[#F8FAFC] text-[#94A3B8] border border-[#E2E8F0]"
              }`}
            >
              {done ? <CheckCircle2 className="size-3.5" /> : index + 1}
            </span>
            <span
              className={
                done
                  ? "font-semibold text-[#0F172A]"
                  : "text-[#94A3B8]"
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
    <div className="mt-4 space-y-2">
      {sendError && (
        <p className="text-xs text-red-600 px-1">{sendError}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor={`message-${requestId}`}>
          Message provider
        </label>
        <input
          id={`message-${requestId}`}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Ask a question or share an update..."
          maxLength={1000}
          className="min-w-0 flex-1 rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30"
        />
        <button
          type="submit"
          disabled={isSending || !body.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="size-4" /> {isSending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

function RequestCard({ req }: { req: any }) {
  const appointment = req.appointments?.[0];
  const provider = appointment?.provider || req.assignedProvider;
  const messages = req.communicationLogs || [];

  return (
    <article className="space-y-5 rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      {/* Floating detail link */}
      <div className="flex justify-end">
        <Link
          to={`/my-requests/${req.id}` as any}
          className="text-xs font-bold text-[#2563EB] hover:underline"
        >
          Open details →
        </Link>
      </div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="min-w-0">
          <p className="text-sm font-medium leading-snug text-[#0F172A] md:text-base">
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
        <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 md:min-w-[260px]">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
            <CalendarClock className="size-4 text-[#2563EB]" /> Booking
          </div>
          <p className="mt-2 text-sm text-[#475569]">
            {formatDate(appointment?.scheduledAt)}
          </p>
          {appointment?.status && (
            <p className="mt-1 text-xs text-[#94A3B8]">
              Appointment status: {formatStatus(appointment.status)}
            </p>
          )}
          {appointment?.scheduledAt && ['CONFIRMED', 'BOOKED', 'RESCHEDULED'].includes(appointment.status) && (
            <div className="mt-3">
              <AddToCalendarDropdown
                event={{
                  title: `${req.serviceCategory?.name || 'Service'} Appointment - The Helper`,
                  description: `${req.description}${provider ? `\n\nProvider: ${provider.businessName}${provider.phone ? `\nPhone: ${provider.phone}` : ''}` : ''}`,
                  startTime: new Date(appointment.scheduledAt),
                  endTime: new Date(new Date(appointment.scheduledAt).getTime() + 60 * 60 * 1000),
                  location: [req.city, req.postalCode].filter(Boolean).join(', ') || undefined,
                }}
              />
            </div>
          )}
          {!appointment?.scheduledAt &&
            ['ASSIGNED', 'ACCEPTED_BY_PROVIDER', 'QUALIFIED'].includes(req.status) && (
              <a
                href={`/book/${req.id}`}
                className="mt-3 inline-flex items-center gap-1.5 rounded-[14px] bg-[#2563EB] px-3 py-2 text-xs font-bold text-white hover:bg-[#1D4ED8] transition-colors"
              >
                Book Appointment
              </a>
            )}
        </div>
      </div>

      <RequestTimeline status={req.status} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#0F172A]">
            <ShieldCheck className="size-4 text-[#2563EB]" /> Provider
          </div>
          {provider ? (
            <div className="space-y-1 text-sm text-[#475569]">
              <p className="font-semibold text-[#0F172A]">
                {provider.businessName}
              </p>
              {provider.phone && <p>{provider.phone}</p>}
              {provider.email && <p>{provider.email}</p>}
            </div>
          ) : (
            <p className="text-sm text-[#475569]">
              We are still matching your request with the right local provider.
            </p>
          )}
        </div>
        <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#0F172A]">
            <Clock3 className="size-4 text-[#2563EB]" /> Request details
          </div>
          <div className="space-y-1 text-sm text-[#475569]">
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

      <div className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0F172A]">
          <MessageSquareText className="size-4 text-[#2563EB]" /> Messages
        </div>
        <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <p className="text-sm text-[#475569]">
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
                        ? "bg-[#2563EB] text-white"
                        : "bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0]"
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
  useRoleGuard('CONSUMER');
  const { data: requests, isLoading, error } = useQuery(getMyRequests);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
            My Bookings & Repairs
          </h1>
          <p className="mt-1 text-sm text-[#475569]">
            Track service request status, booking details, and messages in one
            place.
          </p>
        </div>
        <Link
          to="/get-quotes"
          className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors"
        >
          <Wrench className="size-4" /> Get Help
        </Link>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="rounded-[24px] border border-[#E2E8F0] bg-white p-5"
            >
              <div className="h-5 w-1/2 animate-pulse rounded bg-[#F8FAFC]" />
              <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-[#F8FAFC]" />
              <div className="mt-6 h-16 animate-pulse rounded-[18px] bg-[#F8FAFC]" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8">
          <p className="text-lg font-semibold text-[#0F172A]">Requests could not load</p>
          <p className="mt-2 text-sm text-[#475569]">
            Refresh the page and try again. If this keeps happening, contact
            TheHelper support with the email on your account.
          </p>
        </div>
      )}

      {!isLoading && !error && !requests?.length && (
        <div className="flex flex-col items-center space-y-3 rounded-[24px] border border-[#E2E8F0] bg-white p-12 text-center">
          <Wrench className="size-10 text-[#2563EB]" />
          <p className="text-lg font-semibold text-[#0F172A]">No service requests yet</p>
          <p className="text-sm text-[#94A3B8]">
            Submit your first request to start tracking booking updates and
            messages.
          </p>
          <Link
            to="/get-quotes"
            className="mt-2 rounded-[22px] bg-[#2563EB] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors"
          >
            Get Help
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
