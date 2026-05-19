import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, quotesTable, contactsTable, blogPostsTable, jobsTable } from "@workspace/db";
import { desc, count, gte, eq, and } from "drizzle-orm";
import { createSession, validateSession, destroySession } from "../lib/adminSession";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies;
  const token = cookies?.["admin_session"];
  if (!token || !validateSession(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/admin/login", (req: Request, res: Response): void => {
  const { username, password } = req.body as { username: string; password: string };
  const ADMIN_USERNAME = process.env["ADMIN_USERNAME"];
  const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"];

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    res.status(500).json({ error: "Admin credentials not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD env vars." });
    return;
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = createSession();
  res.cookie("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });
  req.log.info({ username }, "Admin login");
  res.json({ success: true });
});

router.post("/admin/logout", (req: Request, res: Response): void => {
  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies;
  const token = cookies?.["admin_session"];
  if (token) destroySession(token);
  res.clearCookie("admin_session", { path: "/" });
  res.json({ success: true });
});

router.get("/admin/me", (req: Request, res: Response): void => {
  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies;
  const token = cookies?.["admin_session"];
  if (!token || !validateSession(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({ authenticated: true, username: process.env["ADMIN_USERNAME"] });
});

router.get("/admin/stats", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [quotesTotal] = await db.select({ count: count() }).from(quotesTable);
  const [contactsTotal] = await db.select({ count: count() }).from(contactsTable);
  const [quotesWeek] = await db.select({ count: count() }).from(quotesTable).where(gte(quotesTable.createdAt, weekAgo));
  const [contactsWeek] = await db.select({ count: count() }).from(contactsTable).where(gte(contactsTable.createdAt, weekAgo));
  const [blogTotal] = await db.select({ count: count() }).from(blogPostsTable);
  const [jobsActive] = await db.select({ count: count() }).from(jobsTable).where(eq(jobsTable.active, true));

  res.json({
    quotes: { total: Number(quotesTotal?.count ?? 0), week: Number(quotesWeek?.count ?? 0) },
    contacts: { total: Number(contactsTotal?.count ?? 0), week: Number(contactsWeek?.count ?? 0) },
    blogPosts: { total: Number(blogTotal?.count ?? 0) },
    jobs: { active: Number(jobsActive?.count ?? 0) },
  });
});

router.get("/admin/quotes", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  const quotes = await db.select().from(quotesTable).orderBy(desc(quotesTable.createdAt));
  res.json(quotes);
});

router.get("/admin/contacts", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  const contacts = await db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
  res.json(contacts);
});

router.get("/admin/blog-posts", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  const posts = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.createdAt));
  res.json(posts);
});

router.post("/admin/blog-posts", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { slug, title, category, excerpt, content, author, readTime, imageUrl, featured, published } = req.body as Record<string, unknown>;
  if (!slug || !title || !category || !excerpt || !content) {
    res.status(400).json({ error: "slug, title, category, excerpt, and content are required" });
    return;
  }
  const [post] = await db.insert(blogPostsTable).values({
    slug: String(slug),
    title: String(title),
    category: String(category),
    excerpt: String(excerpt),
    content: String(content),
    author: author ? String(author) : "AB Capital Logistics",
    readTime: readTime ? String(readTime) : "5 min read",
    imageUrl: imageUrl ? String(imageUrl) : null,
    featured: Boolean(featured ?? false),
    published: Boolean(published ?? true),
  }).returning();
  req.log.info({ id: post?.id }, "Blog post created");
  res.status(201).json(post);
});

router.put("/admin/blog-posts/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params["id"] ?? "");
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { slug, title, category, excerpt, content, author, readTime, imageUrl, featured, published } = req.body as Record<string, unknown>;
  const [post] = await db.update(blogPostsTable)
    .set({
      slug: slug ? String(slug) : undefined,
      title: title ? String(title) : undefined,
      category: category ? String(category) : undefined,
      excerpt: excerpt ? String(excerpt) : undefined,
      content: content ? String(content) : undefined,
      author: author ? String(author) : undefined,
      readTime: readTime ? String(readTime) : undefined,
      imageUrl: imageUrl !== undefined ? (imageUrl ? String(imageUrl) : null) : undefined,
      featured: featured !== undefined ? Boolean(featured) : undefined,
      published: published !== undefined ? Boolean(published) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(blogPostsTable.id, id))
    .returning();
  if (!post) { res.status(404).json({ error: "Not found" }); return; }
  res.json(post);
});

router.delete("/admin/blog-posts/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params["id"] ?? "");
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
  res.json({ success: true });
});

router.get("/admin/jobs", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  const jobs = await db.select().from(jobsTable).orderBy(desc(jobsTable.createdAt));
  res.json(jobs);
});

router.post("/admin/jobs", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { title, type, location, department, description, requirements, active } = req.body as Record<string, unknown>;
  if (!title || !location || !department || !description) {
    res.status(400).json({ error: "title, location, department, and description are required" });
    return;
  }
  const [job] = await db.insert(jobsTable).values({
    title: String(title),
    type: type ? String(type) : "Full-Time",
    location: String(location),
    department: String(department),
    description: String(description),
    requirements: requirements ? String(requirements) : "",
    active: Boolean(active ?? true),
  }).returning();
  req.log.info({ id: job?.id }, "Job created");
  res.status(201).json(job);
});

router.put("/admin/jobs/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params["id"] ?? "");
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { title, type, location, department, description, requirements, active } = req.body as Record<string, unknown>;
  const [job] = await db.update(jobsTable)
    .set({
      title: title ? String(title) : undefined,
      type: type ? String(type) : undefined,
      location: location ? String(location) : undefined,
      department: department ? String(department) : undefined,
      description: description ? String(description) : undefined,
      requirements: requirements !== undefined ? String(requirements) : undefined,
      active: active !== undefined ? Boolean(active) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(jobsTable.id, id))
    .returning();
  if (!job) { res.status(404).json({ error: "Not found" }); return; }
  res.json(job);
});

router.delete("/admin/jobs/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params["id"] ?? "");
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(jobsTable).where(eq(jobsTable.id, id));
  res.json({ success: true });
});

router.get("/blog", async (_req: Request, res: Response): Promise<void> => {
  const posts = await db.select({
    id: blogPostsTable.id,
    slug: blogPostsTable.slug,
    title: blogPostsTable.title,
    category: blogPostsTable.category,
    excerpt: blogPostsTable.excerpt,
    author: blogPostsTable.author,
    readTime: blogPostsTable.readTime,
    imageUrl: blogPostsTable.imageUrl,
    featured: blogPostsTable.featured,
    publishedAt: blogPostsTable.publishedAt,
  }).from(blogPostsTable)
    .where(and(eq(blogPostsTable.published, true)))
    .orderBy(desc(blogPostsTable.publishedAt));
  res.json(posts);
});

router.get("/blog/:slug", async (req: Request, res: Response): Promise<void> => {
  const [post] = await db.select().from(blogPostsTable)
    .where(and(eq(blogPostsTable.slug, req.params["slug"] ?? ""), eq(blogPostsTable.published, true)));
  if (!post) { res.status(404).json({ error: "Not found" }); return; }
  res.json(post);
});

router.get("/jobs", async (_req: Request, res: Response): Promise<void> => {
  const jobs = await db.select().from(jobsTable).where(eq(jobsTable.active, true)).orderBy(desc(jobsTable.createdAt));
  res.json(jobs);
});

export default router;
