import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useAction } from "wasp/client/operations";
import { getMessagesForRequest, sendProviderMessage } from "wasp/client/operations";
function timeStamp(date) {
    return new Date(date).toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" });
}
function dateLabel(date) {
    return new Date(date).toLocaleDateString("en-CA", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}
import { useRoleGuard } from '../shared/useRoleGuard';
export default function ProviderRequestMessagesPage() {
    useRoleGuard('PROVIDER');
    const { requestId } = useParams();
    const bottomRef = useRef(null);
    const { data, isLoading, error } = useQuery(getMessagesForRequest, { requestId: requestId ?? "" }, { refetchInterval: 5000 });
    const sendMsg = useAction(sendProviderMessage);
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
            await sendMsg({ requestId: requestId, body });
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
        <div className="animate-pulse h-80 bg-[#EFF6FF] rounded-[24px]"/>
      </div>);
    }
    if (error || !data?.request) {
        return (<div className="p-8 max-w-3xl mx-auto text-center text-[#475569] bg-[#F8FAFC] min-h-screen">
        Request not found.{" "}
        <Link to="/provider/leads" className="underline font-bold text-[#2563EB]">
          Back to leads
        </Link>
      </div>);
    }
    const { request, messages } = data;
    return (<div className="flex flex-col max-w-3xl mx-auto min-h-[90vh] px-4 py-6 bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/provider/leads" className="text-[#475569] hover:text-[#0F172A] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </Link>
        <div>
          <p className="text-xs text-[#475569] uppercase tracking-widest font-bold mb-0.5">
            Customer Message Thread
          </p>
          <h1 className="text-xl font-black leading-none text-[#0F172A]">{request.name}</h1>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full border text-xs font-bold ${request.status === "COMPLETED"
            ? "bg-[#F0FDF4] text-[#15803D] border-green-200"
            : request.status === "CANCELLED"
                ? "bg-[#FEF2F2] text-red-600 border-red-200"
                : "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]"}`}>
          {request.status.replace(/_/g, " ")}
        </span>
      </div>

      {/* Thread */}
      <div className="flex-1 rounded-[18px] border border-[#E2E8F0] bg-white overflow-y-auto p-6 space-y-4 mb-4 max-h-[60vh]">
        {messages.length === 0 && (<p className="text-center text-[#475569] text-sm py-8">
            No messages yet. Introduce yourself below.
          </p>)}

        {messages.map((msg, idx) => {
            const isProvider = msg.direction === "OUTBOUND";
            const prevMsg = messages[idx - 1];
            const showDate = !prevMsg || dateLabel(prevMsg.createdAt) !== dateLabel(msg.createdAt);
            return (<div key={msg.id}>
              {showDate && (<div className="text-center text-xs text-[#94A3B8] my-3">
                  {dateLabel(msg.createdAt)}
                </div>)}
              <div className={`flex ${isProvider ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-3 rounded-[16px] text-sm leading-relaxed ${isProvider
                    ? "bg-[#2563EB] text-white rounded-br-[4px]"
                    : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-bl-[4px]"}`}>
                  {msg.body}
                  <p className={`text-xs mt-1 ${isProvider ? "text-white/60 text-right" : "text-[#94A3B8]"}`}>
                    {timeStamp(msg.createdAt)}
                  </p>
                </div>
              </div>
            </div>);
        })}
        <div ref={bottomRef}/>
      </div>

      {/* Composer */}
      <form onSubmit={handleSend} className="flex gap-3">
        <input type="text" placeholder="Send a message or quote…" value={body} onChange={(e) => setBody(e.target.value)} disabled={sending} className="flex-1 px-5 py-3.5 rounded-[16px] border-2 border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none transition-colors"/>
        <button type="submit" disabled={!body.trim() || sending} className="px-5 py-3.5 bg-[#2563EB] text-white font-black rounded-[16px] hover:bg-[#1D4ED8] disabled:opacity-40 transition-colors">
          {sending ? "…" : "Send"}
        </button>
      </form>

      {sendError && <p className="text-sm text-red-600 mt-2">{sendError}</p>}
    </div>);
}
