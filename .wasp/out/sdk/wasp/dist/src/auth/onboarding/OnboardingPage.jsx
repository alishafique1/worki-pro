import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'wasp/client/auth';
import { completeOnboarding } from 'wasp/client/operations';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import StepRole from './components/StepRole';
import StepProfile from './components/StepProfile';
import StepBusiness from './components/StepBusiness';
import CategoryCardGrid from './components/CategoryCardGrid';
import logo from '../../client/static/logo.webp';
import { isValidCanadianPhone, isValidCanadianPostal, isGtaPostal } from './validation';
const CONSUMER_STEPS = ['Your role', 'Your profile', 'Interests'];
const PROVIDER_STEPS = ['Your role', 'Your profile', 'Business', 'Services'];
export default function OnboardingPage() {
    const { data: user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [done, setDone] = useState(false);
    const [form, setForm] = useState({
        role: null,
        firstName: '',
        lastName: '',
        phone: '',
        postalCode: '',
        smsConsent: false,
        businessName: '',
        serviceAreas: '',
        referralCode: '',
        interestCategoryIds: [],
        serviceCategoryIds: [],
    });
    const getDashboardPath = (role) => role === 'PROVIDER' ? '/provider/dashboard' : '/account';
    useEffect(() => {
        const savedForm = sessionStorage.getItem('onboardingForm');
        const savedStep = sessionStorage.getItem('onboardingStep');
        let restoredRole = null;
        if (savedForm) {
            try {
                const parsedForm = JSON.parse(savedForm);
                setForm(parsedForm);
                restoredRole = parsedForm.role;
            }
            catch { /* ignore */ }
        }
        if (savedStep) {
            const parsed = parseInt(savedStep, 10);
            const maxForRole = restoredRole === 'PROVIDER' ? 4 : 3;
            if (parsed >= 1 && parsed <= maxForRole)
                setStep(parsed);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        sessionStorage.setItem('onboardingForm', JSON.stringify(form));
        sessionStorage.setItem('onboardingStep', String(step));
    }, [form, step]);
    useEffect(() => {
        if (user && user.firstName && !done) {
            sessionStorage.removeItem('onboardingForm');
            sessionStorage.removeItem('onboardingStep');
            navigate(getDashboardPath(user.role ?? null));
        }
    }, [user, navigate, done]);
    const isProvider = form.role === 'PROVIDER';
    const totalSteps = isProvider ? 4 : 3;
    const stepLabels = isProvider ? PROVIDER_STEPS : CONSUMER_STEPS;
    function update(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
        setError(null);
    }
    function goBack() {
        setStep(s => Math.max(1, s - 1));
        setError(null);
    }
    function validate() {
        if (step === 1) {
            if (!form.role)
                return 'Please select your role to continue.';
        }
        if (step === 2) {
            if (!form.firstName.trim())
                return 'First name is required.';
            if (!form.phone.trim())
                return 'Phone number is required.';
            if (!isValidCanadianPhone(form.phone))
                return 'Enter a valid Canadian phone number (e.g. (416) 555-0100).';
            if (!form.postalCode.trim())
                return 'Postal code is required.';
            if (!isValidCanadianPostal(form.postalCode))
                return 'Enter a valid Canadian postal code (e.g. L9T 2X5).';
            if (!isGtaPostal(form.postalCode))
                return 'We currently serve the GTA (postal codes starting with L or M). Other areas coming soon.';
        }
        if (step === 3 && isProvider) {
            if (!form.businessName.trim())
                return 'Business name is required.';
        }
        if (step === 4 && isProvider && form.serviceCategoryIds.length === 0) {
            return 'Please select at least one service category to continue.';
        }
        return null;
    }
    async function submitOnboarding(overrides) {
        setIsSubmitting(true);
        setError(null);
        try {
            await completeOnboarding({
                role: form.role,
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim() || undefined,
                phone: form.phone.trim(),
                postalCode: form.postalCode.trim(),
                smsConsent: form.smsConsent,
                businessName: isProvider ? form.businessName.trim() : undefined,
                serviceAreas: isProvider && form.serviceAreas.trim()
                    ? form.serviceAreas.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
                    : undefined,
                referralCode: form.referralCode.trim() || undefined,
                interestCategoryIds: !isProvider ? (overrides?.interestCategoryIds ?? form.interestCategoryIds) : undefined,
                serviceCategoryIds: isProvider ? form.serviceCategoryIds : undefined,
            });
            sessionStorage.removeItem('onboardingForm');
            sessionStorage.removeItem('onboardingStep');
            return true;
        }
        catch (e) {
            setError(e.message ?? 'Something went wrong. Please try again.');
            return false;
        }
        finally {
            setIsSubmitting(false);
        }
    }
    async function handleSkipOnboarding() {
        const ok = await submitOnboarding({ interestCategoryIds: [] });
        if (ok)
            navigate('/get-quotes');
    }
    async function handleNext() {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        if (step < totalSteps) {
            setStep(s => s + 1);
            return;
        }
        const ok = await submitOnboarding();
        if (ok) {
            if (isProvider)
                navigate('/provider/dashboard');
            else
                setDone(true);
        }
    }
    function toggleInterest(id) {
        setForm(prev => ({
            ...prev,
            interestCategoryIds: prev.interestCategoryIds.includes(id)
                ? prev.interestCategoryIds.filter(x => x !== id)
                : [...prev.interestCategoryIds, id],
        }));
        setError(null);
    }
    function toggleServiceCategory(id) {
        setForm(prev => ({
            ...prev,
            serviceCategoryIds: prev.serviceCategoryIds.includes(id)
                ? prev.serviceCategoryIds.filter(x => x !== id)
                : [...prev.serviceCategoryIds, id],
        }));
        setError(null);
    }
    // ── Success screen ───────────────────────────────────────────────────────────
    if (done) {
        return (<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="size-20 rounded-full bg-[#EFF6FF] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="size-10 text-[#2563EB]"/>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-[#0F172A] mb-2">You're all set!</h2>
          <p className="text-[#475569] mb-10">Your account is ready. Here's what to do next.</p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
                { href: '/get-quotes', num: '1', label: 'Get quotes', sub: 'Match with local pros fast.', amber: false },
                { href: '/services', num: '2', label: 'Browse services', sub: 'See what we cover near you.', amber: false },
                { href: '/how-rewards-work', num: '$', label: 'Earn rewards', sub: '$60+ back on your first job.', amber: true },
            ].map(({ href, num, label, sub, amber }) => (<a key={href} href={href} className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 text-left hover:border-[#2563EB] hover:shadow-md transition-all group">
                <div className={`size-9 rounded-xl flex items-center justify-center mb-3 ${amber ? 'bg-[#FEF3C7]' : 'bg-[#EFF6FF]'}`}>
                  <span className={`text-sm font-black ${amber ? 'text-[#F59E0B]' : 'text-[#2563EB]'}`}>{num}</span>
                </div>
                <p className="font-bold text-[#0F172A] text-sm group-hover:text-[#2563EB] transition-colors">{label}</p>
                <p className="text-xs text-[#475569] mt-1">{sub}</p>
              </a>))}
          </div>
          <a href="/get-quotes" className="inline-block px-8 py-3.5 bg-[#2563EB] text-white font-bold rounded-[22px] shadow-[0_8px_24px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] transition-colors">
            Find a local pro →
          </a>
        </div>
      </div>);
    }
    // ── Split-screen layout ──────────────────────────────────────────────────────
    return (<div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left panel — navy brand + step progress ── */}
      <div className="bg-[#0F172A] lg:w-80 xl:w-96 shrink-0 flex flex-col">

        {/* Mobile: compact top strip */}
        <div className="flex items-center justify-between px-6 py-4 lg:hidden border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src={logo} alt="The Helper" className="w-7 h-7 rounded-lg"/>
            <span className="text-white font-black text-base tracking-tight">The Helper</span>
          </div>
          <span className="text-white/50 text-sm font-semibold">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Desktop: full side panel */}
        <div className="hidden lg:flex flex-col h-full px-8 py-10">
          <div className="flex items-center gap-3 mb-12">
            <img src={logo} alt="The Helper" className="w-9 h-9 rounded-xl"/>
            <span className="text-white font-black text-lg tracking-tight">The Helper</span>
          </div>

          <div className="flex-1">
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-6">Setup progress</p>
            <ol className="space-y-4">
              {stepLabels.map((label, i) => {
            const num = i + 1;
            const isDone = step > num;
            const isCurrent = step === num;
            return (<li key={num} className="flex items-start gap-3.5">
                    <div className={`size-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-black transition-all ${isDone
                    ? 'bg-[#22C55E] text-white'
                    : isCurrent
                        ? 'bg-[#2563EB] text-white shadow-[0_0_0_4px_rgba(37,99,235,0.25)]'
                        : 'bg-white/10 text-white/30'}`}>
                      {isDone ? <CheckCircle2 className="size-4"/> : num}
                    </div>
                    <div className="pt-0.5">
                      <p className={`text-sm font-semibold transition-colors ${isCurrent ? 'text-white' : isDone ? 'text-white/60' : 'text-white/30'}`}>{label}</p>
                      {isCurrent && (<p className="text-xs text-white/40 mt-0.5">In progress</p>)}
                    </div>
                  </li>);
        })}
            </ol>
          </div>

          <div className="mt-auto pt-10 border-t border-white/10">
            <p className="text-white/40 text-sm leading-relaxed">
              Joining 500+ homeowners and pros in Milton, Oakville & Burlington.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 bg-[#F8FAFC] flex flex-col">
        <div className="flex-1 flex items-start lg:items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-lg">

            {/* Mobile progress dots */}
            <div className="flex items-center gap-1.5 mb-6 lg:hidden">
              {Array.from({ length: totalSteps }).map((_, i) => (<div key={i} className={`h-1.5 rounded-full transition-all ${i + 1 === step ? 'w-8 bg-[#2563EB]' : i + 1 < step ? 'w-4 bg-[#22C55E]' : 'w-4 bg-[#E2E8F0]'}`}/>))}
            </div>

            {/* Step content */}
            <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 lg:p-8 shadow-sm">
              <div key={step} className="animate-in fade-in slide-in-from-right-3 duration-250">
                {step === 1 && (<StepRole selected={form.role} onSelect={(role) => update('role', role)}/>)}
                {step === 2 && (<StepProfile form={{
                firstName: form.firstName,
                lastName: form.lastName,
                phone: form.phone,
                postalCode: form.postalCode,
                smsConsent: form.smsConsent,
                referralCode: form.referralCode,
            }} role={form.role} onChange={(field, value) => update(field, value)}/>)}
                {step === 3 && !isProvider && (<CategoryCardGrid title="What services do you need?" subtitle="Pick what you might need. We personalise your dashboard. (Optional)" selectedIds={form.interestCategoryIds} onToggle={toggleInterest}/>)}
                {step === 3 && isProvider && (<StepBusiness businessName={form.businessName} serviceAreas={form.serviceAreas} onChange={(field, value) => update(field, value)}/>)}
                {step === 4 && isProvider && (<CategoryCardGrid title="What services do you offer?" subtitle="Select all categories you serve. You can update these later." selectedIds={form.serviceCategoryIds} onToggle={toggleServiceCategory}/>)}
              </div>

              {/* Error */}
              {error && (<div role="alert" className="mt-5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-[12px] px-4 py-3 flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">⚠</span>
                  {error}
                </div>)}

              {/* Nav buttons */}
              <div className="flex items-center justify-between mt-7 pt-5 border-t border-[#F1F5F9]">
                {step > 1 ? (<button type="button" onClick={goBack} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] text-sm font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] border border-[#E2E8F0] transition-all">
                    <ArrowLeft className="size-4"/> Back
                  </button>) : (<div />)}
                <div className="flex flex-col items-end gap-2">
                  <button type="button" onClick={handleNext} disabled={isSubmitting} className="px-7 py-2.5 bg-[#2563EB] text-white text-sm font-bold rounded-[14px] shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:bg-[#1D4ED8] active:scale-[0.98] transition-all disabled:opacity-50">
                    {isSubmitting
            ? 'Saving…'
            : step === totalSteps
                ? 'Complete setup'
                : 'Continue →'}
                  </button>
                  {step === 3 && !isProvider && (<button type="button" onClick={handleSkipOnboarding} disabled={isSubmitting} className="text-xs text-[#94A3B8] hover:text-[#475569] transition-colors disabled:opacity-50">
                      Skip for now
                    </button>)}
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-[#94A3B8] mt-4">
              By continuing, you agree to The Helper's{' '}
              <a href="/terms" className="underline hover:text-[#475569]">Terms</a> and{' '}
              <a href="/privacy" className="underline hover:text-[#475569]">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=OnboardingPage.jsx.map