import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAction } from 'wasp/client/operations';
import { submitLead } from 'wasp/client/operations';
import { useQuery } from 'wasp/client/operations';
import { getServiceCategories } from 'wasp/client/operations';
const BENEFITS = [
    {
        icon: '🎯',
        title: 'Get Found by Ready Customers',
        desc: 'Your services appear in search results when GTA homeowners search for exactly what you offer. No cold calls needed.',
    },
    {
        icon: '💰',
        title: '5% Cashback on Every Job',
        desc: "The Helper's rewards program means customers earn points on every booking, giving you a competitive edge over providers who don't.",
    },
    {
        icon: '✅',
        title: 'Background-Checked & Verified',
        desc: 'Every pro on The Helper is verified. Customers see your licence, insurance, and reviews, building trust that converts to bookings.',
    },
    {
        icon: '📱',
        title: 'Simple Dashboard',
        desc: 'Manage leads, appointments, and earnings from one place. Real-time notifications when a new job matches your services.',
    },
];
const STEPS = [
    { n: '1', title: 'Submit your info', desc: 'Fill out the 60-second form with your name, business, service categories, and contact details.' },
    { n: '2', title: 'We review your application', desc: "Our team checks your licence, insurance, and reviews. Usually takes under 24 hours." },
    { n: '3', title: 'Start receiving leads', desc: "Once approved, your profile goes live. Customers in your area will find you, and there's no commission on leads." },
];
export default function ListYourServicesPage() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        postalCode: '',
        serviceType: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const submitLeadAction = useAction(submitLead);
    const { data: categories } = useQuery(getServiceCategories);
    const handleNext = () => setStep((s) => Math.min(2, s + 1));
    const handlePrev = () => setStep((s) => Math.max(1, s - 1));
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step < 2)
            return handleNext();
        setSubmitting(true);
        setError('');
        try {
            await submitLeadAction({
                name: form.name,
                email: form.email,
                phone: form.phone || undefined,
                postalCode: form.postalCode || undefined,
                serviceType: form.serviceType || undefined,
                message: form.message || undefined,
                source: 'PROVIDER_APPLICATION',
            });
            setSubmitted(true);
        }
        catch (err) {
            setError(err?.message ?? 'Submission failed. Please try again.');
        }
        finally {
            setSubmitting(false);
        }
    };
    if (submitted) {
        return (<div className="min-h-screen bg-[#F8FAFC]">
        <main className="max-w-2xl mx-auto px-6 py-24 flex flex-col justify-center">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-[#F0FDF4] rounded-full mx-auto flex items-center justify-center border border-green-200">
              <span className="text-4xl">✓</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-[#0F172A]">Application Received!</h1>
            <p className="text-lg text-[#475569]">
              Thanks, {form.name.split(' ')[0]}! We'll review your application and get back to you within{' '}
              <strong className="text-[#0F172A]">24 hours</strong>. Check your email at{' '}
              <strong className="text-[#0F172A]">{form.email}</strong> for confirmation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/providers" className="px-8 py-4 bg-white border border-[#E2E8F0] rounded-[22px] font-bold text-[#0F172A] hover:border-[#2563EB] transition-colors">
                Back to For Pros
              </Link>
              <Link to="/discover" className="px-8 py-4 bg-[#2563EB] text-white font-bold rounded-[22px] hover:bg-[#1D4ED8] transition-colors">
                See How It Works
              </Link>
            </div>
          </div>
        </main>
      </div>);
    }
    return (<div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-5xl mx-auto px-6 lg:px-8 pt-24 pb-32">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#475569] mb-10">
          <Link to="/providers" className="hover:text-[#2563EB] transition-colors">For Pros</Link>
          <span>›</span>
          <span className="text-[#94A3B8]">List Your Services</span>
        </div>

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6">
            For Service Professionals
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-6 text-[#0F172A]">
            Get Listed. Get Found.<br />
            <span className="text-[#2563EB]">Grow Your Business.</span>
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto">
            Join 200+ GTA pros already on The Helper. No commission on leads. You pay a flat monthly rate and keep 100% of every job you book.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {BENEFITS.map((b) => (<div key={b.title} className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 hover:border-[#2563EB] transition-colors shadow-sm">
              <div className="text-3xl mb-4">{b.icon}</div>
              <h3 className="font-bold text-base mb-2 text-[#0F172A]">{b.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed">{b.desc}</p>
            </div>))}
        </div>

        {/* How it works */}
        <div className="mb-24">
          <h2 className="text-3xl font-black tracking-tight mb-8 text-center text-[#0F172A]">3 Steps to Get Listed</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s) => (<div key={s.n} className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xl font-black shrink-0">
                    {s.n}
                  </div>
                  {s.n !== '3' && (<div className="hidden md:block absolute left-[3.5rem] top-6 w-full border-t border-dashed border-[#E2E8F0]"/>)}
                </div>
                <h3 className="font-bold text-lg mb-2 text-[#0F172A]">{s.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{s.desc}</p>
              </div>))}
          </div>
        </div>

        {/* Application form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-[#E2E8F0] rounded-[32px] p-10 shadow-sm">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black tracking-tight mb-2 text-[#0F172A]">Apply to Get Listed</h2>
              <p className="text-[#475569]">Takes less than 60 seconds.</p>
            </div>

            {/* Step indicator */}
            <div className="w-full bg-[#EFF6FF] h-1.5 rounded-full mb-10 overflow-hidden">
              <div className="h-full bg-[#2563EB] transition-all duration-700 ease-out" style={{ width: `${(step / 2) * 100}%` }}/>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (<div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#0F172A]">About You</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-[#475569]">Full Name *</label>
                      <input required type="text" placeholder="Raj Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-[#475569]">Business Name *</label>
                      <input required type="text" placeholder="Sharma HVAC Ltd." value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-[#475569]">Email *</label>
                      <input required type="email" placeholder="raj@sharmahvac.ca" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-[#475569]">Phone *</label>
                      <input required type="tel" placeholder="(416) 555-0199" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-[#475569]">Postal Code</label>
                      <input type="text" placeholder="L5M 2K2" maxLength={7} value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors"/>
                    </div>
                  </div>
                </div>)}

              {step === 2 && (<div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#0F172A]">Your Services</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-[#475569]">Primary Service Category *</label>
                    <select required value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors appearance-none cursor-pointer">
                      <option value="">Select a category...</option>
                      {categories?.map((cat) => (<option key={cat.id} value={cat.slug}>{cat.name}</option>))}
                      <option value="other">Other / Multiple categories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-[#475569]">Tell us about your business</label>
                    <textarea rows={4} placeholder="Years in business, service areas, licences held, types of jobs you handle best..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] p-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 transition-colors resize-none"/>
                  </div>
                  <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[14px] p-4 text-sm text-[#475569]">
                    <strong className="text-[#0F172A]">No commitment.</strong> This form starts your application. You'll hear from us within 24 hours with next steps.
                  </div>
                </div>)}

              {error && (<p className="text-sm text-red-600">{error}</p>)}

              <div className="flex gap-4">
                {step > 1 && (<button type="button" onClick={handlePrev} className="flex-1 px-6 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[22px] font-bold text-[#0F172A] hover:border-[#2563EB] transition-colors">
                    Back
                  </button>)}
                <button type="submit" disabled={submitting} className="flex-1 px-6 py-4 bg-[#2563EB] text-white font-bold rounded-[22px] hover:bg-[#1D4ED8] transition-colors disabled:opacity-50">
                  {submitting ? 'Submitting...' : step < 2 ? 'Continue' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-sm text-[#475569] mt-6">
            Already a The Helper pro?{' '}
            <Link to="/provider/dashboard" className="text-[#2563EB] font-bold hover:underline">
              Go to Dashboard
            </Link>
          </p>
        </div>

      </main>
    </div>);
}
