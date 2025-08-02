# 🧠 TeamPulse

**TeamPulse** is an internal tool for managing teams and tracking employee sentiment. Built with the modern Next.js App Router, shadcn/ui, Tailwind CSS, and Prisma + PostgreSQL.

---

## 🧰 Tech Stack

- **Next.js (App Router, TypeScript)**
- **shadcn/ui** – UI components
- **Tailwind CSS** – Styling
- **Prisma** – ORM
- **PostgreSQL** – Database
- **Zod + React Hook Form** – Form validation
- **Server Actions + Middleware** – Backend logic

---

## ⚙️ Features

- 🔐 Cookie-based auth with hardcoded user
- 📊 Dashboard with team sentiment overview
- 👥 Team/member CRUD
- 📈 Weekly sentiment trend charts
- ⚙️ Admin settings (check-in toggles & frequency)
- ✅ Route protection middleware
- 🧪 Zod validation & error handling
- ⚡ Server actions (no traditional REST APIs)

---

## 🚀 Getting Started

### 1. **Clone the Repo**

```bash
git https://github.com/shina1/teamPulse
cd teamPulse
```

## 2. **Install dependency**
```bash
pnpm install
```
## 3. Set Up Environment Variables
# .env
DATABASE_URL="postgresql://postgres:<password>@localhost:5432/teampulse"

## 4. Create the Local Database
# Login to Postgres shell
```bash
psql -U postgres
```

# Inside psql shell
```bash
CREATE DATABASE teampulse;

\q
```


