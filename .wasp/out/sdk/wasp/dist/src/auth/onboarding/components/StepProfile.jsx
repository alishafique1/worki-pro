const inputClass = 'w-full bg-white border border-[#E2E8F0] rounded-[14px] px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors';
const labelClass = 'block text-sm font-semibold text-[#475569] mb-1.5';
export default function StepProfile({ form, role, onChange }) {
    return (<div className="space-y-4">
      <div>
        <h3 className="text-xl font-black mb-1 text-[#0F172A]">Your profile</h3>
        <p className="text-[#475569] text-sm mb-5">Tell us a bit about yourself.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>First Name *</label>
          <input type="text" className={inputClass} placeholder="Jane" value={form.firstName} onChange={e => onChange('firstName', e.target.value)}/>
        </div>
        <div>
          <label className={labelClass}>Last Name</label>
          <input type="text" className={inputClass} placeholder="Smith" value={form.lastName} onChange={e => onChange('lastName', e.target.value)}/>
        </div>
      </div>
      <div>
        <label className={labelClass}>Phone *</label>
        <input type="tel" className={inputClass} placeholder="(416) 555-0100" value={form.phone} onChange={e => onChange('phone', e.target.value)}/>
      </div>
      <div>
        <label className={labelClass}>Postal Code *</label>
        <input type="text" className={`${inputClass} uppercase`} placeholder="L9T 2X5" value={form.postalCode} onChange={e => onChange('postalCode', e.target.value.toUpperCase())} maxLength={7}/>
        <p className="text-xs text-[#94A3B8] mt-1">We serve Milton, Oakville, Burlington and surrounding GTA areas.</p>
      </div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" className="mt-0.5 accent-[#2563EB]" checked={form.smsConsent} onChange={e => onChange('smsConsent', e.target.checked)}/>
        <span className="text-sm text-[#475569]">
          I agree to receive SMS updates about my service requests
        </span>
      </label>
      {role === 'CONSUMER' && (<div>
          <label className={labelClass}>Referral Code <span className="font-normal opacity-60">(optional)</span></label>
          <input type="text" className={inputClass} placeholder="REF-XXXXXX" value={form.referralCode} onChange={e => onChange('referralCode', e.target.value.toUpperCase())}/>
          <p className="text-xs text-[#475569] mt-1">Have a friend's referral code? Enter it to earn 500 bonus points each.</p>
        </div>)}
    </div>);
}
//# sourceMappingURL=StepProfile.jsx.map