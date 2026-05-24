import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useAction } from "wasp/client/operations";
import { getMessagesForRequest, sendCustomerMessage } from "wasp/client/operations";
import { useRoleGuard } from '../shared/useRoleGuard';
function timeStamp(date) {
    return new Date(date).toLocaleTimeString("en-CA", {
        hour: "2-digit",
        minute: "2-digit",
    });
}
function dateLabel(date) {
    return new Date(date).toLocaleDateString("en-CA", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}
export default function RequestMessagesPage() {
    useRoleGuard('CONSUMER');
    const { requestId } = useParams();
    const bottomRef = useRef(null);
    const { data, isLoading, error } = useQuery(getMessagesForRequest, { requestId: requestId ?? "" }, { refetchInterval: 5000 });
    const sendMessage = useAction(sendCustomerMessage);
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [data?.messages]);
    const handleSend = async (e) => {
        e.preventDefault();
        if (!body.trim())
            return;
        setSending(true);
        setSendError(null);
        try {
            await sendMessage({ requestId: requestId, body });
            setBody("");
        }
        catch (err) {
            setSendError(err?.message || "Failed to send message.");
        }
        finally {
            setSending(false);
        }
    };
    if (isLoading) {
        return (<div className="p-8 max-w-3xl mx-auto bg-[#F8FAFC] min-h-screen">
        <div className="animate-pulse h-80 bg-white rounded-[24px] border border-[#E2E8F0]"/>
      </div>);
    }
    if (error || !data?.request) {
        return (<div className="p-8 max-w-3xl mx-auto text-center text-[#475569] bg-[#F8FAFC] min-h-screen">
        Request not found.{" "}
        <Link to="/my-requests" className="underline font-bold text-[#2563EB]">
          Back
        </Link>
      </div>);
    }
    const { request, messages } = data;
    return (<div className="flex flex-col max-w-3xl mx-auto min-h-[90vh] px-4 py-6 bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/my-requests/${requestId}`} className="text-[#475569] hover:text-[#0F172A] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </Link>
        <div>
          <p className="text-xs text-[#94A3B8] uppercase tracking-widest font-bold mb-0.5">
            Messages
          </p>
          <h1 className="text-xl font-black leading-none text-[#0F172A]">
            {request.assignedProvider?.businessName ?? "TheHelper Support"}
          </h1>
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 rounded-[18px] border border-[#E2E8F0] bg-white overflow-y-auto p-6 space-y-4 mb-4 max-h-[60vh] shadow-sm">
        {messages.length === 0 && (<p className="text-center text-[#94A3B8] text-sm py-8">
            No messages yet. Start the conversation below.
          </p>)}

        {messages.map((msg, idx) => {
            const isConsumer = msg.direction === "INBOUND";
            const prevMsg = messages[idx - 1];
            const showDate = !prevMsg ||
                dateLabel(prevMsg.createdAt) !== dateLabel(msg.createdAt);
            return (<div key={msg.id}>
              {showDate && (<div className="text-center text-xs text-[#94A3B8] my-3">
                  {dateLabel(msg.createdAt)}
                </div>)}
              <div className={`flex ${isConsumer ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-3 rounded-[16px] text-sm leading-relaxed ${isConsumer
                    ? "bg-[#2563EB] text-white rounded-br-[4px]"
                    : "bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] rounded-bl-[4px]"}`}>
                  {msg.body}
                  <p className={`text-xs mt-1 ${isConsumer ? "text-white/60 text-right" : "text-[#94A3B8]"}`}>
                    {timeStamp(msg.createdAt)}
                  </p>
                </div>
              </div>
            </div>);
        })}
        <div ref={bottomRef}/>
      </div>

      {/* Send box */}
      <form onSubmit={handleSend} className="flex gap-3">
        <input type="text" placeholder="Type a message…" value={body} onChange={(e) => setBody(e.target.value)} disabled={sending} className="flex-1 px-5 py-3.5 rounded-[16px] border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 focus:outline-none transition-colors"/>
        <button type="submit" disabled={!body.trim() || sending} className="px-5 py-3.5 bg-[#2563EB] text-white font-black rounded-[16px] hover:bg-[#1D4ED8] disabled:opacity-40 transition-colors">
          {sending ? "…" : "Send"}
        </button>
      </form>

      {sendError && (<p className="text-sm text-red-600 mt-2">{sendError}</p>)}

      {/* Quick action: leave review */}
      {request.status === "COMPLETED" && (<Link to={`/my-requests/${requestId}/review`} className="mt-4 text-center text-sm font-bold underline text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
          Leave a review for {request.assignedProvider?.businessName} →
        </Link>)}
    </div>);
}
