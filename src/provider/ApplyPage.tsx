import React, { useState } from 'react';
import { useAction } from 'wasp/client/operations';
import { updateProviderProfile } from 'wasp/client/operations';

export default function ProviderApplyPage() {
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const updateProfile = useAction(updateProviderProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ businessName, phone, serviceAreas: [] });
      setSubmitted(true);
    } catch (err) {
      window.alert('Error submitting application. Please try again.');
    }
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
            onClick={() => window.location.href = '/dashboard'}
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
          <button 
            type="submit"
            className="w-full py-5 bg-[var(--accent)] text-[#000] font-bold rounded-2xl text-xl hover:opacity-90 transition-opacity mt-8"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
