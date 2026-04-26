import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy and GDPR information for Dashboard by Segatt Labs.",
};

export default function PrivacyPage() {
  const updated = "26 April 2026";
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mt-2">Last updated: {updated}</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-sm text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Data Controller</h2>
            <p>Segatt Labs ("we", "us") is the controller of your personal data. Contact: <a href="mailto:privacy@segattlabs.com" className="text-primary hover:underline">privacy@segattlabs.com</a></p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. Data We Collect</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">Account data:</strong> name, email address, hashed password</li>
              <li><strong className="text-foreground">Financial data:</strong> bank account names, balances, transaction history (read-only via Open Banking)</li>
              <li><strong className="text-foreground">Usage data:</strong> pages visited, features used, timestamps</li>
              <li><strong className="text-foreground">Billing data:</strong> subscription plan, payment status (processed by Stripe — we do not store card details)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Legal Basis for Processing</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">Contract performance:</strong> to provide the Service you signed up for</li>
              <li><strong className="text-foreground">Legitimate interest:</strong> to improve and secure the Service</li>
              <li><strong className="text-foreground">Legal obligation:</strong> to comply with applicable law</li>
              <li><strong className="text-foreground">Consent:</strong> for optional communications (you may withdraw at any time)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Open Banking Data</h2>
            <p>Financial data is retrieved from your bank via TrueLayer and Salt Edge, regulated Open Banking providers. This data is stored in our secure database to power your dashboard. We access only read-only data. Connections can be revoked at any time from Settings.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Data Retention</h2>
            <p>We retain your data for as long as your account is active. Upon account deletion, all personal data is permanently deleted within 30 days. Financial data imported from banks is deleted immediately upon account deletion.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Third-Party Processors</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">Stripe</strong> — payment processing</li>
              <li><strong className="text-foreground">TrueLayer</strong> — Open Banking aggregation (UK/EU)</li>
              <li><strong className="text-foreground">Salt Edge</strong> — Open Banking aggregation (EU/CH)</li>
              <li><strong className="text-foreground">Brevo (Sendinblue)</strong> — transactional email</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Your Rights (GDPR)</h2>
            <p>Under GDPR, you have the right to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong className="text-foreground">Access</strong> — request a copy of your data</li>
              <li><strong className="text-foreground">Rectification</strong> — correct inaccurate data</li>
              <li><strong className="text-foreground">Erasure</strong> — delete your account and all data (available in Settings)</li>
              <li><strong className="text-foreground">Portability</strong> — export your data in CSV format (available in Reports)</li>
              <li><strong className="text-foreground">Restriction</strong> — limit processing of your data</li>
              <li><strong className="text-foreground">Objection</strong> — object to processing based on legitimate interest</li>
            </ul>
            <p className="mt-2">To exercise your rights, contact <a href="mailto:privacy@segattlabs.com" className="text-primary hover:underline">privacy@segattlabs.com</a> or use the account deletion feature in Settings.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">8. Cookies</h2>
            <p>We use only essential cookies required for authentication and session management. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">9. Security</h2>
            <p>We use industry-standard security measures including TLS encryption in transit, AES-256 encryption at rest, and regular security audits. Passwords are hashed using bcrypt.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">10. Changes to This Policy</h2>
            <p>We will notify you by email of any material changes to this Policy at least 14 days before they take effect.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">11. Contact & Complaints</h2>
            <p>Contact our Data Protection Officer at <a href="mailto:privacy@segattlabs.com" className="text-primary hover:underline">privacy@segattlabs.com</a>. You have the right to lodge a complaint with the Portuguese data protection authority (CNPD) at <a href="https://www.cnpd.pt" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">cnpd.pt</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
