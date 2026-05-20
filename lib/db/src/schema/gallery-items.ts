import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galleryItemsTable = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  mediaType: text("media_type").notNull().default("image"),
  url: text("url").notNull(),
  thumbUrl: text("thumb_url"),
  location: text("location"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItemsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryItemDb = typeof galleryItemsTable.$inferSelect;
