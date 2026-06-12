import React from 'react';
import { Link, useLocation } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
export default function RequestSuccessPage() {
    const { state } = useLocation();
    const requestId = state?.requestId;
    return (<div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC]">
      <div className="max-w-md bg-white p-12 rounded-[40px] border border-[#E2E8F0] shadow-2xl">
        <div className="w-20 h-20 bg-[#DCFCE7] rounded-full mx-auto mb-8 flex items-center justify-center border-2 border-[#22C55E]">
          <CheckCircle2 className="w-10 h-10 text-[#22C55E]"/>
        </div>
        <h1 className="text-4xl font-black tracking-tighter mb-4 text-[#0F172A]">You're All Set!</h1>
        <p className="text-[#475569] mb-4 leading-relaxed">
          A verified local pro will text you within <strong className="text-[#0F172A]">15 minutes</strong>.
        </p>

        {/* What happens next */}
        <div className="bg-[#F8FAFC] rounded-[18px] border border-[#E2E8F0] p-4 mb-6 text-left">
          <p className="text-xs font-bold text-[#475569] uppercase tracking-widest mb-3">What happens next</p>
          <div className="space-y-2 text-sm text-[#475569]">
            <div className="flex items-center gap-2">
              <span className="text-[#22C55E]">1.</span> Pro reviews your request
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#22C55E]">2.</span> They text you to confirm details
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#22C55E]">3.</span> Book your appointment (same-day available)
            </div>
          </div>
        </div>

        <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-6 rounded-3xl mb-10 text-left">
          <h3 className="font-bold text-[#2563EB] mb-3">Your rewards are now pending</h3>
          <div className="space-y-2 text-sm text-[#475569]">
            <div className="flex justify-between"><span>Request submitted</span><span className="font-bold text-[#0F172A]">500 pts</span></div>
            <div className="flex justify-between"><span>Appointment booked</span><span className="font-bold text-[#0F172A]">500 pts</span></div>
            <div className="flex justify-between"><span>First job completed</span><span className="font-bold text-[#0F172A]">5,000 pts bonus</span></div>
            <div className="flex justify-between"><span>Every job after that</span><span className="font-bold text-[#0F172A]">+5% points back</span></div>
            <div className="border-t border-[#BFDBFE] pt-2 flex justify-between font-black text-[#0F172A]"><span>First job total</span><span className="text-[#2563EB]">6,000 pts</span></div>
          </div>
          <p className="text-xs text-[#475569] mt-3">Cash out at 10,000 pts to gift cards or service credits. Create an account with the same email/phone to claim and track these rewards.</p>
        </div>

        <div className="flex flex-col gap-4">
          {requestId && (<Link to={`/book/${requestId}`} className="px-8 py-4 bg-[#2563EB] text-white font-black rounded-2xl hover:bg-[#1D4ED8] transition-colors">
              Schedule Your Appointment Now
            </Link>)}
          <Link to="/signup" className={`px-8 py-4 font-black rounded-2xl transition-colors ${requestId ? 'border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]' : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'}`}>
            Create Free Account & Track Rewards
          </Link>
          <Link to="/" className="text-sm font-bold text-[#475569] hover:text-[#0F172A] transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=RequestSuccessPage.jsx.map