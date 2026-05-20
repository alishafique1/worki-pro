import React, { useState } from 'react';
import { useQuery, useAction, getProviderProfile, updateProviderServices } from 'wasp/client/operations';
import { useRoleGuard } from '../shared/useRoleGuard';
export default function ProviderServicesPage() {
    useRoleGuard('PROVIDER');
    const { data: profile, isLoading, error } = useQuery(getProviderProfile);
    const updateServicesFn = useAction(updateProviderServices);
    const [editingIndex, setEditingIndex] = useState(null);
    const [newService, setNewService] = useState({ name: '', description: '', price: '', categorySlug: '' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    // Derive current services from profile or local state
    const [localServices, setLocalServices] = useState([]);
    const existingServices = profile?.servicesJson
        ? JSON.parse(profile.servicesJson)
        : localServices;
    const handleAddService = () => {
        if (!newService.name.trim() || !newService.categorySlug) {
            setErrorMsg('Service name and category are required.');
            return;
        }
        const service = {
            id: `new-${Date.now()}`,
            name: newService.name.trim(),
            description: newService.description.trim(),
            price: newService.price ? parseFloat(newService.price) : null,
            categorySlug: newService.categorySlug,
        };
        const updated = [...existingServices, service];
        setLocalServices(updated);
        setNewService({ name: '', description: '', price: '', categorySlug: '' });
        setShowAddForm(false);
        setErrorMsg(null);
        saveServices(updated);
    };
    const handleUpdateService = (index, updated) => {
        const list = [...existingServices];
        list[index] = updated;
        setLocalServices(list);
        setEditingIndex(null);
        saveServices(list);
    };
    const handleDeleteService = (index) => {
        if (!confirm('Remove this service listing?'))
            return;
        const list = existingServices.filter((_, i) => i !== index);
        setLocalServices(list);
        saveServices(list);
    };
    const saveServices = async (services) => {
        setSaving(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        try {
            await updateServicesFn({ services });
            setSuccessMsg('Services saved successfully.');
        }
        catch (err) {
            setErrorMsg(err?.message || 'Failed to save services.');
        }
        finally {
            setSaving(false);
        }
    };
    if (isLoading) {
        return (<div className="p-8 max-w-4xl mx-auto space-y-6 bg-[#F8FAFC] min-h-screen">
        <div className="animate-pulse h-12 bg-[#EFF6FF] rounded-[14px] w-1/3"/>
        <div className="animate-pulse h-48 bg-[#EFF6FF] rounded-[24px]"/>
        <div className="animate-pulse h-32 bg-[#EFF6FF] rounded-[24px]"/>
      </div>);
    }
    if (error || !profile) {
        return (<div className="p-8 max-w-4xl mx-auto bg-[#F8FAFC] min-h-screen">
        <div className="bg-white border border-red-500/30 rounded-[24px] p-8 text-center">
          <p className="text-red-600 font-bold">Failed to load profile. Please try again later.</p>
        </div>
      </div>);
    }
    const categories = profile.categories || [];
    const categoryMap = {};
    categories.forEach(c => { categoryMap[c.serviceCategory.slug] = c.serviceCategory.name; });
    return (<div className="p-8 max-w-4xl mx-auto space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A]">Service Listings</h1>
        <p className="text-[#475569] mt-2 text-lg">
          Showcase the specific services you offer. Customers search by these.
        </p>
      </div>

      {/* Success / Error */}
      {successMsg && (<div className="bg-[#F0FDF4] border border-green-200 text-[#15803D] rounded-[14px] px-5 py-3 font-medium">
          {successMsg}
        </div>)}
      {errorMsg && (<div className="bg-red-500/10 border border-red-500/30 text-red-600 rounded-[14px] px-5 py-3 font-medium">
          {errorMsg}
        </div>)}

      {/* Services List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#0F172A]">
            {existingServices.length} Service{existingServices.length !== 1 ? 's' : ''} Listed
          </h2>
          <button onClick={() => setShowAddForm(true)} className="px-5 py-2.5 bg-[#2563EB] text-white font-bold rounded-[14px] hover:bg-[#1D4ED8] transition-colors text-sm">
            + Add Service
          </button>
        </div>

        {existingServices.length === 0 && !showAddForm && (<div className="bg-white border border-[#E2E8F0] rounded-[24px] p-12 text-center">
            <p className="text-[#475569] mb-4">No services listed yet.</p>
            <p className="text-sm text-[#94A3B8]">Add services so customers can find you in search.</p>
          </div>)}

        {existingServices.map((service, index) => (<div key={service.id} className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 hover:border-[#2563EB] transition-colors">
            {editingIndex === index ? (<ServiceEditForm service={service} categoryMap={categoryMap} onSave={(updated) => handleUpdateService(index, updated)} onCancel={() => setEditingIndex(null)}/>) : (<div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-[#0F172A]">{service.name}</h3>
                    {service.price && (<span className="px-3 py-0.5 bg-[#EFF6FF] text-[#2563EB] rounded-full text-sm font-bold border border-[#BFDBFE]">
                        ${service.price.toFixed(2)}
                      </span>)}
                    {service.categorySlug && categoryMap[service.categorySlug] && (<span className="px-3 py-0.5 bg-[#F8FAFC] text-[#94A3B8] rounded-full text-xs font-medium border border-[#E2E8F0]">
                        {categoryMap[service.categorySlug]}
                      </span>)}
                  </div>
                  {service.description && (<p className="text-[#475569] text-sm">{service.description}</p>)}
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => setEditingIndex(index)} className="px-4 py-2 text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteService(index)} className="px-4 py-2 text-sm font-medium text-red-500/70 hover:text-red-600 transition-colors">
                    Remove
                  </button>
                </div>
              </div>)}
          </div>))}
      </div>

      {/* Add Service Form */}
      {showAddForm && (<div className="bg-white border-2 border-[#2563EB] rounded-[24px] p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-lg text-[#0F172A]">Add New Service</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#475569]">Service Name *</label>
              <input type="text" value={newService.name} onChange={e => setNewService(s => ({ ...s, name: e.target.value }))} placeholder="e.g., AC Unit Repair" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] text-base text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#475569]">Category *</label>
              <select value={newService.categorySlug} onChange={e => setNewService(s => ({ ...s, categorySlug: e.target.value }))} className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] text-base text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30">
                <option value="">Select category...</option>
                {categories.map(c => (<option key={c.serviceCategory.slug} value={c.serviceCategory.slug}>
                    {c.serviceCategory.name}
                  </option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#475569]">Price (CAD, optional)</label>
              <input type="number" min="0" step="0.01" value={newService.price} onChange={e => setNewService(s => ({ ...s, price: e.target.value }))} placeholder="e.g., 89.99" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] text-base text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30"/>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5 text-[#475569]">Description</label>
              <textarea value={newService.description} onChange={e => setNewService(s => ({ ...s, description: e.target.value }))} placeholder="Brief description of what's included..." rows={2} className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] text-base text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 resize-none"/>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => { setShowAddForm(false); setErrorMsg(null); }} className="px-5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-medium rounded-[14px] hover:border-[#2563EB] transition-colors text-sm">
              Cancel
            </button>
            <button onClick={handleAddService} disabled={saving} className="px-5 py-2.5 bg-[#2563EB] text-white font-bold rounded-[14px] hover:bg-[#1D4ED8] transition-colors text-sm disabled:opacity-50">
              {saving ? 'Saving...' : 'Add Service'}
            </button>
          </div>
        </div>)}
    </div>);
}
function ServiceEditForm({ service, categoryMap, onSave, onCancel }) {
    const [name, setName] = useState(service.name);
    const [description, setDescription] = useState(service.description);
    const [price, setPrice] = useState(service.price?.toString() ?? '');
    const [categorySlug, setCategorySlug] = useState(service.categorySlug);
    return (<div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] text-base text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30"/>
        <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price (CAD)" className="px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] text-base text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30"/>
        <select value={categorySlug} onChange={e => setCategorySlug(e.target.value)} className="px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] text-base text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30">
          <option value="">Select category...</option>
          {Object.entries(categoryMap).map(([slug, label]) => (<option key={slug} value={slug}>{label}</option>))}
        </select>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Description..." className="px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[14px] text-base text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30 resize-none"/>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors">Cancel</button>
        <button onClick={() => onSave({ ...service, name, description, price: price ? parseFloat(price) : null, categorySlug })} className="px-5 py-2 bg-[#2563EB] text-white font-bold rounded-[14px] hover:bg-[#1D4ED8] transition-colors text-sm">
          Save Changes
        </button>
      </div>
    </div>);
}
