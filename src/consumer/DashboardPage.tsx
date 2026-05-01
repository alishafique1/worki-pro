import React from 'react';
import { useQuery, getMyRequests, getMyRewardAccount } from 'wasp/client/operations';
import { Link } from 'react-router';

export default function DashboardPage() {
  const { data: requests, isLoading: requestsLoading } = useQuery(getMyRequests);
  const { data: rewards, isLoading: rewardsLoading } = useQuery(getMyRewardAccount);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Welcome back 👋</h1>
          <p className="text-[var(--text-secondary)] mt-2 text-lg">Here is what is happening with your home services.</p>
        </div>
        <Link 
          to="/request-service"
          className="px-8 py-4 bg-[var(--accent)] text-[#000] font-bold rounded-[22px] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(242,181,215,0.3)]"
        >
          + Request New Service
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Requests */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">Active Jobs</h2>
          {requestsLoading && <div className="animate-pulse h-32 bg-[var(--surface-raised)] rounded-[24px]"></div>}
          
          {requests?.length === 0 ? (
            <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-12 text-center">
              <div className="w-20 h-20 bg-[var(--surface-overlay)] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl opacity-50">🛠️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">No active requests</h3>
              <p className="text-[var(--text-secondary)]">When you need a pro, request a service and earn points.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests?.map((req) => (
                <div key={req.id} className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-6 hover:border-[var(--accent)] transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="px-3 py-1 bg-[var(--surface-base)] text-xs font-bold rounded-full mb-3 inline-block uppercase tracking-wider">{req.urgency}</span>
                      <h3 className="text-xl font-bold truncate max-w-[400px]">{req.description}</h3>
                    </div>
                    <span className="px-4 py-2 bg-[var(--surface-overlay)] text-[var(--accent)] rounded-full text-sm font-bold">
                      {req.status}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm">Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Rewards Widget */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Wallet</h2>
          
          <div className="bg-gradient-to-br from-[var(--surface-raised)] to-[var(--surface-overlay)] border border-[var(--border-default)] rounded-[24px] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] opacity-10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
            
            {rewardsLoading ? (
               <div className="animate-pulse h-20 bg-[var(--surface-base)] rounded-[14px]"></div>
            ) : (
              <>
                <p className="text-[var(--text-secondary)] font-medium mb-2">Available Points</p>
                <div className="text-6xl font-extrabold text-[var(--accent)] tracking-tighter mb-8">
                  {rewards?.account?.pointsBalance || 0}
                </div>
                
                <div className="pt-6 border-t border-[var(--border-default)] flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Current Tier</p>
                    <p className="font-bold text-lg">{rewards?.account?.level.replace(/_/g, ' ') || 'New Homeowner'}</p>
                  </div>
                  <Link to="/rewards" className="text-sm font-bold text-[var(--accent)] hover:underline">View History →</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
