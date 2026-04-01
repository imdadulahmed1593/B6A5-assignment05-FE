"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { adminApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiClock,
  FiFilter,
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
  confirmColor = "blue",
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor?: "red" | "green" | "blue" | "yellow";
  isLoading?: boolean;
}) {
  if (!isOpen) return null;

  const colorClasses = {
    red: "bg-red-600 hover:bg-red-700",
    green: "bg-green-600 hover:bg-green-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    yellow: "bg-yellow-600 hover:bg-yellow-700",
  };

  const iconColorClasses = {
    red: "bg-red-100 text-red-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

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
            <div
              className={`p-2 rounded-full ${iconColorClasses[confirmColor]}`}
            >
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
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-2 ${colorClasses[confirmColor]}`}
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

export default function AdminBookingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    bookingId: string;
    newStatus: string;
    currentStatus: string;
    studentName: string;
  }>({
    isOpen: false,
    bookingId: "",
    newStatus: "",
    currentStatus: "",
    studentName: "",
  });
  const [isStatusChanging, setIsStatusChanging] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push("/login");
      } else if (session.user.role !== "ADMIN") {
        toast.error("Access denied. Admin privileges required.");
        router.push("/dashboard");
      }
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchBookings();
    }
  }, [session, pagination.page, statusFilter]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (statusFilter) params.status = statusFilter;

      const response = await adminApi.getAllBookings(params);
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

  const openStatusConfirm = (
    bookingId: string,
    newStatus: string,
    currentStatus: string,
    studentName: string,
  ) => {
    if (newStatus === currentStatus) return;
    setConfirmModal({
      isOpen: true,
      bookingId,
      newStatus,
      currentStatus,
      studentName,
    });
  };

  const handleStatusChange = async () => {
    const { bookingId, newStatus } = confirmModal;
    setIsStatusChanging(true);

    try {
      await adminApi.updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking status updated to ${newStatus}!`);
      setConfirmModal({
        isOpen: false,
        bookingId: "",
        newStatus: "",
        currentStatus: "",
        studentName: "",
      });
      fetchBookings();
    } catch (error: any) {
      toast.error(error.message || "Failed to update booking status");
    } finally {
      setIsStatusChanging(false);
    }
  };

  const getStatusColor = (
    status: string,
  ): "red" | "green" | "blue" | "yellow" => {
    switch (status) {
      case "CONFIRMED":
        return "blue";
      case "COMPLETED":
        return "green";
      case "CANCELLED":
        return "red";
      default:
        return "yellow";
    }
  };

  if (isPending) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-48 mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-secondary-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "ADMIN") return null;

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
            href="/admin"
            className="text-secondary-600 hover:text-primary-600"
          >
            <FiChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              All Bookings
            </h1>
            <p className="text-secondary-600">View all platform bookings</p>
          </div>
        </div>

        {/* Filter */}
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-4">
            <FiFilter className="text-secondary-600" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="input-field focus:outline-none focus:ring-0 focus:border-secondary-200"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-secondary-100 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center">
              <FiCalendar className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                No bookings found
              </h3>
              <p className="text-secondary-600">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Tutor
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-sm font-bold text-green-600">
                              {booking.student?.name?.charAt(0) || "S"}
                            </span>
                          </div>
                          <span className="text-secondary-900">
                            {booking.student?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              {booking.tutorProfile?.user?.name?.charAt(0) ||
                                "T"}
                            </span>
                          </div>
                          <span className="text-secondary-900">
                            {booking.tutorProfile?.user?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-secondary-600">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4" />
                          {new Date(booking.scheduledAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FiClock className="w-4 h-4" />
                          {new Date(booking.scheduledAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-secondary-600">
                        {booking.duration} mins
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            openStatusConfirm(
                              booking.id,
                              e.target.value,
                              booking.status,
                              booking.student?.name || "Student",
                            )
                          }
                          className={`px-3 py-1.5 text-xs rounded-lg font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${statusColors[booking.status]}`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-secondary-600">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-secondary-600 text-sm">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} bookings
            </p>
            <div className="flex items-center gap-2">
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
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({
            isOpen: false,
            bookingId: "",
            newStatus: "",
            currentStatus: "",
            studentName: "",
          })
        }
        onConfirm={handleStatusChange}
        title="Update Booking Status"
        message={`Are you sure you want to change the booking status for "${confirmModal.studentName}" from ${confirmModal.currentStatus} to ${confirmModal.newStatus}?`}
        confirmText={`Change to ${confirmModal.newStatus}`}
        confirmColor={getStatusColor(confirmModal.newStatus)}
        isLoading={isStatusChanging}
      />
    </div>
  );
}
