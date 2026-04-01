"use client";

import { useEffect, useState } from "react";
import { categoryApi, tutorApi } from "@/lib/api";
import { Category, TutorProfile } from "@/types";
import Link from "next/link";
import { FiGrid, FiUsers, FiArrowRight } from "react-icons/fi";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesResponse, tutorsResponse] = await Promise.all([
        categoryApi.getAll(),
        tutorApi.search({ limit: 100 }),
      ]);

      setCategories(categoriesResponse.data || []);

      // Count tutors per category
      const counts: Record<string, number> = {};
      const tutors = tutorsResponse.data || [];
      tutors.forEach((tutor: TutorProfile) => {
        tutor.categories?.forEach((c) => {
          counts[c.categoryId] = (counts[c.categoryId] || 0) + 1;
        });
      });
      setCategoryCounts(counts);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gradient colors for category cards
  const gradients = [
    "from-primary-500 to-primary-700",
    "from-blue-500 to-blue-700",
    "from-green-500 to-green-700",
    "from-purple-500 to-purple-700",
    "from-orange-500 to-orange-700",
    "from-pink-500 to-pink-700",
    "from-cyan-500 to-cyan-700",
    "from-indigo-500 to-indigo-700",
  ];

  if (isLoading) {
    return (
      <div className="bg-secondary-50 min-h-screen">
        <div className="container-custom py-12">
          <div className="animate-pulse">
            <div className="h-10 bg-secondary-200 rounded w-64 mx-auto mb-4" />
            <div className="h-6 bg-secondary-200 rounded w-96 mx-auto mb-12" />
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-48 bg-secondary-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Categories
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Find expert tutors in a variety of subjects. Choose a category to
            get started.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container-custom py-12">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <FiGrid className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              No categories available
            </h2>
            <p className="text-secondary-600">
              Check back soon for new subjects!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/tutors?category=${category.id}`}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-90`}
                />

                {/* Content */}
                <div className="relative p-6 text-white min-h-[180px] flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                      <FiGrid className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    {category.description && (
                      <p className="text-white/80 text-sm line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <FiUsers className="w-4 h-4" />
                      <span className="text-sm">
                        {categoryCounts[category.id] || 0} tutors
                      </span>
                    </div>
                    <FiArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="card p-8 md:p-12 bg-gradient-to-r from-secondary-900 to-secondary-800 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-secondary-300 mb-6 max-w-2xl mx-auto">
              Browse all our tutors and use search filters to find the perfect
              match for your learning needs.
            </p>
            <Link
              href="/tutors"
              className="btn bg-white text-secondary-900 hover:bg-secondary-100"
            >
              Browse All Tutors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
