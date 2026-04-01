# SkillBridge Frontend

A modern tutoring platform frontend built with Next.js 14, enabling students to find and book sessions with expert tutors.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Forms:** React Hook Form
- **HTTP Client:** Axios
- **Authentication:** Better Auth (client)
- **Notifications:** React Hot Toast
- **Icons:** React Icons

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard pages
│   │   ├── bookings/       # Manage all bookings
│   │   └── users/          # Manage users (ban/unban, roles)
│   ├── api/                # API routes
│   │   ├── auth/           # Auth proxy (Better Auth)
│   │   └── proxy/          # API proxy for production
│   ├── dashboard/          # Student dashboard
│   │   ├── bookings/       # My bookings
│   │   └── reviews/        # My reviews
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── tutor/              # Tutor dashboard
│   │   ├── bookings/       # Tutor's bookings
│   │   ├── dashboard/      # Tutor overview
│   │   └── profile/        # Tutor profile & availability
│   ├── tutors/             # Browse tutors
│   │   └── [id]/           # Tutor detail & booking
│   ├── verify-email/       # Email verification
│   └── page.tsx            # Homepage
├── components/
│   └── shared/             # Shared components
│       ├── Footer.tsx
│       └── Navbar.tsx
├── lib/
│   ├── api.ts              # Axios API client
│   └── auth-client.ts      # Better Auth client
├── store/
│   └── authStore.ts        # Zustand auth store
└── types/
    └── index.ts            # TypeScript interfaces
```

## 🔐 Authentication

Authentication is handled via Better Auth with an API proxy approach:

- **Auth routes** are proxied through `/api/auth/*` to the backend
- **API routes** are proxied through `/api/proxy/*` in production
- This ensures cookies work correctly across origins

### User Roles

- **STUDENT** - Can browse tutors, book sessions, leave reviews
- **TUTOR** - Can manage profile, availability, accept/reject bookings
- **ADMIN** - Full access to manage users, bookings, and platform

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file:

```env
# Backend API URL (for server-side fetching)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Backend URL for proxy (server-side only)
BACKEND_URL=http://localhost:5000
```

### Development

```bash
# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📄 Pages Overview

| Route                 | Description                                               |
| --------------------- | --------------------------------------------------------- |
| `/`                   | Homepage with hero, features, categories, featured tutors |
| `/tutors`             | Browse and search tutors with filters                     |
| `/tutors/[id]`        | Tutor profile, reviews, and booking form                  |
| `/login`              | User login                                                |
| `/register`           | User registration                                         |
| `/verify-email`       | Email verification callback                               |
| `/dashboard`          | Student dashboard                                         |
| `/dashboard/bookings` | Student's bookings (cancel, review)                       |
| `/tutor/dashboard`    | Tutor dashboard overview                                  |
| `/tutor/profile`      | Manage tutor profile & availability                       |
| `/tutor/bookings`     | Manage incoming bookings                                  |
| `/admin`              | Admin dashboard                                           |
| `/admin/users`        | Manage users (roles, ban/unban)                           |
| `/admin/bookings`     | View/manage all bookings                                  |

## 🎨 Styling

The project uses Tailwind CSS with a custom design system:

- **Primary colors** - Blue theme (`primary-50` to `primary-900`)
- **Secondary colors** - Gray theme (`secondary-50` to `secondary-900`)
- **Components** - `.card`, `.btn`, `.btn-primary`, `.input-field`
- **Layout** - `.container-custom` for consistent page width

## 🔧 API Integration

All API calls go through the centralized axios client in `src/lib/api.ts`:

```typescript
import { tutorApi, bookingApi, reviewApi, adminApi } from '@/lib/api';

// Examples
const tutors = await tutorApi.search({ categoryId: '...' });
const booking = await bookingApi.create({ ... });
```

### Available API Modules

- `tutorApi` - Tutor search, profile management
- `bookingApi` - Create, cancel, confirm bookings
- `reviewApi` - Create and fetch reviews
- `categoryApi` - Get categories
- `userApi` - User profile and dashboard
- `adminApi` - Admin operations

## 🚀 Deployment

The frontend is deployed on Vercel:

```bash
# Deploy to Vercel
vercel --prod
```

### Environment Variables for Production

Set these in Vercel dashboard:

- `NEXT_PUBLIC_API_URL` - Production backend URL
- `BACKEND_URL` - Production backend URL (for server-side proxy)

## 📝 License

MIT
