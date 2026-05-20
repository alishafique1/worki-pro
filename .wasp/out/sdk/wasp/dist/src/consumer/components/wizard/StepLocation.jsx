import { useState } from 'react';
const CA_POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
export default function StepLocation({ state, update, onNext, onBack }) {
    const [postal, setPostal] = useState(state.postalCode);
    const [error, setError] = useState(null);
    function handleNext() {
        const trimmed = postal.trim().toUpperCase();
        if (!trimmed) {
            setError('Postal code is required.');
            return;
        }
        if (!CA_POSTAL.test(trimmed)) {
            setError('Enter a valid Canadian postal code (e.g. L9T 2X5).');
            return;
        }
        update({ postalCode: trimmed });
        onNext();
    }
    return (<div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">Where are you located?</h3>
      <p className="text-[#475569] text-sm mb-6">We use this to match you with local pros.</p>
      <label className="block text-sm font-semibold text-[#475569] mb-1.5">Postal Code *</label>
      <input type="text" className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors uppercase" placeholder="L9T 2X5" value={postal} onChange={e => { setPostal(e.target.value); setError(null); }} maxLength={7}/>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      <p className="text-xs text-[#94A3B8] mt-2">We serve Milton, Oakville, Burlington and surrounding GTA areas.</p>
      <div className="flex justify-between mt-8">
        <button type="button" onClick={onBack} className="text-[#475569] font-bold hover:text-[#0F172A]">← Back</button>
        <button type="button" onClick={handleNext} className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-full hover:bg-[#1D4ED8] transition-colors">Next →</button>
      </div>
    </div>);
}
//# sourceMappingURL=StepLocation.jsx.map