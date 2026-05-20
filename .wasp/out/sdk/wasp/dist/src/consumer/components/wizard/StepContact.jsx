import { useState } from 'react';
const inputClass = 'w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors';
export default function StepContact({ state, update, onNext, onBack }) {
    const [firstName, setFirstName] = useState(state.firstName);
    const [email, setEmail] = useState(state.email);
    const [phone, setPhone] = useState(state.phone);
    const [smsConsent, setSmsConsent] = useState(state.smsConsent);
    const [referralCode, setReferralCode] = useState(state.referralCode);
    const [showReferral, setShowReferral] = useState(false);
    const [error, setError] = useState(null);
    function handleNext() {
        if (!firstName.trim()) {
            setError('First name is required.');
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            setError('A valid email is required.');
            return;
        }
        if (!phone.trim()) {
            setError('Phone number is required.');
            return;
        }
        update({ firstName: firstName.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), smsConsent, referralCode });
        onNext();
    }
    return (<div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">Almost done!</h3>
      <p className="text-[#475569] text-sm mb-6">We'll send your request to local pros and email you a 6-digit code to verify.</p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-1.5">First Name *</label>
          <input type="text" className={inputClass} placeholder="Jane" value={firstName} onChange={e => { setFirstName(e.target.value); setError(null); }}/>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-1.5">Email *</label>
          <input type="email" className={inputClass} placeholder="jane@example.com" value={email} onChange={e => { setEmail(e.target.value); setError(null); }}/>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#475569] mb-1.5">Phone *</label>
          <input type="tel" className={inputClass} placeholder="(416) 555-0100" value={phone} onChange={e => { setPhone(e.target.value); setError(null); }}/>
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-0.5 accent-[#2563EB]" checked={smsConsent} onChange={e => setSmsConsent(e.target.checked)}/>
          <span className="text-sm text-[#475569]">I agree to receive SMS updates about my service request</span>
        </label>
        {!showReferral ? (<button type="button" onClick={() => setShowReferral(true)} className="text-xs text-[#2563EB] hover:underline">Have a referral code?</button>) : (<div>
            <label className="block text-sm font-semibold text-[#475569] mb-1.5">Referral Code <span className="font-normal opacity-60">(optional)</span></label>
            <input type="text" className={inputClass} placeholder="REF-XXXXXX" value={referralCode} onChange={e => setReferralCode(e.target.value.toUpperCase())}/>
          </div>)}
      </div>
      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      <div className="flex justify-between mt-8">
        <button type="button" onClick={onBack} className="text-[#475569] font-bold hover:text-[#0F172A]">← Back</button>
        <button type="button" onClick={handleNext} className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-full hover:bg-[#1D4ED8] transition-colors">Send code →</button>
      </div>
    </div>);
}
//# sourceMappingURL=StepContact.jsx.map