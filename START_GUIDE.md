# 🚀 Starting Your Verdict App - Complete Guide

## ⚡ Quick Start (2 Steps)

### Step 1: Start Express Server (Backend)

Open a **new terminal** and run:

```bash
npm run server
```

**Expected output:**
```
✅ MongoDB Atlas connected successfully
🚀 Server is running on http://localhost:3000
📍 Health check: http://localhost:3000/health
```

✅ **Server is ready when you see the green checkmark!**

⚠️ **Keep this terminal window open** - The server must stay running!

---

### Step 2: Start Expo App (Frontend)

Open a **second terminal** (keep server running) and run:

```bash
npx expo start
```

**Expected output:**
```
› Metro waiting on exp://192.168.1.33:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

✅ **Expo is ready when you see the QR code!**

---

## 📱 Testing Your App

### On Physical Device (Recommended)

1. Install **Expo Go** app on your phone:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Make sure your phone is on the **same WiFi** as your computer

3. **Scan the QR code** from the Expo terminal

4. App will open in Expo Go!

### On Web Browser

Press `w` in the Expo terminal to open in web browser.

---

## 🔧 Important Configuration

### For Mobile Device Testing

Before testing on your phone, update the API URL:

**File:** `services/Api.ts` (Line 7)

**Change:**
```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

**To:**
```typescript
const API_BASE_URL = 'http://192.168.1.33:3000/api';
```

💡 Use **your computer's IP address** (192.168.1.33) instead of localhost for mobile devices.

---

## 🖥️ Daily Development Workflow

### Starting Your Day

1. **Open VS Code** in the Verdict folder

2. **Open 2 terminals** in VS Code:
   - Terminal 1: Run `npm run server` (Backend)
   - Terminal 2: Run `npx expo start` (Frontend)

3. **Start coding!** Both servers will auto-reload on file changes

### Ending Your Day

1. **Stop Expo**: Press `Ctrl+C` in Terminal 2

2. **Stop Server**: Press `Ctrl+C` in Terminal 1

3. **Close terminals**

---

## 🔄 Auto-Reload Features

### Backend (Express Server)
- ✅ Auto-reloads when you edit files in `server/` folder
- Changes apply automatically
- No need to restart manually

### Frontend (Expo)
- ✅ Auto-reloads when you edit `.tsx`, `.ts` files
- Shake device or press `r` to reload manually
- Press `m` to open dev menu

---

## 🛠️ Troubleshooting

### Server Won't Start

**Problem:** "MONGODB_URI is not defined"
```bash
# Solution: Check .env file exists
# Make sure MONGODB_URI is set correctly
```

**Problem:** "Port 3000 is already in use"
```bash
# Solution: Stop the other server
# Windows: netstat -ano | findstr :3000
# Then kill that process
```

---

### Expo Won't Start

**Problem:** "Metro bundler failed to start"
```bash
# Solution: Clear cache and restart
npx expo start -c
```

**Problem:** "Can't connect to Metro"
```bash
# Solution: Check firewall settings
# Make sure port 8081 is not blocked
```

---

### App Can't Connect to Backend

**Problem:** "Network request failed" on mobile

**Solutions:**

1. ✅ **Check WiFi**: Phone must be on same network as computer

2. ✅ **Check IP**: Update API_BASE_URL with correct IP
   ```bash
   # Find your IP:
   ipconfig
   # Look for IPv4 Address
   ```

3. ✅ **Check Server**: Make sure server terminal shows "MongoDB Atlas connected"

4. ✅ **Check Firewall**: Allow Node.js through Windows Firewall

---

## 📊 Terminal Layout in VS Code

### Recommended Setup

```
┌─────────────────────────────────────┐
│  VS Code Editor                     │
│  (Edit your code here)              │
├─────────────────────────────────────┤
│ Terminal 1: npm run server          │
│ Express Server Running...           │
├─────────────────────────────────────┤
│ Terminal 2: npx expo start          │
│ Metro Bundler Running...            │
└─────────────────────────────────────┘
```

**To create split terminals in VS Code:**
1. Open terminal with `` Ctrl+` ``
2. Click the split terminal icon (+)
3. Run different command in each terminal

---

## ⌨️ Useful Commands

### In Expo Terminal

| Key | Action |
|-----|--------|
| `r` | Reload app |
| `m` | Open dev menu |
| `w` | Open in web browser |
| `a` | Open on Android emulator |
| `i` | Open on iOS simulator (Mac only) |
| `c` | Clear cache and restart |
| `q` | Quit Metro bundler |

### In Server Terminal

| Command | Action |
|---------|--------|
| `Ctrl+C` | Stop server |
| `npm run server` | Start with auto-reload |
| `npm run server:start` | Start without auto-reload |

---

## 🔍 Checking Everything is Working

### Test Checklist

1. ✅ **Server Health Check**
   - Open browser: http://localhost:3000/health
   - Should see: `{"status": "OK", "database": "MongoDB Atlas"}`

2. ✅ **Expo Metro Bundler**
   - See QR code in terminal
   - No red error messages

3. ✅ **Mobile Connection**
   - Open app in Expo Go
   - Try signing up a test user
   - Check server terminal for API requests

---

## 📝 Development Tips

### 1. Keep Both Terminals Visible
Always keep both terminal outputs visible to catch errors immediately.

### 2. Watch Server Logs
When testing API calls, watch Terminal 1 for:
```
[API Request] POST /api/auth/signup
[API Response] signup.php: ...
```

### 3. Use Expo Dev Menu
Shake your device to open dev menu and:
- Reload the app
- Toggle performance monitor
- Debug remote JS

### 4. Hot Reload
Both servers support hot reload:
- Edit code → Save → See changes instantly
- No need to restart servers!

---

## 🚨 Common Mistakes to Avoid

1. ❌ **Don't close server terminal** while testing mobile app
2. ❌ **Don't use localhost** in API_BASE_URL for mobile devices
3. ❌ **Don't forget to start server** before starting Expo
4. ❌ **Don't connect to different WiFi** (computer and phone must match)

---

## ✅ Checklist Before Testing

Before each testing session:

- [ ] `.env` file has correct MONGODB_URI
- [ ] Terminal 1: Server running (green checkmark visible)
- [ ] Terminal 2: Expo running (QR code visible)
- [ ] `services/Api.ts` has correct IP address
- [ ] Phone on same WiFi as computer
- [ ] Expo Go app installed on phone

---

## 🎯 Summary

**To run your Verdict app:**

```bash
# Terminal 1
npm run server

# Terminal 2  
npx expo start
```

**That's it!** Keep both running and start developing! 🚀

---

## 📞 Need Help?

If something's not working:

1. Check both terminals for error messages
2. Verify MongoDB Atlas connection (green checkmark)
3. Test health endpoint: http://localhost:3000/health
4. Make sure API URL matches your IP
5. Restart both servers (Ctrl+C then start again)

---

**Happy Coding! 🎉**
