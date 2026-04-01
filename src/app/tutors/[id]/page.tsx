"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { tutorApi, bookingApi, reviewApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { TutorProfile, Review } from "@/types";
import toast from "react-hot-toast";
import {
  FiStar,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiMail,
  FiPhone,
  FiUser,
  FiChevronLeft,
} from "react-icons/fi";
import Link from "next/link";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function TutorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchTutor();
      fetchReviews();
    }
  }, [params.id]);

  const fetchTutor = async () => {
    try {
      const response = await tutorApi.getById(params.id as string);
      setTutor(response.data);
    } catch (error) {
      console.error("Failed to fetch tutor:", error);
      toast.error("Failed to load tutor details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewApi.getTutorReviews(params.id as string, {
        limit: 10,
      });
      setReviews(response.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-48 mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="card p-6">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-secondary-200 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="h-8 bg-secondary-200 rounded w-1/2" />
                    <div className="h-4 bg-secondary-200 rounded w-1/3" />
                    <div className="h-4 bg-secondary-200 rounded w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-2xl font-bold text-secondary-900 mb-4">
          Tutor Not Found
        </h1>
        <Link href="/tutors" className="text-primary-600 hover:underline">
          Browse all tutors
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="container-custom py-8">
        {/* Back Button */}
        <Link
          href="/tutors"
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-6"
        >
          <FiChevronLeft /> Back to Tutors
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 overflow-hidden mx-auto sm:mx-0">
                  {tutor.user.image ? (
                    <img
                      src={tutor.user.image}
                      alt={tutor.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-primary-600">
                      {tutor.user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h1 className="text-2xl font-bold text-secondary-900">
                      {tutor.user.name}
                    </h1>
                    {tutor.isAvailable && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Available
                      </span>
                    )}
                  </div>

                  {/* Categories */}
                  {tutor.categories && tutor.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                      {tutor.categories.map((c) => (
                        <span
                          key={c.id}
                          className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                        >
                          {c.category.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-6 mt-4 text-secondary-600 justify-center sm:justify-start">
                    <div className="flex items-center gap-1">
                      <FiStar className="text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">
                        {tutor.rating.toFixed(1)}
                      </span>
                      <span className="text-sm">
                        ({tutor.totalReviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock />
                      <span>{tutor.experience} years</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {tutor.bio && (
                    <p className="mt-4 text-secondary-600">{tutor.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Availability */}
            {tutor.availabilities && tutor.availabilities.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                  Availability
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {tutor.availabilities.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg"
                    >
                      <FiCalendar className="text-primary-600" />
                      <span className="font-medium">
                        {DAYS[slot.dayOfWeek]}
                      </span>
                      <span className="text-secondary-600">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                Reviews ({tutor.totalReviews})
              </h2>

              {reviews.length === 0 ? (
                <p className="text-secondary-600">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-secondary-100 pb-4 last:border-0"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          {review.student?.image ? (
                            <img
                              src={review.student.image}
                              alt={review.student.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <FiUser className="text-primary-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {review.student?.name}
                            </span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-secondary-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-secondary-600">
                              {review.comment}
                            </p>
                          )}
                          <span className="text-secondary-400 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="md:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600">
                  ${tutor.hourlyRate}
                  <span className="text-lg font-normal text-secondary-600">
                    /hour
                  </span>
                </div>
              </div>

              {session?.user ? (
                <button
                  onClick={() => setShowBookingModal(true)}
                  disabled={!tutor.isAvailable}
                  className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tutor.isAvailable ? "Book a Session" : "Not Available"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="btn-primary w-full py-3 block text-center"
                >
                  Login to Book
                </Link>
              )}

              <div className="mt-6 space-y-3 text-secondary-600">
                <div className="flex items-center gap-3">
                  <FiMail className="text-primary-600" />
                  <span className="text-sm">{tutor.user.email}</span>
                </div>
                {tutor.experience > 0 && (
                  <div className="flex items-center gap-3">
                    <FiClock className="text-primary-600" />
                    <span className="text-sm">
                      {tutor.experience} years of experience
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          tutor={tutor}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            toast.success("Booking created successfully!");
            router.push("/dashboard/bookings");
          }}
        />
      )}
    </div>
  );
}

function BookingModal({
  tutor,
  onClose,
  onSuccess,
}: {
  tutor: TutorProfile;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error("Please select date and time");
      return;
    }

    setIsLoading(true);
    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString();
      await bookingApi.create({
        tutorProfileId: tutor.id,
        scheduledAt,
        duration: Number(duration),
        notes: notes || undefined,
      });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">
          Book a Session with {tutor.user.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="input-field w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-field w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input-field w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
            >
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
              rows={3}
              placeholder="What would you like to learn?"
            />
          </div>

          <div className="bg-secondary-50 p-4 rounded-lg">
            <div className="flex justify-between text-secondary-600">
              <span>Duration:</span>
              <span>{duration} minutes</span>
            </div>
            <div className="flex justify-between font-semibold text-secondary-900 mt-2">
              <span>Total:</span>
              <span>
                ${(tutor.hourlyRate * (Number(duration) / 60)).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-secondary-100 text-secondary-700 hover:bg-secondary-200 flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
