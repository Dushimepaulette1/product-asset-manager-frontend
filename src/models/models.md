# Data Models

This file documents the shape of the core data in this app: **Product**, **Variant**, **Asset**, and **Readiness**.

Nothing here is real code yet — the whole frontend runs on mocked data and mocked services for now (see `productService`, `variantService`, `assetService`, `readinessService` in the project requirements). This doc is the agreed-upon shape that all of those mocked services, and every page that uses them, should follow.

---

## Product

A Product is the top-level thing being managed — e.g. "Men's Classic Tee". It can have many Variants (colour/size options) and many Assets (photos, videos, docs).

| Field | Required? | Purpose |
|---|---|---|
| `id` | required | Unique identifier for the product. |
| `name` | required | The product's display name, e.g. "Men's Classic Tee". |
| `productCode` | required | A short internal code/SKU-style identifier used to search/filter products. |
| `description` | required | Longer text describing the product. |
| `brand` | required | Which brand this product belongs to (used for filtering on the product list page). |
| `category` | required | What kind of product it is, e.g. "T-Shirts", "Footwear" (also used for filtering). |
| `targetMarket` | required | Who the product is aimed at, e.g. "Men", "Kids". |
| `seasonOrCollection` | required | Which season or collection it's part of, e.g. "Summer 2026". |
| `status` | required | Where the product is in its lifecycle. See **Product status** below. |
| `createdAt` | required | Timestamp of when the product was first created. |
| `updatedAt` | required | Timestamp of the last time the product was edited. |

### Product status

A Product's `status` is always one of these five values:

| Value | Meaning |
|---|---|
| `DRAFT` | Just created, still being worked on. Not submitted for review yet. |
| `IN_REVIEW` | Submitted, waiting on someone to check it over. |
| `READY_TO_PUBLISH` | Passed review and meets all readiness requirements — just needs the "publish" action. |
| `PUBLISHED` | Live. |
| `ARCHIVED` | No longer active, pulled from use. |

A product moves through these left to right, though it could be archived from most states.

---

## Variant

A Variant is one specific version of a Product — e.g. the "Red / Large" version of "Men's Classic Tee". A Product can have many Variants.

| Field | Required? | Purpose |
|---|---|---|
| `id` | required | Unique identifier for the variant. |
| `productId` | required | Which Product this variant belongs to. |
| `name` | required | A display name for the variant, e.g. "Red / Large". |
| `variantCode` | required | Short internal code for this specific variant. |
| `colour` | required | The variant's colour. |
| `size` | required | The variant's size. |
| `material` | required | What it's made of. |
| `barcode` | **optional** | Barcode for the variant, if one exists — not every variant is barcoded yet. |
| `createdAt` | required | Timestamp of when the variant was created. |

---

## Asset

An Asset is an uploaded file — a photo, video, document, or 3D model — tied to a Product, and optionally to one specific Variant of that product.

| Field | Required? | Purpose |
|---|---|---|
| `id` | required | Unique identifier for the asset. |
| `productId` | required | Which Product this asset belongs to. |
| `variantId` | **optional / nullable** | Which Variant this asset belongs to, if it's variant-specific. If it's `null`, the asset applies to the whole product rather than one variant. |
| `fileName` | required | The original file name. |
| `fileUrl` | required | Where the file lives / can be loaded from. |
| `assetType` | required | What kind of file this is. See **Asset type** below. |
| `title` | required | A human-friendly title for the asset. |
| `description` | required | What the asset shows or is for. |
| `tags` | required | Keywords for searching/filtering the asset library. |
| `status` | required | Where the asset is in the review process. See **Asset status** below. |
| `rejectionReason` | **optional / nullable** | Why the asset was rejected. Only set when `status` is `REJECTED`. |
| `statusHistory` | required | A record of status changes over time (e.g. pending → approved), so you can see who/when an asset was reviewed. |
| `uploadedAt` | required | Timestamp of when the asset was uploaded. |

### Asset status

| Value | Meaning |
|---|---|
| `PENDING_REVIEW` | Just uploaded, waiting for someone to approve or reject it. |
| `APPROVED` | Reviewed and accepted. |
| `REJECTED` | Reviewed and turned down — `rejectionReason` should explain why. |

### Asset type

| Value | Meaning |
|---|---|
| `IMAGE` | A photo. |
| `VIDEO` | A video file. |
| `DOCUMENT` | A document, e.g. a spec sheet or PDF. |
| `3D_MODEL` | A 3D model file. |

---

## How they relate

- **Product → Variant**: one-to-many. One product can have many variants; each variant belongs to exactly one product (`Variant.productId`).
- **Product → Asset**: one-to-many. One product can have many assets; each asset belongs to exactly one product (`Asset.productId`).
- **Variant → Asset**: optional link. An asset can belong to one specific variant (`Asset.variantId` set), or it can be product-level and not tied to any variant (`Asset.variantId` is `null`). An asset always belongs to a product either way.

---

## Readiness

Readiness answers one question for a given product: **is it ready to be published?** It's built from a checklist of requirements, each of which is either done or not.

| Field | Required? | Purpose |
|---|---|---|
| `productId` | required | Which product this readiness check is for. |
| `requirements` | required | A list of checklist items, each shaped as `{ label, isComplete }` — `label` is what's required (e.g. "At least one approved image"), `isComplete` is whether it's been met. |
| `canPublish` | required | `true` only if every item in `requirements` is complete. This is what gates the "Publish" action on the product detail page. |
