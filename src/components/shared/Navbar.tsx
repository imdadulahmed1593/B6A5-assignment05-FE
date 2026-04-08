"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiUser, FiChevronDown } from "react-icons/fi";
import { useSession, signOut } from "@/lib/auth-client";
import ThemeToggle from "@/components/shared/ThemeToggle";
import toast from "react-hot-toast";

function NavItem({
  href,
  label,
  pathname,
  onClick,
}: {
  href: string;
  label: string;
  pathname: string;
  onClick?: () => void;
}) {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-200"
          : "text-secondary-600 dark:text-secondary-200 hover:text-primary-600 hover:bg-secondary-100/80 dark:hover:bg-secondary-800"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

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
    <nav className="sticky top-0 z-50 border-b border-secondary-200/80 dark:border-secondary-800 bg-white/80 dark:bg-secondary-900/75 backdrop-blur-xl shadow-[0_8px_24px_-20px_rgba(2,6,23,0.55)] py-2">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-cyan-400 text-white font-bold shadow-sm">
              L
            </span>
            <span className="text-xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100">
              Learnzy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavItem href="/tutors" label="Find Tutors" pathname={pathname} />
            <NavItem
              href="/categories"
              label="Categories"
              pathname={pathname}
            />
            <NavItem href="/about" label="About" pathname={pathname} />
            <NavItem href="/contact" label="Contact" pathname={pathname} />
            {isLoggedIn && (
              <>
                <NavItem href="/help" label="Help" pathname={pathname} />
                <NavItem
                  href={getDashboardLink()}
                  label="Dashboard"
                  pathname={pathname}
                />
              </>
            )}
            {user?.role === "TUTOR" && (
              <NavItem
                href="/tutor/bookings"
                label="My Sessions"
                pathname={pathname}
                onClick={() => setShowUserMenu(false)}
              />
            )}
            <div className="ml-2 pl-2 border-l border-secondary-200 dark:border-secondary-700">
              <ThemeToggle />
            </div>
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-secondary-200 dark:bg-secondary-700 animate-pulse" />
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="ml-2 flex items-center gap-2 rounded-full border border-secondary-200 dark:border-secondary-700 bg-white/70 dark:bg-secondary-900/70 px-2.5 py-1.5 text-secondary-700 dark:text-secondary-200 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 transition-colors"
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
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-secondary-900 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 py-2 z-20">
                      <div className="px-4 py-2 border-b border-secondary-100 dark:border-secondary-700">
                        <p className="font-medium text-secondary-900 dark:text-secondary-100 truncate">
                          {user?.name}
                        </p>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400 truncate">
                          {user?.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                          {user?.role}
                        </span>
                      </div>
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-secondary-600 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-primary-600"
                      >
                        Dashboard
                      </Link>
                      {user?.role === "STUDENT" && (
                        <Link
                          href="/dashboard/bookings"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-secondary-600 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-primary-600"
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
                        className="block px-4 py-2 text-secondary-600 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-primary-600"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/privacy"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-secondary-600 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-primary-600"
                      >
                        Privacy
                      </Link>
                      <hr className="my-2 border-secondary-100 dark:border-secondary-700" />
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
                  className="text-secondary-600 dark:text-secondary-200 hover:text-primary-600 transition-colors"
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
          <div className="md:hidden flex items-center gap-2">
            <div className="ml-2 pl-2 border-l border-secondary-200 dark:border-secondary-700">
              <ThemeToggle />
            </div>
            <button
              className="md:hidden rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white/80 dark:bg-secondary-900/70 p-2 text-secondary-700 dark:text-secondary-100"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="card p-4 mt-2 flex flex-col gap-2">
              <NavItem
                href="/tutors"
                label="Find Tutors"
                pathname={pathname}
                onClick={() => setIsOpen(false)}
              />
              <NavItem
                href="/categories"
                label="Categories"
                pathname={pathname}
                onClick={() => setIsOpen(false)}
              />
              <NavItem
                href="/about"
                label="About"
                pathname={pathname}
                onClick={() => setIsOpen(false)}
              />
              <NavItem
                href="/contact"
                label="Contact"
                pathname={pathname}
                onClick={() => setIsOpen(false)}
              />
              {isLoggedIn && (
                <NavItem
                  href="/help"
                  label="Help Center"
                  pathname={pathname}
                  onClick={() => setIsOpen(false)}
                />
              )}

              {isLoggedIn ? (
                <>
                  <NavItem
                    href={getDashboardLink()}
                    label="Dashboard"
                    pathname={pathname}
                    onClick={() => setIsOpen(false)}
                  />
                  {user?.role === "STUDENT" && (
                    <NavItem
                      href="/dashboard/bookings"
                      label="My Bookings"
                      pathname={pathname}
                      onClick={() => setIsOpen(false)}
                    />
                  )}
                  {user?.role === "TUTOR" && (
                    <NavItem
                      href="/tutor/bookings"
                      label="My Sessions"
                      pathname={pathname}
                      onClick={() => setIsOpen(false)}
                    />
                  )}
                  <NavItem
                    href={
                      user?.role === "TUTOR"
                        ? "/tutor/profile"
                        : "/dashboard/profile"
                    }
                    label="Profile"
                    pathname={pathname}
                    onClick={() => setIsOpen(false)}
                  />
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
                  <NavItem
                    href="/login"
                    label="Login"
                    pathname={pathname}
                    onClick={() => setIsOpen(false)}
                  />
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
