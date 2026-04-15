# 🚀 Quick API Reference

## Base URL

```
http://localhost:3000/api
```

---

## 1️⃣ Affiliate Application

### POST `/apply`

Submit a new affiliate application

**cURL:**

```bash
curl -X POST http://localhost:3000/api/apply \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Gaming",
    "email": "ahmed@gaming.com",
    "phone": "+966501234567",
    "country": "SA",
    "contentType": "streaming",
    "experience": "experienced",
    "motivation": "I have 50K followers on Twitch",
    "socialLinks": {
      "twitch": "https://twitch.tv/ahmed",
      "youtube": "https://youtube.com/@ahmed"
    }
  }'
```

**JavaScript/TypeScript:**

```typescript
const response = await fetch("/api/apply", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Ahmed Gaming",
    email: "ahmed@gaming.com",
    contentType: "streaming",
    experience: "experienced",
    motivation: "I have followers...",
    socialLinks: { twitch: "https://..." },
  }),
});

const data = await response.json();
console.log(data);
```

---

## 2️⃣ Track Clicks

### POST `/track/click`

Record when a user clicks an affiliate link

**When to call:** When user clicks the link with affiliate code

**cURL:**

```bash
curl -X POST http://localhost:3000/api/track/click \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AFF-AHMED10",
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }'
```

**JavaScript:**

```typescript
// On your game store, when user clicks affiliate link
const trackClick = async (affiliateCode) => {
  const response = await fetch("/api/track/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: affiliateCode,
      ip: userIp,
      userAgent: navigator.userAgent,
    }),
  });

  const { discount } = await response.json();
  return discount; // 0.1 = 10% discount
};
```

---

## 3️⃣ Track Sales

### POST `/track/sale`

Record completed purchase with affiliate commission

**When to call:** After payment is confirmed

**cURL:**

```bash
curl -X POST http://localhost:3000/api/track/sale \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AFF-AHMED10",
    "orderId": "order-12345",
    "amount": 99.99
  }'
```

**JavaScript:**

```typescript
// In your payment success handler
const trackSale = async (affiliateCode, orderId, amount) => {
  const response = await fetch("/api/track/sale", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: affiliateCode,
      orderId, // Must be unique
      amount, // e.g., 99.99
    }),
  });

  const result = await response.json();
  console.log(`Commission: $${result.sale.commission}`);
};
```

---

## 4️⃣ Admin: List Affiliates

### GET `/affiliates?status=PENDING&page=1&limit=20`

Get affiliates with optional filters

**Query Params:**

- `status`: `PENDING` | `APPROVED` | `REJECTED` (optional)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)

**cURL:**

```bash
curl "http://localhost:3000/api/affiliates?status=PENDING&page=1&limit=10"
```

**JavaScript:**

```typescript
const getAffiliates = async (status = "PENDING", page = 1) => {
  const response = await fetch(
    `/api/affiliates?status=${status}&page=${page}&limit=20`,
  );
  const { data, pagination } = await response.json();

  console.log(`Found ${pagination.total} affiliates`);
  data.forEach((aff) => {
    console.log(`${aff.name}: ${aff.totalEarnings} earned`);
  });
};
```

---

## 5️⃣ Admin: Get Affiliate Details

### GET `/affiliates/[id]`

Get full details of one affiliate with recent activity

**cURL:**

```bash
curl "http://localhost:3000/api/affiliates/550e8400-e29b-41d4-a716-446655440000"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Ahmed",
    "email": "ahmed@email.com",
    "affiliateCode": "AFF-AHMED10",
    "status": "PENDING",
    "totalClicks": 42,
    "totalSales": 5,
    "totalEarnings": 50.0,
    "contentType": "streaming",
    "experience": "intermediate",
    "motivation": "I have 50K followers...",
    "country": "SA",
    "socialLinks": {
      "twitch": "https://twitch.tv/ahmed",
      "youtube": "https://youtube.com/@ahmed"
    },
    "clicks": [
      {
        "id": "click-1",
        "createdAt": "2026-04-15T10:00:00Z",
        "ip": "192.168.1.1"
      }
    ],
    "sales": [
      {
        "id": "sale-1",
        "orderId": "order-123",
        "amount": 10.0,
        "commission": 1.0,
        "createdAt": "2026-04-15T10:30:00Z"
      }
    ],
    "createdAt": "2026-04-14T15:00:00Z",
    "approvedAt": null
  }
}
```

---

## 6️⃣ Admin: Approve Application

### POST `/affiliates/[id]`

Approve affiliate with optional custom code

**Request:**

```json
{
  "action": "approve",
  "customCode": "AHMED10"
}
```

**cURL:**

```bash
curl -X POST "http://localhost:3000/api/affiliates/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve",
    "customCode": "AHMED10"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "تم الموافقة على المسوّق",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "APPROVED",
    "affiliateCode": "AHMED10",
    "approvedAt": "2026-04-15T10:00:00Z"
  }
}
```

---

## 7️⃣ Admin: Reject Application

### POST `/affiliates/[id]`

Reject affiliate with reason

**Request:**

```json
{
  "action": "reject",
  "rejectionReason": "Followers count too low"
}
```

**cURL:**

```bash
curl -X POST "http://localhost:3000/api/affiliates/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "reject",
    "rejectionReason": "Followers count too low"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "تم رفض المسوّق",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "REJECTED",
    "rejectionReason": "Followers count too low"
  }
}
```

---

## 📊 Data Flow Example

### Complete User Journey

```
1. USER APPLIES (Public)
   POST /api/apply
   → Affiliate created with status=PENDING
   → Auto-generated code: AFF-AHMED123

2. ADMIN REVIEWS (Admin Dashboard)
   GET /api/affiliates?status=PENDING
   → Admin sees Ahmed's application

3. ADMIN APPROVES (Admin Dashboard)
   POST /api/affiliates/[id]
   → Status changed to APPROVED
   → Code updated to custom "AHMED10"

4. USER GETS CODE (Member Area)
   → Shows code: "AHMED10"
   → Can create referral links

5. CUSTOMER CLICKS LINK (Your Store)
   POST /api/track/click
   → Logs click with affiliate code
   → totalClicks incremented

6. CUSTOMER BUYS (Checkout)
   POST /api/track/sale
   → Records sale: amount=$99.99
   → Commission: $10.00 (10%)
   → totalEarnings incremented

7. AFFILIATE SEES EARNINGS (Member Area)
   → Updated in real-time
   → Can track clicks → sales → commission
```

---

## 🔑 Important Notes

### Commission Calculation

```
commission = amount × 0.10  // 10% flat rate
Example: $99.99 purchase → $9.99 commission
```

### Affiliate Code Format

```
// Auto-generated:
AFF-[5 chars from name][4 random alphanumeric]
Example: AFF-AHMED10 or AFF-GAMEX23Q

// Custom (admin can set):
Any string 3-20 characters, alphanumeric + hyphens
Example: AHMED10, GAMER-X, etc.
```

### Error Handling

```
400: Invalid input (missing required fields, invalid email, etc.)
409: Email already registered / Code already taken
404: Affiliate not found
500: Server error
```

### Success Indicators

```json
{
  "success": true,
  "message": "عملية ناجحة",
  "data": {
    /* response data */
  }
}
```

Error Indicators

```json
{
  "error": "وصف الخطأ",
  "details": [
    /* validation errors */
  ]
}
```

---

## 🧪 Testing

### Test Affiliate Flow

```bash
# 1. Apply
APPLY_RESPONSE=$(curl -s -X POST http://localhost:3000/api/apply \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "contentType":"videos",
    "experience":"beginner",
    "motivation":"Testing"
  }')

AFFILIATE_ID=$(echo $APPLY_RESPONSE | jq -r '.affiliate.id')
echo "Created affiliate: $AFFILIATE_ID"

# 2. Approve
curl -s -X POST "http://localhost:3000/api/affiliates/$AFFILIATE_ID" \
  -H "Content-Type: application/json" \
  -d '{"action":"approve"}'

# 3. Test Click
curl -s -X POST http://localhost:3000/api/track/click \
  -H "Content-Type: application/json" \
  -d '{"code":"AFF-TEST123","ip":"127.0.0.1"}'

# 4. Test Sale
curl -s -X POST http://localhost:3000/api/track/sale \
  -H "Content-Type: application/json" \
  -d '{"code":"AFF-TEST123","orderId":"order-1","amount":100}'
```

---

## 🐛 Common Issues

| Issue               | Solution                                                |
| ------------------- | ------------------------------------------------------- |
| 404 on `/api/apply` | Ensure API route exists in `src/app/api/apply/route.ts` |
| 400 Invalid email   | Use valid email format (user@domain.com)                |
| 409 Email exists    | Use different email, or check existing affiliates       |
| DATABASE_URL error  | Check `.env` file has valid PostgreSQL connection       |
| Prisma error        | Run `npx prisma generate`                               |

---

✨ **System ready for production!**
