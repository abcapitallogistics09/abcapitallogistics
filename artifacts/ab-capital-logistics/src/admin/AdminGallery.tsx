import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Plus, Pencil, Trash2, Images, Eye, EyeOff, Search, Video, Image as ImageIcon, GripVertical } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  mediaType: string;
  url: string;
  thumbUrl: string | null;
  location: string | null;
  sortOrder: number;
  published: boolean;
  createdAt: string;
}

const CATEGORIES = ["All", "Port Operations", "Warehousing", "Air Freight", "Road Freight", "Ship Agency", "Team", "Other"];

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const [, setLocation] = useLocation();

  const load = () => {
    fetch("/api/admin/gallery-items", { credentials: "include" })
      .then((r) => r.json())
      .then((d: GalleryItem[]) => setItems(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/gallery-items/${id}`, { method: "DELETE", credentials: "include" });
    setItems((p) => p.filter((x) => x.id !== id));
  };

  const togglePublished = async (item: GalleryItem) => {
    const res = await fetch(`/api/admin/gallery-items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ published: !item.published }),
    });
    if (res.ok) {
      const updated = await res.json() as GalleryItem;
      setItems((p) => p.map((x) => (x.id === item.id ? { ...x, published: updated.published } : x)));
    }
  };

  const filtered = items.filter((it) => {
    const matchSearch = !search || it.title.toLowerCase().includes(search.toLowerCase()) || (it.location ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || it.category === catFilter;
    const matchType = typeFilter === "all" || it.mediaType === typeFilter;
    return matchSearch && matchCat && matchType;
  });

  const published = items.filter((i) => i.published).length;
  const images = items.filter((i) => i.mediaType === "image").length;
  const videos = items.filter((i) => i.mediaType === "video").length;

  function thumbSrc(item: GalleryItem) {
    return item.thumbUrl || (item.mediaType === "image" ? item.url : null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-500 mt-0.5 text-sm">{items.length} items · {published} published · {images} images · {videos} videos</p>
        </div>
        <button
          onClick={() => setLocation("/admin/gallery/new")}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Media
        </button>
      </div>

      {/* Stats */}
      {items.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            { label: "Total Items", value: items.length, color: "text-[#0B1F3A]" },
            { label: "Published", value: published, color: "text-emerald-600" },
            { label: "Images", value: images, color: "text-blue-600" },
            { label: "Videos", value: videos, color: "text-purple-600" },
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
            placeholder="Search by title or location..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none bg-white"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as "all" | "image" | "video")}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none bg-white"
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 && items.length === 0 ? (
          <div className="p-16 text-center">
            <Images className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-1">No gallery items yet</h3>
            <p className="text-gray-500 text-sm mb-5">Add your first photo or video to display in the gallery.</p>
            <button
              onClick={() => setLocation("/admin/gallery/new")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add first item
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No items match your filters.</div>
        ) : (
          <>
            <div className="grid grid-cols-[40px_80px_1fr_100px_80px_90px] gap-0 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <span></span>
              <span>Preview</span>
              <span>Item</span>
              <span className="text-center">Category</span>
              <span className="text-center">Status</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="divide-y divide-gray-100">
              {filtered.map((item) => {
                const thumb = thumbSrc(item);
                return (
                  <div key={item.id} className="grid grid-cols-[40px_80px_1fr_100px_80px_90px] items-center gap-0 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-center text-gray-300">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="flex items-center pr-3">
                      {thumb ? (
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 relative flex-shrink-0">
                          <img src={thumb} alt={item.title} className="w-full h-full object-cover" />
                          {item.mediaType === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                              <Video className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-14 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {item.mediaType === "video" ? <Video className="w-5 h-5 text-gray-300" /> : <ImageIcon className="w-5 h-5 text-gray-300" />}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm truncate">{item.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${item.mediaType === "video" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
                          {item.mediaType}
                        </span>
                      </div>
                      {item.location && <p className="text-xs text-gray-400 mt-0.5 truncate">{item.location}</p>}
                    </div>
                    <div className="flex justify-center">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium truncate max-w-[90px]">{item.category}</span>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => togglePublished(item)}
                        className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full transition-colors ${item.published ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                      >
                        {item.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {item.published ? "Live" : "Hidden"}
                      </button>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setLocation(`/admin/gallery/${item.id}/edit`)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B1F3A] hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
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
