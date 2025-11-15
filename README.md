# AMIN TOUCH Staff Management System - Enhanced Version 2.0

## Overview

The **AMIN TOUCH Staff Management System** is a comprehensive web-based application designed specifically for **AMIN TOUCH TRADING CONTRACTING & HOSPITALITY SERVICES**. This enhanced version includes advanced features for managing staff, tracking income, handling ticket sales, and generating reports with a modern, professional dark-themed interface.

## Company Information

**Company Name:** AMIN TOUCH TRADING CONTRACTING & HOSPITALITY SERVICES

**System Purpose:** Staff management, income tracking, ticket sales management, and financial reporting for travel and hospitality business operations.

## Live Demo

The system is currently running at:
**URL:** https://3002-ipxr68oolqm7rkj3rxvxd-963ffbed.manus-asia.computer

### Demo Credentials

**Admin Account:**
- Username: `admin9197`
- Password: `Admin9197`

**Staff Accounts:**
- Username: `ronytalukder` | Password: `@jead2016R`
- Username: `mahir` | Password: `Mahir3`
- Username: `sakiladnan` | Password: `Sakiladnan`

## Key Features

### Ticket Management Enhancements
The system now includes comprehensive ticket management capabilities with the following new features:

**Ticket Source Tracking:** Users can now record where tickets were purchased from, including agency names and sources. This helps track which agencies provide the best service and pricing.

**File Upload System:** The application supports uploading ticket copies in multiple formats including PDF, PNG, JPG, and other image formats. Each ticket entry can have an associated digital copy for easy reference and verification.

**Download Capability:** All uploaded ticket copies can be downloaded at any time by both administrators and staff members who created the entries.

**PNR Integration:** Clicking on any PNR number automatically redirects users to the respective airline's "Manage My Trip" page, allowing quick verification of ticket status and details.

**Advanced Search:** A powerful search functionality allows users to find tickets by passenger name or PNR number across the entire database. The search works in real-time and is available on both admin and staff dashboards.

### Income Management
The income tracking system has been enhanced with a new entry type called "Money Received" which allows staff to record payments received from clients. This complements the existing income types including Daily Income, Income Minus, OTP Add, and OTP Minus.

### User Interface Improvements

**Dark Theme:** The entire application features a professional dark theme that reduces eye strain and provides a modern aesthetic suitable for extended use.

**3D Animated Background:** The system includes a sophisticated 3D animated background with rotating images that change every three seconds, creating an engaging visual experience while maintaining readability.

**Company Branding:** The company logo and full name appear prominently on all pages, reinforcing brand identity throughout the application.

**Responsive Design:** The interface adapts seamlessly to different screen sizes, ensuring usability on desktop computers, tablets, and mobile devices.

### Security and Access Control

**Role-Based Authentication:** The system distinguishes between administrator and staff roles, with different permissions and capabilities for each.

**Password Management:** All users can change their passwords at any time through a secure password change interface.

**Session Management:** Secure session-based authentication ensures that user credentials are protected and sessions expire appropriately.

### Reporting and Analytics

**Invoice Generation:** Both administrators and staff can generate and download PDF invoices for their respective data. Invoices can be filtered by staff member, month, and year.

**Dashboard Analytics:** Real-time summary cards display total income, OTP cash, ticket counts, and active staff members.

**Data Filtering:** Comprehensive filtering options allow users to view data by specific staff members, date ranges, months, and years.

## Technical Architecture

### Frontend Technology
The frontend is built using **React 18** with **TypeScript**, providing a type-safe and maintainable codebase. The application uses **React Router** for navigation and **TanStack Query** for efficient data fetching and caching.

### Backend Infrastructure
The backend runs on **Node.js** with **Express** framework, implementing a **tRPC** API layer for end-to-end type safety between frontend and backend. This architecture eliminates entire classes of bugs by ensuring type consistency across the full stack.

### Database System
**MySQL 8.0** serves as the relational database, managed through **Drizzle ORM** which provides type-safe database queries and automatic migration generation. The schema includes tables for users, income entries, ticket entries, and sessions.

### File Storage
Uploaded files are stored in the local filesystem with public URL access through Express static file serving. Files are organized by type and timestamp to prevent naming conflicts.

## Installation Requirements

### System Prerequisites
- **Operating System:** Ubuntu 20.04 LTS or later (or compatible Linux distribution)
- **Node.js:** Version 18.x or later
- **MySQL:** Version 8.0 or later
- **RAM:** Minimum 2 GB (4 GB recommended for production)
- **Storage:** Minimum 10 GB free space
- **Network:** Stable internet connection

### Software Dependencies
- **pnpm:** Package manager for efficient dependency management
- **Git:** Version control system (optional but recommended)
- **Nginx:** Web server for reverse proxy (optional for production)

## Quick Start Guide

### Database Setup
First, create the MySQL database and user with appropriate permissions. Connect to MySQL as root and execute the following commands to create a database named "amintouch" with a dedicated user.

### Environment Configuration
Create a `.env.local` file in the project root directory containing the database connection string and environment settings. The database URL should follow the format: `mysql://username:password@host:port/database`

### Dependency Installation
Run `pnpm install` to install all required Node.js packages and dependencies. This process may take several minutes depending on your internet connection.

### Database Migration
Execute `pnpm drizzle-kit generate` followed by `pnpm drizzle-kit migrate` to create the database schema. Then import the `seed-demo-users.sql` file to populate initial user accounts.

### Application Build
Run `pnpm build` to compile the TypeScript code and bundle the frontend assets. This creates optimized production-ready files.

### Server Start
Execute `pnpm start` to launch the production server. The application will be accessible on port 3000 or the next available port.

## Documentation Files

This package includes comprehensive documentation to help you understand, install, and use the system:

### USER_GUIDE.md
A complete user manual covering all features, functionality, and usage instructions for both administrators and staff members. This guide includes step-by-step instructions for common tasks, troubleshooting tips, and best practices.

### INSTALLATION.md
Detailed installation and deployment instructions including system requirements, configuration steps, database setup, service management, backup procedures, and production deployment with Nginx and SSL certificates.

### ENHANCEMENT_PLAN.md
Technical documentation of all enhancements made to the system, including database schema changes, new API endpoints, frontend component updates, and architectural decisions.

## Project Structure

```
amin-touch-staff-management/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React context providers
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utility functions
│   └── public/            # Static assets
│       └── images/        # Company logo and backgrounds
├── server/                # Backend Node.js application
│   ├── _core/            # Core server functionality
│   ├── routers.ts        # tRPC API routes
│   ├── db.ts             # Database functions
│   └── local-storage.ts  # File storage handling
├── drizzle/              # Database schema and migrations
│   └── schema.ts         # Database table definitions
├── shared/               # Shared types and constants
├── uploads/              # Uploaded ticket copies
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
├── drizzle.config.ts     # Database configuration
├── seed-demo-users.sql   # Demo user data
├── README.md             # This file
├── USER_GUIDE.md         # User documentation
├── INSTALLATION.md       # Installation guide
└── ENHANCEMENT_PLAN.md   # Technical documentation
```

## Database Schema

### Users Table
Stores user account information including username, hashed password, full name, role (admin or user), contact details, and account creation timestamps. The `can_change_password` field controls whether users can modify their passwords.

### Income Entries Table
Records all income and OTP transactions with fields for user ID, date, time, transaction type, amount, description, and recipient/source information. Each entry is linked to the user who created it.

### Ticket Entries Table
Manages ticket sales data including passenger information, PNR, airline, route, travel dates, pricing details, payment method, status, notes, ticket source, and uploaded ticket copy URL. This table supports the complete ticket lifecycle from booking to completion.

### Sessions Table
Handles user authentication sessions with secure tokens and expiration timestamps to maintain login state across requests.

## Security Features

### Password Security
All passwords are hashed using industry-standard bcrypt algorithm before storage. The system never stores or transmits plain-text passwords.

### Session Management
User sessions are managed through secure HTTP-only cookies with appropriate expiration times. Session tokens are cryptographically random and validated on each request.

### Access Control
Role-based access control ensures that staff members can only view and modify their own entries, while administrators have full access to all data.

### Input Validation
All user inputs are validated on both client and server sides to prevent injection attacks and ensure data integrity.

## Performance Optimization

### Database Indexing
Key database columns are indexed for optimal query performance, particularly for search operations on passenger names and PNR numbers.

### Asset Caching
Static assets including images, CSS, and JavaScript files are served with appropriate cache headers to reduce server load and improve page load times.

### Code Splitting
The frontend application uses code splitting to load only the necessary JavaScript for each page, reducing initial bundle size.

### Query Optimization
Database queries are optimized to minimize the number of round trips and use efficient JOIN operations where appropriate.

## Backup and Recovery

### Automated Backups
The system supports automated daily database backups through cron jobs. Backup files are compressed and stored with timestamps for easy identification.

### Manual Backup
Administrators can manually create database backups at any time using the provided backup script or MySQL dump commands.

### Disaster Recovery
In case of data loss, the system can be restored from backup files with minimal downtime. The restoration process is documented in the INSTALLATION.md file.

## Monitoring and Maintenance

### Application Logs
The system generates detailed logs for debugging and monitoring purposes. Logs can be accessed through PM2 or systemd depending on the deployment method.

### Health Checks
Built-in health check endpoints allow monitoring systems to verify that the application is running correctly.

### Update Procedures
The system can be updated with minimal downtime by following the update procedures outlined in the INSTALLATION.md file.

## Support and Troubleshooting

### Common Issues
The documentation includes solutions for common issues such as database connection errors, port conflicts, permission problems, and authentication failures.

### Log Analysis
Detailed logging helps identify and resolve issues quickly. Logs include timestamps, user information, and error details.

### Performance Tuning
Guidelines for optimizing database performance, adjusting server resources, and configuring caching are provided in the installation guide.

## Future Enhancements

The system is designed with extensibility in mind. Potential future enhancements include:

- Email notification system for important events
- SMS integration for mobile alerts
- Advanced reporting with charts and graphs
- Multi-currency support for international operations
- Mobile native applications for iOS and Android
- Integration with airline booking systems
- Automated backup to cloud storage
- Two-factor authentication for enhanced security

## License and Usage

This system is developed specifically for **AMIN TOUCH TRADING CONTRACTING & HOSPITALITY SERVICES**. All rights reserved.

## Version Information

- **Version:** 2.0 Enhanced
- **Release Date:** November 15, 2025
- **Build:** Production-ready
- **Status:** Fully functional and tested

## Contact and Support

For technical support, feature requests, or questions about the system, please contact the system administrator or refer to the comprehensive documentation provided in this package.

---

**Developed with modern web technologies for optimal performance, security, and user experience.**
