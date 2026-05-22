import { pgTable, serial, text, numeric, boolean } from "drizzle-orm/pg-core";

export const charges = pgTable("charges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  isOptional: boolean("is_optional").notNull().default(true),
  isDefault: boolean("is_default").notNull().default(true),
  editable: boolean("editable").notNull().default(false),
  active: boolean("active").notNull().default(true),
});

export type Charge = typeof charges.$inferSelect;
