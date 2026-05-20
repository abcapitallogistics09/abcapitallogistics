import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight, Video } from "lucide-react";

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
}

const FALLBACK: GalleryItem[] = [
  { id: 1, title: "Douala Port — Container Operations", category: "Port Operations", mediaType: "image", url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600&auto=format&fit=crop", location: "Douala, Cameroon", sortOrder: 0, published: true },
  { id: 2, title: "Port Terminal — Bulk Cargo Handling", category: "Port Operations", mediaType: "image", url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=600&auto=format&fit=crop", location: "Douala Port, Cameroon", sortOrder: 1, published: true },
  { id: 3, title: "Vessel at Douala Anchorage", category: "Ship Agency", mediaType: "image", url: "https://images.unsplash.com/photo-1504855901336-d35ab96bfc56?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1504855901336-d35ab96bfc56?q=80&w=600&auto=format&fit=crop", location: "Douala, Cameroon", sortOrder: 2, published: true },
  { id: 4, title: "Bonabéri Warehouse Facility", category: "Warehousing", mediaType: "image", url: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=600&auto=format&fit=crop", location: "Bonabéri, Douala", sortOrder: 3, published: true },
  { id: 5, title: "Air Cargo Loading Operations", category: "Air Freight", mediaType: "image", url: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=600&auto=format&fit=crop", location: "Douala International Airport", sortOrder: 4, published: true },
  { id: 6, title: "Cargo Aircraft — Priority Shipment", category: "Air Freight", mediaType: "image", url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop", location: "Douala International Airport", sortOrder: 5, published: true },
  { id: 7, title: "CEMAC Corridor — Road Freight Convoy", category: "Road Freight", mediaType: "image", url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=600&auto=format&fit=crop", location: "Cameroon–Chad Corridor", sortOrder: 6, published: true },
  { id: 8, title: "Global Cargo Network Operations", category: "Port Operations", mediaType: "image", url: "https://images.unsplash.com/photo-1586528116311-ad8ed3c84a0c?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1586528116311-ad8ed3c84a0c?q=80&w=600&auto=format&fit=crop", location: "Douala, Cameroon", sortOrder: 7, published: true },
  { id: 9, title: "Customs Documentation & Clearance", category: "Port Operations", mediaType: "image", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop", location: "Douala Customs Post", sortOrder: 8, published: true },
  { id: 10, title: "Operations Team — Douala HQ", category: "Team", mediaType: "image", url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=600&auto=format&fit=crop", location: "Douala, Cameroon", sortOrder: 9, published: true },
  { id: 11, title: "Ship Agency — Vessel Boarding", category: "Ship Agency", mediaType: "image", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop", location: "Douala Port, Cameroon", sortOrder: 10, published: true },
  { id: 12, title: "Cross-Border Road Transport", category: "Road Freight", mediaType: "image", url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=600&auto=format&fit=crop", location: "Cameroon–Central Africa", sortOrder: 11, published: true },
  { id: 13, title: "Warehouse Inventory Management", category: "Warehousing", mediaType: "image", url: "https://images.unsplash.com/photo-1565793979887-f6b98b7eef55?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1565793979887-f6b98b7eef55?q=80&w=600&auto=format&fit=crop", location: "Bonabéri, Douala", sortOrder: 12, published: true },
  { id: 14, title: "Container Yard — Douala Terminal", category: "Port Operations", mediaType: "image", url: "https://images.unsplash.com/photo-1473163928189-364b2c4e7135?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1473163928189-364b2c4e7135?q=80&w=600&auto=format&fit=crop", location: "Douala Port, Cameroon", sortOrder: 13, published: true },
  { id: 15, title: "Client Strategy Meeting", category: "Team", mediaType: "image", url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop", thumbUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop", location: "Douala, Cameroon", sortOrder: 14, published: true },
];

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/gallery-items")
      .then((r) => r.json())
      .then((d: GalleryItem[]) => {
        if (Array.isArray(d) && d.length > 0) setItems(d);
        else setItems(FALLBACK);
      })
      .catch(() => setItems(FALLBACK));
  }, []);

  const displayItems = items.length > 0 ? items : FALLBACK;

  const categories = ["All", ...Array.from(new Set(displayItems.map((i) => i.category)))];

  const filtered = activeCategory === "All"
    ? displayItems
    : displayItems.filter((p) => p.category === activeCategory);

  function thumbSrc(item: GalleryItem) {
    return item.thumbUrl || (item.mediaType === "image" ? item.url : null);
  }

  function openLightbox(item: GalleryItem) {
    const idx = filtered.indexOf(item);
    setLightboxIndex(idx);
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }

  function prevPhoto() {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  }

  function nextPhoto() {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filtered.length);
  }

  const lightboxItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-32 pt-40 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary/80" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Photo & Video Gallery</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Operations in Pictures</h1>
            <p className="text-gray-300 text-lg max-w-xl">
              A visual look at AB Capital Logistics operations — from Douala Port to the CEMAC corridor and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                data-testid={`button-gallery-cat-${cat}`}
              >
                {cat}
                <span className={`ml-2 text-xs ${activeCategory === cat ? "text-accent" : "text-gray-400"}`}>
                  {cat === "All" ? displayItems.length : displayItems.filter((p) => p.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          {/* Masonry-style Grid */}
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            <AnimatePresence>
              {filtered.map((item, i) => {
                const thumb = thumbSrc(item);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="break-inside-avoid mb-4 group relative cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                    onClick={() => openLightbox(item)}
                    data-testid={`gallery-photo-${item.id}`}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={item.title}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                        <Video className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-semibold text-sm">{item.title}</p>
                        {item.location && <p className="text-gray-300 text-xs mt-1">{item.location}</p>}
                      </div>
                      <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        {item.mediaType === "video" ? <Video className="w-4 h-4 text-white" /> : <ZoomIn className="w-4 h-4 text-white" />}
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-accent text-white text-xs font-medium px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
            data-testid="lightbox"
          >
            <button
              onClick={closeLightbox}
              data-testid="button-lightbox-close"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              data-testid="button-lightbox-prev"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              data-testid="button-lightbox-next"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <motion.div
              key={lightboxItem.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxItem.mediaType === "video" ? (
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
                  {lightboxItem.url.includes("youtube.com") || lightboxItem.url.includes("youtu.be") || lightboxItem.url.includes("embed") ? (
                    <iframe src={lightboxItem.url} className="w-full h-full" allowFullScreen title={lightboxItem.title} />
                  ) : (
                    <video src={lightboxItem.url} controls className="w-full h-full" poster={lightboxItem.thumbUrl ?? undefined} />
                  )}
                </div>
              ) : (
                <img
                  src={lightboxItem.url}
                  alt={lightboxItem.title}
                  className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />
              )}
              <div className="mt-4 text-center">
                <p className="text-white font-semibold">{lightboxItem.title}</p>
                <div className="flex items-center justify-center gap-3 mt-1">
                  <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">{lightboxItem.category}</span>
                  {lightboxItem.location && <span className="text-gray-400 text-sm">{lightboxItem.location}</span>}
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  {(lightboxIndex ?? 0) + 1} / {filtered.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
