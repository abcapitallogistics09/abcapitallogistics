import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Globe, Clock, Award, CheckCircle, Target, Eye, Heart } from "lucide-react";
import heroAbout from "@/assets/hero-about.png";

const stats = [
  { value: "15,000+", label: "Shipments Delivered" },
  { value: "120+", label: "Countries Served" },
  { value: "98.5%", label: "Clearance Success Rate" },
  { value: "10+", label: "Years of Experience" },
];

const values = [
  {
    icon: Shield,
    title: "Reliability",
    desc: "We deliver on our commitments — every shipment, every time. Our track record speaks for itself across Cameroon and Central Africa.",
  },
  {
    icon: Globe,
    title: "Global Reach, Local Expertise",
    desc: "We combine a worldwide logistics network with deep knowledge of the Cameroon market, CEMAC regulations, and Central African trade corridors.",
  },
  {
    icon: Clock,
    title: "Speed & Efficiency",
    desc: "Time is money in trade. We optimize every step of the supply chain to minimize transit times and eliminate unnecessary delays.",
  },
  {
    icon: Award,
    title: "Excellence",
    desc: "We hold ourselves to international standards. Every operation is executed with precision, professionalism, and attention to detail.",
  },
  {
    icon: Heart,
    title: "Customer First",
    desc: "Your business success is our success. We build long-term partnerships by understanding your unique needs and delivering tailored solutions.",
  },
  {
    icon: CheckCircle,
    title: "Compliance & Integrity",
    desc: "We operate with full regulatory compliance across all jurisdictions, ensuring your cargo moves legally, safely, and without surprises.",
  },
];

const milestones = [
  { year: "2014", event: "AB Capital Logistics founded in Douala, Cameroon" },
  { year: "2016", event: "Expanded ocean freight operations through Douala Port" },
  { year: "2018", event: "Launched full customs clearance division" },
  { year: "2020", event: "Opened warehousing & 3PL facility in Bonabéri" },
  { year: "2022", event: "Extended road freight coverage across full CEMAC corridor" },
  { year: "2024", event: "Achieved 15,000+ shipments milestone" },
  { year: "2026", event: "Continuing to grow as Central Africa's premier logistics partner" },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-32 pt-40 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url('${heroAbout}')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary/60" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-accent font-semibold mb-4 tracking-wide uppercase text-sm">About Us</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Central Africa's Trusted <span className="text-accent">Logistics Gateway</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              AB Capital Logistics is the premier freight forwarding and logistics company in Cameroon, 
              connecting businesses across Central Africa to global markets with precision, speed, and integrity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl font-bold text-accent mb-2" data-testid={`stat-value-${i}`}>{s.value}</div>
                <div className="text-blue-100 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Our Story</p>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Built for the Demands of African Trade
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                AB Capital Logistics was founded in Douala, Cameroon with a single vision: to build a world-class 
                logistics operation that truly understands the complexities of doing business in Central Africa.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Operating from Douala — the economic capital of Cameroon and the largest port city in Central Africa — 
                we are uniquely positioned to serve as the gateway for trade flowing across the entire CEMAC region, 
                including Cameroon, Chad, the Central African Republic, Congo, Gabon, and Equatorial Guinea.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we serve hundreds of businesses ranging from multinational corporations to local SMEs, 
                providing the same enterprise-grade reliability and global connectivity regardless of shipment size.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-primary rounded-2xl p-10 text-white"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Our Mission</h3>
              </div>
              <p className="text-gray-300 mb-10 leading-relaxed">
                To be the most reliable and innovative logistics partner in Central Africa, enabling our clients to 
                compete on the global stage through seamless, cost-effective, and technology-enabled supply chain solutions.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Our Vision</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To be recognized as the premier gateway logistics partner for Central Africa — a company that 
                international businesses trust to navigate the opportunities and challenges of African trade.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Core Values</h2>
            <p className="text-gray-600">The principles that guide every decision, every shipment, every relationship.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-5">
                  <v.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Our Journey</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Company Timeline</h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex gap-8 mb-8 last:mb-0"
              >
                <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-accent font-bold text-xs text-center leading-tight">{m.year}</span>
                </div>
                <div className="flex-1 bg-white border border-gray-100 rounded-xl p-5 shadow-sm mt-3">
                  <p className="text-gray-700">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Partner With Us?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of businesses that trust AB Capital Logistics for their supply chain needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" data-testid="link-about-quote">
              <Button size="lg" className="bg-white text-accent hover:bg-gray-100 font-semibold px-8">Request a Quote</Button>
            </Link>
            <Link href="/contact" data-testid="link-about-contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
