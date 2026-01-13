# Quick Start - Verdict MongoDB Backend

## 🎯 Quick Setup (3 minutes)

### 1. Get MongoDB Atlas Connection String
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster → Get connection string
3. Format: `mongodb+srv://username:password@cluster.mongodb.net/verdict`

### 2. Configure Environment
```bash
# Copy example file
copy .env.example .env

# Edit .env and add your MongoDB connection string
MONGODB_URI=mongodb+srv://...
JWT_SECRET=any_random_secret_key
```

### 3. Start Server
```bash
npm run server
```

### 4. Test
Open: http://localhost:3000/health

---

## 📱 Update Mobile App API URL

For testing on mobile device, update `services/Api.ts`:
```typescript
// Replace localhost with your computer's local IP
const API_BASE_URL = 'http://YOUR_LOCAL_IP:3000/api';
// Example: 'http://192.168.1.100:3000/api'
```

Find your local IP:
```bash
# Windows
ipconfig
# Look for "IPv4 Address"
```

---

## ✅ What's Ready

**Backend:**
- ✅ Express server with MongoDB Atlas
- ✅ User authentication (signup, login, OTP)
- ✅ Profile management
- ✅ Attorney listings
- ✅ JWT token auth

**Frontend:**
- ✅ API service updated
- ✅ Token management with SecureStore
- ✅ All endpoints integrated

---

## 📡 API Endpoints

| Endpoint | Body |
|----------|------|
| POST `/api/auth/signup` | `{ name, email, password, role }` |
| POST `/api/auth/verify-otp` | `{ email, otp }` |
| POST `/api/auth/login` | `{ email, password }` |
| PUT `/api/user/profile` 🔒 | `{ phone, city, bio, ... }` |
| GET `/api/attorneys` | - |

🔒 = Requires Authorization header

---

**Full docs:** See [MONGODB_SETUP.md](./MONGODB_SETUP.md)
