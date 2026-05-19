import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const quotesTable = pgTable("quotes", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company"),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  freightType: text("freight_type").notNull(),
  cargoType: text("cargo_type").notNull(),
  weight: text("weight").notNull(),
  volume: text("volume"),
  incoterms: text("incoterms"),
  hazardous: boolean("hazardous").notNull().default(false),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuoteSchema = createInsertSchema(quotesTable).omit({ id: true, createdAt: true });
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotesTable.$inferSelect;
