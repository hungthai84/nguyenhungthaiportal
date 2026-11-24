# Security Specification & Payload-First TDD (`security_spec.md`)

## 1. Data Invariants & Master Sources of Truth

1. **Default-Deny Baseline**: Every path outside explicitly declared collections (`/users/{userId}`, `/users/{userId}/wallpapers/{wallpaperId}`, `/inquiries/{inquiryId}`) is strictly denied for all reads and writes.
2. **Verified Identity Ownership**: Standard writes require an authenticated Firebase user with `request.auth.token.email_verified == true`.
3. **User Preferences (`/users/{userId}`)**:
   - Only the owner (`request.auth.uid == userId`) can `get`, `create`, `update`, or `delete` their own preferences document. `list` queries on `/users` are disallowed (`allow list: if false;`).
   - `uid` must match `request.auth.uid` and remain immutable after creation.
   - `createdAt` must equal `request.time` on creation and remain immutable on updates; `updatedAt` must equal `request.time` on both create and update.
4. **Custom Wallpapers (`/users/{userId}/wallpapers/{wallpaperId}`)**:
   - Subcollection cannot exist or be mutated unless the parent `/users/{userId}` document exists and its `uid` matches `request.auth.uid` (Master Gate via `get()` on `get`, `create`, `update`, `delete`).
   - `list` queries enforce `isSignedIn() && isOwner(userId) && resource.data.ownerId == request.auth.uid` with zero `get()`/`exists()` calls (Pillar 8 Cost-Optimization Clause).
   - `ownerId` and `createdAt` are immutable after creation.
5. **Contact Inquiries (`/inquiries/{inquiryId}`)**:
   - Only verified authenticated users may create an inquiry, and `authorId` must equal `request.auth.uid`.
   - Initial `status` MUST be `'submitted'`.
   - Once `status` becomes `'archived'`, the document enters a **terminal state** and cannot be mutated by further `update` requests.
   - `tags` is strictly bounded (`tags is list && tags.size() <= 5`, and when non-empty `tags[0] is string && tags[0].size() >= 1 && tags[0].size() <= 32`).
   - All single-document operations validate path IDs via `isValidId(id)` (`^[a-zA-Z0-9_\-]+$`, max 128 chars).

---

## 2. The "Dirty Dozen" Adversarial Payloads

| # | Target Collection | Attack Vector | Malicious Payload / Context | Expected Result |
|---|------------------|---------------|-----------------------------|-----------------|
| 1 | `/users/userA` | **Identity Spoofing** | `uid: "userB"` while authenticated as `userA` | `PERMISSION_DENIED` |
| 2 | `/users/userA` | **Unverified Email Bypass** | Valid `userA` doc with `auth.token.email_verified: false` | `PERMISSION_DENIED` |
| 3 | `/users/userA` | **Shadow / Ghost Field** | Valid `userA` payload + extra `{ "isAdmin": true }` | `PERMISSION_DENIED` |
| 4 | `/users/userA` | **Client Timestamp Forgery** | `createdAt: "2020-01-01T00:00:00Z"` instead of `request.time` | `PERMISSION_DENIED` |
| 5 | `/users` | **Collection Enumeration** | `list` query on `/users` by signed-in `userA` | `PERMISSION_DENIED` |
| 6 | `/users/userA/wallpapers/wp1` | **Orphaned Subcollection Write** | Creating wallpaper before parent `/users/userA` exists | `PERMISSION_DENIED` |
| 7 | `/users/userA/wallpapers/bad..id` | **Path Variable Poisoning** | Document ID containing `/` or `..` or >128 chars | `PERMISSION_DENIED` |
| 8 | `/inquiries/inq1` | **Initial State Shortcutting** | Creating inquiry directly with `status: "archived"` | `PERMISSION_DENIED` |
| 9 | `/inquiries/inq1` | **Cross-Tenant Read/Update** | `userB` calling `get` or `update` on `userA`'s inquiry | `PERMISSION_DENIED` |
| 10 | `/inquiries/inq1` | **Terminal State Mutation** | Updating `message` after inquiry `status` is already `'archived'` | `PERMISSION_DENIED` |
| 11 | `/inquiries/inq1` | **Denial-of-Wallet Oversize Payload** | `message` string of 20,000 characters (>1500 limit) | `PERMISSION_DENIED` |
| 12 | `/inquiries/inq1` | **Value Poisoning & Unbounded Array** | Update changing `tags` to `[123, 456, ...10 items]` (`tags[0]` non-string / `size() > 5`) | `PERMISSION_DENIED` |
