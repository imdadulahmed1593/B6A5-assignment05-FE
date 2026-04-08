import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Category {
  id: string;
  name: string;
  icon: string | null;
}

interface Tutor {
  id: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  experience: number;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  categories: {
    category: {
      id: string;
      name: string;
    };
  }[];
}

interface TutorsResponse {
  data?: Tutor[];
  meta?: {
    total?: number;
  };
}

interface CategoriesResponse {
  data?: Category[];
}

const faqItems = [
  {
    question: "How quickly can I start a tutoring session?",
    answer:
      "Most students can book a verified tutor slot within 24 hours, depending on subject and timezone.",
  },
  {
    question: "Can I choose tutors by budget and rating?",
    answer:
      "Yes. Tutor discovery supports filtering by categories, minimum rating, and price-based sorting.",
  },
  {
    question: "Do reviews come from real students?",
    answer:
      "Yes. Reviews are linked to completed bookings only, which keeps feedback trustworthy.",
  },
  {
    question: "Is Learnzy suitable for exam and career prep?",
    answer:
      "Yes. Learners use Learnzy for academic exams, programming interviews, language practice, and skill development.",
  },
];

const blogHighlights = [
  {
    title: "How to Prepare for Your First 1:1 Session",
    summary:
      "A practical checklist for goals, materials, and communication before your first lesson.",
  },
  {
    title: "Weekly Study Systems That Actually Work",
    summary:
      "Build momentum with lightweight study loops and measurable progress milestones.",
  },
  {
    title: "Choosing a Tutor by Learning Style",
    summary:
      "Match teaching style, pace, and session format to improve retention and confidence.",
  },
];

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as CategoriesResponse;
    return data.data || [];
  } catch {
    return [];
  }
}

async function getFeaturedTutors(): Promise<Tutor[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/tutors?sortBy=rating&sortOrder=desc&limit=4&isAvailable=true`,
      {
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as TutorsResponse;
    return data.data || [];
  } catch {
    return [];
  }
}

async function getPlatformStats() {
  try {
    const [tutorsRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/api/tutors?limit=1`, { next: { revalidate: 1800 } }),
      fetch(`${API_URL}/api/categories`, { next: { revalidate: 1800 } }),
    ]);

    if (!tutorsRes.ok || !categoriesRes.ok) {
      return { totalTutors: 0, totalCategories: 0 };
    }

    const tutorsJson = (await tutorsRes.json()) as TutorsResponse;
    const categoriesJson = (await categoriesRes.json()) as CategoriesResponse;

    return {
      totalTutors: tutorsJson.meta?.total || 0,
      totalCategories: categoriesJson.data?.length || 0,
    };
  } catch {
    return { totalTutors: 0, totalCategories: 0 };
  }
}

export default async function Home() {
  const [categories, featuredTutors, stats] = await Promise.all([
    getCategories(),
    getFeaturedTutors(),
    getPlatformStats(),
  ]);

  return (
    <div className="bg-secondary-50 dark:bg-secondary-950">
      <section className="relative isolate overflow-hidden bg-secondary-950 text-white min-h-[65vh] flex items-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -right-16 h-80 w-80 rounded-full bg-primary-500/25 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        </div>
        <div className="container-custom py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary-200 mb-4">
                Smart Tutoring Marketplace
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Learn With Verified Experts and Build Lasting Skills
              </h1>
              <p className="mt-6 text-lg text-secondary-200 max-w-2xl">
                Discover top tutors, book sessions around your schedule, and
                track progress with reliable reviews and role-based dashboards.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/tutors"
                  className="btn bg-primary-500 text-white hover:bg-primary-600"
                >
                  Explore Tutors
                </Link>
                <Link
                  href="/register"
                  className="btn border border-white/40 bg-white/10 text-white hover:bg-white/20"
                >
                  Create Account
                </Link>
              </div>
            </div>
            <div className="card bg-white/10 border-white/20 p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-5">
                Live Platform Snapshot
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-2xl font-bold">{stats.totalTutors}</p>
                  <p className="text-sm text-secondary-200">Active Tutors</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-2xl font-bold">{stats.totalCategories}</p>
                  <p className="text-sm text-secondary-200">
                    Learning Categories
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm text-secondary-200">Booking Access</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-2xl font-bold">Secure</p>
                  <p className="text-sm text-secondary-200">Stripe Payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom py-16">
        <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 text-center mb-10">
          Why Learners Choose Learnzy
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <article className="card p-6">
            <h3 className="text-xl font-semibold mb-2">Verified Tutors</h3>
            <p className="text-secondary-600 dark:text-secondary-300">
              Profile quality, ratings, and completed session history make tutor
              selection more transparent.
            </p>
          </article>
          <article className="card p-6">
            <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
            <p className="text-secondary-600 dark:text-secondary-300">
              Tutors set weekly availability so students can book sessions
              aligned with their daily routines.
            </p>
          </article>
          <article className="card p-6">
            <h3 className="text-xl font-semibold mb-2">Trusted Reviews</h3>
            <p className="text-secondary-600 dark:text-secondary-300">
              Ratings are generated from completed bookings, giving students
              dependable social proof.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-white dark:bg-secondary-900 py-16 border-y border-secondary-200 dark:border-secondary-800">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 text-center mb-10">
            Services for Students and Tutors
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              "One-on-one live sessions",
              "Category-based tutor discovery",
              "Secure checkout and payment confirmation",
              "Progress tracking from role dashboards",
            ].map((service) => (
              <div key={service} className="card p-5">
                <p className="text-secondary-700 dark:text-secondary-300">
                  {service}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-custom py-16">
        <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 text-center mb-10">
          Explore Categories
        </h2>
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/tutors?category=${category.id}`}
                className="card p-5 text-center hover:border-primary-400"
              >
                <span className="text-2xl block mb-2">
                  {category.icon || "📘"}
                </span>
                <span className="text-secondary-800 dark:text-secondary-200">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-secondary-600 dark:text-secondary-300">
              Categories are currently unavailable. Please check again shortly.
            </p>
          </div>
        )}
      </section>

      <section className="bg-secondary-900 text-white py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-4">
            Featured Tutors
          </h2>
          <p className="text-secondary-300 text-center mb-10">
            Browse currently available, highly rated tutors
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredTutors.map((tutor) => (
              <Link
                key={tutor.id}
                href={`/tutors/${tutor.id}`}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 hover:bg-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary-300/30 flex items-center justify-center overflow-hidden">
                    {tutor.user.image ? (
                      <img
                        src={tutor.user.image}
                        alt={tutor.user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-primary-100">
                        {tutor.user.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{tutor.user.name}</p>
                    <p className="text-xs text-secondary-300">
                      {tutor.experience} years experience
                    </p>
                  </div>
                </div>
                <p className="text-sm text-secondary-300 line-clamp-2 mb-3">
                  {tutor.bio}
                </p>
                <p className="text-sm text-secondary-200 mb-2">
                  Rating: {tutor.rating.toFixed(1)} ({tutor.totalReviews})
                </p>
                <p className="font-semibold text-primary-200">
                  ${tutor.hourlyRate}/hour
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/tutors"
              className="btn bg-primary-500 text-white hover:bg-primary-600"
            >
              View All Tutors
            </Link>
          </div>
        </div>
      </section>

      <section className="container-custom py-16">
        <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 text-center mb-10">
          Platform Highlights
        </h2>
        <div className="grid md:grid-cols-4 gap-5">
          <div className="card p-6 text-center">
            <p className="text-3xl font-bold text-primary-600">Role-Based</p>
            <p className="text-secondary-600 dark:text-secondary-300 mt-2">
              Dedicated dashboards for student, tutor, and admin.
            </p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-3xl font-bold text-primary-600">Filters</p>
            <p className="text-secondary-600 dark:text-secondary-300 mt-2">
              Explore tutors by rating, category, and pricing priorities.
            </p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-3xl font-bold text-primary-600">Reviews</p>
            <p className="text-secondary-600 dark:text-secondary-300 mt-2">
              Verified post-session feedback creates reliable trust signals.
            </p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-3xl font-bold text-primary-600">Payments</p>
            <p className="text-secondary-600 dark:text-secondary-300 mt-2">
              Stripe-backed checkout with booking status synchronization.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-secondary-900 py-16 border-y border-secondary-200 dark:border-secondary-800">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 text-center mb-10">
            Student Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <blockquote className="card p-6">
              <p className="text-secondary-700 dark:text-secondary-300">
                "I improved my calculus grades in six weeks by booking focused
                sessions twice a week."
              </p>
              <footer className="text-sm text-secondary-500 mt-4">
                Rafi, Undergraduate Student
              </footer>
            </blockquote>
            <blockquote className="card p-6">
              <p className="text-secondary-700 dark:text-secondary-300">
                "The scheduling flow made it easy to learn after work hours. My
                tutor helped me ship a portfolio project."
              </p>
              <footer className="text-sm text-secondary-500 mt-4">
                Maya, Career Switcher
              </footer>
            </blockquote>
            <blockquote className="card p-6">
              <p className="text-secondary-700 dark:text-secondary-300">
                "Verified reviews gave me confidence to choose the right
                language tutor from day one."
              </p>
              <footer className="text-sm text-secondary-500 mt-4">
                Hasib, IELTS Candidate
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="container-custom py-16">
        <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 text-center mb-10">
          Learning Insights and Guides
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {blogHighlights.map((post) => (
            <article key={post.title} className="card p-6">
              <h3 className="font-semibold text-xl text-secondary-900 dark:text-secondary-100 mb-3">
                {post.title}
              </h3>
              <p className="text-secondary-600 dark:text-secondary-300">
                {post.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary-100 dark:bg-secondary-900/60 py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqItems.map((item) => (
              <article key={item.question} className="card p-6">
                <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                  {item.question}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-300">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-custom py-16">
        <div className="card p-8 md:p-10 bg-gradient-to-r from-primary-700 to-primary-500 text-white border-none">
          <h2 className="text-3xl font-bold mb-3">
            Get Weekly Study Tips and Platform Updates
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl">
            Receive practical learning strategies, tutor selection guidance, and
            feature updates by joining our newsletter list.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="btn bg-white text-primary-700 hover:bg-primary-50 text-center"
            >
              Contact to Subscribe
            </Link>
            <Link
              href="/help"
              className="btn border border-white/70 text-white hover:bg-white/10 text-center"
            >
              Read Help Center
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary-950 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Next Learning Goal?
          </h2>
          <p className="text-secondary-300 mb-8 max-w-2xl mx-auto">
            Join Learnzy today to connect with experienced tutors, schedule
            sessions quickly, and learn with confidence.
          </p>
          <Link
            href="/register"
            className="btn bg-primary-500 text-white hover:bg-primary-600"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
