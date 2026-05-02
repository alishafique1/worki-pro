import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAction } from 'wasp/client/operations';
import { createProviderProfile } from 'wasp/client/operations';

export default function ProviderApplyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);

  const createProfile = useAction(createProviderProfile);

  const GTA_AREAS = [
    'Milton', 'Oakville', 'Burlington', 'Mississauga', 'Brampton',
    'Hamilton', 'Toronto', 'Etobicoke', 'North York', 'Scarborough'
  ];

  const toggleArea = (area: string) => {
    setServiceAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await createProfile({
        businessName,
        contactName: contactName || undefined,
        phone,
        email: email || undefined,
        website: website || undefined,
        serviceAreas,
      });
      navigate('/provider/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedStep1 = businessName.trim().length > 0 && phone.trim().length > 0;

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Join the <span className="text-blue-600">Worki</span> Network</h1>
          <p className="text-gray-500">Get verified and start receiving job leads in the GTA.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>{s}</div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Business info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Business Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Business Name *</label>
                <input
                  required
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Elite HVAC Milton"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Phone Number *</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="905-555-0123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="business@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yourbusiness.com"
                />
              </div>

              <button
                type="button"
                onClick={() => step < 3 && setStep(2)}
                disabled={!canProceedStep1}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Service Areas
              </button>
            </div>
          )}

          {/* Step 2: Service areas */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Service Areas</h2>
              <p className="text-sm text-gray-500">Select all areas you serve. You can change these later.</p>

              <div className="grid grid-cols-2 gap-2">
                {GTA_AREAS.map(area => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArea(area)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      serviceAreas.includes(area)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => step < 3 && setStep(3)}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next: Review
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & submit */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Review & Submit</h2>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div><span className="font-medium text-gray-700">Business:</span> <span className="text-gray-900">{businessName}</span></div>
                {contactName && <div><span className="font-medium text-gray-700">Contact:</span> <span className="text-gray-900">{contactName}</span></div>}
                <div><span className="font-medium text-gray-700">Phone:</span> <span className="text-gray-900">{phone}</span></div>
                {email && <div><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-900">{email}</span></div>}
                {website && <div><span className="font-medium text-gray-700">Website:</span> <span className="text-gray-900">{website}</span></div>}
                <div>
                  <span className="font-medium text-gray-700">Service Areas:</span>
                  <span className="text-gray-900"> {serviceAreas.length > 0 ? serviceAreas.join(', ') : 'None selected'}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                Your application will be reviewed within 24–48 hours. You'll be notified once verified and able to receive leads.
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
