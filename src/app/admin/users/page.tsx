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
  FiSearch,
  FiUser,
  FiMail,
  FiShield,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import { User } from "@/types";

// Confirmation Modal Component
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmColor = "red",
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor?: "red" | "green";
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
            <div
              className={`p-2 rounded-full ${
                confirmColor === "red"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
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
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-2 ${
              confirmColor === "red"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
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

export default function AdminUsersPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: string;
    newStatus: string;
    userName: string;
  }>({ isOpen: false, userId: "", newStatus: "", userName: "" });
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
      fetchUsers();
    }
  }, [session, pagination.page, roleFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;

      const response = await adminApi.getUsers(params);
      setUsers(response.data || []);
      if (response.meta) {
        setPagination((prev) => ({
          ...prev,
          total: response.meta!.total,
          totalPages: response.meta!.totalPages,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      toast.success("User role updated successfully!");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user role");
    }
  };

  const openStatusConfirm = (
    userId: string,
    newStatus: string,
    userName: string,
  ) => {
    setConfirmModal({ isOpen: true, userId, newStatus, userName });
  };

  const handleStatusChange = async () => {
    const { userId, newStatus } = confirmModal;
    const action = newStatus === "BANNED" ? "ban" : "unban";
    setIsStatusChanging(true);

    try {
      await adminApi.updateUserStatus(userId, newStatus);
      toast.success(`User ${action}ned successfully!`);
      setConfirmModal({
        isOpen: false,
        userId: "",
        newStatus: "",
        userName: "",
      });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} user`);
    } finally {
      setIsStatusChanging(false);
    }
  };

  if (isPending) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-48 mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-secondary-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "ADMIN") return null;

  const roleColors: Record<string, string> = {
    STUDENT: "bg-green-100 text-green-700",
    TUTOR: "bg-blue-100 text-blue-700",
    ADMIN: "bg-purple-100 text-purple-700",
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
              Manage Users
            </h1>
            <p className="text-secondary-600">
              View and manage all platform users
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="input-field w-full pl-10 focus:outline-none focus:ring-0 focus:border-secondary-200"
                />
              </div>
            </form>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="input-field  w-full sm:w-auto focus:outline-none focus:ring-0 focus:border-secondary-200"
            >
              <option value="">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="TUTOR">Tutors</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
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
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <FiUser className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                No users found
              </h3>
              <p className="text-secondary-600">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Verified
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-secondary-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-lg font-bold text-primary-600">
                                {user.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <span className="font-medium text-secondary-900">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-secondary-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${roleColors[user.role]}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.emailVerified ? (
                          <span className="text-green-600">✓ Yes</span>
                        ) : (
                          <span className="text-red-600">✗ No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-secondary-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {user.id !== session.user.id && (
                          <button
                            onClick={() =>
                              openStatusConfirm(
                                user.id,
                                user.status === "BANNED" ? "ACTIVE" : "BANNED",
                                user.name,
                              )
                            }
                            className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                              user.status === "BANNED"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {user.status === "BANNED" ? "Unban" : "Ban"}
                          </button>
                        )}
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
              of {pagination.total} users
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
            userId: "",
            newStatus: "",
            userName: "",
          })
        }
        onConfirm={handleStatusChange}
        title={confirmModal.newStatus === "BANNED" ? "Ban User" : "Unban User"}
        message={
          confirmModal.newStatus === "BANNED"
            ? `Are you sure you want to ban "${confirmModal.userName}"? They will no longer be able to access the platform.`
            : `Are you sure you want to unban "${confirmModal.userName}"? They will regain access to the platform.`
        }
        confirmText={
          confirmModal.newStatus === "BANNED" ? "Ban User" : "Unban User"
        }
        confirmColor={confirmModal.newStatus === "BANNED" ? "red" : "green"}
        isLoading={isStatusChanging}
      />
    </div>
  );
}
