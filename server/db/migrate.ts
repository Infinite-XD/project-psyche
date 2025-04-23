import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, testConnection } from './index';

async function main() {
  // Test the database connection
  const connected = await testConnection();
  if (!connected) {
    console.error('Aborting migration: Database connection failed');
    process.exit(1);
  }

  // Run migrations
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './server/db/migrations' });
  console.log('Migrations completed');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});