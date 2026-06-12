import React from 'react';
import PageSeo from '../landing-page/components/PageSeo';

export default function TermsPage() {
  return (
    <>
      <PageSeo
        title="Read Our Terms of Service | The Helper"
        description="Know your rights and responsibilities as a The Helper user. Clear terms covering service requests, accounts, rewards, and provider relationships — all in plain language."
        ogTitle="Terms of Service | The Helper"
        ogDescription="The Helper terms of service — marketplace policies, user responsibilities, and provider guidelines in plain language."
        canonicalPath="/terms"
        keywords="terms of service, user agreement, marketplace terms, provider guidelines, The Helper"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Terms of Service | The Helper',
          description: 'The Helper terms of service — marketplace policies, user responsibilities, and provider guidelines for GTA homeowners and service providers.',
          url: 'https://thehelper.ca/terms',
          about: {
            '@type': 'Organization',
            name: 'The Helper Home Services',
            url: 'https://thehelper.ca',
          },
          datePublished: '2024-05-01',
          dateModified: '2025-05-01',
        }}
      />
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white border border-[#E2E8F0] rounded-2xl p-10 shadow-sm">
        <h1 className="text-4xl font-black mb-2 text-[#0F172A]">Terms of Service</h1>
        <p className="text-[#475569] mb-8">Last updated: May 1, 2026</p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-[#0F172A]">1. About TheHelper</h2>
        <p>
          TheHelper Home Services operates a home services marketplace that connects homeowners
          in the Greater Toronto Area with independent, vetted service providers. TheHelper does
          not itself perform home services.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-[#0F172A]">2. Acceptance of Terms</h2>
        <p>
          By accessing or using the TheHelper platform, including submitting a service request,
          creating an account, or accessing any provider features, you agree to be bound
          by these Terms of Service. If you do not agree, do not use the platform.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-[#0F172A]">3. The Marketplace</h2>
        <p>
          TheHelper provides a marketplace connecting homeowners with independent service providers
          ("Providers"). TheHelper is not a party to any service agreement between you and a
          Provider. All services are performed by independent Providers. TheHelper does not
          guarantee the quality, completeness, or outcome of any Provider's work.
        </p>
        <p>
          When you submit a service request, you authorize TheHelper to share your contact and
          job details with relevant Providers for the purpose of fulfilling your request.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-[#0F172A]">4. Accounts and Eligibility</h2>
        <p>
          Service requests can be submitted without an account. To track requests, book
          appointments, and access rewards, you must create an account with accurate
          information. You are responsible for maintaining the confidentiality of your login
          credentials. You must be at least 18 years old to create an account.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-[#0F172A]">5. Rewards Program</h2>
        <p>
          TheHelper operates a points-based rewards program. Points are awarded for eligible
          actions including submitting a service request, booking an appointment, and
          completing a verified job. Points have no monetary value outside of the TheHelper
          rewards redemption process. Points cannot be exchanged for cash. Redemption
          options and minimum thresholds are set by TheHelper and may change at any time.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-[#0F172A]">6. Provider Relationships</h2>
        <p>
          Providers on TheHelper are independent businesses. TheHelper does not employ Providers or
          their staff. Any engagement between you and a Provider, including scheduling,
          pricing, scope of work, and payment, is solely between you and the Provider.
          TheHelper is not responsible for any disputes, damages, or claims arising from a
          Provider's services.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-[#0F172A]">7. Prohibited Use</h2>
        <p>You may not use TheHelper to:</p>
        <ul>
          <li>Submit false, fraudulent, or misleading service requests</li>
          <li>Harass, defame, or threaten Providers or TheHelper staff</li>
          <li>Use the platform for any illegal purpose</li>
          <li>Attempt to circumvent the platform by arranging services outside of TheHelper</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-[#0F172A]">8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, TheHelper Home Services is not liable for
          any indirect, incidental, special, or consequential damages arising from your use
          of the platform or any Provider's services. TheHelper's total liability for any claim
          shall not exceed the amount you paid to TheHelper in the twelve months preceding the
          claim.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-[#0F172A]">9. Changes to Terms</h2>
        <p>
          TheHelper may update these Terms at any time. Updated terms will be posted on this
          page with a revised "Last updated" date. Continued use of the platform after
          changes constitutes acceptance of the updated Terms.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-[#0F172A]">10. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the Province of Ontario and the federal
          laws of Canada applicable therein. Any disputes shall be subject to the exclusive
          jurisdiction of the courts of Ontario.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-[#0F172A]">11. Contact</h2>
        <p>
          For questions about these Terms, contact us at{' '}
          <a href="mailto:hello@thehelper.ca" className="text-[#2563EB] hover:underline">
            hello@thehelper.ca
          </a>
          .
        </p>

        <p className="mt-16 text-sm text-[#94A3B8]">
          The Helper Home Services Inc. | Milton, Ontario, Canada.
        </p>
      </div>
    </div>
    </>
  );
}
