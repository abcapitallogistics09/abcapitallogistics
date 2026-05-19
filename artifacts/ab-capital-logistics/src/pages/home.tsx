import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ArrowLeft, ArrowRight as ArrowRightIcon,
  Plane, Ship, Truck, Package, ShieldCheck, Globe,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const slides = [
  {
    id: 0,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop",
    tag: "Ocean Freight",
    tagIcon: Ship,
    headline: "Global Sea Freight\nvia Douala Port",
    subtext:
      "FCL and LCL shipments routed through Cameroon's premier deep-water port — connecting Central Africa to the world's major trade lanes.",
    cta: { label: "Explore Ocean Freight", href: "/services/ocean-freight" },
    accent: "from-primary via-primary/85 to-secondary/60",
  },
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
    tag: "Air Freight",
    tagIcon: Plane,
    headline: "Express Air Cargo\nWorldwide",
    subtext:
      "Time-critical shipments delivered across 120+ countries. Priority air freight from Europe, Asia, and the Americas straight to your door.",
    cta: { label: "Explore Air Freight", href: "/services/air-freight" },
    accent: "from-primary via-primary/80 to-[#123D6B]/50",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2074&auto=format&fit=crop",
    tag: "Customs Clearance",
    tagIcon: ShieldCheck,
    headline: "Fast & Compliant\nCustoms Clearance",
    subtext:
      "Licensed customs brokers with deep knowledge of Cameroonian regulations. We clear your cargo quickly, correctly, and without surprises.",
    cta: { label: "Explore Customs", href: "/services/customs-clearance" },
    accent: "from-primary via-primary/90 to-secondary/40",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop",
    tag: "Road Freight",
    tagIcon: Truck,
    headline: "CEMAC Corridor\nRoad Transport",
    subtext:
      "Cross-border road freight linking Douala to Chad, CAR, Congo, and Gabon — the backbone of Central African trade, built on reliability.",
    cta: { label: "Explore Road Freight", href: "/services/road-freight" },
    accent: "from-primary via-primary/85 to-[#0B1F3A]/30",
  },
];

const AUTOPLAY_INTERVAL = 6000;

const textVariants = {
  enter: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const imageVariants = {
  enter: (dir: number) => ({ opacity: 0, scale: 1.08, x: dir > 0 ? 60 : -60 }),
  visible: { opacity: 1, scale: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, scale: 0.97, x: dir > 0 ? -60 : 60 }),
};

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (index: number, dir?: number) => {
      setDirection(dir ?? (index > current ? 1 : -1));
      setCurrent((index + slides.length) % slides.length);
    },
    [current]
  );

  const next = useCallback(() => goTo((current + 1) % slides.length, 1), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length, -1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = slides[current];
  const TagIcon = slide.tagIcon;

  return (
    <div>
      {/* ─── Hero Slider ─────────────────────────────────────────────── */}
      <section
        className="relative h-[100dvh] overflow-hidden bg-primary"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Background image with Ken Burns + directional motion */}
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={`bg-${current}`}
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent} opacity-90`} />
          </motion.div>
        </AnimatePresence>

        {/* Slide Content */}
        <div className="relative z-10 h-full flex flex-col justify-center container mx-auto px-4 md:px-6 pt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current}`}
              initial="enter"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-3xl"
            >
              {/* Service tag */}
              <motion.div
                variants={textVariants}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-accent text-sm font-semibold mb-6"
              >
                <TagIcon className="w-4 h-4" />
                {slide.tag}
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={textVariants}
                transition={{ duration: 0.55, delay: 0.12 }}
                className="text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6"
              >
                {slide.headline.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    {i === 0 ? line : <span className="text-accent">{line}</span>}
                  </span>
                ))}
              </motion.h1>

              {/* Subtext */}
              <motion.p
                variants={textVariants}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed"
              >
                {slide.subtext}
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={textVariants}
                transition={{ duration: 0.55, delay: 0.27 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href={slide.cta.href} data-testid={`link-slide-${current}-cta`}>
                  <Button
                    size="lg"
                    className="h-13 px-8 text-base bg-accent hover:bg-accent/90 text-white w-full sm:w-auto font-semibold"
                  >
                    {slide.cta.label}
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/quote" data-testid="link-slide-quote">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 px-8 text-base border-white/60 text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    Request a Quote
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Slide Navigation Arrows ── */}
        <button
          onClick={prev}
          data-testid="button-slider-prev"
          aria-label="Previous slide"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          data-testid="button-slider-next"
          aria-label="Next slide"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* ── Bottom Bar: dots + slide thumbnails ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-8 pt-16 bg-gradient-to-t from-black/60 to-transparent">
          <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6">
            {/* Dot progress */}
            <div className="flex items-center gap-3">
              {slides.map((s, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? 1 : -1)}
                  data-testid={`button-slide-dot-${i}`}
                  aria-label={`Go to slide ${i + 1}`}
                  className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300 focus:outline-none"
                  style={{ width: i === current ? 40 : 16 }}
                >
                  <span className="absolute inset-0 bg-white/30 rounded-full" />
                  {i === current && (
                    <motion.span
                      key={`progress-${current}`}
                      className="absolute inset-y-0 left-0 bg-accent rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
              <span className="text-white/60 text-xs font-medium ml-1">
                {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            {/* Slide thumbnail strip */}
            <div className="hidden md:flex items-center gap-3">
              {slides.map((s, i) => {
                const Icon = s.tagIcon;
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i, i > current ? 1 : -1)}
                    data-testid={`button-slide-thumb-${i}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200 ${
                      i === current
                        ? "bg-accent border-accent text-white"
                        : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {s.tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Services Grid ─────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-accent font-semibold mb-2 uppercase text-sm tracking-wide">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Comprehensive Logistics Solutions
            </h2>
            <p className="text-muted-foreground text-lg">
              Delivering excellence across every stage of your supply chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Plane, title: "Air Freight", desc: "Time-definite air freight solutions with global coverage.", href: "/services/air-freight" },
              { icon: Ship, title: "Ocean Freight", desc: "FCL and LCL cargo shipping via Douala Port.", href: "/services/ocean-freight" },
              { icon: Truck, title: "Road Freight", desc: "Reliable transportation across the CEMAC corridor.", href: "/services/road-freight" },
              { icon: ShieldCheck, title: "Customs Clearance", desc: "Expert compliance and rapid import/export processing.", href: "/services/customs-clearance" },
              { icon: Package, title: "Warehousing", desc: "Secure storage and sophisticated inventory management.", href: "/services/warehousing" },
              { icon: Globe, title: "3PL Solutions", desc: "End-to-end integrated supply chain optimization.", href: "/services/3pl" },
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
                <Link
                  href={s.href}
                  className="inline-flex items-center text-secondary font-medium hover:text-accent transition-colors"
                  data-testid={`link-service-card-${i}`}
                >
                  Explore Service <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Why AB Capital?</p>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Central Africa's Most Trusted Logistics Partner
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Operating from Douala — the largest port city in Central Africa — we combine global reach with unmatched local knowledge. From customs clearance at Douala Port to last-mile delivery across the CEMAC region, we make complex logistics simple.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  "Licensed Customs Brokers",
                  "Real-Time Cargo Tracking",
                  "24/7 WhatsApp Support",
                  "Transparent Pricing",
                  "CEMAC Road Expertise",
                  "Door-to-Door Solutions",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center flex-shrink-0 text-xs font-bold">✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/about" data-testid="link-about-us">
                <Button className="bg-primary hover:bg-secondary text-white">
                  Learn About Us <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
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
                  alt="Douala Port logistics operations"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-1">10+ yrs</div>
                <div className="text-sm text-gray-500">Serving Cameroon &amp; CEMAC</div>
              </div>
              <div className="absolute -top-5 -right-5 bg-accent rounded-2xl shadow-xl p-5">
                <div className="text-3xl font-bold text-white mb-1">15k+</div>
                <div className="text-xs text-white/80">Shipments Delivered</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Stats Band ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "15k+", label: "Shipments Delivered" },
              { value: "120+", label: "Countries Served" },
              { value: "98.5%", label: "Clearance Success" },
              { value: "99%", label: "Client Satisfaction" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{s.value}</div>
                <div className="text-blue-100">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Strip ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Ship with Confidence?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Get a competitive quote within 24 hours. Our logistics experts are standing by.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote" data-testid="link-cta-quote">
                <Button size="lg" className="bg-white text-accent hover:bg-gray-100 font-semibold px-10">
                  Request a Quote
                </Button>
              </Link>
              <Link href="/contact" data-testid="link-cta-contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
