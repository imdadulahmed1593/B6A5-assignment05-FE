import { createAuthClient } from "better-auth/react";

// In production, use the frontend's own domain (proxied to backend)
// In development, use localhost backend directly
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // Client-side: use current origin (which proxies to backend)
    return window.location.origin;
  }
  // Server-side
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  fetchOptions: {
    credentials: "include",
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession: useSessionOriginal,
} = authClient;

// Extended session hook with role support
export function useSession() {
  const session = useSessionOriginal();

  // Type assertion to include role in user object
  return session as {
    data: {
      user: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
        emailVerified: boolean;
        role: "STUDENT" | "TUTOR" | "ADMIN";
        createdAt: Date;
        updatedAt: Date;
      };
      session: {
        id: string;
        expiresAt: Date;
        token: string;
        userId: string;
      };
    } | null;
    isPending: boolean;
    error: Error | null;
  };
}
