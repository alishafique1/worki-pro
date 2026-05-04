import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { useAction, useQuery, getMyRequests, sendCustomerMessage } from 'wasp/client/operations';
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Phone,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

const statusColor = (s: string) => {
  if (['COMPLETED', 'REWARD_APPROVED'].includes(s))
    return 'bg-[#567a58] text-white';
  if (['BOOKED', 'ACCEPTED_BY_PROVIDER'].includes(s))
    return 'bg-blue-900/50 text-blue-300';
  if (['NEW', 'QUALIFYING', 'QUALIFIED', 'ASSIGNED'].includes(s))
    return 'bg-[var(--surface-overlay)] text-[var(--accent)]';
  if (['LOST', 'INVALID', 'SPAM', 'CLOSED'].includes(s))
    return 'bg-[var(--surface-overlay)] text-[var(--text-tertiary)]';
  return 'bg-[var(--surface-overlay)] text-[var(--text-secondary)]';
};

const urgencyStyle = (u: string) => {
  if (u === 'EMERGENCY') return 'bg-red-900/40 text-red-300';
  if (u === 'PLANNED')
    return 'bg-[var(--surface-overlay)] text-[var(--text-tertiary)]';
  return 'bg-[var(--surface-overlay)] text-[var(--text-secondary)]';
};

const formatStatus = (s: string) =>
  s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (value?: string | Date | null) => {
  if (!value) return 'Not scheduled yet';
  return new Date(value).toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function RequestTimeline({ status }: { status: string }) {
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

  return (
    <div className='grid gap-3 sm:grid-cols-4'>
      {steps.map((step, index) => {
        const stepRank = ['NEW', 'ASSIGNED', 'BOOKED', 'COMPLETED'].indexOf(step.key);
        const done = rank >= stepRank;
        return (
          <div key={step.key} className='flex items-center gap-2 text-xs'>
            <span
              className={`flex size-6 items-center justify-center rounded-full ${
                done
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-[var(--surface-overlay)] text-[var(--text-secondary)]'
              }`}
            >
              {done ? <CheckCircle2 className='size-3.5' /> : index + 1}
            </span>
            <span className={done ? 'font-semibold text-foreground' : 'text-[var(--text-secondary)]'}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MessageThread({ requestId, messages }: { requestId: string; messages: any[] }) {
  const sendMessage = useAction(sendCustomerMessage);
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [localMessages, setLocalMessages] = useState<any[]>(messages || []);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalMessages(messages || []);
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
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
    } catch (error: any) {
      alert(error?.message || 'Could not send message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Message list */}
      <div className='flex-1 overflow-y-auto space-y-3 pr-1 min-h-[200px] max-h-[400px]'>
        {localMessages.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-center py-8'>
            <MessageSquareText className='size-8 text-[var(--text-tertiary)] mb-3' />
            <p className='text-sm text-[var(--text-secondary)]'>
              No messages yet. Once a provider is assigned, you can coordinate here.
            </p>
          </div>
        ) : (
          localMessages.map((message: any) => {
            const fromCustomer = message.direction === 'INBOUND';
            return (
              <div
                key={message.id}
                className={`flex ${fromCustomer ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-[18px] px-4 py-3 text-sm shadow-sm ${
                    fromCustomer
                      ? 'bg-[var(--accent)] text-black rounded-br-md'
                      : 'bg-[var(--surface-raised)] text-foreground rounded-bl-md border border-[var(--border-default)]'
                  }`}
                >
                  <p className='font-semibold text-xs mb-1 opacity-70'>
                    {fromCustomer ? 'You' : message.from}
                  </p>
                  <p className='leading-relaxed'>{message.body}</p>
                  <p className='mt-2 text-[10px] opacity-60'>
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className='mt-4 flex flex-col gap-3 sm:flex-row border-t border-[var(--border-default)] pt-4'
      >
        <label className='sr-only' htmlFor={`message-${requestId}`}>
          Message provider
        </label>
        <input
          id={`message-${requestId}`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder='Ask a question or share an update...'
          maxLength={1000}
          className='min-w-0 flex-1 rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-base)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30'
        />
        <button
          type='submit'
          disabled={isSending || !body.trim()}
          className='inline-flex items-center justify-center gap-2 rounded-[18px] bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90 transition-opacity'
        >
          <Send className='size-4' /> {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default function RequestDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const { data: requests, isLoading, error } = useQuery(getMyRequests);

  const request = requests?.find((r: any) => r.id === requestId);

  if (isLoading) {
    return (
      <div className='p-8 max-w-4xl mx-auto min-h-[80vh] space-y-8'>
        <div className='animate-pulse h-8 bg-[var(--surface-raised)] rounded-[14px] w-1/4' />
        <div className='animate-pulse h-40 bg-[var(--surface-raised)] rounded-[24px]' />
        <div className='animate-pulse h-64 bg-[var(--surface-raised)] rounded-[24px]' />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className='p-8 max-w-4xl mx-auto min-h-[80vh] flex flex-col items-center justify-center'>
        <div className='bg-[var(--surface-raised)] border border-red-500/30 rounded-[24px] p-12 text-center max-w-md'>
          <div className='text-4xl mb-4'>🔍</div>
          <h2 className='text-xl font-bold mb-2'>Request not found</h2>
          <p className='text-[var(--text-secondary)] mb-6'>
            This request may not exist or you may not have access to it.
          </p>
          <Link
            to='/my-requests'
            className='inline-flex items-center gap-2 rounded-[18px] bg-[var(--accent)] px-6 py-3 font-bold text-black'
          >
            <ArrowLeft className='size-4' /> Back to My Requests
          </Link>
        </div>
      </div>
    );
  }

  const appointment = request.appointments?.[0];
  const provider = appointment?.provider || request.assignedProvider;

  return (
    <div className='p-6 max-w-4xl mx-auto min-h-[80vh]'>
      {/* Back nav */}
      <Link
        to='/my-requests'
        className='inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-foreground mb-6 transition-colors'
      >
        <ArrowLeft className='size-4' /> My Requests
      </Link>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
          <div className='min-w-0'>
            <h1 className='text-3xl font-bold tracking-tight break-words'>
              {request.description}
            </h1>
            <div className='mt-3 flex flex-wrap items-center gap-2'>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(request.status)}`}>
                {formatStatus(request.status)}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${urgencyStyle(request.urgency)}`}>
                {request.urgency.charAt(0) + request.urgency.slice(1).toLowerCase()}
              </span>
              <span className='text-xs text-[var(--text-tertiary)]'>
                {new Date(request.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Book appointment CTA */}
          {!appointment?.scheduledAt && ['ASSIGNED', 'ACCEPTED_BY_PROVIDER', 'QUALIFIED'].includes(request.status) && (
            <Link
              to={`/book/${request.id}`}
              className='inline-flex items-center gap-2 rounded-[18px] bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black hover:opacity-90 transition-opacity whitespace-nowrap'
            >
              📅 Book Appointment
            </Link>
          )}
        </div>

        {/* Timeline */}
        <div className='rounded-[20px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-5'>
          <h2 className='text-sm font-bold mb-4 text-[var(--text-secondary)] uppercase tracking-wide'>Request Progress</h2>
          <RequestTimeline status={request.status} />
        </div>

        {/* Details grid */}
        <div className='grid gap-4 md:grid-cols-2'>
          {/* Booking */}
          <div className='rounded-[20px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-5'>
            <div className='mb-4 flex items-center gap-2 text-sm font-bold'>
              <CalendarClock className='size-4 text-[var(--accent)]' /> Booking
            </div>
            <p className='text-sm text-[var(--text-secondary)]'>
              {formatDate(appointment?.scheduledAt)}
            </p>
            {appointment?.status && (
              <p className='mt-2 text-xs text-[var(--text-tertiary)]'>
                Appointment: {formatStatus(appointment.status)}
              </p>
            )}
            {appointment?.providerNotes && (
              <p className='mt-2 text-xs text-[var(--text-secondary)] border-t border-[var(--border-default)] pt-2'>
                Pro notes: {appointment.providerNotes}
              </p>
            )}
          </div>

          {/* Request details */}
          <div className='rounded-[20px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-5'>
            <div className='mb-4 flex items-center gap-2 text-sm font-bold'>
              <Wrench className='size-4 text-[var(--accent)]' /> Request Details
            </div>
            <div className='space-y-2 text-sm text-[var(--text-secondary)]'>
              {(request.city || request.postalCode) && (
                <div className='flex items-start gap-2'>
                  <MapPin className='size-4 mt-0.5 text-[var(--accent)]' />
                  <span>{[request.city, request.postalCode].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {request.estimatedSchedule && (
                <div className='flex items-start gap-2'>
                  <CalendarClock className='size-4 mt-0.5 text-[var(--accent)]' />
                  <span>Timeline: {request.estimatedSchedule.replace(/_/g, ' ')}</span>
                </div>
              )}
              {request.preferredTime && (
                <div className='flex items-start gap-2'>
                  <Clock3 className='size-4 mt-0.5 text-[var(--accent)]' />
                  <span>Best time: {request.preferredTime.replace(/_/g, ' ')}</span>
                </div>
              )}
              {request.serviceCategory && (
                <div className='flex items-start gap-2'>
                  <ShieldCheck className='size-4 mt-0.5 text-[var(--accent)]' />
                  <span>{request.serviceCategory.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Provider */}
          <div className='rounded-[20px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-5'>
            <div className='mb-4 flex items-center gap-2 text-sm font-bold'>
              <ShieldCheck className='size-4 text-[var(--accent)]' /> Provider
            </div>
            {provider ? (
              <div className='space-y-3'>
                <div>
                  <p className='font-semibold text-foreground'>{provider.businessName}</p>
                  {provider.phone && (
                    <a href={`tel:${provider.phone}`} className='flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors mt-1'>
                      <Phone className='size-3.5' /> {provider.phone}
                    </a>
                  )}
                  {provider.email && (
                    <a href={`mailto:${provider.email}`} className='flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors mt-1'>
                      <Mail className='size-3.5' /> {provider.email}
                    </a>
                  )}
                </div>
                <Link
                  to={`/pro/${provider.id}`}
                  className='inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline'
                >
                  View Pro Profile →
                </Link>
              </div>
            ) : (
              <p className='text-sm text-[var(--text-secondary)]'>
                We are still matching your request with the right local provider.
              </p>
            )}
          </div>

          {/* Rewards summary */}
          {request.rewardEligible && (
            <div className='rounded-[20px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-5'>
              <div className='mb-4 flex items-center gap-2 text-sm font-bold'>
                🎁 Rewards
              </div>
              <div className='space-y-1.5 text-sm'>
                {['NEW', 'QUALIFYING', 'QUALIFIED', 'ASSIGNED', 'ACCEPTED_BY_PROVIDER'].includes(request.status) && (
                  <div className='flex justify-between'>
                    <span className='text-[var(--text-secondary)]'>Request submitted</span>
                    <span className='font-bold text-[var(--accent)]'>+500 pts ($5)</span>
                  </div>
                )}
                {['BOOKED', 'ACCEPTED_BY_PROVIDER'].includes(request.status) && (
                  <div className='flex justify-between'>
                    <span className='text-[var(--text-secondary)]'>Appointment booked</span>
                    <span className='font-bold text-[var(--accent)]'>+500 pts ($5)</span>
                  </div>
                )}
                {request.status === 'COMPLETED' && (
                  <div className='flex justify-between'>
                    <span className='text-[var(--text-secondary)]'>First job completed</span>
                    <span className='font-bold text-[var(--accent)]'>+5,000 pts ($50)</span>
                  </div>
                )}
                <p className='text-xs text-[var(--text-tertiary)] pt-1'>
                  Reward status: {request.rewardStatus || 'Pending verification'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Message thread */}
        <div className='rounded-[20px] border border-[var(--border-default)] bg-[var(--surface-raised)] p-5'>
          <div className='mb-4 flex items-center gap-2 text-sm font-bold'>
            <MessageSquareText className='size-4 text-[var(--accent)]' /> Messages
          </div>
          <MessageThread
            requestId={request.id}
            messages={request.communicationLogs || []}
          />
        </div>
      </div>
    </div>
  );
}
