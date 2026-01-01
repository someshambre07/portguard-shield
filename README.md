# Smart Port Defence System - Cyber Risk Assessment Portal

A military-grade cyber risk assessment tool for smart port infrastructure.

## ⚠️ SECURITY NOTICE

This is a **RESTRICTED ACCESS** system. Only pre-authorized admin accounts can access the portal.

**No public registration is allowed.**

---

## 🔐 Default Admin Account Setup

Since public registration is disabled, you must create admin accounts manually via the backend.

### Creating the Default Admin Account

1. Open the backend dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User** and enter:
   - **Email**: `admin@smartport.defense.gov.in`
   - **Password**: `Admin@SecurePort2024`
4. After the user is created, you need to assign the admin role in the database:
   - Navigate to **Database** → **Tables** → **user_roles**
   - Insert a new row:
     - `user_id`: (copy the UUID of the user you just created)
     - `role`: `admin`

### Alternative: SQL Command

You can also run this SQL after creating the user in Authentication:

```sql
-- Replace 'YOUR_USER_UUID' with the actual user UUID from auth.users
INSERT INTO public.user_roles (user_id, role) 
VALUES ('YOUR_USER_UUID', 'admin');
```

### 🔑 Demo Credentials (After Setup)

| Field    | Value                           |
|----------|--------------------------------|
| Email    | admin@smartport.defense.gov.in |
| Password | Admin@SecurePort2024           |

**⚠️ IMPORTANT**: Change these credentials immediately in production!

---

## Features

- **Cyber Risk Scanning**: Non-intrusive security assessment of port infrastructure
- **Risk Dashboard**: Real-time visualization of security posture
- **PDF Reports**: Professional cybersecurity assessment reports
- **Scan History**: Persistent storage of all assessment reports
- **Admin-Only Access**: Role-based access control for security

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Lovable Cloud (Supabase)
- **Authentication**: Supabase Auth with role-based access
- **Database**: PostgreSQL with Row Level Security
- **PDF Generation**: jsPDF with AutoTable

## Development

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

## Security Features

- ✅ Admin-only authentication (no public registration)
- ✅ Role-based access control via database
- ✅ Row Level Security on all tables
- ✅ Password re-verification for destructive actions
- ✅ JWT-based session management
- ✅ Secure password hashing

## Routes

| Route      | Access     | Description                    |
|------------|------------|--------------------------------|
| `/`        | Public     | Landing page                   |
| `/auth`    | Public     | Admin login                    |
| `/scan`    | Admin Only | Start new security scan        |
| `/dashboard` | Admin Only | View scan results            |
| `/report`  | Admin Only | Detailed report view           |
| `/history` | Admin Only | Previous scan reports          |

---

**Classification: RESTRICTED**
**For Authorized Personnel Only**
