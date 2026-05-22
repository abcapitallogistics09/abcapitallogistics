import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const aiKnowledge = pgTable("ai_knowledge", {
  id: serial("id").primaryKey(),
  category: text("category").notNull().default("General"),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type AiKnowledgeEntry = typeof aiKnowledge.$inferSelect;
