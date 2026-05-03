import React, { useEffect, useState } from 'react';
import { useAction, useQuery, submitServiceRequest, getProviderById } from 'wasp/client/operations';
import { useNavigate, useLocation } from 'react-router';

const SERVICES = [
  { slug: 'hvac', label: 'HVAC', icon: '❄️', color: 'blue', description: 'Heating, cooling, air quality, and seasonal maintenance.' },
  { slug: 'handyman', label: 'Handyman', icon: '🔨', color: 'amber', description: 'Repairs, mounting, assembly, and small home projects.' },
  { slug: 'plumbing', label: 'Plumbing', icon: '🚿', color: 'cyan', description: 'Leaks, drains, fixtures, and water line issues.' },
  { slug: 'electrical', label: 'Electrical', icon: '⚡', color: 'yellow', description: 'Outlets, fixtures, panels, EV chargers, and safety checks.' },
  { slug: 'appliance-repair', label: 'Appliance Repair', icon: '🔧', color: 'emerald', description: 'Fridges, washers, dryers, stoves, and dishwashers.' },
  { slug: 'smart-home', label: 'Smart Home', icon: '🏠', color: 'purple', description: 'Cameras, thermostats, locks, sensors, and setup support.' },
] as const;

type ServiceSlug = (typeof SERVICES)[number]['slug'];
type Urgency = 'EMERGENCY' | 'STANDARD' | 'PLANNED';
type ServiceColor = (typeof SERVICES)[number]['color'];

const SERVICE_SLUGS = new Set<string>(SERVICES.map(service => service.slug));

const isServiceSlug = (value: string): value is ServiceSlug => SERVICE_SLUGS.has(value);

const SERVICE_COLOR_MAP: Record<ServiceColor, string> = {
  blue: 'border-blue-400 bg-blue-500/10 text-blue-400',
  amber: 'border-amber-400 bg-amber-500/10 text-amber-400',
  cyan: 'border-cyan-400 bg-cyan-500/10 text-cyan-400',
  yellow: 'border-yellow-400 bg-yellow-500/10 text-yellow-400',
  emerald: 'border-emerald-400 bg-emerald-500/10 text-emerald-400',
  purple: 'border-purple-400 bg-purple-500/10 text-purple-400',
};

const URGENCY_META: Record<Urgency, { label: string; emoji: string; desc: string }> = {
  STANDARD: { label: 'Standard', emoji: '📅', desc: 'Match me with normal timing' },
  EMERGENCY: { label: 'Urgent', emoji: '🚨', desc: 'Prioritize provider routing' },
  PLANNED: { label: 'Planned', emoji: '🗓️', desc: 'I am scheduling ahead' },
};

const MATCHING_STEPS = [
  'We review the request details.',
  'We route it to relevant local providers.',
  'You get the next step by phone or email.',
];

export default function RequestServicePage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const initialPostalCode = queryParams.get('postalCode') || '';
  const initialService = queryParams.get('service') || '';
  const preSelectedProId = queryParams.get('proId') || '';
  const { data: preSelectedPro } = useQuery(
    getProviderById,
    { providerId: preSelectedProId },
    { enabled: !!preSelectedProId }
  );

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    postalCode: string;
    description: string;
    urgency: Urgency;
    serviceType: ServiceSlug | '';
    estimatedSchedule: string;
    preferredTime: string;
  }>({
    name: '',
    email: '',
    phone: '',
    postalCode: initialPostalCode,
    description: '',
    urgency: 'STANDARD',
    serviceType: isServiceSlug(initialService) ? initialService : '',
    estimatedSchedule: '',
    preferredTime: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitRequest = useAction(submitServiceRequest);

  useEffect(() => {
    if (!preSelectedPro || formData.serviceType !== '') return;
    const firstCategory = preSelectedPro.categories?.[0]?.serviceCategory;
    const slug = firstCategory?.slug;
    if (slug && isServiceSlug(slug)) {
      setFormData(prev => ({ ...prev, serviceType: slug }));
    }
  }, [preSelectedPro, formData.serviceType]);

  const selectedService = SERVICES.find(service => service.slug === formData.serviceType);

  const canSubmit =
    formData.serviceType !== '' &&
    formData.description.trim() !== '' &&
    formData.postalCode.trim() !== '' &&
    formData.estimatedSchedule.trim() !== '' &&
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.phone.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const newRequest = await submitRequest({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        postalCode: formData.postalCode,
        description: formData.description,
        urgency: formData.urgency,
        serviceType: formData.serviceType || undefined,
        preferredProviderId: preSelectedProId || undefined,
        estimatedSchedule: formData.estimatedSchedule,
        preferredTime: formData.preferredTime || 'ANYTIME',
      });
      navigate('/request-success', { state: { requestId: newRequest.id } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Please try again.';
      alert('Error submitting request: ' + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-foreground focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-secondary)]';

  return (
    <div className="min-h-screen mesh-gradient dark:mesh-gradient-dark flex items-stretch">
      <aside className="hidden lg:flex flex-col justify-between w-[380px] shrink-0 p-10 border-r border-[var(--border-default)] bg-[var(--surface-base)]/40 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-14">
            <span className="text-2xl font-black tracking-tighter">Worki</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mt-1">Request intake</span>
          </div>

          <h2 className="text-3xl font-black tracking-tighter leading-tight mb-6">
            Tell us the job.<br />
            <span className="text-[var(--accent)]">Worki routes it clearly.</span>
          </h2>

          <div className="space-y-5 mb-10">
            {MATCHING_STEPS.map((text, index) => (
              <div key={text} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center text-xs font-black shrink-0">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold">{text}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {['Choose service', 'Describe issue', 'Set location + timing'].map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 bg-[var(--accent)]/20 border-2 border-[var(--accent)] text-[var(--accent)]">
                  {i + 1}
                </div>
                <span className="text-sm font-semibold text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface-overlay)] p-5 text-sm text-[var(--text-secondary)]">
          <p className="font-black text-foreground mb-2">After you submit</p>
          <p>Worki creates your request and sends it to our matching workflow. A coordinator or provider follow-up comes through your contact details.</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="lg:hidden flex items-center justify-between px-6 pt-6 pb-2">
          <span className="text-xl font-black tracking-tighter">Worki <span className="text-[var(--accent)]">Request</span></span>
          <span className="text-xs text-[var(--text-secondary)] font-semibold">3 questions</span>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 lg:px-12 pb-12">
          {preSelectedPro && (
            <div className="mb-6 flex items-center gap-3 rounded-[20px] border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-black text-black">
                {preSelectedPro.businessName?.charAt(0).toUpperCase() ?? 'P'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black">{preSelectedPro.businessName}</p>
                <p className="text-xs font-semibold text-[var(--text-secondary)]">This pro will be notified first.</p>
              </div>
            </div>
          )}
          <div className="flex-1 glass dark:glass-dark rounded-[32px] border border-white/10 shadow-2xl p-8 lg:p-12 overflow-hidden">
            <div className="space-y-10">
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)] mb-3">Question 1 of 3</p>
                <h2 className="text-2xl font-black tracking-tight mb-2">What kind of help do you need?</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-8">Choose one category so Worki can route your request quickly.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {SERVICES.map(({ slug, label, icon, color, description }) => {
                    const selected = formData.serviceType === slug;
                    const colorClass = SERVICE_COLOR_MAP[color];
                    return (
                      <button
                        type="button"
                        key={slug}
                        onClick={() => setFormData({ ...formData, serviceType: slug })}
                        className={`relative flex min-h-[170px] flex-col items-start justify-between gap-4 p-5 rounded-[24px] border-2 text-left transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] ${
                          selected
                            ? `${colorClass} scale-[1.02] shadow-lg`
                            : 'border-[var(--border-default)] bg-[var(--surface-base)] hover:border-[var(--accent)]/50'
                        }`}
                      >
                        {selected && (
                          <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--accent)] text-black text-[10px] font-black flex items-center justify-center">✓</span>
                        )}
                        <span className="text-4xl">{icon}</span>
                        <span>
                          <span className="block text-base font-black leading-tight">{label}</span>
                          <span className="mt-2 block text-xs font-semibold leading-relaxed text-[var(--text-secondary)]">{description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)] mb-3">Question 2 of 3</p>
                <h2 className="text-2xl font-black tracking-tight mb-2">Tell us what is happening</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-8">Share key details so we can match correctly.</p>
                <div className="space-y-6">
                  {selectedService && (
                    <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border-default)] bg-[var(--surface-base)] px-4 py-2 text-sm font-bold">
                      <span>{selectedService.icon}</span>
                      <span>{selectedService.label}</span>
                    </div>
                  )}
                  <textarea
                    required
                    rows={5}
                    placeholder="Example: The furnace turns on but no warm air comes out. It started yesterday, and the unit is in the basement."
                    className={`${inputClass} resize-none`}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-3">How urgent is this?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(['STANDARD', 'EMERGENCY', 'PLANNED'] as const).map((urgency) => {
                        const meta = URGENCY_META[urgency];
                        return (
                          <button
                            type="button"
                            key={urgency}
                            onClick={() => setFormData({ ...formData, urgency })}
                            className={`flex flex-col items-center gap-1 py-4 px-3 rounded-[18px] border-2 font-bold transition-all duration-200 ${
                              formData.urgency === urgency
                                ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-foreground'
                                : 'bg-[var(--surface-base)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent)]/40'
                            }`}
                          >
                            <span className="text-xl">{meta.emoji}</span>
                            <span className="text-xs font-black uppercase tracking-widest">{meta.label}</span>
                            <span className="text-[10px] font-medium opacity-70 text-center">{meta.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)] mb-3">Question 3 of 3</p>
                <h2 className="text-2xl font-black tracking-tight mb-2">Where and when should we follow up?</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-8">This helps us route by service area and timing.</p>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Postal code</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. L9T 0A1"
                      className={inputClass}
                      value={formData.postalCode}
                      onChange={e => setFormData({ ...formData, postalCode: e.target.value.toUpperCase() })}
                      maxLength={7}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Preferred timeline</label>
                    <select
                      required
                      className={inputClass}
                      value={formData.estimatedSchedule}
                      onChange={e => setFormData({ ...formData, estimatedSchedule: e.target.value })}
                    >
                      <option value="">Select timeline</option>
                      <option value="ASAP">As soon as possible</option>
                      <option value="THIS_WEEK">This week</option>
                      <option value="NEXT_WEEK">Next week</option>
                      <option value="FLEXIBLE">Flexible</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-black tracking-tight mb-2">Contact details</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">We only use this for request updates and coordination.</p>
                <div className="grid gap-4 md:grid-cols-3">
                  <input
                    required
                    type="text"
                    placeholder="Full name"
                    className={inputClass}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email address"
                    className={inputClass}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Phone number"
                    className={inputClass}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="px-10 py-4 bg-[var(--accent)] text-black font-black rounded-[22px] hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-[0_0_20px_var(--accent)/30] disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {isSubmitting ? 'Submitting request...' : 'Submit request'}
            </button>
          </div>

          <p className="lg:hidden mt-4 text-center text-xs text-[var(--text-secondary)]">
            Worki routes your request for matching and follow-up after submission.
          </p>
        </form>
      </div>
    </div>
  );
}
