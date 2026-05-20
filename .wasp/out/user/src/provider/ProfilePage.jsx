import React, { useState, useEffect } from 'react';
import { useQuery, useAction, getProviderProfile, updateProviderProfile } from 'wasp/client/operations';
const statusBadgeClass = {
    VERIFIED: 'bg-[#22C55E] text-white',
    PENDING: 'bg-[#FEF3C7] text-amber-700',
    REJECTED: 'bg-red-600 text-white',
    SUSPENDED: 'bg-[#94A3B8] text-white',
};
import { useRoleGuard } from '../shared/useRoleGuard';
export default function ProviderProfilePage() {
    useRoleGuard('PROVIDER');
    const { data: profile, isLoading, error } = useQuery(getProviderProfile);
    const updateProfileFn = useAction(updateProviderProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
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
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    useEffect(() => {
        if (profile) {
            setFormData({
                businessName: profile.businessName ?? '',
                contactName: profile.contactName ?? '',
                phone: profile.phone ?? '',
                email: profile.email ?? '',
                website: profile.website ?? '',
                serviceAreas: profile.serviceAreas?.join(', ') ?? '',
                calComUsername: profile.calComUsername ?? '',
                slug: profile.slug ?? '',
                bio: profile.bio ?? '',
                profilePhotoUrl: profile.profilePhotoUrl ?? '',
                responseTimeMins: profile.responseTimeMins?.toString() ?? '',
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
                contactName: profile.contactName ?? '',
                phone: profile.phone ?? '',
                email: profile.email ?? '',
                website: profile.website ?? '',
                serviceAreas: profile.serviceAreas?.join(', ') ?? '',
                calComUsername: profile.calComUsername ?? '',
                slug: profile.slug ?? '',
                bio: profile.bio ?? '',
                profilePhotoUrl: profile.profilePhotoUrl ?? '',
                responseTimeMins: profile.responseTimeMins?.toString() ?? '',
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
        }
        catch (e) {
            setErrorMsg(e?.message ?? 'Failed to save profile.');
        }
        finally {
            setIsSaving(false);
        }
    };
    const field = (label, value) => (<div>
      <p className="text-sm text-[#475569] mb-1">{label}</p>
      <p className="font-medium text-[#0F172A]">{value || '-'}</p>
    </div>);
    return (<div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Business Profile</h1>
        {!isEditing && profile && (<button onClick={handleEdit} className="px-5 py-2 rounded-[14px] bg-[#2563EB] text-white font-semibold text-sm hover:bg-[#1D4ED8] transition-colors">
            Edit Profile
          </button>)}
      </div>

      {/* Feedback messages */}
      {successMsg && (<div className="px-4 py-3 rounded-[14px] bg-green-50 text-green-700 border border-green-200 text-sm font-medium">
          {successMsg}
        </div>)}
      {errorMsg && (<div className="px-4 py-3 rounded-[14px] bg-red-500/10 text-red-400 border border-red-500/30 text-sm font-medium">
          {errorMsg}
        </div>)}

      {isLoading && <p className="text-[#475569]">Loading profile…</p>}
      {error && <p className="text-red-400">Could not load profile. Have you applied yet?</p>}

      {profile && !isEditing && (<>
          {/* Business Info */}
          <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#0F172A]">Business Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('Business Name', profile.businessName)}
              {field('Contact Name', profile.contactName)}
              {field('Phone', profile.phone)}
              {field('Email', profile.email)}
              {field('Website', profile.website)}
            </div>
            {profile.calComUsername && (<div className="pt-2 border-t border-[#E2E8F0]">
                <p className="text-sm text-[#475569] mb-1">Cal.com Booking Link</p>
                <a href={`https://cal.com/${profile.calComUsername}`} target="_blank" rel="noopener noreferrer" className="font-medium text-[#2563EB] hover:underline">
                  cal.com/{profile.calComUsername}
                </a>
              </div>)}
            {profile.slug && (<div className="pt-2 border-t border-[#E2E8F0]">
                <p className="text-sm text-[#475569] mb-1">Public Profile</p>
                <a href={`/pro-public/${profile.slug}`} target="_blank" rel="noopener noreferrer" className="font-medium text-[#2563EB] hover:underline">
                  thehelper.ca/pro-public/{profile.slug}
                </a>
              </div>)}
            {profile.bio && (<div className="pt-2 border-t border-[#E2E8F0]">
                <p className="text-sm text-[#475569] mb-2">Bio</p>
                <p className="text-sm leading-relaxed text-foreground">{profile.bio}</p>
              </div>)}
          </div>

          {/* Verification Status */}
          <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-[#475569] mb-1">Verification Status</p>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBadgeClass[profile.verificationStatus] ?? 'bg-[#F8FAFC] text-[#475569]'}`}>
                {profile.verificationStatus}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#475569] mb-1">Service Plan</p>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
                {profile.plan ?? 'N/A'}
              </span>
            </div>
          </div>

          {/* Service Areas */}
          <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6">
            <p className="text-sm text-[#475569] mb-2">Service Areas</p>
            <p className="font-medium">
              {profile.serviceAreas?.length ? profile.serviceAreas.join(', ') : 'None specified'}
            </p>
          </div>

          {/* Categories */}
          <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6">
            <p className="text-sm text-[#475569] mb-3">Categories</p>
            {profile.categories?.length ? (<div className="flex flex-wrap gap-2">
                {profile.categories.map((c) => (<span key={`${c.providerId}-${c.serviceCategoryId}`} className="px-3 py-1 text-sm rounded-[14px] bg-[#EFF6FF] border border-[#BFDBFE]">
                    {c.serviceCategory.name}
                  </span>))}
              </div>) : (<p className="text-[#94A3B8] text-sm">No categories assigned.</p>)}
          </div>
        </>)}

      {/* Edit Form */}
      {profile && isEditing && (<div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[#0F172A]">Edit Profile</h2>

          {[
                { label: 'Business Name *', key: 'businessName' },
                { label: 'Contact Name', key: 'contactName' },
                { label: 'Phone *', key: 'phone' },
                { label: 'Email', key: 'email' },
                { label: 'Website', key: 'website' },
                { label: 'Cal.com Username', key: 'calComUsername' },
            ].map(({ label, key }) => (<div key={key}>
              <label className="block text-sm text-[#475569] mb-1">{label}</label>
              <input type="text" value={formData[key]} onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30"/>
              {key === 'calComUsername' && (<p className="text-xs text-[#94A3B8] mt-1.5">
                  Your cal.com username so clients can book you directly.{' '}
                  {formData.calComUsername && (<a href={`https://cal.com/${formData.calComUsername}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#475569]">
                      cal.com/{formData.calComUsername}
                    </a>)}
                </p>)}
            </div>))}

          <div>
            <label className="block text-sm text-[#475569] mb-1">
              Service Areas <span className="text-[#94A3B8]">(comma-separated)</span>
            </label>
            <input type="text" value={formData.serviceAreas} onChange={(e) => setFormData((prev) => ({ ...prev, serviceAreas: e.target.value }))} placeholder="e.g. Toronto, Mississauga, Brampton" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30"/>
          </div>

          {/* Bark-style public profile fields */}
          <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
            <h3 className="text-base font-semibold text-[#0F172A]">Public Profile</h3>

            <div>
              <label className="block text-sm text-[#475569] mb-1">
                Profile Slug <span className="text-[#94A3B8]">(e.g. "john-smith-hvac")</span>
              </label>
              <input type="text" value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} placeholder="your-business-slug" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30"/>
              {formData.slug && (<p className="text-xs text-[#2563EB] mt-1">
                  thehelper.ca/pro-public/{formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')}
                </p>)}
            </div>

            <div>
              <label className="block text-sm text-[#475569] mb-1">Bio</label>
              <textarea value={formData.bio} onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))} placeholder="Tell customers about your experience, specialties, and what makes you stand out…" rows={4} maxLength={1000} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 resize-none"/>
            </div>

            <div>
              <label className="block text-sm text-[#475569] mb-1">Profile Photo URL</label>
              <input type="url" value={formData.profilePhotoUrl} onChange={(e) => setFormData((prev) => ({ ...prev, profilePhotoUrl: e.target.value }))} placeholder="https://…" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30"/>
            </div>

            <div>
              <label className="block text-sm text-[#475569] mb-1">
                Typical Response Time <span className="text-[#94A3B8]">(minutes)</span>
              </label>
              <input type="number" value={formData.responseTimeMins} onChange={(e) => setFormData((prev) => ({ ...prev, responseTimeMins: e.target.value }))} placeholder="e.g. 30" min={1} max={1440} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30"/>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 rounded-[14px] bg-[#2563EB] text-white font-semibold text-sm hover:bg-[#1D4ED8] transition-colors disabled:opacity-50">
              {isSaving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={handleCancel} disabled={isSaving} className="px-6 py-2.5 rounded-[14px] border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>)}
    </div>);
}
