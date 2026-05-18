import React, { useState, useRef, useEffect } from 'react';
import { useAction, submitServiceRequest, sendOtp, verifyOtp, submitLead } from 'wasp/client/operations';
import { useNavigate } from 'react-router';
import { useAuth } from 'wasp/client/auth';
import { ACTIVE_PREFIXES, getCityForPrefix } from '../shared/geoConfig';

type ServiceSlug = 'hvac' | 'handyman' | 'appliance-repair' | 'plumbing' | 'electrical' | 'smart-home' | '';
type Urgency = 'EMERGENCY' | 'STANDARD' | 'PLANNED';

// ── Qualifier Questions ────────────────────────────────────────────────────────
interface QualifierConfig {
  q1: { label: string; options: string[] };
  q2: { label: string; options: string[] };
}

const QUALIFIER_QUESTIONS: Record<Exclude<ServiceSlug, ''>, QualifierConfig> = {
  'hvac': {
    q1: { label: 'Is this a repair or maintenance?', options: ['Repair', 'Maintenance'] },
    q2: { label: 'What type of system?', options: ['Furnace', 'AC', 'Both'] },
  },
  'plumbing': {
    q1: { label: 'Is water actively leaking?', options: ['Yes, leaking now', 'No active leak'] },
    q2: { label: 'Where is the issue?', options: ['Kitchen', 'Bathroom', 'Basement', 'Outside'] },
  },
  'electrical': {
    q1: { label: 'What type of work?', options: ['Outage / not working', 'New install'] },
    q2: { label: 'Which area?', options: ['Whole home', 'Single room', 'Outdoor'] },
  },
  'appliance-repair': {
    q1: { label: 'Which appliance?', options: ['Fridge', 'Washer', 'Dryer', 'Dishwasher', 'Oven', 'Other'] },
    q2: { label: 'Brand (optional)', options: ['Samsung', 'LG', 'Whirlpool', 'GE', 'Other', 'Not sure'] },
  },
  'handyman': {
    q1: { label: 'What type of work?', options: ['Repair', 'Install / mount', 'Assembly', 'Other'] },
    q2: { label: 'How soon do you need this done?', options: ['Same-day', 'This week', 'Flexible'] },
  },
  'smart-home': {
    q1: { label: 'Install or troubleshoot?', options: ['New install', 'Troubleshoot existing'] },
    q2: { label: 'What type of device?', options: ['Thermostat', 'Camera / doorbell', 'Locks', 'Lighting', 'Wi-Fi', 'Other'] },
  },
};

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
  'w-full p-4 rounded-[18px] border-2 border-[#E2E8F0] bg-white ' +
  'text-foreground placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none transition-colors';

const chipCls = (active: boolean) =>
  `px-4 py-2.5 rounded-full border-2 text-sm font-bold transition-all duration-150 active:scale-95 cursor-pointer ` +
  (active
    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
    : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#2563EB]/50');

const ctaCls =
  'w-full py-4 bg-[#2563EB] text-white font-black rounded-[22px] mt-8 ' +
  'hover:bg-[#1D4ED8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

const TOTAL_STEPS = 4;

function ProgressBar({ step }: { step: number }) {
  const stepLabels = ['Service', 'Details', 'Contact', 'Verify'];
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-[#475569] uppercase tracking-widest">
          Step {step} of {TOTAL_STEPS}
        </span>
        <span className="text-xs font-semibold text-[#2563EB]">
          {stepLabels[step - 1]}
        </span>
      </div>
      <div className="h-1.5 bg-[#E2E8F0] rounded-full">
        <div
          className="h-1.5 bg-[#2563EB] rounded-full transition-all duration-500"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
      {/* Trust signal */}
      <div className="mt-3 flex items-center gap-4 text-xs text-[#475569]">
        <span className="flex items-center gap-1">
          <span className="text-[#22C55E]">✓</span> 100% Free
        </span>
        <span className="flex items-center gap-1">
          <span className="text-[#22C55E]">✓</span> Verified Pros
        </span>
        <span className="flex items-center gap-1">
          <span className="text-[#22C55E]">✓</span> Same-Day Available
        </span>
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 text-sm font-bold text-[#475569] hover:text-foreground transition-colors"
    >
      ← Back
    </button>
  );
}

// ── Qualifier radio button group ────────────────────────────────────────────
function QualifierQuestion({
  label,
  options,
  value,
  onChange,
  isOptional = false,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  isOptional?: boolean;
}) {
  return (
    <div className="mb-6">
      <p className="text-sm font-bold text-[#0F172A] mb-3">
        {label}
        {isOptional && <span className="font-normal text-[#475569] ml-1">(optional)</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={
              'px-4 py-3 rounded-[14px] border-2 text-sm font-bold transition-all duration-150 active:scale-95 cursor-pointer min-w-[80px] ' +
              (value === opt
                ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#2563EB]/50')
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
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
    qualifierQ1:   '',
    qualifierQ2:   '',
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
  // Q1 is always required, Q2 is optional for appliance-repair (brand)
  const qualifiersValid = (() => {
    if (!form.serviceType) return false;
    const q1Valid = form.qualifierQ1 !== '';
    // For appliance-repair, Q2 (brand) is optional
    const q2Valid = form.serviceType === 'appliance-repair' || form.qualifierQ2 !== '';
    return q1Valid && q2Valid;
  })();

  const step2Valid = (() => {
    if (!qualifiersValid) return false;
    if (form.serviceType === 'hvac')             return form.hvacIssue !== '';
    if (form.serviceType === 'handyman')         return form.hvacIssue !== '';
    if (form.serviceType === 'appliance-repair') return true; // Q1 already captures appliance
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
    // Build qualifier context from Q1/Q2 answers
    const qualifierParts: string[] = [];
    if (form.qualifierQ1) qualifierParts.push(form.qualifierQ1);
    if (form.qualifierQ2 && form.qualifierQ2 !== 'Not sure') qualifierParts.push(form.qualifierQ2);
    const qualifierContext = qualifierParts.length > 0 ? `[${qualifierParts.join(' | ')}]` : '';

    if (form.serviceType === 'hvac')
      return [qualifierContext, form.hvacIssue, form.description.trim()].filter(Boolean).join(' - ');
    if (form.serviceType === 'handyman')
      return [qualifierContext, form.hvacIssue, form.description.trim()].filter(Boolean).join(' - ');
    if (form.serviceType === 'appliance-repair') {
      // Q1 is the appliance type, Q2 is brand
      const brandPart = form.qualifierQ2 && form.qualifierQ2 !== 'Not sure' ? ` (${form.qualifierQ2})` : '';
      return `${form.qualifierQ1}${brandPart}${form.description.trim() ? ': ' + form.description.trim() : ''}`;
    }
    if (form.serviceType === 'plumbing')
      return [qualifierContext, form.hvacIssue, form.description.trim()].filter(Boolean).join(' - ');
    if (form.serviceType === 'electrical')
      return [qualifierContext, form.hvacIssue, form.description.trim()].filter(Boolean).join(' - ');
    if (form.serviceType === 'smart-home')
      return [qualifierContext, form.hvacIssue, form.description.trim()].filter(Boolean).join(' - ');
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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* progress — only on data-entry steps */}
        {step >= 1 && step <= 4 && <ProgressBar step={step} />}
        {step >= 2 && step <= 4 && <BackButton onClick={() => setStep(s => s - 1)} />}

        <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-300">

          {/* ── STEP 1: Category ─────────────────────────────────────────── */}
          {step === 1 && (
            <div>
              <h1 className="text-3xl font-black text-foreground mb-1">Get Free Quotes in 2 Minutes</h1>
              <p className="text-sm text-[#475569] mb-2">Select a service to get matched with verified local pros.</p>
              <p className="text-xs text-[#22C55E] font-semibold mb-6">Join 500+ GTA homeowners who trust The Helper</p>
              <div className="flex flex-col gap-3">
                {SERVICE_CARDS.map(card => (
                  <button
                    key={card.slug}
                    type="button"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        serviceType: card.slug,
                        qualifierQ1: '',
                        qualifierQ2: '',
                        hvacIssue: '',
                        applianceType: '',
                      }));
                      setStep(2);
                    }}
                    className="w-full flex items-center gap-4 p-5 rounded-[24px] border-2 border-[#E2E8F0] bg-white hover:border-[#2563EB] hover:bg-[#EFF6FF] text-left transition-all duration-200 active:scale-[0.98]"
                  >
                    <span className="text-4xl shrink-0">{card.icon}</span>
                    <div>
                      <p className="text-lg font-black text-foreground">{card.label}</p>
                      <p className="text-sm text-[#475569]">{card.description}</p>
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
                {form.serviceType === 'hvac'            ? "Tell us about your HVAC needs"
                : form.serviceType === 'handyman'       ? 'Tell us about the job'
                : form.serviceType === 'appliance-repair' ? 'Tell us about your appliance'
                : form.serviceType === 'plumbing'       ? "Tell us about the plumbing issue"
                : form.serviceType === 'electrical'     ? "Tell us about the electrical work"
                : form.serviceType === 'smart-home'     ? "Tell us about your smart home needs"
                : "Tell us more"}
              </h1>

              {/* Qualifier Questions - shown for all categories */}
              {form.serviceType && QUALIFIER_QUESTIONS[form.serviceType] && (
                <>
                  <QualifierQuestion
                    label={QUALIFIER_QUESTIONS[form.serviceType].q1.label}
                    options={QUALIFIER_QUESTIONS[form.serviceType].q1.options}
                    value={form.qualifierQ1}
                    onChange={v => set('qualifierQ1', v)}
                  />
                  {/* Show Q2 after Q1 is answered (except for appliance-repair where it's always shown) */}
                  {(form.qualifierQ1 || form.serviceType === 'appliance-repair') && (
                    <QualifierQuestion
                      label={QUALIFIER_QUESTIONS[form.serviceType].q2.label}
                      options={QUALIFIER_QUESTIONS[form.serviceType].q2.options}
                      value={form.qualifierQ2}
                      onChange={v => set('qualifierQ2', v)}
                      isOptional={form.serviceType === 'appliance-repair'}
                    />
                  )}
                </>
              )}

              {/* Category-specific detail chips - shown after qualifiers are answered */}
              {/* HVAC — compact chips */}
              {form.serviceType === 'hvac' && qualifiersValid && (
                <>
                  <p className="text-sm font-bold text-[#0F172A] mb-3">What best describes the issue?</p>
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
                </>
              )}

              {/* Handyman — compact chips */}
              {form.serviceType === 'handyman' && qualifiersValid && (
                <>
                  <p className="text-sm font-bold text-[#0F172A] mb-3">What needs to be done?</p>
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
                </>
              )}

              {/* Appliance — Q1 now captures appliance type, so no separate chips needed */}

              {/* Plumbing chips */}
              {form.serviceType === 'plumbing' && qualifiersValid && (
                <>
                  <p className="text-sm font-bold text-[#0F172A] mb-3">What best describes the problem?</p>
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
                </>
              )}

              {/* Electrical chips */}
              {form.serviceType === 'electrical' && qualifiersValid && (
                <>
                  <p className="text-sm font-bold text-[#0F172A] mb-3">What needs attention?</p>
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
                </>
              )}

              {/* Smart Home chips */}
              {form.serviceType === 'smart-home' && qualifiersValid && (
                <>
                  <p className="text-sm font-bold text-[#0F172A] mb-3">What would you like set up?</p>
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
                </>
              )}

              {/* Optional details textarea — shown after qualifiers are answered */}
              {qualifiersValid && (
                <textarea
                  placeholder="Anything else to add? (optional)"
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={3}
                  className={inputCls + ' resize-none'}
                />
              )}

              {/* Urgency — 3 inline chips — shown after qualifiers */}
              {qualifiersValid && (
                <div className="mt-6">
                  <p className="text-xs font-bold text-[#475569] uppercase tracking-widest mb-3">How soon?</p>
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
              )}

              <button type="button" onClick={() => setStep(3)} disabled={!step2Valid} className={ctaCls}>
                Continue to Get Matched
              </button>

              {/* Value prop reminder */}
              <p className="mt-4 text-center text-xs text-[#475569]">
                Most homeowners get matched within 15 minutes
              </p>
            </div>
          )}

          {/* ── STEP 3: Location + Contact ────────────────────────────────── */}
          {step === 3 && (
            <div>
              <h1 className="text-3xl font-black text-foreground mb-1">Almost there!</h1>
              <p className="text-sm text-[#475569] mb-2">A verified pro will text you within 15 minutes.</p>
              <p className="text-xs text-[#22C55E] font-semibold mb-6">100% free for homeowners. No credit card required.</p>

              <div className="flex flex-col gap-4">
                {/* Postal code */}
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-widest mb-2">
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
                    <p className="mt-2 text-sm text-[#2563EB] font-bold">✓ We serve {postalCity}</p>
                  )}
                  {postalTooLong && (
                    <div className="mt-3 p-4 rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC]">
                      <p className="text-sm text-foreground font-bold mb-2">We're not in your area yet, but we're expanding soon.</p>
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
                            className="flex-1 p-3 rounded-[12px] border border-[#E2E8F0] bg-white text-foreground text-sm placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
                          />
                          <button
                            type="submit"
                            disabled={notifySubmitting}
                            className="px-4 py-2 bg-[#2563EB] text-white text-sm font-black rounded-[12px] hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
                          >
                            {notifySubmitting ? '…' : 'Notify me'}
                          </button>
                        </form>
                      ) : (
                        <p className="text-sm text-[#475569]">Got it, we'll let you know!</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-widest mb-2">
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
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-widest mb-2">
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
              <label className="mt-5 flex items-start gap-3 p-4 rounded-[18px] border-2 border-[#E2E8F0] bg-[#F8FAFC] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.smsConsent}
                  onChange={e => set('smsConsent', e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-[#2563EB]"
                />
                <span className="text-sm text-foreground">
                  I agree to receive text updates from The Helper about this request.
                  <span className="block text-xs text-[#475569] mt-1">Reply STOP anytime. Standard rates may apply.</span>
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
                {otpSending ? 'Sending code…' : 'Get Free Quotes Now'}
              </button>

              {/* Urgency/trust reminder */}
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[#475569]">
                <span>Same-day service available</span>
                <span className="text-[#E2E8F0]">|</span>
                <span>No spam, ever</span>
              </div>
            </div>
          )}

          {/* ── STEP 4: OTP Verification ─────────────────────────────────── */}
          {step === 4 && (
            <div>
              <h1 className="text-3xl font-black text-foreground mb-1">Verify your number</h1>
              <p className="text-sm text-[#475569] mb-8">
                We sent a 6-digit code to {form.phone}. Enter it below to confirm your request.
              </p>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-widest mb-2">
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
                {otpVerifying ? 'Submitting...' : 'Get My Free Quotes'}
              </button>

              <p className="mt-4 text-center text-sm text-[#475569]">
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
              <div className="mx-auto w-20 h-20 rounded-full bg-[#DCFCE7] border-2 border-[#22C55E] flex items-center justify-center mb-6">
                <span className="text-4xl font-black text-[#22C55E]">✓</span>
              </div>
              <h1 className="text-3xl font-black text-foreground mb-3">You're All Set!</h1>
              <p className="text-base text-[#475569] max-w-sm mx-auto mb-4">
                A verified{' '}
                {form.serviceType ? SERVICE_DISPLAY[form.serviceType as Exclude<ServiceSlug, ''>] : 'service'}{' '}
                pro will text you within <strong className="text-[#0F172A]">15 minutes</strong>.
              </p>

              {/* What happens next */}
              <div className="bg-[#F8FAFC] rounded-[18px] border border-[#E2E8F0] p-5 mb-6 text-left">
                <p className="text-xs font-bold text-[#475569] uppercase tracking-widest mb-3">What happens next</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center">1</span>
                    <p className="text-sm text-[#475569]">A verified pro reviews your request</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center">2</span>
                    <p className="text-sm text-[#475569]">They text you to confirm details and schedule</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center">3</span>
                    <p className="text-sm text-[#475569]">Book your appointment (same-day available)</p>
                  </div>
                </div>
              </div>

              {/* Rewards teaser */}
              <div className="bg-[#FEF3C7] rounded-[18px] border border-[#FDE68A] p-4 mb-6">
                <p className="text-sm font-bold text-[#92400E] mb-1">You're earning rewards!</p>
                <p className="text-xs text-[#92400E]">
                  Earn up to <strong>$60 back</strong> on your first completed job. Create an account to track your points.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(user ? '/dashboard' : '/signup')}
                className="w-full py-4 bg-[#2563EB] text-white font-black rounded-[22px] hover:bg-[#1D4ED8] transition-colors"
              >
                {user ? 'Track Your Request' : 'Create Free Account & Track Rewards'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="mt-3 text-sm font-bold text-[#475569] hover:text-[#0F172A] transition-colors"
              >
                Back to Home
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
