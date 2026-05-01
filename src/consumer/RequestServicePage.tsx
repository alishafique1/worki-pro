import React, { useState } from 'react';
import { useAction, submitServiceRequest } from 'wasp/client/operations';
import { useNavigate } from 'react-router';

export default function RequestServicePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', phone: '', postalCode: '', description: '', urgency: 'STANDARD'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitRequest = useAction(submitServiceRequest);
  const navigate = useNavigate();

  const handleNext = () => setStep(s => Math.min(3, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) return handleNext();
    
    setIsSubmitting(true);
    try {
      await submitRequest(formData as any);
      navigate('/dashboard');
    } catch (err: any) {
      alert("Error submitting request: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-center">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Request Service</h1>
        <span className="text-[var(--accent)] font-bold">Step {step} of 3</span>
      </div>
      
      <div className="w-full bg-[var(--surface-overlay)] h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-[var(--accent)] transition-all duration-500 ease-out" 
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-[var(--surface-raised)] p-8 rounded-[24px] border border-[var(--border-default)] shadow-2xl relative overflow-hidden">
        
        <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute -translate-x-full pointer-events-none'}`}>
          <h2 className="text-2xl font-bold mb-6">What do you need help with?</h2>
          <div className="space-y-4">
            <textarea
              required
              rows={4}
              placeholder="E.g. My kitchen sink is leaking heavily and needs a plumber."
              className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-foreground focus:outline-none focus:border-[var(--accent)] transition-colors"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">Urgency</label>
              <div className="flex gap-4">
                {['STANDARD', 'EMERGENCY', 'PLANNED'].map((urgency) => (
                  <button
                    type="button"
                    key={urgency}
                    onClick={() => setFormData({ ...formData, urgency })}
                    className={`flex-1 py-3 rounded-[14px] font-bold border transition-colors ${
                      formData.urgency === urgency 
                        ? 'bg-[var(--accent)] text-[#000] border-[var(--accent)]' 
                        : 'bg-[var(--surface-base)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--text-tertiary)]'
                    }`}
                  >
                    {urgency}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-500 ${step === 2 ? 'opacity-100 translate-x-0 relative' : 'opacity-0 absolute translate-x-full pointer-events-none'}`}>
          <h2 className="text-2xl font-bold mb-6">Where should we send the pro?</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Postal Code</label>
              <input
                required
                type="text"
                className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-foreground focus:outline-none focus:border-[var(--accent)]"
                value={formData.postalCode}
                onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className={`transition-all duration-500 ${step === 3 ? 'opacity-100 translate-x-0 relative' : 'opacity-0 absolute translate-x-full pointer-events-none'}`}>
          <h2 className="text-2xl font-bold mb-6">Contact Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Full Name</label>
              <input
                required
                type="text"
                className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-foreground focus:outline-none focus:border-[var(--accent)]"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Phone Number (For Updates)</label>
              <input
                required
                type="tel"
                className="w-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-[14px] p-4 text-foreground focus:outline-none focus:border-[var(--accent)]"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button type="button" onClick={handlePrev} className="px-6 py-3 font-bold text-[var(--text-secondary)] hover:text-foreground transition-colors">
              Back
            </button>
          ) : <div></div>}
          
          <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[var(--accent)] text-[#000] font-bold rounded-[22px] hover:opacity-90 transition-opacity">
            {step === 3 ? (isSubmitting ? 'Submitting...' : 'Submit Request') : 'Next Step'}
          </button>
        </div>

      </form>
    </div>
  );
}
