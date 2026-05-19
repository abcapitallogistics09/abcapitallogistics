import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Flame, ShoppingBag, Radio, Monitor, Heart, Wheat, Car, Store, Package } from "lucide-react";
import heroIndustries from "@/assets/hero-industries.png";

const industries = [
  {
    icon: Flame,
    name: "Oil & Gas",
    description: "Specialized logistics for the oil and gas sector, including heavy equipment transport, project cargo, and hazardous materials handling across Cameroon's energy corridors.",
    services: ["Heavy lift & project cargo", "Hazardous goods handling", "Drilling equipment transport", "Offshore supply chain"],
  },
  {
    icon: ShoppingBag,
    name: "FMCG",
    description: "Fast-moving consumer goods logistics with temperature control, rapid customs clearance, and distribution networks across Cameroon and CEMAC markets.",
    services: ["Cold chain logistics", "Rapid customs clearance", "Distribution networks", "Inventory management"],
  },
  {
    icon: Radio,
    name: "Telecom",
    description: "Logistics solutions for telecom infrastructure — from network equipment to tower components — with specialized handling and security for high-value technology shipments.",
    services: ["High-value cargo security", "Equipment installation support", "Customs clearance", "Warehousing"],
  },
  {
    icon: Monitor,
    name: "Technology",
    description: "Precision logistics for technology goods including electronics, servers, and sensitive equipment, with ESD-safe handling and climate-controlled storage.",
    services: ["ESD-safe handling", "Climate-controlled storage", "Express air freight", "Customs classification"],
  },
  {
    icon: Heart,
    name: "NGO & Humanitarian",
    description: "Dedicated support for NGOs and humanitarian organizations, with experience in donor-funded cargo, free zone handling, and rapid emergency response logistics.",
    services: ["Humanitarian cargo expertise", "Donor documentation", "Emergency logistics", "Free zone handling"],
  },
  {
    icon: Wheat,
    name: "Agriculture",
    description: "Agricultural logistics including fresh produce cold chain, bulk commodity shipping, and phytosanitary clearance for Cameroon's agricultural exports and imports.",
    services: ["Refrigerated transport", "Phytosanitary clearance", "Bulk commodity shipping", "Port handling"],
  },
  {
    icon: Car,
    name: "Automotive",
    description: "Complete automotive logistics — from new vehicle shipping via RoRo vessels to spare parts distribution and assembly line support across Central Africa.",
    services: ["RoRo vehicle shipping", "Spare parts logistics", "Bonded warehousing", "Assembly line support"],
  },
  {
    icon: Store,
    name: "Retail",
    description: "End-to-end retail logistics covering product sourcing from Asia and Europe, customs clearance, and distribution to retail outlets across Cameroon.",
    services: ["Sourcing logistics", "LCL consolidation", "Retail distribution", "Inventory replenishment"],
  },
  {
    icon: Package,
    name: "E-commerce",
    description: "E-commerce fulfillment solutions for online businesses in Cameroon — from international parcel imports to local last-mile delivery and returns management.",
    services: ["Parcel import handling", "Last-mile delivery", "Returns management", "Order fulfillment"],
  },
];

export default function Industries() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-32 pt-40 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url('${heroIndustries}')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary/60" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Sectors We Serve</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Industry <span className="text-accent">Expertise</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
              Deep sector knowledge enables us to solve the unique logistics challenges of each industry we serve across Central Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind, i) => (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-8 group"
                data-testid={`card-industry-${i}`}
              >
                <div className="w-14 h-14 bg-blue-50 text-secondary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-accent transition-colors duration-300">
                  <ind.icon className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-primary mb-3">{ind.name}</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{ind.description}</p>
                <ul className="space-y-2">
                  {ind.services.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Don't See Your Industry?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            We work with businesses across all sectors. Contact us to discuss your specific logistics requirements.
          </p>
          <Link href="/contact" data-testid="link-industries-contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold px-10">
              Speak to an Expert
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
