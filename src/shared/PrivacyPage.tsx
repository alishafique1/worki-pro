import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen py-20 px-6">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
        <p className="text-[var(--text-secondary)]">Last updated: May 1, 2026</p>
        
        <h2 className="text-2xl font-bold mt-12 mb-4">1. Information We Collect</h2>
        <p>We collect information you provide directly to us when you request a service, create an account, or communicate with us via SMS/phone.</p>

        <h2 className="text-2xl font-bold mt-12 mb-4">2. Use of Information</h2>
        <p>We use your information to match you with providers, process rewards, and send you important updates about your home services.</p>

        <h2 className="text-2xl font-bold mt-12 mb-4">3. Data Sharing</h2>
        <p>We share your request details with vetted service providers so they can provide you with quotes and perform services.</p>
        
        <p className="mt-20 text-sm text-[var(--text-secondary)]">Full privacy policy text goes here...</p>
      </div>
    </div>
  );
}
