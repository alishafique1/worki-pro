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
  Inbox,
  MapPin,
  MessageSquareText,
  Send,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";
import { AddToCalendarDropdown } from "../client/components/AddToCalendarDropdown";

/* ------------------------------------------------------------------ */
/* Status helpers                                                      */
/* ------------------------------------------------------------------ */

const COMPLETED_STATUSES = ["COMPLETED", "REWARD_PENDING", "REWARD_APPROVED", "CLOSED"];
const CANCELLED_STATUSES = ["LOST", "INVALID", "SPAM"];

type FilterKey = "ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED";

const filterOfRequest = (status: string): Exclude<FilterKey, "ALL"> => {
  if (CANCELLED_STATUSES.includes(status)) return "CANCELLED";
  if (COMPLETED_STATUSES.includes(status)) return "COMPLETED";
  return "ACTIVE";
};

const statusColor = (s: string) => {
  if (["COMPLETED", "REWARD_APPROVED", "REWARD_PENDING"].includes(s))
    return "bg-[#F0FDF4] text-[#15803D] border border-green-200";
  if (["BOOKED", "ACCEPTED_BY_PROVIDER"].includes(s))
    return "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]";
  if (["NEW", "QUALIFYING", "QUALIFIED", "ASSIGNED", "SMS_STARTED"].includes(s))
    return "bg-[#FEF3C7] text-amber-700 border border-[#FDE68A]";
  if (["LOST", "INVALID", "SPAM", "CLOSED"].includes(s))
    return "bg-[#FEF2F2] text-red-600 border border-red-200";
  return "bg-[#FEF3C7] text-amber-700 border border-[#FDE68A]";
};

// Left accent border colour, matched to status family.
const accentColor = (s: string) => {
  if (["COMPLETED", "REWARD_APPROVED", "REWARD_PENDING"].includes(s)) return "#22C55E";
  if (["BOOKED", "ACCEPTED_BY_PROVIDER"].includes(s)) return "#2563EB";
  if (["LOST", "INVALID", "SPAM", "CLOSED"].includes(s)) return "#EF4444";
  return "#F59E0B";
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

const relativeTime = (value?: string | Date | null) => {
  if (!value) return "";
  const then = new Date(value).getTime();
  const diff = Date.now() - then;
  if (Number.isNaN(diff)) return "";
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.round(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
};

const initialsOf = (name?: string | null) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

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
                done ? "font-semibold text-[#0F172A]" : "text-[#94A3B8]"
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
      {sendError && <p className="text-xs text-red-600 px-1">{sendError}</p>}
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
          className="min-w-0 flex-1 rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30"
        />
        <button
          type="submit"
          disabled={isSending || !body.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
        >
          <Send className="size-4" /> {isSending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

function MetaItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569]">
      <span className="text-[#94A3B8]">{icon}</span>
      {children}
    </span>
  );
}

function RequestCard({ req }: { req: any }) {
  const appointment = req.appointments?.[0];
  const provider = appointment?.provider || req.assignedProvider;
  const messages = req.communicationLogs || [];
  const [expanded, setExpanded] = React.useState(false);

  return (
    <article
      className="overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-sm transition-shadow hover:shadow-md"
      style={{ borderLeft: `4px solid ${accentColor(req.status)}` }}
    >
      {/* Card header — always visible */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-semibold leading-snug text-[#0F172A] md:text-base">
              {req.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <MetaItem icon={<Clock3 className="size-3.5" />}>
                Submitted {relativeTime(req.createdAt) || "recently"}
              </MetaItem>
              {(req.city || req.postalCode) && (
                <MetaItem icon={<MapPin className="size-3.5" />}>
                  {[req.city, req.postalCode].filter(Boolean).join(", ")}
                </MetaItem>
              )}
              {provider ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569]">
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#EFF6FF] text-[9px] font-bold text-[#2563EB]">
                    {initialsOf(provider.businessName)}
                  </span>
                  {provider.businessName}
                </span>
              ) : (
                <MetaItem icon={<UserRound className="size-3.5" />}>
                  Matching provider…
                </MetaItem>
              )}
              {appointment?.scheduledAt && ['CONFIRMED', 'BOOKED', 'RESCHEDULED'].includes(appointment.status) && (
                <AddToCalendarDropdown
                  event={{
                    title: `${req.serviceCategory?.name || 'Service'} Appointment - The Helper`,
                    description: `${req.description}${provider ? `\n\nProvider: ${provider.businessName}${provider.phone ? `\nPhone: ${provider.phone}` : ''}` : ''}`,
                    startTime: new Date(appointment.scheduledAt),
                    endTime: new Date(new Date(appointment.scheduledAt).getTime() + 60 * 60 * 1000),
                    location: [req.city, req.postalCode].filter(Boolean).join(', ') || undefined,
                  }}
                />
              )}
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor(
              req.status,
            )}`}
          >
            {formatStatus(req.status)}
          </span>
        </div>

        {/* Action row */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${urgencyStyle(
              req.urgency,
            )}`}
          >
            {req.urgency.charAt(0) + req.urgency.slice(1).toLowerCase()}
          </span>
          <Link
            to={`/account/requests/${req.id}` as any}
            className="text-xs font-bold text-[#2563EB] hover:underline"
          >
            Open details →
          </Link>
          {!appointment?.scheduledAt &&
            ["ASSIGNED", "ACCEPTED_BY_PROVIDER", "QUALIFIED"].includes(
              req.status,
            ) && (
              <a
                href={`/account/book/${req.id}`}
                className="text-xs font-bold text-[#2563EB] hover:underline"
              >
                Book appointment →
              </a>
            )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="ml-auto text-xs font-bold text-[#475569] hover:text-[#0F172A]"
          >
            {expanded
              ? "Hide"
              : `Track & message${
                  messages.length ? ` (${messages.length})` : ""
                }`}
          </button>
        </div>
      </div>

      {/* Expandable body */}
      {expanded && (
        <div className="space-y-5 border-t border-[#E2E8F0] bg-[#F8FAFC]/40 p-5">
          <RequestTimeline status={req.status} />

          <div className="grid gap-4 md:grid-cols-3">
            {/* Booking */}
            <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                <CalendarClock className="size-4 text-[#2563EB]" /> Booking
              </div>
              <p className="mt-2 text-sm text-[#475569]">
                {formatDate(appointment?.scheduledAt)}
              </p>
              {appointment?.status && (
                <p className="mt-1 text-xs text-[#94A3B8]">
                  Status: {formatStatus(appointment.status)}
                </p>
              )}
              {appointment?.scheduledAt &&
                ["CONFIRMED", "BOOKED", "RESCHEDULED"].includes(
                  appointment.status,
                ) && (
                  <div className="mt-3">
                    <AddToCalendarDropdown
                      event={{
                        title: `${
                          req.serviceCategory?.name || "Service"
                        } Appointment - The Helper`,
                        description: `${req.description}${
                          provider
                            ? `\n\nProvider: ${provider.businessName}${
                                provider.phone
                                  ? `\nPhone: ${provider.phone}`
                                  : ""
                              }`
                            : ""
                        }`,
                        startTime: new Date(appointment.scheduledAt),
                        endTime: new Date(
                          new Date(appointment.scheduledAt).getTime() +
                            60 * 60 * 1000,
                        ),
                        location:
                          [req.city, req.postalCode]
                            .filter(Boolean)
                            .join(", ") || undefined,
                      }}
                    />
                  </div>
                )}
              {!appointment?.scheduledAt &&
                ["ASSIGNED", "ACCEPTED_BY_PROVIDER", "QUALIFIED"].includes(
                  req.status,
                ) && (
                  <a
                    href={`/account/book/${req.id}`}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-[14px] bg-[#2563EB] px-3 py-2 text-xs font-bold text-white hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
                  >
                    Book Appointment
                  </a>
                )}
            </div>

            {/* Provider */}
            <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4">
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
                  We are still matching your request with the right local
                  provider.
                </p>
              )}
            </div>

            {/* Request details */}
            <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                <Clock3 className="size-4 text-[#2563EB]" /> Details
              </div>
              <div className="space-y-1 text-sm text-[#475569]">
                <p>
                  Requested {new Date(req.createdAt).toLocaleDateString()}
                </p>
                {(req.city || req.postalCode) && (
                  <p>{[req.city, req.postalCode].filter(Boolean).join(", ")}</p>
                )}
                {req.estimatedSchedule && (
                  <p>Timeline: {req.estimatedSchedule.replace(/_/g, " ")}</p>
                )}
                {req.preferredTime && (
                  <p>
                    Best contact time: {req.preferredTime.replace(/_/g, " ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0F172A]">
              <MessageSquareText className="size-4 text-[#2563EB]" /> Messages
            </div>
            <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <p className="text-sm text-[#475569]">
                  No messages yet. Once a provider is assigned, you can
                  coordinate here.
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
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Filter tabs                                                         */
/* ------------------------------------------------------------------ */

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "ACTIVE", label: "Active" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

function FilterTabs({
  active,
  counts,
  onChange,
}: {
  active: FilterKey;
  counts: Record<FilterKey, number>;
  onChange: (key: FilterKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => {
        const isActive = active === f.key;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onChange(f.key)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              isActive
                ? "bg-[#2563EB] text-white shadow-[0_6px_18px_rgba(37,99,235,0.28)]"
                : "border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#2563EB]/40 hover:text-[#0F172A]"
            }`}
          >
            {f.label}
            <span
              className={`inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                isActive
                  ? "bg-white/25 text-white"
                  : "bg-[#F8FAFC] text-[#475569]"
              }`}
            >
              {counts[f.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty states                                                        */
/* ------------------------------------------------------------------ */

function EmptyState({ filter }: { filter: FilterKey }) {
  const copy: Record<FilterKey, { title: string; body: string }> = {
    ALL: {
      title: "No service requests yet",
      body: "Submit your first request to start tracking booking updates and messages.",
    },
    ACTIVE: {
      title: "No active requests",
      body: "Requests in progress will appear here while we match and book your provider.",
    },
    COMPLETED: {
      title: "Nothing completed yet",
      body: "Once a job wraps up, it moves here so you can review and earn rewards.",
    },
    CANCELLED: {
      title: "No cancelled requests",
      body: "Requests that were closed out or marked invalid will show up here.",
    },
  };
  const { title, body } = copy[filter];

  return (
    <div className="flex flex-col items-center space-y-3 rounded-[24px] border border-[#E2E8F0] bg-white p-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-[#EFF6FF]">
        {filter === "ALL" ? (
          <Wrench className="size-7 text-[#2563EB]" />
        ) : (
          <Inbox className="size-7 text-[#2563EB]" />
        )}
      </div>
      <p className="text-lg font-semibold text-[#0F172A]">{title}</p>
      <p className="max-w-sm text-sm text-[#94A3B8]">{body}</p>
      <Link
        to="/get-quotes"
        className="mt-2 rounded-[14px] bg-[#2563EB] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
      >
        Get Help
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skeleton                                                            */
/* ------------------------------------------------------------------ */

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[24px] border border-[#E2E8F0] border-l-4 border-l-[#E2E8F0] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-full rounded bg-[#E2E8F0]" />
          <div className="h-4 w-2/3 rounded bg-[#E2E8F0]" />
          <div className="mt-3 flex gap-3">
            <div className="h-3 w-24 rounded bg-[#E2E8F0]" />
            <div className="h-3 w-20 rounded bg-[#E2E8F0]" />
            <div className="h-3 w-28 rounded bg-[#E2E8F0]" />
          </div>
        </div>
        <div className="h-6 w-20 shrink-0 rounded-full bg-[#E2E8F0]" />
      </div>
      <div className="mt-4 flex gap-3">
        <div className="h-6 w-16 rounded-full bg-[#E2E8F0]" />
        <div className="h-4 w-24 rounded bg-[#E2E8F0]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function MyRequestsPage() {
  useRoleGuard('CONSUMER');
  const { data: requests, isLoading, error } = useQuery(getMyRequests);
  const [filter, setFilter] = React.useState<FilterKey>("ALL");

  const list: any[] = requests ?? [];

  const counts: Record<FilterKey, number> = React.useMemo(() => {
    const c: Record<FilterKey, number> = {
      ALL: list.length,
      ACTIVE: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    for (const r of list) {
      c[filterOfRequest(r.status)] += 1;
    }
    return c;
  }, [list]);

  const visible = React.useMemo(() => {
    if (filter === "ALL") return list;
    return list.filter((r) => filterOfRequest(r.status) === filter);
  }, [list, filter]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-[#F8FAFC]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#0F172A] sm:text-3xl">
              My Bookings &amp; Repairs
            </h1>
            <p className="mt-1 text-sm text-[#475569]">
              Track status, booking details, and messages — all in one place.
              <span className="ml-1 font-semibold text-[#2563EB]">
                15 min avg response.
              </span>
            </p>
          </div>
          <Link
            to="/get-quotes"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
          >
            <Wrench className="size-4" /> New Request
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 p-6">
        {/* Filter pills — hidden on error, shown otherwise */}
        {!error && (
          <FilterTabs active={filter} counts={counts} onChange={setFilter} />
        )}

        {isLoading && (
          <div className="space-y-4">
            {[0, 1, 2].map((item) => (
              <CardSkeleton key={item} />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-8">
            <p className="text-lg font-semibold text-[#0F172A]">
              Requests could not load
            </p>
            <p className="mt-2 text-sm text-[#475569]">
              Refresh the page and try again. If this keeps happening, contact
              TheHelper support with the email on your account.
            </p>
          </div>
        )}

        {!isLoading && !error && visible.length === 0 && (
          <EmptyState filter={filter} />
        )}

        {!isLoading && !error && visible.length > 0 && (
          <div className="space-y-4">
            {visible.map((req: any) => (
              <RequestCard key={req.id} req={req} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
