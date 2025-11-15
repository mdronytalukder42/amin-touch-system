# AMIN TOUCH System Enhancement Plan

## Current System Analysis

**Technology Stack:**
- Frontend: React 19 + Wouter (routing) + TailwindCSS + Radix UI
- Backend: Express + tRPC
- Database: MySQL + Drizzle ORM
- Authentication: Custom session-based auth with cookies

**Existing Features:**
- User authentication with admin/staff roles
- Income/OTP entry tracking
- Basic ticket management
- Dashboard views for admin and staff

## Required Enhancements

### 1. Ticket Management Improvements
- ✅ Add `source` field (already exists in schema)
- ✅ Add ticket file upload (already implemented)
- Add download functionality for uploaded tickets
- Make PNR clickable to airline "Manage My Trip" pages
- Enable staff to edit/delete their own ticket entries

### 2. Search Functionality
- ✅ Backend search already implemented
- Add search UI on both admin and staff pages
- Search by passenger name or PNR
- Real-time search results

### 3. Income Entry Enhancement
- Add "Received Money" entry type
- Add "Received From" field for tracking money source

### 4. UI/UX Enhancements
- Implement dark theme as default
- Add 3D animated background with rotating images
- Add company logo to all pages
- Improve overall visual design

### 5. User Management
- Set up demo user accounts:
  - Admin: AL AMIN (admin9197 / Admin9197)
  - Staff: RONY TALUKDER (ronytalukder / @jead2016R)
  - Staff: MAHIR (mahir / Mahir3)
  - Staff: SAKIL ADNAN (sakiladnan / Sakiladnan)
- Add password change functionality (already implemented)

### 6. Invoice/Report Generation
- Add invoice download for income entries
- Add invoice download for ticket entries
- Generate PDF reports

### 7. Admin Dashboard Enhancements
- Show all options and statistics
- Filter by staff, month, year
- Download reports

## Database Schema Changes

### Income Entries Table
- Already has `receivedFrom` field ✅
- Need to update type enum to include "Money Received"

### Ticket Entries Table
- Already has `source` field ✅
- Already has `ticketCopyUrl` and `ticketCopyFileName` ✅
- No changes needed

### Users Table
- Already supports role-based access ✅
- Need to seed with demo users

## Implementation Steps

1. Update database schema and seed users
2. Enhance backend routes for new features
3. Create 3D background component
4. Implement dark theme
5. Add company logo component
6. Build enhanced dashboards
7. Add search functionality
8. Implement invoice generation
9. Add file upload/download UI
10. Test all features
