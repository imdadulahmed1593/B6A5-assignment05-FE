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

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getFeaturedTutors(): Promise<Tutor[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/tutors?sortBy=rating&sortOrder=desc&limit=3&isAvailable=true`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [categories, featuredTutors] = await Promise.all([
    getCategories(),
    getFeaturedTutors(),
  ]);

  return (
    <div className="bg-gradient-to-b from-cyan-50 via-white to-slate-50">
      {/* Announcement Banner + Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-28 -right-12 h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="absolute top-36 -left-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_40%)]" />
        </div>

        <div className="relative container-custom py-6 md:py-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/35 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 backdrop-blur-sm">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />
            New on Learnzy: Guided learning tracks and smarter tutor matching.
          </div>
        </div>

        <div className="relative container-custom pb-20 pt-8 md:pb-24 md:pt-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm uppercase tracking-[0.22em] text-cyan-200">
                Learn Faster, With Clarity
              </p>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Build Real Skills
                <span className="text-cyan-300"> With Expert Mentors</span>
              </h1>
              <p className="mt-6 text-lg text-slate-200 md:text-xl">
                Find the right tutor, book in minutes, and make steady progress
                with focused 1:1 sessions.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/tutors"
                  className="btn rounded-xl bg-cyan-400 px-8 py-3 text-center text-base font-semibold text-slate-950 hover:bg-cyan-300"
                >
                  Explore Tutors
                </Link>
                <Link
                  href="/register"
                  className="btn rounded-xl border border-white/35 bg-white/10 px-8 py-3 text-center text-base font-semibold text-white hover:bg-white/20"
                >
                  Join Learnzy
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 shadow-2xl shadow-cyan-900/20 backdrop-blur-md">
              <p className="mb-6 text-sm uppercase tracking-[0.18em] text-cyan-200">
                Platform Highlights
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-3xl font-bold text-cyan-300">1:1</p>
                  <p className="mt-1 text-sm text-slate-200">
                    Personal sessions
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-3xl font-bold text-emerald-300">24/7</p>
                  <p className="mt-1 text-sm text-slate-200">
                    Flexible booking
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-3xl font-bold text-amber-300">Top</p>
                  <p className="mt-1 text-sm text-slate-200">Rated tutors</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-3xl font-bold text-fuchsia-200">Safe</p>
                  <p className="mt-1 text-sm text-slate-200">Secure payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="container-custom">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900 md:text-4xl">
            Why Choose Learnzy?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-cyan-100 bg-white p-6 text-center shadow-lg shadow-cyan-100/50">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Expert Tutors
              </h3>
              <p className="text-slate-600">
                Learn from verified experts with proven experience in their
                fields.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 text-center shadow-lg shadow-emerald-100/50">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Flexible Scheduling
              </h3>
              <p className="text-slate-600">
                Book sessions that fit your schedule. Learn at your own pace.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-lg shadow-amber-100/50">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Verified Reviews
              </h3>
              <p className="text-slate-600">
                Read authentic reviews from real students before booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900 md:text-4xl">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.length > 0
              ? categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/tutors?category=${category.id}`}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-400 hover:shadow-lg"
                  >
                    <span className="text-2xl block mb-2">
                      {category.icon || "📚"}
                    </span>
                    <span className="text-lg text-slate-800">
                      {category.name}
                    </span>
                  </Link>
                ))
              : // Fallback if API fails
                [
                  "📐 Mathematics",
                  "💻 Programming",
                  "🌍 Languages",
                  "🔬 Science",
                  "🎵 Music",
                  "📈 Business",
                ].map((cat) => (
                  <Link
                    key={cat}
                    href="/tutors"
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-400 hover:shadow-lg"
                  >
                    <span className="text-lg text-slate-800">{cat}</span>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      {featuredTutors.length > 0 && (
        <section className="bg-slate-950 py-20 text-white">
          <div className="container-custom">
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Featured Tutors
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-slate-300">
              Learn from our top-rated tutors with proven track records
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredTutors.map((tutor) => (
                <Link
                  key={tutor.id}
                  href={`/tutors/${tutor.id}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/10"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-cyan-200/20">
                      {tutor.user.image ? (
                        <img
                          src={tutor.user.image}
                          alt={tutor.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-cyan-300">
                          {tutor.user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {tutor.user.name}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <span>⭐</span>
                        <span className="font-medium">
                          {tutor.rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-slate-300">
                          ({tutor.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mb-4 line-clamp-2 text-sm text-slate-300">
                    {tutor.bio || "Experienced tutor ready to help you learn."}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutor.categories.slice(0, 3).map((c) => (
                      <span
                        key={c.category.id}
                        className="rounded-full bg-cyan-300/20 px-2 py-1 text-xs text-cyan-200"
                      >
                        {c.category.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-sm text-slate-300">
                      {tutor.experience} years exp.
                    </span>
                    <span className="font-semibold text-cyan-300">
                      ${tutor.hourlyRate}/hr
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/tutors"
                className="btn rounded-xl bg-cyan-400 px-8 py-3 text-lg font-semibold text-slate-950 hover:bg-cyan-300"
              >
                View All Tutors
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-500 py-20 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-cyan-50">
            Join thousands of students who are already learning with Learnzy.
          </p>
          <Link
            href="/register"
            className="btn rounded-xl bg-slate-950 px-8 py-3 text-lg text-white hover:bg-slate-900"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
