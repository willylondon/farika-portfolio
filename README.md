# The English Language

**Expert English & Language Arts Tutoring** — PEP, CSEC English A, IGCSE English Language, IB English

A production-quality tutoring website built with Next.js 14, featuring:

- 📚 Programme pages for PEP, CSEC, IGCSE, IB, Essay Writing, and Comprehension
- 📅 Class scheduling with real-time seat availability
- 💳 Bank transfer booking flow with receipt upload and manual approval
- 👩‍💼 Admin dashboard for managing classes, bookings, students, and content
- 📧 Automated email notifications (booking confirmation, reminders)
- 🔍 SEO-optimised with JSON-LD structured data, sitemap, and meta tags
- 📱 Fully responsive mobile-first design

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# 1. Clone the repository
git clone <repo-url> the-english-language
cd the-english-language

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your settings (admin password, SMTP, bank details)

# 4. Set up the database
npx prisma db push

# 5. Seed with sample data
npm run db:seed

# 6. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Admin Login

After seeding, log in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login):

- **Email**: `admin@theenglishlanguage.com` (or your `ADMIN_EMAIL`)
- **Password**: `changeme123` (or your `ADMIN_PASSWORD`)

> ⚠️ **Change the admin password** in `.env` before deploying to production.

## End-to-End Flow

1. **Parent visits** the site → browses programmes → selects a class
2. **Books a class** → fills student & parent details → sees bank transfer instructions
3. **Makes bank transfer** → uploads receipt screenshot on the website
4. **Admin receives notification** → reviews receipt in dashboard → clicks "Approve"
5. **Booking confirmed** → seat count updates → parent receives confirmation email with class details

## Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── programmes/        # Programme pages
│   │   ├── classes/           # Class listings
│   │   ├── book/              # Booking flow
│   │   ├── blog/              # Blog
│   │   ├── admin/             # Admin dashboard
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── lib/                   # Utilities, auth, email
│   ├── actions/               # Server Actions
│   └── types/                 # TypeScript types
├── uploads/                   # Receipt uploads (gitignored)
└── public/                    # Static assets
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Database | SQLite + Prisma ORM |
| Styling | Tailwind CSS 3 |
| Auth | NextAuth v4 (Credentials) |
| Email | Nodemailer |
| Icons | Lucide React |

## Deployment

### Option A: VPS with Docker

```bash
# Build and run
docker-compose up -d

# Run migrations and seed
docker-compose exec web npx prisma db push
docker-compose exec web npm run db:seed
```

### Option B: Direct Node.js

```bash
npm run build
npx prisma db push
npm run db:seed
npm start
```

### Environment Variables

See `.env.example` for all required variables. Key ones to configure:

- `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — Admin login credentials
- `SMTP_*` — Email sending configuration
- `BANK_*` — Bank transfer details shown to parents
- `SITE_URL` — Your production URL

## Email Configuration

Emails are logged to the console in development. For production, configure SMTP:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="The English Language <lessons@yourdomain.com>"
```

Works with Gmail (App Password), Brevo, SendGrid, Amazon SES, or any SMTP provider.

## SEO Features

- JSON-LD structured data (`EducationalOrganization`, `Course`, `FAQPage`, `Review`)
- Dynamic sitemap.xml
- robots.txt
- OpenGraph and Twitter card meta tags
- Semantic HTML
- Mobile-first responsive design
- Optimised Core Web Vitals

## Content Strategy

Target keywords:
- "PEP Language Arts preparation Jamaica"
- "CSEC English lessons online"
- "PEP Ability Test tutor Kingston"
- "CXC English A tutoring"
- "IGCSE English tutor Jamaica"
- "English extra lessons Jamaica"

## License

Private. All rights reserved.
