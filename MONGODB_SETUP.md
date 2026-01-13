# MongoDB Atlas Setup Guide

## 🎯 Overview

Your Verdict app now uses MongoDB Atlas (cloud database) with Express.js backend instead of PHP. All PHP files have been removed.

## 📋 Prerequisites

1. MongoDB Atlas account (free tier available)
2. Node.js installed
3. Expo app ready

## 🚀 Setup Steps

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose Free Tier M0)
4. Wait for cluster to deploy (2-3 minutes)

### Step 2: Configure Database Access

1. In MongoDB Atlas dashboard, click **"Database Access"**
2. Click **"Add New Database User"**
3. Create a username and password (save these!)
4. Set permission to **"Read and write to any database"**
5. Click **"Add User"**

### Step 3: Configure Network Access

1. Click **"Network Access"** in the sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - Or add your specific IP for production
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Click **"Database"** in the sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (starts with `mongodb+srv://`)
5. It will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 5: Configure Your App

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` file and update:
   ```env
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/verdict?retryWrites=true&w=majority
   JWT_SECRET=your_random_secret_key_here
   ```

   **Replace:**
   - `YOUR_USERNAME` - Your database username
   - `YOUR_PASSWORD` - Your database password
   - `YOUR_CLUSTER` - Your cluster name from connection string
   - `your_random_secret_key_here` - Any random string (for JWT encryption)

### Step 6: Update Frontend API URL

If deploying to production, update the API_BASE_URL in `services/Api.ts`:

```typescript
const API_BASE_URL = 'https://your-production-url.com/api';
// For local development, use:
// const API_BASE_URL = 'http://localhost:3000/api';
```

### Step 7: Start the Server

Run the backend server:
```bash
npm run server
```

You should see:
```
✅ MongoDB Atlas connected successfully
🚀 Server is running on http://localhost:3000
📍 Health check: http://localhost:3000/health
```

### Step 8: Test the Connection

Open browser and go to: `http://localhost:3000/health`

You should see:
```json
{
  "status": "OK",
  "message": "Verdict API Server is running",
  "timestamp": "2026-01-12T...",
  "database": "MongoDB Atlas"
}
```

## 📡 API Endpoints

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/verify-otp` | POST | Verify OTP and activate account |
| `/api/auth/login` | POST | Login user |

### User Management

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/user/profile` | PUT | ✅ | Update user profile |

### Attorneys

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/attorneys` | GET | ❌ | Get all verified attorneys |

## 📝 Example Requests

### Signup
```javascript
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "attorney"
}
```

### Verify OTP
```javascript
POST /api/auth/verify-otp
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Login
```javascript
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Update Profile (Requires Auth Token)
```javascript
PUT /api/user/profile
Headers: { "Authorization": "Bearer YOUR_JWT_TOKEN" }
{
  "phone": "+1234567890",
  "city": "New York",
  "practiceAreas": ["Criminal Law", "Family Law"],
  "yearsExperience": 5,
  "lawFirm": "Doe & Associates",
  "hourlyRate": 250,
  "bio": "Experienced attorney..."
}
```

## 🔐 Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Change JWT_SECRET** - Use a strong random string
3. **Rotate MongoDB password** - Change it periodically
4. **Enable IP Whitelist** - In production, don't allow access from anywhere
5. **Use HTTPS** - Always use HTTPS in production

## 🐛 Troubleshooting

### "MONGODB_URI is not defined"
- Make sure `.env` file exists in project root
- Check that MONGODB_URI is set correctly
- Restart the server after changing `.env`

### "Authentication failed"
- Check username and password in connection string
- Make sure user has correct permissions in MongoDB Atlas
- Verify IP address is whitelisted

### "Network request failed" on mobile
- Update API_BASE_URL to use your computer's local IP instead of localhost
- Example: `http://192.168.1.100:3000/api`

## 📚 Database Models

### User Model
- name
- email (unique)
- passwordHash
- role (attorney/client)
- isVerified
- phone
- city
- practiceAreas (array)
- yearsExperience
- lawFirm
- hourlyRate
- bio
- profilePictureUrl
- createdAt

### OTP Verification Model
- email
- otpCode
- expiresAt (auto-deleted after expiration)
- createdAt

## 🎉 What Changed

### ✅ Added
- Express.js server with MongoDB Atlas
- Mongoose models (User, OTPVerification)
- JWT authentication
- Updated API service with token management
- Secure token storage with expo-secure-store

### ❌ Removed
- All PHP backend files
- MySQL database dependency
- Hostinger backend references

## 📞 Support

If you encounter issues:
1. Check server logs in terminal
2. Check MongoDB Atlas logs
3. Verify network connectivity
4. Check API endpoint URLs

---

**Next Steps:**
1. Configure your MongoDB Atlas connection string
2. Test the auth flow
3. Deploy to production!
