"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { tutorApi, bookingApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiStar,
  FiUsers,
  FiSettings,
  FiPlus,
} from "react-icons/fi";
import { Booking, TutorProfile } from "@/types";

interface TutorDashboardData {
  profile: TutorProfile | null;
  stats: {
    totalBookings: number;
    pendingBookings: number;
    completedSessions: number;
    totalEarnings: number;
  };
  upcomingBookings: Booking[];
}

export default function TutorDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<TutorDashboardData>({
    profile: null,
    stats: {
      totalBookings: 0,
      pendingBookings: 0,
      completedSessions: 0,
      totalEarnings: 0,
    },
    upcomingBookings: [],
  });
  const [isLoading, setIsLoading] = useState(true);

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
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      // Fetch tutor profile
      const profileResponse = await tutorApi.getMyProfile();
      const profile = profileResponse.data;

      // Fetch upcoming bookings (pending + confirmed)
      const bookingsResponse = await bookingApi.getMyBookings({
        status: "PENDING,CONFIRMED",
        limit: 5,
      });

      // Calculate stats from bookings
      const allBookingsResponse = await bookingApi.getMyBookings({
        limit: 100,
      });
      const allBookings = allBookingsResponse.data || [];

      const stats = {
        totalBookings: allBookings.length,
        pendingBookings: allBookings.filter(
          (b: Booking) => b.status === "PENDING",
        ).length,
        completedSessions: allBookings.filter(
          (b: Booking) => b.status === "COMPLETED",
        ).length,
        totalEarnings: allBookings
          .filter((b: Booking) => b.status === "COMPLETED")
          .reduce(
            (sum: number, b: Booking) =>
              sum + (profile?.hourlyRate || 0) * (b.duration / 60),
            0,
          ),
      };

      setDashboardData({
        profile,
        stats,
        upcomingBookings: bookingsResponse.data || [],
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-64 mb-8" />
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-secondary-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "TUTOR") return null;

  const stats = [
    {
      label: "Total Bookings",
      value: dashboardData.stats.totalBookings,
      icon: FiUsers,
      color: "bg-primary-100 text-primary-600",
    },
    {
      label: "Pending Requests",
      value: dashboardData.stats.pendingBookings,
      icon: FiClock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Completed Sessions",
      value: dashboardData.stats.completedSessions,
      icon: FiCheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Earnings",
      value: `$${dashboardData.stats.totalEarnings.toFixed(0)}`,
      icon: FiDollarSign,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              Tutor Dashboard
            </h1>
            <p className="text-secondary-600 mt-1">
              Manage your tutoring sessions and profile
            </p>
          </div>
          {!dashboardData.profile && (
            <Link
              href="/tutor/profile"
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus /> Complete Your Profile
            </Link>
          )}
        </div>

        {/* Profile Status Alert */}
        {!dashboardData.profile && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800">
              <strong>Complete your profile</strong> to start receiving booking
              requests from students.
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-6">
              <div
                className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-secondary-900">
                {stat.value}
              </p>
              <p className="text-secondary-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upcoming Bookings */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                Upcoming Sessions
              </h2>
              <Link
                href="/tutor/bookings"
                className="text-primary-600 hover:underline text-sm"
              >
                View all
              </Link>
            </div>

            {dashboardData.upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <FiCalendar className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-600">No upcoming sessions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.upcomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onAction={fetchDashboardData}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <Link
                href="/tutor/bookings"
                className="flex items-center gap-3 p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <FiCalendar className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900">
                    Manage Bookings
                  </p>
                  <p className="text-sm text-secondary-600">
                    View and manage booking requests
                  </p>
                </div>
              </Link>
              <Link
                href="/tutor/profile"
                className="flex items-center gap-3 p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiClock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900">
                    Set Availability
                  </p>
                  <p className="text-sm text-secondary-600">
                    Configure your available hours
                  </p>
                </div>
              </Link>
              <Link
                href="/tutor/profile"
                className="flex items-center gap-3 p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FiSettings className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900">Edit Profile</p>
                  <p className="text-sm text-secondary-600">
                    Update your tutor profile
                  </p>
                </div>
              </Link>
            </div>

            {/* Profile Summary */}
            {dashboardData.profile && (
              <div className="mt-6 pt-6 border-t border-secondary-100">
                <h3 className="font-medium text-secondary-900 mb-3">
                  Profile Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Hourly Rate</span>
                    <span className="font-medium">
                      ${dashboardData.profile.hourlyRate}/hr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <FiStar className="text-yellow-500 fill-yellow-500 w-4 h-4" />
                      <span className="font-medium">
                        {dashboardData.profile.rating.toFixed(1)}
                      </span>
                      <span className="text-secondary-500">
                        ({dashboardData.profile.totalReviews})
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Status</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        dashboardData.profile.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {dashboardData.profile.isAvailable
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  onAction,
}: {
  booking: Booking;
  onAction: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await bookingApi.confirm(booking.id);
      toast.success("Booking confirmed!");
      onAction();
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setIsLoading(true);
    try {
      await bookingApi.cancel(booking.id);
      toast.success("Booking cancelled");
      onAction();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="p-4 bg-secondary-50 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-primary-600">
            {booking.student?.name?.charAt(0) || "S"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-secondary-900 truncate">
            {booking.student?.name}
          </p>
          <p className="text-sm text-secondary-600">
            {new Date(booking.scheduledAt).toLocaleDateString()} at{" "}
            {new Date(booking.scheduledAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${statusColors[booking.status]}`}
            >
              {booking.status}
            </span>
            <span className="text-sm text-secondary-600">
              {booking.duration} mins
            </span>
          </div>
        </div>
      </div>

      {booking.status === "PENDING" && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="btn-primary flex-1 text-sm py-2 disabled:opacity-50"
          >
            Confirm
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="btn bg-secondary-200 text-secondary-700 hover:bg-secondary-300 flex-1 text-sm py-2 disabled:opacity-50"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
}
