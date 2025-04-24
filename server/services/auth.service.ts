import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users, sessions, type NewUser } from '../db/schema';
import { eq } from 'drizzle-orm';

// JWT configurations
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-jwt-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

export class AuthService {
  // Register a new user
  async register(username: string, email: string, password: string) {
    try {
      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: (users, { or }) => or(
          eq(users.username, username),
          eq(users.email, email)
        )
      });

      if (existingUser) {
        throw new Error('User with this username or email already exists');
      }

      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create the user
      const newUser: NewUser = {
        username,
        email,
        passwordHash,
      };

      const [createdUser] = await db.insert(users).values(newUser).returning();
      
      // Generate token
      const token = this.generateToken(createdUser.id);
      
      // Store the session
      await this.createSession(createdUser.id, token);

      return {
        user: {
          id: createdUser.id,
          username: createdUser.username,
          email: createdUser.email,
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Login a user
  async login(usernameOrEmail: string, password: string) {
    try {
      // Find the user
      const user = await db.query.users.findFirst({
        where: (users, { or }) => or(
          eq(users.username, usernameOrEmail),
          eq(users.email, usernameOrEmail)
        )
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate token
      const token = this.generateToken(user.id);
      
      // Store the session
      await this.createSession(user.id, token);

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Logout (invalidate token)
  async logout(token: string) {
    try {
      // Find and invalidate the session
      const [session] = await db
        .update(sessions)
        .set({ isRevoked: true })
        .where(eq(sessions.token, token))
        .returning();

      return !!session;
    } catch (error) {
      throw error;
    }
  }

  // Verify a token
  async verifyToken(token: string) {
    try {
      // Decode the token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      
      // Check if token is in the sessions table and not revoked
      const session = await db.query.sessions.findFirst({
        where: (sessions, { and }) => and(
          eq(sessions.token, token),
          eq(sessions.isRevoked, false),
          eq(sessions.userId, decoded.userId)
        )
      });

      if (!session || new Date(session.expiresAt) < new Date()) {
        throw new Error('Invalid or expired token');
      }

      // Get the user
      const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.userId)
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    } catch (error) {
      throw error;
    }
  }

  // Generate JWT token
  private generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  // Store session in database
  private async createSession(userId: number, token: string) {
    // Calculate expiry date
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24); // 24 hours from now

    // Create session record
    await db.insert(sessions).values({
      userId,
      token,
      expiresAt: expiry,
      isRevoked: false,
    });
  }

  /** Change the current user’s password */
  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    // 1) Fetch the user’s record
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });
    if (!user) {
      throw new Error('User not found');
    }

    // 2) Verify the old password
    const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // 3) Hash the new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // 4) Update the database
    await db.update(users)
      .set({ passwordHash: newHash })
      .where(eq(users.id, userId));
  }

  /** Permanently delete the user’s account and any related data */
  async deleteAccount(userId: number) {
    // 1) Delete all sessions for this user
    console.log(`Deleting sessions for user ${userId}`);
    await db
      .delete(sessions)
      .where(eq(sessions.userId, userId));

    // 2) (Optional) delete other related data here…

    // 3) Finally delete the user record
    console.log(`Deleting user ${userId}`);
    await db
      .delete(users)
      .where(eq(users.id, userId));
  }

}

export const authService = new AuthService();