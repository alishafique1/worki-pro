import React, { useState, useRef, useEffect } from 'react';
import { useAction, submitServiceRequest, sendOtp, verifyOtp, submitLead } from 'wasp/client/operations';
import { useNavigate } from 'react-router';
import { useAuth } from 'wasp/client/auth';
import { ACTIVE_PREFIXES, getCityForPrefix } from '../shared/geoConfig';

type ServiceSlug = 'hvac' | 'handyman' | 'appliance-repair' | 'plumbing' | 'electrical' | 'smart-home' | '';
type Urgency = 'EMERGENCY' | 'STANDARD' | 'PLANNED';

const SERVICE_CARDS = [
  { slug: 'hvac' as const,              label: 'HVAC',            icon: '❄️', description: 'Heating, cooling, and air quality' },
  { slug: 'handyman' as const,          label: 'Handyman',        icon: '🔨', description: 'Repairs, mounting, and installations' },
  { slug: 'appliance-repair' as const,  label: 'Appliance Repair',icon: '🔧', description: 'Fridges, washers, dryers, and more' },
  { slug: 'plumbing' as const,          label: 'Plumbing',        icon: '🚿', description: 'Leaks, drains, toilets, and pipes' },
  { slug: 'electrical' as const,        label: 'Electrical',      icon: '⚡', description: 'Wiring, outlets, panels, and lighting' },
  { slug: 'smart-home' as const,        label: 'Smart Home',      icon: '🏠', description: 'Cameras, thermostats, and automation' },
];

const HVAC_CHIPS = [
  'Not heating / cooling',
  'Strange noise or smell',
  'Annual tune-up',
  'System replacement',
  'Something else',
];

const APPLIANCE_CHIPS = ['Fridge', 'Washer', 'Dryer', 'Dishwasher', 'Oven', 'Other'];

const HANDYMAN_CHIPS = [
  'TV mounting',
  'Furniture assembly',
  'Drywall repair',
  'Door / lock',
  'Painting',
  'Shelving',
  'Caulking / sealing',
  'Something else',
];

const PLUMBING_CHIPS = [
  'Leaky faucet',
  'Clogged drain',
  'Running toilet',
  'Pipe burst / leak',
  'Water heater',
  'Low water pressure',
  'Something else',
];

const ELECTRICAL_CHIPS = [
  'Outlet not working',
  'Tripping breaker',
  'Light fixture install',
  'Panel upgrade',
  'EV charger install',
  'Smoke detector',
  'Something else',
];

const SMART_HOME_CHIPS = [
  'Smart thermostat',
  'Security cameras',
  'Smart doorbell',
  'Smart locks',
  'Wi-Fi / networking',
  'Smart lighting',
  'Something else',
];

const URGENCY_CHIPS: { value: Urgency; icon: string; label: string }[] = [
  { value: 'EMERGENCY', icon: '🚨', label: 'Urgent' },
  { value: 'STANDARD',  icon: '📅', label: 'This week' },
  { value: 'PLANNED',   icon: '🗓️', label: 'Flexible' },
];

const SCHEDULE_MAP: Record<Urgency, string> = {
  EMERGENCY: 'ASAP',
  STANDARD:  'THIS_WEEK',
  PLANNED:   'FLEXIBLE',
};

const SERVICE_DISPLAY: Record<Exclude<ServiceSlug, ''>, string> = {
  'hvac':            'HVAC',
  'handyman':        'handyman',
  'appliance-repair':'appliance repair',
  'plumbing':        'plumbing',
  'electrical':      'electrical',
  'smart-home':      'smart home',
};

const getPrefix   = (v: string) => v.replace(/\s+/g, '').toUpperCase().slice(0, 3);
const isValidPostal = (v: string) => v.replace(/\s+/g, '').length >= 6 && ACTIVE_PREFIXES.has(getPrefix(v));

// ── shared style atoms ────────────────────────────────────────────────────────
const inputCls =
  'w-full p-4 rounded-[18px] border-2 border-[var(--border-default)] bg-[var(--surface-raised)] ' +
  'text-foreground placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:outline-none transition-colors';

const chipCls = (active: boolean) =>
  `px-4 py-2.5 rounded-full border-2 text-sm font-bold transition-all duration-150 active:scale-95 cursor-pointer ` +
  (active
    ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-foreground'
    : 'border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50');

const ctaCls =
  'w-full py-4 bg-[var(--accent)] text-black font-black rounded-[22px] mt-8 ' +
  'hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed';

const TOTAL_STEPS = 4;

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
        Step {step} of {TOTAL_STEPS}
      </span>
      <div className="h-1 bg-[var(--border-default)] rounded-full mt-2">
        <div
          className="h-1 bg-[var(--accent)] rounded-full transition-all duration-500"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 text-sm font-bold text-[var(--text-secondary)] hover:text-foreground transition-colors"
    >
      ← Back
    </button>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function RequestServicePage() {
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const submitRequest = useAction(submitServiceRequest);
  const submitLeadFn = useAction(submitLead);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyDone, setNotifyDone] = useState(false);
  const [notifySubmitting, setNotifySubmitting] = useState(false);

  // OTP step state
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpSending, setOtpSending] = useState(false);

  // Refs for step-3 inputs — used to sync browser autofill into React state
  const postalRef = useRef<HTMLInputElement>(null);
  const nameRef   = useRef<HTMLInputElement>(null);
  const phoneRef  = useRef<HTMLInputElement>(null);

  // When step 3 renders, give the browser 100 ms to autofill then sync DOM → state
  useEffect(() => {
    if (step !== 3) return;
    const timer = setTimeout(() => {
      setForm(prev => ({
        ...prev,
        postalCode: postalRef.current?.value.toUpperCase() || prev.postalCode,
        name:       nameRef.current?.value  || prev.name,
        phone:      phoneRef.current?.value || prev.phone,
      }));
    }, 100);
    return () => clearTimeout(timer);
  }, [step]);

  const [form, setForm] = useState({
    serviceType:   '' as ServiceSlug,
    hvacIssue:     '',
    applianceType: '',
    description:   '',
    urgency:       'STANDARD' as Urgency,
    postalCode:    '',
    name:          '',
    phone:         '',
    smsConsent:    false,
    estimatedSchedule: 'THIS_WEEK',
  });

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const setUrgency = (u: Urgency) =>
    setForm(prev => ({ ...prev, urgency: u, estimatedSchedule: SCHEDULE_MAP[u] }));

  // ── validation ────────────────────────────────────────────────────────────
  const step2Valid = (() => {
    if (form.serviceType === 'hvac')             return form.hvacIssue !== '';
    if (form.serviceType === 'handyman')         return form.hvacIssue !== '';
    if (form.serviceType === 'appliance-repair') return form.applianceType !== '';
    if (form.serviceType === 'plumbing')         return form.hvacIssue !== '';
    if (form.serviceType === 'electrical')       return form.hvacIssue !== '';
    if (form.serviceType === 'smart-home')       return form.hvacIssue !== '';
    return false;
  })();

  const postalOk       = isValidPostal(form.postalCode);
  const postalTooLong  = form.postalCode.replace(/\s+/g, '').length >= 6 && !postalOk;
  const postalCity     = postalOk ? getCityForPrefix(getPrefix(form.postalCode)) : null;
  const step3Valid     = postalOk && form.name.trim() !== '' && form.phone.trim() !== '' && form.smsConsent;

  // ── submission ────────────────────────────────────────────────────────────
  const buildDescription = () => {
    if (form.serviceType === 'hvac')
      return [form.hvacIssue, form.description.trim()].filter(Boolean).join(' — ');
    if (form.serviceType === 'handyman')
      return [form.hvacIssue, form.description.trim()].filter(Boolean).join(' — ');
    if (form.serviceType === 'appliance-repair')
      return `${form.applianceType}${form.description.trim() ? `: ${form.description.trim()}` : ''}`;
    if (form.serviceType === 'plumbing')
      return [form.hvacIssue, form.description.trim()].filter(Boolean).join(' — ');
    if (form.serviceType === 'electrical')
      return [form.hvacIssue, form.description.trim()].filter(Boolean).join(' — ');
    if (form.serviceType === 'smart-home')
      return [form.hvacIssue, form.description.trim()].filter(Boolean).join(' — ');
    return form.description.trim();
  };

  // Step 3 → 4: send OTP, go to verification step
  const handleSendOtp = async () => {
    setOtpSending(true);
    setSubmitError(null);
    try {
      await sendOtp({ phone: form.phone });
      setStep(4);
      setOtpCode('');
      setOtpError(null);
    } catch (err: any) {
      setSubmitError(err?.message || 'Could not send verification code. Please try again.');
    } finally {
      setOtpSending(false);
    }
  };

  // Step 4: verify OTP, then submit service request
  const handleVerifyAndSubmit = async () => {
    setOtpVerifying(true);
    setOtpError(null);
    try {
      await verifyOtp({ phone: form.phone, code: otpCode });
    } catch (err: any) {
      setOtpError(err?.message || 'Incorrect code. Please try again.');
      setOtpVerifying(false);
      return;
    }

    try {
      await submitRequest({
        name:                  form.name,
        phone:                 form.phone,
        postalCode:            form.postalCode,
        description:           buildDescription(),
        urgency:               form.urgency,
        serviceType:           form.serviceType || undefined,
        estimatedSchedule:     form.estimatedSchedule,
        preferredTime:         'ANYTIME',
        smsConsentGiven:       form.smsConsent,
        smsConsentFormVersion: 'v1',
      });
      setStep(5);
    } catch (err: any) {
      setOtpError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpSending(true);
    setOtpError(null);
    try {
      await sendOtp({ phone: form.phone });
      setOtpError(null);
    } catch (err: any) {
      setOtpError(err?.message || 'Could not resend code.');
    } finally {
      setOtpSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface-base)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* progress — only on data-entry steps */}
        {step >= 1 && step <= 4 && <ProgressBar step={step} />}
        {step >= 2 && step <= 4 && <BackButton onClick={() => setStep(s => s - 1)} />}

        <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-300">

          {/* ── STEP 1: Category ─────────────────────────────────────────── */}
          {step === 1 && (
            <div>
              <h1 className="text-3xl font-black text-foreground mb-1">What do you need help with?</h1>
              <p className="text-sm text-[var(--text-secondary)] mb-8">Tap to get started.</p>
              <div className="flex flex-col gap-3">
                {SERVICE_CARDS.map(card => (
                  <button
                    key={card.slug}
                    type="button"
                    onClick={() => { set('serviceType', card.slug); setStep(2); }}
                    className="w-full flex items-center gap-4 p-5 rounded-[24px] border-2 border-[var(--border-default)] bg-[var(--surface-base)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 text-left transition-all duration-200 active:scale-[0.98]"
                  >
                    <span className="text-4xl shrink-0">{card.icon}</span>
                    <div>
                      <p className="text-lg font-black text-foreground">{card.label}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{card.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Job details ──────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <h1 className="text-3xl font-black text-foreground mb-6">
                {form.serviceType === 'hvac'            ? "What's the issue?"
                : form.serviceType === 'handyman'       ? 'What needs fixing?'
                : form.serviceType === 'appliance-repair' ? 'Which appliance?'
                : form.serviceType === 'plumbing'       ? "What's the problem?"
                : form.serviceType === 'electrical'     ? "What needs attention?"
                : form.serviceType === 'smart-home'     ? "What would you like set up?"
                : "Tell us more"}
              </h1>

              {/* HVAC — compact chips */}
              {form.serviceType === 'hvac' && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {HVAC_CHIPS.map(issue => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => set('hvacIssue', issue)}
                      className={chipCls(form.hvacIssue === issue)}
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              )}

              {/* Handyman — compact chips */}
              {form.serviceType === 'handyman' && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {HANDYMAN_CHIPS.map(task => (
                    <button
                      key={task}
                      type="button"
                      onClick={() => set('hvacIssue', task)}
                      className={chipCls(form.hvacIssue === task)}
                    >
                      {task}
                    </button>
                  ))}
                </div>
              )}

              {/* Appliance — compact chips */}
              {form.serviceType === 'appliance-repair' && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {APPLIANCE_CHIPS.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set('applianceType', t)}
                      className={chipCls(form.applianceType === t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}

              {/* Plumbing chips */}
              {form.serviceType === 'plumbing' && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {PLUMBING_CHIPS.map(issue => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => set('hvacIssue', issue)}
                      className={chipCls(form.hvacIssue === issue)}
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              )}

              {/* Electrical chips */}
              {form.serviceType === 'electrical' && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {ELECTRICAL_CHIPS.map(issue => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => set('hvacIssue', issue)}
                      className={chipCls(form.hvacIssue === issue)}
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              )}

              {/* Smart Home chips */}
              {form.serviceType === 'smart-home' && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {SMART_HOME_CHIPS.map(issue => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => set('hvacIssue', issue)}
                      className={chipCls(form.hvacIssue === issue)}
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              )}

              {/* Optional details textarea — always shown, never required */}
              <textarea
                placeholder="Anything else to add? (optional)"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={3}
                className={inputCls + ' resize-none'}
              />

              {/* Urgency — 3 inline chips */}
              <div className="mt-6">
                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">How soon?</p>
                <div className="flex gap-2">
                  {URGENCY_CHIPS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setUrgency(opt.value)}
                      className={chipCls(form.urgency === opt.value) + ' flex-1 flex flex-col items-center py-3 px-2'}
                    >
                      <span className="text-xl mb-0.5">{opt.icon}</span>
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" onClick={() => setStep(3)} disabled={!step2Valid} className={ctaCls}>
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 3: Location + Contact ────────────────────────────────── */}
          {step === 3 && (
            <div>
              <h1 className="text-3xl font-black text-foreground mb-1">Where and how to reach you</h1>
              <p className="text-sm text-[var(--text-secondary)] mb-8">A pro will text you within 15 minutes.</p>

              <div className="flex flex-col gap-4">
                {/* Postal code */}
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">
                    Postal code
                  </label>
                  <input
                    ref={postalRef}
                    type="text"
                    maxLength={7}
                    placeholder="L6H 1A1"
                    value={form.postalCode}
                    onChange={e => set('postalCode', e.target.value.toUpperCase())}
                    className={inputCls}
                  />
                  {postalOk && postalCity && (
                    <p className="mt-2 text-sm text-[var(--accent)] font-bold">✓ We serve {postalCity}</p>
                  )}
                  {postalTooLong && (
                    <div className="mt-3 p-4 rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-overlay)]">
                      <p className="text-sm text-foreground font-bold mb-2">We're not in your area yet — expanding soon.</p>
                      {!notifyDone ? (
                        <form onSubmit={async e => {
                          e.preventDefault();
                          if (!notifyEmail.trim()) return;
                          setNotifySubmitting(true);
                          try {
                            await submitLeadFn({
                              name: form.name || 'Anonymous',
                              email: notifyEmail.trim(),
                              postalCode: form.postalCode,
                              serviceType: form.serviceType,
                              source: 'OUT_OF_AREA_NOTIFY',
                            });
                            setNotifyDone(true);
                          } catch {
                            setNotifyDone(true); // still show success to user
                          } finally {
                            setNotifySubmitting(false);
                          }
                        }} className="flex gap-2">
                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={notifyEmail}
                            onChange={e => setNotifyEmail(e.target.value)}
                            className="flex-1 p-3 rounded-[12px] border border-[var(--border-default)] bg-[var(--surface-base)] text-foreground text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                          />
                          <button
                            type="submit"
                            disabled={notifySubmitting}
                            className="px-4 py-2 bg-[var(--accent)] text-black text-sm font-black rounded-[12px] hover:opacity-90 transition-all disabled:opacity-50"
                          >
                            {notifySubmitting ? '…' : 'Notify me'}
                          </button>
                        </form>
                      ) : (
                        <p className="text-sm text-[var(--text-secondary)]">Got it — we'll let you know!</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">
                    First name
                  </label>
                  <input
                    ref={nameRef}
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className={inputCls}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">
                    Mobile number
                  </label>
                  <input
                    ref={phoneRef}
                    type="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* CASL consent */}
              <label className="mt-5 flex items-start gap-3 p-4 rounded-[18px] border-2 border-[var(--border-default)] bg-[var(--surface-overlay)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.smsConsent}
                  onChange={e => set('smsConsent', e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--accent)]"
                />
                <span className="text-sm text-foreground">
                  I agree to receive text updates from Worki about this request.
                  <span className="block text-xs text-[var(--text-secondary)] mt-1">Reply STOP anytime. Standard rates may apply.</span>
                </span>
              </label>

              {submitError && (
                <p className="mt-4 text-sm text-red-400">{submitError}</p>
              )}

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={!step3Valid || otpSending}
                className={ctaCls}
              >
                {otpSending ? 'Sending code…' : 'Verify my number →'}
              </button>
            </div>
          )}

          {/* ── STEP 4: OTP Verification ─────────────────────────────────── */}
          {step === 4 && (
            <div>
              <h1 className="text-3xl font-black text-foreground mb-1">Verify your number</h1>
              <p className="text-sm text-[var(--text-secondary)] mb-8">
                We sent a 6-digit code to {form.phone}. Enter it below to confirm your request.
              </p>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">
                  Verification code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={inputCls + ' text-center text-2xl font-black tracking-[0.5em]'}
                  autoFocus
                />
              </div>

              {otpError && (
                <p className="mt-4 text-sm text-red-400">{otpError}</p>
              )}

              <button
                type="button"
                onClick={handleVerifyAndSubmit}
                disabled={otpCode.length < 6 || otpVerifying}
                className={ctaCls}
              >
                {otpVerifying ? 'Verifying…' : 'Confirm & submit request'}
              </button>

              <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
                Didn't receive it?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={otpSending}
                  className="font-bold underline hover:text-foreground transition-colors"
                >
                  Resend code
                </button>
              </p>
            </div>
          )}

          {/* ── STEP 5: Confirmation ─────────────────────────────────────── */}
          {step === 5 && (
            <div className="text-center py-8">
              <div className="mx-auto w-20 h-20 rounded-full bg-[var(--accent)]/10 border-2 border-[var(--accent)] flex items-center justify-center mb-6">
                <span className="text-4xl font-black" style={{ color: 'var(--accent)' }}>✓</span>
              </div>
              <h1 className="text-3xl font-black text-foreground mb-3">Your request is in.</h1>
              <p className="text-base text-[var(--text-secondary)] max-w-sm mx-auto mb-8">
                Matching you with a verified{' '}
                {form.serviceType ? SERVICE_DISPLAY[form.serviceType as Exclude<ServiceSlug, ''>] : 'service'}{' '}
                pro near {form.postalCode}. Expect a text within 15 minutes.
              </p>

              <div className="h-px bg-[var(--border-default)] my-6" />

              <p className="text-xs text-[var(--text-secondary)] mb-4">
                You earn points when your job is completed. No extra steps.
              </p>
              <button
                type="button"
                onClick={() => navigate(user ? '/dashboard' : '/signup')}
                className="text-sm font-bold hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                {user ? 'Go to your dashboard →' : 'Create a free account →'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
