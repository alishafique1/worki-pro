import React, { useState } from 'react';
import { useAction } from 'wasp/client/operations';
import { submitProviderApplication } from 'wasp/client/operations';

const serviceCategoryOptions = [
  { slug: 'hvac', label: 'HVAC' },
  { slug: 'handyman', label: 'Handyman' },
  { slug: 'plumbing', label: 'Plumbing' },
  { slug: 'electrical', label: 'Electrical' },
  { slug: 'appliance-repair', label: 'Appliance Repair' },
  { slug: 'smart-home', label: 'Smart Home' },
];

export default function ProviderApplyPage() {
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [serviceAreas, setServiceAreas] = useState('');
  const [calComUsername, setCalComUsername] = useState('');
  const [serviceCategorySlugs, setServiceCategorySlugs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const submitApplication = useAction(submitProviderApplication);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await submitApplication({
        businessName,
        contactName,
        phone,
        email,
        website: website || undefined,
        serviceAreas: serviceAreas
          .split(',')
          .map((area) => area.trim())
          .filter(Boolean),
        calComUsername: calComUsername || undefined,
        serviceCategorySlugs,
      });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleServiceCategory = (slug: string) => {
    setServiceCategorySlugs((current) =>
      current.includes(slug)
        ? current.filter((currentSlug) => currentSlug !== slug)
        : [...current, slug]
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-3xl border border-[#E2E8F0] shadow-sm text-center">
          <div className="w-16 h-16 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-[#0F172A]">Application Received!</h2>
          <p className="text-[#475569] mb-8">
            Our team will review your application and contact you within 24-48 hours for verification.
          </p>
          <button
            onClick={() => window.location.href = '/provider/dashboard'}
            className="w-full py-4 bg-[#2563EB] text-white font-bold rounded-2xl hover:bg-[#1D4ED8] transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-black mb-4 text-[#0F172A]">Join the <span className="text-[#2563EB]">Worki</span> Network</h1>
        <p className="text-[#475569] mb-12">
          Fill out the form below to start your application. We are currently accepting HVAC and Handyman pros in the GTA.
        </p>

        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-600">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-[#475569]">Business Name</label>
              <input
                required
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-4 text-lg text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"
                placeholder="e.g. Elite HVAC Milton"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-[#475569]">Contact Name</label>
              <input
                required
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-4 text-lg text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"
                placeholder="e.g. Jamie Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-[#475569]">Phone Number</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-4 text-lg text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"
                placeholder="e.g. 905-555-0123"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-[#475569]">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-4 text-lg text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"
                placeholder="e.g. hello@elitehvac.ca"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-[#475569]">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-4 text-lg text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"
                placeholder="https://example.ca"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-[#475569]">Service Areas</label>
              <input
                required
                type="text"
                value={serviceAreas}
                onChange={(e) => setServiceAreas(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-4 text-lg text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"
                placeholder="e.g. Milton, Oakville, Burlington"
              />
              <p className="mt-2 text-sm text-[#94A3B8]">Separate each city or neighborhood with a comma.</p>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-[#475569]">Cal.com Username</label>
              <input
                type="text"
                value={calComUsername}
                onChange={(e) => setCalComUsername(e.target.value.replace(/^@/, '').trimStart())}
                className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-4 text-lg text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"
                placeholder="e.g. elitehvac"
              />
              <p className="mt-2 text-sm text-[#94A3B8]">Optional, but recommended. This lets Worki send customers straight to your cal.com page.</p>
            </div>
            <fieldset>
              <legend className="block text-sm font-bold mb-3 uppercase tracking-widest text-[#475569]">Service Categories</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceCategoryOptions.map((category) => (
                  <label
                    key={category.slug}
                    className={`flex items-center gap-3 bg-white border rounded-2xl p-4 cursor-pointer transition-colors ${
                      serviceCategorySlugs.includes(category.slug)
                        ? 'border-[#2563EB] bg-[#EFF6FF]'
                        : 'border-[#E2E8F0] hover:border-[#2563EB]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={serviceCategorySlugs.includes(category.slug)}
                      onChange={() => toggleServiceCategory(category.slug)}
                      className="size-4 accent-[#2563EB]"
                    />
                    <span className="font-semibold text-[#0F172A]">{category.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-[#2563EB] text-white font-bold rounded-2xl text-xl hover:bg-[#1D4ED8] transition-colors mt-8 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
