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
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full bg-[var(--surface-raised)] p-12 rounded-3xl border border-[var(--border-default)] text-center">
          <h2 className="text-3xl font-bold mb-4">Application Received!</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Our team will review your application and contact you within 24-48 hours for verification.
          </p>
          <button 
            onClick={() => window.location.href = '/provider/dashboard'}
            className="w-full py-4 bg-[var(--accent)] text-[#000] font-bold rounded-2xl"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-black mb-4">Join the <span className="text-[var(--accent)]">Worki</span> Network</h1>
        <p className="text-[var(--text-secondary)] mb-12">
          Fill out the form below to start your application. We are currently accepting HVAC and Handyman pros in the GTA.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-400">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-[var(--text-secondary)]">Business Name</label>
            <input 
              required
              type="text" 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-2xl p-4 text-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="e.g. Elite HVAC Milton"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-[var(--text-secondary)]">Contact Name</label>
            <input
              required
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-2xl p-4 text-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="e.g. Jamie Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-[var(--text-secondary)]">Phone Number</label>
            <input 
              required
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-2xl p-4 text-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="e.g. 905-555-0123"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-[var(--text-secondary)]">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-2xl p-4 text-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="e.g. hello@elitehvac.ca"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-[var(--text-secondary)]">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-2xl p-4 text-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="https://example.ca"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-[var(--text-secondary)]">Service Areas</label>
            <input
              required
              type="text"
              value={serviceAreas}
              onChange={(e) => setServiceAreas(e.target.value)}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-2xl p-4 text-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="e.g. Milton, Oakville, Burlington"
            />
            <p className="mt-2 text-sm text-[var(--text-tertiary)]">Separate each city or neighborhood with a comma.</p>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-[var(--text-secondary)]">Cal.com Username</label>
            <input
              type="text"
              value={calComUsername}
              onChange={(e) => setCalComUsername(e.target.value.replace(/^@/, '').trimStart())}
              className="w-full bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-2xl p-4 text-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="e.g. elitehvac"
            />
            <p className="mt-2 text-sm text-[var(--text-tertiary)]">Optional, but recommended. This lets Worki send customers straight to your cal.com page.</p>
          </div>
          <fieldset>
            <legend className="block text-sm font-bold mb-3 uppercase tracking-widest text-[var(--text-secondary)]">Service Categories</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceCategoryOptions.map((category) => (
                <label
                  key={category.slug}
                  className="flex items-center gap-3 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-2xl p-4 cursor-pointer hover:border-[var(--accent)] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={serviceCategorySlugs.includes(category.slug)}
                    onChange={() => toggleServiceCategory(category.slug)}
                    className="size-4 accent-[var(--accent)]"
                  />
                  <span className="font-semibold">{category.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-[var(--accent)] text-[#000] font-bold rounded-2xl text-xl hover:opacity-90 transition-opacity mt-8 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
