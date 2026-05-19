import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Search, Calendar, ArrowRight, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

export const blogPosts = [
  {
    slug: "understanding-customs-clearance-cameroon",
    title: "Understanding Customs Clearance in Cameroon: A Complete Guide",
    category: "Customs",
    date: "May 10, 2026",
    readTime: "8 min read",
    excerpt: "Importing goods into Cameroon can be complex. This comprehensive guide explains the customs clearance process at Douala Port, required documentation, duty calculation, and how to avoid common pitfalls.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    content: `Customs clearance is one of the most critical steps in the import process in Cameroon. Whether you're importing goods through Douala Port, Nsimalen Airport, or any land border crossing, understanding the process is essential to avoid delays and unnecessary costs.

## The Customs Clearance Process in Cameroon

The Direction Générale des Douanes et Droits Indirects (DGDDI) is responsible for administering customs in Cameroon. All imports must pass through their clearance process, which includes:

**1. Document Preparation**
Before your cargo arrives, you need to prepare: Commercial invoice, Packing list, Bill of Lading or Airway Bill, Import Declaration, and any special permits for restricted goods.

**2. Pre-Arrival Declaration**
Modern customs management in Cameroon allows for pre-arrival declarations through the SYDONIA system, enabling faster clearance once cargo arrives.

**3. Duty Assessment**
Duties are calculated based on the HS tariff classification and the CIF (Cost, Insurance, Freight) value. Rates vary from 0% to 30% depending on the commodity.

**4. Inspection**
Not all shipments undergo physical inspection. COTECNA provides pre-shipment inspection for high-value imports. Risk-based targeting determines which shipments require physical examination.

**5. Payment and Release**
Once duties are assessed and paid, the customs release order is issued and your cargo can be removed from the port or airport.

## Working with a Licensed Customs Broker

Using a licensed customs broker like AB Capital Logistics significantly reduces clearance time and risk. Our brokers know the regulations, have established relationships with customs officials, and can proactively identify and resolve potential issues before they cause delays.

## Contact Us

For assistance with your customs clearance needs, contact our team at info@abcapitallogistics.com or call +237 677-238-818.`,
  },
  {
    slug: "douala-port-import-guide",
    title: "Douala Port Import Procedures: What Every Importer Needs to Know",
    category: "Ocean Freight",
    date: "April 28, 2026",
    readTime: "10 min read",
    excerpt: "Douala Port is the gateway to Central Africa. This guide covers everything you need to know about importing through Cameroon's main seaport, from vessel arrival to cargo collection.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop",
    content: `Douala Port, also known as the Port Autonome de Douala (PAD), is the largest port in Central Africa and handles over 90% of Cameroon's international trade. Understanding how to navigate its import procedures is essential for any business importing goods into Cameroon or the wider CEMAC region.

## Key Facts About Douala Port

- Location: Wouri River estuary, Douala, Cameroon
- Annual throughput: Approximately 12 million tonnes
- Main berths: Container terminal, Bulk terminal, RoRo terminal, Oil terminal
- Management: Port Autonome de Douala (PAD)

## Step-by-Step Import Process

The import process at Douala Port typically follows these stages...`,
  },
  {
    slug: "air-vs-ocean-freight-cameroon",
    title: "Air vs Ocean Freight to Cameroon: Which is Right for Your Business?",
    category: "Freight Tips",
    date: "April 15, 2026",
    readTime: "6 min read",
    excerpt: "Choosing between air and ocean freight for your Cameroon shipments is a critical decision. We break down the cost, speed, and suitability factors to help you make the right choice.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop",
    content: `When shipping goods to Cameroon, one of the most important decisions you'll make is the choice between air freight and ocean freight. Each mode has distinct advantages and is suited to different types of cargo and business needs.

## Air Freight: Speed Over Cost

Air freight is the fastest shipping method, with transit times from Europe typically 3-5 days and from Asia 5-7 days. However, it is significantly more expensive than sea freight — typically 4-6 times the cost per kilogram.

**Best suited for:** High-value goods, urgent shipments, perishables, pharmaceuticals, and small quantities where speed justifies cost.

## Ocean Freight: Cost Efficiency at Scale

Ocean freight is the most cost-effective method for large volumes, with transit times from Europe of 15-25 days and from Asia 25-35 days. The choice between FCL (Full Container Load) and LCL (Less than Container Load) further affects cost.

**Best suited for:** Large volumes, non-urgent goods, raw materials, machinery, FMCG, and commodities.`,
  },
  {
    slug: "cemac-trade-corridor-opportunities",
    title: "The CEMAC Trade Corridor: Logistics Opportunities for Central Africa",
    category: "Trade Insights",
    date: "March 30, 2026",
    readTime: "7 min read",
    excerpt: "The CEMAC economic community represents a market of over 55 million people. Learn how Cameroon's position as the gateway to this corridor creates significant logistics opportunities.",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800&auto=format&fit=crop",
    content: `The Economic and Monetary Community of Central Africa (CEMAC) — comprising Cameroon, Chad, Central African Republic, Congo, Gabon, and Equatorial Guinea — represents one of Africa's most strategically important trade corridors.

## Cameroon as the Gateway

With the only major deep-water port in the sub-region (Douala), Cameroon serves as the natural gateway for all CEMAC countries that lack direct sea access. Chad, the Central African Republic, and the Congo Republic rely heavily on Douala port for their imports.

## Road Freight Corridors

The main road corridors connecting Douala to the interior include:
- **Douala – N'Djamena (Chad):** ~1,800km, 7-14 days
- **Douala – Bangui (CAR):** ~1,500km, 10-14 days  
- **Douala – Brazzaville (Congo):** ~900km, 5-8 days`,
  },
  {
    slug: "3pl-vs-inhouse-logistics",
    title: "3PL vs In-House Logistics: Which Model is Right for Your Business in Cameroon?",
    category: "Supply Chain",
    date: "March 12, 2026",
    readTime: "5 min read",
    excerpt: "Should you manage your own logistics or outsource to a 3PL provider? We compare both models for businesses operating in the Cameroon market.",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800&auto=format&fit=crop",
    content: `As your business grows in the Cameroon market, logistics management becomes increasingly complex and costly. At some point, most businesses face a critical decision: continue managing logistics in-house, or outsource to a third-party logistics (3PL) provider.

## The In-House Logistics Model

Managing your own logistics gives you direct control over operations. However, it requires significant capital investment in warehouses, vehicles, staff, and technology. In Cameroon's environment, this also means dealing directly with customs, port operations, and cross-border complexity.

## The 3PL Model

A 3PL provider takes on these responsibilities, using their expertise, infrastructure, and scale to deliver logistics services more efficiently than most companies can achieve on their own.

## Our Recommendation

For most businesses importing to or operating in Cameroon, a 3PL model provides better cost efficiency and operational flexibility. Contact AB Capital Logistics to discuss how our 3PL services can transform your supply chain.`,
  },
  {
    slug: "choosing-freight-forwarder-cameroon",
    title: "How to Choose a Freight Forwarder in Cameroon",
    category: "Freight Tips",
    date: "February 25, 2026",
    readTime: "5 min read",
    excerpt: "Not all freight forwarders in Cameroon are equal. Here's what to look for when selecting a logistics partner to handle your international shipments.",
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=800&auto=format&fit=crop",
    content: `Choosing the right freight forwarder is one of the most important decisions you'll make for your import or export business in Cameroon. The wrong choice can lead to delays, unexpected costs, cargo damage, or compliance issues.

## Key Criteria for Selecting a Freight Forwarder

**1. Licensing and Accreditation**
Ensure the freight forwarder is properly licensed by Cameroonian authorities and is a member of recognized industry associations.

**2. Experience in Cameroon**
Local market knowledge is invaluable. An experienced forwarder will know Douala Port, the customs process, and how to navigate the local regulatory environment.

**3. Network and Carrier Relationships**
A good freight forwarder maintains strong relationships with shipping lines, airlines, and customs authorities, enabling better rates and preferential treatment.

**4. Technology and Tracking**
Modern freight forwarders offer real-time cargo visibility through online tracking portals.

**5. Communication and Responsiveness**
You need a partner who responds promptly and proactively communicates about your shipment status.

AB Capital Logistics meets all these criteria and more. Contact us to discuss your freight requirements.`,
  },
];

const categories = ["All", "Customs", "Ocean Freight", "Freight Tips", "Trade Insights", "Supply Chain"];

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
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary/80" />
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
                    transition={{ delay: i * 0.1 }}
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
