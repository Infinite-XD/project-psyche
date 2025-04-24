import type { Express } from "express";
import { createServer, type Server } from "http";
import { authService } from "./services/auth.service";
import { authMiddleware, optionalAuthMiddleware } from "./middleware/auth.middleware";
import { storage } from "./storage";
import cookieParser from "cookie-parser";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add cookie parser middleware
  app.use(cookieParser());

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
      }
      
      const result = await authService.register(username, email, password);
      
      // Set token in HTTP-only cookie for better security
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      return res.status(201).json({
        message: 'User registered successfully',
        user: result.user
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body;
      
      if (!usernameOrEmail || !password) {
        return res.status(400).json({ message: 'Username/email and password are required' });
      }
      
      const result = await authService.login(usernameOrEmail, password);
      
      // Set token in HTTP-only cookie
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      return res.status(200).json({
        message: 'Login successful',
        user: result.user
      });
    } catch (error: any) {
      return res.status(401).json({ message: error.message || 'Invalid credentials' });
    }
  });
  
  app.post('/api/auth/logout', async (req, res) => {
    try {
      const token = req.cookies.auth_token || 
                   (req.headers.authorization?.startsWith('Bearer ') 
                     ? req.headers.authorization.split(' ')[1] 
                     : null);
      
      if (token) {
        await authService.logout(token);
      }
      
      // Clear the cookie
      res.clearCookie('auth_token');
      
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
  });
  
  // Protected route example
  app.get('/api/profile', authMiddleware, async (req, res) => {
    return res.json({
      message: 'Protected route accessed successfully',
      user: req.user
    });
  });
  
  // Public route with optional auth
  app.get('/api/public-data', optionalAuthMiddleware, async (req, res) => {
    // If authenticated, req.user will contain the user info
    const greeting = req.user 
      ? `Hello, ${req.user.username}!` 
      : 'Hello, guest!';
      
    return res.json({
      message: greeting,
      publicData: 'This is public data that anyone can access'
    });
  });

app.post(
  '/api/change-password',
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user!.id;
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Both old and new passwords are required' });
      }
      await authService.changePassword(userId, oldPassword, newPassword);
      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
);

// Delete account endpoint
app.delete(
  '/api/delete-account',
  authMiddleware,
  async (req, res) => {
    const userId = req.user!.id;
    console.log(`→ [Route] Received delete-account for user ${userId}`);
    try {
      await authService.deleteAccount(userId);
      console.log(`→ [Route] deleteAccount succeeded for user ${userId}`);
      res.clearCookie('auth_token');
      return res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err: any) {
      console.error(`→ [Route] deleteAccount FAILED for user ${userId}:`, err);
      return res.status(400).json({ message: err.message });
    }
  }
);


  const httpServer = createServer(app);
  return httpServer;
}