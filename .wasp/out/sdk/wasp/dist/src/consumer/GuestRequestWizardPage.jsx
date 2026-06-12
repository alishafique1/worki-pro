import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import WizardProgress from './components/wizard/WizardProgress';
import StepCategory from './components/wizard/StepCategory';
import StepQualifiers from './components/wizard/StepQualifiers';
import StepInfoAndVerify from './components/wizard/StepInfoAndVerify';
import StepVerifyEmail from './components/wizard/StepVerifyEmail';
import logo from '../client/static/logo.webp';
const STEP_LABELS = ['Service', 'Questions', 'Your info', 'Verify email'];
const TOTAL_STEPS = 4;
export default function GuestRequestWizardPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);
    const [state, setState] = useState({
        categoryId: searchParams.get('category'),
        categorySlug: searchParams.get('slug'),
        categoryName: null,
        subServiceId: null,
        subServiceName: null,
        qualifierAnswers: {},
        description: '',
        postalCode: searchParams.get('postal') ?? '',
        firstName: '',
        email: '',
        phone: '',
        smsConsent: false,
        referralCode: '',
    });
    function update(patch) {
        setState(prev => ({ ...prev, ...patch }));
        setError(null);
    }
    function next() { setStep(s => Math.min(s + 1, TOTAL_STEPS)); setError(null); }
    function back() { setStep(s => Math.max(s - 1, 1)); setError(null); }
    return (<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <img src={logo} alt="The Helper" className="w-8 h-8 rounded-lg"/>
            <span className="text-xl font-black tracking-tight text-[#0F172A]">The Helper</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">Get matched with a pro</h2>
          <p className="text-[#475569] text-sm mt-1">No account needed, no cost — takes 2 minutes</p>
        </div>

        <WizardProgress current={step} total={TOTAL_STEPS} labels={STEP_LABELS}/>

        <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8 shadow-lg">
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {step === 1 && <StepCategory state={state} update={update} onNext={next}/>}
            {step === 2 && <StepQualifiers state={state} update={update} onNext={next} onBack={back}/>}
            {step === 3 && <StepInfoAndVerify state={state} update={update} onBack={back} onNext={next}/>}
            {step === 4 && (<StepVerifyEmail state={state} update={update} onBack={back} onSuccess={(requestId) => navigate(`/dashboard${requestId ? `?newRequest=${requestId}` : ''}`)} setError={setError}/>)}
          </div>

          {error && (<p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-[10px] px-4 py-3">
              {error}
            </p>)}
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=GuestRequestWizardPage.jsx.map