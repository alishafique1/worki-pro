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
  calComUsername: string;
  // Bark-style fields
  slug: string;
  bio: string;
  profilePhotoUrl: string;
  responseTimeMins: string;
};

const statusBadgeClass: Record<string, string> = {
  VERIFIED: 'bg-[#567a58] text-white',
  PENDING: 'bg-[var(--accent)] text-black',
  REJECTED: 'bg-red-600 text-white',
  SUSPENDED: 'bg-[var(--text-tertiary)] text-white',
};

import { useRoleGuard } from '../shared/useRoleGuard';

export default function ProviderProfilePage() {
  useRoleGuard('PROVIDER');
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
    calComUsername: '',
    slug: '',
    bio: '',
    profilePhotoUrl: '',
    responseTimeMins: '',
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
        calComUsername: (profile as any).calComUsername ?? '',
        slug: (profile as any).slug ?? '',
        bio: (profile as any).bio ?? '',
        profilePhotoUrl: (profile as any).profilePhotoUrl ?? '',
        responseTimeMins: (profile as any).responseTimeMins?.toString() ?? '',
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
        calComUsername: (profile as any).calComUsername ?? '',
        slug: (profile as any).slug ?? '',
        bio: (profile as any).bio ?? '',
        profilePhotoUrl: (profile as any).profilePhotoUrl ?? '',
        responseTimeMins: (profile as any).responseTimeMins?.toString() ?? '',
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
        calComUsername: formData.calComUsername || undefined,
        slug: formData.slug || undefined,
        bio: formData.bio || undefined,
        profilePhotoUrl: formData.profilePhotoUrl || undefined,
        responseTimeMins: formData.responseTimeMins ? parseInt(formData.responseTimeMins, 10) : undefined,
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
            {(profile as any).calComUsername && (
              <div className="pt-2 border-t border-[var(--border-default)]">
                <p className="text-sm text-[var(--text-secondary)] mb-1">Cal.com Booking Link</p>
                <a
                  href={`https://cal.com/${(profile as any).calComUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--accent)] hover:underline"
                >
                  cal.com/{(profile as any).calComUsername}
                </a>
              </div>
            )}
            {(profile as any).slug && (
              <div className="pt-2 border-t border-[var(--border-default)]">
                <p className="text-sm text-[var(--text-secondary)] mb-1">Public Profile</p>
                <a
                  href={`/pro-public/${(profile as any).slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--accent)] hover:underline"
                >
                  worki.pro/pro-public/{(profile as any).slug}
                </a>
              </div>
            )}
            {(profile as any).bio && (
              <div className="pt-2 border-t border-[var(--border-default)]">
                <p className="text-sm text-[var(--text-secondary)] mb-2">Bio</p>
                <p className="text-sm leading-relaxed text-foreground">{(profile as any).bio}</p>
              </div>
            )}
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
            { label: 'Cal.com Username', key: 'calComUsername' as const },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">{label}</label>
              <input
                type="text"
                value={formData[key]}
                onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
                className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
              {key === 'calComUsername' && (
                <p className="text-xs text-[var(--text-tertiary)] mt-1.5">
                  Your cal.com username so clients can book you directly.{' '}
                  {formData.calComUsername && (
                    <a
                      href={`https://cal.com/${formData.calComUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[var(--text-secondary)]"
                    >
                      cal.com/{formData.calComUsername}
                    </a>
                  )}
                </p>
              )}
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

          {/* Bark-style public profile fields */}
          <div className="pt-4 border-t border-[var(--border-default)] space-y-4">
            <h3 className="text-base font-bold text-foreground">Public Profile</h3>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">
                Profile Slug <span className="text-[var(--text-tertiary)]">(e.g. "john-smith-hvac")</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="your-business-slug"
                className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
              {formData.slug && (
                <p className="text-xs text-[var(--accent)] mt-1">
                  worki.pro/pro-public/{formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell customers about your experience, specialties, and what makes you stand out…"
                rows={4}
                maxLength={1000}
                className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Profile Photo URL</label>
              <input
                type="url"
                value={formData.profilePhotoUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, profilePhotoUrl: e.target.value }))}
                placeholder="https://…"
                className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">
                Typical Response Time <span className="text-[var(--text-tertiary)]">(minutes)</span>
              </label>
              <input
                type="number"
                value={formData.responseTimeMins}
                onChange={(e) => setFormData((prev) => ({ ...prev, responseTimeMins: e.target.value }))}
                placeholder="e.g. 30"
                min={1}
                max={1440}
                className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
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
