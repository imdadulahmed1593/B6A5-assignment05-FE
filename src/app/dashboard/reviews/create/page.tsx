"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { bookingApi, reviewApi } from "@/lib/api";
import toast from "react-hot-toast";
import { FiStar, FiChevronLeft } from "react-icons/fi";
import Link from "next/link";
import { Booking } from "@/types";

export default function CreateReviewPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (bookingId && session?.user) {
      fetchBooking();
    }
  }, [bookingId, session]);

  const fetchBooking = async () => {
    try {
      // Fetch user's bookings and find the specific one
      const response = await bookingApi.getMyBookings({ limit: 100 });
      const foundBooking = response.data?.find(
        (b: Booking) => b.id === bookingId,
      );

      if (!foundBooking) {
        toast.error("Booking not found");
        router.push("/dashboard/bookings");
        return;
      }

      if (foundBooking.status !== "COMPLETED") {
        toast.error("You can only review completed sessions");
        router.push("/dashboard/bookings");
        return;
      }

      if (foundBooking.review) {
        toast.error("You have already reviewed this session");
        router.push("/dashboard/bookings");
        return;
      }

      setBooking(foundBooking);
    } catch (error) {
      console.error("Failed to fetch booking:", error);
      toast.error("Failed to load booking details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    setIsSubmitting(true);
    try {
      await reviewApi.create({
        bookingId: booking.id,
        rating,
        comment: comment || undefined,
      });
      toast.success("Review submitted successfully!");
      router.push("/dashboard/bookings?tab=past");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-secondary-200 rounded w-48 mb-8" />
            <div className="card p-6 space-y-4">
              <div className="h-20 bg-secondary-200 rounded" />
              <div className="h-40 bg-secondary-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user || !booking) return null;

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard/bookings?tab=past"
              className="text-secondary-600 hover:text-primary-600"
            >
              <FiChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                Leave a Review
              </h1>
              <p className="text-secondary-600">Share your experience</p>
            </div>
          </div>

          {/* Review Form */}
          <div className="card p-6">
            {/* Tutor Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-secondary-100 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                {booking.tutorProfile?.user?.image ? (
                  <img
                    src={booking.tutorProfile.user.image}
                    alt={booking.tutorProfile.user.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary-600">
                    {booking.tutor?.user?.name?.charAt(0) || "T"}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-secondary-900">
                  Session with {booking.tutorProfile?.user?.name}
                </p>
                <p className="text-secondary-600 text-sm">
                  {new Date(booking.scheduledAt).toLocaleDateString()} -{" "}
                  {booking.duration} mins
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-3">
                  How would you rate this session?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                    >
                      <FiStar
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-secondary-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-secondary-600 mt-2">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Your Review (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input-field w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
                  rows={5}
                  placeholder="Share your experience with this tutor..."
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3">
                <Link
                  href="/dashboard/bookings?tab=past"
                  className="btn bg-secondary-100 text-secondary-700 hover:bg-secondary-200 flex-1 text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
