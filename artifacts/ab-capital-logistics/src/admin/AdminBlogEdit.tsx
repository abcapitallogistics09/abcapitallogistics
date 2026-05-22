import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, Loader2, Save, Eye, EyeOff, Search, Hash, Link,
  Image, FileText, BarChart3, ChevronDown, ChevronUp, AlertCircle,
  CheckCircle, Info, ExternalLink,
} from "lucide-react";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  imageUrl: string | null;
  featured: boolean;
  published: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  focusKeyword: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  tags: string | null;
}

const CATEGORIES = ["Air Freight", "Ocean Freight", "Customs", "Supply Chain", "Trade Insights", "Road Freight", "Warehousing", "3PL", "News"];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function estimateReadTime(text: string): string {
  const words = countWords(text);
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function renderMarkdownPreview(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3 class='text-base font-semibold mt-4 mb-1 text-gray-800'>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class='text-lg font-bold mt-5 mb-2 text-gray-900'>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 class='text-xl font-bold mt-5 mb-2 text-gray-900'>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code class='bg-gray-100 px-1 rounded text-xs font-mono'>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2' class='text-[#123D6B] underline' target='_blank'>$1</a>")
    .replace(/^- (.+)$/gm, "<li class='ml-4 text-sm text-gray-700 list-disc'>$1</li>")
    .replace(/^([^<\n].+)$/gm, "<p class='text-sm text-gray-700 my-1.5'>$1</p>")
    .replace(/\n{2,}/g, "<br/>");
}

// SEO score computation
interface SeoCheck {
  id: string;
  label: string;
  passed: boolean;
  tip: string;
  points: number;
}

function computeSeo(form: {
  title: string; metaTitle: string; metaDescription: string;
  focusKeyword: string; excerpt: string; content: string;
  imageUrl: string; ogImageUrl: string; tags: string; slug: string;
}): { score: number; checks: SeoCheck[] } {
  const kw = form.focusKeyword.toLowerCase().trim();
  const titleLower = form.title.toLowerCase();
  const metaTitleLower = form.metaTitle.toLowerCase();
  const metaDescLower = form.metaDescription.toLowerCase();
  const excerptLower = form.excerpt.toLowerCase();
  const contentLower = form.content.toLowerCase();
  const wordCount = countWords(form.content);

  const checks: SeoCheck[] = [
    {
      id: "meta_title_length",
      label: "Meta title is 40–60 characters",
      passed: form.metaTitle.length >= 40 && form.metaTitle.length <= 60,
      tip: `Current: ${form.metaTitle.length} chars. Keep between 40–60 for optimal display in search results.`,
      points: 15,
    },
    {
      id: "meta_desc_length",
      label: "Meta description is 120–160 characters",
      passed: form.metaDescription.length >= 120 && form.metaDescription.length <= 160,
      tip: `Current: ${form.metaDescription.length} chars. Keep between 120–160 for best click-through rates.`,
      points: 15,
    },
    {
      id: "focus_keyword_set",
      label: "Focus keyword is defined",
      passed: kw.length > 0,
      tip: "Set a focus keyword to check keyword usage across your content.",
      points: 10,
    },
    {
      id: "keyword_in_title",
      label: "Focus keyword in post title",
      passed: kw.length > 0 && titleLower.includes(kw),
      tip: "Include your focus keyword in the post title for better ranking.",
      points: 10,
    },
    {
      id: "keyword_in_meta_title",
      label: "Focus keyword in meta title",
      passed: kw.length > 0 && metaTitleLower.includes(kw),
      tip: "Include your focus keyword in the meta title (SEO title).",
      points: 10,
    },
    {
      id: "keyword_in_meta_desc",
      label: "Focus keyword in meta description",
      passed: kw.length > 0 && metaDescLower.includes(kw),
      tip: "Including the focus keyword in your meta description can improve click-through rates.",
      points: 10,
    },
    {
      id: "keyword_in_excerpt",
      label: "Focus keyword in excerpt",
      passed: kw.length > 0 && excerptLower.includes(kw),
      tip: "Use the focus keyword in the excerpt for consistency.",
      points: 5,
    },
    {
      id: "keyword_in_content",
      label: "Focus keyword appears in content",
      passed: kw.length > 0 && contentLower.includes(kw),
      tip: "Your focus keyword should appear naturally in the article body.",
      points: 5,
    },
    {
      id: "content_length",
      label: "Content is at least 300 words",
      passed: wordCount >= 300,
      tip: `Current: ${wordCount} words. Longer content (300+ words) tends to rank better.`,
      points: 10,
    },
    {
      id: "has_image",
      label: "Featured image is set",
      passed: form.imageUrl.length > 0,
      tip: "Add a featured image — posts with images get significantly more traffic.",
      points: 5,
    },
    {
      id: "has_og_image",
      label: "OG/social image is set",
      passed: form.ogImageUrl.length > 0,
      tip: "Set an Open Graph image so your post looks great when shared on social media.",
      points: 5,
    },
    {
      id: "has_tags",
      label: "Tags are defined",
      passed: form.tags.trim().length > 0,
      tip: "Add tags to help readers discover related content.",
      points: 5,
    },
    {
      id: "keyword_in_slug",
      label: "Focus keyword in URL slug",
      passed: kw.length > 0 && form.slug.includes(kw.replace(/\s+/g, "-")),
      tip: "Include your focus keyword in the URL slug for better SEO.",
      points: 5,
    },
  ];

  const score = checks.filter((c) => c.passed).reduce((s, c) => s + c.points, 0);
  return { score: Math.min(100, score), checks };
}

type Tab = "content" | "seo" | "publish";

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent bg-white";

function Field({ label, children, required, hint }: { label: string; children: React.ReactNode; required?: boolean; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function CharCounter({ value, max, warn = max * 0.85 }: { value: string; max: number; warn?: number }) {
  const len = value.length;
  const color = len > max ? "text-red-500" : len >= warn ? "text-amber-500" : "text-gray-400";
  return <span className={`text-xs ml-1 tabular-nums ${color}`}>{len}/{max}</span>;
}

export default function AdminBlogEdit({ id }: { id?: string }) {
  const [, setLocation] = useLocation();
  const isNew = !id;
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [previewMode, setPreviewMode] = useState(false);
  const [seoExpanded, setSeoExpanded] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    slug: "",
    title: "",
    category: "Air Freight",
    excerpt: "",
    content: "",
    author: "AB Capital Logistics",
    readTime: "5 min read",
    imageUrl: "",
    featured: false,
    published: true,
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    canonicalUrl: "",
    ogImageUrl: "",
    tags: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNew && id) {
      fetch(`/api/admin/blog-posts`, { credentials: "include" })
        .then((r) => r.json())
        .then((posts: BlogPost[]) => {
          const post = posts.find((p) => p.id === parseInt(id));
          if (post) {
            setForm({
              slug: post.slug,
              title: post.title,
              category: post.category,
              excerpt: post.excerpt,
              content: post.content,
              author: post.author,
              readTime: post.readTime,
              imageUrl: post.imageUrl ?? "",
              featured: post.featured,
              published: post.published,
              metaTitle: post.metaTitle ?? "",
              metaDescription: post.metaDescription ?? "",
              focusKeyword: post.focusKeyword ?? "",
              canonicalUrl: post.canonicalUrl ?? "",
              ogImageUrl: post.ogImageUrl ?? "",
              tags: post.tags ?? "",
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const set = useCallback((field: string, value: string | boolean) => {
    setForm((f) => {
      const updated = { ...f, [field]: value };
      if (field === "title") {
        if (isNew) updated.slug = slugify(String(value));
        if (!f.metaTitle || f.metaTitle === f.title) updated.metaTitle = String(value).slice(0, 60);
      }
      if (field === "content") {
        updated.readTime = estimateReadTime(String(value));
      }
      return updated;
    });
  }, [isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url = isNew ? "/api/admin/blog-posts" : `/api/admin/blog-posts/${id}`;
      const method = isNew ? "POST" : "PUT";
      const body = {
        ...form,
        imageUrl: form.imageUrl || null,
        metaTitle: form.metaTitle || null,
        metaDescription: form.metaDescription || null,
        focusKeyword: form.focusKeyword || null,
        canonicalUrl: form.canonicalUrl || null,
        ogImageUrl: form.ogImageUrl || null,
        tags: form.tags || null,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setLocation("/admin/blog");
      } else {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "Failed to save");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading post...</div>;

  const { score: seoScore, checks: seoChecks } = computeSeo(form);
  const passedChecks = seoChecks.filter((c) => c.passed).length;
  const wordCount = countWords(form.content);

  const scoreColor = seoScore >= 80 ? "text-emerald-600" : seoScore >= 55 ? "text-amber-600" : seoScore >= 30 ? "text-orange-600" : "text-red-600";
  const scoreBg = seoScore >= 80 ? "bg-emerald-500" : seoScore >= 55 ? "bg-amber-500" : seoScore >= 30 ? "bg-sky-500" : "bg-red-500";
  const scoreLabel = seoScore >= 80 ? "Excellent" : seoScore >= 55 ? "Good" : seoScore >= 30 ? "Fair" : "Needs Work";

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "content", label: "Content", icon: <FileText className="w-4 h-4" /> },
    {
      id: "seo",
      label: "SEO",
      icon: <BarChart3 className="w-4 h-4" />,
      badge: `${seoScore}`,
    },
    { id: "publish", label: "Publish", icon: <Eye className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setLocation("/admin/blog")}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{isNew ? "New Blog Post" : "Edit Blog Post"}</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* SEO Score pill */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white ${scoreBg}`}>
            <BarChart3 className="w-3 h-3" />
            SEO: {seoScore}/100 · {scoreLabel}
          </div>
          <button
            type="button"
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : isNew ? "Publish Post" : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.id ? `${scoreColor} bg-gray-100` : "bg-gray-200 text-gray-500"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Post Details</h2>

              <Field label="Title" required>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className={inputCls}
                  placeholder="e.g. How to Import Electronics into Cameroon"
                  required
                />
              </Field>

              <Field label="Slug (URL)" required hint={`Preview: /blog/${form.slug || "your-slug"}`}>
                <input
                  value={form.slug}
                  onChange={(e) => set("slug", slugify(e.target.value))}
                  className={`${inputCls} font-mono text-xs`}
                  placeholder="how-to-import-electronics-cameroon"
                  required
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Category" required>
                  <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Read Time">
                  <div className="flex items-center gap-2">
                    <input value={form.readTime} onChange={(e) => set("readTime", e.target.value)} className={inputCls} placeholder="5 min read" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{wordCount} words · auto-calculated</p>
                </Field>
              </div>

              <Field label="Author">
                <input value={form.author} onChange={(e) => set("author", e.target.value)} className={inputCls} placeholder="AB Capital Logistics" />
              </Field>

              <Field label="Excerpt" required>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  className={`${inputCls} h-20 resize-none`}
                  placeholder="A short summary shown on the blog listing page (1–2 sentences, 80–160 characters)"
                  required
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-400">Shown on blog listing and used for SEO.</p>
                  <CharCounter value={form.excerpt} max={160} warn={120} />
                </div>
              </Field>

              <Field label="Tags" hint="Comma-separated — e.g. cameroon, import, customs">
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={form.tags}
                    onChange={(e) => set("tags", e.target.value)}
                    className={`${inputCls} pl-9`}
                    placeholder="cameroon, import, freight, logistics"
                  />
                </div>
              </Field>

              <Field label="Featured Image URL">
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className={`${inputCls} pl-9`} placeholder="https://..." />
                </div>
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="preview" className="mt-2 h-28 w-full object-cover rounded-lg border border-gray-200" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
              </Field>
            </div>

            {/* Content editor */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Content</h2>
                <button
                  type="button"
                  onClick={() => setPreviewMode((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {previewMode ? <><EyeOff className="w-3.5 h-3.5" />Edit</> : <><Eye className="w-3.5 h-3.5" />Preview</>}
                </button>
              </div>

              {previewMode ? (
                <div
                  className="min-h-[24rem] p-4 rounded-xl border border-gray-100 bg-gray-50 overflow-auto prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(form.content) || "<p class='text-gray-400 text-sm'>Nothing to preview yet.</p>" }}
                />
              ) : (
                <>
                  <p className="text-xs text-gray-400">Markdown supported: **bold**, ## Heading, - bullet, [link](url)</p>
                  <textarea
                    value={form.content}
                    onChange={(e) => set("content", e.target.value)}
                    className={`${inputCls} h-96 resize-y font-mono text-xs`}
                    placeholder="Write your article content here in Markdown format..."
                    required
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{wordCount} words</span>
                    <span>~{form.readTime}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === "seo" && (
          <div className="space-y-5">
            {/* Score panel */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start gap-5">
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" strokeWidth="8" stroke="#f3f4f6" fill="none" />
                    <circle
                      cx="40" cy="40" r="34" strokeWidth="8"
                      stroke={seoScore >= 80 ? "#10b981" : seoScore >= 55 ? "#f59e0b" : seoScore >= 30 ? "#f97316" : "#ef4444"}
                      fill="none"
                      strokeDasharray={`${(seoScore / 100) * 213.6} 213.6`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className={`absolute inset-0 flex flex-col items-center justify-center ${scoreColor}`}>
                    <span className="text-xl font-bold leading-none">{seoScore}</span>
                    <span className="text-[9px] font-medium uppercase tracking-wide">/100</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className={`text-lg font-bold ${scoreColor}`}>{scoreLabel} SEO</div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {passedChecks} of {seoChecks.length} checks passing.{" "}
                    {seoScore < 60 && "Fill in the fields below to improve your score."}
                    {seoScore >= 60 && seoScore < 80 && "Almost there — address the remaining checks."}
                    {seoScore >= 80 && "Great job! Your SEO is well optimized."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {seoChecks.filter((c) => !c.passed).slice(0, 3).map((c) => (
                      <span key={c.id} className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {c.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SEO fields */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Search Engine Optimization</h2>

              <Field label="Focus Keyword" hint="The main keyword or phrase you want this post to rank for">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={form.focusKeyword}
                    onChange={(e) => set("focusKeyword", e.target.value)}
                    className={`${inputCls} pl-9`}
                    placeholder="e.g. freight forwarding cameroon"
                  />
                </div>
                {form.focusKeyword && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    {[
                      { label: "In title", ok: form.title.toLowerCase().includes(form.focusKeyword.toLowerCase()) },
                      { label: "In meta title", ok: form.metaTitle.toLowerCase().includes(form.focusKeyword.toLowerCase()) },
                      { label: "In meta desc", ok: form.metaDescription.toLowerCase().includes(form.focusKeyword.toLowerCase()) },
                      { label: "In content", ok: form.content.toLowerCase().includes(form.focusKeyword.toLowerCase()) },
                      { label: "In slug", ok: form.slug.includes(form.focusKeyword.toLowerCase().replace(/\s+/g, "-")) },
                      { label: "In excerpt", ok: form.excerpt.toLowerCase().includes(form.focusKeyword.toLowerCase()) },
                    ].map((kc) => (
                      <div key={kc.label} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${kc.ok ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-400"}`}>
                        {kc.ok ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {kc.label}
                      </div>
                    ))}
                  </div>
                )}
              </Field>

              <Field label="Meta Title (SEO Title)">
                <input
                  value={form.metaTitle}
                  onChange={(e) => set("metaTitle", e.target.value)}
                  className={inputCls}
                  placeholder="Optimized title for search engines (40–60 characters)"
                  maxLength={80}
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-400">Different from post title — shown in search results.</p>
                  <CharCounter value={form.metaTitle} max={60} warn={40} />
                </div>
                {form.metaTitle && (
                  <div className="mt-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Info className="w-3 h-3" /> Google preview</div>
                    <div className="text-blue-700 text-sm font-medium truncate">{form.metaTitle || form.title}</div>
                    <div className="text-green-700 text-xs truncate">abcapitallogistics.com/blog/{form.slug}</div>
                    <div className="text-gray-600 text-xs mt-0.5 line-clamp-2">{form.metaDescription || form.excerpt}</div>
                  </div>
                )}
              </Field>

              <Field label="Meta Description">
                <textarea
                  value={form.metaDescription}
                  onChange={(e) => set("metaDescription", e.target.value)}
                  className={`${inputCls} h-24 resize-none`}
                  placeholder="Compelling description for search results (120–160 characters)"
                  maxLength={200}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-400">Shown under the title in Google search results.</p>
                  <CharCounter value={form.metaDescription} max={160} warn={120} />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Canonical URL" hint="Leave blank to use the default post URL">
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={form.canonicalUrl}
                      onChange={(e) => set("canonicalUrl", e.target.value)}
                      className={`${inputCls} pl-9 font-mono text-xs`}
                      placeholder="https://abcapitallogistics.com/blog/..."
                    />
                  </div>
                </Field>
                <Field label="OG / Social Image URL" hint="Image shown when shared on social media">
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={form.ogImageUrl}
                      onChange={(e) => set("ogImageUrl", e.target.value)}
                      className={`${inputCls} pl-9`}
                      placeholder="https://... (1200×630px recommended)"
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* SEO Checklist */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400">SEO Checklist</h2>
                <span className="text-xs text-gray-500">{passedChecks}/{seoChecks.length} passed</span>
              </div>
              <div className="space-y-2">
                {seoChecks.map((check) => (
                  <div
                    key={check.id}
                    className={`rounded-xl border p-3 cursor-pointer transition-colors ${
                      check.passed
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => setSeoExpanded((s) => ({ ...s, [check.id]: !s[check.id] }))}
                  >
                    <div className="flex items-center gap-2">
                      {check.passed
                        ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        : <AlertCircle className="w-4 h-4 text-gray-400 shrink-0" />}
                      <span className={`text-sm flex-1 ${check.passed ? "text-emerald-800" : "text-gray-700"}`}>{check.label}</span>
                      <span className={`text-xs font-medium ${check.passed ? "text-emerald-600" : "text-gray-400"}`}>+{check.points}</span>
                      {seoExpanded[check.id]
                        ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                        : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                    </div>
                    {seoExpanded[check.id] && (
                      <p className="mt-2 ml-6 text-xs text-gray-500">{check.tip}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PUBLISH TAB */}
        {activeTab === "publish" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Publishing Options</h2>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-[#0B1F3A] transition-colors">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => set("published", e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#0B1F3A]"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-800">Published</div>
                    <div className="text-xs text-gray-500">Visible on the public blog at /blog/{form.slug || "…"}</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-[#00AEEF] transition-colors">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => set("featured", e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#00AEEF]"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-800">Featured Post</div>
                    <div className="text-xs text-gray-500">Shown prominently at the top of the blog listing page</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Summary card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Post Summary</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Title", value: form.title || "—" },
                  { label: "Slug", value: `/blog/${form.slug || "—"}` },
                  { label: "Category", value: form.category },
                  { label: "Read Time", value: form.readTime },
                  { label: "Word Count", value: `${wordCount} words` },
                  { label: "SEO Score", value: `${seoScore}/100 (${scoreLabel})` },
                  { label: "Status", value: form.published ? "Published" : "Draft" },
                  { label: "Featured", value: form.featured ? "Yes" : "No" },
                ].map((row) => (
                  <div key={row.label} className="p-3 rounded-xl bg-gray-50">
                    <div className="text-xs text-gray-400 mb-0.5">{row.label}</div>
                    <div className="text-sm font-medium text-gray-800 truncate">{row.value}</div>
                  </div>
                ))}
              </div>

              {form.slug && (
                <a
                  href={`/blog/${form.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 text-xs text-[#123D6B] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View post on site →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Sticky save bar */}
        <div className="flex items-center gap-3 pt-4 pb-6 mt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : isNew ? "Publish Post" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => setLocation("/admin/blog")}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <div className={`ml-auto text-xs font-semibold flex items-center gap-1 ${scoreColor}`}>
            <BarChart3 className="w-3.5 h-3.5" />
            SEO Score: {seoScore}/100
          </div>
        </div>
      </form>
    </div>
  );
}
