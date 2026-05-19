import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plane, Ship, Truck, ShieldCheck, Package, Globe, CheckCircle, ArrowRight } from "lucide-react";

type ServiceKey = "air-freight" | "ocean-freight" | "road-freight" | "customs-clearance" | "warehousing" | "3pl";

const serviceData: Record<ServiceKey, {
  icon: typeof Plane;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  benefits: string[];
  process: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  keywords: string[];
}> = {
  "air-freight": {
    icon: Plane,
    title: "Air Freight Services in Cameroon",
    subtitle: "Fast, Reliable Air Cargo Solutions",
    description: "In the fast-paced world of global trade, efficiency and speed are crucial. At AB Capital Logistics, we specialize in providing top-notch air freight shipping services to ensure your goods reach their destination swiftly and securely. With our vast experience and expertise, we offer tailored solutions that meet the unique needs of each client.",
    heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
    benefits: [
      "Fastest transit times for urgent cargo",
      "Global coverage through our carrier network",
      "Full documentation and customs handling",
      "Real-time cargo tracking",
      "Consolidation freight across Africa",
      "Last-mile delivery to final destination",
    ],
    process: [
      { step: "01", title: "Book Your Shipment", desc: "Contact us with your cargo details and we'll provide a competitive air freight quote within hours." },
      { step: "02", title: "Cargo Collection", desc: "We arrange pickup from your premises or nominated origin point and transport to the departure airport." },
      { step: "03", title: "Flight & Transit", desc: "Your cargo is booked on the most appropriate flight with our network of airline partners." },
      { step: "04", title: "Customs Clearance", desc: "Our customs team handles all import documentation and clearance at the destination airport." },
      { step: "05", title: "Last-Mile Delivery", desc: "Your cargo is delivered from the airport to the final destination, warehouse to doorstep." },
    ],
    faqs: [
      { q: "What types of cargo can you ship by air?", a: "We handle general cargo, perishables, high-value goods, urgent documents, electronics, pharmaceuticals, and more. We can also arrange special handling for oversized or temperature-sensitive cargo." },
      { q: "How long does air freight from China to Cameroon take?", a: "Standard air freight from China to Douala typically takes 3-7 business days. Express services can deliver in 2-3 days." },
      { q: "Do you offer door-to-door air freight services?", a: "Yes. Our air freight service includes pickup, export customs, air transport, import customs clearance in Cameroon, and delivery to the final destination." },
      { q: "What documents are required for air freight to Cameroon?", a: "Typically required: commercial invoice, packing list, airway bill, and import license (for restricted goods). We'll guide you on all required documentation." },
    ],
    keywords: ["air freight Cameroon", "air shipping Cameroon", "air cargo Douala", "air freight forwarder Cameroon"],
  },
  "ocean-freight": {
    icon: Ship,
    title: "Ocean Freight Services in Cameroon",
    subtitle: "Sea Shipping via Douala Port",
    description: "At AB Capital Logistics, we pride ourselves on providing top-notch ocean freight shipping services to businesses across the globe. We combine advanced tracking technology with streamlined logistics processes to give our clients complete visibility throughout the shipping journey.",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop",
    benefits: [
      "Full Container Load (FCL) and LCL options",
      "Cost-effective for large shipments",
      "Douala Port expertise and contacts",
      "Specialized cargo handling",
      "Advanced cargo tracking",
      "Competitive freight rates",
    ],
    process: [
      { step: "01", title: "Quote & Booking", desc: "We provide competitive sea freight quotes based on FCL or LCL, your commodity, and routing requirements." },
      { step: "02", title: "Cargo Receipt", desc: "Your goods are received at the origin CFS or port, inspected, and packed into containers." },
      { step: "03", title: "Vessel Departure", desc: "We book your cargo on the most appropriate vessel through our shipping line partnerships." },
      { step: "04", title: "Ocean Transit", desc: "Real-time tracking keeps you updated on your cargo's position throughout the sea journey." },
      { step: "05", title: "Douala Clearance & Delivery", desc: "Our team manages customs clearance at Douala Port and arranges inland transport to final destination." },
    ],
    faqs: [
      { q: "What is the difference between FCL and LCL?", a: "FCL (Full Container Load) means you use the entire container exclusively. LCL (Less than Container Load) means your cargo is consolidated with other shipments in one container, ideal for smaller quantities." },
      { q: "How long does ocean freight to Cameroon take?", a: "From Europe: 15-25 days. From Asia: 25-35 days. From USA East Coast: 20-30 days. Times vary by origin port and vessel schedule." },
      { q: "What are the main shipping lines serving Douala?", a: "Major lines serving Douala include Maersk, CMA CGM, MSC, Evergreen, PIL, and COSCO. We have partnerships with all major carriers." },
      { q: "Do you handle import customs at Douala Port?", a: "Yes. Customs clearance at Douala is a core service. Our licensed customs agents handle all import documentation, duty assessment, and port release." },
    ],
    keywords: ["ocean freight Cameroon", "sea shipping Cameroon", "freight forwarder Douala port", "shipping to Cameroon"],
  },
  "road-freight": {
    icon: Truck,
    title: "Road Freight Services in Central Africa",
    subtitle: "Cross-Border Logistics Across the CEMAC Corridor",
    description: "Reliable, fast, and cost-effective road freight across Cameroon and the entire CEMAC corridor. We connect Douala with landlocked countries including Chad, the Central African Republic, Congo, and Gabon through our extensive road network.",
    heroImage: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop",
    benefits: [
      "Full CEMAC corridor coverage",
      "Cross-border customs expertise",
      "Temperature-controlled transport",
      "GPS-tracked vehicles",
      "Last-mile delivery capability",
      "Competitive pricing",
    ],
    process: [
      { step: "01", title: "Route Planning", desc: "We assess your cargo requirements and plan the optimal route considering border crossing times and road conditions." },
      { step: "02", title: "Cargo Loading", desc: "Your goods are loaded in our secure, GPS-tracked vehicles at our Douala facility or your location." },
      { step: "03", title: "Transit", desc: "Our experienced drivers navigate cross-border routes with full knowledge of border procedures." },
      { step: "04", title: "Border Clearance", desc: "Our agents handle all customs documentation at each border crossing in the CEMAC zone." },
      { step: "05", title: "Final Delivery", desc: "Your cargo is delivered to the final destination anywhere in the CEMAC region." },
    ],
    faqs: [
      { q: "Which countries do you service by road?", a: "We provide road freight to Cameroon, Chad (N'Djamena), Central African Republic (Bangui), Republic of Congo (Brazzaville and Pointe-Noire), and Gabon (Libreville)." },
      { q: "How long does road freight from Douala to N'Djamena take?", a: "Transit time from Douala to N'Djamena, Chad is typically 7-14 days depending on border conditions and road status." },
      { q: "Do you have refrigerated trucks?", a: "Yes. We have temperature-controlled vehicles for pharmaceuticals, food products, and other temperature-sensitive cargo." },
      { q: "Can you handle oversized or project cargo?", a: "Yes. We have experience with heavy-lift and oversized loads and can arrange special permits and escorts as required." },
    ],
    keywords: ["road freight Cameroon", "CEMAC logistics", "cross border shipping Central Africa", "transport Douala to Chad"],
  },
  "customs-clearance": {
    icon: ShieldCheck,
    title: "Customs Clearance Services in Cameroon",
    subtitle: "Expert Brokerage at Douala Port",
    description: "We offer fast and reliable customs clearance services to ensure your shipments move across borders smoothly and without delays. Our licensed customs brokers have deep expertise in Cameroonian import/export regulations and work closely with DGDDI (Direction Générale des Douanes et Droits Indirects).",
    heroImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2074&auto=format&fit=crop",
    benefits: [
      "Licensed customs broker in Cameroon",
      "Import and export clearance",
      "Duty and tax optimization",
      "All commodity types",
      "Rapid processing times",
      "Full compliance guarantee",
    ],
    process: [
      { step: "01", title: "Document Submission", desc: "You provide us with commercial invoice, bill of lading/airway bill, packing list, and any applicable permits." },
      { step: "02", title: "Classification & Assessment", desc: "We classify your goods under the correct HS tariff codes and calculate applicable duties and taxes." },
      { step: "03", title: "Declaration Filing", dest: "", desc: "We file the import/export declaration with Cameroonian customs electronically." },
      { step: "04", title: "Inspection (if required)", desc: "We coordinate any required physical inspections, Cotecna or BIVAC verifications, and comply with all regulatory requirements." },
      { step: "05", title: "Release & Delivery", desc: "Once cleared, we arrange port release and inland transport to your warehouse or final destination." },
    ],
    faqs: [
      { q: "What documents are needed to import to Cameroon?", a: "Standard documents include: commercial invoice, packing list, bill of lading/airway bill, import declaration, phytosanitary certificate (for agricultural products), and an import license for restricted goods." },
      { q: "How long does customs clearance take at Douala Port?", a: "With all documents in order, clearance typically takes 2-5 business days. We aim to minimize delays through proactive document preparation and our established relationships with customs authorities." },
      { q: "Can you help reduce import duties?", a: "Yes. We can advise on applicable preferential tariffs, trade agreements (CEMAC, ACP-EU), and duty optimization strategies to minimize your tax burden within legal frameworks." },
      { q: "Do you handle goods requiring special permits?", a: "Yes, including pharmaceuticals, electronics, food products, chemicals, and other regulated commodities. We guide you through the permit process." },
    ],
    keywords: ["customs clearance Douala", "customs agent Cameroon", "import clearance Cameroon", "customs broker Douala"],
  },
  "warehousing": {
    icon: Package,
    title: "Warehousing & Distribution in Cameroon",
    subtitle: "Secure Storage and Logistics in Douala",
    description: "Our modern warehousing facility in Bonabéri, Douala provides secure storage, real-time inventory management, and efficient distribution services. Whether you need short-term or long-term storage, we have the capacity and systems to support your operations.",
    heroImage: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop",
    benefits: [
      "Modern, secure facility in Bonabéri",
      "24/7 security and surveillance",
      "Real-time inventory tracking",
      "Climate-controlled storage available",
      "Pick, pack, and dispatch services",
      "Flexible short and long-term contracts",
    ],
    process: [
      { step: "01", title: "Space Assessment", desc: "We assess your storage needs and assign the appropriate space in our Douala warehouse." },
      { step: "02", title: "Cargo Receipt", desc: "Your goods are received, inspected, labeled, and entered into our warehouse management system." },
      { step: "03", title: "Storage & Management", desc: "Real-time inventory tracking lets you monitor stock levels, movements, and valuations at any time." },
      { step: "04", title: "Order Processing", desc: "We receive your orders, pick and pack items, and prepare them for dispatch." },
      { step: "05", title: "Distribution", desc: "We distribute your goods to retailers, distributors, or end customers across Cameroon and Central Africa." },
    ],
    faqs: [
      { q: "What types of goods can you warehouse?", a: "We handle a wide range of commodities including FMCG goods, electronics, auto parts, industrial equipment, and more. We have climate-controlled sections for sensitive products." },
      { q: "Can I access my stock at any time?", a: "Yes. You can access your inventory during business hours, and our online portal gives you real-time visibility 24/7." },
      { q: "Do you offer fulfillment services for e-commerce?", a: "Yes. We offer order fulfillment services including receiving, storage, pick & pack, labeling, and shipping for e-commerce businesses." },
      { q: "What is the minimum storage period?", a: "We offer flexible contracts starting from one month. For project-based storage, we can accommodate even shorter periods." },
    ],
    keywords: ["warehousing Cameroon", "logistics warehouse Douala", "storage facility Cameroon", "distribution Cameroon"],
  },
  "3pl": {
    icon: Globe,
    title: "3PL Logistics Solutions in Cameroon",
    subtitle: "Integrated Third-Party Logistics Services",
    description: "Our 3PL services integrate warehousing, transportation, and order fulfillment into one complete solution, allowing you to focus on growing your business. We become an extension of your supply chain, managing the complexity so you don't have to.",
    heroImage: "https://images.unsplash.com/photo-1586528116311-ad8ed3c84a0c?q=80&w=2070&auto=format&fit=crop",
    benefits: [
      "End-to-end supply chain management",
      "Scalable operations that grow with you",
      "Reduced logistics costs",
      "Single point of contact",
      "Reverse logistics management",
      "Technology-enabled visibility",
    ],
    process: [
      { step: "01", title: "Supply Chain Analysis", desc: "We analyze your supply chain to identify opportunities for optimization, cost reduction, and efficiency gains." },
      { step: "02", title: "Solution Design", desc: "We design a customized 3PL solution covering inbound freight, warehousing, inventory, and outbound distribution." },
      { step: "03", title: "Integration", desc: "We integrate with your systems and ERP for seamless data flow and real-time visibility." },
      { step: "04", title: "Operations", desc: "Our team manages day-to-day operations including receiving, storage, picking, packing, and dispatching." },
      { step: "05", title: "Reporting & Optimization", desc: "Regular KPI reporting and continuous improvement initiatives ensure your logistics keeps pace with your growth." },
    ],
    faqs: [
      { q: "What is 3PL?", a: "Third-Party Logistics (3PL) means outsourcing your logistics operations — including transportation, warehousing, and fulfillment — to a specialized provider like AB Capital Logistics." },
      { q: "Why should I use 3PL instead of managing logistics in-house?", a: "3PL lets you leverage our expertise, infrastructure, and scale without the capital investment. You save on warehouse space, vehicles, staff, and technology while gaining access to a professional logistics network." },
      { q: "Can your 3PL service scale with my business?", a: "Absolutely. Our flexible 3PL model scales with your volume — whether you're shipping 10 orders or 10,000 per month, we adapt our resources accordingly." },
      { q: "Do you offer reverse logistics?", a: "Yes. Our reverse logistics service manages product returns, refurbishment, recycling, or disposal, helping you reduce costs and improve customer satisfaction." },
    ],
    keywords: ["3PL Cameroon", "third party logistics Cameroon", "outsourced logistics Cameroon", "supply chain Cameroon"],
  },
};

interface ServiceDetailProps {
  params: { slug?: string };
}

export default function ServiceDetail({ params }: ServiceDetailProps) {
  const slug = (params?.slug || "") as ServiceKey;
  const service = serviceData[slug];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Service Not Found</h1>
          <Link href="/services" data-testid="link-back-services">
            <Button className="bg-accent hover:bg-accent/90 text-white">View All Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-32 pt-40 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('${service.heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary/80" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-accent text-sm font-medium mb-4">
              <Link href="/services" className="hover:underline">Services</Link>
              <span>/</span>
              <span>{service.title}</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-accent" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{service.title}</h1>
            <p className="text-xl text-gray-300 max-w-2xl">{service.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Service Overview</p>
              <h2 className="text-3xl font-bold text-primary mb-6">{service.subtitle}</h2>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">{service.description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/quote" data-testid="link-service-quote">
                  <Button className="bg-accent hover:bg-accent/90 text-white px-8">Request a Quote</Button>
                </Link>
                <Link href="/contact" data-testid="link-service-contact">
                  <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white px-8">Contact Us</Button>
                </Link>
              </div>
            </div>
            <div className="bg-primary rounded-2xl p-8 text-white">
              <h3 className="text-lg font-bold mb-6">Key Benefits</h3>
              <ul className="space-y-4">
                {service.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 text-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">How It Works</p>
            <h2 className="text-3xl font-bold text-primary">Our Process</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {service.process.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 relative">
                  {p.step}
                  {i < service.process.length - 1 && (
                    <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-300" style={{ width: "calc(100% - 14px)", left: "calc(100% + 7px)" }} />
                  )}
                </div>
                <h3 className="font-bold text-primary text-sm mb-2">{p.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Common Questions</p>
            <h2 className="text-3xl font-bold text-primary">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {service.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-white border border-gray-100 rounded-xl px-6 shadow-sm" data-testid={`faq-item-${i}`}>
                <AccordionTrigger className="text-left font-semibold text-primary hover:text-accent hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Form */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
            Request a quote today and our team will respond with a competitive, tailored solution within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" data-testid="link-service-cta-quote">
              <Button size="lg" className="bg-white text-accent hover:bg-gray-100 font-semibold px-10">
                Request a Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/contact" data-testid="link-service-cta-contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-10">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
