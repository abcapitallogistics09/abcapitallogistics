import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull().default("Full-Time"),
  location: text("location").notNull(),
  department: text("department").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull().default(""),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // Extended fields
  salary: text("salary"),
  experienceLevel: text("experience_level"),
  applicationEmail: text("application_email"),
  closingDate: text("closing_date"),
  benefits: text("benefits"),
});

export const insertJobSchema = createInsertSchema(jobsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobsTable.$inferSelect;
