import { Home, Wrench, CheckCircle2 } from 'lucide-react';
const options = [
    {
        role: 'CONSUMER',
        Icon: Home,
        title: 'I need services',
        subtitle: 'Homeowner',
        desc: 'Get matched with vetted local pros in minutes. 100% free.',
        perks: ['No calls, no price shopping', 'Same-day availability', 'Earn rewards on every job'],
        accent: '#2563EB',
        bg: '#EFF6FF',
    },
    {
        role: 'PROVIDER',
        Icon: Wrench,
        title: 'I provide services',
        subtitle: 'Service Pro',
        desc: 'Receive qualified leads from homeowners ready to book.',
        perks: ['No bidding wars', '500 pts per claimed lead', 'Manage jobs in one place'],
        accent: '#0F172A',
        bg: '#F8FAFC',
    },
];
export default function StepRole({ selected, onSelect }) {
    return (<div>
      <h3 className="text-2xl font-black mb-1 text-[#0F172A]">How will you use The Helper?</h3>
      <p className="text-[#475569] text-sm mb-6">Pick your role to get started. You can only choose one.</p>
      <div className="grid grid-cols-1 gap-3">
        {options.map(({ role, Icon, title, subtitle, desc, perks, accent, bg }) => {
            const isSelected = selected === role;
            return (<button key={role} type="button" onClick={() => onSelect(role)} aria-pressed={isSelected} className={`relative w-full text-left rounded-[20px] p-5 border-2 transition-all duration-200 ${isSelected
                    ? 'border-[#2563EB] shadow-[0_0_0_4px_rgba(37,99,235,0.12)]'
                    : 'border-[#E2E8F0] hover:border-[#94A3B8] hover:shadow-sm'}`} style={{ background: isSelected ? bg : '#fff' }}>
              <div className="flex items-start gap-4">
                <div className="size-11 rounded-[14px] flex items-center justify-center shrink-0 mt-0.5" style={{ background: isSelected ? accent : '#F1F5F9' }}>
                  <Icon className="size-5" style={{ color: isSelected ? '#fff' : '#94A3B8' }} strokeWidth={2.5}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">{subtitle}</p>
                      <p className="font-black text-[#0F172A] text-base leading-snug">{title}</p>
                    </div>
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-[#2563EB] bg-[#2563EB]' : 'border-[#E2E8F0]'}`}>
                      {isSelected && <div className="size-2 rounded-full bg-white"/>}
                    </div>
                  </div>
                  <p className="text-[#475569] text-sm mb-3">{desc}</p>
                  <ul className="space-y-1">
                    {perks.map((perk) => (<li key={perk} className="flex items-center gap-2 text-xs text-[#475569]">
                        <CheckCircle2 className="size-3.5 shrink-0" style={{ color: isSelected ? accent : '#CBD5E1' }}/>
                        {perk}
                      </li>))}
                  </ul>
                </div>
              </div>
            </button>);
        })}
      </div>
    </div>);
}
//# sourceMappingURL=StepRole.jsx.map