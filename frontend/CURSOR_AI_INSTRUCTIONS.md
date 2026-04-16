# College ERP Frontend - Cursor AI Implementation Guide

## Project Overview

This is a **College ERP Frontend** built with **Next.js 16 App Router**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. It connects to a **FastAPI backend** at the endpoints defined in `/config/api.ts`.

## Folder Structure

```
/app
├── (dashboard)/
│   ├── admin/           # Admin role pages
│   │   ├── layout.tsx   # Auth guard for admin
│   │   ├── page.tsx     # Admin dashboard
│   │   ├── students/    # Student management
│   │   ├── faculty/     # Faculty management
│   │   ├── departments/ # Department management
│   │   ├── courses/     # Course management
│   │   ├── subjects/    # Subject management
│   │   ├── attendance/  # Attendance view
│   │   ├── marks/       # Marks management
│   │   ├── results/     # Results generation
│   │   ├── fees/        # Fee management
│   │   ├── timetable/   # Timetable management
│   │   ├── reports/     # Reports generation
│   │   ├── settings/    # System settings
│   │   └── notifications/
│   │
│   ├── faculty/         # Faculty role pages
│   │   ├── layout.tsx   # Auth guard for faculty
│   │   ├── page.tsx     # Faculty dashboard
│   │   ├── attendance/  # Mark attendance
│   │   ├── marks/       # Upload marks
│   │   ├── students/    # View assigned students
│   │   ├── courses/     # View assigned courses
│   │   ├── timetable/   # View schedule
│   │   ├── notifications/
│   │   └── profile/
│   │
│   ├── student/         # Student role pages
│   │   ├── layout.tsx   # Auth guard for student
│   │   ├── page.tsx     # Student dashboard
│   │   ├── attendance/  # View attendance
│   │   ├── results/     # View results
│   │   ├── fees/        # View/pay fees
│   │   ├── courses/     # View enrolled courses
│   │   ├── timetable/   # View schedule
│   │   ├── notifications/
│   │   └── profile/
│   │
│   └── accountant/      # Accountant role pages
│       ├── layout.tsx   # Auth guard for accountant
│       ├── page.tsx     # Accountant dashboard
│       ├── fees/        # Fee collection
│       ├── students/    # View students
│       ├── receipts/    # Generate receipts
│       ├── reports/     # Financial reports
│       ├── notifications/
│       └── profile/
│
├── login/               # Login page
├── unauthorized/        # Unauthorized access page
├── layout.tsx           # Root layout with providers
└── page.tsx             # Root redirect based on role

/components
├── dashboard/           # Dashboard-specific components
│   ├── stats-card.tsx
│   └── activity-feed.tsx
├── layout/              # Layout components
│   ├── app-sidebar.tsx
│   ├── app-header.tsx
│   ├── dashboard-layout.tsx
│   └── page-header.tsx
├── shared/              # Shared/reusable components
│   ├── data-table.tsx
│   ├── confirm-dialog.tsx
│   ├── status-badge.tsx
│   ├── empty-state.tsx
│   └── loading-skeleton.tsx
├── ui/                  # shadcn/ui components (pre-installed)
└── providers.tsx        # App providers wrapper

/config
├── api.ts               # API endpoints configuration
├── navigation.ts        # Role-based navigation menus
└── permissions.ts       # Role-based permissions

/contexts
├── auth-context.tsx     # Authentication state & logic
├── sidebar-context.tsx  # Sidebar state
└── index.ts

/hooks
├── use-api.ts           # Generic API hook with loading/error
├── use-mobile.ts        # Mobile detection
└── use-toast.ts         # Toast notifications

/lib
├── api/                 # API service layer
│   ├── client.ts        # HTTP client with auth
│   ├── auth.ts          # Auth API
│   ├── students.ts      # Students API
│   ├── faculty.ts       # Faculty API
│   └── index.ts
└── utils.ts             # Utility functions

/types
└── index.ts             # TypeScript interfaces
```

## What's Already Implemented

### ✅ Completed

1. **Authentication System**
   - Login page with form
   - Auth context with JWT token management
   - AuthGuard component for protected routes
   - Role-based redirects

2. **Layout System**
   - Responsive sidebar with role-based navigation
   - Header with search, theme toggle, notifications, user menu
   - Dashboard layout wrapper

3. **Role-Based Navigation**
   - Admin: Full access to all modules
   - Faculty: Students, Attendance, Marks, Courses, Timetable
   - Student: Courses, Attendance, Results, Fees, Timetable
   - Accountant: Fees, Students, Reports

4. **Shared Components**
   - DataTable with pagination, search, actions
   - StatusBadge with auto-variant detection
   - ConfirmDialog for delete confirmations
   - EmptyState for placeholder pages
   - Loading skeletons

5. **API Layer**
   - HTTP client with auth headers
   - Auth API service
   - Students API service (template)
   - Faculty API service (template)

6. **Type Definitions**
   - All entity types (User, Student, Faculty, etc.)
   - API response types
   - Form data types

### ⚠️ Partially Implemented (Needs API Integration)

1. **Admin Dashboard** - Has mock data, connect to `/dashboard/admin`
2. **Admin Students List** - Has DataTable, connect to `/students`
3. **Admin Create Student** - Has form, connect to POST `/students`
4. **Faculty Dashboard** - Has mock data, needs API
5. **Faculty Attendance** - Has UI, connect to `/attendance/mark`
6. **Student Dashboard** - Has mock data, needs API
7. **Student Attendance** - Has UI, connect to `/attendance/student/{id}`
8. **Student Fees** - Has UI, connect to `/fees/student/{id}`
9. **Accountant Dashboard** - Has mock data, needs API
10. **Accountant Fees** - Has collect dialog, connect to `/fees/collect`

### ❌ Not Implemented (Placeholder Pages)

These pages show `EmptyState` and need full implementation:

**Admin:**
- `/admin/faculty` - Faculty CRUD
- `/admin/departments` - Department CRUD
- `/admin/courses` - Course CRUD
- `/admin/subjects` - Subject CRUD
- `/admin/attendance` - View all attendance
- `/admin/marks` - View/manage marks
- `/admin/results` - Generate/publish results
- `/admin/fees` - Fee management
- `/admin/timetable` - Create timetable
- `/admin/reports` - Generate reports
- `/admin/notifications` - Send notifications

**Faculty:**
- `/faculty/marks` - Upload marks
- `/faculty/students` - View assigned students
- `/faculty/courses` - View assigned courses
- `/faculty/timetable` - View schedule
- `/faculty/notifications`
- `/faculty/profile`

**Student:**
- `/student/results` - View results
- `/student/courses` - View enrolled courses
- `/student/timetable` - View schedule
- `/student/notifications`
- `/student/profile`

**Accountant:**
- `/accountant/students` - View students
- `/accountant/receipts` - Generate receipts
- `/accountant/reports` - Financial reports
- `/accountant/notifications`
- `/accountant/profile`

## Implementation Patterns

### Adding a New List Page

```tsx
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout";
import { DataTable, StatusBadge, ConfirmDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { entityApi } from "@/lib/api";
import type { Entity, TableColumn } from "@/types";

export default function EntityListPage() {
  const [data, setData] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await entityApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
      });
      setData(response.data);
      setPagination({ ...pagination, total: response.total, totalPages: response.totalPages });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: TableColumn<Entity>[] = [
    { key: "name", label: "Name" },
    { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Entities" description="Manage entities">
        <Button><Plus className="mr-2 h-4 w-4" /> Add Entity</Button>
      </PageHeader>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(page) => setPagination({ ...pagination, page })}
      />
    </div>
  );
}
```

### Adding a New API Service

```ts
// /lib/api/entity.ts
import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/config/api";
import type { Entity, PaginatedResponse, FilterState } from "@/types";

export const entityApi = {
  getAll: async (filters: Partial<FilterState>): Promise<PaginatedResponse<Entity>> => {
    return apiClient.get<PaginatedResponse<Entity>>(API_ENDPOINTS.ENTITY.BASE, filters);
  },
  
  getById: async (id: string): Promise<Entity> => {
    return apiClient.get<Entity>(API_ENDPOINTS.ENTITY.BY_ID(id));
  },
  
  create: async (data: EntityFormData): Promise<Entity> => {
    return apiClient.post<Entity>(API_ENDPOINTS.ENTITY.BASE, data);
  },
  
  update: async (id: string, data: Partial<EntityFormData>): Promise<Entity> => {
    return apiClient.put<Entity>(API_ENDPOINTS.ENTITY.BY_ID(id), data);
  },
  
  delete: async (id: string): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.ENTITY.BY_ID(id));
  },
};
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Backend API Expectations

The frontend expects the backend to return:

1. **Pagination Response:**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

2. **Auth Response:**
```json
{
  "user": { "id": "...", "email": "...", "name": "...", "role": "admin" },
  "accessToken": "...",
  "refreshToken": "..."
}
```

3. **Error Response:**
```json
{
  "message": "Error message",
  "code": "ERROR_CODE",
  "details": { "field": ["error"] }
}
```

## Priority Implementation Order

1. **Complete Admin Students** - Edit/View pages
2. **Complete Admin Faculty** - Full CRUD
3. **Complete Faculty Attendance** - API integration
4. **Complete Student Dashboard** - API integration
5. **Complete Accountant Fees** - Payment flow
6. **Add Charts** - Using Recharts for dashboards
7. **Add Form Validation** - Using react-hook-form + zod
8. **Add Reports** - PDF/Excel generation
9. **Add Timetable** - Calendar view

## Tech Stack

- **Next.js 16** - App Router
- **TypeScript**
- **Tailwind CSS 4**
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **next-themes** - Dark mode
- **sonner** - Toast notifications
- **Recharts** - Charts (to be added)
- **react-hook-form** + **zod** - Form validation (to be added)

## Notes for Cursor AI

1. Always use the existing patterns from implemented pages
2. Use the types defined in `/types/index.ts`
3. Use the API services in `/lib/api/`
4. Use shared components from `/components/shared/`
5. Follow the PageHeader + DataTable pattern for list pages
6. Use ConfirmDialog for delete operations
7. Use StatusBadge for status display
8. Add TODO comments for complex features
9. Mock data is acceptable for initial implementation
10. Test with the login page demo credentials

---

**Start by connecting the existing pages to real API endpoints, then implement the placeholder pages following the established patterns.**
