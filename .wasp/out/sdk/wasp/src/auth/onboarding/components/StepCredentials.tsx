import { useQuery, getServiceCategories } from 'wasp/client/operations';
import type { ServiceCategory } from 'wasp/entities';
import { BadgeCheck } from 'lucide-react';
import { licenceFieldForCategorySlugs } from '../../../shared/credentials';

type StepCredentialsProps = {
  selectedCategoryIds: string[];
  licenceNumber: string;
  insuranceInfo: string;
  wsibClearanceNumber: string;
  onChange: (
    field: 'licenceNumber' | 'insuranceInfo' | 'wsibClearanceNumber',
    value: string,
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
  onChange,
}: StepCredentialsProps) {
  const { data: categories } = useQuery(getServiceCategories);
  const selectedSlugs = ((categories as ServiceCategory[]) ?? [])
    .filter((c) => selectedCategoryIds.includes(c.id))
    .map((c) => c.slug);
  const licenceField = licenceFieldForCategorySlugs(selectedSlugs);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-black mb-1 text-[#0F172A]">Licences & insurance</h3>
        <p className="text-[#475569] text-sm mb-4">
          All fields are optional — you can add them later from your profile. Our team checks
          submitted numbers against the public registries before approval.
        </p>
        <div className="flex items-start gap-2.5 rounded-[14px] bg-[#FEF3C7] border border-[#F59E0B]/30 px-4 py-3 mb-1">
          <BadgeCheck className="size-4 mt-0.5 shrink-0 text-[#F59E0B]" />
          <p className="text-xs font-semibold text-[#B45309]">
            Verified pros get priority in the lead feed and a badge on their public profile.
          </p>
        </div>
      </div>

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
    </div>
  );
}
