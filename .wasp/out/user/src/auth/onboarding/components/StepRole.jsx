const options = [
    { role: 'CONSUMER', emoji: '🏠', title: 'Homeowner', desc: 'I need home services' },
    { role: 'PROVIDER', emoji: '🔧', title: 'Service Pro', desc: 'I provide home services' },
];
export default function StepRole({ selected, onSelect }) {
    return (<div>
      <h3 className="text-xl font-black mb-2 text-[#0F172A]">How will you use The Helper?</h3>
      <p className="text-[#475569] text-sm mb-6">Choose your role to get started.</p>
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (<button key={opt.role} type="button" onClick={() => onSelect(opt.role)} className={`border-2 rounded-[24px] p-8 cursor-pointer transition-all text-left ${selected === opt.role
                ? 'border-[#2563EB] bg-[#EFF6FF]'
                : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8]'}`}>
            <div className="text-3xl mb-3">{opt.emoji}</div>
            <p className="font-bold text-sm text-[#0F172A]">{opt.title}</p>
            <p className="text-xs text-[#475569] mt-1">{opt.desc}</p>
          </button>))}
      </div>
    </div>);
}
