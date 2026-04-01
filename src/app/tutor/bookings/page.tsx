"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { bookingApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { Booking } from "@/types";

export default function TutorBookingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push("/login");
      } else if (session.user.role !== "TUTOR") {
        toast.error("Access denied. Tutor account required.");
        router.push("/dashboard");
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user?.role === "TUTOR") {
      fetchBookings();
    }
  }, [session, activeTab, pagination.page]);

  const getStatusFilter = () => {
    switch (activeTab) {
      case "pending":
        return "PENDING";
      case "confirmed":
        return "CONFIRMED";
      case "completed":
        return "COMPLETED";
      case "cancelled":
        return "CANCELLED";
      default:
        return "";
    }
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await bookingApi.getMyBookings({
        status: getStatusFilter(),
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

  const handleConfirm = async (bookingId: string) => {
    try {
      await bookingApi.confirm(bookingId);
      toast.success("Booking confirmed!");
      fetchBookings();
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm booking");
    }
  };

  const handleComplete = async (bookingId: string) => {
    try {
      await bookingApi.complete(bookingId);
      toast.success("Session marked as completed!");
      fetchBookings();
    } catch (error: any) {
      toast.error(error.message || "Failed to complete booking");
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingApi.cancel(bookingId);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
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

  if (!session?.user || session.user.role !== "TUTOR") return null;

  const tabs = [
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/tutor/dashboard"
            className="text-secondary-600 hover:text-primary-600"
          >
            <FiChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Manage Bookings
            </h1>
            <p className="text-secondary-600">
              View and manage student session requests
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-primary-600 text-white"
                  : "bg-white text-secondary-600 hover:bg-secondary-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
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
            <p className="text-secondary-600">
              {activeTab === "pending"
                ? "You don't have any pending booking requests."
                : `No ${activeTab} sessions found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="card p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                  {/* Student Avatar */}
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                    {booking.student?.image ? (
                      <img
                        src={booking.student.image}
                        alt={booking.student.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary-600">
                        {booking.student?.name?.charAt(0) || "S"}
                      </span>
                    )}
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-secondary-900">
                      {booking.student?.name}
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
                    </div>
                    {booking.notes && (
                      <p className="mt-2 text-secondary-600 text-sm pr-2 py-1">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    )}
                    {booking.status === "COMPLETED" &&
                      booking?.review?.comment && (
                        <div className="mt-1 text-sm text-secondary-600 pr-2 py-1">
                          <strong>Review:</strong> "{booking.review.comment}"
                        </div>
                      )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 sm:items-end justify-center">
                    {booking.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleConfirm(booking.id)}
                          className="btn-primary text-sm py-2 px-4 flex items-center gap-1"
                        >
                          <FiCheck /> Confirm
                        </button>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {booking.status === "CONFIRMED" && (
                      <>
                        <button
                          onClick={() => handleComplete(booking.id)}
                          className="btn-primary text-sm py-2 px-4 flex items-center gap-1"
                        >
                          <FiCheck /> Mark Complete
                        </button>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === "COMPLETED" && booking.review && (
                      <div className="text-sm text-secondary-600">
                        Rated {booking.review.rating}/5 ⭐
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
    </div>
  );
}
