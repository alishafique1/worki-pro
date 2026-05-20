import React from 'react';
import { Navigate, useSearchParams } from 'react-router';
// Legacy flow — redirect to the new guest wizard, preserving query params
export default function RequestServicePage() {
    const [searchParams] = useSearchParams();
    const params = searchParams.toString();
    return <Navigate to={`/get-quotes${params ? `?${params}` : ''}`} replace/>;
}
// ── below is the original implementation, kept for reference ──────────────────
import { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery, submitServiceRequest, sendOtp, verifyOtp, submitLead, getServiceCategories } from 'wasp/client/operations';
import { useNavigate } from 'react-router';
import { useAuth } from 'wasp/client/auth';
import { ACTIVE_PREFIXES, getCityForPrefix } from '../shared/geoConfig';
import { getQualifiersForCategory, LIVE_CATEGORY_SLUGS } from './categoryQualifiers';
import { AirVent, Hammer, WashingMachine, ShowerHead, PlugZap, Wifi, Sparkles, Brush, Layers, Home, Leaf, Wind, TreePine, Bug, KeyRound, Droplets, MoveRight, Package, Trash2, ShieldCheck, ClipboardList, Fence, Waves, PartyPopper, Loader2, CheckCircle, } from 'lucide-react';
// ── Icon mapping from DB icon names to Lucide components ────────────────────
const ICON_MAP = {
    AirVent,
    Hammer,
    WashingMachine,
    ShowerHead,
    PlugZap,
    Wifi,
    Sparkles,
    Brush,
    Layers,
    Home,
    Leaf,
    Wind,
    TreePine,
    Bug,
    KeyRound,
    Droplets,
    MoveRight,
    Package,
    Trash2,
    ShieldCheck,
    ClipboardList,
    Fence,
    Waves,
    PartyPopper,
};
function CategoryIcon({ iconName, className = '' }) {
    if (!iconName)
        return <Home className={className}/>;
    const IconComponent = ICON_MAP[iconName] || Home;
    return <IconComponent className={className}/>;
}
const URGENCY_CHIPS = [
    { value: 'EMERGENCY', icon: '!', label: 'Urgent' },
    { value: 'STANDARD', icon: '-', label: 'This week' },
    { value: 'PLANNED', icon: '+', label: 'Flexible' },
];
const SCHEDULE_MAP = {
    EMERGENCY: 'ASAP',
    STANDARD: 'THIS_WEEK',
    PLANNED: 'FLEXIBLE',
};
const getPrefix = (v) => v.replace(/\s+/g, '').toUpperCase().slice(0, 3);
const isValidPostal = (v) => v.replace(/\s+/g, '').length >= 6 && ACTIVE_PREFIXES.has(getPrefix(v));
// ── shared style atoms ────────────────────────────────────────────────────────
const inputCls = 'w-full p-4 rounded-[18px] border-2 border-[#E2E8F0] bg-white ' +
    'text-foreground placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none transition-colors';
const chipCls = (active) => `px-4 py-2.5 rounded-full border-2 text-sm font-bold transition-all duration-150 active:scale-95 cursor-pointer ` +
    (active
        ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
        : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#2563EB]/50');
const ctaCls = 'w-full py-4 bg-[#2563EB] text-white font-black rounded-[22px] mt-8 ' +
    'hover:bg-[#1D4ED8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
const TOTAL_STEPS = 4;
function ProgressBar({ step }) {
    const stepLabels = ['Service', 'Details', 'Contact', 'Verify'];
    return (<div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-[#475569] uppercase tracking-widest">
          Step {step} of {TOTAL_STEPS}
        </span>
        <span className="text-xs font-semibold text-[#2563EB]">
          {stepLabels[step - 1]}
        </span>
      </div>
      <div className="h-1.5 bg-[#E2E8F0] rounded-full">
        <div className="h-1.5 bg-[#2563EB] rounded-full transition-all duration-500" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}/>
      </div>
      {/* Trust signal */}
      <div className="mt-3 flex items-center gap-4 text-xs text-[#475569]">
        <span className="flex items-center gap-1">
          <CheckCircle className="size-3 text-[#22C55E]"/> 100% Free
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="size-3 text-[#22C55E]"/> Verified Pros
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="size-3 text-[#22C55E]"/> Same-Day Available
        </span>
      </div>
    </div>);
}
function BackButton({ onClick }) {
    return (<button type="button" onClick={onClick} className="mb-4 text-sm font-bold text-[#475569] hover:text-foreground transition-colors">
      Back
    </button>);
}
// ── Qualifier radio button group ────────────────────────────────────────────
function QualifierQuestion({ label, options, value, onChange, isOptional = false, }) {
    return (<div className="mb-6">
      <p className="text-sm font-bold text-[#0F172A] mb-3">
        {label}
        {isOptional && <span className="font-normal text-[#475569] ml-1">(optional)</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (<button key={opt} type="button" onClick={() => onChange(opt)} className={'px-4 py-3 rounded-[14px] border-2 text-sm font-bold transition-all duration-150 active:scale-95 cursor-pointer min-w-[80px] ' +
                (value === opt
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                    : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#2563EB]/50')}>
            {opt}
          </button>))}
      </div>
    </div>);
}
// ── main component ────────────────────────────────────────────────────────────
export default function RequestServicePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { data: user } = useAuth();
    // Fetch service categories from DB
    const { data: categories, isLoading: categoriesLoading } = useQuery(getServiceCategories);
    // Filter to get only parent (top-level) categories that are live
    const parentCategories = useMemo(() => {
        if (!categories)
            return [];
        return categories
            .filter(c => !c.parentCategoryId && LIVE_CATEGORY_SLUGS.includes(c.slug))
            .sort((a, b) => {
            // Sort by the order in LIVE_CATEGORY_SLUGS
            const aIdx = LIVE_CATEGORY_SLUGS.indexOf(a.slug);
            const bIdx = LIVE_CATEGORY_SLUGS.indexOf(b.slug);
            return aIdx - bIdx;
        });
    }, [categories]);
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [notifyEmail, setNotifyEmail] = useState('');
    const [notifyDone, setNotifyDone] = useState(false);
    const [notifySubmitting, setNotifySubmitting] = useState(false);
    // OTP step state
    const [otpCode, setOtpCode] = useState('');
    const [otpError, setOtpError] = useState(null);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [otpSending, setOtpSending] = useState(false);
    // Refs for step-3 inputs — used to sync browser autofill into React state
    const postalRef = useRef(null);
    const nameRef = useRef(null);
    const phoneRef = useRef(null);
    // When step 3 renders, give the browser 100 ms to autofill then sync DOM > state
    useEffect(() => {
        if (step !== 3)
            return;
        const timer = setTimeout(() => {
            setForm(prev => ({
                ...prev,
                postalCode: postalRef.current?.value.toUpperCase() || prev.postalCode,
                name: nameRef.current?.value || prev.name,
                phone: phoneRef.current?.value || prev.phone,
            }));
        }, 100);
        return () => clearTimeout(timer);
    }, [step]);
    const [form, setForm] = useState({
        serviceType: '',
        detailChip: '',
        qualifierQ1: '',
        qualifierQ2: '',
        description: '',
        urgency: 'STANDARD',
        postalCode: '',
        name: '',
        phone: '',
        smsConsent: false,
        estimatedSchedule: 'THIS_WEEK',
    });
    // Pre-select category from URL param ?category=hvac or ?service=hvac
    useEffect(() => {
        const slug = searchParams.get('category') || searchParams.get('service');
        if (slug && parentCategories.length > 0) {
            const matchedCategory = parentCategories.find(c => c.slug === slug);
            if (matchedCategory) {
                setForm(prev => ({
                    ...prev,
                    serviceType: matchedCategory.slug,
                    qualifierQ1: '',
                    qualifierQ2: '',
                    detailChip: '',
                }));
                setStep(2);
            }
        }
    }, [searchParams, parentCategories]);
    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
    const setUrgency = (u) => setForm(prev => ({ ...prev, urgency: u, estimatedSchedule: SCHEDULE_MAP[u] }));
    // Get current category and its qualifiers
    const currentCategory = useMemo(() => {
        return parentCategories.find(c => c.slug === form.serviceType);
    }, [parentCategories, form.serviceType]);
    const qualifierConfig = useMemo(() => {
        if (!form.serviceType)
            return null;
        return getQualifiersForCategory(form.serviceType);
    }, [form.serviceType]);
    // ── validation ────────────────────────────────────────────────────────────
    const qualifiersValid = useMemo(() => {
        if (!form.serviceType || !qualifierConfig)
            return false;
        const q1Valid = form.qualifierQ1 !== '';
        // Q2 is optional if marked as such in the config
        const q2Valid = !qualifierConfig.q2 || qualifierConfig.q2.isOptional || form.qualifierQ2 !== '';
        return q1Valid && q2Valid;
    }, [form.serviceType, form.qualifierQ1, form.qualifierQ2, qualifierConfig]);
    const step2Valid = useMemo(() => {
        if (!qualifiersValid)
            return false;
        // For categories with detail chips, require one to be selected (unless appliance-repair where Q1 captures it)
        if (qualifierConfig?.detailChips && form.serviceType !== 'appliance-repair') {
            return form.detailChip !== '';
        }
        return true;
    }, [qualifiersValid, qualifierConfig, form.detailChip, form.serviceType]);
    const postalOk = isValidPostal(form.postalCode);
    const postalTooLong = form.postalCode.replace(/\s+/g, '').length >= 6 && !postalOk;
    const postalCity = postalOk ? getCityForPrefix(getPrefix(form.postalCode)) : null;
    const step3Valid = postalOk && form.name.trim() !== '' && form.phone.trim() !== '' && form.smsConsent;
    // ── submission ────────────────────────────────────────────────────────────
    const buildDescription = () => {
        // Build qualifier context from Q1/Q2 answers
        const qualifierParts = [];
        if (form.qualifierQ1)
            qualifierParts.push(form.qualifierQ1);
        if (form.qualifierQ2 && form.qualifierQ2 !== 'Not sure')
            qualifierParts.push(form.qualifierQ2);
        const qualifierContext = qualifierParts.length > 0 ? `[${qualifierParts.join(' | ')}]` : '';
        if (form.serviceType === 'appliance-repair') {
            // Q1 is the appliance type, Q2 is brand
            const brandPart = form.qualifierQ2 && form.qualifierQ2 !== 'Not sure' ? ` (${form.qualifierQ2})` : '';
            return `${form.qualifierQ1}${brandPart}${form.description.trim() ? ': ' + form.description.trim() : ''}`;
        }
        return [qualifierContext, form.detailChip, form.description.trim()].filter(Boolean).join(' - ');
    };
    // Step 3 > 4: send OTP, go to verification step
    const handleSendOtp = async () => {
        setOtpSending(true);
        setSubmitError(null);
        try {
            await sendOtp({ phone: form.phone });
            setStep(4);
            setOtpCode('');
            setOtpError(null);
        }
        catch (err) {
            setSubmitError(err?.message || 'Could not send verification code. Please try again.');
        }
        finally {
            setOtpSending(false);
        }
    };
    // Step 4: verify OTP, then submit service request
    const handleVerifyAndSubmit = async () => {
        setOtpVerifying(true);
        setOtpError(null);
        try {
            await verifyOtp({ phone: form.phone, code: otpCode });
        }
        catch (err) {
            setOtpError(err?.message || 'Incorrect code. Please try again.');
            setOtpVerifying(false);
            return;
        }
        try {
            await submitServiceRequest({
                name: form.name,
                phone: form.phone,
                postalCode: form.postalCode,
                description: buildDescription(),
                urgency: form.urgency,
                serviceType: form.serviceType || undefined,
                estimatedSchedule: form.estimatedSchedule,
                preferredTime: 'ANYTIME',
                smsConsentGiven: form.smsConsent,
                smsConsentFormVersion: 'v1',
            });
            setStep(5);
        }
        catch (err) {
            setOtpError(err?.message || 'Something went wrong. Please try again.');
        }
        finally {
            setOtpVerifying(false);
        }
    };
    const handleResendOtp = async () => {
        setOtpSending(true);
        setOtpError(null);
        try {
            await sendOtp({ phone: form.phone });
            setOtpError(null);
        }
        catch (err) {
            setOtpError(err?.message || 'Could not resend code.');
        }
        finally {
            setOtpSending(false);
        }
    };
    // Loading state while categories fetch
    if (categoriesLoading) {
        return (<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 text-[#2563EB] animate-spin"/>
          <p className="text-sm text-[#475569]">Loading services...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* progress — only on data-entry steps */}
        {step >= 1 && step <= 4 && <ProgressBar step={step}/>}
        {step >= 2 && step <= 4 && <BackButton onClick={() => setStep(s => s - 1)}/>}

        <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-300">

          {/* ── STEP 1: Category ─────────────────────────────────────────── */}
          {step === 1 && (<div>
              <h1 className="text-3xl font-black text-foreground mb-1">Get Free Quotes in 2 Minutes</h1>
              <p className="text-sm text-[#475569] mb-2">Select a service to get matched with verified local pros.</p>
              <p className="text-xs text-[#22C55E] font-semibold mb-6">Join 500+ GTA homeowners who trust The Helper</p>
              <div className="flex flex-col gap-3">
                {parentCategories.map(category => (<button key={category.id} type="button" onClick={() => {
                    setForm(prev => ({
                        ...prev,
                        serviceType: category.slug,
                        qualifierQ1: '',
                        qualifierQ2: '',
                        detailChip: '',
                    }));
                    setStep(2);
                }} className="w-full flex items-center gap-4 p-5 rounded-[24px] border-2 border-[#E2E8F0] bg-white hover:border-[#2563EB] hover:bg-[#EFF6FF] text-left transition-all duration-200 active:scale-[0.98]">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                      <CategoryIcon iconName={category.icon} className="size-7 text-[#2563EB]"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-black text-foreground">{category.name}</p>
                      <p className="text-sm text-[#475569] truncate">{category.description}</p>
                    </div>
                  </button>))}
              </div>
            </div>)}

          {/* ── STEP 2: Job details ──────────────────────────────────────── */}
          {step === 2 && currentCategory && (<div>
              <h1 className="text-3xl font-black text-foreground mb-6">
                Tell us about your {currentCategory.name.toLowerCase()} needs
              </h1>

              {/* Qualifier Questions - shown for all categories */}
              {qualifierConfig && (<>
                  <QualifierQuestion label={qualifierConfig.q1.label} options={qualifierConfig.q1.options} value={form.qualifierQ1} onChange={v => set('qualifierQ1', v)} isOptional={qualifierConfig.q1.isOptional}/>
                  {/* Show Q2 after Q1 is answered (or always for appliance-repair) */}
                  {qualifierConfig.q2 && (form.qualifierQ1 || form.serviceType === 'appliance-repair') && (<QualifierQuestion label={qualifierConfig.q2.label} options={qualifierConfig.q2.options} value={form.qualifierQ2} onChange={v => set('qualifierQ2', v)} isOptional={qualifierConfig.q2.isOptional}/>)}
                </>)}

              {/* Category-specific detail chips - shown after qualifiers are answered */}
              {qualifierConfig?.detailChips && qualifiersValid && form.serviceType !== 'appliance-repair' && (<>
                  <p className="text-sm font-bold text-[#0F172A] mb-3">
                    {qualifierConfig.detailChipsLabel || 'What best describes the issue?'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {qualifierConfig.detailChips.map(chip => (<button key={chip} type="button" onClick={() => set('detailChip', chip)} className={chipCls(form.detailChip === chip)}>
                        {chip}
                      </button>))}
                  </div>
                </>)}

              {/* Optional details textarea — shown after qualifiers are answered */}
              {qualifiersValid && (<textarea placeholder="Anything else to add? (optional)" value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={inputCls + ' resize-none'}/>)}

              {/* Urgency — 3 inline chips — shown after qualifiers */}
              {qualifiersValid && (<div className="mt-6">
                  <p className="text-xs font-bold text-[#475569] uppercase tracking-widest mb-3">How soon?</p>
                  <div className="flex gap-2">
                    {URGENCY_CHIPS.map(opt => (<button key={opt.value} type="button" onClick={() => setUrgency(opt.value)} className={chipCls(form.urgency === opt.value) + ' flex-1 flex flex-col items-center py-3 px-2'}>
                        <span className="text-xl mb-0.5 font-bold">{opt.icon}</span>
                        <span className="text-xs">{opt.label}</span>
                      </button>))}
                  </div>
                </div>)}

              <button type="button" onClick={() => setStep(3)} disabled={!step2Valid} className={ctaCls}>
                Continue to Get Matched
              </button>

              {/* Value prop reminder */}
              <p className="mt-4 text-center text-xs text-[#475569]">
                Most homeowners get matched within 15 minutes
              </p>
            </div>)}

          {/* ── STEP 3: Location + Contact ────────────────────────────────── */}
          {step === 3 && (<div>
              <h1 className="text-3xl font-black text-foreground mb-1">Almost there!</h1>
              <p className="text-sm text-[#475569] mb-2">A verified pro will text you within 15 minutes.</p>
              <p className="text-xs text-[#22C55E] font-semibold mb-6">100% free for homeowners. No credit card required.</p>

              <div className="flex flex-col gap-4">
                {/* Postal code */}
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-widest mb-2">
                    Postal code
                  </label>
                  <input ref={postalRef} type="text" maxLength={7} placeholder="L6H 1A1" value={form.postalCode} onChange={e => set('postalCode', e.target.value.toUpperCase())} className={inputCls}/>
                  {postalOk && postalCity && (<p className="mt-2 text-sm text-[#2563EB] font-bold">We serve {postalCity}</p>)}
                  {postalTooLong && (<div className="mt-3 p-4 rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC]">
                      <p className="text-sm text-foreground font-bold mb-2">We're not in your area yet, but we're expanding soon.</p>
                      {!notifyDone ? (<form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!notifyEmail.trim())
                            return;
                        setNotifySubmitting(true);
                        try {
                            await submitLead({
                                name: form.name || 'Anonymous',
                                email: notifyEmail.trim(),
                                postalCode: form.postalCode,
                                serviceType: form.serviceType,
                                source: 'OUT_OF_AREA_NOTIFY',
                            });
                            setNotifyDone(true);
                        }
                        catch {
                            setNotifyDone(true); // still show success to user
                        }
                        finally {
                            setNotifySubmitting(false);
                        }
                    }} className="flex gap-2">
                          <input type="email" placeholder="your@email.com" value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)} className="flex-1 p-3 rounded-[12px] border border-[#E2E8F0] bg-white text-foreground text-sm placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"/>
                          <button type="submit" disabled={notifySubmitting} className="px-4 py-2 bg-[#2563EB] text-white text-sm font-black rounded-[12px] hover:bg-[#1D4ED8] transition-colors disabled:opacity-50">
                            {notifySubmitting ? '...' : 'Notify me'}
                          </button>
                        </form>) : (<p className="text-sm text-[#475569]">Got it, we'll let you know!</p>)}
                    </div>)}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-widest mb-2">
                    First name
                  </label>
                  <input ref={nameRef} type="text" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls}/>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-widest mb-2">
                    Mobile number
                  </label>
                  <input ref={phoneRef} type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls}/>
                </div>
              </div>

              {/* CASL consent */}
              <label className="mt-5 flex items-start gap-3 p-4 rounded-[18px] border-2 border-[#E2E8F0] bg-[#F8FAFC] cursor-pointer">
                <input type="checkbox" checked={form.smsConsent} onChange={e => set('smsConsent', e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#2563EB]"/>
                <span className="text-sm text-foreground">
                  I agree to receive text updates from The Helper about this request.
                  <span className="block text-xs text-[#475569] mt-1">Reply STOP anytime. Standard rates may apply.</span>
                </span>
              </label>

              {submitError && (<p className="mt-4 text-sm text-red-400">{submitError}</p>)}

              <button type="button" onClick={handleSendOtp} disabled={!step3Valid || otpSending} className={ctaCls}>
                {otpSending ? 'Sending code...' : 'Get Free Quotes Now'}
              </button>

              {/* Urgency/trust reminder */}
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[#475569]">
                <span>Same-day service available</span>
                <span className="text-[#E2E8F0]">|</span>
                <span>No spam, ever</span>
              </div>
            </div>)}

          {/* ── STEP 4: OTP Verification ─────────────────────────────────── */}
          {step === 4 && (<div>
              <h1 className="text-3xl font-black text-foreground mb-1">Verify your number</h1>
              <p className="text-sm text-[#475569] mb-8">
                We sent a 6-digit code to {form.phone}. Enter it below to confirm your request.
              </p>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-widest mb-2">
                  Verification code
                </label>
                <input type="text" inputMode="numeric" maxLength={6} placeholder="123456" value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))} className={inputCls + ' text-center text-2xl font-black tracking-[0.5em]'} autoFocus/>
              </div>

              {otpError && (<p className="mt-4 text-sm text-red-400">{otpError}</p>)}

              <button type="button" onClick={handleVerifyAndSubmit} disabled={otpCode.length < 6 || otpVerifying} className={ctaCls}>
                {otpVerifying ? 'Submitting...' : 'Get My Free Quotes'}
              </button>

              <p className="mt-4 text-center text-sm text-[#475569]">
                Didn't receive it?{' '}
                <button type="button" onClick={handleResendOtp} disabled={otpSending} className="font-bold underline hover:text-foreground transition-colors">
                  Resend code
                </button>
              </p>
            </div>)}

          {/* ── STEP 5: Confirmation ─────────────────────────────────────── */}
          {step === 5 && (<div className="text-center py-8">
              <div className="mx-auto w-20 h-20 rounded-full bg-[#DCFCE7] border-2 border-[#22C55E] flex items-center justify-center mb-6">
                <span className="text-4xl font-black text-[#22C55E]">!</span>
              </div>
              <h1 className="text-3xl font-black text-foreground mb-3">You're All Set!</h1>
              <p className="text-base text-[#475569] max-w-sm mx-auto mb-4">
                A verified{' '}
                {currentCategory ? currentCategory.name.toLowerCase() : 'service'}{' '}
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

              <button type="button" onClick={() => navigate(user ? '/dashboard' : '/signup')} className="w-full py-4 bg-[#2563EB] text-white font-black rounded-[22px] hover:bg-[#1D4ED8] transition-colors">
                {user ? 'Track Your Request' : 'Create Free Account & Track Rewards'}
              </button>

              <button type="button" onClick={() => navigate('/')} className="mt-3 text-sm font-bold text-[#475569] hover:text-[#0F172A] transition-colors">
                Back to Home
              </button>
            </div>)}

        </div>
      </div>
    </div>);
}
//# sourceMappingURL=RequestServicePage.jsx.map