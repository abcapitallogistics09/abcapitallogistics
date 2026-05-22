import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Plus, Pencil, Trash2, Newspaper, Eye, EyeOff, Star, Search, Filter, TrendingUp } from "lucide-react";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  readTime: string;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  metaTitle: string | null;
  metaDescription: string | null;
  focusKeyword: string | null;
  tags: string | null;
}

function seoScore(post: BlogPost): { score: number; label: string; color: string; bg: string } {
  let score = 0;
  if (post.metaTitle && post.metaTitle.length >= 30 && post.metaTitle.length <= 60) score += 25;
  else if (post.metaTitle) score += 10;
  if (post.metaDescription && post.metaDescription.length >= 120 && post.metaDescription.length <= 160) score += 25;
  else if (post.metaDescription) score += 10;
  if (post.focusKeyword) score += 20;
  if (post.tags) score += 15;
  if (post.excerpt && post.excerpt.length > 80) score += 15;
  if (score >= 80) return { score, label: "Excellent", color: "text-emerald-700", bg: "bg-emerald-50" };
  if (score >= 55) return { score, label: "Good", color: "text-amber-700", bg: "bg-amber-50" };
  if (score >= 30) return { score, label: "Fair", color: "text-orange-700", bg: "bg-sky-50" };
  return { score, label: "Poor", color: "text-red-700", bg: "bg-red-50" };
}

const CATEGORIES = ["All", "Air Freight", "Ocean Freight", "Customs", "Supply Chain", "Trade Insights", "Road Freight", "Warehousing", "3PL", "News"];

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [, setLocation] = useLocation();

  const load = () => {
    fetch("/api/admin/blog-posts", { credentials: "include" })
      .then((r) => r.json())
      .then((d: BlogPost[]) => setPosts(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/blog-posts/${id}`, { method: "DELETE", credentials: "include" });
    setPosts((p) => p.filter((post) => post.id !== id));
  };

  const togglePublished = async (post: BlogPost) => {
    const res = await fetch(`/api/admin/blog-posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ published: !post.published }),
    });
    if (res.ok) {
      const updated = await res.json() as BlogPost;
      setPosts((p) => p.map((x) => (x.id === post.id ? { ...x, published: updated.published } : x)));
    }
  };

  const filtered = posts.filter((p) => {
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.tags ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "All" || p.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || (statusFilter === "published" ? p.published : !p.published);
    return matchesSearch && matchesCat && matchesStatus;
  });

  const published = posts.filter((p) => p.published).length;
  const drafts = posts.length - published;
  const avgSeo = posts.length ? Math.round(posts.reduce((s, p) => s + seoScore(p).score, 0) / posts.length) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 mt-0.5 text-sm">{posts.length} posts · {published} published · {drafts} draft</p>
        </div>
        <button
          onClick={() => setLocation("/admin/blog/new")}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Stats strip */}
      {posts.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            { label: "Total Posts", value: posts.length, color: "text-[#0B1F3A]" },
            { label: "Published", value: published, color: "text-emerald-600" },
            { label: "Drafts", value: drafts, color: "text-amber-600" },
            { label: "Avg. SEO Score", value: `${avgSeo}/100`, color: avgSeo >= 70 ? "text-emerald-600" : avgSeo >= 40 ? "text-amber-600" : "text-red-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts or tags..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "published" | "draft")}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 && posts.length === 0 ? (
          <div className="p-16 text-center">
            <Newspaper className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-1">No blog posts yet</h3>
            <p className="text-gray-500 text-sm mb-5">Create your first post to publish content on the site.</p>
            <button
              onClick={() => setLocation("/admin/blog/new")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Write first post
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Filter className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No posts match your filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_100px_80px_90px] gap-0 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <span>Post</span>
              <span className="text-center">SEO</span>
              <span className="text-center">Status</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="divide-y divide-gray-100">
              {filtered.map((post) => {
                const seo = seoScore(post);
                return (
                  <div key={post.id} className="grid grid-cols-[1fr_100px_80px_90px] items-center gap-0 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-gray-900 text-sm leading-snug truncate">{post.title}</span>
                        {post.featured && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-gray-500">
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{post.category}</span>
                        <span>{post.author}</span>
                        <span className="text-gray-300">·</span>
                        <span>{post.readTime}</span>
                        <span className="text-gray-300">·</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      {post.tags && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {post.tags.split(",").slice(0, 3).map((t) => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{t.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className={`text-xs font-bold ${seo.color}`}>{seo.score}/100</div>
                      <div className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${seo.color} ${seo.bg}`}>{seo.label}</div>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => togglePublished(post)}
                        title={post.published ? "Click to unpublish" : "Click to publish"}
                        className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full transition-colors ${post.published ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                      >
                        {post.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {post.published ? "Live" : "Draft"}
                      </button>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                        title="View on site"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#00AEEF] hover:bg-sky-50 transition-colors"
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setLocation(`/admin/blog/${post.id}/edit`)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B1F3A] hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
