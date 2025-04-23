// server/db/drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: "server/db/schema.ts", // Full path to schema
  out: "server/db/migrations",   // Full path to migrations
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
} satisfies Config;
