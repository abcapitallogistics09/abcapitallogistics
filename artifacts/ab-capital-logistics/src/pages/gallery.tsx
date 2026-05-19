import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

const categories = ["All", "Port Operations", "Warehousing", "Air Freight", "Road Freight", "Ship Agency", "Team"];

const photos = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=600&auto=format&fit=crop",
    title: "Douala Port — Container Operations",
    category: "Port Operations",
    location: "Douala, Cameroon",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=600&auto=format&fit=crop",
    title: "Port Terminal — Bulk Cargo Handling",
    category: "Port Operations",
    location: "Douala Port, Cameroon",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1504855901336-d35ab96bfc56?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1504855901336-d35ab96bfc56?q=80&w=600&auto=format&fit=crop",
    title: "Vessel at Douala Anchorage",
    category: "Ship Agency",
    location: "Douala, Cameroon",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=600&auto=format&fit=crop",
    title: "Bonabéri Warehouse Facility",
    category: "Warehousing",
    location: "Bonabéri, Douala",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=600&auto=format&fit=crop",
    title: "Air Cargo Loading Operations",
    category: "Air Freight",
    location: "Douala International Airport",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop",
    title: "Cargo Aircraft — Priority Shipment",
    category: "Air Freight",
    location: "Douala International Airport",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=600&auto=format&fit=crop",
    title: "CEMAC Corridor — Road Freight Convoy",
    category: "Road Freight",
    location: "Cameroon–Chad Corridor",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1586528116311-ad8ed3c84a0c?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1586528116311-ad8ed3c84a0c?q=80&w=600&auto=format&fit=crop",
    title: "Global Cargo Network Operations",
    category: "Port Operations",
    location: "Douala, Cameroon",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    title: "Customs Documentation & Clearance",
    category: "Port Operations",
    location: "Douala Customs Post",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=600&auto=format&fit=crop",
    title: "Operations Team — Douala HQ",
    category: "Team",
    location: "Douala, Cameroon",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
    title: "Ship Agency — Vessel Boarding",
    category: "Ship Agency",
    location: "Douala Port, Cameroon",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=600&auto=format&fit=crop",
    title: "Cross-Border Road Transport",
    category: "Road Freight",
    location: "Cameroon–Central Africa",
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1565793979887-f6b98b7eef55?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1565793979887-f6b98b7eef55?q=80&w=600&auto=format&fit=crop",
    title: "Warehouse Inventory Management",
    category: "Warehousing",
    location: "Bonabéri, Douala",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1473163928189-364b2c4e7135?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1473163928189-364b2c4e7135?q=80&w=600&auto=format&fit=crop",
    title: "Container Yard — Douala Terminal",
    category: "Port Operations",
    location: "Douala Port, Cameroon",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop",
    title: "Client Strategy Meeting",
    category: "Team",
    location: "Douala, Cameroon",
  },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === "All"
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  function openLightbox(photo: typeof photos[0]) {
    const idx = filtered.indexOf(photo);
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

  const lightboxPhoto = lightboxIndex !== null ? filtered[lightboxIndex] : null;

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
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Photo Gallery</p>
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
                  {cat === "All" ? photos.length : photos.filter((p) => p.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          {/* Masonry-style Grid */}
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
          >
            <AnimatePresence>
              {filtered.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  className="break-inside-avoid mb-4 group relative cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                  onClick={() => openLightbox(photo)}
                  data-testid={`gallery-photo-${photo.id}`}
                >
                  <img
                    src={photo.thumb}
                    alt={photo.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-semibold text-sm">{photo.title}</p>
                      <p className="text-gray-300 text-xs mt-1">{photo.location}</p>
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-accent text-white text-xs font-medium px-2 py-1 rounded-full">
                        {photo.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
            data-testid="lightbox"
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              data-testid="button-lightbox-close"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              data-testid="button-lightbox-prev"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              data-testid="button-lightbox-next"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxPhoto.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxPhoto.src}
                alt={lightboxPhoto.title}
                className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />
              <div className="mt-4 text-center">
                <p className="text-white font-semibold">{lightboxPhoto.title}</p>
                <div className="flex items-center justify-center gap-3 mt-1">
                  <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">{lightboxPhoto.category}</span>
                  <span className="text-gray-400 text-sm">{lightboxPhoto.location}</span>
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
