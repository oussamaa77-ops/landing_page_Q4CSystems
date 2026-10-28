import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Missing configuration must not crash the API at import time: the contact
// route still emails demo requests when the database is unavailable, and
// each query fails (and is caught) on its own.
if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set: database queries will fail. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export * from "./schema";
