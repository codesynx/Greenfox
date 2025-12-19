# GreenFox API (v1)

**Base URL (dev):** `https://greenfox-backend.onrender.com/` 
**Prefix:** `/api/v1` 

## Auth

**Bearer JWT** in header:

```http
Authorization: Bearer <accessToken>
```

Most user/admin endpoints require this. 

## Response envelope (common)

Almost everything returns:

```json
{
  "success": true,
  "message": "string",
  "data": {},
  "timestamp": "date-time",
  "error": { "code": "string", "message": "string", "details": {} }
}
```

`data` shape depends on endpoint. 

## Pagination (common)

Endpoints that list things accept `pageable` (query object):

* `page` (int, >=0)
* `size` (int, >=1)
* `sort` (string[]) 

---

# Authentication (OTP)

## Send OTP

`POST /auth/send-otp`

```json
{ "phoneNumber": "+77001234567" }
```

Returns `data`: `{ phoneNumber, expiresInSeconds, retryAfterSeconds, message }` 

## Resend OTP (throttled)

`POST /auth/resend-otp`

```json
{ "phoneNumber": "+77001234567" }
```

Returns same shape as send. 

## Verify OTP (login / auto-register)

`POST /auth/verify-otp`

```json
{ "phoneNumber": "+77001234567", "code": "1234" }
```

Returns `data`:

```json
{
  "userId": "uuid",
  "phoneNumber": "string",
  "name": "string",
  "role": "ADMIN|USER",
  "newUser": true,
  "accessToken": "jwt",
  "refreshToken": "jwt",
  "expiresIn": 123456789
}
```



## Refresh tokens

`POST /auth/refresh`

```json
{ "refreshToken": "jwt" }
```

Returns same `AuthResponse` as verify. 

---

# Users

## Get my profile (JWT)

`GET /users/profile`

Returns `data`:
`{ id, phoneNumber, name, email, avatarUrl, role, createdAt }` 

## Update my profile (JWT)

`PATCH /users/profile`

```json
{
  "name": "Aibek Nurlan",
  "email": "aibek@example.kz",
  "avatarUrl": "https://..."
}
```

Phone number cannot be changed. 

## Save device token (push) (JWT)

`POST /users/device-token`

```json
{ "deviceToken": "f7e...9a2" }
```



---

# Resorts (Public)

## List resorts

`GET /resorts`

Query params:

* `city` (string, optional)
* `minPrice` (number, optional)
* `maxPrice` (number, optional)
* `guests` (int, optional)
* `query` (string, optional; name/city search)
* `lat` / `lng` (number, optional; affects sorting by distance)
* `pageable` (required) 

Returns paged `data.content[]` items (compact):
`{ id, name, city, basePrice, rating, reviewsCount, mainPhotoUrl, promo, promoPrice, maxGuests, distanceKm }` 

## Resort details

`GET /resorts/{id}` (id = uuid)

Returns full `ResortResponse`:
`{ id, name, city, description, latitude, longitude, address, basePrice, rating, reviewsCount, amenities[], photos[], maxGuests, promo, promoDiscountPercent, promoPrice, createdAt }` 

## Cities list

`GET /resorts/cities`

Returns `data: string[]` 

---

# Promos (Public)

## Active promos (homepage banners)

`GET /promos`

Returns `data[]` promo objects:
`{ id, resortId, resortName, resortCity, discountPercent, startDate, endDate, bannerImageUrl, title, description, originalPrice, promoPrice, active }` 

---

# Bookings (JWT)

## Calculate price (no booking created)

`POST /bookings/calc`

```json
{
  "resortId": "uuid",
  "checkInDate": "YYYY-MM-DD",
  "checkOutDate": "YYYY-MM-DD",
  "adults": 2,
  "children": 1
}
```

Returns `data`:
`{ resortId, resortName, checkInDate, checkOutDate, nights, adults, children, basePricePerNight, baseTotal, discountPercent, discountAmount, totalPrice, hasPromo, available, unavailableReason }` 

## Create booking (returns Kaspi deep link)

`POST /bookings`

```json
{
  "resortId": "uuid",
  "checkInDate": "YYYY-MM-DD",
  "checkOutDate": "YYYY-MM-DD",
  "adults": 2,
  "children": 1,
  "guestFullName": "Нұрлан Әлібек",
  "idNumber": "990101350123",
  "idType": "IIN|PASSPORT",
  "phoneNumber": "+77001234567",
  "email": "optional",
  "specialRequests": "optional"
}
```

Returns `data`:
`{ id, resortId, resortName, resortCity, resortPhotoUrl, checkInDate, checkOutDate, nights, adults, children, guestInfo{...}, basePrice, discountPercent, discountAmount, totalPrice, status, kaspiDeepLink, paymentRequired, createdAt, paymentConfirmedAt }` 

## Confirm payment (temporary simulation)

`POST /bookings/{id}/pay` (id = uuid)

Returns updated `BookingResponse`.
Note: spec says real prod flow should be Kaspi webhook. 

## Get booking details

`GET /bookings/{id}` (id = uuid)

Returns `BookingResponse`. 

## My bookings (history)

`GET /bookings/my` + `pageable` (required)

Returns paged `BookingResponse` list. 

---

# Notifications (JWT)

## List notifications

`GET /notifications` + `pageable` (required)

Returns paged `NotificationResponse`:
`{ id, type, title, message, referenceId, referenceType, read, createdAt }` 

## Unread count

`GET /notifications/unread-count`

Returns `data` as a map (string -> long). 

## Mark all read

`POST /notifications/mark-all-read`

Returns void envelope. 

---

# Support (JWT)

## Send message to support

`POST /support/message`

```json
{ "message": "string (1..5000)" }
```

Returns `SupportMessageResponse`:
`{ id, message, fromAdmin, adminName, read, createdAt }` 

## My chat history

`GET /support/history` + `pageable` (required)

Returns paged `SupportMessageResponse`. 

---

# Admin (JWT, role=ADMIN)

## Support inbox: unread count

`GET /admin/support/unread-count`

Returns map (string -> long). 

## Support inbox: conversations list

`GET /admin/support/conversations`

Returns `data[]`:
`{ conversationId, userId, userPhone, userName, lastMessage, lastFromAdmin, unreadCount, lastActivityAt }` 

## Conversation messages by user

`GET /admin/support/conversations/{userId}` + `pageable` (required)

Returns paged `SupportMessageResponse`. 

## Reply to user

`POST /admin/support/{userId}/reply`

```json
{ "message": "string (1..5000)" }
```

Returns `SupportMessageResponse`. 

---

# Admin Resorts (JWT)

## List all resorts (including inactive)

`GET /admin/resorts` + `pageable` (required)

Returns paged `ResortResponse`. 

## Create resort

`POST /admin/resorts`

```json
{
  "name": "string",
  "city": "string",
  "description": "optional",
  "latitude": 43.12,
  "longitude": 77.07,
  "address": "optional",
  "basePrice": 25000,
  "rating": 4.5,
  "reviewsCount": 127,
  "amenities": ["WiFi","Pool"],
  "maxGuests": 6
}
```

Returns `ResortResponse`. 

## Update resort

`PATCH /admin/resorts/{id}` (id=uuid)
Body = `UpdateResortRequest` (similar fields; plus `active` boolean). 

## Delete resort (soft delete)

`DELETE /admin/resorts/{id}` 

## Add photos (max 15 total)

`POST /admin/resorts/{id}/photos`
Body is an array:

```json
[
  { "url": "https://...", "description": "optional", "order": 0 }
]
```

Returns updated `ResortResponse`. 

## Remove photo by order index

`DELETE /admin/resorts/{id}/photos/{order}` (order=int)

Returns updated `ResortResponse`. 

---

# Admin Promos (JWT)

## List all promos (active+inactive)

`GET /admin/promos` + `pageable` (required)

Returns paged `PromoResponse`. 

## Create promo

`POST /admin/promos`

```json
{
  "resortId": "uuid",
  "discountPercent": 15,
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "bannerImageUrl": "optional",
  "title": "optional",
  "description": "optional"
}
```

Returns `PromoResponse`. 

## Delete promo

`DELETE /admin/promos/{id}` 

---

# Admin Bookings (JWT)

## List all bookings (optional status filter)

`GET /admin/bookings`

Query:

* `status` optional: `PENDING | PAID_WAITING | CONFIRMED | COMPLETED | CANCELLED`
* `pageable` required 

Returns paged `BookingResponse`. 

## Update booking status

`PATCH /admin/bookings/{id}/status`

```json
{
  "status": "CONFIRMED|COMPLETED|CANCELLED",
  "adminNotes": "optional"
}
```

Returns updated `BookingResponse`. 

