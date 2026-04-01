"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Better Auth redirects here after verification
    // If there's an error param, verification failed
    if (error) {
      setStatus("error");
      if (error === "invalid_token") {
        setMessage(
          "Invalid or expired verification link. Please request a new one.",
        );
      } else {
        setMessage("Verification failed. Please try again.");
      }
      return;
    }

    // No error means verification was successful
    setStatus("success");
    setMessage("Email verified successfully! You can now log in.");
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8 text-center">
          {status === "loading" && (
            <>
              <FiLoader className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                Verifying Your Email
              </h1>
              <p className="text-secondary-600">Please wait...</p>
            </>
          )}

          {status === "success" && (
            <>
              <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                Email Verified!
              </h1>
              <p className="text-secondary-600 mb-6">{message}</p>
              <Link
                href="/login"
                className="btn-primary inline-block px-8 py-3"
              >
                Go to Login
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                Verification Failed
              </h1>
              <p className="text-secondary-600 mb-6">{message}</p>
              <Link
                href="/login"
                className="btn-primary inline-block px-8 py-3"
              >
                Go to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
