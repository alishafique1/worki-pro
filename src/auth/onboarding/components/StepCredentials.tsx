import { useQuery, getServiceCategories } from 'wasp/client/operations';
import type { ServiceCategory } from 'wasp/entities';
import { BadgeCheck, Calendar, ShieldCheck } from 'lucide-react';
import { licenceFieldForCategorySlugs } from '../../../shared/credentials';

type StepCredentialsProps = {
  selectedCategoryIds: string[];
  licenceNumber: string;
  insuranceInfo: string;
  wsibClearanceNumber: string;
  calComUsername: string;
  backgroundCheckConsent: boolean;
  onChange: (
    field: 'licenceNumber' | 'insuranceInfo' | 'wsibClearanceNumber' | 'calComUsername' | 'backgroundCheckConsent',
    value: string | boolean,
  ) => void;
};

const inputClass =
  'w-full bg-white border border-[#E2E8F0] rounded-[14px] px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors';
const labelClass = 'block text-sm font-semibold text-[#475569] mb-1.5';

export default function StepCredentials({
  selectedCategoryIds,
  licenceNumber,
  insuranceInfo,
  wsibClearanceNumber,
  calComUsername,
  backgroundCheckConsent,
  onChange,
}: StepCredentialsProps) {
  const { data: categories } = useQuery(getServiceCategories);
  const selectedSlugs = ((categories as ServiceCategory[]) ?? [])
    .filter((c) => selectedCategoryIds.includes(c.id))
    .map((c) => c.slug);
  const licenceField = licenceFieldForCategorySlugs(selectedSlugs);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-xl font-black mb-1 text-[#0F172A]">Licences, insurance & availability</h3>
        <p className="text-[#475569] text-sm mb-4">
          All credential fields are optional — you can add them later from your profile. Our team
          checks submitted numbers against public registries before approval.
        </p>
        <div className="flex items-start gap-2.5 rounded-[14px] bg-[#FEF3C7] border border-[#F59E0B]/30 px-4 py-3">
          <BadgeCheck className="size-4 mt-0.5 shrink-0 text-[#F59E0B]" />
          <p className="text-xs font-semibold text-[#B45309]">
            Verified pros get priority in the lead feed and a badge on their public profile.
          </p>
        </div>
      </div>

      {/* Licence number */}
      <div>
        <label className={labelClass}>{licenceField.label}</label>
        <input
          type="text"
          className={inputClass}
          placeholder="e.g. 1234567"
          value={licenceNumber}
          onChange={(e) => onChange('licenceNumber', e.target.value)}
        />
        <p className="text-xs text-[#475569] mt-1">{licenceField.hint}</p>
      </div>

      {/* Insurance */}
      <div>
        <label className={labelClass}>Insurance provider & policy # (or certificate link)</label>
        <input
          type="text"
          className={inputClass}
          placeholder="e.g. Intact — policy CGL-123456, or a link to your certificate"
          value={insuranceInfo}
          onChange={(e) => onChange('insuranceInfo', e.target.value)}
        />
        <p className="text-xs text-[#475569] mt-1">
          Commercial general liability details, or a link to your certificate of insurance.
        </p>
      </div>

      {/* WSIB */}
      <div>
        <label className={labelClass}>WSIB clearance #</label>
        <input
          type="text"
          className={inputClass}
          placeholder="e.g. 1234567"
          value={wsibClearanceNumber}
          onChange={(e) => onChange('wsibClearanceNumber', e.target.value)}
        />
        <p className="text-xs text-[#475569] mt-1">
          Your WSIB clearance certificate number, if you have employees.
        </p>
      </div>

      {/* Availability calendar — Cal.com */}
      <div>
        <label className={labelClass}>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-[#2563EB]" />
            Cal.com username (availability calendar)
          </span>
        </label>
        <div className="flex items-center">
          <span className="flex items-center px-3.5 py-3 bg-[#F8FAFC] border border-r-0 border-[#E2E8F0] rounded-l-[14px] text-[#475569] text-sm select-none">
            cal.com/
          </span>
          <input
            type="text"
            className="flex-1 bg-white border border-[#E2E8F0] rounded-r-[14px] px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors"
            placeholder="your-username"
            value={calComUsername}
            onChange={(e) => onChange('calComUsername', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          />
        </div>
        <p className="text-xs text-[#475569] mt-1">
          Optional. Lets customers book directly from your profile. Create a free account at{' '}
          <a href="https://cal.com" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] underline">
            cal.com
          </a>{' '}
          and set up a "worki-service" event type.
        </p>
      </div>

      {/* Background check consent */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="size-5 text-[#2563EB] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-[#0F172A] mb-1">Background check consent</p>
            <p className="text-xs text-[#475569] mb-3">
              The Helper partners with a third-party provider to run optional background checks on
              service pros. Consenting now speeds up your verification — you can also do this later
              from your profile.
            </p>
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={backgroundCheckConsent}
                onChange={(e) => onChange('backgroundCheckConsent', e.target.checked)}
                className="mt-0.5 size-4 accent-[#2563EB] shrink-0"
              />
              <span className="text-xs text-[#0F172A] font-semibold leading-relaxed">
                I consent to The Helper initiating a background check on my behalf as part of the
                pro verification process.
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
