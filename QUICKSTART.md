# 🚀 Developer Quick Start Guide

**Get up and running with the Affiliate System in 5 minutes**

---

## 1️⃣ Clone & Setup (2 min)

```bash
# Clone repository
git clone https://github.com/yourrepo/affiliate-system.git
cd affiliate-system

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Edit .env with your database URL
nano .env
# DATABASE_URL="postgresql://user:password@localhost:5432/affiliate_db"
```

---

## 2️⃣ Database Setup (1 min)

```bash
# Generate Prisma client
npx prisma generate

# Sync database schema
npx prisma db push

# View data (optional)
npx prisma studio
```

---

## 3️⃣ Start Development (1 min)

```bash
# Start dev server
npm run dev

# Expected output:
# ▲ Next.js 16.2.3
# - Local:        http://localhost:3000
# - Environments: .env.local

# Open browser
open http://localhost:3000
```

---

## 4️⃣ Test System (1 min)

Open another terminal:

```bash
# Test affiliate application
curl -X POST http://localhost:3000/api/apply \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Creator",
    "email": "test@example.com",
    "contentType": "videos",
    "experience": "intermediate",
    "motivation": "I want to test this system"
  }'

# Expected response:
# {"success":true,"message":"تم استقبال طلبك!","affiliate":{...}}
```

---

## 📁 Key Files to Know

### Backend (API)

```
src/app/api/
├── apply/route.ts              ← Handle affiliate signups
├── affiliates/route.ts         ← List all (admin)
├── affiliates/[id]/route.ts    ← Detail + approve/reject
└── track/
    ├── click/route.ts          ← Log clicks
    └── sale/route.ts           ← Log sales + commission
```

### Frontend (Pages)

```
src/app/
├── page.tsx                    ← Landing page
├── apply/page.tsx              ← Application form
├── apply/success/page.tsx      ← Success page
└── admin/page.tsx              ← Admin dashboard
```

### Database

```
prisma/
├── schema.prisma               ← Database models
└── migrations/                 ← Migration history
```

### Utilities

```
src/lib/
├── db.ts                       ← Prisma client singleton
├── affiliate-codes.ts          ← Code generation logic
└── validations.ts              ← Zod validation schemas
```

---

## 🔧 Common Development Tasks

### Add a new API endpoint

```typescript
// Create: src/app/api/my-endpoint/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Your logic here
    const result = await prisma.affiliate.findMany();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

### Modify database schema

```prisma
// Edit: prisma/schema.prisma

model Affiliate {
  // ... existing fields
  newField    String?  // Add new field
}
```

Then:

```bash
# Apply changes
npx prisma db push

# Generate types
npx prisma generate
```

### Query database

```typescript
// In any API route or server component

import { prisma } from "@/lib/db";

// Get affiliates
const affiliates = await prisma.affiliate.findMany({
  where: { status: "APPROVED" },
  orderBy: { createdAt: "desc" },
});

// Get with relations
const affiliate = await prisma.affiliate.findUnique({
  where: { id: "uuid" },
  include: {
    clicks: true,
    sales: true,
  },
});

// Create
const newAffiliate = await prisma.affiliate.create({
  data: {
    name: "Ahmed",
    email: "ahmed@example.com",
    affiliateCode: "AFF-AHMED10",
  },
});

// Update
const updated = await prisma.affiliate.update({
  where: { id: "uuid" },
  data: { status: "APPROVED" },
});

// Delete
await prisma.affiliate.delete({
  where: { id: "uuid" },
});
```

### Add validation

```typescript
// Edit: src/lib/validations.ts

import { z } from "zod";

export const mySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

// Use in API:
const validated = mySchema.parse(body);
```

---

## 📊 Testing API Endpoints

### Using cURL

```bash
# Apply
curl -X POST http://localhost:3000/api/apply \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com",...}'

# Get affiliates
curl http://localhost:3000/api/affiliates?status=PENDING

# Get single affiliate
curl http://localhost:3000/api/affiliates/[id]

# Track click
curl -X POST http://localhost:3000/api/track/click \
  -H "Content-Type: application/json" \
  -d '{"code":"AFF-TEST123"}'

# Track sale
curl -X POST http://localhost:3000/api/track/sale \
  -H "Content-Type: application/json" \
  -d '{"code":"AFF-TEST123","orderId":"order-1","amount":99.99}'
```

### Using Postman/Insomnia

1. Import endpoints from `API_REFERENCE.md`
2. Set `{{host}}` = `http://localhost:3000`
3. Run requests in order: Apply → Approve → Track

---

## 🐛 Debugging

### Check database

```bash
# Open Prisma Studio
npx prisma studio

# Or use psql
psql $DATABASE_URL
SELECT * FROM "Affiliate";
```

### Check logs

```bash
# Development server shows:
# ✓ API calls
# ✓ Database queries (dev only)
# ✓ Build errors
# ✓ TypeScript errors
```

### TypeScript errors

```bash
# Check all errors
npm run build

# Fix common issues:
# - Missing types: npm install -D @types/...
# - Type mismatch: Check prisma types
# - Import errors: Verify file paths
```

---

## 🚀 Build for Production

```bash
# Check for errors
npm run build

# Start production server
npm run start

# Test production build
curl http://localhost:3000
```

---

## 📚 Learn More

| Topic       | Resource                            |
| ----------- | ----------------------------------- |
| Prisma      | https://www.prisma.io/docs          |
| Next.js     | https://nextjs.org/docs/app         |
| TailwindCSS | https://tailwindcss.com             |
| Zod         | https://zod.dev                     |
| TypeScript  | https://www.typescriptlang.org/docs |

---

## 💡 Pro Tips

1. **Hot reload**: Edit files and see changes instantly (HMR enabled)
2. **Type safety**: Always use TypeScript, hover over variables for types
3. **Database**: Run `npx prisma studio` to visually edit data
4. **API testing**: Use `npm install -g httpie` for cleaner API calls
5. **Debugging**: VS Code debugger works with Next.js (config in .vscode)

---

## ❓ FAQ

**Q: How do I add a new field to Affiliate?**
A: Edit schema.prisma, then `npx prisma db push`

**Q: How do I deploy?**
A: See PRODUCTION_SETUP.md

**Q: How do I check database?**
A: Run `npx prisma studio`

**Q: Database error on startup?**
A: Check `.env` has valid DATABASE_URL

**Q: API 500 error?**
A: Check server logs, likely Prisma/database issue

**Q: Performance slow?**
A: Run `npm run build` to check bundle size

---

## 🎉 You're Ready!

```
✓ Dependencies installed
✓ Database connected
✓ Development server running
✓ API endpoints working
✓ Ready to develop!
```

**Happy coding! 🚀**
