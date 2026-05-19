import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, Plane, Ship, Truck, ShieldCheck, Package, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const serviceLinks = [
  { href: "/services/air-freight", label: "Air Freight", icon: Plane },
  { href: "/services/ocean-freight", label: "Ocean Freight", icon: Ship },
  { href: "/services/road-freight", label: "Road Freight", icon: Truck },
  { href: "/services/customs-clearance", label: "Customs Clearance", icon: ShieldCheck },
  { href: "/services/warehousing", label: "Warehousing", icon: Package },
  { href: "/services/3pl", label: "3PL Solutions", icon: Globe },
];

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/industries", label: "Industries" },
  { href: "/global-network", label: "Network" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const textClass = isScrolled ? "text-gray-700 hover:text-accent" : "text-gray-100 hover:text-accent";
  const logoTextClass = isScrolled ? "text-primary" : "text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" data-testid="link-home" className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xl font-bold tracking-tight transition-colors ${logoTextClass}`}>
              AB Capital <span className="text-accent">Logistics</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {/* Services Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`flex items-center gap-1 font-medium transition-colors ${textClass}`}
                data-testid="button-services-dropdown"
              >
                Services
                <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 grid grid-cols-2 gap-2">
                  {serviceLinks.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
                      data-testid={`link-nav-service-${s.href}`}
                    >
                      <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                        <s.icon className="w-4 h-4 text-secondary group-hover:text-white" />
                      </div>
                      <span className="font-medium text-gray-800 text-sm group-hover:text-primary">{s.label}</span>
                    </Link>
                  ))}
                  <div className="col-span-2 border-t border-gray-100 pt-2 mt-1">
                    <Link
                      href="/services"
                      className="flex items-center justify-center gap-2 p-2 text-accent font-medium text-sm hover:underline"
                      data-testid="link-all-services"
                    >
                      View All Services
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`font-medium transition-colors ${textClass}`}
                data-testid={`link-nav-${l.label.toLowerCase()}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/tracking" data-testid="link-nav-tracking">
              <Button
                variant="ghost"
                className={`font-medium ${isScrolled ? "text-gray-700 hover:text-accent" : "text-white hover:bg-white/10"}`}
              >
                Track Shipment
              </Button>
            </Link>
            <Link href="/quote" data-testid="link-nav-quote">
              <Button className="bg-accent hover:bg-accent/90 text-white font-semibold px-6">
                Get Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="button-mobile-menu"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={isScrolled ? "text-gray-900" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-gray-900" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 overflow-y-auto max-h-[80vh]">
          <div className="p-4 space-y-1">
            <Link href="/" className="block p-3 font-medium text-gray-900 hover:bg-gray-50 rounded-lg" data-testid="mobile-link-home">Home</Link>
            <div className="py-2">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Services</p>
              {serviceLinks.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="flex items-center gap-3 p-3 font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  data-testid={`mobile-link-${s.href}`}
                >
                  <s.icon className="w-4 h-4 text-secondary" />
                  {s.label}
                </Link>
              ))}
            </div>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block p-3 font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                data-testid={`mobile-link-${l.label.toLowerCase()}`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/faq" className="block p-3 font-medium text-gray-900 hover:bg-gray-50 rounded-lg">FAQ</Link>
            <Link href="/careers" className="block p-3 font-medium text-gray-900 hover:bg-gray-50 rounded-lg">Careers</Link>
            <div className="pt-3 space-y-2">
              <Link href="/tracking">
                <Button variant="outline" className="w-full border-secondary text-secondary">Track Shipment</Button>
              </Link>
              <Link href="/quote">
                <Button className="w-full bg-accent hover:bg-accent/90 text-white font-semibold">Get a Quote</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
