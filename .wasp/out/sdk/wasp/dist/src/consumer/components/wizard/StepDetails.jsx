import { useEffect, useState } from 'react';
const CA_POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
const inputClass = 'w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors';
export default function StepDetails({ state, update, onBack, onNext, prefilled }) {
    const [postalCode, setPostalCode] = useState(state.postalCode);
    const [preferredTime, setPreferredTime] = useState(state.preferredTime);
    const [firstName, setFirstName] = useState(state.firstName);
    const [email, setEmail] = useState(state.email);
    const [phone, setPhone] = useState(state.phone);
    const [smsConsent, setSmsConsent] = useState(state.smsConsent);
    const [error, setError] = useState(null);
    // Sync local state when the parent prefills values (e.g. from the logged-in user account).
    // Using guards so a user's own typing is never clobbered by a stale parent value.
    useEffect(() => {
        if (state.firstName)
            setFirstName(state.firstName);
    }, [state.firstName]);
    useEffect(() => {
        if (state.email)
            setEmail(state.email);
    }, [state.email]);
    useEffect(() => {
        if (state.phone)
            setPhone(state.phone);
    }, [state.phone]);
    useEffect(() => {
        if (state.postalCode)
            setPostalCode(state.postalCode);
    }, [state.postalCode]);
    function handleNext() {
        const trimmedPostal = postalCode.trim().toUpperCase();
        if (!trimmedPostal) {
            setError('Postal code is required.');
            return;
        }
        if (!CA_POSTAL.test(trimmedPostal)) {
            setError('Enter a valid Canadian postal code (e.g. L9T 2X5).');
            return;
        }
        if (!firstName.trim()) {
            setError('Your name is required.');
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            setError('A valid email is required.');
            return;
        }
        setError(null);
        update({
            postalCode: trimmedPostal,
            urgency: 'FLEXIBLE',
            preferredTime: preferredTime.trim(),
            firstName: firstName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            smsConsent,
        });
        onNext();
    }
    const hasPhone = phone.trim().length >= 10;
    return (<div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">When &amp; where</h3>
      <p className="text-[#475569] text-sm mb-5">
        Tell us where and when so we can match you with the right local pro.
      </p>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="flex items-center justify-between text-sm font-semibold text-[#475569] mb-1.5">
            <span>Your name <span className="text-red-500">*</span></span>
            {prefilled && firstName && <span className="text-xs font-normal text-[#94A3B8]">From your account</span>}
          </label>
          <input type="text" className={inputClass} placeholder="Jane Smith" value={firstName} onChange={e => { setFirstName(e.target.value); setError(null); }}/>
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center justify-between text-sm font-semibold text-[#475569] mb-1.5">
            <span>Email <span className="text-red-500">*</span></span>
            {prefilled && email && <span className="text-xs font-normal text-[#94A3B8]">From your account</span>}
          </label>
          <input type="email" className={inputClass} placeholder="jane@example.com" value={email} onChange={e => { setEmail(e.target.value); setError(null); }}/>
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center justify-between text-sm font-semibold text-[#475569] mb-1.5">
            <span>Phone <span className="font-normal opacity-60">(optional — for faster response)</span></span>
            {prefilled && phone && <span className="text-xs font-normal text-[#94A3B8]">From your account</span>}
          </label>
          <input type="tel" className={inputClass} placeholder="(416) 555-0100" value={phone} onChange={e => { setPhone(e.target.value); setError(null); }}/>
        </div>

        {hasPhone && (<label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-0.5 accent-[#2563EB]" checked={smsConsent} onChange={e => setSmsConsent(e.target.checked)}/>
            <span className="text-sm text-[#475569]">
              I agree to receive SMS updates about my service request
            </span>
          </label>)}

        {/* Divider */}
        <hr className="border-[#E2E8F0]"/>

        {/* Postal code */}
        <div>
          <label htmlFor="wiz-postal" className="flex items-center justify-between text-sm font-semibold text-[#475569] mb-1.5">
            <span>Your area <span className="text-red-500">*</span></span>
            {prefilled && postalCode && <span className="text-xs font-normal text-[#94A3B8]">From your account</span>}
          </label>
          <input id="wiz-postal" type="text" inputMode="text" autoComplete="postal-code" maxLength={7} className={`${inputClass} uppercase tracking-wider`} placeholder="L9T 2X5" value={postalCode} onChange={e => { setPostalCode(e.target.value); setError(null); }}/>
          <p className="text-xs text-[#94A3B8] mt-1">
            We serve Milton, Oakville, Burlington and surrounding GTA areas.
          </p>
        </div>

        {/* Preferred time */}
        <div>
          <label htmlFor="wiz-time" className="block text-sm font-semibold text-[#475569] mb-1.5">
            Preferred time <span className="font-normal opacity-60">(optional)</span>
          </label>
          <input id="wiz-time" type="text" className={inputClass} placeholder="e.g. weekday mornings, after 5pm weekdays, Saturday afternoon" value={preferredTime} onChange={e => setPreferredTime(e.target.value)} maxLength={120}/>
        </div>
      </div>

      {error && (<p className="text-sm text-red-500 mt-3 bg-red-500/10 border border-red-500/20 rounded-[10px] px-4 py-3">
          {error}
        </p>)}

      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack} className="text-[#475569] font-bold hover:text-[#0F172A]">
          ← Back
        </button>
        <button type="button" onClick={handleNext} className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-full hover:bg-[#1D4ED8] transition-colors">
          {prefilled ? 'Submit request →' : hasPhone ? 'Send code →' : 'Submit request →'}
        </button>
      </div>
    </div>);
}
//# sourceMappingURL=StepDetails.jsx.map