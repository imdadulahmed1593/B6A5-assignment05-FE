"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { userApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiBook,
} from "react-icons/fi";
import { Booking } from "@/types";

interface BookingStat {
  status: string;
  _count: number;
}

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
  };
  upcomingSessions: Booking[];
  bookingStats: BookingStat[];
}

export default function StudentDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const response = await userApi.getDashboard();
      setDashboardData(response.data);
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

  if (!session?.user) return null;

  // Helper to get count by status from bookingStats
  const getStatCount = (status: string) => {
    return (
      dashboardData?.bookingStats?.find((s) => s.status === status)?._count || 0
    );
  };

  const totalBookings =
    dashboardData?.bookingStats?.reduce((sum, s) => sum + s._count, 0) || 0;

  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: FiBook,
      color: "bg-primary-100 text-primary-600",
    },
    {
      label: "Pending",
      value: getStatCount("PENDING"),
      icon: FiClock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Confirmed",
      value: getStatCount("CONFIRMED"),
      icon: FiCalendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Completed",
      value: getStatCount("COMPLETED"),
      icon: FiCheckCircle,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-secondary-600 mt-1">
            Manage your bookings and learning journey
          </p>
        </div>

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
                href="/dashboard/bookings"
                className="text-primary-600 hover:underline text-sm"
              >
                View all
              </Link>
            </div>

            {!dashboardData?.upcomingSessions?.length ? (
              <div className="text-center py-8">
                <FiCalendar className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-600 mb-4">No upcoming sessions</p>
                <Link href="/tutors" className="btn-primary">
                  Find a Tutor
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.upcomingSessions.slice(0, 3).map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                Booking Summary
              </h2>
              <Link
                href="/dashboard/bookings?tab=past"
                className="text-primary-600 hover:underline text-sm"
              >
                View all
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                <span className="text-secondary-600">Pending</span>
                <span className="font-semibold text-yellow-600">
                  {getStatCount("PENDING")}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                <span className="text-secondary-600">Confirmed</span>
                <span className="font-semibold text-blue-600">
                  {getStatCount("CONFIRMED")}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                <span className="text-secondary-600">Completed</span>
                <span className="font-semibold text-green-600">
                  {getStatCount("COMPLETED")}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                <span className="text-secondary-600">Cancelled</span>
                <span className="font-semibold text-red-600">
                  {getStatCount("CANCELLED")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 card p-6">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/tutors"
              className="flex items-center gap-3 p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <FiBook className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-secondary-900">Browse Tutors</p>
                <p className="text-sm text-secondary-600">
                  Find your next tutor
                </p>
              </div>
            </Link>
            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-3 p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-secondary-900">My Bookings</p>
                <p className="text-sm text-secondary-600">
                  Manage your sessions
                </p>
              </div>
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <FiStar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-secondary-900">My Profile</p>
                <p className="text-sm text-secondary-600">Update your info</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  showReview,
}: {
  booking: Booking;
  showReview?: boolean;
}) {
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  // Support both tutor and tutorProfile field names
  const tutorUser = booking?.tutor?.user || booking?.tutorProfile?.user;

  return (
    <div className="flex items-start gap-4 p-4 bg-secondary-50 rounded-lg">
      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
        {tutorUser?.image ? (
          <img
            src={tutorUser.image}
            alt={tutorUser.name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-lg font-bold text-primary-600">
            {tutorUser?.name?.charAt(0) || "T"}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-secondary-900 truncate">
          {tutorUser?.name || "Tutor"}
        </p>
        <p className="text-sm text-secondary-600">
          {new Date(booking?.scheduledAt).toLocaleDateString()} at{" "}
          {new Date(booking?.scheduledAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <div className="flex items-center gap-2 mt-2">
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
      {showReview && booking.status === "COMPLETED" && !booking.review && (
        <Link
          href={`/dashboard/reviews/create?bookingId=${booking.id}`}
          className="text-primary-600 hover:underline text-sm whitespace-nowrap"
        >
          Leave review
        </Link>
      )}
    </div>
  );
}
