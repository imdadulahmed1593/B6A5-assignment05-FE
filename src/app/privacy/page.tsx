export default function PrivacyPage() {
  return (
    <div className="bg-secondary-50 dark:bg-secondary-950 min-h-screen">
      <section className="container-custom py-14">
        <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          Privacy Policy
        </h1>
        <div className="card p-8 space-y-6 text-secondary-700 dark:text-secondary-300 leading-7">
          <p>
            We collect account, booking, and payment metadata required to
            operate Learnzy safely. We do not sell personal data. Payment card
            processing is handled by Stripe.
          </p>
          <p>
            Information such as names, profile photos, reviews, and tutoring
            categories is visible to users as part of the platform experience.
            Sensitive account data is protected by role-based access controls.
          </p>
          <p>
            You can request profile updates or account deletion by contacting
            support. Transaction records are retained where required for
            financial compliance and fraud prevention.
          </p>
          <p>
            If policy updates are made, the effective date and summary of
            changes will be posted on this page.
          </p>
        </div>
      </section>
    </div>
  );
}
