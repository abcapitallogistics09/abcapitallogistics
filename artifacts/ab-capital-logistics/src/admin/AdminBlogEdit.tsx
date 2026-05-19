import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2, Save } from "lucide-react";

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
}

const CATEGORIES = ["Air Freight", "Ocean Freight", "Customs", "Supply Chain", "Trade Insights", "Road Freight", "Warehousing", "3PL", "News"];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminBlogEdit({ id }: { id?: string }) {
  const [, setLocation] = useLocation();
  const isNew = !id;

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
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const set = (field: string, value: string | boolean) => {
    setForm((f) => {
      const updated = { ...f, [field]: value };
      if (field === "title" && isNew) {
        updated.slug = slugify(String(value));
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url = isNew ? "/api/admin/blog-posts" : `/api/admin/blog-posts/${id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, imageUrl: form.imageUrl || null }),
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

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setLocation("/admin/blog")}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? "New Blog Post" : "Edit Blog Post"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wider text-gray-500">Post Details</h2>

          <Field label="Title" required>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputCls}
              placeholder="e.g. How to Import Electronics into Cameroon"
              required
            />
          </Field>

          <Field label="Slug (URL)" required>
            <input
              value={form.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              className={inputCls}
              placeholder="how-to-import-electronics-cameroon"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Will appear at /blog/{form.slug || "your-slug"}</p>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" required>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Read Time">
              <input value={form.readTime} onChange={(e) => set("readTime", e.target.value)} className={inputCls} placeholder="5 min read" />
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
              placeholder="A short summary shown on the blog listing page (1-2 sentences)"
              required
            />
          </Field>

          <Field label="Featured Image URL">
            <input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className={inputCls} placeholder="https://..." />
          </Field>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Content (Markdown)</h2>
          <p className="text-xs text-gray-400">Use **bold**, ## Heading, ### Sub-heading, - bullet points, and [link text](url) for formatting.</p>
          <textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            className={`${inputCls} h-96 resize-y font-mono text-xs`}
            placeholder="Write your article content here in Markdown format..."
            required
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">Publishing</h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="w-4 h-4 accent-[#0B1F3A]" />
              <span className="text-sm font-medium text-gray-700">Published (visible on public blog)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-[#F28C28]" />
              <span className="text-sm font-medium text-gray-700">Featured post</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pb-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : isNew ? "Publish Post" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => setLocation("/admin/blog")}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent bg-white";

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
