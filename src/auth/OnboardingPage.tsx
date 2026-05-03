import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'wasp/client/auth';
import { useAction, completeOnboarding } from 'wasp/client/operations';

type Role = 'CONSUMER' | 'PROVIDER';

type FormData = {
  role: Role | null;
  firstName: string;
  lastName: string;
  phone: string;
  postalCode: string;
  smsConsent: boolean;
  businessName: string;
  serviceAreas: string;
};

const TOTAL_STEPS_CONSUMER = 2;
const TOTAL_STEPS_PROVIDER = 3;

export default function OnboardingPage() {
  const { data: user } = useAuth();
  const navigate = useNavigate();
  const completeOnboardingFn = useAction(completeOnboarding);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    role: null,
    firstName: '',
    lastName: '',
    phone: '',
    postalCode: '',
    smsConsent: false,
    businessName: '',
    serviceAreas: '',
  });

  // If user already completed onboarding, redirect to dashboard
  useEffect(() => {
    if (user && user.firstName) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const totalSteps = form.role === 'PROVIDER' ? TOTAL_STEPS_PROVIDER : TOTAL_STEPS_CONSUMER;
  const progress = (step / totalSteps) * 100;

  function updateForm(field: keyof FormData, value: string | boolean | Role) {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  }

  function handleBack() {
    setStep(s => Math.max(1, s - 1));
    setError(null);
  }

  function validateStep(): string | null {
    if (step === 1) {
      if (!form.role) return 'Please select your role to continue.';
    }
    if (step === 2) {
      if (!form.firstName.trim()) return 'First name is required.';
      if (!form.phone.trim()) return 'Phone number is required.';
      if (!form.postalCode.trim()) return 'Postal code is required.';
    }
    if (step === 3 && form.role === 'PROVIDER') {
      if (!form.businessName.trim()) return 'Business name is required.';
    }
    return null;
  }

  async function handleNext() {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (step < totalSteps) {
      setStep(s => s + 1);
      return;
    }

    // Final submit
    setIsSubmitting(true);
    setError(null);
    try {
      await completeOnboardingFn({
        role: form.role!,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim() || undefined,
        phone: form.phone.trim(),
        postalCode: form.postalCode.trim(),
        smsConsent: form.smsConsent,
        businessName: form.role === 'PROVIDER' ? form.businessName.trim() : undefined,
        serviceAreas:
          form.role === 'PROVIDER' && form.serviceAreas.trim()
            ? form.serviceAreas.split(',').map(s => s.trim()).filter(Boolean)
            : undefined,
      });
      navigate('/dashboard');
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    'w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] px-4 py-3 text-foreground placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] transition-colors';
  const labelClass = 'block text-sm font-semibold text-[var(--text-secondary)] mb-1.5';

  return (
    <div className="min-h-screen bg-[var(--surface-base)] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center font-black text-black text-sm">W</div>
            <span className="text-xl font-black tracking-tight">Worki</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Set up your account</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Step {step} of {totalSteps}</p>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-[var(--surface-raised)] rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-700 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Card */}
        <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-8 shadow-2xl">

          {/* Step 1 — Role Selection */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-black mb-2">How will you use Worki?</h3>
              <p className="text-[var(--text-secondary)] text-sm mb-6">Choose your role to get started.</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { role: 'CONSUMER' as Role, icon: '🏠', title: 'Homeowner', desc: 'I need home services' },
                  { role: 'PROVIDER' as Role, icon: '🔧', title: 'Service Pro', desc: 'I provide home services' },
                ].map(option => (
                  <button
                    key={option.role}
                    type="button"
                    onClick={() => updateForm('role', option.role)}
                    className={`border-2 rounded-[24px] p-8 cursor-pointer transition-all text-left ${
                      form.role === option.role
                        ? 'border-[var(--accent)] bg-[var(--surface-raised)]'
                        : 'border-[var(--border-default)] bg-[var(--surface-overlay)] hover:border-[var(--text-secondary)]'
                    }`}
                  >
                    <div className="text-3xl mb-3">{option.icon}</div>
                    <p className="font-bold text-sm">{option.title}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Profile Details */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
              <div>
                <h3 className="text-xl font-black mb-1">Your profile</h3>
                <p className="text-[var(--text-secondary)] text-sm mb-5">Tell us a bit about yourself.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={e => updateForm('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Smith"
                    value={form.lastName}
                    onChange={e => updateForm('lastName', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Phone *</label>
                <input
                  type="tel"
                  className={inputClass}
                  placeholder="(416) 555-0100"
                  value={form.phone}
                  onChange={e => updateForm('phone', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Postal Code *</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="M5V 3A8"
                  value={form.postalCode}
                  onChange={e => updateForm('postalCode', e.target.value)}
                />
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-[var(--accent)]"
                  checked={form.smsConsent}
                  onChange={e => updateForm('smsConsent', e.target.checked)}
                />
                <span className="text-sm text-[var(--text-secondary)]">
                  I agree to receive SMS updates about my service requests
                </span>
              </label>
            </div>
          )}

          {/* Step 3 — Provider Details */}
          {step === 3 && form.role === 'PROVIDER' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
              <div>
                <h3 className="text-xl font-black mb-1">Business details</h3>
                <p className="text-[var(--text-secondary)] text-sm mb-5">
                  Your profile will be reviewed and approved by our team before you can receive leads.
                </p>
              </div>
              <div>
                <label className={labelClass}>Business Name *</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Smith HVAC Services"
                  value={form.businessName}
                  onChange={e => updateForm('businessName', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Service Areas</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. M5V, M6G, Toronto"
                  value={form.serviceAreas}
                  onChange={e => updateForm('serviceAreas', e.target.value)}
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">Comma-separated postal codes or city names</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-[10px] px-4 py-3">
              {error}
            </p>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 font-bold text-[var(--text-secondary)] hover:text-foreground transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-8 py-3 bg-[var(--accent)] text-black font-bold rounded-[22px] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving…'
                : step === totalSteps
                ? 'Complete Setup'
                : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
