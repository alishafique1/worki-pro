import { useQuery, getServiceCategories } from 'wasp/client/operations';
export default function StepSubService({ state, update, onNext, onBack }) {
    const { data: categories } = useQuery(getServiceCategories);
    const children = categories?.filter(c => c.parentCategoryId === state.categoryId) ?? [];
    function select(cat) {
        update({ subServiceId: cat.id, subServiceName: cat.name });
        onNext();
    }
    function skip() {
        update({ subServiceId: null, subServiceName: null });
        onNext();
    }
    return (<div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">What type of {state.categoryName} work?</h3>
      <p className="text-[#475569] text-sm mb-6">Pick the closest match, or skip if unsure.</p>
      <div className="grid grid-cols-2 gap-3">
        {children.map(cat => (<button key={cat.id} type="button" onClick={() => select(cat)} className={`border-2 rounded-2xl p-5 text-left transition-all cursor-pointer ${state.subServiceId === cat.id ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8]'}`}>
            <p className="font-bold text-sm text-[#0F172A]">{cat.name}</p>
          </button>))}
        {children.length === 0 && (<p className="col-span-2 text-sm text-[#94A3B8] text-center py-4">No sub-services yet — click Skip below.</p>)}
      </div>
      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack} className="text-[#475569] font-bold hover:text-[#0F172A]">← Back</button>
        <button type="button" onClick={skip} className="text-[#2563EB] font-bold hover:underline">Skip →</button>
      </div>
    </div>);
}
