import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plane, Ship, Truck, Package, ShieldCheck, Globe } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[100dvh] flex items-center justify-center bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed3c84a0c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/40"></div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-6 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-accent text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Gateway to Central Africa
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Your Trusted Logistics Partner in <span className="text-accent">Cameroon</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Freight Forwarding • Customs Clearance • Warehousing • 3PL Solutions. 
              Enterprise-grade reliability for global trade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quote" data-testid="link-hero-quote">
                <Button size="lg" className="h-14 px-8 text-lg bg-accent hover:bg-accent/90 text-white w-full sm:w-auto">
                  Request a Quote
                </Button>
              </Link>
              <Link href="/tracking" data-testid="link-hero-track">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  Track Shipment
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Comprehensive Logistics Solutions</h2>
            <p className="text-muted-foreground text-lg">Delivering excellence across every stage of your supply chain.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Plane, title: "Air Freight", desc: "Time-definite air freight solutions with global coverage." },
              { icon: Ship, title: "Ocean Freight", desc: "FCL and LCL cargo shipping via Douala port." },
              { icon: Truck, title: "Road Freight", desc: "Reliable transportation across the CEMAC corridor." },
              { icon: ShieldCheck, title: "Customs Clearance", desc: "Expert compliance and rapid import/export processing." },
              { icon: Package, title: "Warehousing", desc: "Secure storage and sophisticated inventory management." },
              { icon: Globe, title: "3PL Solutions", desc: "End-to-end integrated supply chain optimization." },
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-blue-50 text-secondary rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <s.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{s.title}</h3>
                <p className="text-gray-600 mb-6">{s.desc}</p>
                <Link href={`/services`} className="inline-flex items-center text-secondary font-medium hover:text-accent transition-colors">
                  Explore Service <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">15k+</div>
              <div className="text-blue-100">Shipments Delivered</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">120+</div>
              <div className="text-blue-100">Countries Served</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">98.5%</div>
              <div className="text-blue-100">Clearance Success</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">99%</div>
              <div className="text-blue-100">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
