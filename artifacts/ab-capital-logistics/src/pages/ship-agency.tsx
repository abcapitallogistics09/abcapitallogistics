import { motion } from "framer-motion";
import { Link } from "wouter";
import shipAgencyHero from "@/assets/ship-agency-hero.png";
import { Button } from "@/components/ui/button";
import {
  Anchor, Ship, Clock, FileText, Users, Wrench,
  Radio, ShieldCheck, CheckCircle, ArrowRight, Phone, Mail,
} from "lucide-react";

const services = [
  {
    icon: Anchor,
    title: "Pre-Arrival Planning",
    desc: "Full pre-arrival coordination including berth booking, port formalities, and authority notifications well in advance of vessel arrival at Douala.",
  },
  {
    icon: FileText,
    title: "Documentation & Clearance",
    desc: "Complete vessel documentation handling — manifests, customs declarations, port authority permits, and health clearance certificates.",
  },
  {
    icon: Users,
    title: "Crew Handling",
    desc: "Comprehensive crew services including sign-on/sign-off, visa assistance, crew changes, medical assistance, and repatriation arrangements.",
  },
  {
    icon: Wrench,
    title: "Husbandry Services",
    desc: "Full vessel husbandry: provisions, spare parts delivery, deck and engine stores, fresh water, bunker coordination, and waste management.",
  },
  {
    icon: Ship,
    title: "Cargo Operations",
    desc: "Cargo operation supervision, tallying, stevedoring coordination, draft surveys, and damage reports in close liaison with port terminal operators.",
  },
  {
    icon: Radio,
    title: "Port Authority Liaison",
    desc: "Direct interface with Port Autonome de Douala (PAD), customs, maritime authority, and all relevant government agencies on behalf of principals.",
  },
  {
    icon: Clock,
    title: "24/7 Operations",
    desc: "Round-the-clock watch services for vessels calling at Douala and other Cameroonian ports, with a dedicated duty officer always on standby.",
  },
  {
    icon: ShieldCheck,
    title: "P&I Assistance",
    desc: "Liaison with P&I clubs and Hull & Machinery underwriters in the event of casualties, incidents, or cargo claims requiring local representation.",
  },
];

const stats = [
  { value: "200+", label: "Vessels Handled Annually" },
  { value: "24/7", label: "Port Watch Operations" },
  { value: "All", label: "Cameroon Ports Covered" },
  { value: "10+", label: "Years Port Agency Experience" },
];

const ports = [
  { name: "Douala Port", note: "Main deep-water port — primary hub for CEMAC trade" },
  { name: "Kribi Deep Sea Port", note: "Modern deep-water port for bulk and container cargo" },
  { name: "Limbe Port", note: "Coastal port for petroleum products and general cargo" },
  { name: "Tiko Port", note: "Banana and agri-commodity export terminal" },
];

const process = [
  { step: "01", title: "Vessel Nomination", desc: "Receive nomination from ship owner, operator, or charterer. Confirm appointment and issue agency agreement." },
  { step: "02", title: "Pre-Arrival", desc: "Submit ETA, pre-arrival documentation, cargo manifests, and crew lists to all port authorities and customs." },
  { step: "03", title: "Berthing & Arrival", desc: "Coordinate with PAD for berth allocation, pilot boarding, and vessel arrival. Meet ship and board for formalities." },
  { step: "04", title: "Port Stay", desc: "Manage all cargo operations, provisions, crew changes, repairs, and authority interfaces throughout the vessel's stay." },
  { step: "05", title: "Departure", desc: "Prepare all departure documentation, settle port dues, arrange pilot, and ensure smooth vessel departure." },
  { step: "06", title: "Post-Departure", desc: "Submit disbursement accounts, final reports, and all post-voyage documentation to principals within agreed timelines." },
];

export default function ShipAgency() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-32 pt-40 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('${shipAgencyHero}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary/60" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-accent text-sm font-semibold mb-6">
              <Anchor className="w-4 h-4" />
              Ship Agency Services
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Professional Port Agency<br />
              <span className="text-accent">at Douala & Beyond</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed mb-10">
              AB Capital Logistics is your trusted ship agent in Cameroon — providing seamless port agency services across all Cameroonian ports for vessel owners, operators, and charterers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quote" data-testid="link-ship-agency-quote">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8 font-semibold">
                  Request Agency Quote
                </Button>
              </Link>
              <Link href="/contact" data-testid="link-ship-agency-contact">
                <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/10 px-8">
                  Contact Our Port Team
                </Button>
              </Link>
            </div>
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
                data-testid={`stat-ship-${i}`}
              >
                <div className="text-4xl font-bold text-accent mb-2">{s.value}</div>
                <div className="text-blue-100 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Full-Scope Port Agency Services</h2>
            <p className="text-gray-600">Everything a vessel needs from pre-arrival to departure — handled by a single, experienced agency team.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-300 group"
                data-testid={`card-ship-service-${i}`}
              >
                <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                  <s.icon className="w-5 h-5 text-secondary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-bold text-primary mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">How We Work</p>
            <h2 className="text-3xl font-bold">Our Port Agency Process</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {process.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
                data-testid={`card-process-${i}`}
              >
                <div className="text-4xl font-bold text-accent/30 mb-3">{p.step}</div>
                <h3 className="font-bold text-white mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ports Covered */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Port Coverage</p>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">All Cameroonian Ports</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We provide ship agency services across all major ports in Cameroon, with a primary base of operations at the Port Autonome de Douala — Central Africa's busiest commercial port.
              </p>
              <div className="space-y-4 mb-8">
                {ports.map((port, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm" data-testid={`card-port-${i}`}>
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Anchor className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <p className="font-bold text-primary">{port.name}</p>
                      <p className="text-gray-500 text-sm">{port.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop"
                  alt="Douala Port operations"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-primary rounded-2xl shadow-xl p-5 text-white">
                <div className="text-3xl font-bold text-accent mb-1">24/7</div>
                <div className="text-xs text-gray-300">Port Watch Coverage</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Principals / Why Choose */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Why Choose Us</p>
            <h2 className="text-3xl font-bold text-primary mb-4">The AB Capital Advantage</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              "Direct relationships with Port Autonome de Douala management",
              "Experienced team of maritime professionals on the ground",
              "Competitive port disbursement accounts with full transparency",
              "Fast response times — always a duty officer available",
              "Liaison with all government bodies: customs, immigration, health",
              "Strong network of service providers: chandlers, workshops, surveyors",
              "Digital reporting — real-time port cost updates to principals",
              "FONASBA membership compliance standards",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            <div>
              <h2 className="text-2xl font-bold mb-2">24/7 Ship Agency Hotline</h2>
              <p className="text-blue-200">Our duty officer is always available for vessel operations and emergencies.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+237677238818" data-testid="link-ship-phone" className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                <Phone className="w-5 h-5" />
                +237 677-238-818
              </a>
              <a href="mailto:info@abcapitallogistics.com" data-testid="link-ship-email" className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                <Mail className="w-5 h-5" />
                Email Our Port Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Nominate Us as Your Douala Ship Agent</h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
            Send us your vessel's call details and we'll confirm our appointment and begin pre-arrival arrangements immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" data-testid="link-ship-cta-contact">
              <Button size="lg" className="bg-white text-accent hover:bg-gray-100 font-semibold px-10">
                Nominate AB Capital <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="https://wa.me/237677238818" target="_blank" rel="noopener noreferrer" data-testid="link-ship-whatsapp">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-10">
                WhatsApp Our Agent
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
