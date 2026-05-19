const inputClass = 'w-full bg-white border border-[#E2E8F0] rounded-[14px] px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors';
const labelClass = 'block text-sm font-semibold text-[#475569] mb-1.5';
export default function StepBusiness({ businessName, serviceAreas, onChange }) {
    return (<div className="space-y-4">
      <div>
        <h3 className="text-xl font-black mb-1 text-[#0F172A]">Business details</h3>
        <p className="text-[#475569] text-sm mb-5">
          Your profile will be reviewed and approved by our team before you can receive leads.
        </p>
      </div>
      <div>
        <label className={labelClass}>Business Name *</label>
        <input type="text" className={inputClass} placeholder="Smith HVAC Services" value={businessName} onChange={e => onChange('businessName', e.target.value)}/>
      </div>
      <div>
        <label className={labelClass}>Service Areas</label>
        <input type="text" className={inputClass} placeholder="e.g. M5V, M6G, Toronto" value={serviceAreas} onChange={e => onChange('serviceAreas', e.target.value)}/>
        <p className="text-xs text-[#475569] mt-1">Comma-separated postal codes or city names</p>
      </div>
    </div>);
}
//# sourceMappingURL=StepBusiness.jsx.map