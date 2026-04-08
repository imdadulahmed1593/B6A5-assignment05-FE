import Link from "next/link";

const faqs = [
  {
    q: "How do I book a tutor session?",
    a: "Open a tutor profile, choose a suitable time slot, confirm the booking, and complete checkout from your dashboard.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes. You can cancel upcoming sessions from My Bookings. Refund handling follows the tutor cancellation policy.",
  },
  {
    q: "How are ratings calculated?",
    a: "Only students with completed sessions can submit reviews, and ratings are aggregated automatically on tutor profiles.",
  },
  {
    q: "How do I become a tutor?",
    a: "Create an account, complete your tutor profile with bio, categories, rates, and availability, then submit for review.",
  },
];

export default function HelpPage() {
  return (
    <div className="bg-secondary-50 dark:bg-secondary-950 min-h-screen">
      <section className="container-custom py-14">
        <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          Help Center
        </h1>
        <p className="max-w-2xl text-secondary-600 dark:text-secondary-300 mb-10">
          Find quick answers about bookings, profiles, reviews, and payments. If
          your issue is not listed, contact support.
        </p>

        <div className="space-y-4">
          {faqs.map((item) => (
            <article key={item.q} className="card p-6">
              <h2 className="font-semibold text-lg text-secondary-900 dark:text-secondary-100 mb-2">
                {item.q}
              </h2>
              <p className="text-secondary-600 dark:text-secondary-300">
                {item.a}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 card p-6">
          <h2 className="text-xl font-semibold mb-3">
            Need direct assistance?
          </h2>
          <p className="text-secondary-600 dark:text-secondary-300 mb-4">
            Our support specialists can help with account access, payment
            verification, and booking disputes.
          </p>
          <Link href="/contact" className="btn-primary inline-flex">
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}
