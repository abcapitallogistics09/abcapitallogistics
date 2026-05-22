import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, quotesTable, contactsTable, blogPostsTable, jobsTable, galleryItemsTable, conversations, messages, aiSettings, aiKnowledge, adminUsers } from "@workspace/db";
import { desc, count, gte, eq, and, asc, sql } from "drizzle-orm";
import { createSession, getSession, validateSession, destroySession } from "../lib/adminSession";
import { hashPassword, verifyPassword } from "../lib/passwordHash";

// All assignable section keys (super_admin implicitly has everything)
const ALL_SECTIONS = ["dashboard", "quotes_crm", "contacts", "blog", "gallery", "jobs", "quotations", "charges", "ai"];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [...ALL_SECTIONS],
  staff: ["dashboard", "quotes_crm", "contacts", "quotations"],
};

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies;
  const token = cookies?.["admin_session"];
  const session = token ? getSession(token) : null;
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as Request & { __adminSession?: typeof session }).__adminSession = session;
  next();
}

function requireSuperAdmin(req: Request, res: Response, next: NextFunction): void {
  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies;
  const token = cookies?.["admin_session"];
  const session = token ? getSession(token) : null;
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (session.role !== "super_admin") { res.status(403).json({ error: "Forbidden: Super admin only" }); return; }
  next();
}

router.post("/admin/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body as { username: string; password: string };
  if (!username || !password) { res.status(400).json({ error: "Username and password required" }); return; }

  const inputUser = username.trim();
  const inputPass = password.trim();

  // ── 1. Check DB users first ──────────────────────────────────────────────
  const [dbUser] = await db.select().from(adminUsers).where(eq(adminUsers.username, inputUser)).limit(1);
  if (dbUser) {
    if (!dbUser.active) { res.status(401).json({ error: "Account is disabled" }); return; }
    if (!verifyPassword(inputPass, dbUser.passwordHash)) { res.status(401).json({ error: "Invalid credentials" }); return; }
    const permissions: string[] = JSON.parse(dbUser.permissions) as string[];
    const token = createSession({ username: dbUser.username, role: dbUser.role, permissions, userId: dbUser.id });
    res.cookie("admin_session", token, { httpOnly: true, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000, path: "/" });
    req.log.info({ username: dbUser.username, role: dbUser.role }, "Admin (DB user) login");
    res.json({ success: true });
    return;
  }

  // ── 2. Fall back to super_admin env vars ─────────────────────────────────
  const ADMIN_USERNAME = process.env["ADMIN_USERNAME"];
  const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"];
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    res.status(500).json({ error: "Admin credentials not configured" }); return;
  }
  // ADMIN_PASSWORD holds the username; ADMIN_USERNAME holds the password (intentional swap)
  const storedUser = ADMIN_PASSWORD.trim();
  const storedPass = ADMIN_USERNAME.trim();
  if (inputUser !== storedUser || inputPass !== storedPass) {
    res.status(401).json({ error: "Invalid credentials" }); return;
  }
  const token = createSession({ username: storedUser, role: "super_admin", permissions: [...ALL_SECTIONS, "users"], userId: null });
  res.cookie("admin_session", token, { httpOnly: true, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000, path: "/" });
  req.log.info({ username: storedUser }, "Super admin login");
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
  const session = token ? getSession(token) : null;
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  res.json({
    authenticated: true,
    username: session.username,
    role: session.role,
    permissions: session.permissions,
  });
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
  const { slug, title, category, excerpt, content, author, readTime, imageUrl, featured, published,
    metaTitle, metaDescription, focusKeyword, canonicalUrl, ogImageUrl, tags } = req.body as Record<string, unknown>;
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
    metaTitle: metaTitle ? String(metaTitle) : null,
    metaDescription: metaDescription ? String(metaDescription) : null,
    focusKeyword: focusKeyword ? String(focusKeyword) : null,
    canonicalUrl: canonicalUrl ? String(canonicalUrl) : null,
    ogImageUrl: ogImageUrl ? String(ogImageUrl) : null,
    tags: tags ? String(tags) : null,
  }).returning();
  req.log.info({ id: post?.id }, "Blog post created");
  res.status(201).json(post);
});

router.put("/admin/blog-posts/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params["id"] ?? ""));
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { slug, title, category, excerpt, content, author, readTime, imageUrl, featured, published,
    metaTitle, metaDescription, focusKeyword, canonicalUrl, ogImageUrl, tags } = req.body as Record<string, unknown>;
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
      metaTitle: metaTitle !== undefined ? (metaTitle ? String(metaTitle) : null) : undefined,
      metaDescription: metaDescription !== undefined ? (metaDescription ? String(metaDescription) : null) : undefined,
      focusKeyword: focusKeyword !== undefined ? (focusKeyword ? String(focusKeyword) : null) : undefined,
      canonicalUrl: canonicalUrl !== undefined ? (canonicalUrl ? String(canonicalUrl) : null) : undefined,
      ogImageUrl: ogImageUrl !== undefined ? (ogImageUrl ? String(ogImageUrl) : null) : undefined,
      tags: tags !== undefined ? (tags ? String(tags) : null) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(blogPostsTable.id, id))
    .returning();
  if (!post) { res.status(404).json({ error: "Not found" }); return; }
  res.json(post);
});

router.delete("/admin/blog-posts/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params["id"] ?? ""));
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
  res.json({ success: true });
});

router.get("/admin/jobs", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  const jobs = await db.select().from(jobsTable).orderBy(desc(jobsTable.createdAt));
  res.json(jobs);
});

router.post("/admin/jobs", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { title, type, location, department, description, requirements, active,
    salary, experienceLevel, applicationEmail, closingDate, benefits } = req.body as Record<string, unknown>;
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
    salary: salary ? String(salary) : null,
    experienceLevel: experienceLevel ? String(experienceLevel) : null,
    applicationEmail: applicationEmail ? String(applicationEmail) : null,
    closingDate: closingDate ? String(closingDate) : null,
    benefits: benefits ? String(benefits) : null,
  }).returning();
  req.log.info({ id: job?.id }, "Job created");
  res.status(201).json(job);
});

router.put("/admin/jobs/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params["id"] ?? ""));
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { title, type, location, department, description, requirements, active,
    salary, experienceLevel, applicationEmail, closingDate, benefits } = req.body as Record<string, unknown>;
  const [job] = await db.update(jobsTable)
    .set({
      title: title ? String(title) : undefined,
      type: type ? String(type) : undefined,
      location: location ? String(location) : undefined,
      department: department ? String(department) : undefined,
      description: description ? String(description) : undefined,
      requirements: requirements !== undefined ? String(requirements) : undefined,
      active: active !== undefined ? Boolean(active) : undefined,
      salary: salary !== undefined ? (salary ? String(salary) : null) : undefined,
      experienceLevel: experienceLevel !== undefined ? (experienceLevel ? String(experienceLevel) : null) : undefined,
      applicationEmail: applicationEmail !== undefined ? (applicationEmail ? String(applicationEmail) : null) : undefined,
      closingDate: closingDate !== undefined ? (closingDate ? String(closingDate) : null) : undefined,
      benefits: benefits !== undefined ? (benefits ? String(benefits) : null) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(jobsTable.id, id))
    .returning();
  if (!job) { res.status(404).json({ error: "Not found" }); return; }
  res.json(job);
});

router.delete("/admin/jobs/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params["id"] ?? ""));
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
    .where(and(eq(blogPostsTable.slug, String(req.params["slug"] ?? "")), eq(blogPostsTable.published, true)));
  if (!post) { res.status(404).json({ error: "Not found" }); return; }
  res.json(post);
});

router.get("/jobs", async (_req: Request, res: Response): Promise<void> => {
  const jobs = await db.select().from(jobsTable).where(eq(jobsTable.active, true)).orderBy(desc(jobsTable.createdAt));
  res.json(jobs);
});

export default router;

// ─── Gallery Items ─────────────────────────────────────────────────────────────

router.get("/admin/gallery-items", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  const items = await db.select().from(galleryItemsTable).orderBy(asc(galleryItemsTable.sortOrder), desc(galleryItemsTable.createdAt));
  res.json(items);
});

router.get("/admin/gallery-items/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const [item] = await db.select().from(galleryItemsTable).where(eq(galleryItemsTable.id, parseInt(String(req.params["id"]))));
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(item);
});

router.post("/admin/gallery-items", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const body = req.body as {
    title: string; category: string; mediaType?: string; url: string;
    thumbUrl?: string | null; location?: string | null; sortOrder?: number; published?: boolean;
  };
  const [item] = await db.insert(galleryItemsTable).values({
    title: body.title,
    category: body.category,
    mediaType: body.mediaType ?? "image",
    url: body.url,
    thumbUrl: body.thumbUrl ?? null,
    location: body.location ?? null,
    sortOrder: body.sortOrder ?? 0,
    published: body.published ?? true,
  }).returning();
  res.status(201).json(item);
});

router.put("/admin/gallery-items/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params["id"]));
  const body = req.body as Partial<{
    title: string; category: string; mediaType: string; url: string;
    thumbUrl: string | null; location: string | null; sortOrder: number; published: boolean;
  }>;
  const [item] = await db.update(galleryItemsTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(galleryItemsTable.id, id))
    .returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(item);
});

router.delete("/admin/gallery-items/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params["id"]));
  await db.delete(galleryItemsTable).where(eq(galleryItemsTable.id, id));
  res.status(204).send();
});

// ─── Public gallery ────────────────────────────────────────────────────────────

router.get("/gallery-items", async (_req: Request, res: Response): Promise<void> => {
  const items = await db.select().from(galleryItemsTable)
    .where(eq(galleryItemsTable.published, true))
    .orderBy(asc(galleryItemsTable.sortOrder), desc(galleryItemsTable.createdAt));
  res.json(items);
});

// ─── AI Conversations ──────────────────────────────────────────────────────────

router.get("/admin/ai/conversations", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  const rows = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      createdAt: conversations.createdAt,
      messageCount: count(messages.id),
    })
    .from(conversations)
    .leftJoin(messages, eq(messages.conversationId, conversations.id))
    .groupBy(conversations.id)
    .orderBy(desc(conversations.createdAt));

  // Fetch first user message per conversation
  const firstMsgs = await db
    .select({ conversationId: messages.conversationId, content: messages.content })
    .from(messages)
    .where(eq(messages.role, "user"))
    .orderBy(asc(messages.createdAt));

  const firstByConv = new Map<number, string>();
  for (const m of firstMsgs) {
    if (!firstByConv.has(m.conversationId)) firstByConv.set(m.conversationId, m.content);
  }

  res.json(rows.map((r) => ({ ...r, firstUserMessage: firstByConv.get(r.id) ?? null })));
});

router.get("/admin/ai/conversations/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params["id"]));
  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) { res.status(404).json({ error: "Not found" }); return; }
  const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(asc(messages.createdAt));
  res.json({ ...conv, messages: msgs });
});

router.delete("/admin/ai/conversations/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params["id"]));
  await db.delete(conversations).where(eq(conversations.id, id));
  res.status(204).send();
});

// ─── AI Settings ───────────────────────────────────────────────────────────────

const DEFAULT_SYSTEM_PROMPT = `You are the AI logistics assistant for AB Capital Logistics, a premier freight forwarding company based in Douala, Cameroon, serving Central Africa and beyond.

Your role is to help visitors with:
- Information about services: Air Freight, Ocean Freight, Road Freight, Customs Clearance, Warehousing, 3PL Solutions, and Ship Agency
- Shipping routes, transit times, and trade lanes (especially Cameroon, Central Africa, Dubai, China, Europe)
- Customs procedures and documentation for imports/exports through Douala Port
- Getting a freight quote (direct them to /quote or offer to collect details)
- Shipment tracking (direct them to /tracking with tracking number ABCL-XXXX format)
- Contact and office information:
  - Address: 3MGF+F5M Bonabéri, Douala, Cameroon
  - Phone: +237 677-238-818
  - Email: info@abcapitallogistics.com
  - WhatsApp: +237 677-238-818
- Industries served: Oil & Gas, FMCG, Telecom, Agriculture, Mining, Healthcare, Retail, Manufacturing, Construction

Be warm, professional, and concise. If you don't know something specific (like real-time rates), acknowledge it and offer to connect them with the team via WhatsApp or the contact form. Always offer to help with related logistics questions. Keep responses focused and practical — this is a business context.

When users want a quote, ask for: origin, destination, freight type (air/sea/road), cargo description, and approximate weight/volume.`;

router.get("/admin/ai/settings", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  const [row] = await db.select().from(aiSettings).where(eq(aiSettings.key, "system_prompt"));
  res.json({ systemPrompt: row?.value ?? DEFAULT_SYSTEM_PROMPT });
});

router.put("/admin/ai/settings", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { systemPrompt } = req.body as { systemPrompt: string };
  if (typeof systemPrompt !== "string") { res.status(400).json({ error: "systemPrompt required" }); return; }
  await db
    .insert(aiSettings)
    .values({ key: "system_prompt", value: systemPrompt })
    .onConflictDoUpdate({ target: aiSettings.key, set: { value: systemPrompt, updatedAt: new Date() } });
  res.json({ success: true });
});

// ─── AI Knowledge Base ─────────────────────────────────────────────────────────

router.get("/admin/ai/knowledge", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  const entries = await db.select().from(aiKnowledge).orderBy(asc(aiKnowledge.category), desc(aiKnowledge.createdAt));
  res.json(entries);
});

router.post("/admin/ai/knowledge", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const body = req.body as { category?: string; question: string; answer: string; active?: boolean };
  const [entry] = await db.insert(aiKnowledge).values({
    category: body.category ?? "General",
    question: body.question,
    answer: body.answer,
    active: body.active ?? true,
  }).returning();
  res.status(201).json(entry);
});

router.put("/admin/ai/knowledge/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params["id"]));
  const body = req.body as Partial<{ category: string; question: string; answer: string; active: boolean }>;
  const [entry] = await db.update(aiKnowledge)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(aiKnowledge.id, id))
    .returning();
  if (!entry) { res.status(404).json({ error: "Not found" }); return; }
  res.json(entry);
});

router.delete("/admin/ai/knowledge/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params["id"]));
  await db.delete(aiKnowledge).where(eq(aiKnowledge.id, id));
  res.status(204).send();
});

// ─── Admin Users CRUD (super_admin only) ───────────────────────────────────────

router.get("/admin/users", requireSuperAdmin, async (_req: Request, res: Response): Promise<void> => {
  const rows = await db.select({
    id: adminUsers.id,
    username: adminUsers.username,
    email: adminUsers.email,
    role: adminUsers.role,
    permissions: adminUsers.permissions,
    active: adminUsers.active,
    createdAt: adminUsers.createdAt,
  }).from(adminUsers).orderBy(desc(adminUsers.createdAt));
  res.json(rows);
});

router.post("/admin/users", requireSuperAdmin, async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, role, permissions, active } = req.body as {
    username: string; email?: string; password: string;
    role: string; permissions: string; active?: boolean;
  };
  if (!username || !password) { res.status(400).json({ error: "Username and password are required" }); return; }
  const [existing] = await db.select({ id: adminUsers.id }).from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
  if (existing) { res.status(409).json({ error: "Username already exists" }); return; }
  const passwordHash = hashPassword(password);
  const [created] = await db.insert(adminUsers).values({
    username: username.trim(),
    email: email?.trim() ?? null,
    passwordHash,
    role: role ?? "staff",
    permissions: permissions ?? "[]",
    active: active ?? true,
  }).returning();
  res.status(201).json(created);
});

router.put("/admin/users/:id", requireSuperAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params["id"]);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { username, email, password, role, permissions, active } = req.body as {
    username?: string; email?: string; password?: string;
    role?: string; permissions?: string; active?: boolean;
  };
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (username !== undefined) updates["username"] = username.trim();
  if (email !== undefined) updates["email"] = email.trim() || null;
  if (password) updates["passwordHash"] = hashPassword(password);
  if (role !== undefined) updates["role"] = role;
  if (permissions !== undefined) updates["permissions"] = permissions;
  if (active !== undefined) updates["active"] = active;
  const [updated] = await db.update(adminUsers).set(updates).where(eq(adminUsers.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "User not found" }); return; }
  res.json(updated);
});

router.delete("/admin/users/:id", requireSuperAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params["id"]);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(adminUsers).where(eq(adminUsers.id, id));
  res.json({ success: true });
});

// ─── Public: AI settings for openai route ─────────────────────────────────────

router.get("/ai/system-context", async (_req: Request, res: Response): Promise<void> => {
  const [promptRow] = await db.select().from(aiSettings).where(eq(aiSettings.key, "system_prompt"));
  const knowledgeRows = await db.select().from(aiKnowledge).where(eq(aiKnowledge.active, true)).orderBy(asc(aiKnowledge.category));
  res.json({ systemPrompt: promptRow?.value ?? null, knowledge: knowledgeRows });
});
