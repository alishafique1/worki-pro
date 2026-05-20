import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'wasp/client/auth';
import { completeOnboarding } from 'wasp/client/operations';
import ProgressBar from './components/ProgressBar';
import StepRole from './components/StepRole';
import StepProfile from './components/StepProfile';
import StepBusiness from './components/StepBusiness';
import CategoryCardGrid from './components/CategoryCardGrid';
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
export default function OnboardingPage() {
    const { data: user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
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
    useEffect(() => {
        if (user && user.firstName) {
            navigate(getDashboardPath(user.role ?? null));
        }
    }, [user, navigate]);
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
            if (!form.postalCode.trim())
                return 'Postal code is required.';
        }
        if (step === 3 && isProvider) {
            if (!form.businessName.trim())
                return 'Business name is required.';
        }
        // step 3 for consumers has no validation — it's a redirect prompt
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
            navigate(getDashboardPath(form.role));
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
                    ? form.serviceAreas.split(',').map(s => s.trim()).filter(Boolean)
                    : undefined,
                referralCode: form.referralCode.trim() || undefined,
                interestCategoryIds: !isProvider ? form.interestCategoryIds : undefined,
                serviceCategoryIds: isProvider ? form.serviceCategoryIds : undefined,
            });
            navigate(getDashboardPath(form.role));
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
    return (<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center font-black text-white text-sm">H</div>
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

            {step === 3 && !isProvider && (<div className="text-center py-4">
                <h3 className="text-xl font-black mb-2 text-[#0F172A]">Ready to get quotes?</h3>
                <p className="text-[#475569] text-sm mb-6">Tell us what you need and we'll match you with local pros.</p>
                <button type="button" onClick={() => navigate('/get-quotes')} className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-[22px] hover:bg-[#1D4ED8] transition-colors">
                  Find a local pro →
                </button>
                <button type="button" onClick={handleSkipOnboarding} disabled={isSubmitting} className="block mx-auto mt-3 text-sm text-[#475569] hover:text-[#0F172A] disabled:opacity-50">
                  {isSubmitting ? 'Saving…' : 'Skip for now'}
                </button>
              </div>)}

            {step === 3 && isProvider && (<StepBusiness businessName={form.businessName} serviceAreas={form.serviceAreas} onChange={(field, value) => update(field, value)}/>)}

            {step === 4 && isProvider && (<CategoryCardGrid title="What services do you provide?" subtitle="Select all the categories you serve. You can update these later." selectedIds={form.serviceCategoryIds} onToggle={toggleServiceCategory}/>)}
          </div>

          {/* Error */}
          {error && (<p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-[10px] px-4 py-3">
              {error}
            </p>)}

          {/* Navigation — hidden on step 3 for consumers (they have inline buttons) */}
          {!(step === 3 && !isProvider) && (<div className="flex items-center justify-between mt-8">
              {step > 1 ? (<button type="button" onClick={goBack} className="px-6 py-3 font-bold text-[#475569] hover:text-[#0F172A] transition-colors">
                  ← Back
                </button>) : (<div />)}
              <button type="button" onClick={handleNext} disabled={isSubmitting} className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-[22px] hover:bg-[#1D4ED8] transition-colors disabled:opacity-50">
                {isSubmitting
                ? 'Saving…'
                : step === totalSteps
                    ? 'Complete Setup'
                    : 'Next →'}
              </button>
            </div>)}
        </div>
      </div>
    </div>);
}
