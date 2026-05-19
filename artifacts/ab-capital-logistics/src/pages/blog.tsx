import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Search, Calendar, ArrowRight, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import heroBlog from "@/assets/hero-blog.png";
import { blogPosts } from "./blog-data";

const categories = ["All", "Air Freight", "Ocean Freight", "Customs", "Supply Chain", "Trade Insights"];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const [featured, ...rest] = filtered;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-32 pt-40 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url('${heroBlog}')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary/60" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Insights & News</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Logistics Blog</h1>
            <p className="text-gray-300 text-lg max-w-xl mb-8">
              Expert insights on freight, customs, and supply chain for Cameroon and Central Africa.
            </p>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                data-testid="input-blog-search"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                data-testid={`button-category-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">No articles found matching your search.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <Link href={`/blog/${featured.slug}`} data-testid="link-featured-post">
                    <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="aspect-video lg:aspect-auto overflow-hidden">
                        <img
                          src={featured.image}
                          alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full">{featured.category}</span>
                          <span className="text-xs text-gray-400">Featured</span>
                        </div>
                        <h2 className="text-2xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">{featured.title}</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">{featured.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{featured.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{featured.readTime}</span>
                        </div>
                        <span className="inline-flex items-center text-accent font-semibold gap-2 group-hover:gap-3 transition-all">
                          Read Article <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Rest of Posts */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((post, i) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    data-testid={`card-blog-post-${i}`}
                  >
                    <Link href={`/blog/${post.slug}`} className="block group h-full">
                      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow h-full">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6">
                          <span className="bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span>
                          <h3 className="text-lg font-bold text-primary mt-3 mb-3 group-hover:text-accent transition-colors">{post.title}</h3>
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{post.excerpt}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
