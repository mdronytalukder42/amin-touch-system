# AMIN TOUCH Staff Management System - Installation Guide

## System Requirements

### Server Requirements
- **Operating System:** Ubuntu 20.04 LTS or later (or any Linux distribution)
- **Node.js:** Version 18.x or later
- **MySQL:** Version 8.0 or later
- **RAM:** Minimum 2 GB (4 GB recommended)
- **Storage:** Minimum 10 GB free space
- **Network:** Stable internet connection

### Development Requirements
- **pnpm:** Package manager (version 8.x or later)
- **Git:** For version control
- **Text Editor:** VS Code, Sublime, or any preferred editor

## Installation Steps

### Step 1: Install Node.js and pnpm

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm globally
npm install -g pnpm

# Verify installations
node --version
pnpm --version
```

### Step 2: Install MySQL

```bash
# Update package list
sudo apt-get update

# Install MySQL Server
sudo apt-get install -y mysql-server

# Start MySQL service
sudo service mysql start

# Secure MySQL installation (optional but recommended)
sudo mysql_secure_installation
```

### Step 3: Create Database and User

```bash
# Login to MySQL as root
sudo mysql

# In MySQL console, run these commands:
CREATE DATABASE amintouch;
CREATE USER 'amintouch'@'localhost' IDENTIFIED BY 'amintouch123';
GRANT ALL PRIVILEGES ON amintouch.* TO 'amintouch'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 4: Extract and Setup Project

```bash
# Navigate to your projects directory
cd /home/ubuntu

# If you have the ZIP file, extract it
unzip amin-touch-staff-management.zip
cd amin-touch-staff-management

# Or if you're cloning from Git
git clone <repository-url>
cd amin-touch-staff-management
```

### Step 5: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
nano .env.local
```

Add the following content:

```env
DATABASE_URL=mysql://amintouch:amintouch123@localhost:3306/amintouch
NODE_ENV=production
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 6: Install Dependencies

```bash
# Install all project dependencies
pnpm install
```

This will install all required packages including:
- React and React Router
- Express and tRPC
- Drizzle ORM
- MySQL2 driver
- And many more...

### Step 7: Run Database Migrations

```bash
# Generate migration files
export DATABASE_URL="mysql://amintouch:amintouch123@localhost:3306/amintouch"
pnpm drizzle-kit generate

# Apply migrations to database
pnpm drizzle-kit migrate
```

### Step 8: Seed Demo Users

```bash
# Import demo users into database
mysql -u amintouch -pamintouch123 amintouch < seed-demo-users.sql
```

This creates the following users:
- Admin: admin9197 / Admin9197
- Staff: ronytalukder / @jead2016R
- Staff: mahir / Mahir3
- Staff: sakiladnan / Sakiladnan

### Step 9: Build the Application

```bash
# Build frontend and backend
pnpm build
```

This compiles:
- React frontend to static files
- TypeScript backend to JavaScript
- Optimizes assets and bundles

### Step 10: Start the Application

#### For Production:

```bash
# Start the production server
export DATABASE_URL="mysql://amintouch:amintouch123@localhost:3306/amintouch"
export NODE_ENV=production
pnpm start
```

The server will start on port 3000 (or next available port).

#### For Development:

```bash
# Start the development server with hot reload
export DATABASE_URL="mysql://amintouch:amintouch123@localhost:3306/amintouch"
pnpm dev
```

### Step 11: Access the Application

Open your web browser and navigate to:
- **Local:** http://localhost:3000
- **Network:** http://YOUR_SERVER_IP:3000

## Running as a Background Service

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start the application with PM2
cd /home/ubuntu/amin-touch-staff-management
export DATABASE_URL="mysql://amintouch:amintouch123@localhost:3306/amintouch"
pm2 start "pnpm start" --name amintouch

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Check application status
pm2 status

# View logs
pm2 logs amintouch

# Restart application
pm2 restart amintouch

# Stop application
pm2 stop amintouch
```

### Using systemd

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/amintouch.service
```

Add the following content:

```ini
[Unit]
Description=AMIN TOUCH Staff Management System
After=network.target mysql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/amin-touch-staff-management
Environment="DATABASE_URL=mysql://amintouch:amintouch123@localhost:3306/amintouch"
Environment="NODE_ENV=production"
ExecStart=/usr/bin/pnpm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable amintouch

# Start the service
sudo systemctl start amintouch

# Check service status
sudo systemctl status amintouch

# View logs
sudo journalctl -u amintouch -f

# Restart service
sudo systemctl restart amintouch

# Stop service
sudo systemctl stop amintouch
```

## Nginx Reverse Proxy Setup (Optional)

If you want to serve the application on port 80 or with a domain name:

### Install Nginx

```bash
sudo apt-get install -y nginx
```

### Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/amintouch
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve uploaded files
    location /uploads/ {
        alias /home/ubuntu/amin-touch-staff-management/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/amintouch /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

## Firewall Configuration

```bash
# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Allow Node.js app port (if not using Nginx)
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw enable

# Check firewall status
sudo ufw status
```

## Database Backup and Restore

### Automated Daily Backup

Create a backup script:

```bash
nano /home/ubuntu/backup-amintouch.sh
```

Add the following content:

```bash
#!/bin/bash

# Configuration
DB_USER="amintouch"
DB_PASS="amintouch123"
DB_NAME="amintouch"
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/amintouch_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Delete backups older than 30 days
find $BACKUP_DIR -name "amintouch_*.sql.gz" -mtime +30 -delete

echo "Backup completed: ${BACKUP_FILE}.gz"
```

Make it executable:

```bash
chmod +x /home/ubuntu/backup-amintouch.sh
```

Schedule daily backup with cron:

```bash
crontab -e
```

Add this line to run backup daily at 2 AM:

```
0 2 * * * /home/ubuntu/backup-amintouch.sh >> /home/ubuntu/backup.log 2>&1
```

### Manual Backup

```bash
mysqldump -u amintouch -pamintouch123 amintouch > backup_$(date +%Y%m%d).sql
gzip backup_$(date +%Y%m%d).sql
```

### Restore from Backup

```bash
# Decompress backup
gunzip backup_YYYYMMDD.sql.gz

# Restore database
mysql -u amintouch -pamintouch123 amintouch < backup_YYYYMMDD.sql
```

## Monitoring and Logs

### Application Logs

If using PM2:
```bash
pm2 logs amintouch
pm2 logs amintouch --lines 100
```

If using systemd:
```bash
sudo journalctl -u amintouch -f
sudo journalctl -u amintouch --since "1 hour ago"
```

### MySQL Logs

```bash
sudo tail -f /var/log/mysql/error.log
```

### Nginx Logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Updating the Application

### Update Code

```bash
cd /home/ubuntu/amin-touch-staff-management

# Pull latest changes (if using Git)
git pull origin main

# Or extract new ZIP file
unzip -o new-version.zip
```

### Update Dependencies

```bash
pnpm install
```

### Run New Migrations

```bash
export DATABASE_URL="mysql://amintouch:amintouch123@localhost:3306/amintouch"
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### Rebuild Application

```bash
pnpm build
```

### Restart Service

If using PM2:
```bash
pm2 restart amintouch
```

If using systemd:
```bash
sudo systemctl restart amintouch
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

### MySQL Connection Error

```bash
# Check MySQL status
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### Permission Issues

```bash
# Fix file permissions
sudo chown -R ubuntu:ubuntu /home/ubuntu/amin-touch-staff-management

# Fix upload directory permissions
sudo chmod -R 755 /home/ubuntu/amin-touch-staff-management/uploads
```

### Application Not Starting

```bash
# Check Node.js version
node --version

# Check if dependencies are installed
ls node_modules

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Check environment variables
echo $DATABASE_URL

# Check database connection
mysql -u amintouch -pamintouch123 amintouch -e "SELECT 1"
```

## Performance Optimization

### Database Optimization

```sql
-- Add indexes for better query performance
ALTER TABLE ticket_entries ADD INDEX idx_pnr (pnr);
ALTER TABLE ticket_entries ADD INDEX idx_passenger_name (passenger_name);
ALTER TABLE ticket_entries ADD INDEX idx_user_date (user_id, travel_date);
ALTER TABLE income_entries ADD INDEX idx_user_date (user_id, date);
```

### Nginx Caching

Add to Nginx configuration:

```nginx
# Cache static assets
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Node.js Performance

```bash
# Increase Node.js memory limit if needed
export NODE_OPTIONS="--max-old-space-size=4096"
```

## Security Hardening

### Change Default Database Password

```sql
ALTER USER 'amintouch'@'localhost' IDENTIFIED BY 'new_secure_password';
FLUSH PRIVILEGES;
```

Update `.env.local` with new password.

### Disable Root MySQL Login

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH auth_socket;
```

### Setup Fail2Ban (Optional)

```bash
sudo apt-get install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Regular Updates

```bash
# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Update Node.js packages
pnpm update
```

## Support

For technical issues or questions, please refer to:
- USER_GUIDE.md for feature documentation
- ENHANCEMENT_PLAN.md for technical details
- System logs for error diagnosis

---

**Installation Guide Version:** 2.0
**Last Updated:** November 15, 2025
