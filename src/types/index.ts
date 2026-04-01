// User types
export type UserRole = "STUDENT" | "TUTOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  image?: string;
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TutorProfile {
  id: string;
  userId: string;
  bio?: string;
  hourlyRate: number;
  experience: number;
  rating: number;
  totalReviews: number;
  isAvailable: boolean;
  user: Pick<User, "id" | "name" | "email" | "image">;
  categories?: TutorCategory[];
  availabilities?: TutorAvailability[];
  createdAt: string;
  updatedAt: string;
}

export interface TutorCategory {
  id: string;
  tutorProfileId: string;
  categoryId: string;
  category: Category;
}

export interface TutorAvailability {
  id: string;
  tutorProfileId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  _count?: {
    tutors: number;
  };
}

export interface Booking {
  id: string;
  studentId: string;
  tutorProfileId: string;
  scheduledAt: string;
  duration: number;
  status: BookingStatus;
  notes?: string;
  student?: Pick<User, "id" | "name" | "email" | "image">;
  tutor?: TutorProfile;
  tutorProfile?: TutorProfile;
  review?: Review;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  studentId: string;
  tutorProfileId: string;
  bookingId: string;
  student?: Pick<User, "id" | "name" | "image">;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
