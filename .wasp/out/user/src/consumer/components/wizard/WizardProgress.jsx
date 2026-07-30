export default function WizardProgress({ current, total, labels }) {
    return (<div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {labels.map((label, i) => (<div key={i} className={`text-xs font-semibold ${i + 1 === current ? 'text-[#2563EB]' : i + 1 < current ? 'text-[#22C55E]' : 'text-[#94A3B8]'}`}>
            {i + 1 < current ? '✓' : i + 1 === current ? label : label}
          </div>))}
      </div>
      <div className="h-1.5 bg-[#E2E8F0] rounded-full">
        <div className="h-1.5 bg-[#2563EB] rounded-full transition-all duration-300" style={{ width: `${((current - 1) / (total - 1)) * 100}%` }}/>
      </div>
    </div>);
}
