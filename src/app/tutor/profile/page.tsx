"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { tutorApi, categoryApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiChevronLeft,
  FiUser,
  FiDollarSign,
  FiClock,
  FiStar,
  FiEdit2,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { TutorProfile, Category } from "@/types";

export default function TutorProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    bio: "",
    experience: 0,
    hourlyRate: 0,
    isAvailable: true,
    categoryIds: [] as string[],
  });

  // Availability state
  const [availabilities, setAvailabilities] = useState<
    { dayOfWeek: number; startTime: string; endTime: string }[]
  >([]);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [isSavingAvailability, setIsSavingAvailability] = useState(false);

  const DAYS_OF_WEEK = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

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
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      const [profileResponse, categoriesResponse] = await Promise.all([
        tutorApi.getMyProfile().catch(() => ({ data: null })),
        categoryApi.getAll(),
      ]);

      setProfile(profileResponse.data);
      setCategories(categoriesResponse.data || []);

      if (profileResponse.data) {
        setFormData({
          bio: profileResponse.data.bio || "",
          experience: profileResponse.data.experience || 0,
          hourlyRate: profileResponse.data.hourlyRate || 0,
          isAvailable: profileResponse.data.isAvailable ?? true,
          categoryIds:
            profileResponse.data.categories?.map((c: any) => c.categoryId) ||
            [],
        });
        // Set availabilities from profile
        if (profileResponse.data.availabilities) {
          setAvailabilities(
            profileResponse.data.availabilities.map((a: any) => ({
              dayOfWeek: a.dayOfWeek,
              startTime: a.startTime,
              endTime: a.endTime,
            })),
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.hourlyRate <= 0) {
      toast.error("Hourly rate must be greater than 0");
      return;
    }

    setIsSaving(true);
    try {
      if (profile) {
        await tutorApi.updateProfile(formData);
        toast.success("Profile updated successfully!");
      } else {
        await tutorApi.createProfile(formData);
        toast.success("Profile created successfully!");
      }
      setIsEditing(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  // Availability handlers
  const addAvailabilitySlot = () => {
    setAvailabilities((prev) => [
      ...prev,
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
    ]);
  };

  const removeAvailabilitySlot = (index: number) => {
    setAvailabilities((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAvailabilitySlot = (
    index: number,
    field: "dayOfWeek" | "startTime" | "endTime",
    value: string | number,
  ) => {
    setAvailabilities((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
    );
  };

  const handleSaveAvailability = async () => {
    // Validate time slots
    for (const slot of availabilities) {
      if (slot.startTime >= slot.endTime) {
        toast.error("End time must be after start time");
        return;
      }
    }

    setIsSavingAvailability(true);
    try {
      await tutorApi.updateAvailability(availabilities);
      toast.success("Availability updated successfully!");
      setIsEditingAvailability(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update availability");
    } finally {
      setIsSavingAvailability(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
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

  if (!session?.user || session.user.role !== "TUTOR") return null;

  const showForm = isEditing || !profile;

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/tutor/dashboard"
              className="text-secondary-600 hover:text-primary-600"
            >
              <FiChevronLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-secondary-900">
                Tutor Profile
              </h1>
              <p className="text-secondary-600">
                {profile
                  ? "Manage your tutor profile"
                  : "Set up your tutor profile"}
              </p>
            </div>
            {profile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn bg-secondary-100 text-secondary-700 hover:bg-secondary-200 flex items-center gap-2"
              >
                <FiEdit2 /> Edit
              </button>
            )}
          </div>

          <div className="card p-6">
            {showForm ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Bio / About You
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="input-field w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
                    rows={4}
                    placeholder="Tell students about yourself, your teaching style, and expertise..."
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experience: Number(e.target.value),
                      })
                    }
                    className="input-field w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
                    min="0"
                    max="50"
                  />
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hourlyRate: Number(e.target.value),
                      })
                    }
                    className="input-field w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Subjects You Teach
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          formData.categoryIds.includes(category.id)
                            ? "bg-primary-600 text-white"
                            : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                  {formData.categoryIds.length === 0 && (
                    <p className="text-sm text-secondary-500 mt-2">
                      Select at least one subject you can teach
                    </p>
                  )}
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div>
                    <p className="font-medium text-secondary-900">
                      Available for Bookings
                    </p>
                    <p className="text-sm text-secondary-600">
                      Students can book sessions when enabled
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  {profile && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form
                        setFormData({
                          bio: profile.bio || "",
                          experience: profile.experience || 0,
                          hourlyRate: profile.hourlyRate || 0,
                          isAvailable: profile.isAvailable ?? true,
                          categoryIds:
                            profile.categories?.map((c: any) => c.categoryId) ||
                            [],
                        });
                      }}
                      className="btn bg-secondary-100 text-secondary-700 hover:bg-secondary-200 flex-1"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {isSaving
                      ? "Saving..."
                      : profile
                        ? "Save Changes"
                        : "Create Profile"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* View Mode */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FiUser className="w-10 h-10 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-secondary-900">
                      {session.user.name}
                    </h2>
                    <p className="text-secondary-600">{session.user.email}</p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                        profile.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {profile.isAvailable ? "Available" : "Not Available"}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <FiDollarSign className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-secondary-900">
                      ${profile.hourlyRate}
                    </p>
                    <p className="text-sm text-secondary-600">Per Hour</p>
                  </div>
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <FiClock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-secondary-900">
                      {profile.experience}
                    </p>
                    <p className="text-sm text-secondary-600">Years Exp.</p>
                  </div>
                  <div className="text-center p-4 bg-secondary-50 rounded-lg">
                    <FiStar className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-secondary-900">
                      {profile.rating.toFixed(1)}
                    </p>
                    <p className="text-sm text-secondary-600">
                      {profile.totalReviews} Reviews
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <div className="mb-6">
                    <h3 className="font-medium text-secondary-900 mb-2">
                      About
                    </h3>
                    <p className="text-secondary-600">{profile.bio}</p>
                  </div>
                )}

                {/* Categories */}
                {profile.categories && profile.categories.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-secondary-900 mb-2">
                      Subjects
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.categories.map((c: any) => (
                        <span
                          key={c.id}
                          className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                        >
                          {c.category.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability Section */}
                <div className="border-t border-secondary-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-secondary-900">
                      Availability Hours
                    </h3>
                    {!isEditingAvailability && (
                      <button
                        onClick={() => setIsEditingAvailability(true)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                      >
                        <FiEdit2 className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>

                  {isEditingAvailability ? (
                    <div className="space-y-4">
                      {availabilities.length === 0 ? (
                        <p className="text-secondary-500 text-sm">
                          No availability slots added yet
                        </p>
                      ) : (
                        availabilities.map((slot, index) => (
                          <div
                            key={index}
                            className="flex flex-wrap items-center gap-3 p-3 bg-secondary-50 rounded-lg"
                          >
                            <select
                              value={slot.dayOfWeek}
                              onChange={(e) =>
                                updateAvailabilitySlot(
                                  index,
                                  "dayOfWeek",
                                  Number(e.target.value),
                                )
                              }
                              className="input-field focus:outline-none focus:ring-0 focus:border-secondary-200"
                            >
                              {DAYS_OF_WEEK.map((day, i) => (
                                <option key={i} value={i}>
                                  {day}
                                </option>
                              ))}
                            </select>
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) =>
                                  updateAvailabilitySlot(
                                    index,
                                    "startTime",
                                    e.target.value,
                                  )
                                }
                                className="input-field focus:outline-none focus:ring-0 focus:border-secondary-200"
                              />
                              <span className="text-secondary-500">to</span>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) =>
                                  updateAvailabilitySlot(
                                    index,
                                    "endTime",
                                    e.target.value,
                                  )
                                }
                                className="input-field focus:outline-none focus:ring-0 focus:border-secondary-200"
                              />
                            </div>
                            <button
                              onClick={() => removeAvailabilitySlot(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}

                      <button
                        onClick={addAvailabilitySlot}
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        <FiPlus className="w-4 h-4" /> Add Time Slot
                      </button>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => {
                            setIsEditingAvailability(false);
                            // Reset to original
                            if (profile?.availabilities) {
                              setAvailabilities(
                                profile.availabilities.map((a: any) => ({
                                  dayOfWeek: a.dayOfWeek,
                                  startTime: a.startTime,
                                  endTime: a.endTime,
                                })),
                              );
                            }
                          }}
                          className="btn bg-secondary-100 text-secondary-700 hover:bg-secondary-200 flex-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveAvailability}
                          disabled={isSavingAvailability}
                          className="btn-primary flex-1 disabled:opacity-50"
                        >
                          {isSavingAvailability
                            ? "Saving..."
                            : "Save Availability"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {availabilities.length === 0 ? (
                        <p className="text-secondary-500 text-sm">
                          No availability set. Click Edit to add your available
                          hours.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {availabilities.map((slot, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 text-secondary-600"
                            >
                              <span className="font-medium w-24">
                                {DAYS_OF_WEEK[slot.dayOfWeek]}
                              </span>
                              <span>
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
