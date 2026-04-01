"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { userApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiChevronLeft, FiUser, FiMail, FiCamera } from "react-icons/fi";
import Link from "next/link";
import { User } from "@/types";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const response = await userApi.getProfile();
      setProfile(response.data);
      setFormData({
        name: response.data.name || "",
        image: response.data.image || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSaving(true);
    try {
      await userApi.updateProfile({
        name: formData.name,
        image: formData.image || undefined,
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-secondary-200 rounded w-48 mb-8" />
            <div className="card p-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-secondary-200 rounded-full" />
                <div className="space-y-2">
                  <div className="h-6 bg-secondary-200 rounded w-48" />
                  <div className="h-4 bg-secondary-200 rounded w-36" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user || !profile) return null;

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
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
                My Profile
              </h1>
              <p className="text-secondary-600">
                Manage your account information
              </p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="card p-6">
            {!isEditing ? (
              <>
                {/* View Mode */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-12 h-12 text-primary-600" />
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl font-semibold text-secondary-900">
                      {profile.name}
                    </h2>
                    <p className="text-secondary-600">{profile.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                      {profile.role}
                    </span>
                  </div>
                </div>

                {/* Account Info */}
                <div className="space-y-4 py-6 border-t border-secondary-100">
                  <div className="flex items-center gap-3">
                    <FiUser className="text-secondary-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-secondary-500">Full Name</p>
                      <p className="font-medium text-secondary-900">
                        {profile.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMail className="text-secondary-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-secondary-500">
                        Email Address
                      </p>
                      <p className="font-medium text-secondary-900">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Verification Status */}
                <div className="py-4 border-t border-secondary-100">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600">Email Verified</span>
                    {profile.emailVerified ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Member Since */}
                <div className="pt-4 border-t border-secondary-100">
                  <p className="text-sm text-secondary-500">
                    Member since{" "}
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary w-full mt-6"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                        {formData.image ? (
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser className="w-12 h-12 text-primary-600" />
                        )}
                      </div>
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Profile Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        className="input-field w-full"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="input-field w-full"
                      required
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      className="input-field w-full bg-secondary-50"
                      disabled
                    />
                    <p className="text-sm text-secondary-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: profile.name,
                          image: profile.image || "",
                        });
                      }}
                      className="btn bg-secondary-100 text-secondary-700 hover:bg-secondary-200 flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
