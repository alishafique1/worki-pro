import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { useAuth } from 'wasp/client/auth'
import WizardProgress from './components/wizard/WizardProgress'
import StepCategory, { HARDCODED_CATEGORIES } from './components/wizard/StepCategory'
import StepQualifiers from './components/wizard/StepQualifiers'
import StepDetails from './components/wizard/StepDetails'
import StepOtp from './components/wizard/StepOtp'
import { submitServiceRequest } from 'wasp/client/operations'
import { Logo } from '../client/components/Logo/Logo'

export type WizardState = {
  categoryId: string | null
  categorySlug: string | null
  categoryName: string | null
  postalCode: string
  description: string
  urgency: 'TODAY' | 'THIS_WEEK' | 'FLEXIBLE'
  preferredTime: string
  qualifierAnswers: Record<string, string>
  detailChips: string[]
  firstName: string
  email: string
  phone: string
  smsConsent: boolean
}

// Steps shown to guests (need OTP); logged-in users skip Verify.
const GUEST_LABELS = ['Service', 'Qualifiers', 'Details', 'Verify']
const LOGGEDIN_LABELS = ['Service', 'Qualifiers', 'Details']

export default function GuestRequestWizardPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { data: user, isLoading: authLoading } = useAuth()

  // Resolve known category from ?slug or ?category URL params.
  // Only treat it as "preselected" when it matches a wizard category exactly.
  const slugParam = searchParams.get('slug')
  const categoryParam = searchParams.get('category')
  const knownCat = HARDCODED_CATEGORIES.find(
    c => c.slug === slugParam || c.slug === categoryParam || c.id === categoryParam,
  ) ?? null

  // Decode ?problem — URLSearchParams.get() already percent-decodes, but be explicit.
  const problemParam = searchParams.get('problem')
  const decodedProblem = problemParam ? decodeURIComponent(problemParam) : null

  // If a known category is preselected from the URL, skip directly to step 2 (Qualifiers).
  // Unknown / missing category keeps step 1 (category picker) as default.
  const [step, setStep] = useState(knownCat ? 2 : 1)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Flag set when StepDetails calls onNext() while logged-in.
  // We need a re-render cycle so state.xxx has the freshly-written values
  // before we call submitServiceRequest.
  const [pendingSubmit, setPendingSubmit] = useState(false)

  const [state, setState] = useState<WizardState>({
    categoryId: knownCat ? knownCat.id : null,
    categorySlug: knownCat ? knownCat.slug : null,
    categoryName: knownCat ? knownCat.name : null,
    postalCode: searchParams.get('postal') ?? '',
    description: '',
    urgency: 'FLEXIBLE',
    preferredTime: '',
    qualifierAnswers: {},
    detailChips: decodedProblem ? [decodedProblem] : [],
    firstName: '',
    email: '',
    phone: '',
    smsConsent: false,
  })

  const isLoggedIn = !authLoading && !!user
  const stepLabels = isLoggedIn ? LOGGEDIN_LABELS : GUEST_LABELS
  const totalSteps = stepLabels.length

  // Prefill contact fields from the logged-in user's account once auth resolves.
  useEffect(() => {
    if (!user) return
    const u = user as any
    setState(prev => ({
      ...prev,
      firstName: u.firstName || prev.firstName,
      email: u.email || prev.email,
      phone: u.phone || prev.phone,
      postalCode: u.postalCode || prev.postalCode,
    }))
  }, [user])

  function update(patch: Partial<WizardState>) {
    setState(prev => ({ ...prev, ...patch }))
    setError(null)
  }

  function next() { setStep(s => Math.min(s + 1, totalSteps)); setError(null) }
  function back() { setStep(s => Math.max(s - 1, 1)); setError(null) }

  // Single submit function — used by both logged-in (after step 3) and guest (after OTP).
  async function handleSubmit() {
    if (submitting) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await submitServiceRequest({
        serviceType: state.categorySlug ?? '',
        postalCode: state.postalCode,
        description: state.description,
        phone: state.phone || undefined,
        name: state.firstName,
        email: state.email,
        urgency: ({ TODAY: 'EMERGENCY', THIS_WEEK: 'STANDARD', FLEXIBLE: 'PLANNED' } as const)[state.urgency],
      })
      const requestId = (result as { id?: string })?.id
      navigate(`/account${requestId ? `?newRequest=${requestId}` : ''}`)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  // Effect: when both pendingSubmit is true AND state has settled (same render),
  // fire the actual submit. This ensures state.xxx has the values written by
  // StepDetails before submitServiceRequest reads them.
  useEffect(() => {
    if (pendingSubmit) {
      setPendingSubmit(false)
      void handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSubmit])

  // For logged-in users: StepDetails' onNext triggers pending submit instead of OTP.
  function handleDetailsNext() {
    if (isLoggedIn) {
      setPendingSubmit(true)
    } else {
      next()
    }
  }

  // Loading gate — hold until auth resolves so prefill is ready on first render.
  if (authLoading) {
    return <div className="min-h-screen bg-[#F8FAFC]" />
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo variant="light" size="md" className="justify-center mb-4" />
          <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">Get matched with a pro</h2>
          <p className="text-[#475569] text-sm mt-1">
            {isLoggedIn ? "Takes 2 minutes — we'll match you instantly" : 'No account needed, no cost — takes 2 minutes'}
          </p>
        </div>

        <WizardProgress current={step} total={totalSteps} labels={stepLabels} />

        <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8 shadow-lg">
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {step === 1 && <StepCategory state={state} update={update} onNext={next} />}
            {step === 2 && (
              <StepQualifiers
                state={state}
                update={update}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 3 && (
              <StepDetails
                state={state}
                update={update}
                onNext={handleDetailsNext}
                onBack={back}
                prefilled={isLoggedIn}
              />
            )}
            {/* Step 4 only shown for guests — logged-in users have totalSteps=3 */}
            {step === 4 && (
              <StepOtp
                state={state}
                onBack={back}
                onVerified={handleSubmit}
                externalError={submitError}
                email={state.email}
              />
            )}
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-[10px] px-4 py-3">
              {error}
            </p>
          )}

          {/* Logged-in submit error shown under details step */}
          {isLoggedIn && submitError && step === 3 && (
            <p className="mt-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-[10px] px-4 py-3">
              {submitError}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
