import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useAction } from "wasp/client/operations";
import { getMessagesForRequest, sendCustomerMessage } from "wasp/client/operations";

function timeStamp(date: Date | string) {
  return new Date(date).toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dateLabel(date: Date | string) {
  return new Date(date).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function RequestMessagesPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery(
    getMessagesForRequest,
    { requestId: requestId ?? "" },
    { refetchInterval: 5000 },
  );

  const sendMessage = useAction(sendCustomerMessage);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    setSendError(null);
    try {
      await sendMessage({ requestId: requestId!, body });
      setBody("");
    } catch (err: any) {
      setSendError(err?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="animate-pulse h-80 bg-[var(--surface-raised)] rounded-[24px]" />
      </div>
    );
  }

  if (error || !data?.request) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center text-[var(--text-secondary)]">
        Request not found.{" "}
        <Link to="/my-requests" className="underline font-bold" style={{ color: "var(--accent)" }}>
          Back
        </Link>
      </div>
    );
  }

  const { request, messages } = data;

  return (
    <div className="flex flex-col max-w-3xl mx-auto min-h-[90vh] px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to={`/my-requests/${requestId}`}
          className="text-[var(--text-secondary)] hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-bold mb-0.5">
            Messages
          </p>
          <h1 className="text-xl font-black leading-none">
            {request.assignedProvider?.businessName ?? "TheHelper Support"}
          </h1>
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-raised)] overflow-y-auto p-6 space-y-4 mb-4 max-h-[60vh]">
        {messages.length === 0 && (
          <p className="text-center text-[var(--text-secondary)] text-sm py-8">
            No messages yet — start the conversation below.
          </p>
        )}

        {messages.map((msg, idx) => {
          const isConsumer = msg.direction === "INBOUND";
          const prevMsg = messages[idx - 1];
          const showDate =
            !prevMsg ||
            dateLabel(prevMsg.createdAt) !== dateLabel(msg.createdAt);

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="text-center text-xs text-[var(--text-secondary)] my-3">
                  {dateLabel(msg.createdAt)}
                </div>
              )}
              <div className={`flex ${isConsumer ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-[16px] text-sm leading-relaxed ${
                    isConsumer
                      ? "bg-[var(--accent)] text-black rounded-br-[4px]"
                      : "bg-[var(--surface-overlay)] text-foreground rounded-bl-[4px]"
                  }`}
                >
                  {msg.body}
                  <p
                    className={`text-xs mt-1 ${
                      isConsumer ? "text-black/60 text-right" : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {timeStamp(msg.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Send box */}
      <form onSubmit={handleSend} className="flex gap-3">
        <input
          type="text"
          placeholder="Type a message…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={sending}
          className="flex-1 px-5 py-3.5 rounded-[16px] border-2 border-[var(--border-default)] bg-[var(--surface-raised)] text-foreground placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!body.trim() || sending}
          className="px-5 py-3.5 bg-[var(--accent)] text-black font-black rounded-[16px] hover:opacity-90 disabled:opacity-40 transition-all"
        >
          {sending ? "…" : "Send"}
        </button>
      </form>

      {sendError && (
        <p className="text-sm text-red-400 mt-2">{sendError}</p>
      )}

      {/* Quick action: leave review */}
      {request.status === "COMPLETED" && (
        <Link
          to={`/my-requests/${requestId}/review`}
          className="mt-4 text-center text-sm font-bold underline"
          style={{ color: "var(--accent)" }}
        >
          Leave a review for {request.assignedProvider?.businessName} →
        </Link>
      )}
    </div>
  );
}
