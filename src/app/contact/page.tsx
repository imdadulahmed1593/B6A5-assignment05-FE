export default function ContactPage() {
  return (
    <div className="bg-secondary-50 dark:bg-secondary-950 min-h-screen">
      <section className="container-custom py-14">
        <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
          Contact Learnzy Support
        </h1>
        <p className="max-w-3xl text-secondary-600 dark:text-secondary-300 leading-7 mb-8">
          Our team responds to product, billing, and account support requests
          within one business day. For urgent booking issues, include your
          booking ID in the message.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Support Channels</h2>
            <ul className="space-y-3 text-secondary-700 dark:text-secondary-300">
              <li>Email: support@learnzy.app</li>
              <li>Billing: billing@learnzy.app</li>
              <li>Phone: +1 (415) 555-0183</li>
              <li>Office Hours: Mon-Fri, 9:00-18:00 UTC</li>
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Head Office</h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-7">
              Learnzy Learning Services Ltd.
              <br />
              221 Harbor Street
              <br />
              San Francisco, CA 94105
              <br />
              United States
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
