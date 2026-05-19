import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, Anchor, Plane, Truck, MapPin } from "lucide-react";
import heroGlobalNetwork from "@/assets/hero-global-network.png";

const regions = [
  {
    region: "Central Africa (HQ Region)",
    countries: ["Cameroon", "Chad", "Central African Republic", "Congo (Brazzaville)", "Gabon", "Equatorial Guinea"],
    description: "Our home market. We have the deepest expertise in the Central African logistics environment, including border crossing procedures, road conditions, and customs regulations for every CEMAC country.",
    capabilities: ["Douala Port clearing", "CEMAC road freight", "Cross-border customs", "Last-mile delivery"],
  },
  {
    region: "West Africa",
    countries: ["Nigeria", "Ghana", "Senegal", "Côte d'Ivoire", "Togo"],
    description: "We maintain strong partner relationships throughout West Africa, enabling us to offer competitive freight services and intermodal connections across the region.",
    capabilities: ["Interregional road freight", "Port-to-port connections", "Agent network"],
  },
  {
    region: "Europe",
    countries: ["France", "Germany", "Belgium", "Netherlands", "UK", "Spain", "Italy"],
    description: "Europe is the largest source of imports to Cameroon. We have established agent partnerships with major European freight forwarders in all key trade hubs.",
    capabilities: ["LCL consolidation from Europe", "Air cargo from Paris, Frankfurt, Brussels", "Project cargo"],
  },
  {
    region: "Asia",
    countries: ["China", "India", "Singapore", "Hong Kong", "South Korea", "Japan"],
    description: "Asia — particularly China — is the largest single source of goods imported to Cameroon. We offer competitive FCL and LCL rates from all major Chinese ports.",
    capabilities: ["FCL and LCL from China", "Factory inspection coordination", "Consolidation hubs in Shanghai, Guangzhou"],
  },
  {
    region: "Middle East",
    countries: ["UAE", "Saudi Arabia", "Turkey", "Lebanon"],
    description: "Dubai serves as a major transit hub for goods destined for Cameroon. We offer both direct and hub-and-spoke routing through the Middle East.",
    capabilities: ["Dubai hub routing", "Air freight from UAE", "Ocean freight connections"],
  },
  {
    region: "Americas",
    countries: ["USA", "Canada", "Brazil"],
    description: "For clients importing from the Americas, we offer ocean freight services from major East and Gulf Coast ports, as well as air freight from North American cities.",
    capabilities: ["East Coast ocean freight", "Air freight from Miami, New York", "Project cargo from US"],
  },
];

const partners = [
  { name: "Maersk", type: "Shipping Line" },
  { name: "CMA CGM", type: "Shipping Line" },
  { name: "MSC", type: "Shipping Line" },
  { name: "COSCO", type: "Shipping Line" },
  { name: "Evergreen", type: "Shipping Line" },
  { name: "PIL", type: "Shipping Line" },
  { name: "FedEx", type: "Air Freight" },
  { name: "DHL", type: "Express Courier" },
];

export default function GlobalNetwork() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-32 pt-40 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url('${heroGlobalNetwork}')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary/60" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Our Reach</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Global Network, <span className="text-accent">Local Expertise</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
              A worldwide network of carrier partnerships and logistics agents, anchored by unmatched expertise in Cameroon and Central Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Network Visual */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { icon: Globe, value: "120+", label: "Countries Connected" },
              { icon: Anchor, value: "8+", label: "Shipping Line Partners" },
              { icon: Plane, value: "200+", label: "Airline Partners" },
              { icon: Truck, value: "CEMAC", label: "Road Coverage" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-accent" />
                </div>
                <div className="text-3xl font-bold text-accent mb-1">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Coverage */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Regional Presence</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Where We Operate</h2>
            <p className="text-gray-600">From Central Africa's trade corridors to major global shipping hubs, our network connects your cargo to any corner of the world.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {regions.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white rounded-2xl border shadow-sm p-8 ${i === 0 ? 'border-accent' : 'border-gray-100'}`}
                data-testid={`card-region-${i}`}
              >
                {i === 0 && (
                  <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-4">HQ Region</span>
                )}
                <h3 className="text-xl font-bold text-primary mb-3">{r.region}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {r.countries.map((c) => (
                    <span key={c} className="flex items-center gap-1 bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">
                      <MapPin className="w-3 h-3 text-accent" />{c}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{r.description}</p>
                <div className="space-y-2">
                  {r.capabilities.map((cap) => (
                    <div key={cap} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                      {cap}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Partners */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Our Partners</p>
            <h2 className="text-3xl font-bold text-primary mb-4">Global Carrier Partners</h2>
            <p className="text-gray-600">We maintain strategic partnerships with the world's leading shipping lines and airlines, ensuring competitive rates and reliable service.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-3xl mx-auto">
            {partners.map((partner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow"
                data-testid={`card-partner-${i}`}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <p className="font-bold text-primary text-sm">{partner.name}</p>
                <p className="text-xs text-gray-400 mt-1">{partner.type}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Connect Your Business to the World?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Leverage our global network to move your cargo anywhere with confidence and precision.
          </p>
          <Link href="/quote" data-testid="link-network-quote">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold px-10">Request a Quote</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
