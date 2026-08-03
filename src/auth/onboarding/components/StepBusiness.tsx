import { MapPin } from 'lucide-react';

// Pre-defined GTA service areas. Stored as these string values in Provider.serviceAreas.
const GTA_AREAS = [
  { value: 'Milton', label: 'Milton' },
  { value: 'Oakville', label: 'Oakville' },
  { value: 'Burlington', label: 'Burlington' },
  { value: 'Mississauga', label: 'Mississauga' },
  { value: 'Brampton', label: 'Brampton' },
  { value: 'Toronto', label: 'Toronto' },
  { value: 'Hamilton', label: 'Hamilton' },
  { value: 'Georgetown', label: 'Georgetown' },
  { value: 'Acton', label: 'Acton' },
  { value: 'Halton Hills', label: 'Halton Hills' },
];

type StepBusinessProps = {
  businessName: string;
  serviceAreas: string[];
  onChange: (field: 'businessName' | 'serviceAreas', value: string | string[]) => void;
};

const inputClass =
  'w-full bg-white border border-[#E2E8F0] rounded-[14px] px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors';
const labelClass = 'block text-sm font-semibold text-[#475569] mb-1.5';

export default function StepBusiness({ businessName, serviceAreas, onChange }: StepBusinessProps) {
  function toggleArea(area: string) {
    const next = serviceAreas.includes(area)
      ? serviceAreas.filter((a) => a !== area)
      : [...serviceAreas, area];
    onChange('serviceAreas', next);
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black mb-1 text-[#0F172A]">Business details</h3>
        <p className="text-[#475569] text-sm mb-5">
          Your profile will be reviewed and approved by our team before you can receive leads.
        </p>
      </div>

      <div>
        <label className={labelClass}>Business Name *</label>
        <input
          type="text"
          className={inputClass}
          placeholder="Smith HVAC Services"
          value={businessName}
          onChange={(e) => onChange('businessName', e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-[#2563EB]" />
            Service Areas *
          </span>
        </label>
        <p className="text-xs text-[#475569] mb-3">
          Select all cities / regions where you accept jobs. You can update this later.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {GTA_AREAS.map(({ value, label }) => {
            const checked = serviceAreas.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleArea(value)}
                aria-pressed={checked}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-[12px] border text-sm font-semibold transition-all text-left ${
                  checked
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]'
                    : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#94A3B8]'
                }`}
              >
                <span
                  className={`size-4 rounded flex items-center justify-center border shrink-0 transition-all ${
                    checked ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#CBD5E1]'
                  }`}
                >
                  {checked && (
                    <svg viewBox="0 0 10 8" className="size-2.5 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  )}
                </span>
                {label}
              </button>
            );
          })}
        </div>
        {serviceAreas.length > 0 && (
          <p className="text-xs text-[#2563EB] font-semibold mt-2">
            {serviceAreas.length} area{serviceAreas.length > 1 ? 's' : ''} selected
          </p>
        )}
      </div>
    </div>
  );
}
