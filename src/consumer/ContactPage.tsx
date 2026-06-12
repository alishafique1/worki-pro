import React, { useState } from 'react';
import { useAction, useQuery } from 'wasp/client/operations';
import { submitLead } from 'wasp/client/operations';
import { getServiceCategories } from 'wasp/client/operations';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import { CheckCircle2 } from 'lucide-react';

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
          <div className="w-20 h-20 bg-[#DCFCE7] rounded-full mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[#0F172A]">Thanks, {formData.name.split(' ')[0]}!</h1>
          <p className="text-lg text-[#475569]">
            We've received your message and will be in touch within 24 hours.
            A confirmation has been sent to <strong>{formData.email}</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/"
              className="px-8 py-4 bg-white border border-[#E2E8F0] rounded-[22px] font-bold hover:border-[#2563EB] transition-colors text-[#0F172A] shadow-[0_8px_24px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] hover:text-white hover:border-transparent"
            >
              Back to Home
            </Link>
            <Link
              to="/discover"
              className="px-8 py-4 bg-[#2563EB] text-white font-bold rounded-[22px] hover:bg-[#1D4ED8] transition-colors"
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
        <h1 className="text-5xl font-black tracking-tighter mb-4 text-[#0F172A]">Get in Touch</h1>
        <p className="text-[#475569]">Tell us what you need and we'll match you with the right pro.</p>
      </div>

      <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mb-12 overflow-hidden max-w-md mx-auto">
        <div
          className="h-full bg-[#2563EB] transition-all duration-700 ease-out"
          style={{ width: `${(step / 2) * 100}%` }}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E2E8F0] p-10 rounded-[32px] shadow-xl relative overflow-hidden"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0F172A]">About you</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#475569] mb-2 font-medium">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="Amir Patel"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-[#475569] mb-2 font-medium">Email Address *</label>
                <input
                  required
                  type="email"
                  placeholder="amir@example.com"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#475569] mb-2 font-medium">Phone Number</label>
                <input
                  type="tel"
                  placeholder="(289) 555-0100"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-[#475569] mb-2 font-medium">Postal Code</label>
                <input
                  type="text"
                  placeholder="L9T 3Y5"
                  maxLength={7}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0F172A]">What do you need help with?</h2>

            <div>
              <label className="block text-sm text-[#475569] mb-2 font-medium">Service Type</label>
              <select
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors appearance-none cursor-pointer"
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
              <label className="block text-sm text-[#475569] mb-2 font-medium">Message</label>
              <textarea
                rows={5}
                placeholder="Describe your project, issue, or what you're looking for..."
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-sm text-[#475569]">
              <strong className="text-[#0F172A]">No account needed.</strong> We'll follow up by email within 24 hours
              and match you with a vetted local pro.
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="flex-1 px-6 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[22px] font-bold text-[#0F172A] hover:border-[#2563EB] transition-colors"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-4 bg-[#2563EB] text-white font-bold rounded-[22px] hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:hover:bg-[#2563EB]"
          >
            {isSubmitting ? 'Sending...' : step < 2 ? 'Continue' : 'Send Message'}
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-[#475569] mt-6">
        Prefer to browse pros yourself?{' '}
        <Link to="/discover" className="text-[#2563EB] font-bold hover:underline">
          Browse verified professionals
        </Link>
      </p>
    </div>
  );
}
