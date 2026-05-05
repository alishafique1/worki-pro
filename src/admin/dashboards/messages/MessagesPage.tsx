import React, { useState } from 'react';
import type { AuthUser } from 'wasp/auth';
import { useQuery, useAction } from 'wasp/client/operations';
import { getAdminLeads, updateLead } from 'wasp/client/operations';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../layout/Breadcrumb';

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-50 text-blue-700',
  CONTACTED: 'bg-yellow-50 text-yellow-700',
  CONVERTED: 'bg-green-50 text-green-700',
  LOST: 'bg-red-50 text-red-700',
};

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'CONVERTED', 'LOST'];

export default function AdminMessages({ user }: { user: AuthUser }) {
  const { data: _leads = [], isLoading, refetch } = useQuery(getAdminLeads as any);
  const leads = _leads as any[];
  const updateLeadAction = useAction(updateLead);
  const [filter, setFilter] = useState('ALL');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const [changingStatus, setChangingStatus] = useState<string | null>(null);

  const filteredLeads = leads
    ? filter === 'ALL'
      ? leads
      : leads.filter((l: any) => l.status === filter)
    : [];

  const counts = {
    ALL: leads?.length ?? 0,
    NEW: leads?.filter((l: any) => l.status === 'NEW').length ?? 0,
    CONTACTED: leads?.filter((l: any) => l.status === 'CONTACTED').length ?? 0,
    CONVERTED: leads?.filter((l: any) => l.status === 'CONVERTED').length ?? 0,
    LOST: leads?.filter((l: any) => l.status === 'LOST').length ?? 0,
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await updateLeadAction({ leadId, status: newStatus });
      setChangingStatus(null);
      refetch();
    } catch (e: any) {
      alert('Error updating lead: ' + (e.message || 'Please try again.'));
    }
  };

  const handleSaveNotes = async (leadId: string) => {
    try {
      await updateLeadAction({ leadId, notes: notesText });
      setEditingNotes(null);
      refetch();
    } catch (e: any) {
      alert('Error saving notes: ' + (e.message || 'Please try again.'));
    }
  };

  return (
    <DefaultLayout user={user}>
      <div className='p-8 max-w-6xl mx-auto space-y-6'>
        <Breadcrumb pageName='Messages' />

        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Lead Messages</h1>
          <p className='text-[var(--text-secondary)] mt-1'>
            Contact form submissions from the website.
          </p>
        </div>

        {/* Status filter tabs */}
        <div className='flex gap-2 flex-wrap'>
          {['ALL', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                filter === s
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-[var(--surface-raised)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent)]'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              {counts[s as keyof typeof counts] > 0 && (
                <span className='ml-1.5 text-xs opacity-70'>({counts[s as keyof typeof counts]})</span>
              )}
            </button>
          ))}
        </div>

        {isLoading && <p className='text-[var(--text-secondary)]'>Loading leads...</p>}

        {!isLoading && filteredLeads.length === 0 && (
          <div className='py-12 text-center bg-[var(--surface-raised)] rounded-[14px] border border-[var(--border-default)]'>
            <p className='text-[var(--text-secondary)]'>
              {filter === 'ALL' ? 'No leads yet.' : `No ${filter.toLowerCase()} leads.`}
            </p>
          </div>
        )}

        <div className='space-y-3'>
          {filteredLeads.map((lead: any) => (
            <div
              key={lead.id}
              className='bg-[var(--surface-raised)] p-5 rounded-[14px] border border-[var(--border-default)] hover:border-[var(--accent)] transition-colors'
            >
              <div className='flex justify-between items-start gap-4'>
                {/* Left: lead info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-3 mb-1 flex-wrap'>
                    <h3 className='text-lg font-bold'>{lead.name}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        STATUS_COLORS[lead.status] || 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {lead.status}
                    </span>
                    {lead.serviceType && (
                      <span className='text-xs bg-[var(--surface-base)] border border-[var(--border-default)] px-2 py-0.5 rounded-full text-[var(--text-secondary)]'>
                        {lead.serviceType}
                      </span>
                    )}
                  </div>

                  <div className='flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--text-secondary)] mb-2'>
                    <span>{lead.email}</span>
                    {lead.phone && <span>{lead.phone}</span>}
                    {lead.postalCode && <span>{lead.postalCode}</span>}
                    {lead.source && <span className='text-xs'>via {lead.source}</span>}
                  </div>

                  {lead.message && (
                    <p className='text-sm text-[var(--text-secondary)] bg-[var(--surface-base)] rounded-lg p-3 mb-3 border border-[var(--border-default)]'>
                      {lead.message}
                    </p>
                  )}

                  {/* Notes */}
                  {editingNotes === lead.id ? (
                    <div className='flex flex-col gap-2'>
                      <textarea
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        placeholder='Add internal notes about this lead...'
                        rows={2}
                        className='w-full border border-[var(--border-default)] rounded-lg p-2 text-sm bg-[var(--surface-base)] focus:outline-none focus:border-[var(--accent)]'
                      />
                      <div className='flex gap-2'>
                        <button
                          onClick={() => handleSaveNotes(lead.id)}
                          className='px-3 py-1 bg-[var(--accent)] text-black text-sm font-bold rounded-lg hover:opacity-90'
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNotes(null)}
                          className='px-3 py-1 bg-[var(--surface-base)] border border-[var(--border-default)] text-sm font-bold rounded-lg hover:border-[var(--accent)]'
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingNotes(lead.id); setNotesText(lead.notes || ''); }}
                      className='text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] underline'
                    >
                      {lead.notes
                        ? `Notes: ${lead.notes.substring(0, 60)}${lead.notes.length > 60 ? '...' : ''}`
                        : '+ Add notes'}
                    </button>
                  )}
                </div>

                {/* Right: meta + actions */}
                <div className='flex flex-col items-end gap-2 shrink-0'>
                  <span className='text-xs text-[var(--text-secondary)]'>
                    {new Date(lead.createdAt).toLocaleDateString('en-CA', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  {changingStatus === lead.id ? (
                    <select
                      autoFocus
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      onBlur={() => setChangingStatus(null)}
                      className='border border-[var(--border-default)] rounded-lg px-2 py-1 text-sm bg-[var(--surface-base)] focus:outline-none focus:border-[var(--accent)]'
                      defaultValue={lead.status}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <button
                      onClick={() => setChangingStatus(lead.id)}
                      className='text-xs text-[var(--accent)] hover:underline font-medium'
                    >
                      Change status
                    </button>
                  )}

                  {lead.assignedTo && (
                    <span className='text-xs text-[var(--text-secondary)]'>
                      Assigned: {lead.assignedTo}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
}
