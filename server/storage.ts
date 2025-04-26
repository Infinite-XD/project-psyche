import { db } from './db';
import { users, sessions } from './db/schema';
import { eq } from 'drizzle-orm';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}


export const storage = {
  // User operations
  async getUserById(id: number) {
    return db.query.users.findFirst({
      where: eq(users.id, id)
    });
  },
  
  async getUserByUsername(username: string) {
    return db.query.users.findFirst({
      where: eq(users.username, username)
    });
  },
  
  async getUserByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email)
    });
  },
  
  // Session operations
  async getSession(token: string) {
    return db.query.sessions.findFirst({
      where: eq(sessions.token, token)
    });
  },
  
  async invalidateSession(token: string) {
    return db
      .update(sessions)
      .set({ isRevoked: true })
      .where(eq(sessions.token, token));
  },

  // Other operations can be added as needed

  chatLogs: new Map<number, ChatMessage[]>(),

  lastSeen: new Map<number, number>(),
};