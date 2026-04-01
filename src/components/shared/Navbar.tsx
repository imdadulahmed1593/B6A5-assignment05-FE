"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMenu, FiX, FiUser, FiChevronDown } from "react-icons/fi";
import { useSession, signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const user = session?.user;
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "TUTOR") return "/tutor/dashboard";
    return "/dashboard";
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            SkillBridge
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user?.role === "STUDENT" && (
              <>
                <Link
                  href="/tutors"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  Find Tutors
                </Link>
                <Link
                  href="/categories"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  Categories
                </Link>
              </>
            )}
            {user?.role === "ADMIN" && (
              <Link
                href={getDashboardLink()}
                className=" text-secondary-600 hover:bg-secondary-50 hover:text-primary-600"
              >
                Dashboard
              </Link>
            )}
            {user?.role === "TUTOR" && (
              <Link
                href="/tutor/bookings"
                onClick={() => setShowUserMenu(false)}
                className="text-secondary-600 hover:bg-secondary-50 hover:text-primary-600"
              >
                My Sessions
              </Link>
            )}
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-secondary-200 animate-pulse" />
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-4 h-4 text-primary-600" />
                    )}
                  </div>
                  <span className="font-medium">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <FiChevronDown
                    className={`transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-100 py-2 z-20">
                      <div className="px-4 py-2 border-b border-secondary-100">
                        <p className="font-medium text-secondary-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-sm text-secondary-500 truncate">
                          {user?.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                          {user?.role}
                        </span>
                      </div>
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-secondary-600 hover:bg-secondary-50 hover:text-primary-600"
                      >
                        Dashboard
                      </Link>
                      {user?.role === "STUDENT" && (
                        <Link
                          href="/dashboard/bookings"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-secondary-600 hover:bg-secondary-50 hover:text-primary-600"
                        >
                          My Bookings
                        </Link>
                      )}

                      <Link
                        href={
                          user?.role === "TUTOR"
                            ? "/tutor/profile"
                            : "/dashboard/profile"
                        }
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-secondary-600 hover:bg-secondary-50 hover:text-primary-600"
                      >
                        Profile
                      </Link>
                      <hr className="my-2 border-secondary-100" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              {user?.role === "STUDENT" && (
                <>
                  <Link
                    href="/tutors"
                    onClick={() => setIsOpen(false)}
                    className="text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    Find Tutors
                  </Link>
                  <Link
                    href="/categories"
                    onClick={() => setIsOpen(false)}
                    className="text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    Categories
                  </Link>
                </>
              )}
              {isLoggedIn ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsOpen(false)}
                    className="text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  {user?.role === "STUDENT" && (
                    <Link
                      href="/dashboard/bookings"
                      onClick={() => setIsOpen(false)}
                      className="text-secondary-600 hover:text-primary-600 transition-colors"
                    >
                      My Bookings
                    </Link>
                  )}
                  {user?.role === "TUTOR" && (
                    <Link
                      href="/tutor/bookings"
                      onClick={() => setIsOpen(false)}
                      className="text-secondary-600 hover:text-primary-600 transition-colors"
                    >
                      My Sessions
                    </Link>
                  )}
                  <Link
                    href={
                      user?.role === "TUTOR"
                        ? "/tutor/profile"
                        : "/dashboard/profile"
                    }
                    onClick={() => setIsOpen(false)}
                    className="text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="btn bg-red-50 text-red-600 hover:bg-red-100 w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
