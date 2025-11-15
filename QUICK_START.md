# Quick Start Guide - AMIN TOUCH Staff Management System

## For Immediate Testing

### Live Demo Access
The system is already running and ready to use at:
**https://3002-ipxr68oolqm7rkj3rxvxd-963ffbed.manus-asia.computer**

### Login Credentials

**Administrator Login:**
```
Username: admin9197
Password: Admin9197
```

**Staff Login (choose any):**
```
Staff 1:
Username: ronytalukder
Password: @jead2016R

Staff 2:
Username: mahir
Password: Mahir3

Staff 3:
Username: sakiladnan
Password: Sakiladnan
```

## What You Can Test Immediately

### As Administrator
1. **View Dashboard** - See overall statistics and summary
2. **Search Tickets** - Use the search bar to find tickets by name or PNR
3. **Filter Data** - Filter by staff, month, or year
4. **Download Invoice** - Generate and download PDF invoices
5. **Change Password** - Update your password securely
6. **View All Entries** - See income, OTP, and ticket entries from all staff

### As Staff Member
1. **Add Income Entry** - Record daily income, OTP, or money received
2. **Add Ticket Sale** - Enter new ticket with passenger details
3. **Upload Ticket Copy** - Attach PDF or image of ticket
4. **Search Your Tickets** - Find your tickets quickly
5. **Edit Your Entries** - Modify your own records
6. **Delete Your Entries** - Remove entries you created
7. **Download Your Invoice** - Get your personal invoice

## Key Features to Test

### 1. Ticket Management
- **Add a new ticket** with all details including:
  - Passenger name
  - PNR number
  - Airline selection
  - Route (e.g., DOH-DXB)
  - Travel date
  - Pricing information
  - **NEW: Ticket source/agency**
  - **NEW: Upload ticket copy (PDF/PNG/JPG)**

### 2. File Upload
- Click "Choose File" when adding a ticket
- Select a PDF or image file
- Upload completes automatically
- View/download the file later

### 3. Search Functionality
- Type passenger name in search bar
- Or type PNR number
- Results appear instantly
- Works on both admin and staff pages

### 4. PNR Links
- Click any PNR number in the ticket list
- Automatically opens airline's "Manage My Trip" page
- Verify ticket status online

### 5. Income Tracking
- Add different types of income:
  - Daily Income
  - Income Minus
  - OTP Add
  - OTP Minus
  - **NEW: Money Received**
- Enter amount and description
- Specify recipient/from field

### 6. Invoice Generation
- Click "Download Invoice" button
- Select filters if needed
- PDF generates automatically
- Opens in new tab or downloads

### 7. Password Management
- Click "Change Password" at bottom
- Enter current password
- Enter new password twice
- Save changes

## Installation for Your Own Server

### Minimum Requirements
- Ubuntu 20.04 or later
- Node.js 18.x or later
- MySQL 8.0 or later
- 2 GB RAM (4 GB recommended)

### Quick Installation Steps

```bash
# 1. Install Node.js and pnpm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm

# 2. Install MySQL
sudo apt-get install -y mysql-server
sudo service mysql start

# 3. Create database
sudo mysql -e "CREATE DATABASE amintouch; CREATE USER 'amintouch'@'localhost' IDENTIFIED BY 'amintouch123'; GRANT ALL PRIVILEGES ON amintouch.* TO 'amintouch'@'localhost'; FLUSH PRIVILEGES;"

# 4. Extract project files
tar -xzf amin-touch-enhanced-system.tar.gz
cd amin-touch-staff-management

# 5. Configure environment
echo "DATABASE_URL=mysql://amintouch:amintouch123@localhost:3306/amintouch" > .env.local
echo "NODE_ENV=production" >> .env.local

# 6. Install dependencies
pnpm install

# 7. Setup database
export DATABASE_URL="mysql://amintouch:amintouch123@localhost:3306/amintouch"
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
mysql -u amintouch -pamintouch123 amintouch < seed-demo-users.sql

# 8. Build application
pnpm build

# 9. Start server
pnpm start
```

### Access Your Installation
Open browser and go to: **http://localhost:3000**

## Testing Checklist

### Basic Functionality
- [ ] Login as admin
- [ ] Login as staff
- [ ] View dashboard statistics
- [ ] Add income entry
- [ ] Add ticket entry
- [ ] Upload ticket file
- [ ] Search for ticket
- [ ] Click PNR link
- [ ] Download invoice
- [ ] Change password
- [ ] Logout

### Advanced Features
- [ ] Filter by staff member
- [ ] Filter by month
- [ ] Filter by year
- [ ] Edit existing entry
- [ ] Delete entry
- [ ] Upload different file types (PDF, PNG, JPG)
- [ ] Download uploaded ticket copy
- [ ] Test search with partial names
- [ ] Test search with PNR numbers

### UI/UX Testing
- [ ] Check dark theme on all pages
- [ ] Verify 3D animated background
- [ ] Confirm company logo appears
- [ ] Test on mobile device
- [ ] Test on tablet
- [ ] Check responsive design

## Troubleshooting Quick Fixes

### Cannot Login
- Verify username and password (case-sensitive)
- Clear browser cookies
- Try different browser

### Cannot Upload File
- Check file size (max 50 MB)
- Verify file format (PDF, PNG, JPG)
- Check internet connection

### Search Not Working
- Refresh the page
- Clear search box and try again
- Check if data exists

### Page Not Loading
- Check if server is running
- Verify port 3000 is not blocked
- Check firewall settings

## Important Notes

### Security
- **Change all default passwords** after first login
- Use strong passwords (8+ characters, mixed case, numbers, symbols)
- Always logout when finished
- Don't share login credentials

### Data Entry
- Fill all required fields marked with *
- Use consistent date formats
- Enter accurate pricing information
- Double-check PNR numbers

### File Uploads
- Supported formats: PDF, PNG, JPG, JPEG, GIF
- Maximum size: 50 MB per file
- Files are stored permanently
- Can be downloaded anytime

### Performance
- System handles multiple concurrent users
- Large file uploads may take time
- Search is optimized for speed
- Database is indexed for performance

## Getting Help

### Documentation Files
- **README.md** - System overview and features
- **USER_GUIDE.md** - Detailed user manual
- **INSTALLATION.md** - Complete installation guide
- **ENHANCEMENT_PLAN.md** - Technical documentation

### Support Resources
- Check USER_GUIDE.md for detailed instructions
- Review INSTALLATION.md for setup issues
- Check system logs for errors
- Contact system administrator

## Next Steps

1. **Test the live demo** with provided credentials
2. **Review the documentation** to understand all features
3. **Install on your server** following the installation guide
4. **Customize settings** for your organization
5. **Train your staff** on system usage
6. **Change default passwords** for security
7. **Setup automated backups** for data protection

## System Information

- **Version:** 2.0 Enhanced
- **Status:** Production Ready
- **Technology:** React + Node.js + MySQL
- **License:** Proprietary
- **Company:** AMIN TOUCH TRADING CONTRACTING & HOSPITALITY SERVICES

---

**Ready to use immediately! Start testing now at the live demo URL above.**
