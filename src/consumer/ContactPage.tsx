import React, { useState } from 'react';
import { useAction, useQuery } from 'wasp/client/operations';
import { submitLead } from 'wasp/client/operations';
import { getServiceCategories } from 'wasp/client/operations';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';

export default function ContactPage() {
  const navigate = useNavigate();
  const categories = useQuery(getServiceCategories);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postalCode: '',
    serviceType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submitLeadAction = useAction(submitLead);

  const handleNext = () => setStep((s) => Math.min(2, s + 1));
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) return handleNext();

    setIsSubmitting(true);
    try {
      await submitLeadAction({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        postalCode: formData.postalCode || undefined,
        serviceType: formData.serviceType || undefined,
        message: formData.message || undefined,
        source: 'WEBSITE',
      });
      setSubmitted(true);
    } catch (err: any) {
      alert('Error submitting: ' + (err.message || 'Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 max-w-2xl mx-auto min-h-[80vh] flex flex-col justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full mx-auto flex items-center justify-center">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Thanks, {formData.name.split(' ')[0]}!</h1>
          <p className="text-lg text-[var(--text-secondary)]">
            We've received your message and will be in touch within 24 hours.
            A confirmation has been sent to <strong>{formData.email}</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/"
              className="px-8 py-4 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[22px] font-bold hover:border-[var(--accent)] transition-colors"
            >
              Back to Home
            </Link>
            <Link
              to="/discover"
              className="px-8 py-4 bg-[var(--accent)] text-[#000] font-bold rounded-[22px] hover:scale-105 transition-transform"
            >
              Browse Service Pros
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto min-h-[80vh] flex flex-col justify-center">
      <div className="mb-12 flex flex-col items-center text-center">
        <h1 className="text-5xl font-black tracking-tighter mb-4">Get in Touch</h1>
        <p className="text-[var(--text-secondary)]">Tell us what you need — we'll match you with the right pro.</p>
      </div>

      <div className="w-full bg-[var(--surface-overlay)] h-1.5 rounded-full mb-12 overflow-hidden max-w-md mx-auto">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-700 ease-out"
          style={{ width: `${(step / 2) * 100}%` }}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--surface-raised)] border border-[var(--border-default)] p-10 rounded-[32px] shadow-xl relative overflow-hidden"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">About you</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2 font-medium">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="Amir Patel"
                  className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-foreground focus:outline-none focus:border-[var(--accent)] transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2 font-medium">Email Address *</label>
                <input
                  required
                  type="email"
                  placeholder="amir@example.com"
                  className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-foreground focus:outline-none focus:border-[var(--accent)] transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2 font-medium">Phone Number</label>
                <input
                  type="tel"
                  placeholder="(289) 555-0100"
                  className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-foreground focus:outline-none focus:border-[var(--accent)] transition-colors"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2 font-medium">Postal Code</label>
                <input
                  type="text"
                  placeholder="L9T 3Y5"
                  maxLength={7}
                  className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-foreground focus:outline-none focus:border-[var(--accent)] transition-colors"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">What do you need help with?</h2>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2 font-medium">Service Type</label>
              <select
                className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-foreground focus:outline-none focus:border-[var(--accent)] transition-colors appearance-none cursor-pointer"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              >
                <option value="">Select a category...</option>
                {categories.data?.map((cat: any) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
                <option value="other">Other / Not sure yet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2 font-medium">Message</label>
              <textarea
                rows={5}
                placeholder="Describe your project, issue, or what you're looking for..."
                className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-foreground focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-sm text-[var(--text-secondary)]">
              <strong className="text-foreground">No account needed.</strong> We'll follow up by email within 24 hours
              and match you with a vetted local pro.
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="flex-1 px-6 py-4 bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[22px] font-bold hover:border-[var(--accent)] transition-colors"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-4 bg-[var(--accent)] text-[#000] font-bold rounded-[22px] hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? 'Sending...' : step < 2 ? 'Continue' : 'Send Message'}
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
        Prefer to browse pros yourself?{' '}
        <Link to="/discover" className="text-[var(--accent)] font-bold hover:underline">
          Browse verified professionals
        </Link>
      </p>
    </div>
  );
}
