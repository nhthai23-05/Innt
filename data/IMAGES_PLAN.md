# Phase 0.4 — Image Management Plan

## Current Status
- ✅ Products have `generation_enhancers.image_url` pointing to **Cloudinary URLs** 
- ✅ Most products have 2+ images per product already hosted
- ⚠️ `data/images/` folder is empty (local reference for CLIP preprocessing only)

## Strategy

### For Webpage Display (Phase 5)
- **Use Cloudinary URLs directly** from `products.json`
- No local images needed; frontend fetches from Cloudinary
- Fallback: `ImageWithFallback.tsx` will gracefully handle broken URLs

### For Multimodal CLIP (Phase 7)
- Download reference images from Cloudinary to `data/images/{product_id}.jpg`
- **Critical**: CLIP needs local JPEG files to build embeddings for image matching
- Naming convention: `{product_id}.jpg` (e.g., `phong-bi-a5.jpg`, `to-gap-doi.jpg`)

### For Development & Testing
If Cloudinary URLs become unavailable:
1. Create an `images_backup/` folder with local copies
2. Update `data/products.json` `image_url` to point to local paths
3. Update frontend `ImageWithFallback` to check both sources

## Implementation Timeline
- **Phase 0.4**: Create placeholder structure + document strategy
- **Phase 5** (Website): Test Cloudinary URLs; no changes needed
- **Phase 7** (Multimodal): Download images to `data/images/` for CLIP preprocessing

## Action Items for Team
1. ✅ Verify all Cloudinary URLs are accessible (18/19 products have URLs)
2. ⚠️ **Action**: Confirm image hosting strategy before Phase 7
3. ⚠️ **Action**: If local backup needed, download from Cloudinary and commit to `images_backup/`
