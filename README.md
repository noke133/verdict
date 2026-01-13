# Verdict - Attorney Matching Platform

A modern mobile application connecting clients with attorneys using a Tinder-style swipe interface.

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- MongoDB Atlas account (free)
- Expo Go app on your phone

### Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure MongoDB Atlas**
   - Copy `.env.example` to `.env`
   - Add your MongoDB connection string

3. **Start Development**
   
   **Terminal 1 - Start Backend:**
   ```bash
   npm run server
   ```
   
   **Terminal 2 - Start Mobile App:**
   ```bash
   npx expo start
   ```

4. **Test on Your Phone**
   - Scan QR code with Expo Go app
   - Make sure phone is on same WiFi as computer

📖 **Full guide:** See [START_GUIDE.md](./START_GUIDE.md)

## 📁 Project Structure

```
Verdict/
├── app/                    # React Native screens
├── components/             # Reusable UI components
├── server/                 # Express.js backend
│   ├── config/            # Database config
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth middleware
│   ├── models/           # MongoDB models
│   └── routes/           # API routes
├── services/              # API client
└── constants/             # App constants
```

## 🔧 Tech Stack

**Frontend:**
- React Native (Expo)
- TypeScript
- expo-secure-store

**Backend:**
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs

## 📡 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/signup` | POST | ❌ | Register new user |
| `/api/auth/verify-otp` | POST | ❌ | Verify email with OTP |
| `/api/auth/login` | POST | ❌ | Login user |
| `/api/user/profile` | PUT | ✅ | Update profile |
| `/api/attorneys` | GET | ❌ | Get all attorneys |

## 📚 Documentation

- **[START_GUIDE.md](./START_GUIDE.md)** - How to start servers and run the app
- **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** - Complete MongoDB Atlas setup guide
- **[QUICKSTART.md](./QUICKSTART.md)** - 3-minute setup guide
- **[SUCCESS.md](./SUCCESS.md)** - Current setup status and next steps
- **[SERVER_README.md](./SERVER_README.md)** - Backend architecture details

## 🎯 Available Scripts

```bash
# Frontend
npm start          # Start Expo development server
npm run android    # Start on Android
npm run ios        # Start on iOS
npm run web        # Start on web

# Backend
npm run server     # Start Express server with auto-reload
npm run server:dev # Start Express server (dev mode)
npm run server:start # Start Express server (production)

# Testing
powershell -ExecutionPolicy Bypass -File test-api.ps1
```

## 🔐 Environment Variables

Create a `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/verdict
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 🛠️ Development Workflow

1. Start backend server: `npm run server`
2. Start Expo: `npx expo start`
3. Scan QR code with Expo Go
4. Start developing!

Both servers support hot-reload - changes appear instantly.

## 📱 Mobile Testing

For mobile device testing, update `services/Api.ts`:

```typescript
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3000/api';
```

Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

## ✅ Features

- ✅ User authentication (signup/login)
- ✅ OTP email verification
- ✅ JWT token-based auth
- ✅ Attorney profile management
- ✅ Secure password hashing
- ✅ MongoDB Atlas cloud database
- ✅ TypeScript support
- ✅ Auto-expiring OTPs

## 🚀 Deployment

**Backend options:**
- Heroku
- Render.com
- Railway.app
- Vercel

**Database:**
- MongoDB Atlas (already cloud-hosted)

**Frontend:**
- Build APK/IPA for app stores
- Use EAS Build for production builds

## 📄 License

Private project

## 🤝 Support

For issues, check:
1. [START_GUIDE.md](./START_GUIDE.md) troubleshooting section
2. Server terminal logs
3. MongoDB Atlas connection status

---

Made with ❤️ for connecting clients with attorneys
