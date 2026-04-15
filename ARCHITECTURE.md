# 🏗️ Affiliate System Architecture

**Production-Ready Next.js 16 + Prisma v5 + PostgreSQL**

---

## ✅ Tech Stack

| Layer             | Technology             | Version         | Purpose                             |
| ----------------- | ---------------------- | --------------- | ----------------------------------- |
| **Frontend**      | Next.js App Router     | 16.2.3          | Modern React with Server Components |
| **Backend**       | Next.js Route Handlers | 16.2.3          | Serverless API endpoints            |
| **ORM**           | Prisma                 | 5.22.0 (stable) | Type-safe database access           |
| **Database**      | PostgreSQL             | 12+             | Relational database                 |
| **Styling**       | TailwindCSS v4         | 4.x             | Utility-first CSS                   |
| **Validation**    | Zod                    | Latest          | Runtime schema validation           |
| **Notifications** | React Hot Toast        | Latest          | User feedback                       |

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout (Arabic dir, dark theme)
│   ├── page.tsx                    # Landing page (hero, benefits, FAQ)
│   ├── api/
│   │   ├── apply/route.ts          # POST: Affiliate application
│   │   ├── affiliates/
│   │   │   ├── route.ts            # GET: List affiliates (admin)
│   │   │   └── [id]/route.ts       # GET/POST: View & approve/reject
│   │   ├── track/
│   │   │   ├── click/route.ts      # POST: Track affiliate clicks
│   │   │   └── sale/route.ts       # POST: Track & record sales
│   ├── apply/
│   │   ├── page.tsx                # Affiliate application form
│   │   └── success/page.tsx        # Success confirmation
│   └── admin/
│       └── page.tsx                # Admin dashboard
│
├── components/
│   ├── hero-section.tsx            # Landing page hero
│   ├── how-it-works.tsx            # 3-step process section
│   ├── benefits-section.tsx        # Program benefits
│   ├── rewards-section.tsx         # Tier-based rewards
│   ├── faq-section.tsx             # FAQ accordion
│   ├── affiliate-form.tsx          # Multi-step form
│   └── admin/
│       ├── dashboard.tsx           # Admin control panel
│       ├── affiliate-table.tsx     # Data table with filtering
│       └── affiliate-detail-modal.tsx # Approve/reject modal
│
├── lib/
│   ├── db.ts                       # PrismaClient singleton
│   ├── affiliate-codes.ts          # Code generation utilities
│   └── validations.ts              # Zod validation schemas
│
└── styles/
    └── globals.css                 # Tailwind & global styles

prisma/
├── schema.prisma                   # Database schema (enums + models)
└── migrations/                     # Migration history (auto-created)
```

---

## 🗄️ Database Schema

### Models

#### **Affiliate**

- Primary table for creators/influencers
- Tracks application status, performance, earnings
- Has 1-to-many relationship with Click and Sale

**Fields:**

- `id` (UUID): Primary key
- `name` (String): Creator full name
- `email` (String, unique): Email address
- `phone` (String, optional): Contact number
- `country` (String, optional): Creator location
- `socialLinks` (JSON, optional): Multi-platform links
- `contentType` (String): videos | streaming | mixed
- `experience` (String): beginner | intermediate | experienced
- `motivation` (String): How they plan to promote
- `affiliateCode` (String, unique): Human-readable code (AFF-AHMED10)
- `status` (Enum): PENDING | APPROVED | REJECTED
- `rejectionReason` (String, optional): Why application was rejected
- `totalClicks` (Int): Cumulative clicks on affiliate link
- `totalSales` (Int): Number of completed purchases
- `totalEarnings` (Float): Total commission earned
- `createdAt` (DateTime): Application timestamp
- `updatedAt` (DateTime): Last update
- `approvedAt` (DateTime, optional): Approval timestamp

**Indexes:**

- `email` - Fast uniqueness check + lookups
- `status` - Filter by pending/approved/rejected
- `affiliateCode` - Track clicks/sales by code
- `createdAt` - Analytics queries

---

#### **Click**

- Tracks every affiliate link click
- Enables analytics and funnel tracking
- Automatically increments Affiliate.totalClicks

**Fields:**

- `id` (UUID): Primary key
- `affiliateId` (String, FK): Reference to Affiliate
- `ip` (String, optional): User IP address
- `userAgent` (String, optional): Browser/device info
- `createdAt` (DateTime): Click timestamp

**Indexes:**

- `affiliateId` - Fast affiliate lookup
- `createdAt` - Time-based analytics

**Relations:**

- Cascade delete: Deleting Affiliate cascades to clicks

---

#### **Sale**

- Records completed purchases with affiliate commission
- Single source of truth for revenue tracking
- Automatically updates Affiliate.totalSales & totalEarnings

**Fields:**

- `id` (UUID): Primary key
- `affiliateId` (String, FK): Reference to Affiliate
- `orderId` (String, unique): External order ID (prevents duplicates)
- `amount` (Float): Purchase amount
- `commission` (Float): Amount paid to affiliate
- `createdAt` (DateTime): Sale timestamp

**Indexes:**

- `affiliateId` - Affiliate earnings lookup
- `orderId` - Prevent duplicate sales
- `createdAt` - Revenue analytics

**Relations:**

- Cascade delete: Deleting Affiliate cascades to sales

---

## 🔌 API Endpoints

### Public Endpoints

#### **POST /api/apply**

Submit affiliate application

**Request:**

```json
{
  "name": "Ahmed",
  "email": "ahmed@example.com",
  "phone": "+966501234567",
  "country": "SA",
  "socialLinks": {
    "youtube": "https://youtube.com/@ahmed",
    "tiktok": "https://tiktok.com/@ahmed"
  },
  "contentType": "videos",
  "experience": "intermediate",
  "motivation": "I have 100K followers..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "تم استقبال طلبك!",
  "affiliate": {
    "id": "uuid",
    "email": "ahmed@example.com",
    "status": "PENDING"
  }
}
```

**Error Responses:**

- `400`: Invalid data or validation error
- `409`: Email already registered
- `500`: Server error

---

#### **POST /api/track/click**

Track affiliate link click (called when user clicks affiliate link)

**Request:**

```json
{
  "code": "AFF-AHMED10",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

**Response:**

```json
{
  "success": true,
  "affiliateId": "uuid",
  "discount": 0.1
}
```

---

#### **POST /api/track/sale**

Record completed purchase (called after payment)

**Request:**

```json
{
  "code": "AFF-AHMED10",
  "orderId": "order-123",
  "amount": 99.99
}
```

**Response:**

```json
{
  "success": true,
  "sale": {
    "id": "uuid",
    "orderId": "order-123",
    "amount": 99.99,
    "commission": 10.0
  },
  "affiliateEarnings": {
    "totalSales": 5,
    "totalEarnings": 50.0
  }
}
```

---

### Admin Endpoints

#### **GET /api/affiliates**

List all affiliates with filtering

**Query Parameters:**

- `status`: PENDING | APPROVED | REJECTED
- `page`: Pagination (default: 1)
- `limit`: Results per page (default: 20)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Ahmed",
      "email": "ahmed@example.com",
      "affiliateCode": "AFF-AHMED10",
      "status": "PENDING",
      "totalClicks": 42,
      "totalSales": 3,
      "totalEarnings": 30.0,
      "createdAt": "2026-04-15T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

---

#### **GET /api/affiliates/[id]**

Get detailed affiliate information with recent clicks/sales

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Ahmed",
    "email": "ahmed@example.com",
    "totalClicks": 42,
    "totalSales": 3,
    "totalEarnings": 30.0,
    "status": "PENDING",
    "clicks": [
      { "id": "uuid", "createdAt": "2026-04-15T10:00:00Z", "ip": "192.168.1.1" }
    ],
    "sales": [
      { "id": "uuid", "orderId": "order-1", "amount": 10.0, "commission": 1.0 }
    ]
  }
}
```

---

#### **POST /api/affiliates/[id]**

Approve or reject application

**Request:**

```json
{
  "action": "approve",
  "customCode": "AHMED10" // optional, auto-generated if not provided
}
```

Or reject:

```json
{
  "action": "reject",
  "rejectionReason": "Insufficient follower count"
}
```

**Response:**

```json
{
  "success": true,
  "message": "تم الموافقة على المسوّق",
  "data": {
    "id": "uuid",
    "status": "APPROVED",
    "affiliateCode": "AHMED10",
    "approvedAt": "2026-04-15T10:05:00Z"
  }
}
```

---

## 🚀 Production Checklist

- [x] Prisma v5 stable (NOT experimental v7)
- [x] Standard datasource with `env("DATABASE_URL")`
- [x] PrismaClient singleton pattern (connection pooling)
- [x] TypeScript throughout
- [x] Zod validation for all inputs
- [x] Proper error handling
- [x] Indexed database queries
- [x] Cascade deletes for referential integrity
- [x] Arabic RTL support
- [x] Dark mode design
- [x] Mobile-responsive

---

## 🔐 Environment Variables

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/affiliate_db"

# Optional
NODE_ENV="production"
RESEND_API_KEY="optional_for_emails"
ADMIN_EMAIL="admin@example.com"
```

---

## 📊 Scaling Considerations

### Short Term (1K affiliates)

- Current schema handles well
- Add indexes on frequent filters ✓ (already added)
- Monitor query performance

### Medium Term (10K affiliates)

- Consider partitioning Click & Sale tables by date
- Add read replicas for analytics queries
- Implement caching (Redis) for affiliate codes

### Long Term (100K+ affiliates)

- Event streaming for sales (Kafka/Pulsar)
- Separate analytics database
- Sharding by affiliateId
- CDN for tracking pixels

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (visual DB explorer)
npx prisma studio

# Development server
npm run dev

# Production build
npm run build && npm run start
```

---

## 📝 Important Notes

1. **Commission Storage**: Currently stored as Float. For precise financial systems, consider storing in cents (Int).
2. **Idempotency**: Sale endpoint checks orderId uniqueness to prevent double-charges.
3. **Time Tracking**: All timestamps use UTC (createdAt, approvedAt, updatedAt).
4. **Performance**: All affiliateId, createdAt queries use indexes for fast analytics.
5. **Cascade Deletes**: Deleting an Affiliate automatically removes all clicks and sales.

---

## 🔗 Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [PostgreSQL](https://www.postgresql.org/docs)
- [Zod](https://zod.dev)
- [TailwindCSS](https://tailwindcss.com)
