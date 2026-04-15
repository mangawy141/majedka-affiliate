# Affiliate System - Admin Setup Guide

## 🎯 Quick Start

### 1. Database Setup

The schema has been migrated with three new models:

- **Admin** - Admin users with username/password authentication
- **AffiliateCode** - Custom affiliate codes managed by admins
- **AuditLog** - Tracks admin actions (optional)

### 2. Initial Admin Setup

Create your first admin user:

```bash
curl -X PUT http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "secure_password_123"
  }'
```

Or use the login page at `/admin/login` to test login flow.

### 3. Admin Dashboard Access

1. Go to `http://localhost:3000/admin/login`
2. Log in with your admin credentials
3. Access dashboard at `http://localhost:3000/admin/dashboard`

---

## 🏗️ System Architecture

### New Components

**Form Components** (`src/components/form/`)

- `CardSelect.tsx` - Card-based selector for better UX
- `FormInputs.tsx` - Enhanced input, select, textarea with validation

**Utilities** (`src/lib/`)

- `codes.ts` - Affiliate code generation and validation
- `auth.ts` - Password hashing and JWT token management
- `middleware.ts` - API route protection and validation

**API Routes** (`src/app/api/admin/`)

- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/codes` - List codes with pagination
- `POST /api/admin/codes` - Create new code
- `PUT /api/admin/codes/[id]` - Update code
- `DELETE /api/admin/codes/[id]` - Delete code

**Pages** (`src/app/admin/`)

- `/admin/login` - Admin login page
- `/admin/dashboard` - Affiliate code management dashboard

---

## 📋 Admin Features

### Create Affiliate Code

- Manual code entry (auto-validated for format)
- Auto-generation if code field left empty
- Custom name/label (e.g., "Ahmed X", "Majed Dash")
- Owner name tracking

### Search & Filter

- Search by code, name, or owner
- Sort by creation date, clicks, or name
- Pagination support (10 codes per page)

### Analytics

- Click tracking per code
- Creation date display
- Visual formatting with badges

### Actions

- Copy code to clipboard
- Edit code details
- Delete codes with confirmation
- View detailed code analytics

---

## 🔐 Security Features

### Password Security

- Passwords hashed using PBKDF2 + salt (or bcrypt in production)
- Never stored in plain text
- 8+ character minimum

### API Protection

- JWT token required for all admin endpoints
- Token validation on each request
- 24-hour token expiration (configurable)
- HttpOnly cookies for token storage

### Input Validation

- Code format validation (3-50 chars, alphanumeric + hyphens)
- Email format validation
- Required field checks
- SQL injection protection via Prisma ORM

### Access Control

- Admin ownership verification
- Only admins can see/manage their own codes
- Logout functionality

---

## 🛠️ Environment Variables

Required in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/affiliate_db"
JWT_SECRET="your-secret-key-change-in-production"
ADMIN_SETUP_TOKEN="optional-token-for-additional-admin-creation"
NODE_ENV="development"
```

---

## 📱 Form Enhancements

The affiliate application form now features:

### Card-Based Selectors

- Platform selection with emoji icons
- Followers range with descriptions
- Content type with visual categories
- High contrast selected/unselected states
- Smooth hover and focus effects

### Input Components

- Enhanced input fields with icons
- Error display with validation
- Help text and descriptions
- Character counter for textarea
- Mobile responsive layout

### Form Validation

- Client-side validation with error display
- Server-side validation on submission
- Clear error messages (in Arabic)
- Success confirmation screen

---

## 🚀 Deployment Checklist

- [ ] Change `JWT_SECRET` to strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use bcrypt for password hashing (install: `npm install bcrypt`)
- [ ] Enable HTTPS in production
- [ ] Set up secure database backups
- [ ] Configure proper CORS settings
- [ ] Enable rate limiting on API endpoints
- [ ] Set up monitoring and alerting
- [ ] Create admin account securely
- [ ] Test all admin functionality
- [ ] Document admin credentials securely

---

## 📊 API Examples

### Login

```bash
POST /api/admin/login
{
  "username": "admin",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "admin": { "id": "uuid", "username": "admin" },
  "token": "eyJhbGc..."
}
```

### Create Code

```bash
POST /api/admin/codes
Authorization: Bearer {token}
{
  "code": "ahmed-x",
  "name": "Ahmed X",
  "owner": "Ahmed Mohammed"
}

Response:
{
  "success": true,
  "message": "تم إنشاء كود جديد بنجاح",
  "data": {
    "id": "uuid",
    "code": "ahmed-x",
    "name": "Ahmed X",
    "owner": "Ahmed Mohammed",
    "clicks": 0,
    "createdAt": "2026-04-15T10:00:00Z"
  }
}
```

### List Codes

```bash
GET /api/admin/codes?page=1&limit=10&search=ahmed&sortBy=createdAt&order=desc
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

## 🐛 Troubleshooting

### Admin Login Not Working

- Check database connection
- Verify JWT_SECRET is set
- Check credentials in database

### Form Not Submitting

- Verify all required fields are filled
- Check browser console for errors
- Verify /api/apply endpoint is working

### Dashboard Load Error

- Check authentication token
- Verify admin account exists
- Check database permissions

### Affiliate Code Not Generating

- Verify /lib/codes.ts functions
- Check for duplicate codes
- Verify database connection

---

## 📞 Support

For issues or questions, contact the development team.
