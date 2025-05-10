# Server-Side Documentation

## Overview
The server-side application is built with Express.js and TypeScript, providing a robust backend for the academic stress management platform. It handles authentication, chat functionality, and integrates with Google's Gemini AI.

## Tech Stack
- Express.js
- TypeScript
- PostgreSQL
- Drizzle ORM
- Google Gemini AI
- JWT Authentication
- WebSocket (for real-time features)

## Project Structure

```
server/
├── config/           # Configuration files
├── middleware/       # Express middleware
├── services/         # Business logic
├── db/              # Database related code
├── utils/           # Utility functions
└── types/           # TypeScript types
```

## Core Features

### 1. Authentication System
- JWT-based authentication
- HTTP-only cookies
- Password hashing with bcrypt
- Session management

### 2. Chat System
- Integration with Gemini AI
- Message history storage
- Real-time message handling
- Context management

### 3. Database Management
- PostgreSQL with Drizzle ORM
- Type-safe queries
- Migration support
- Connection pooling

## API Routes

### Authentication Routes
```typescript
// Registration
POST /api/auth/register
Body: { username, email, password }

// Login
POST /api/auth/login
Body: { usernameOrEmail, password }

// Logout
POST /api/auth/logout
Headers: Authorization

// Change Password
POST /api/change-password
Headers: Authorization
Body: { oldPassword, newPassword }

// Delete Account
DELETE /api/delete-account
Headers: Authorization
```

### Chat Routes
```typescript
// Get Chat History
GET /api/chat/history
Headers: Authorization

// Send Message
POST /api/chat/message
Headers: Authorization
Body: { text }
```

## Middleware

### Authentication Middleware
```typescript
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.auth_token || 
      req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
```

### Error Handling Middleware
```typescript
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
```

## Database Schema

### User Table
```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### Chat Messages Table
```typescript
export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  content: text('content').notNull(),
  sender: text('sender').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
});
```

## Services

### Auth Service
```typescript
class AuthService {
  async register(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
    });
    return this.generateToken(user);
  }

  async login(usernameOrEmail: string, password: string) {
    const user = await this.findUser(usernameOrEmail);
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    return this.generateToken(user);
  }

  private generateToken(user: User) {
    return jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
  }
}
```

### Chat Service
```typescript
class ChatService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async sendMessage(userId: number, text: string) {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent([text]);
    const reply = result.response.text();

    await db.insert(chatMessages).values({
      userId,
      content: text,
      sender: 'user',
    });

    await db.insert(chatMessages).values({
      userId,
      content: reply,
      sender: 'bot',
    });

    return { reply };
  }
}
```

## Configuration

### Environment Variables
```env
# Server
PORT=5001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT
JWT_SECRET=your-secret-key

# AI
GEMINI_API_KEY=your-gemini-api-key

# Client
CLIENT_URL=http://localhost:5173
```

### Database Configuration
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool);
```

## Security Measures

### CORS Configuration
```typescript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Input Validation
```typescript
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid input' });
  }
};
```

## Error Handling

### Custom Error Classes
```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
    this.name = 'ValidationError';
  }
}
```

### Error Handler
```typescript
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  console.error(err);
  res.status(500).json({
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

## Testing

### Unit Tests
```typescript
describe('AuthService', () => {
  it('should register a new user', async () => {
    const service = new AuthService();
    const result = await service.register('test', 'test@test.com', 'password');
    expect(result).toHaveProperty('token');
  });
});
```

### Integration Tests
```typescript
describe('Auth API', () => {
  it('should register and login user', async () => {
    const register = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'test',
        email: 'test@test.com',
        password: 'password'
      });
    expect(register.status).toBe(201);

    const login = await request(app)
      .post('/api/auth/login')
      .send({
        usernameOrEmail: 'test',
        password: 'password'
      });
    expect(login.status).toBe(200);
  });
});
```

## Performance Optimization

### Caching
```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

const cacheMiddleware = (duration: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    res.sendResponse = res.json;
    res.json = (body: any) => {
      cache.set(key, body, duration);
      return res.sendResponse(body);
    };
    next();
  };
};
```

### Database Optimization
```typescript
// Index creation
await db.execute(sql`
  CREATE INDEX idx_chat_messages_user_id 
  ON chat_messages(user_id);
`);

// Query optimization
const getChatHistory = async (userId: number) => {
  return await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, userId))
    .orderBy(desc(chatMessages.timestamp))
    .limit(50);
};
```

## Monitoring and Logging

### Request Logging
```typescript
import morgan from 'morgan';

app.use(morgan('combined', {
  stream: {
    write: (message) => {
      logger.info(message.trim());
    }
  }
}));
```

### Error Logging
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Deployment

### Production Configuration
```typescript
const productionConfig = {
  port: process.env.PORT || 5001,
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  },
  database: {
    pool: {
      max: 20,
      idleTimeoutMillis: 30000
    }
  },
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  }
};
```

### Health Check
```typescript
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
``` 