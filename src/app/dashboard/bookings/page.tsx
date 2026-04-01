"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { bookingApi } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import { Booking } from "@/types";

// Confirmation Modal Component
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  isLoading?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 text-red-600">
              <FiAlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-secondary-100 text-secondary-500 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="p-4">
          <p className="text-secondary-600">{message}</p>
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 bg-secondary-50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-secondary-300 text-secondary-700 hover:bg-secondary-100 transition-colors font-medium disabled:opacity-50"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            {isLoading && (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "upcoming",
  );
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    bookingId: string;
    tutorName: string;
  }>({ isOpen: false, bookingId: "", tutorName: "" });
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchBookings();
    }
  }, [session, activeTab, pagination.page]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const status =
        activeTab === "upcoming" ? "PENDING,CONFIRMED" : "COMPLETED,CANCELLED";
      const response = await bookingApi.getMyBookings({
        status,
        page: pagination.page,
        limit: pagination.limit,
      });
      setBookings(response.data || []);
      if (response.meta) {
        setPagination((prev) => ({
          ...prev,
          total: response.meta!.total,
          totalPages: response.meta!.totalPages,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const openCancelModal = (bookingId: string, tutorName: string) => {
    setCancelModal({ isOpen: true, bookingId, tutorName });
  };

  const handleCancelBooking = async () => {
    const { bookingId } = cancelModal;
    setIsCancelling(true);

    try {
      await bookingApi.cancel(bookingId);
      toast.success("Booking cancelled successfully");
      setCancelModal({ isOpen: false, bookingId: "", tutorName: "" });
      fetchBookings();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isPending) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-48 mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-secondary-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="text-secondary-600 hover:text-primary-600"
          >
            <FiChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              My Bookings
            </h1>
            <p className="text-secondary-600">Manage your tutoring sessions</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab("upcoming");
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "upcoming"
                ? "bg-primary-600 text-white"
                : "bg-white text-secondary-600 hover:bg-secondary-100"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => {
              setActiveTab("past");
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "past"
                ? "bg-primary-600 text-white"
                : "bg-white text-secondary-600 hover:bg-secondary-100"
            }`}
          >
            Past
          </button>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-secondary-200 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-secondary-200 rounded w-1/3" />
                    <div className="h-4 bg-secondary-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <FiCalendar className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              No {activeTab} bookings
            </h3>
            <p className="text-secondary-600 mb-6">
              {activeTab === "upcoming"
                ? "You don't have any upcoming sessions scheduled."
                : "You haven't completed any sessions yet."}
            </p>
            {activeTab === "upcoming" && (
              <Link href="/tutors" className="btn-primary">
                Find a Tutor
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="card p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Tutor Avatar */}
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                    {booking.tutorProfile?.user?.image ? (
                      <img
                        src={booking.tutorProfile.user.image}
                        alt={booking.tutorProfile.user.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary-600">
                        {booking.tutorProfile?.user?.name?.charAt(0) || "T"}
                      </span>
                    )}
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-secondary-900">
                      Session with {booking.tutorProfile?.user?.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-secondary-600 justify-center sm:justify-start">
                      <div className="flex items-center gap-1">
                        <FiCalendar />
                        <span>
                          {new Date(booking.scheduledAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock />
                        <span>
                          {new Date(booking.scheduledAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                      <span>{booking.duration} mins</span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${statusColors[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    {booking.notes && (
                      <p className="mt-2 text-secondary-600 text-sm">
                        Notes: {booking.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 sm:items-end justify-center">
                    {(booking.status === "PENDING" ||
                      booking.status === "CONFIRMED") && (
                      <button
                        onClick={() =>
                          openCancelModal(
                            booking.id,
                            booking.tutorProfile?.user?.name || "Tutor",
                          )
                        }
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Cancel Booking
                      </button>
                    )}
                    {booking.status === "COMPLETED" && !booking.review && (
                      <Link
                        href={`/dashboard/reviews/create?bookingId=${booking.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Leave Review
                      </Link>
                    )}
                    {booking.review && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <FiCheckCircle />
                        <span className="text-sm">Reviewed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 1}
              className="btn bg-white border border-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft />
            </button>
            <span className="text-secondary-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page === pagination.totalPages}
              className="btn bg-white border border-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={cancelModal.isOpen}
        onClose={() =>
          setCancelModal({ isOpen: false, bookingId: "", tutorName: "" })
        }
        onConfirm={handleCancelBooking}
        title="Cancel Booking"
        message={`Are you sure you want to cancel your session with ${cancelModal.tutorName}? This action cannot be undone.`}
        confirmText="Cancel Booking"
        isLoading={isCancelling}
      />
    </div>
  );
}
