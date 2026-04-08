export default function TermsPage() {
  return (
    <div className="bg-secondary-50 dark:bg-secondary-950 min-h-screen">
      <section className="container-custom py-14">
        <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          Terms of Service
        </h1>
        <div className="card p-8 space-y-6 text-secondary-700 dark:text-secondary-300 leading-7">
          <p>
            Learnzy provides a marketplace for students and tutors to schedule
            and complete educational sessions. Users are responsible for
            truthful profile information and respectful communication.
          </p>
          <p>
            Booking fees and cancellations are governed by tutor availability
            and platform payment rules. Fraudulent activity, harassment, or
            repeated abuse can result in account suspension.
          </p>
          <p>
            Tutors are responsible for the quality and timeliness of sessions
            they offer. Students are responsible for attending sessions or
            canceling on time through their dashboard.
          </p>
          <p>
            By using Learnzy, you agree to these terms and any updates published
            on this page.
          </p>
        </div>
      </section>
    </div>
  );
}
