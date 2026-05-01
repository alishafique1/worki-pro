import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen py-20 px-6">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
        <p className="text-[var(--text-secondary)]">Last updated: May 1, 2026</p>
        
        <h2 className="text-2xl font-bold mt-12 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing or using the Worki platform, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform.</p>

        <h2 className="text-2xl font-bold mt-12 mb-4">2. The Marketplace</h2>
        <p>Worki provides a marketplace connecting homeowners with service providers. We do not provide home services ourselves. We are not responsible for the quality of work provided by independent pros.</p>

        <h2 className="text-2xl font-bold mt-12 mb-4">3. Rewards Program</h2>
        <p>Points are awarded after a job is completed and verified by Worki. Points have no cash value until redeemed through our official platform for gift cards or service discounts.</p>
        
        <p className="mt-20 text-sm text-[var(--text-secondary)]">Full legal text for GTA compliance goes here...</p>
      </div>
    </div>
  );
}
