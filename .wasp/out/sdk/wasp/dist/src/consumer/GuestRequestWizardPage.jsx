import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import WizardProgress from './components/wizard/WizardProgress';
import StepCategory from './components/wizard/StepCategory';
import StepQualifiers from './components/wizard/StepQualifiers';
import StepDetails from './components/wizard/StepDetails';
import StepOtp from './components/wizard/StepOtp';
import { submitServiceRequest } from 'wasp/client/operations';
import { Logo } from '../client/components/Logo/Logo';
const STEP_LABELS = ['Service', 'Qualifiers', 'Details', 'Verify'];
const TOTAL_STEPS = 4;
export default function GuestRequestWizardPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [state, setState] = useState({
        categoryId: searchParams.get('category'),
        categorySlug: searchParams.get('slug'),
        categoryName: null,
        postalCode: searchParams.get('postal') ?? '',
        description: '',
        urgency: 'FLEXIBLE',
        preferredTime: '',
        qualifierAnswers: {},
        detailChips: [],
        firstName: '',
        email: '',
        phone: '',
        smsConsent: false,
    });
    function update(patch) {
        setState(prev => ({ ...prev, ...patch }));
        setError(null);
    }
    function next() { setStep(s => Math.min(s + 1, TOTAL_STEPS)); setError(null); }
    function back() { setStep(s => Math.max(s - 1, 1)); setError(null); }
    async function handleOtpVerified() {
        setSubmitting(true);
        setSubmitError(null);
        try {
            const result = await submitServiceRequest({
                serviceType: state.categorySlug ?? '',
                postalCode: state.postalCode,
                description: state.description,
                phone: state.phone || undefined,
                name: state.firstName,
                email: state.email,
                urgency: { TODAY: 'EMERGENCY', THIS_WEEK: 'STANDARD', FLEXIBLE: 'PLANNED' }[state.urgency],
            });
            const requestId = result?.id;
            navigate(`/account${requestId ? `?newRequest=${requestId}` : ''}`);
        }
        catch (e) {
            setSubmitError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
            setSubmitting(false);
        }
    }
    if (done) {
        return (<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 text-5xl">✅</div>
          <h2 className="text-2xl font-black text-[#0F172A] mb-2">Request submitted!</h2>
          <p className="text-[#475569] mb-8">
            We'll let you know as soon as a pro responds. No need to stay by the phone — we'll email you when someone picks up your request.
          </p>
          <a href="/services" className="inline-block rounded-xl bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#1D4ED8] transition-colors">
            Browse services
          </a>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo variant="light" size="md" className="justify-center mb-4"/>
          <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">Get matched with a pro</h2>
          <p className="text-[#475569] text-sm mt-1">No account needed, no cost — takes 2 minutes</p>
        </div>

        <WizardProgress current={step} total={TOTAL_STEPS} labels={STEP_LABELS}/>

        <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8 shadow-lg">
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {step === 1 && <StepCategory state={state} update={update} onNext={next}/>}
            {step === 2 && (<StepQualifiers state={state} update={update} onNext={next} onBack={back}/>)}
            {step === 3 && <StepDetails state={state} update={update} onNext={next} onBack={back}/>}
            {step === 4 && (state.phone || state.email ? (<StepOtp state={state} onBack={back} onVerified={handleOtpVerified} externalError={submitError} email={state.email}/>) : (<div className="text-center py-6">
                  <p className="text-[#475569] mb-4">Ready to submit your request?</p>
                  <button type="button" onClick={handleOtpVerified} disabled={submitting} className="rounded-xl bg-[#2563EB] px-6 py-3 font-semibold text-white hover:bg-[#1D4ED8] transition-colors disabled:opacity-50">
                    {submitting ? 'Submitting…' : 'Submit request →'}
                  </button>
                  {submitError && (<p className="mt-4 text-sm text-red-500">{submitError}</p>)}
                </div>))}
          </div>

          {error && (<p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-[10px] px-4 py-3">
              {error}
            </p>)}
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=GuestRequestWizardPage.jsx.map