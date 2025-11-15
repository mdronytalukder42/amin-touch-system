# Railway Deployment Guide - AMIN TOUCH Staff Management System

## আপনার করণীয় (Step by Step)

### Step 1: Railway Account তৈরি করুন

1. **Railway.app** এ যান: https://railway.app
2. **"Login with GitHub"** বাটনে ক্লিক করুন
3. আপনার GitHub account (mdronytalukder42) দিয়ে login করুন
4. Railway কে GitHub access দিন (authorize করুন)

### Step 2: New Project তৈরি করুন

1. Railway dashboard এ **"New Project"** ক্লিক করুন
2. **"Deploy from GitHub repo"** সিলেক্ট করুন
3. Repository list থেকে **"amin-touch-staff-management"** খুঁজুন এবং সিলেক্ট করুন
4. **"Deploy Now"** ক্লিক করুন

### Step 3: MySQL Database যোগ করুন

1. Project dashboard এ **"+ New"** ক্লিক করুন
2. **"Database"** সিলেক্ট করুন
3. **"Add MySQL"** ক্লিক করুন
4. Database তৈরি হওয়ার জন্য কিছুক্ষণ অপেক্ষা করুন

### Step 4: Environment Variables সেট করুন

1. আপনার web service এ ক্লিক করুন
2. **"Variables"** ট্যাবে যান
3. নিচের variables যোগ করুন:

```
DATABASE_URL = ${{MySQL.DATABASE_URL}}
NODE_ENV = production
PORT = ${{PORT}}
```

**গুরুত্বপূর্ণ:** `DATABASE_URL` এর value তে `${{MySQL.DATABASE_URL}}` লিখুন - এটা automatically MySQL এর সাথে connect করবে।

### Step 5: Database Migration চালান

Database তৈরি হওয়ার পর:

1. MySQL service এ ক্লিক করুন
2. **"Connect"** ট্যাবে যান
3. **"MySQL Command"** কপি করুন
4. আপনার terminal/command prompt এ paste করুন এবং enter চাপুন
5. MySQL এ connect হলে এই commands চালান:

```sql
-- Database already created by Railway, just verify
SHOW DATABASES;
USE railway;

-- Tables will be created automatically by the app
-- But you can check after deployment with:
SHOW TABLES;
```

### Step 6: Deploy সম্পন্ন হওয়ার অপেক্ষা করুন

1. **"Deployments"** ট্যাবে যান
2. Build এবং deploy process দেখুন
3. সবুজ ✓ চিহ্ন দেখলে বুঝবেন deploy সফল হয়েছে
4. কোনো error দেখলে logs চেক করুন

### Step 7: Public URL পান

1. **"Settings"** ট্যাবে যান
2. **"Networking"** সেকশনে scroll করুন
3. **"Generate Domain"** ক্লিক করুন
4. আপনার public URL তৈরি হবে (যেমন: amintouch-production.up.railway.app)

### Step 8: Demo Users Import করুন (Optional)

যদি demo users চান:

1. MySQL service এ connect করুন
2. `seed-demo-users.sql` ফাইলের content কপি করুন
3. MySQL console এ paste করে run করুন

অথবা প্রথমবার website এ গিয়ে নিজে নতুন admin account তৈরি করুন।

## সমস্যা সমাধান

### Build Failed
- **Logs চেক করুন:** Deployments → Latest deployment → View logs
- **সাধারণ কারণ:** 
  - DATABASE_URL সঠিকভাবে set করা নেই
  - Node.js version mismatch

### Database Connection Error
- MySQL service চালু আছে কিনা চেক করুন
- DATABASE_URL variable সঠিক আছে কিনা verify করুন
- MySQL service এর সাথে web service link করা আছে কিনা দেখুন

### Site খুলছে না
- Domain generate করেছেন কিনা চেক করুন
- Deploy সফল হয়েছে কিনা verify করুন
- Logs এ কোনো error আছে কিনা দেখুন

## Free Tier Limits

Railway free tier এ পাবেন:
- **$5 credit/month** (প্রায় 500 hours runtime)
- **1 GB RAM** per service
- **1 GB storage** for database
- **100 GB bandwidth**

ছোট থেকে মাঝারি traffic এর জন্য যথেষ্ট।

## পরবর্তী পদক্ষেপ

Deploy সফল হলে:
1. ✅ Website URL দিয়ে login করুন
2. ✅ Admin account তৈরি করুন
3. ✅ Staff accounts তৈরি করুন
4. ✅ System test করুন
5. ✅ নিয়মিত backup নিন

## সাহায্যের জন্য

কোনো সমস্যা হলে:
- Railway documentation: https://docs.railway.app
- GitHub repository এর Issues section
- আমাকে জানান

---

**শুভকামনা! আপনার website এখন permanently deployed!** 🎉
