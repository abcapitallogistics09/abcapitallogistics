import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Plus, Pencil, Trash2, Newspaper, Eye, EyeOff, Star } from "lucide-react";

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
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 mt-1">{posts.length} DB-managed posts</p>
        </div>
        <button
          onClick={() => setLocation("/admin/blog/new")}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : posts.length === 0 ? (
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
        ) : (
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <div key={post.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm leading-snug">{post.title}</span>
                    {post.featured && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{post.category}</span>
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate">{post.excerpt}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => togglePublished(post)}
                    title={post.published ? "Unpublish" : "Publish"}
                    className={`p-1.5 rounded-lg transition-colors ${post.published ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}
                  >
                    {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setLocation(`/admin/blog/${post.id}/edit`)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B1F3A] hover:bg-gray-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
