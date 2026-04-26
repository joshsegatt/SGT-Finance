import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Dashboard by Segatt Labs.",
};

export default function TermsPage() {
  const updated = "26 April 2026";
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mt-2">Last updated: {updated}</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-sm text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using the Dashboard platform operated by Segatt Labs ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. Description of Service</h2>
            <p>Dashboard is a financial management platform that provides tools for invoicing, transaction tracking, bank account aggregation, analytics, and reporting. The Service connects to third-party Open Banking providers (TrueLayer, Salt Edge) to retrieve account data on your behalf.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Account Registration</h2>
            <p>You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials. You must notify us immediately of any unauthorised use of your account.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Subscription and Billing</h2>
            <p>Paid plans are billed in advance on a monthly or annual basis. All fees are non-refundable except where required by law. We reserve the right to change pricing with 30 days notice. Failure to pay may result in suspension of your account.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Open Banking Data</h2>
            <p>When you connect a bank account, you authorise us to retrieve read-only account information via regulated Open Banking APIs. We do not initiate payments or have write access to your accounts. Bank credentials are never stored by us.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Acceptable Use</h2>
            <p>You agree not to use the Service for any unlawful purpose, to attempt to gain unauthorised access to any system, to transmit malicious code, or to violate any applicable law or regulation.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Intellectual Property</h2>
            <p>All content, features, and functionality of the Service are owned by Segatt Labs and are protected by applicable intellectual property laws. You may not copy, modify, or distribute any part of the Service without our prior written consent.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Segatt Labs shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">9. Termination</h2>
            <p>We may suspend or terminate your account at any time for violation of these Terms. You may delete your account at any time via Settings. Upon termination, your data will be deleted in accordance with our Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">10. Governing Law</h2>
            <p>These Terms are governed by the laws of Portugal. Any disputes shall be resolved in the courts of Lisbon, Portugal.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">11. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:legal@segattlabs.com" className="text-primary hover:underline">legal@segattlabs.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
