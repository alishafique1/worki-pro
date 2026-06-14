import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'wasp/client/auth';
import { completeOnboarding } from 'wasp/client/operations';
import { ArrowLeft } from 'lucide-react';
import ProgressBar from './components/ProgressBar';
import StepRole from './components/StepRole';
import StepProfile from './components/StepProfile';
import StepBusiness from './components/StepBusiness';
import CategoryCardGrid from './components/CategoryCardGrid';
import logo from '../../client/static/logo.webp';
const LABELS = {
    1: 'Your role',
    2: 'Profile',
    3: 'Interests',
};
const PROVIDER_LABELS = {
    1: 'Your role',
    2: 'Profile',
    3: 'Business',
    4: 'Services',
};
const CANADIAN_PHONE = /^(\+1)?[ -]?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/;
const GTA_POSTAL_PREFIXES = /^[LM]/i;
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
    const getDashboardPath = (role) => role === 'PROVIDER' ? '/provider/dashboard' : '/dashboard';
    // ─── Issue 11: Persist progress across refresh via sessionStorage ──────────
    useEffect(() => {
        const savedForm = sessionStorage.getItem('onboardingForm');
        const savedStep = sessionStorage.getItem('onboardingStep');
        if (savedForm) {
            try {
                setForm(JSON.parse(savedForm));
            }
            catch { /* ignore corrupt data */ }
        }
        if (savedStep) {
            const parsed = parseInt(savedStep, 10);
            if (parsed >= 1 && parsed <= totalSteps)
                setStep(parsed);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        sessionStorage.setItem('onboardingForm', JSON.stringify(form));
        sessionStorage.setItem('onboardingStep', String(step));
    }, [form, step]);
    useEffect(() => {
        // `!done` keeps the post-onboarding success screen visible — without it,
        // the auth refetch (which now sees user.firstName) would redirect away.
        if (user && user.firstName && !done) {
            sessionStorage.removeItem('onboardingForm');
            sessionStorage.removeItem('onboardingStep');
            navigate(getDashboardPath(user.role ?? null));
        }
    }, [user, navigate, done]);
    const isProvider = form.role === 'PROVIDER';
    const totalSteps = isProvider ? 4 : 3;
    const stepLabels = isProvider ? PROVIDER_LABELS : LABELS;
    function update(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
        setError(null);
    }
    function goBack() {
        setStep(s => Math.max(1, s - 1));
        setError(null);
    }
    const CA_POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
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
            if (!CANADIAN_PHONE.test(form.phone.trim()))
                return 'Enter a valid Canadian phone number (e.g. (416) 555-0100).';
            if (!form.postalCode.trim())
                return 'Postal code is required.';
            if (!CA_POSTAL.test(form.postalCode.trim()))
                return 'Enter a valid Canadian postal code (e.g. L9T 2X5).';
            if (!GTA_POSTAL_PREFIXES.test(form.postalCode.trim()))
                return 'We currently serve the GTA (postal codes starting with L or M). Other areas coming soon.';
        }
        if (step === 3 && isProvider) {
            if (!form.businessName.trim())
                return 'Business name is required.';
        }
        // Issue 4: Require at least one category for providers
        if (step === 4 && isProvider && form.serviceCategoryIds.length === 0) {
            return 'Please select at least one service category to continue.';
        }
        return null;
    }
    async function handleSkipOnboarding() {
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
                referralCode: form.referralCode.trim() || undefined,
                interestCategoryIds: [],
            });
            sessionStorage.removeItem('onboardingForm');
            sessionStorage.removeItem('onboardingStep');
            // Issue 10: Consumer skip goes to get-quotes, not dashboard
            navigate(form.role === 'PROVIDER' ? '/provider/dashboard' : '/get-quotes');
        }
        catch (e) {
            setError(e.message ?? 'Something went wrong. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
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
                    ? form.serviceAreas.split(',').map(s => s.trim().toUpperCase()).filter(Boolean) // Issue 9: normalize to uppercase
                    : undefined,
                referralCode: form.referralCode.trim() || undefined,
                interestCategoryIds: !isProvider ? form.interestCategoryIds : undefined,
                serviceCategoryIds: isProvider ? form.serviceCategoryIds : undefined,
            });
            sessionStorage.removeItem('onboardingForm');
            sessionStorage.removeItem('onboardingStep');
            if (isProvider) {
                navigate('/provider/dashboard');
            }
            else {
                setDone(true);
            }
        }
        catch (e) {
            setError(e.message ?? 'Something went wrong. Please try again.');
        }
        finally {
            setIsSubmitting(false);
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
    if (done) {
        return (<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="w-full max-w-lg text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <img src={logo} alt="The Helper" className="w-8 h-8 rounded-lg"/>
            <span className="text-xl font-black tracking-tight text-[#0F172A]">The Helper</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-[#0F172A] mb-2">You're all set!</h2>
          <p className="text-[#475569] mb-10">Your account is ready. Here's what you can do next.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <a href="/get-quotes" className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 text-left hover:border-[#2563EB] hover:shadow-md transition-all group">
              <div className="size-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-3">
                <span className="text-[#2563EB] text-lg font-black">1</span>
              </div>
              <p className="font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">Get quotes</p>
              <p className="text-xs text-[#475569] mt-1">Submit a request and get matched with local pros.</p>
            </a>
            <a href="/services" className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 text-left hover:border-[#2563EB] hover:shadow-md transition-all group">
              <div className="size-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-3">
                <span className="text-[#2563EB] text-lg font-black">2</span>
              </div>
              <p className="font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">Browse services</p>
              <p className="text-xs text-[#475569] mt-1">Explore the categories we cover in your area.</p>
            </a>
            <a href="/how-rewards-work" className="bg-white border border-[#E2E8F0] rounded-[20px] p-6 text-left hover:border-[#2563EB] hover:shadow-md transition-all group">
              <div className="size-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center mb-3">
                <span className="text-[#F59E0B] text-lg font-black">$</span>
              </div>
              <p className="font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">See how rewards work</p>
              <p className="text-xs text-[#475569] mt-1">Earn points on every job and redeem for discounts.</p>
            </a>
          </div>
          <a href="/get-quotes" className="inline-block px-8 py-3 bg-[#2563EB] text-white font-bold rounded-[22px] shadow-[0_8px_24px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] transition-colors">
            Find a local pro →
          </a>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <img src={logo} alt="The Helper" className="w-8 h-8 rounded-lg"/>
            <span className="text-xl font-black tracking-tight text-[#0F172A]">The Helper</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">Set up your account</h2>
          <p className="text-[#475569] text-sm mt-1">{stepLabels[step]}</p>
        </div>

        <ProgressBar current={step} total={totalSteps}/>

        {/* Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8 shadow-lg mt-8">
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {step === 1 && (<StepRole selected={form.role} onSelect={(role) => update('role', role)}/>)}

            {step === 2 && (<StepProfile form={{
                firstName: form.firstName,
                lastName: form.lastName,
                phone: form.phone,
                postalCode: form.postalCode,
                smsConsent: form.smsConsent,
                referralCode: form.referralCode,
            }} role={form.role} onChange={(field, value) => update(field, value)}/>)}

            {step === 3 && !isProvider && (<CategoryCardGrid title="What are you interested in?" subtitle="Pick the services you might need. We'll personalize your dashboard. (Optional)" selectedIds={form.interestCategoryIds} onToggle={toggleInterest}/>)}

            {step === 3 && isProvider && (<StepBusiness businessName={form.businessName} serviceAreas={form.serviceAreas} onChange={(field, value) => update(field, value)}/>)}

            {step === 4 && isProvider && (<CategoryCardGrid title="What services do you provide?" subtitle="Select all the categories you serve. You can update these later." selectedIds={form.serviceCategoryIds} onToggle={toggleServiceCategory}/>)}
          </div>

          {/* Error */}
          {error && (<p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-[10px] px-4 py-3">
              {error}
            </p>)}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (<button type="button" onClick={goBack} className="inline-flex items-center gap-2 px-6 py-3 font-bold text-[#475569] hover:text-[#0F172A] transition-colors">
                <ArrowLeft className="size-4"/> Back
              </button>) : (<div />)}
            <div className="flex flex-col items-end gap-1">
              <button type="button" onClick={handleNext} disabled={isSubmitting} className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-[22px] shadow-[0_8px_24px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] transition-colors disabled:opacity-50">
                {isSubmitting
            ? 'Saving…'
            : step === totalSteps
                ? 'Complete Setup'
                : 'Next →'}
              </button>
              {step === 3 && !isProvider && (<button type="button" onClick={handleSkipOnboarding} disabled={isSubmitting} className="text-xs text-[#475569] hover:text-[#0F172A] transition-colors disabled:opacity-50">
                  Skip for now
                </button>)}
            </div>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=OnboardingPage.jsx.map