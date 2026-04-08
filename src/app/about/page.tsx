export default function AboutPage() {
  return (
    <div className="bg-secondary-50 dark:bg-secondary-950 min-h-screen">
      <section className="container-custom py-14">
        <p className="text-sm uppercase tracking-[0.18em] text-primary-600 mb-3">
          About Learnzy
        </p>
        <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          Learning That Fits Real Life
        </h1>
        <p className="max-w-3xl text-secondary-600 dark:text-secondary-300 leading-7">
          Learnzy helps students connect with verified tutors for focused
          one-on-one sessions. We built the platform for learners who need
          practical progress, flexible schedules, and clear outcomes across
          school subjects, programming, and professional skills.
        </p>
      </section>

      <section className="container-custom pb-14 grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p className="text-secondary-600 dark:text-secondary-300">
            Make high-quality mentorship accessible through transparent tutor
            profiles, real student reviews, and reliable booking workflows.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-2">How We Verify</h2>
          <p className="text-secondary-600 dark:text-secondary-300">
            Tutor accounts are reviewed before activation, and ratings are based
            on completed sessions only so learners can trust what they see.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-2">What We Value</h2>
          <p className="text-secondary-600 dark:text-secondary-300">
            Clarity, consistency, and student-first support. Every product
            decision is measured by learning outcomes and learner confidence.
          </p>
        </div>
      </section>
    </div>
  );
}
