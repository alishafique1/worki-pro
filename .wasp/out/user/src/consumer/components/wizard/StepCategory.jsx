import { useQuery, getServiceCategories } from 'wasp/client/operations';
export default function StepCategory({ state, update, onNext }) {
    const { data: categories, isLoading } = useQuery(getServiceCategories);
    const parents = categories?.filter(c => !c.parentCategoryId && c.active) ?? [];
    function select(cat) {
        update({ categoryId: cat.id, categorySlug: cat.slug, categoryName: cat.name, subServiceId: null, subServiceName: null });
        onNext();
    }
    if (isLoading)
        return <div className="animate-pulse text-center text-[#94A3B8] py-8">Loading services…</div>;
    return (<div>
      <h3 className="text-xl font-black mb-1 text-[#0F172A]">What do you need help with?</h3>
      <p className="text-[#475569] text-sm mb-6">Select a category to get started.</p>
      <div className="grid grid-cols-2 gap-3">
        {parents.map(cat => (<button key={cat.id} type="button" onClick={() => select(cat)} className={`border-2 rounded-2xl p-5 text-left transition-all cursor-pointer ${state.categoryId === cat.id ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8]'}`}>
            <p className="font-bold text-sm text-[#0F172A]">{cat.name}</p>
            {cat.description && <p className="text-xs text-[#475569] mt-1 line-clamp-2">{cat.description}</p>}
          </button>))}
      </div>
    </div>);
}
