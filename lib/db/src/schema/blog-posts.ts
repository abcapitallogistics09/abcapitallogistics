import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull().default("AB Capital Logistics"),
  readTime: text("read_time").notNull().default("5 min read"),
  imageUrl: text("image_url"),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  focusKeyword: text("focus_keyword"),
  canonicalUrl: text("canonical_url"),
  ogImageUrl: text("og_image_url"),
  tags: text("tags"),
});

export const insertBlogPostSchema = createInsertSchema(blogPostsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPostDb = typeof blogPostsTable.$inferSelect;
