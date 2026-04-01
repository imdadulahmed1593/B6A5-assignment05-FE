"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { tutorApi, categoryApi } from "@/lib/api";
import { TutorProfile, Category } from "@/types";
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiMapPin,
  FiDollarSign,
} from "react-icons/fi";

export default function TutorsPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "";

  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);

  // Update selectedCategory when URL changes
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTutors();
  }, [page, selectedCategory, minRating, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchTutors = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, any> = {
        page,
        limit: 12,
        sortBy,
        sortOrder: "desc",
      };
      if (search) params.search = search;
      if (selectedCategory) params.categoryId = selectedCategory;
      if (minRating) params.minRating = Number(minRating);

      const response = await tutorApi.search(params);
      setTutors(response.data || []);
      setMeta(response.meta);
    } catch (error) {
      console.error("Failed to fetch tutors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTutors();
  };

  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            Find Your Perfect Tutor
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1 flex items-center">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or subject..."
                className="input-field pl-12 w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
              />
            </div>
            <button type="submit" className="btn-primary px-8">
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn bg-secondary-100 text-secondary-700 hover:bg-secondary-200 px-4 md:hidden"
            >
              <FiFilter />
            </button>
          </form>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`w-64 flex-shrink-0 ${showFilters ? "block" : "hidden md:block"}`}
          >
            <div className="card p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="input-field w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => {
                    setMinRating(e.target.value);
                    setPage(1);
                  }}
                  className="input-field w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="input-field w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price">Price</option>
                  <option value="experience">Experience</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory("");
                  setMinRating("");
                  setSortBy("rating");
                  setSearch("");
                  setPage(1);
                }}
                className="text-primary-600 hover:underline text-sm"
              >
                Clear all filters
              </button>
            </div>
          </aside>

          {/* Tutors Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="w-20 h-20 bg-secondary-200 rounded-full mx-auto mb-4" />
                    <div className="h-6 bg-secondary-200 rounded w-3/4 mx-auto mb-2" />
                    <div className="h-4 bg-secondary-200 rounded w-1/2 mx-auto" />
                  </div>
                ))}
              </div>
            ) : tutors.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-secondary-600 text-lg">
                  No tutors found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setMinRating("");
                    setSearch("");
                  }}
                  className="text-primary-600 hover:underline mt-2"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-secondary-600">
                  {meta?.total} tutor{meta?.total !== 1 ? "s" : ""} found
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tutors.map((tutor) => (
                    <TutorCard key={tutor.id} tutor={tutor} />
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="btn bg-white border border-secondary-200 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="flex items-center px-4 text-secondary-600">
                      Page {page} of {meta.totalPages}
                    </span>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === meta.totalPages}
                      className="btn bg-white border border-secondary-200 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function TutorCard({ tutor }: { tutor: TutorProfile }) {
  return (
    <Link href={`/tutors/${tutor.id}`}>
      <div className="card p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-4 overflow-hidden">
            {tutor.user.image ? (
              <img
                src={tutor.user.image}
                alt={tutor.user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-primary-600">
                {tutor.user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-lg text-secondary-900">
            {tutor.user.name}
          </h3>

          {/* Categories */}
          {tutor.categories && tutor.categories.length > 0 && (
            <p className="text-secondary-600 text-sm mt-1">
              {tutor.categories.map((c) => c.category.name).join(", ")}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mt-3">
            <FiStar className="text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{tutor.rating.toFixed(1)}</span>
            <span className="text-secondary-500 text-sm">
              ({tutor.totalReviews} reviews)
            </span>
          </div>

          {/* Experience & Price */}
          <div className="flex items-center gap-4 mt-3 text-sm text-secondary-600">
            <span>{tutor.experience} years exp.</span>
            <span className="text-primary-600 font-semibold">
              ${tutor.hourlyRate}/hr
            </span>
          </div>

          {/* Availability Badge */}
          <div
            className={`mt-4 px-3 py-1 rounded-full text-xs font-medium ${
              tutor.isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-secondary-100 text-secondary-600"
            }`}
          >
            {tutor.isAvailable ? "Available" : "Not Available"}
          </div>
        </div>
      </div>
    </Link>
  );
}
