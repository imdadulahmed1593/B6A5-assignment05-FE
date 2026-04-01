"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signUp } from "@/lib/auth-client";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiPhone,
} from "react-icons/fi";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  role: "STUDENT" | "TUTOR";
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: "STUDENT",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        toast.error(result.error.message || "Registration failed");
        return;
      }

      toast.success(
        "Registration successful! Please check your email to verify your account.",
      );
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary-900">
              Create Account
            </h1>
            <p className="text-secondary-600 mt-2">
              Join SkillBridge and start learning today
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                <input
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className="input-field pl-10 w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="input-field pl-10 w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Phone (Optional)
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                <input
                  type="tel"
                  {...register("phone")}
                  className="input-field pl-10 w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    watch("role") === "STUDENT"
                      ? "border-primary-500 bg-primary-50"
                      : "border-secondary-200 hover:border-secondary-300"
                  }`}
                >
                  <input
                    type="radio"
                    {...register("role")}
                    value="STUDENT"
                    className="sr-only"
                  />
                  <div className="text-center">
                    <span className="text-2xl block mb-1">📚</span>
                    <span className="font-medium">Learn</span>
                  </div>
                </label>
                <label
                  className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    watch("role") === "TUTOR"
                      ? "border-primary-500 bg-primary-50"
                      : "border-secondary-200 hover:border-secondary-300"
                  }`}
                >
                  <input
                    type="radio"
                    {...register("role")}
                    value="TUTOR"
                    className="sr-only"
                  />
                  <div className="text-center">
                    <span className="text-2xl block mb-1">🎓</span>
                    <span className="font-medium">Teach</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className="input-field pl-10 pr-10 w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
                  placeholder="••••••••"
                />
                {/* <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button> */}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="input-field pl-10 w-full focus:outline-none focus:ring-0 focus:border-secondary-200"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-secondary-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
