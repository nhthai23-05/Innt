# Phase 0.7 — Open Decisions

## Decision 1: Product Count (19 vs 23)

**Issue**: SPEC claims 23 products, but `data/products.json` currently has **19 products**.

**Data-Driven Facts**:
- Verified count: 19 products across 7 categories
- Products: Phong bì (4), Tờ rơi (2), Tờ gấp (3), Túi giấy (3), Tem nhãn (3), Biểu mẫu (3), Danh thiếp (1)

**Options**:

### Option A: Proceed with 19 products ✅ RECOMMENDED
- Rationale: Data is clean; no pressure to invent products
- SPEC adjustment: Update SPEC.md to reflect 19 products
- Impact: Test set coverage targets scale proportionally
- Decision phase: Go with 19

### Option B: Add 4 products to reach 23
- Requires: Identify which product categories are missing
- Candidates: 
  - More Danh thiếp variants (currently 1)
  - Sticker/printing variants
  - Project-specific custom products
- Impact: Higher data collection effort for Phase 1-2

### Option C: Add products in Phase 5+ (defer decision)
- Allows website launch with 19 products
- Phase 7-8 can add new products if needed
- Lower migration risk

## Decision 2: Contact Information (business.json)

**Issue**: `data/business.json` Contact doc has empty fields:
- `address`: ""
- `hotline`: ""
- `email`: ""

**Current State**: Placeholder filled with `[TO_BE_FILLED: ...]`

**Action Required**: Team must provide real values:
- Công ty TNHH In N&T's office address
- Hotline/phone number for Zalo contact
- Email address for inquiries

**Impact**: 
- Phase 3+: Chat widget will display these in redirect messages
- Phase 4+: Contact page uses these fields
- Decision deadline: Before Phase 3 (API wiring)

## Decision 3: Image Hosting Strategy

**Current State**: 
- Cloudinary URLs: 18/19 products have images hosted
- Local backup: Empty (`data/images/` is for CLIP only)
- Frontend: Will fetch from Cloudinary

**Strategy**: 
- ✅ Phase 5 (Website): Use Cloudinary URLs directly
- ⚠️ Phase 7 (Multimodal): Download to `data/images/` for CLIP preprocessing
- Backup: Create `images_backup/` if Cloudinary becomes inaccessible

**Action**: 
- Verify all Cloudinary URLs work (spot check)
- Team decision: Local backup needed before Phase 5?

---

## Checkpoint A — Team Review Required

Team must decide on the above **before Phase 1 starts**:

1. **Product Count**: Keep 19? Add 4 more? Or defer?
2. **Contact Info**: Provide real values for business.json
3. **Images**: Confirm Cloudinary strategy or request backup

Recommend: **Option A (19 products) + provide contact info + proceed with Cloudinary**

---

## Decisions Made (Phase 0 Checkpoint A) ✅

- [x] 0.1: Normalize products.json ✅
- [x] 0.2: Normalize business.json ✅
- [x] 0.3: Create categories.json ✅
- [x] 0.4: Image plan documented ✅
- [x] 0.5: Config defaults set to "dense" ✅
- [x] 0.6: Backend README with CPU torch ✅
- [ ] 0.7: Product count decision — AWAITING TEAM INPUT
- [ ] Contact info — AWAITING TEAM INPUT
