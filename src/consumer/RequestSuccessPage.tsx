import React from 'react';
import { Link, useLocation } from 'react-router';

export default function RequestSuccessPage() {
  const { state } = useLocation() as { state?: { requestId?: string } };
  const requestId = state?.requestId;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC]">
      <div className="max-w-md bg-white p-12 rounded-[40px] border border-[#E2E8F0] shadow-2xl">
        <div className="w-20 h-20 bg-green-50 rounded-full mx-auto mb-8 flex items-center justify-center">
          <svg className="w-10 h-10 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-black tracking-tighter mb-4 text-[#0F172A]">Request Received!</h1>
        <p className="text-[#475569] mb-10 leading-relaxed">
          We've received your service request. Our concierge team is already working on matching you with the perfect pro.
        </p>

        <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-6 rounded-3xl mb-10 text-left">
          <h3 className="font-bold text-[#2563EB] mb-3">Your rewards are now pending</h3>
          <div className="space-y-2 text-sm text-[#475569]">
            <div className="flex justify-between"><span>Request submitted</span><span className="font-bold text-[#0F172A]">+$5 (500 pts)</span></div>
            <div className="flex justify-between"><span>Appointment booked</span><span className="font-bold text-[#0F172A]">+$5 (500 pts)</span></div>
            <div className="flex justify-between"><span>First job completed</span><span className="font-bold text-[#0F172A]">+$50 bonus (5,000 pts)</span></div>
            <div className="flex justify-between"><span>Every job after that</span><span className="font-bold text-[#0F172A]">+5% cashback</span></div>
            <div className="border-t border-[#BFDBFE] pt-2 flex justify-between font-black text-[#0F172A]"><span>First job total</span><span className="text-[#2563EB]">$60 back</span></div>
          </div>
          <p className="text-xs text-[#475569] mt-3">Cash out at $100 to gift cards or service credits. Create an account with the same email/phone to claim and track these rewards.</p>
        </div>

        <div className="flex flex-col gap-4">
          {requestId && (
            <Link
              to={`/book/${requestId}`}
              className="px-8 py-4 bg-[#2563EB] text-white font-black rounded-2xl hover:bg-[#1D4ED8] transition-colors"
            >
              Book Your Appointment
            </Link>
          )}
          <Link
            to="/signup"
            className={`px-8 py-4 font-black rounded-2xl transition-colors ${requestId ? 'border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]' : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'}`}
          >
            Create Account & Earn Points
          </Link>
          <Link
            to="/"
            className="text-sm font-bold text-[#475569] hover:text-[#0F172A] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
