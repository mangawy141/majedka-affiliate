# 🏭 Production Setup Guide

**Affiliate System - Complete Deployment Checklist**

---

## ✅ Pre-Deployment Verification

### 1. Technology Stack Verification

```bash
# Check installed versions
npm list next prisma @prisma/client react typescript zod

# Expected output:
# ├── next@16.2.3
# ├── prisma@5.22.0 (STABLE - NOT v7)
# ├── @prisma/client@5.22.0 (STABLE - NOT v7)
# ├── react@19.2.4
# ├── typescript@5.x
# └── zod@latest
```

**✓ Only Prisma v5 stable is supported (NOT v7 experimental)**

---

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb affiliate_db

# Or using psql:
psql -U postgres
CREATE DATABASE affiliate_db;
```

**Connection String Format:**

```
postgresql://[user]:[password]@[host]:[port]/[database]

Examples:
- Local: postgresql://postgres:password@localhost:5432/affiliate_db
- Supabase: postgresql://user:password@project.supabase.co:5432/postgres
- Railway/Render: postgresql://...
```

---

### 3. Schema Deployment

```bash
# Push schema to database
npx prisma db push

# Verify with Prisma Studio
npx prisma studio

# Expected tables:
# - Affiliate
# - Click
# - Sale
```

**Database tables created:**

```sql
-- Affiliate table (main)
CREATE TABLE "Affiliate" (
  "id" UUID PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "affiliateCode" TEXT UNIQUE NOT NULL,
  "status" VARCHAR(10) DEFAULT 'PENDING',
  "totalClicks" INT DEFAULT 0,
  "totalSales" INT DEFAULT 0,
  "totalEarnings" FLOAT DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP,
  -- ... other fields
);

-- Click table (analytics)
CREATE TABLE "Click" (
  "id" UUID PRIMARY KEY,
  "affiliateId" UUID NOT NULL REFERENCES "Affiliate"(id) ON DELETE CASCADE,
  "ip" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_click_affiliateId ON "Click"("affiliateId");

-- Sale table (revenue tracking)
CREATE TABLE "Sale" (
  "id" UUID PRIMARY KEY,
  "affiliateId" UUID NOT NULL REFERENCES "Affiliate"(id) ON DELETE CASCADE,
  "orderId" TEXT UNIQUE NOT NULL,
  "amount" FLOAT NOT NULL,
  "commission" FLOAT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_sale_affiliateId ON "Sale"("affiliateId");
```

---

## 🚀 Deployment Steps

### Step 1: Environment Variables

Create `.env.production`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/affiliate_db"

# Node environment
NODE_ENV="production"

# Optional: Email notifications
RESEND_API_KEY="re_xxxxxxxxxxxx"
ADMIN_EMAIL="admin@majedka.com"

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID="gtag-id"
```

### Step 2: Build

```bash
# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Build Next.js
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Route handlers compiled
# ✓ Database types generated
```

### Step 3: Database Migration

```bash
# Apply schema to production database
DATABASE_URL="postgresql://..." npx prisma db push

# Verify connection
npx prisma studio
```

### Step 4: Deploy to Hosting

#### **Option A: Vercel (Recommended for Next.js)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod

# Set environment variables in Vercel dashboard
# DATABASE_URL=postgresql://...
```

#### **Option B: Docker**

Create `Dockerfile`:

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Generate Prisma
COPY prisma ./prisma
RUN npx prisma generate

# Build
COPY . .
RUN npm run build

# Run
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Build and push:

```bash
docker build -t affiliate-system .
docker tag affiliate-system:latest registry.com/affiliate-system:latest
docker push registry.com/affiliate-system:latest
```

#### **Option C: Self-hosted (Linux/Ubuntu)**

```bash
# SSH into server
ssh root@your-server.com

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/yourrepo/affiliate-system.git
cd affiliate-system

# Install PM2 (process manager)
npm i -g pm2

# Setup
npm ci
npx prisma db push

# Start with PM2
pm2 start "npm run start" --name "affiliate-api"
pm2 save
pm2 startup

# Setup Nginx reverse proxy
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default
# Configure to proxy to localhost:3000
```

---

## 🔍 Post-Deployment Testing

### 1. API Health Check

```bash
# Test apply endpoint
curl -X POST https://yourdomain.com/api/apply \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","contentType":"videos","experience":"beginner","motivation":"test"}'

# Expected: 201 Created
```

### 2. Database Connectivity

```bash
# SSH into server and verify
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"Affiliate\";"

# Should return: count
#        0
```

### 3. Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 100 https://yourdomain.com/

# Expected: ~100-500 req/s depending on infrastructure
```

---

## 📊 Monitoring

### Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# Or use external service:
# - Sentry for error tracking
# - Datadog for performance
# - New Relic for APM
```

### Database Monitoring

```bash
# PostgreSQL connections
SELECT count(*) FROM pg_stat_activity;

# Query performance
SELECT query, mean_exec_time FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 10;

# Table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables WHERE schemaname != 'pg_catalog'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🔐 Security Checklist

- [ ] Environment variables in `.env.production` (not in git)
- [ ] DATABASE_URL uses strong password
- [ ] CORS configured for allowed domains
- [ ] Rate limiting enabled on `/api/apply`
- [ ] SQL injection prevention (Prisma handles this)
- [ ] Input validation with Zod (already implemented)
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS/SSL enabled
- [ ] Database backups scheduled daily
- [ ] Firewall allows only necessary ports (80, 443)

---

## 📈 Scaling Strategy

### Phase 1: 0-10K affiliates

- Single PostgreSQL instance
- Single Next.js server
- CDN for static assets

### Phase 2: 10K-100K affiliates

- PostgreSQL read replicas
- Load balancer (Nginx/HAProxy)
- Redis cache for affiliate codes
- Separate analytics database

### Phase 3: 100K+ affiliates

- Database sharding by region
- Kafka for event streaming
- Separate write/read databases
- Multi-server deployment
- CDN expansion

---

## 🔧 Maintenance

### Daily

- Monitor error rates
- Check database connection pool
- Verify backups completed

### Weekly

- Review slow queries
- Update dependencies
- Check disk space

### Monthly

- Performance analysis
- Security audit
- Cost optimization

---

## 🚨 Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT NOW();"

# Check pool connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'affiliate_db';

# Restart connection pool
npm run start
```

### High Memory Usage

```bash
# Check heap size
node --max-old-space-size=2048 node_modules/.bin/next start

# Enable garbage collection logging
NODE_OPTIONS="--expose-gc" npm run start
```

### Slow API Responses

```bash
# Check database indexes
SELECT schemaname, tablename, indexname FROM pg_indexes
WHERE tablename IN ('Affiliate', 'Click', 'Sale');

# Add missing indexes if needed
CREATE INDEX idx_affiliate_status ON "Affiliate"("status");
```

---

## 📝 Rollback Plan

```bash
# If deployment fails, rollback to previous version
pm2 restart affiliate-api

# Or revert database schema
git revert HEAD
npx prisma db push

# Or restore from backup
pg_restore -d affiliate_db /path/to/backup.sql
```

---

## 📞 Support & Documentation

- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs

---

**✅ Deployment Complete! System ready for production traffic.**
