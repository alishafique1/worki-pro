import { useState } from 'react';
import { useAuth } from 'wasp/client/auth';
import { updateUserProfile } from 'wasp/client/operations';

// ── Shared token constants ────────────────────────────────────────────────────
const inputClass =
  'w-full bg-white border border-[#E2E8F0] rounded-[14px] px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors';
const labelClass = 'block text-sm font-semibold text-[#475569] mb-1.5';

export default function AccountPage() {
  const { data: user } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [postalCode, setPostalCode] = useState(user?.postalCode ?? '');
  const [smsConsent, setSmsConsent] = useState(user?.smsConsent ?? false);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      await updateUserProfile({ firstName, lastName, phone, postalCode, smsConsent });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Page heading */}
        <h1 className="text-2xl font-black text-[#0F172A] mb-2">Account</h1>
        <p className="text-sm text-[#475569] mb-8">Manage your profile information.</p>

        {/* Profile card */}
        <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8">
          <h2 className="text-base font-bold text-[#0F172A] mb-6">Profile Information</h2>

          {/* TODO: Profile photo upload */}
          {/* TODO: Password / email change */}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Read-only email */}
            <div>
              <label className={labelClass}>Email address</label>
              <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] px-4 py-3 text-[#475569] text-sm select-all">
                {user?.email ?? '—'}
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">Email cannot be changed here.</p>
            </div>

            {/* Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name *</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Jane"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Smith"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Phone *</label>
              <input
                type="tel"
                className={inputClass}
                placeholder="(416) 555-0100"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Postal Code */}
            <div>
              <label className={labelClass}>Postal Code *</label>
              <input
                type="text"
                className={`${inputClass} uppercase`}
                placeholder="L9T 2X5"
                value={postalCode}
                onChange={e => setPostalCode(e.target.value.toUpperCase())}
                maxLength={7}
                required
              />
              <p className="text-xs text-[#94A3B8] mt-1">
                We serve Milton, Oakville, Burlington and surrounding GTA areas.
              </p>
            </div>

            {/* SMS consent */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 accent-[#2563EB]"
                checked={smsConsent}
                onChange={e => setSmsConsent(e.target.checked)}
              />
              <span className="text-sm text-[#475569]">
                I agree to receive SMS updates about my service requests
              </span>
            </label>

            {/* Feedback messages */}
            {success && (
              <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#22C55E] rounded-xl px-4 py-3 text-sm text-[#15803D]">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Profile saved
              </div>
            )}
            {error && (
              <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Save button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#2563EB] text-white font-semibold rounded-[14px] px-6 py-3 text-sm hover:bg-[#1D4ED8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
