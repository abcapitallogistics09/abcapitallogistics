import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plane, Ship, Truck, ShieldCheck, Package, Globe, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Plane,
    title: "Air Freight",
    slug: "air-freight",
    description: "Time-definite, reliable air freight solutions for urgent and high-value cargo. We cover international routes with full documentation handling and last-mile delivery across Cameroon and Central Africa.",
    highlights: ["Express & Standard Air", "Consolidation Services", "Door-to-Door Delivery", "Global Route Coverage"],
  },
  {
    icon: Ship,
    title: "Ocean Freight",
    slug: "ocean-freight",
    description: "Full Container Load (FCL) and Less-than-Container Load (LCL) shipments via Douala Port. We manage the entire sea freight process from origin to final destination.",
    highlights: ["FCL & LCL Options", "Douala Port Expertise", "Specialized Cargo", "Real-Time Tracking"],
  },
  {
    icon: Truck,
    title: "Road Freight",
    slug: "road-freight",
    description: "Reliable cross-border road freight covering the entire CEMAC corridor — Cameroon, Chad, CAR, Congo, and Gabon. Fast, cost-effective transport for all cargo types.",
    highlights: ["CEMAC Corridor Coverage", "Cross-Border Expertise", "Last-Mile Delivery", "Temperature Controlled"],
  },
  {
    icon: ShieldCheck,
    title: "Customs Clearance",
    slug: "customs-clearance",
    description: "Expert customs brokerage services for seamless import and export processing through Douala and all Cameroonian entry points. We ensure full compliance and minimal delays.",
    highlights: ["Import & Export", "Duty & Tax Advisory", "Documentation", "Inspection Coordination"],
  },
  {
    icon: Package,
    title: "Warehousing",
    slug: "warehousing",
    description: "Secure, modern warehousing facilities in Douala with real-time inventory management, order fulfillment, and distribution services for businesses of all sizes.",
    highlights: ["Secure Storage", "Inventory Management", "Order Fulfillment", "Real-Time Reporting"],
  },
  {
    icon: Globe,
    title: "3PL Solutions",
    slug: "3pl",
    description: "End-to-end third-party logistics that integrates warehousing, transportation, and order fulfillment into one seamless operation, letting you focus on growing your business.",
    highlights: ["Integrated Supply Chain", "Reverse Logistics", "Distribution Network", "Scalable Solutions"],
  },
];

export default function Services() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-32 pt-40 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary/80" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">What We Offer</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Comprehensive <span className="text-accent">Logistics Services</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
              From air freight to customs clearance, we provide enterprise-grade logistics solutions tailored for Cameroon and Central Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
                data-testid={`card-service-${s.slug}`}
              >
                <div className="p-8">
                  <div className="w-14 h-14 bg-blue-50 text-secondary rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    <s.icon className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-bold text-primary mb-3">{s.title}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{s.description}</p>
                  <ul className="space-y-2 mb-8">
                    {s.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-8 pb-8">
                  <Link href={`/services/${s.slug}`} data-testid={`link-service-${s.slug}`}>
                    <Button className="w-full bg-primary hover:bg-secondary text-white group-hover:bg-accent group-hover:hover:bg-accent/90 transition-colors">
                      Learn More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Need a Custom Logistics Solution?</h2>
          <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
            Our experts will design a tailored solution for your specific cargo requirements and business goals.
          </p>
          <Link href="/quote" data-testid="link-services-quote">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold px-10">
              Request a Quote
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
