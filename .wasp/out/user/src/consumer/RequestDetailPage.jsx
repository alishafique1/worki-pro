import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { useAction, useQuery, getMyRequests, sendCustomerMessage } from 'wasp/client/operations';
import { useRoleGuard } from '../shared/useRoleGuard';
import { ArrowLeft, CalendarClock, CheckCircle2, Clock3, MessageSquareText, Phone, Mail, MapPin, Send, ShieldCheck, Wrench, } from 'lucide-react';
const statusColor = (s) => {
    if (['COMPLETED', 'REWARD_APPROVED'].includes(s))
        return 'bg-[#F0FDF4] text-[#15803D] border border-green-200';
    if (['BOOKED', 'ACCEPTED_BY_PROVIDER'].includes(s))
        return 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]';
    if (['NEW', 'QUALIFYING', 'QUALIFIED', 'ASSIGNED'].includes(s))
        return 'bg-[#FEF3C7] text-amber-700 border border-[#FDE68A]';
    if (['LOST', 'INVALID', 'SPAM', 'CLOSED'].includes(s))
        return 'bg-[#FEF2F2] text-red-600 border border-red-200';
    return 'bg-[#FEF3C7] text-amber-700 border border-[#FDE68A]';
};
const urgencyStyle = (u) => {
    if (u === 'EMERGENCY')
        return 'bg-[#FEF2F2] text-red-600 border border-red-200';
    if (u === 'PLANNED')
        return 'bg-[#F8FAFC] text-[#94A3B8] border border-[#E2E8F0]';
    return 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]';
};
const formatStatus = (s) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const formatDate = (value) => {
    if (!value)
        return 'Not scheduled yet';
    return new Date(value).toLocaleString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
function RequestTimeline({ status }) {
    const steps = [
        { key: 'NEW', label: 'Request received' },
        { key: 'ASSIGNED', label: 'Provider matched' },
        { key: 'BOOKED', label: 'Booking confirmed' },
        { key: 'COMPLETED', label: 'Repair completed' },
    ];
    const rank = [
        'NEW', 'QUALIFYING', 'QUALIFIED', 'ASSIGNED',
        'ACCEPTED_BY_PROVIDER', 'BOOKED', 'COMPLETED',
    ].indexOf(status);
    return (<div className='grid gap-3 sm:grid-cols-4'>
      {steps.map((step, index) => {
            const stepRank = ['NEW', 'ASSIGNED', 'BOOKED', 'COMPLETED'].indexOf(step.key);
            const done = rank >= stepRank;
            return (<div key={step.key} className='flex items-center gap-2 text-xs'>
            <span className={`flex size-6 items-center justify-center rounded-full ${done
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[#F8FAFC] text-[#94A3B8] border border-[#E2E8F0]'}`}>
              {done ? <CheckCircle2 className='size-3.5'/> : index + 1}
            </span>
            <span className={done ? 'font-semibold text-[#0F172A]' : 'text-[#94A3B8]'}>
              {step.label}
            </span>
          </div>);
        })}
    </div>);
}
function MessageThread({ requestId, messages }) {
    const sendMessage = useAction(sendCustomerMessage);
    const [body, setBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [localMessages, setLocalMessages] = useState(messages || []);
    const bottomRef = useRef(null);
    useEffect(() => {
        setLocalMessages(messages || []);
    }, [messages]);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localMessages]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmed = body.trim();
        if (!trimmed)
            return;
        setIsSending(true);
        try {
            const sent = await sendMessage({ requestId, body: trimmed });
            setLocalMessages((prev) => [...prev, {
                    id: `temp-${Date.now()}`,
                    body: trimmed,
                    direction: 'INBOUND',
                    from: 'You',
                    createdAt: new Date().toISOString(),
                }]);
            setBody('');
        }
        catch (error) {
            alert(error?.message || 'Could not send message.');
        }
        finally {
            setIsSending(false);
        }
    };
    return (<div className='flex flex-col h-full'>
      {/* Message list */}
      <div className='flex-1 overflow-y-auto space-y-3 pr-1 min-h-[200px] max-h-[400px]'>
        {localMessages.length === 0 ? (<div className='flex flex-col items-center justify-center h-full text-center py-8'>
            <MessageSquareText className='size-8 text-[#94A3B8] mb-3'/>
            <p className='text-sm text-[#475569]'>
              No messages yet. Once a provider is assigned, you can coordinate here.
            </p>
          </div>) : (localMessages.map((message) => {
            const fromCustomer = message.direction === 'INBOUND';
            return (<div key={message.id} className={`flex ${fromCustomer ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-[18px] px-4 py-3 text-sm shadow-sm ${fromCustomer
                    ? 'bg-[#2563EB] text-white rounded-br-md'
                    : 'bg-[#F8FAFC] text-[#0F172A] rounded-bl-md border border-[#E2E8F0]'}`}>
                  <p className='font-semibold text-xs mb-1 opacity-70'>
                    {fromCustomer ? 'You' : message.from}
                  </p>
                  <p className='leading-relaxed'>{message.body}</p>
                  <p className='mt-2 text-[10px] opacity-60'>
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>);
        }))}
        <div ref={bottomRef}/>
      </div>

      {/* Composer */}
      <form onSubmit={handleSubmit} className='mt-4 flex flex-col gap-3 sm:flex-row border-t border-[#E2E8F0] pt-4'>
        <label className='sr-only' htmlFor={`message-${requestId}`}>
          Message provider
        </label>
        <input id={`message-${requestId}`} value={body} onChange={(e) => setBody(e.target.value)} placeholder='Ask a question or share an update...' maxLength={1000} className='min-w-0 flex-1 rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30'/>
        <button type='submit' disabled={isSending || !body.trim()} className='inline-flex items-center justify-center gap-2 rounded-[18px] bg-[#2563EB] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#1D4ED8] transition-colors'>
          <Send className='size-4'/> {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>);
}
export default function RequestDetailPage() {
    useRoleGuard('CONSUMER');
    const { requestId } = useParams();
    const { data: requests, isLoading, error } = useQuery(getMyRequests);
    const request = requests?.find((r) => r.id === requestId);
    if (isLoading) {
        return (<div className='p-8 max-w-4xl mx-auto min-h-[80vh] space-y-8 bg-[#F8FAFC]'>
        <div className='animate-pulse h-8 bg-white rounded-[14px] w-1/4 border border-[#E2E8F0]'/>
        <div className='animate-pulse h-40 bg-white rounded-[24px] border border-[#E2E8F0]'/>
        <div className='animate-pulse h-64 bg-white rounded-[24px] border border-[#E2E8F0]'/>
      </div>);
    }
    if (error || !request) {
        return (<div className='p-8 max-w-4xl mx-auto min-h-[80vh] flex flex-col items-center justify-center bg-[#F8FAFC]'>
        <div className='bg-white border border-red-200 rounded-[24px] p-12 text-center max-w-md shadow-sm'>
          <div className='text-4xl mb-4'>🔍</div>
          <h2 className='text-xl font-bold mb-2 text-[#0F172A]'>Request not found</h2>
          <p className='text-[#475569] mb-6'>
            This request may not exist or you may not have access to it.
          </p>
          <Link to='/my-requests' className='inline-flex items-center gap-2 rounded-[18px] bg-[#2563EB] px-6 py-3 font-bold text-white hover:bg-[#1D4ED8] transition-colors'>
            <ArrowLeft className='size-4'/> Back to My Requests
          </Link>
        </div>
      </div>);
    }
    const appointment = request.appointments?.[0];
    const provider = appointment?.provider || request.assignedProvider;
    return (<div className='p-6 max-w-4xl mx-auto min-h-[80vh] bg-[#F8FAFC]'>
      {/* Back nav */}
      <Link to='/my-requests' className='inline-flex items-center gap-2 text-sm text-[#475569] hover:text-[#0F172A] mb-6 transition-colors'>
        <ArrowLeft className='size-4'/> My Requests
      </Link>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
          <div className='min-w-0'>
            <h1 className='text-3xl font-bold tracking-tight break-words text-[#0F172A]'>
              {request.description}
            </h1>
            <div className='mt-3 flex flex-wrap items-center gap-2'>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(request.status)}`}>
                {formatStatus(request.status)}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${urgencyStyle(request.urgency)}`}>
                {request.urgency.charAt(0) + request.urgency.slice(1).toLowerCase()}
              </span>
              <span className='text-xs text-[#94A3B8]'>
                {new Date(request.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Book appointment CTA */}
          {!appointment?.scheduledAt && ['ASSIGNED', 'ACCEPTED_BY_PROVIDER', 'QUALIFIED'].includes(request.status) && (<Link to={`/book/${request.id}`} className='inline-flex items-center gap-2 rounded-[18px] bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors whitespace-nowrap'>
              📅 Book Appointment
            </Link>)}
        </div>

        {/* Timeline */}
        <div className='rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-sm'>
          <h2 className='text-sm font-bold mb-4 text-[#475569] uppercase tracking-wide'>Request Progress</h2>
          <RequestTimeline status={request.status}/>
        </div>

        {/* Details grid */}
        <div className='grid gap-4 md:grid-cols-2'>
          {/* Booking */}
          <div className='rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-sm'>
            <div className='mb-4 flex items-center gap-2 text-sm font-bold text-[#0F172A]'>
              <CalendarClock className='size-4 text-[#2563EB]'/> Booking
            </div>
            <p className='text-sm text-[#475569]'>
              {formatDate(appointment?.scheduledAt)}
            </p>
            {appointment?.status && (<p className='mt-2 text-xs text-[#94A3B8]'>
                Appointment: {formatStatus(appointment.status)}
              </p>)}
            {appointment?.providerNotes && (<p className='mt-2 text-xs text-[#475569] border-t border-[#E2E8F0] pt-2'>
                Pro notes: {appointment.providerNotes}
              </p>)}
          </div>

          {/* Request details */}
          <div className='rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-sm'>
            <div className='mb-4 flex items-center gap-2 text-sm font-bold text-[#0F172A]'>
              <Wrench className='size-4 text-[#2563EB]'/> Request Details
            </div>
            <div className='space-y-2 text-sm text-[#475569]'>
              {(request.city || request.postalCode) && (<div className='flex items-start gap-2'>
                  <MapPin className='size-4 mt-0.5 text-[#2563EB]'/>
                  <span>{[request.city, request.postalCode].filter(Boolean).join(', ')}</span>
                </div>)}
              {request.estimatedSchedule && (<div className='flex items-start gap-2'>
                  <CalendarClock className='size-4 mt-0.5 text-[#2563EB]'/>
                  <span>Timeline: {request.estimatedSchedule.replace(/_/g, ' ')}</span>
                </div>)}
              {request.preferredTime && (<div className='flex items-start gap-2'>
                  <Clock3 className='size-4 mt-0.5 text-[#2563EB]'/>
                  <span>Best time: {request.preferredTime.replace(/_/g, ' ')}</span>
                </div>)}
              {request.serviceCategory && (<div className='flex items-start gap-2'>
                  <ShieldCheck className='size-4 mt-0.5 text-[#2563EB]'/>
                  <span>{request.serviceCategory.name}</span>
                </div>)}
            </div>
          </div>

          {/* Provider */}
          <div className='rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-sm'>
            <div className='mb-4 flex items-center gap-2 text-sm font-bold text-[#0F172A]'>
              <ShieldCheck className='size-4 text-[#2563EB]'/> Provider
            </div>
            {provider ? (<div className='space-y-3'>
                <div>
                  <p className='font-semibold text-[#0F172A]'>{provider.businessName}</p>
                  {provider.phone && (<a href={`tel:${provider.phone}`} className='flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#2563EB] transition-colors mt-1'>
                      <Phone className='size-3.5'/> {provider.phone}
                    </a>)}
                  {provider.email && (<a href={`mailto:${provider.email}`} className='flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#2563EB] transition-colors mt-1'>
                      <Mail className='size-3.5'/> {provider.email}
                    </a>)}
                </div>
                <Link to={`/pro/${provider.id}`} className='inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline'>
                  View Pro Profile →
                </Link>
              </div>) : (<p className='text-sm text-[#475569]'>
                We are still matching your request with the right local provider.
              </p>)}
          </div>

          {/* Rewards summary */}
          {request.rewardEligible && (<div className='rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-sm'>
              <div className='mb-4 flex items-center gap-2 text-sm font-bold text-[#0F172A]'>
                🎁 Rewards
              </div>
              <div className='space-y-1.5 text-sm'>
                {['NEW', 'QUALIFYING', 'QUALIFIED', 'ASSIGNED', 'ACCEPTED_BY_PROVIDER'].includes(request.status) && (<div className='flex justify-between'>
                    <span className='text-[#475569]'>Request submitted</span>
                    <span className='font-bold text-[#2563EB]'>+500 pts ($5)</span>
                  </div>)}
                {['BOOKED', 'ACCEPTED_BY_PROVIDER'].includes(request.status) && (<div className='flex justify-between'>
                    <span className='text-[#475569]'>Appointment booked</span>
                    <span className='font-bold text-[#2563EB]'>+500 pts ($5)</span>
                  </div>)}
                {request.status === 'COMPLETED' && (<div className='flex justify-between'>
                    <span className='text-[#475569]'>First job completed</span>
                    <span className='font-bold text-[#2563EB]'>+5,000 pts ($50)</span>
                  </div>)}
                <p className='text-xs text-[#94A3B8] pt-1'>
                  Reward status: {request.rewardStatus || 'Pending verification'}
                </p>
              </div>
            </div>)}
        </div>

        {/* Message thread */}
        <div className='rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-sm'>
          <div className='mb-4 flex items-center gap-2 text-sm font-bold text-[#0F172A]'>
            <MessageSquareText className='size-4 text-[#2563EB]'/> Messages
          </div>
          <MessageThread requestId={request.id} messages={request.communicationLogs || []}/>
        </div>
      </div>
    </div>);
}
