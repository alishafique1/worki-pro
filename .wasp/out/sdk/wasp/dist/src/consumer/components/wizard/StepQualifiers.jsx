import { useState } from 'react';
import { useQuery, getServiceCategories } from 'wasp/client/operations';
import { CATEGORY_QUALIFIERS } from '../../categoryQualifiers';
const chipClass = (selected) => `px-3 py-1.5 rounded-full border text-sm font-medium cursor-pointer transition-all ${selected
    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
    : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#94A3B8]'}`;
/** Build a flat questions array from DB or hardcoded config. */
function buildQuestions(slug, categories) {
    // 1. Try DB questions on the matching category
    const match = categories?.find((c) => c.slug === slug || c.id === slug);
    const dbQ = match?.questions;
    if (dbQ?.length) {
        return dbQ.map((q) => ({ ...q, required: q.required ?? false }));
    }
    // 2. Fall back to hardcoded categoryQualifiers.ts
    const fallback = CATEGORY_QUALIFIERS[slug];
    if (fallback) {
        const out = [
            { ...fallback.q1, required: false },
        ];
        if (fallback.q2) {
            out.push({ ...fallback.q2, required: false });
        }
        return out;
    }
    return [];
}
export default function StepQualifiers({ state, update, onNext, onBack }) {
    const slug = state.categorySlug ?? '';
    const { data: categories } = useQuery(getServiceCategories);
    const config = CATEGORY_QUALIFIERS[slug];
    const questions = buildQuestions(slug, categories);
    const [answers, setAnswers] = useState(state.qualifierAnswers);
    const [chips, setChips] = useState(state.detailChips);
    const [description, setDescription] = useState(state.description);
    const [error, setError] = useState(null);
    function setAnswer(id, value) {
        setAnswers((prev) => ({ ...prev, [id]: value }));
        setError(null);
    }
    function toggleChip(chip) {
        setChips((prev) => prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]);
    }
    function handleNext() {
        // Validate required questions
        for (const q of questions) {
            if (q.required && !answers[q.id]) {
                setError(`Please answer: ${q.label}`);
                return;
            }
        }
        update({ qualifierAnswers: answers, detailChips: chips, description: description.trim() });
        onNext();
    }
    // ── No questions = skip screen ─────────────────────────────────────────
    if (!questions.length && !config?.detailChips?.length) {
        return (<div>
        <h3 className="text-xl font-black mb-1 text-[#0F172A]">Describe your job</h3>
        <p className="text-[#475569] text-sm mb-6">
          Tell us what you need and we'll match you with the right pro.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-[#475569] mb-1.5">
            What needs doing? <span className="text-red-500">*</span>
          </label>
          <textarea className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] resize-none min-h-[100px]" rows={4} placeholder="Describe the job — the room, the problem, any measurements or model numbers." value={description} onChange={(e) => setDescription(e.target.value)}/>
          <p className="text-xs text-[#94A3B8] mt-1">
            Aim for at least 20 characters so pros can quote accurately.
          </p>
        </div>
        <div className="flex justify-end mt-6">
          <button type="button" onClick={handleNext} className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-full hover:bg-[#1D4ED8] transition-colors">
            Continue →
          </button>
        </div>
      </div>);
    }
    return (<div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">Tell us more</h3>
      <p className="text-[#475569] text-sm mb-6">
        Help pros understand your job. All questions are optional unless marked.
      </p>

      {questions.map((q) => (<div key={q.id} className="mb-5">
          <p className="text-sm font-semibold text-[#475569] mb-2">
            {q.label}
            {!q.required && (<span className="font-normal text-[#94A3B8] text-sm ml-1">(optional)</span>)}
          </p>
          <div className="flex flex-wrap gap-2">
            {q.options.map((opt) => (<button key={opt} type="button" onClick={() => setAnswer(q.id, opt)} className={`px-4 py-2 rounded-full text-sm border-2 transition-all ${answers[q.id] === opt
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-bold'
                    : 'border-[#E2E8F0] text-[#475569] hover:border-[#94A3B8]'}`}>
                {opt}
              </button>))}
          </div>
        </div>))}

      {/* detailChips from hardcoded config */}
      {config?.detailChips && config.detailChips.length > 0 && (<div className="mb-5">
          <p className="text-sm font-semibold text-[#475569] mb-2">
            {config.detailChipsLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {config.detailChips.map((chip) => (<button key={chip} type="button" onClick={() => toggleChip(chip)} className={chipClass(chips.includes(chip))}>
                {chip}
              </button>))}
          </div>
        </div>)}

      {/* Optional description */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#475569] mb-1.5">
          Describe the job <span className="font-normal opacity-60">(optional)</span>
        </label>
        <textarea className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] resize-none min-h-[100px]" rows={4} placeholder="e.g. 'AC unit in the basement stopped working overnight. Thermostat shows no power. Unit is about 8 years old.'" value={description} onChange={(e) => setDescription(e.target.value)}/>
      </div>

      {error && (<p className="text-sm text-red-500 mb-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
          {error}
        </p>)}

      <div className="flex justify-between mt-4">
        <button type="button" onClick={onBack} className="text-[#475569] font-bold hover:text-[#0F172A] transition-colors">
          ← Back
        </button>
        <button type="button" onClick={handleNext} className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-full hover:bg-[#1D4ED8] transition-colors">
          Continue →
        </button>
      </div>
    </div>);
}
//# sourceMappingURL=StepQualifiers.jsx.map