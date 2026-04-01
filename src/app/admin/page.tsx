"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { adminApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiUserCheck,
  FiBook,
  FiGrid,
  FiSettings,
} from "react-icons/fi";

interface DashboardStats {
  totalUsers: number;
  totalTutors: number;
  totalStudents: number;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  totalCategories: number;
}

export default function AdminDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const response = await adminApi.getDashboardStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
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

  if (!session?.user || session.user.role !== "ADMIN") return null;

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: "bg-primary-100 text-primary-600",
    },
    {
      label: "Tutors",
      value: stats?.totalTutors || 0,
      icon: FiUserCheck,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Students",
      value: stats?.totalStudents || 0,
      icon: FiBook,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: FiCalendar,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Completed Sessions",
      value: stats?.completedBookings || 0,
      icon: FiTrendingUp,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Pending Bookings",
      value: stats?.pendingBookings || 0,
      icon: FiCalendar,
      color: "bg-orange-100 text-orange-600",
    },
    {
      label: "Categories",
      value: stats?.totalCategories || 0,
      icon: FiGrid,
      color: "bg-pink-100 text-pink-600",
    },
    {
      label: "Total Revenue",
      value: `$${stats?.totalRevenue?.toFixed(0) || 0}`,
      icon: FiDollarSign,
      color: "bg-cyan-100 text-cyan-600",
    },
  ];

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">
            Admin Dashboard
          </h1>
          <p className="text-secondary-600 mt-1">
            Manage users, bookings, and categories
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
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

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="card p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-primary-100 flex items-center justify-center">
                <FiUsers className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">
                  Manage Users
                </h3>
                <p className="text-secondary-600 text-sm">
                  View and manage all users
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/bookings"
            className="card p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center">
                <FiCalendar className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">
                  All Bookings
                </h3>
                <p className="text-secondary-600 text-sm">
                  View all platform bookings
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="card p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-green-100 flex items-center justify-center">
                <FiGrid className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Categories</h3>
                <p className="text-secondary-600 text-sm">
                  Manage subject categories
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
