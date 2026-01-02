---

# 🛡️ Smart Port Defence System – Cyber Risk Assessment Portal

A **military-grade, decision-support cyber risk assessment platform** designed for **smart ports, ship IT networks, and maritime logistics infrastructure**.

This system focuses on **preventive cyber risk identification** using non-intrusive techniques and **does not perform penetration testing or exploitation**.

---

## ⚠️ SECURITY & ACCESS NOTICE

This is a **RESTRICTED ACCESS SYSTEM**.

* ❌ No public registration
* ✅ Access limited to **pre-authorized administrators**
* ✅ Designed for defence and government environments

**For Authorized Personnel Only**

---

## 🎯 Solution Objective

The Smart Port Defence System provides:

* Early cyber risk visibility
* Context-aware risk interpretation
* Clear risk scoring for decision-makers
* Actionable mitigation guidance

The platform is intended to **support operational readiness without disrupting live maritime systems**.

---

## 🔐 Authentication & Admin Access Model

This system follows a **pre-provisioned admin access model**, consistent with military cybersecurity practices.

* Admin users are **created manually**
* Roles are enforced at the database level
* No self-registration or role escalation is permitted

---

## 🗄️ Database & Backend Architecture

The backend uses **Supabase (PostgreSQL)** with **Row Level Security (RLS)** enabled.

> ⚠️ **Important**: The database is **not included** in the repository.
> Evaluators must create their **own Supabase project** and apply the provided schema.

This approach follows **secure software distribution standards**.

---

## 🧱 Database Schema Setup (MANDATORY)

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Note the **Project URL** and **Anon Public Key**

---

### Step 2: Create Required Tables

Open **Supabase → SQL Editor** and run the following:

```sql
-- Table to store scan metadata
CREATE TABLE scan_reports (
  scan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target TEXT NOT NULL,
  system_type TEXT NOT NULL,
  risk_score INT NOT NULL,
  risk_level TEXT NOT NULL,
  pdf_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table to manage admin roles
CREATE TABLE user_roles (
  user_id UUID PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('ADMIN'))
);
```

---

### Step 3: Enable Row Level Security

Enable RLS on both tables and apply policies:

```sql
ALTER TABLE scan_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage scan reports"
ON scan_reports
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND role = 'ADMIN'
  )
);

CREATE POLICY "Admins can manage roles"
ON user_roles
FOR ALL
TO authenticated
USING (
  user_id = auth.uid()
);
```

---

### Step 4: Create Storage Bucket for Reports

1. Go to **Supabase → Storage**
2. Create a **private bucket** named:

```
reports
```

This bucket stores generated PDF assessment reports.

---

## 🔐 Admin Account Creation (Demo / Evaluation)

1. Go to **Supabase → Authentication → Users**
2. Create an admin user (email & password of your choice)
3. Copy the user’s UUID
4. Assign admin role:

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('PASTE_USER_UUID_HERE', 'ADMIN');
```

⚠️ **Credentials are NOT included in this repository**.
Evaluators must create their own admin account.

---

## ⚙️ Environment Configuration

Create a `.env` file using the template below:

📄 **`.env.example`**

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

> 🔐 **Do NOT commit `.env` files or secrets.**

---

## 🚀 Running the Application

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🔍 Key Features

* ✅ Non-intrusive cyber risk assessment
* ✅ Context-aware severity evaluation
* ✅ Risk score (0–100) with classification
* ✅ Professional PDF report generation
* ✅ Scan history with date-time ordering
* ✅ Secure admin-only access
* ✅ Password re-verification for destructive actions

---

## 🧰 Technology Stack

* **Frontend**: React, TypeScript, Vite, Tailwind CSS
* **Backend**: Supabase (PostgreSQL + Auth + Storage)
* **Security**: Row Level Security (RLS), JWT
* **Reporting**: jsPDF with AutoTable

---

## 📍 Application Routes

| Route        | Access | Description      |
| ------------ | ------ | ---------------- |
| `/`          | Public | Landing page     |
| `/auth`      | Public | Admin login      |
| `/scan`      | Admin  | Start assessment |
| `/dashboard` | Admin  | Risk dashboard   |
| `/report`    | Admin  | Detailed report  |
| `/history`   | Admin  | Scan history     |

---

## 🛑 Ethical & Operational Disclaimer

This system performs **assessment only**.

* ❌ No exploitation
* ❌ No brute-force activity
* ❌ No denial-of-service
* ✅ Read-only risk indicators

Designed to **support preventive cybersecurity planning** in maritime and naval environments.

---

**Classification: RESTRICTED**
**For Authorized Personnel Only**

---

