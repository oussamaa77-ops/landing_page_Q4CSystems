import {
  boolean,
  index,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const demoRequestsTable = pgTable(
  "demo_requests",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    organization: text("organization").notNull(),
    interest: text("interest"),
    message: text("message"),
    // SHA-256 of the visitor IP, only used for rate limiting.
    ipHash: text("ip_hash").notNull(),
    emailSent: boolean("email_sent").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("demo_requests_ip_hash_created_at_idx").on(
      table.ipHash,
      table.createdAt,
    ),
  ],
);

export const insertDemoRequestSchema = createInsertSchema(
  demoRequestsTable,
).omit({ id: true, emailSent: true, createdAt: true });
export type InsertDemoRequest = z.infer<typeof insertDemoRequestSchema>;
export type DemoRequest = typeof demoRequestsTable.$inferSelect;
