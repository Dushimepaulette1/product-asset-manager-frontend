# Data Models

This file documents the shape of the core data in this app: **Category**, **Product**, **Variant**, and **User** (plus the mocked JWT payload shape used for auth).

Nothing here is real code yet — the whole frontend runs on mocked data and mocked services for now. This doc is the agreed-upon shape that all of those mocked services, and every page that uses them, should follow.

---

## Category

| Field | Required? | Purpose |
|---|---|---|
| `id` | required | Unique identifier for the category. |
| `name` | required | Display name, e.g. "Footwear". |

---

## Product

| Field | Required? | Purpose |
|---|---|---|
| `id` | required | Unique identifier for the product. |
| `name` | required | The product's display name. |
| `description` | required | Longer text describing the product. |
| `categoryId` | required | Which Category this product belongs to. |
| `categoryName` | required | The category's display name, kept alongside `categoryId` so the Product Listing/Detail pages can show it without a separate lookup. |
| `createdAt` | required | Timestamp of when the product was first created. |
| `updatedAt` | required | Timestamp of the last time the product was edited. |

---

## Variant

A Variant is one specific purchasable version of a Product (e.g. a size/style) — this is what actually gets bought, has a price, and has stock.

| Field | Required? | Purpose |
|---|---|---|
| `id` | required | Unique identifier for the variant. |
| `productId` | required | Which Product this variant belongs to. |
| `name` | required | Display name for the variant, e.g. "Medium / Blue". |
| `sku` | required | Stock-keeping unit code, unique per variant. |
| `price` | required | Price for this specific variant. |
| `stockQuantity` | required | How many units are currently available. |
| `stockStatus` | required, **derived** | Not stored directly — calculated from `stockQuantity` every time it's needed. See below. |
| `isActive` | required, defaults to `true` | Whether this variant is currently sellable/visible. An inactive variant is hidden from the public even if it has stock. |

### Stock status derivation

`stockStatus` is never set directly — it's always computed from `stockQuantity` at read time, using these thresholds:

| `stockQuantity` | `stockStatus` |
|---|---|
| `0` | `OUT_OF_STOCK` |
| `1`–`10` | `LOW_STOCK` |
| `11` and above | `IN_STOCK` |

Assumption flagged: the capstone brief mentions a "Shared Data Model Reference" for these exact thresholds that wasn't provided to me — I've picked `0` / `1–10` / `11+` as a reasonable default. Adjust these two numbers here if the real reference says otherwise; nothing else about the model changes.

---

## User

| Field | Required? | Purpose |
|---|---|---|
| `id` | required | Unique identifier for the user. |
| `name` | required | Display name. |
| `email` | required | Used to log in. |
| `password` | required (mock only) | Plaintext only because this is mocked frontend data with no real backend yet — never do this for real. |
| `role` | required | Either `USER` or `ADMIN`. Controls what the UI shows/allows. |

### Mock JWT payload

Login doesn't hit a real backend yet, but the mocked auth service should still hand back a token-shaped payload so the rest of the app (route protection, navbar) can be built against the real shape from day one:

| Claim | Purpose |
|---|---|
| `sub` | The user's `id`. |
| `email` | The user's email. |
| `role` | `USER` or `ADMIN` — this is what role-based UI/route protection reads. |
| `exp` | Expiry timestamp for the mock session. |

---

## How they relate

- **Category → Product**: one-to-many. One category can have many products; each product belongs to exactly one category (`Product.categoryId`).
- **Product → Variant**: one-to-many. One product can have many variants; each variant belongs to exactly one product (`Variant.productId`). A variant is what a user actually buys.
