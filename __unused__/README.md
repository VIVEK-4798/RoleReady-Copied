# Unused Files Quarantine

**Date:** February 1, 2026  
**Commit:** 0162d9c  
**Files Moved:** 477 files  
**Size:** 1.16 MB

## What's Here

This directory contains unused page variants and components that were commented out in `App.jsx` and moved here to reduce project size while keeping them reversible.

## Quarantined Items

### Pages (src/pages)
- **homes/**: home_1, home_2, home_3, home_4, home_6, home_7, home_8, home_9, home_10 (9 variants)
- **hotel/**: hotel-list-v1, v2, v3, v5, hotel-single-v2, booking-page (6 variants)
- **tour/**: tour-list-v1, tour-list-v3 (2 variants)
- **activity/**: All activity pages (4 folders)
- **rental/**: All rental pages (4 folders)
- **car/**: All car pages (4 folders)
- **cruise/**: All cruise pages (4 folders)
- **flight/**: All flight pages (1 folder)

### Components (src/components)
- **home/**: home-1 through home-10 (9 variants)
- **hero/**: hero-1 through hero-10 (9 variants)
- **header/**: header-1 through header-11 (10 variants)
- **footer/**: footer-2, footer-3, footer-5, footer-6, footer-7, footer-8 (6 variants)
- **Plus all related components**: activity-list, car-list, cruise-list, flight-list, hotel-list, rental-list, tour-list, etc.

## Currently In Use

✅ **Pages:**
- home_5 (main homepage)
- hotel-list-v4
- hotel-single-v1
- tour-list-v2
- tour-single

✅ **Components:**
- home-5
- hero-5
- header-5, default-header, dashboard-header
- footer-4, default footer

## How to Restore

If you need any of these files back:

1. **Restore specific folder:**
   ```powershell
   Move-Item "__unused__\pages\homes\home_1" "src\pages\homes\"
   ```

2. **Uncomment in App.jsx:**
   - Find the commented import
   - Remove the `//` or `/* */`
   - Uncomment the corresponding route

3. **Test the app**

4. **Commit the restore:**
   ```bash
   git add -A
   git commit -m "restore: bring back home_1"
   ```

## Next Steps (Optional Phase 5)

After 2-3 commits and stable testing, you can permanently delete this `__unused__` folder if confident everything works without these files.

**Before deleting:**
- Test all core user flows
- Verify no broken links or missing imports
- Tag a release: `git tag v1.0-cleanup`

---

**Note:** This cleanup saved ~1.16 MB and removed 477 files from active development, making the project lighter and easier to navigate.
