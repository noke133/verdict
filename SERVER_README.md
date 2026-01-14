# Verdict API Server

This is the Express.js API server for the Verdict mobile application.

## 📁 Project Structure

```
server/
├── index.ts           # Main server entry point
├── routes/            # API route definitions
├── controllers/       # Business logic handlers
├── middleware/        # Custom middleware functions
└── models/            # Database models and types
```

## 🚀 Getting Started

### Installation

Dependencies are already installed with the main project. If you need to reinstall:

```bash
npm install
```

### Running the Server

**Development mode** (with auto-restart on file changes):
```bash
npm run server
# or
npm run server:dev
```

**Production mode**:
```bash
npm run server:start
```

The server will start on `http://localhost:3000` by default.

## 🔧 Configuration

Edit the `.env` file in the project root to configure:

- `PORT` - Server port (default: 3000)
- Database credentials
- JWT secret for authentication
- Other environment-specific settings

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

### API Root
```
GET /api
```
Returns API welcome message and version.

## 🛠️ Adding New Routes

1. Create a new route file in `server/routes/`
2. Create corresponding controller in `server/controllers/`
3. Import and use the route in `server/index.ts`

Example:
```typescript
// server/routes/auth.ts
import { Router } from 'express';
import { login, signup } from '../controllers/authController';

const router = Router();
router.post('/login', login);
router.post('/signup', signup);

export default router;

// server/index.ts
import authRoutes from './routes/auth';
app.use('/api/auth', authRoutes);
```

## 📝 TypeScript Configuration

The server uses a separate TypeScript configuration (`tsconfig.server.json`) to ensure compatibility with the Expo project's TypeScript setup.

## 🔐 Security Features

- CORS enabled for cross-origin requests
- JSON body parsing middleware
- Error handling middleware
- Environment variable support for sensitive data

## 📚 Next Steps

- Add database connection (MySQL/MongoDB)
- Create authentication endpoints
- Implement JWT-based authentication
- Add data validation middleware
- Create CRUD endpoints for your models

---

**Note**: Make sure to keep your `.env` file secure and never commit it to version control.
