import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen py-20 px-6">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
        <p className="text-[var(--text-secondary)] mb-8">Last updated: May 1, 2026</p>

        <h2 className="text-2xl font-bold mt-10 mb-3">1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us when you:
        </p>
        <ul>
          <li>Submit a service request (name, email, phone number, postal code, job description, urgency level)</li>
          <li>Create an account (name, email, phone number)</li>
          <li>Apply to become a Provider (business name, contact name, phone, email, service areas, website)</li>
          <li>Communicate with us via the platform, SMS, or email</li>
        </ul>
        <p>
          We also collect usage data including your IP address, browser type, pages visited,
          and timestamps — collected automatically through our hosting and analytics infrastructure.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Process and route your service requests to relevant Providers</li>
          <li>Send you appointment confirmations, status updates, and account notifications</li>
          <li>Manage your rewards points and redemptions</li>
          <li>Maintain your account and preferences</li>
          <li>Communicate with you about your requests, appointments, and support inquiries</li>
          <li>Improve the Worki platform and user experience</li>
          <li>Comply with our legal obligations</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">3. Data Sharing</h2>
        <p>
          We share your personal information in the following circumstances:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong> Your request details — including name, contact
            information, postal code, and job description — are shared with vetted Providers in
            your service area so they can respond to your request.
          </li>
          <li>
            <strong>Business Tools:</strong> We use third-party services for SMS delivery
            (Twilio), email delivery (Mailgun), and webhook routing (GoHighLevel). These
            providers process your data solely for the purpose of delivering Worki
            communications.
          </li>
          <li>
            <strong>Legal Compliance:</strong> We may disclose your information if required
            by law, court order, or governmental authority, or if we believe disclosure is
            necessary to prevent fraud, protect rights, or ensure platform safety.
          </li>
        </ul>
        <p>
          We do not sell your personal information to third parties.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">4. Data Retention</h2>
        <p>
          We retain your account data for as long as your account is active. Service request
          and communication records are retained for a minimum of 7 years to comply with
          Ontario business record requirements. You may request deletion of your account and
          associated personal data at any time by contacting us at{' '}
          <a href="mailto:hello@worki.ca" className="text-[var(--accent)] hover:underline">
            hello@worki.ca
          </a>
          ; we will process deletion requests within 30 days, subject to legal retention
          obligations.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">5. Cookies</h2>
        <p>
          Worki uses cookies and similar technologies for authentication, session management,
          and analytics. You can control cookie preferences through your browser settings.
          Disabling cookies may affect platform functionality.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">6. Data Security</h2>
        <p>
          We use industry-standard encryption (TLS/HTTPS) for all data in transit and
          at rest. Provider payment processing is handled by independent payment providers;
          Worki does not store raw payment card data. You are responsible for keeping your
          login credentials confidential.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">7. Your Rights</h2>
        <p>Under Ontario's Freedom of Information and Protection of Privacy Act (FIPPA) and Canada's PIPEDA, you have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate personal information</li>
          <li>Withdraw consent for marketing communications at any time</li>
          <li>Lodge a complaint with the Office of the Information and Privacy Commissioner of Ontario if you believe we have mishandled your data</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:hello@worki.ca" className="text-[var(--accent)] hover:underline">
            hello@worki.ca
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">8. Children's Privacy</h2>
        <p>
          Worki is not intended for individuals under the age of 18. We do not knowingly
          collect personal information from minors. If we become aware that we have collected
          data from a minor, we will delete it promptly.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on
          this page with a revised "Last updated" date. We encourage you to review this
          policy periodically.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">10. Contact</h2>
        <p>
          For privacy-related questions or to submit a data access request, contact our
          privacy team at{' '}
          <a href="mailto:hello@worki.ca" className="text-[var(--accent)] hover:underline">
            hello@worki.ca
          </a>
          .
        </p>

        <p className="mt-16 text-sm text-[var(--text-tertiary)]">
          Worki Home Services Inc. — Milton, Ontario, Canada.
        </p>
      </div>
    </div>
  );
}
