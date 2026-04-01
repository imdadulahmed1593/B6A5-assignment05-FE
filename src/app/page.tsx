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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect with Expert Tutors, Learn Anything
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Find the perfect tutor for any subject. Book sessions instantly
              and start learning today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/tutors"
                className="btn-primary text-center text-lg px-8 py-3"
              >
                Find a Tutor
              </Link>
              <Link
                href="/register"
                className="btn bg-white text-primary-600 hover:bg-primary-50 text-center text-lg px-8 py-3"
              >
                Become a Tutor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose SkillBridge?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Expert Tutors</h3>
              <p className="text-secondary-600">
                Learn from verified experts with proven experience in their
                fields.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">
                Flexible Scheduling
              </h3>
              <p className="text-secondary-600">
                Book sessions that fit your schedule. Learn at your own pace.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Verified Reviews</h3>
              <p className="text-secondary-600">
                Read authentic reviews from real students before booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.length > 0
              ? categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/tutors?category=${category.id}`}
                    className="card p-4 text-center hover:border-primary-500 border-2 border-transparent transition-all"
                  >
                    <span className="text-2xl block mb-2">
                      {category.icon || "📚"}
                    </span>
                    <span className="text-lg">{category.name}</span>
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
                    className="card p-4 text-center hover:border-primary-500 border-2 border-transparent transition-all"
                  >
                    <span className="text-lg">{cat}</span>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      {featuredTutors.length > 0 && (
        <section className="py-20 bg-secondary-50">
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Featured Tutors
            </h2>
            <p className="text-secondary-600 text-center mb-12 max-w-2xl mx-auto">
              Learn from our top-rated tutors with proven track records
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredTutors.map((tutor) => (
                <Link
                  key={tutor.id}
                  href={`/tutors/${tutor.id}`}
                  className="card p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                      {tutor.user.image ? (
                        <img
                          src={tutor.user.image}
                          alt={tutor.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-primary-600">
                          {tutor.user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {tutor.user.name}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <span>⭐</span>
                        <span className="font-medium">
                          {tutor.rating.toFixed(1)}
                        </span>
                        <span className="text-secondary-500 text-sm">
                          ({tutor.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
                    {tutor.bio || "Experienced tutor ready to help you learn."}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutor.categories.slice(0, 3).map((c) => (
                      <span
                        key={c.category.id}
                        className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                      >
                        {c.category.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                    <span className="text-secondary-600 text-sm">
                      {tutor.experience} years exp.
                    </span>
                    <span className="text-primary-600 font-semibold">
                      ${tutor.hourlyRate}/hr
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/tutors" className="btn-primary text-lg px-8 py-3">
                View All Tutors
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already learning with
            SkillBridge.
          </p>
          <Link
            href="/register"
            className="btn bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-3"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
