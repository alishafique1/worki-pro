import React from 'react';
import { Link } from 'react-router';
import successImg from '../client/static/signup_success_message_1777671574021.png';

export default function RequestSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center mesh-gradient dark:mesh-gradient-dark">
      <div className="max-w-md glass dark:glass-dark p-12 rounded-[40px] border border-white/10 shadow-2xl">
        <div className="text-6xl mb-8 animate-bounce">✅</div>
        <h1 className="text-4xl font-black tracking-tighter mb-4">Request Received!</h1>
        <p className="text-[var(--text-secondary)] mb-10 leading-relaxed">
          We've received your service request. Our concierge team is already working on matching you with the perfect pro.
        </p>

        <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/20 p-6 rounded-3xl mb-10 text-left">
          <h3 className="font-bold text-[var(--accent)] mb-3">You’re already earning rewards!</h3>
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <div className="flex justify-between"><span>Request submitted</span><span className="font-bold text-foreground">+$5 (500 pts)</span></div>
            <div className="flex justify-between"><span>Appointment booked</span><span className="font-bold text-foreground">+$5 (500 pts)</span></div>
            <div className="flex justify-between"><span>Job completed</span><span className="font-bold text-foreground">+$50 (5,000 pts)</span></div>
            <div className="border-t border-[var(--border-default)] pt-2 flex justify-between font-black text-foreground"><span>Total possible</span><span className="text-[var(--accent)]">$60 back</span></div>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-3">Create a free account to track your rewards and keep them when you redeem.</p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            to="/signup"
            className="px-8 py-4 bg-[var(--accent)] text-black font-black rounded-2xl hover:scale-105 transition-transform"
          >
            Create Account & Earn Points
          </Link>
          <Link
            to="/"
            className="text-sm font-bold text-[var(--text-secondary)] hover:text-foreground transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
