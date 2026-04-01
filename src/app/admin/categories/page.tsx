"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { categoryApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiChevronLeft,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiGrid,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { Category } from "@/types";

export default function AdminCategoriesPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSaving, setIsSaving] = useState(false);

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
      fetchCategories();
    }
  }, [session]);

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSaving(true);
    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory.id, formData);
        toast.success("Category updated successfully!");
      } else {
        await categoryApi.create(formData);
        toast.success("Category created successfully!");
      }
      resetForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to save category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await categoryApi.delete(categoryId);
      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
  };

  if (isPending || isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-secondary-200 rounded w-48 mb-8" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-secondary-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "ADMIN") return null;

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin"
              className="text-secondary-600 hover:text-primary-600"
            >
              <FiChevronLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-secondary-900">
                Categories
              </h1>
              <p className="text-secondary-600">Manage subject categories</p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <FiPlus /> Add Category
              </button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary-900">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-secondary-600 hover:text-secondary-900"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-field w-full"
                    placeholder="e.g., Mathematics, Programming, Music"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="input-field w-full"
                    rows={3}
                    placeholder="Brief description of this category..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary disabled:opacity-50"
                  >
                    {isSaving
                      ? "Saving..."
                      : editingCategory
                        ? "Update Category"
                        : "Add Category"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Categories List */}
          <div className="card overflow-hidden">
            {categories.length === 0 ? (
              <div className="p-12 text-center">
                <FiGrid className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  No categories yet
                </h3>
                <p className="text-secondary-600 mb-6">
                  Create your first category to get started
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary"
                >
                  Add Category
                </button>
              </div>
            ) : (
              <div className="divide-y divide-secondary-100">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 flex items-center justify-between hover:bg-secondary-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <FiGrid className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-secondary-900">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-secondary-600">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">About Categories</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Categories help students find tutors in specific subjects
              </li>
              <li>• Tutors can select multiple categories for their profile</li>
              <li>
                • Deleting a category will remove it from all tutor profiles
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
