import { useState } from 'react';
import { useQuery, getServiceCategories } from 'wasp/client/operations';
import { CATEGORY_QUALIFIERS } from '../../categoryQualifiers';
export default function StepQualifiers({ state, update, onNext, onBack }) {
    const { data: categories } = useQuery(getServiceCategories);
    const [description, setDescription] = useState(state.description);
    const [answers, setAnswers] = useState(Object.fromEntries(Object.entries(state.qualifierAnswers).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])));
    // Prefer DB questions on the sub-service, fall back to hardcoded categoryQualifiers
    const subCat = categories?.find(c => c.id === state.subServiceId);
    const dbQuestions = subCat?.questions;
    const fallback = state.categorySlug ? CATEGORY_QUALIFIERS[state.categorySlug] : undefined;
    const questions = dbQuestions?.length
        ? dbQuestions
        : fallback
            ? [fallback.q1, ...(fallback.q2 ? [fallback.q2] : [])].map(q => ({ id: q.id, label: q.label, options: q.options }))
            : [];
    function setAnswer(id, value) {
        setAnswers(prev => ({ ...prev, [id]: value }));
    }
    function handleNext() {
        update({ qualifierAnswers: answers, description });
        onNext();
    }
    return (<div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">Tell us more</h3>
      <p className="text-[#475569] text-sm mb-6">Help pros understand your job. All questions are optional.</p>

      {questions.map(q => (<div key={q.id} className="mb-5">
          <p className="text-sm font-semibold text-[#475569] mb-2">{q.label}</p>
          <div className="flex flex-wrap gap-2">
            {q.options.map(opt => (<button key={opt} type="button" onClick={() => setAnswer(q.id, opt)} className={`px-4 py-2 rounded-full text-sm border-2 transition-all ${answers[q.id] === opt ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-bold' : 'border-[#E2E8F0] text-[#475569] hover:border-[#94A3B8]'}`}>
                {opt}
              </button>))}
          </div>
        </div>))}

      <div className="mt-4">
        <label className="block text-sm font-semibold text-[#475569] mb-1.5">Any other details? <span className="font-normal opacity-60">(optional)</span></label>
        <textarea className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] resize-none" rows={3} placeholder="e.g. 'AC stopped working overnight, unit is 8 years old'" value={description} onChange={e => setDescription(e.target.value)}/>
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack} className="text-[#475569] font-bold hover:text-[#0F172A]">← Back</button>
        <button type="button" onClick={handleNext} className="px-8 py-3 bg-[#2563EB] text-white font-bold rounded-full hover:bg-[#1D4ED8] transition-colors">Next →</button>
      </div>
    </div>);
}
//# sourceMappingURL=StepQualifiers.jsx.map