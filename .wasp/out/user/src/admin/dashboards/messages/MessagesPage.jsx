import React, { useState } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { getAdminLeads, updateLead } from 'wasp/client/operations';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../layout/Breadcrumb';
const STATUS_COLORS = {
    NEW: 'bg-blue-50 text-blue-700',
    CONTACTED: 'bg-yellow-50 text-yellow-700',
    CONVERTED: 'bg-green-50 text-green-700',
    LOST: 'bg-red-50 text-red-700',
};
const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'CONVERTED', 'LOST'];
export default function AdminMessages({ user }) {
    const { data: _leads = [], isLoading, refetch } = useQuery(getAdminLeads);
    const leads = _leads;
    const updateLeadAction = useAction(updateLead);
    const [filter, setFilter] = useState('ALL');
    const [editingNotes, setEditingNotes] = useState(null);
    const [notesText, setNotesText] = useState('');
    const [changingStatus, setChangingStatus] = useState(null);
    const filteredLeads = leads
        ? filter === 'ALL'
            ? leads
            : leads.filter((l) => l.status === filter)
        : [];
    const counts = {
        ALL: leads?.length ?? 0,
        NEW: leads?.filter((l) => l.status === 'NEW').length ?? 0,
        CONTACTED: leads?.filter((l) => l.status === 'CONTACTED').length ?? 0,
        CONVERTED: leads?.filter((l) => l.status === 'CONVERTED').length ?? 0,
        LOST: leads?.filter((l) => l.status === 'LOST').length ?? 0,
    };
    const handleStatusChange = async (leadId, newStatus) => {
        try {
            await updateLeadAction({ leadId, status: newStatus });
            setChangingStatus(null);
            refetch();
        }
        catch (e) {
            alert('Error updating lead: ' + (e.message || 'Please try again.'));
        }
    };
    const handleSaveNotes = async (leadId) => {
        try {
            await updateLeadAction({ leadId, notes: notesText });
            setEditingNotes(null);
            refetch();
        }
        catch (e) {
            alert('Error saving notes: ' + (e.message || 'Please try again.'));
        }
    };
    return (<DefaultLayout user={user}>
      <div className='p-8 max-w-6xl mx-auto space-y-6'>
        <Breadcrumb pageName='Messages'/>

        <div>
          <h1 className='text-3xl font-bold tracking-tight text-[#0F172A]'>Lead Messages</h1>
          <p className='text-[#475569] mt-1'>
            Contact form submissions from the website.
          </p>
        </div>

        {/* Status filter tabs */}
        <div className='flex gap-2 flex-wrap'>
          {['ALL', ...STATUS_OPTIONS].map((s) => (<button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === s
                ? 'bg-[#2563EB] text-white'
                : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#2563EB]'}`}>
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              {counts[s] > 0 && (<span className='ml-1.5 text-xs opacity-70'>({counts[s]})</span>)}
            </button>))}
        </div>

        {isLoading && <p className='text-[#475569]'>Loading leads...</p>}

        {!isLoading && filteredLeads.length === 0 && (<div className='py-12 text-center bg-white rounded-[14px] border border-[#E2E8F0]'>
            <p className='text-[#475569]'>
              {filter === 'ALL' ? 'No leads yet.' : `No ${filter.toLowerCase()} leads.`}
            </p>
          </div>)}

        <div className='space-y-3'>
          {filteredLeads.map((lead) => (<div key={lead.id} className='bg-white p-5 rounded-[14px] border border-[#E2E8F0] hover:border-[#2563EB] transition-colors'>
              <div className='flex justify-between items-start gap-4'>
                {/* Left: lead info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-3 mb-1 flex-wrap'>
                    <h3 className='text-lg font-bold text-[#0F172A]'>{lead.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[lead.status] || 'bg-gray-50 text-gray-600'}`}>
                      {lead.status}
                    </span>
                    {lead.serviceType && (<span className='text-xs bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded-full text-[#475569]'>
                        {lead.serviceType}
                      </span>)}
                  </div>

                  <div className='flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#475569] mb-2'>
                    <span>{lead.email}</span>
                    {lead.phone && <span>{lead.phone}</span>}
                    {lead.postalCode && <span>{lead.postalCode}</span>}
                    {lead.source && <span className='text-xs'>via {lead.source}</span>}
                  </div>

                  {lead.message && (<p className='text-sm text-[#475569] bg-[#F8FAFC] rounded-lg p-3 mb-3 border border-[#E2E8F0]'>
                      {lead.message}
                    </p>)}

                  {/* Notes */}
                  {editingNotes === lead.id ? (<div className='flex flex-col gap-2'>
                      <textarea value={notesText} onChange={(e) => setNotesText(e.target.value)} placeholder='Add internal notes about this lead...' rows={2} className='w-full border border-[#E2E8F0] rounded-lg p-2 text-sm bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB]'/>
                      <div className='flex gap-2'>
                        <button onClick={() => handleSaveNotes(lead.id)} className='px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold rounded-lg transition-colors'>
                          Save
                        </button>
                        <button onClick={() => setEditingNotes(null)} className='px-3 py-1 bg-white border border-[#E2E8F0] text-[#475569] text-sm font-bold rounded-lg hover:border-[#2563EB] transition-colors'>
                          Cancel
                        </button>
                      </div>
                    </div>) : (<button onClick={() => { setEditingNotes(lead.id); setNotesText(lead.notes || ''); }} className='text-xs text-[#475569] hover:text-[#2563EB] underline'>
                      {lead.notes
                    ? `Notes: ${lead.notes.substring(0, 60)}${lead.notes.length > 60 ? '...' : ''}`
                    : '+ Add notes'}
                    </button>)}
                </div>

                {/* Right: meta + actions */}
                <div className='flex flex-col items-end gap-2 shrink-0'>
                  <span className='text-xs text-[#475569]'>
                    {new Date(lead.createdAt).toLocaleDateString('en-CA', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })}
                  </span>

                  {changingStatus === lead.id ? (<select autoFocus onChange={(e) => handleStatusChange(lead.id, e.target.value)} onBlur={() => setChangingStatus(null)} className='border border-[#E2E8F0] rounded-lg px-2 py-1 text-sm bg-white text-[#0F172A] focus:outline-none focus:border-[#2563EB]' defaultValue={lead.status}>
                      {STATUS_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>) : (<button onClick={() => setChangingStatus(lead.id)} className='text-xs text-[#2563EB] hover:underline font-medium'>
                      Change status
                    </button>)}

                  {lead.assignedTo && (<span className='text-xs text-[#475569]'>
                      Assigned: {lead.assignedTo}
                    </span>)}
                </div>
              </div>
            </div>))}
        </div>
      </div>
    </DefaultLayout>);
}
