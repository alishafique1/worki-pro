import React from 'react';
import { useQuery, useAction, getProviderAppointments, markJobCompleted } from 'wasp/client/operations';

export default function ProviderAppointmentsPage() {
  const { data: appts, isLoading } = useQuery(getProviderAppointments);
  const markCompletedFn = useAction(markJobCompleted);

  const handleComplete = async (id: string) => {
    try {
      await markCompletedFn({ appointmentId: id });
      alert("Job marked as completed!");
    } catch (e: any) {
      alert("Error updating job: " + e.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Appointments</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {isLoading && <p>Loading...</p>}
        {appts?.length === 0 && <p className="text-[var(--text-secondary)]">No appointments yet.</p>}
        
        {appts?.map((appt: any) => (
          <div key={appt.id} className="bg-[var(--surface-raised)] p-6 rounded-[14px] border border-[var(--border-default)] flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">Status: {appt.status}</p>
              <p className="text-[var(--text-secondary)]">Scheduled for: {appt.scheduledAt ? new Date(appt.scheduledAt).toLocaleString() : 'TBD'}</p>
            </div>
            {appt.status !== 'COMPLETED' && (
              <button 
                onClick={() => handleComplete(appt.id)}
                className="px-6 py-2 bg-[var(--accent)] text-[#000] rounded-[22px] font-bold"
              >
                Mark Completed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
