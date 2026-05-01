import React, { useState, useEffect } from 'react';
import { useQuery, useAction, getProviderProfile, updateProviderProfile } from 'wasp/client/operations';
import type { Provider, ProviderCategory, ServiceCategory } from 'wasp/entities';

type ProfileWithCategories = Provider & {
  categories: (ProviderCategory & { serviceCategory: ServiceCategory })[];
};

type FormData = {
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  website: string;
  serviceAreas: string;
};

const statusBadgeClass: Record<string, string> = {
  VERIFIED: 'bg-[#567a58] text-white',
  PENDING: 'bg-[var(--accent)] text-black',
  REJECTED: 'bg-red-600 text-white',
  SUSPENDED: 'bg-[var(--text-tertiary)] text-white',
};

export default function ProviderProfilePage() {
  const { data: profile, isLoading, error } = useQuery(getProviderProfile);
  const updateProfileFn = useAction(updateProviderProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    website: '',
    serviceAreas: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        businessName: profile.businessName ?? '',
        contactName: (profile as any).contactName ?? '',
        phone: profile.phone ?? '',
        email: (profile as any).email ?? '',
        website: (profile as any).website ?? '',
        serviceAreas: profile.serviceAreas?.join(', ') ?? '',
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        businessName: profile.businessName ?? '',
        contactName: (profile as any).contactName ?? '',
        phone: profile.phone ?? '',
        email: (profile as any).email ?? '',
        website: (profile as any).website ?? '',
        serviceAreas: profile.serviceAreas?.join(', ') ?? '',
      });
    }
    setErrorMsg(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!formData.businessName.trim()) {
      setErrorMsg('Business name is required.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Phone is required.');
      return;
    }

    setIsSaving(true);
    try {
      const serviceAreas = formData.serviceAreas
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await updateProfileFn({
        businessName: formData.businessName,
        contactName: formData.contactName || undefined,
        phone: formData.phone,
        email: formData.email || undefined,
        website: formData.website || undefined,
        serviceAreas,
      });

      setSuccessMsg('Profile updated ✓');
      setIsEditing(false);
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const field = (label: string, value: string | undefined | null) => (
    <div>
      <p className="text-sm text-[var(--text-secondary)] mb-1">{label}</p>
      <p className="font-medium">{value || '—'}</p>
    </div>
  );

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Business Profile</h1>
        {!isEditing && profile && (
          <button
            onClick={handleEdit}
            className="px-5 py-2 rounded-[14px] bg-[var(--accent)] text-black font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Feedback messages */}
      {successMsg && (
        <div className="px-4 py-3 rounded-[14px] bg-[#567a58]/20 text-[#567a58] border border-[#567a58]/40 text-sm font-medium">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="px-4 py-3 rounded-[14px] bg-red-500/10 text-red-400 border border-red-500/30 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {isLoading && <p className="text-[var(--text-secondary)]">Loading profile…</p>}
      {error && <p className="text-red-400">Could not load profile. Have you applied yet?</p>}

      {profile && !isEditing && (
        <>
          {/* Business Info */}
          <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-6 space-y-4">
            <h2 className="text-lg font-semibold">Business Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('Business Name', profile.businessName)}
              {field('Contact Name', (profile as any).contactName)}
              {field('Phone', profile.phone)}
              {field('Email', (profile as any).email)}
              {field('Website', (profile as any).website)}
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Verification Status</p>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBadgeClass[profile.verificationStatus] ?? 'bg-[var(--surface-overlay)] text-[var(--text-secondary)]'}`}
              >
                {profile.verificationStatus}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-[var(--text-secondary)] mb-1">Service Plan</p>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--surface-overlay)] border border-[var(--border-default)]">
                {(profile as any).plan ?? 'N/A'}
              </span>
            </div>
          </div>

          {/* Service Areas */}
          <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-6">
            <p className="text-sm text-[var(--text-secondary)] mb-2">Service Areas</p>
            <p className="font-medium">
              {profile.serviceAreas?.length ? profile.serviceAreas.join(', ') : 'None specified'}
            </p>
          </div>

          {/* Categories */}
          <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-6">
            <p className="text-sm text-[var(--text-secondary)] mb-3">Categories</p>
            {profile.categories?.length ? (
              <div className="flex flex-wrap gap-2">
                {profile.categories.map((c) => (
                  <span
                    key={`${c.providerId}-${c.serviceCategoryId}`}
                    className="px-3 py-1 text-sm rounded-[14px] bg-[var(--surface-overlay)] border border-[var(--border-default)]"
                  >
                    {c.serviceCategory.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[var(--text-tertiary)] text-sm">No categories assigned.</p>
            )}
          </div>
        </>
      )}

      {/* Edit Form */}
      {profile && isEditing && (
        <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-6 space-y-5">
          <h2 className="text-lg font-semibold">Edit Profile</h2>

          {[
            { label: 'Business Name *', key: 'businessName' as const },
            { label: 'Contact Name', key: 'contactName' as const },
            { label: 'Phone *', key: 'phone' as const },
            { label: 'Email', key: 'email' as const },
            { label: 'Website', key: 'website' as const },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">{label}</label>
              <input
                type="text"
                value={formData[key]}
                onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
                className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">
              Service Areas <span className="text-[var(--text-tertiary)]">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={formData.serviceAreas}
              onChange={(e) => setFormData((prev) => ({ ...prev, serviceAreas: e.target.value }))}
              placeholder="e.g. Toronto, Mississauga, Brampton"
              className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-[14px] bg-[var(--accent)] text-black font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSaving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-[14px] border border-[var(--border-default)] text-sm font-semibold hover:bg-[var(--surface-overlay)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
