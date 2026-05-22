import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const quotations = pgTable("quotations", {
  id: serial("id").primaryKey(),
  refNumber: text("ref_number").notNull().unique(),
  // Customer
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  customerCompany: text("customer_company"),
  // Shipment
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  mode: text("mode").notNull(), // air | sea_lcl | sea_fcl | clearance_only
  incoterm: text("incoterm"),
  cargoType: text("cargo_type"),
  weight: numeric("weight", { precision: 10, scale: 2 }),
  volume: numeric("volume", { precision: 10, scale: 2 }),
  containerType: text("container_type"), // 20ft | 40ft | 40hq
  // Pricing
  currency: text("currency").notNull().default("USD"),
  marginType: text("margin_type").notNull().default("percentage"), // percentage | fixed
  marginValue: numeric("margin_value", { precision: 10, scale: 2 }).notNull().default("0"),
  manualTotal: numeric("manual_total", { precision: 10, scale: 2 }).notNull().default("0"),
  systemTotal: numeric("system_total", { precision: 10, scale: 2 }).notNull().default("0"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull().default("0"),
  marginAmount: numeric("margin_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }).notNull().default("0"),
  // Meta
  status: text("status").notNull().default("draft"), // draft | sent | accepted | rejected
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Quotation = typeof quotations.$inferSelect;
