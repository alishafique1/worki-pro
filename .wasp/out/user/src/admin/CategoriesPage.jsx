import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getAdminCategories, upsertAdminCategory, deleteAdminCategory } from 'wasp/client/operations';
import { useRoleGuard } from '../shared/useRoleGuard';
const ICON_OPTIONS = [
    'Hammer', 'ShowerHead', 'Wifi', 'CalendarCheck', 'UtensilsCrossed',
    'Flame', 'Bot', 'Globe', 'AirVent', 'WashingMachine', 'PlugZap',
    'PaintBucket', 'TreePine', 'Bug', 'Lock', 'Truck', 'Home',
    'Building2', 'Shield', 'Snowflake', 'Leaf', 'Wind', 'Sun', 'Droplets',
];
const BLANK = {
    name: '',
    slug: '',
    description: '',
    icon: 'Hammer',
    imageUrl: '',
    active: true,
};
function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
export default function AdminCategoriesPage() {
    useRoleGuard('ADMIN');
    const { data: rawCats, isLoading, error, refetch } = useQuery(getAdminCategories);
    const categories = rawCats;
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [errMsg, setErrMsg] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const openCreate = () => { setForm({ ...BLANK }); setErrMsg(null); };
    const openEdit = (cat) => {
        setForm({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description ?? '',
            icon: cat.icon ?? 'Hammer',
            imageUrl: cat.imageUrl ?? '',
            active: cat.active,
        });
        setErrMsg(null);
    };
    const handleSave = async () => {
        if (!form)
            return;
        if (!form.name.trim() || !form.slug.trim()) {
            setErrMsg('Name and slug are required.');
            return;
        }
        setSaving(true);
        setErrMsg(null);
        try {
            await upsertAdminCategory({
                id: form.id,
                name: form.name.trim(),
                slug: form.slug.trim(),
                description: form.description.trim() || undefined,
                icon: form.icon || undefined,
                imageUrl: form.imageUrl.trim() || undefined,
                active: form.active,
            });
            setForm(null);
            refetch();
        }
        catch (e) {
            setErrMsg(e?.message ?? 'Failed to save category.');
        }
        finally {
            setSaving(false);
        }
    };
    const handleDelete = async (cat) => {
        setDeleting(cat.id);
        setErrMsg(null);
        try {
            await deleteAdminCategory({ id: cat.id });
            setConfirmDelete(null);
            refetch();
        }
        catch (e) {
            setErrMsg(e?.message ?? 'Failed to delete category.');
        }
        finally {
            setDeleting(null);
        }
    };
    const handleToggleActive = async (cat) => {
        try {
            await upsertAdminCategory({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                description: cat.description ?? undefined,
                icon: cat.icon ?? undefined,
                imageUrl: cat.imageUrl ?? undefined,
                active: !cat.active,
            });
            refetch();
        }
        catch (e) {
            setErrMsg(e?.message ?? 'Failed to toggle category.');
        }
    };
    return (<div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Service Categories</h1>
          <p className="text-[#475569] text-sm mt-1">Add, edit, or remove service categories. Changes apply immediately to onboarding and the listings page.</p>
        </div>
        <button onClick={openCreate} className="px-5 py-2.5 bg-[#2563EB] text-white text-sm font-bold rounded-[12px] hover:bg-[#1D4ED8] transition-colors shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
          + Add Category
        </button>
      </div>

      {errMsg && (<div className="rounded-[12px] bg-red-500/10 border border-red-400/30 px-4 py-3 text-sm text-red-600 flex items-center justify-between">
          <span>{errMsg}</span>
          <button onClick={() => setErrMsg(null)} className="ml-3 font-bold">✕</button>
        </div>)}

      {isLoading && (<div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (<div key={i} className="animate-pulse h-16 bg-[#F8FAFC] rounded-[16px] border border-[#E2E8F0]"/>))}
        </div>)}

      {error && <p className="text-red-600 text-sm">Failed to load categories.</p>}

      {!isLoading && !error && (<div className="bg-white border border-[#E2E8F0] rounded-[20px] overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#475569]">Category</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#475569]">Slug</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#475569]">Icon</th>
                <th className="text-center px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#475569]">Active</th>
                <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#475569]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!categories || categories.length === 0) && (<tr>
                  <td colSpan={5} className="text-center py-12 text-[#475569]">No categories yet. Click "Add Category" to create one.</td>
                </tr>)}
              {categories?.map((cat) => (<tr key={cat.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-[#0F172A]">{cat.name}</div>
                    {cat.description && (<div className="text-xs text-[#475569] mt-0.5 line-clamp-1">{cat.description}</div>)}
                  </td>
                  <td className="px-5 py-4">
                    <code className="text-xs bg-[#F1F5F9] px-2 py-1 rounded-lg text-[#475569]">{cat.slug}</code>
                  </td>
                  <td className="px-5 py-4">
                    <code className="text-xs bg-[#EFF6FF] px-2 py-1 rounded-lg text-[#2563EB]">{cat.icon ?? '—'}</code>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button onClick={() => handleToggleActive(cat)} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${cat.active
                    ? 'bg-green-50 text-[#22C55E] border-green-200 hover:bg-green-100'
                    : 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0] hover:bg-[#E2E8F0]'}`}>
                      <span className={`size-1.5 rounded-full ${cat.active ? 'bg-[#22C55E]' : 'bg-[#94A3B8]'}`}/>
                      {cat.active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(cat)} className="px-3 py-1.5 text-xs font-bold border border-[#E2E8F0] text-[#475569] rounded-[8px] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                        Edit
                      </button>
                      <button onClick={() => setConfirmDelete(cat)} className="px-3 py-1.5 text-xs font-bold border border-red-200 text-red-500 rounded-[8px] hover:bg-red-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>)}

      {/* Edit / Create modal */}
      {form && (<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
              <h2 className="text-xl font-black text-[#0F172A]">{form.id ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setForm(null)} className="text-[#94A3B8] hover:text-[#0F172A] text-xl font-bold">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {errMsg && (<div className="rounded-[12px] bg-red-500/10 border border-red-400/30 px-4 py-3 text-sm text-red-600">{errMsg}</div>)}

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#475569] mb-1.5">Name *</label>
                <input value={form.name} onChange={(e) => setForm((f) => f ? {
                ...f,
                name: e.target.value,
                slug: f.id ? f.slug : slugify(e.target.value),
            } : f)} className="w-full border border-[#E2E8F0] rounded-[12px] px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" placeholder="e.g. Food Catering"/>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#475569] mb-1.5">Slug *</label>
                <input value={form.slug} onChange={(e) => setForm((f) => f ? { ...f, slug: e.target.value } : f)} className="w-full border border-[#E2E8F0] rounded-[12px] px-4 py-2.5 text-sm text-[#0F172A] font-mono focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" placeholder="e.g. food-catering"/>
                <p className="text-xs text-[#94A3B8] mt-1">URL-safe, lowercase, hyphens only. Used in /services/:slug</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#475569] mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => f ? { ...f, description: e.target.value } : f)} rows={2} className="w-full border border-[#E2E8F0] rounded-[12px] px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 resize-none" placeholder="Short description shown on category cards"/>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#475569] mb-1.5">Icon (Lucide name)</label>
                <select value={form.icon} onChange={(e) => setForm((f) => f ? { ...f, icon: e.target.value } : f)} className="w-full border border-[#E2E8F0] rounded-[12px] px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 bg-white">
                  {ICON_OPTIONS.map((icon) => (<option key={icon} value={icon}>{icon}</option>))}
                </select>
                <p className="text-xs text-[#94A3B8] mt-1">Must also be imported in CategoryCardGrid.tsx if new</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#475569] mb-1.5">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm((f) => f ? { ...f, imageUrl: e.target.value } : f)} className="w-full border border-[#E2E8F0] rounded-[12px] px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20" placeholder="https://images.unsplash.com/..."/>
                {form.imageUrl && (<img src={form.imageUrl} alt="" className="mt-2 h-20 w-full object-cover rounded-[8px]" onError={(e) => (e.currentTarget.style.display = 'none')}/>)}
              </div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm((f) => f ? { ...f, active: !f.active } : f)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.active ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'}`}>
                  <span className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${form.active ? 'translate-x-6' : 'translate-x-1'}`}/>
                </button>
                <span className="text-sm font-semibold text-[#0F172A]">{form.active ? 'Active — shown to users' : 'Hidden — not shown to users'}</span>
              </div>
            </div>
            <div className="p-6 border-t border-[#E2E8F0] flex gap-3">
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-[#2563EB] text-white font-bold rounded-[12px] hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
                {saving ? 'Saving…' : form.id ? 'Save Changes' : 'Create Category'}
              </button>
              <button onClick={() => setForm(null)} className="px-6 py-3 border border-[#E2E8F0] text-[#475569] font-bold rounded-[12px] hover:bg-[#F8FAFC] transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>)}

      {/* Delete confirm modal */}
      {confirmDelete && (<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-xl font-black text-[#0F172A]">Delete "{confirmDelete.name}"?</h2>
            <p className="text-sm text-[#475569]">
              This permanently removes the category. Any providers linked to it will lose this category association. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)} disabled={deleting === confirmDelete.id} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-[12px] hover:bg-red-700 transition-colors disabled:opacity-50">
                {deleting === confirmDelete.id ? 'Deleting…' : 'Yes, Delete'}
              </button>
              <button onClick={() => setConfirmDelete(null)} className="px-6 py-3 border border-[#E2E8F0] text-[#475569] font-bold rounded-[12px] hover:bg-[#F8FAFC] transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
