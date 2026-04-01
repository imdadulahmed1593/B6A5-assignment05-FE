import Link from "next/link";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">SkillBridge</h3>
            <p className="text-secondary-400 mb-4 max-w-md">
              Connect with expert tutors and learn anything. Our platform makes
              it easy to find, book, and learn from the best tutors in any
              subject.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors"
              >
                <FiTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors"
              >
                <FiLinkedin size={20} />
              </a>
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors"
              >
                <FiGithub size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tutors"
                  className="hover:text-white transition-colors"
                >
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-white transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-white transition-colors"
                >
                  Become a Tutor
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-500">
          <p>
            &copy; {new Date().getFullYear()} SkillBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
