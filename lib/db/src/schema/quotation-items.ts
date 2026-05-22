import { pgTable, serial, integer, text, numeric } from "drizzle-orm/pg-core";
import { quotations } from "./quotations";

export const quotationItems = pgTable("quotation_items", {
  id: serial("id").primaryKey(),
  quotationId: integer("quotation_id")
    .notNull()
    .references(() => quotations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  // source: freight | duties | other | system
  source: text("source").notNull(),
});

export type QuotationItem = typeof quotationItems.$inferSelect;
