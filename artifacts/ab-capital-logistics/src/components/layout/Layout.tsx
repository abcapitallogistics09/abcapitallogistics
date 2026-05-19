import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Link } from "wouter";
import { MapPin, Phone, Mail } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-gray-300 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <span className="text-2xl font-bold tracking-tight text-white mb-4 block">
                AB Capital <span className="text-accent">Logistics</span>
              </span>
              <p className="text-gray-400 mb-6 leading-relaxed text-sm max-w-xs">
                Your trusted gateway logistics partner for Cameroon and Central Africa. Enterprise-grade operations with deep local expertise.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>3MGF+F5M Bonabéri, Douala, Cameroon</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-accent shrink-0" />
                  <a href="tel:+237677238818" className="hover:text-white transition-colors">+237 677-238-818</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <a href="mailto:info@abcapitallogistics.com" className="hover:text-white transition-colors">info@abcapitallogistics.com</a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-5">Services</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/services/air-freight" className="hover:text-accent transition-colors">Air Freight</Link></li>
                <li><Link href="/services/ocean-freight" className="hover:text-accent transition-colors">Ocean Freight</Link></li>
                <li><Link href="/services/road-freight" className="hover:text-accent transition-colors">Road Freight</Link></li>
                <li><Link href="/services/customs-clearance" className="hover:text-accent transition-colors">Customs Clearance</Link></li>
                <li><Link href="/services/warehousing" className="hover:text-accent transition-colors">Warehousing</Link></li>
                <li><Link href="/services/3pl" className="hover:text-accent transition-colors">3PL Solutions</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-5">Company</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
                <li><Link href="/industries" className="hover:text-accent transition-colors">Industries</Link></li>
                <li><Link href="/ship-agency" className="hover:text-accent transition-colors">Ship Agency</Link></li>
                <li><Link href="/gallery" className="hover:text-accent transition-colors">Gallery</Link></li>
                <li><Link href="/global-network" className="hover:text-accent transition-colors">Global Network</Link></li>
                <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-accent transition-colors">Careers</Link></li>
                <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-5">Quick Actions</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/quote" className="hover:text-accent transition-colors">Request a Quote</Link></li>
                <li><Link href="/tracking" className="hover:text-accent transition-colors">Track Shipment</Link></li>
                <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
                <li>
                  <a
                    href="https://wa.me/237677238818"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    WhatsApp Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
            <p className="text-gray-500">© 2026 AB Capital Logistics Ltd. All rights reserved.</p>
            <div className="flex gap-6 text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/237677238818"
        target="_blank"
        rel="noopener noreferrer"
        data-testid="button-whatsapp-float"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {/* Tooltip */}
        <span className="absolute right-16 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
