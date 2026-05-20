import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Video, ExternalLink, Loader2 } from "lucide-react";

interface GalleryItem {
  id?: number;
  title: string;
  category: string;
  mediaType: string;
  url: string;
  thumbUrl: string;
  location: string;
  sortOrder: number;
  published: boolean;
}

const CATEGORIES = ["Port Operations", "Warehousing", "Air Freight", "Road Freight", "Ship Agency", "Team", "Other"];

const EMPTY: GalleryItem = {
  title: "",
  category: "Port Operations",
  mediaType: "image",
  url: "",
  thumbUrl: "",
  location: "",
  sortOrder: 0,
  published: true,
};

export default function AdminGalleryEdit({ id }: { id?: string }) {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState<GalleryItem>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbProgress, setThumbProgress] = useState(0);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/gallery-items/${id}`, { credentials: "include" })
        .then((r) => r.json())
        .then((d: GalleryItem) => setForm({
          ...d,
          thumbUrl: d.thumbUrl ?? "",
          location: d.location ?? "",
        }))
        .catch(() => setError("Failed to load item"));
    }
  }, [id]);

  const set = (k: keyof GalleryItem, v: string | boolean | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function uploadFile(
    file: File,
    setUploading: (v: boolean) => void,
    setProgress: (v: number) => void,
    onSuccess: (url: string) => void,
  ) {
    setUploading(true);
    setProgress(0);
    try {
      const res = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!res.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await res.json() as { uploadURL: string; objectPath: string };

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed: ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.open("PUT", uploadURL);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      onSuccess(`/api/storage${objectPath}`);
      setProgress(100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const handleMainFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    set("mediaType", isVideo ? "video" : "image");
    uploadFile(file, setUploadingMain, setUploadProgress, (url) => set("url", url));
  };

  const handleThumbFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file, setUploadingThumb, setThumbProgress, (url) => set("thumbUrl", url));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Title is required"); return; }
    if (!form.url.trim()) { setError("Media URL is required — paste a URL or upload a file"); return; }
    setSaving(true);
    setError("");
    try {
      const url = id ? `/api/admin/gallery-items/${id}` : "/api/admin/gallery-items";
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          thumbUrl: form.thumbUrl || null,
          location: form.location || null,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setLocation("/admin/gallery");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const previewSrc = form.mediaType === "image" ? form.url : (form.thumbUrl || form.url);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setLocation("/admin/gallery")} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{id ? "Edit Media Item" : "Add New Media"}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Upload an image or video, or paste a URL</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => set("published", !form.published)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${form.published ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
          >
            {form.published ? "Published" : "Hidden"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white rounded-lg text-sm font-semibold hover:bg-[#123D6B] disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Item"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Left — form */}
        <div className="space-y-5">
          {/* Media upload / URL */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Media File</h2>

            {/* Type toggle */}
            <div className="flex gap-2 mb-4">
              {(["image", "video"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => set("mediaType", t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${form.mediaType === t ? "bg-[#0B1F3A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {t === "image" ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  {t === "image" ? "Image" : "Video"}
                </button>
              ))}
            </div>

            {/* Upload button */}
            <div className="mb-3">
              <input ref={mainInputRef} type="file" accept={form.mediaType === "image" ? "image/*" : "video/*"} className="hidden" onChange={handleMainFile} />
              <button
                onClick={() => mainInputRef.current?.click()}
                disabled={uploadingMain}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[#0B1F3A] hover:text-[#0B1F3A] hover:bg-blue-50/30 transition-colors disabled:opacity-50"
              >
                {uploadingMain ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading… {uploadProgress}%</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload {form.mediaType === "image" ? "Image" : "Video"} from device</>
                )}
              </button>
              {uploadingMain && (
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F28C28] transition-all duration-300 rounded-full" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
            </div>

            {/* Or URL input */}
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or paste URL</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="relative mt-2">
              <input
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
                placeholder={form.mediaType === "image" ? "https://images.unsplash.com/..." : "https://www.youtube.com/embed/..."}
                className="w-full pr-8 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] font-mono"
              />
              {form.url && (
                <button onClick={() => window.open(form.url, "_blank")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B1F3A]">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Thumbnail (for video or separate thumb) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-1">Thumbnail <span className="text-gray-400 font-normal text-sm">(optional{form.mediaType === "video" ? " — used as video poster" : ""})</span></h2>
            <div className="mb-3 mt-3">
              <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbFile} />
              <button
                onClick={() => thumbInputRef.current?.click()}
                disabled={uploadingThumb}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[#0B1F3A] hover:text-[#0B1F3A] hover:bg-blue-50/30 transition-colors disabled:opacity-50"
              >
                {uploadingThumb ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading… {thumbProgress}%</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload thumbnail image</>
                )}
              </button>
            </div>
            <input
              value={form.thumbUrl}
              onChange={(e) => set("thumbUrl", e.target.value)}
              placeholder="https://... (or leave blank)"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] font-mono"
            />
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-900">Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Douala Port Container Operations"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => set("sortOrder", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Douala Port, Cameroon"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
          </div>
        </div>

        {/* Right — preview */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3 text-sm">Preview</h2>
            {previewSrc ? (
              <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video">
                {form.mediaType === "image" ? (
                  <img src={previewSrc} alt={form.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 gap-2">
                    {form.thumbUrl ? (
                      <img src={form.thumbUrl} alt="thumbnail" className="w-full h-full object-cover absolute inset-0" />
                    ) : null}
                    <div className="relative z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <p className="relative z-10 text-white/70 text-xs">Video</p>
                  </div>
                )}
                {form.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-3">
                    <p className="text-white text-xs font-semibold truncate">{form.title}</p>
                    {form.location && <p className="text-white/60 text-[10px] truncate">{form.location}</p>}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-gray-100 flex flex-col items-center justify-center gap-2 text-gray-300">
                {form.mediaType === "image" ? <ImageIcon className="w-10 h-10" /> : <Video className="w-10 h-10" />}
                <p className="text-sm">No media yet</p>
              </div>
            )}
          </div>

          {/* Meta card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="font-medium capitalize">{form.mediaType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Category</span>
              <span className="font-medium">{form.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Visibility</span>
              <span className={`font-medium ${form.published ? "text-emerald-600" : "text-gray-400"}`}>
                {form.published ? "Published" : "Hidden"}
              </span>
            </div>
            {form.sortOrder > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Sort Order</span>
                <span className="font-medium">#{form.sortOrder}</span>
              </div>
            )}
          </div>

          {form.url && (
            <button
              onClick={() => window.open(form.url, "_blank")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open media in new tab
            </button>
          )}

          {form.url && (
            <button
              onClick={() => { set("url", ""); set("thumbUrl", ""); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-100 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear media
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
