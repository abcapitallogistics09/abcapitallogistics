import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroFaq from "@/assets/hero-faq.png";

const faqCategories = [
  {
    category: "General",
    faqs: [
      { q: "What services does AB Capital Logistics offer?", a: "We offer a comprehensive range of logistics services including Air Freight, Ocean Freight, Road Freight, Customs Clearance, Warehousing & Distribution, and 3PL Solutions — all with a focus on Cameroon and Central Africa." },
      { q: "Where is AB Capital Logistics located?", a: "Our main office is located at 3MGF+F5M Bonabéri, Douala, Cameroon. We operate across all major entry points in Cameroon including Douala Port, Nsimalen Airport, and all major border crossings." },
      { q: "What countries do you service?", a: "We handle international freight to and from any country globally, with specialized expertise in Cameroon, Chad, Central African Republic, Republic of Congo, Gabon, and the wider CEMAC region." },
      { q: "How do I get started with AB Capital Logistics?", a: "Simply contact us via phone, email, or our online quote form. A logistics expert will review your requirements and provide a customized solution and quote within 24 hours." },
    ],
  },
  {
    category: "Air Freight",
    faqs: [
      { q: "How fast is air freight to Cameroon?", a: "Air freight transit times vary by origin: Europe 3-5 days, Asia 5-7 days, North America 4-6 days, Middle East 2-4 days. We also offer express services for even faster delivery." },
      { q: "What cargo can be shipped by air?", a: "We handle most commodity types by air including general cargo, electronics, pharmaceuticals, perishables, and high-value goods. Dangerous goods can also be shipped subject to IATA DGR regulations." },
      { q: "Do you offer door-to-door air freight?", a: "Yes. Our air freight service includes pickup at origin, export handling, air transport, import customs clearance in Cameroon, and delivery to the final destination." },
    ],
  },
  {
    category: "Ocean Freight",
    faqs: [
      { q: "What is the difference between FCL and LCL?", a: "FCL (Full Container Load) means you have exclusive use of a container. LCL (Less than Container Load) means your goods share a container with other shipments. LCL is more cost-effective for smaller volumes; FCL is better for large volumes." },
      { q: "How long does sea freight to Douala take?", a: "Transit times: Europe 15-25 days, Asia 25-35 days, East Coast USA 20-30 days, West Africa 7-12 days. Times vary by origin port and vessel schedule." },
      { q: "Which shipping lines do you work with?", a: "We partner with all major shipping lines serving Douala Port including Maersk, CMA CGM, MSC, Evergreen, PIL, COSCO, and others." },
    ],
  },
  {
    category: "Customs",
    faqs: [
      { q: "What documents are required to import to Cameroon?", a: "Core documents include: commercial invoice, packing list, bill of lading/airway bill, and import declaration. Additional documents may be required for specific goods (phytosanitary certificates for agricultural products, etc.)." },
      { q: "How long does customs clearance take at Douala?", a: "With all documentation in order, standard clearance takes 2-5 business days. Pre-clearance and expedited processing can reduce this. Complex or flagged shipments may take longer." },
      { q: "Are there import restrictions in Cameroon?", a: "Yes. Certain goods require special import licenses or are restricted/prohibited. This includes pharmaceuticals, firearms, explosives, and some food products. Contact us to verify requirements for your specific goods." },
    ],
  },
  {
    category: "Pricing",
    faqs: [
      { q: "How do I get a freight quote?", a: "Use our online quote form, email info@abcapitallogistics.com, or call +237 677-238-818. Provide cargo weight, dimensions, origin, destination, and commodity type for an accurate quote." },
      { q: "What factors affect freight costs?", a: "Key cost factors include: cargo weight and volume, origin and destination, mode of transport (air/sea/road), type of cargo, required transit time, season, and additional services like customs clearance." },
      { q: "Are there hidden charges?", a: "No. We provide transparent, all-inclusive quotes wherever possible. When local port charges or destination fees are variable, we disclose these clearly in advance." },
    ],
  },
];

export default function FAQ() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-32 pt-40 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url('${heroFaq}')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-secondary/60" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Help Center</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-300 text-lg max-w-xl">
              Answers to the most common questions about our logistics services, shipping, and customs clearance in Cameroon.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="space-y-12">
            {faqCategories.map((cat, ci) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.1 }}
              >
                <h2 className="text-2xl font-bold text-primary mb-6 pb-3 border-b border-gray-100">{cat.category}</h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {cat.faqs.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`${cat.category}-${i}`}
                      className="bg-white border border-gray-100 rounded-xl px-6 shadow-sm"
                      data-testid={`faq-${cat.category}-${i}`}
                    >
                      <AccordionTrigger className="text-left font-semibold text-primary hover:text-accent hover:no-underline py-5">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-16 bg-primary rounded-2xl p-10 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-gray-300 mb-8">Our logistics experts are happy to help with any questions about your specific requirements.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" data-testid="link-faq-contact">
                <Button className="bg-accent hover:bg-accent/90 text-white px-8">Contact Us</Button>
              </Link>
              <a href="tel:+237677238818" data-testid="link-faq-phone">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                  Call +237 677-238-818
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
