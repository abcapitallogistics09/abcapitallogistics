import { motion } from "framer-motion";
import { Link } from "wouter";
import { FileText, ChevronRight } from "lucide-react";

const LAST_UPDATED = "May 19, 2025";
const COMPANY = "AB Capital Logistics Ltd";
const EMAIL = "info@abcapitallogistics.com";
const ADDRESS = "3MGF+F5M Bonabéri, Douala, Cameroon";
const PHONE = "+237 677-238-818";

const sections = [
  {
    id: "agreement",
    title: "1. Agreement to Terms",
    content: `By accessing our website or engaging the services of ${COMPANY} ("the Company", "we", "us", or "our"), you confirm that you have read, understood, and agree to be bound by these Terms of Service ("Terms") and our Privacy Policy.

If you are entering into these Terms on behalf of a company or other legal entity, you represent that you have the authority to bind that entity. If you do not have such authority, or if you do not agree with these Terms, you must not use our services.

These Terms constitute the entire agreement between you ("Client", "you", or "your") and the Company with respect to the subject matter herein, and supersede all prior discussions, understandings, or agreements.`,
  },
  {
    id: "services",
    title: "2. Services",
    content: `The Company provides freight forwarding, logistics, customs clearance, warehousing, and related services ("Services") as detailed in individual service quotations or agreements. The specific scope, pricing, and conditions for each engagement are set out in the relevant quotation, booking confirmation, or service agreement issued by the Company.

**Scope of Services**
- International and domestic freight forwarding (air, sea, road)
- Customs clearance and brokerage at Douala Port and other entry points
- Warehousing and distribution within Cameroon
- Third-party logistics (3PL) management
- Ship agency services in the Port of Douala
- Documentation preparation and trade advisory

The Company acts as agent for the Client in arranging transportation and related services. Unless expressly stated otherwise, the Company does not itself carry, store, or otherwise physically handle cargo.`,
  },
  {
    id: "client-obligations",
    title: "3. Client Obligations",
    content: `As a client, you agree to:

- **Accurate Information**: Provide complete, accurate, and timely information required for the provision of services, including cargo descriptions, weights, dimensions, values, and any relevant hazardous material classifications
- **Documentation**: Supply all required shipping, commercial, and customs documentation in the correct format and within agreed timelines. Delays caused by incomplete or incorrect documentation are solely the Client's responsibility
- **Compliance**: Ensure that all goods tendered for shipment comply with applicable laws and regulations of the country of origin, transit countries, and the destination country
- **Prohibited Goods**: Not tender goods that are illegal, dangerous, restricted, or prohibited without prior written disclosure and applicable permits. The Company reserves the right to refuse or return any shipment that violates this obligation
- **Payment**: Pay all invoices, duties, taxes, freight charges, storage fees, and other applicable costs within the agreed payment terms
- **Notification**: Promptly notify the Company of any changes in shipment details, cargo value, or special requirements that may affect the service or insurance coverage`,
  },
  {
    id: "quotations",
    title: "4. Quotations and Pricing",
    content: `All quotations issued by the Company are:

- Valid for the period stated on the quotation, or 14 days if no validity period is specified
- Based on information provided by the Client at the time of enquiry
- Subject to change if actual cargo specifications differ from those quoted
- Exclusive of duties, taxes, port charges, storage fees, and other third-party costs unless expressly stated

**Rate Adjustments**: The Company reserves the right to adjust rates where significant changes occur in fuel costs, currency exchange rates, carrier tariffs, or government levies beyond our reasonable control. We will notify Clients of material rate adjustments as soon as practicable.

**Additional Charges**: Any ancillary charges incurred during service execution (e.g. detention, demurrage, re-inspection fees, port congestion surcharges) will be passed on to the Client at cost.`,
  },
  {
    id: "payment",
    title: "5. Payment Terms",
    content: `**Standard Terms**: Payment is due within 30 days of invoice date unless otherwise agreed in writing. New clients may be required to pay in advance until a credit account is established.

**Duties and Taxes**: All customs duties, VAT, port fees, and other government levies applicable to your shipment are payable by the Client in addition to Company service fees. The Company may advance such payments on the Client's behalf, in which case they will be charged back at cost with an administrative fee.

**Late Payment**: Invoices not settled within the agreed payment period will attract interest at the rate of 1.5% per month on the outstanding balance. The Company reserves the right to suspend services to Clients with overdue accounts.

**Lien**: The Company has a general lien over all goods, documents, and funds held on behalf of the Client for any sums owed to the Company, whether in respect of those specific goods or any other services rendered.`,
  },
  {
    id: "liability",
    title: "6. Liability and Limitations",
    content: `**General Limitation**: The Company's liability for loss, damage, or delay to cargo is limited to the lesser of: (a) the actual value of the goods lost or damaged, or (b) SDR 2 per kilogram of gross weight of the goods lost or damaged, unless a higher declared value has been agreed in writing and additional charges paid.

**Exclusions**: The Company shall not be liable for loss, damage, or delay arising from:
- Acts of God, force majeure, or circumstances beyond our reasonable control
- Inherent vice or nature of the goods
- Insufficient or defective packaging by the Client
- Inaccurate or incomplete information provided by the Client
- Compliance with instructions from the Client or any authority
- Strikes, labour disputes, or civil unrest
- Delays caused by customs authorities or government agencies
- Third-party carrier delays

**Indirect Losses**: In no event shall the Company be liable for indirect, consequential, special, or punitive damages, including but not limited to loss of profit, loss of business, or loss of market, even if advised of the possibility of such losses.

**Claims Notification**: Any claim for loss, damage, or delay must be notified to the Company in writing within 7 days of delivery, or within 14 days of the expected delivery date in the case of non-delivery. Claims not notified within these periods may be time-barred.`,
  },
  {
    id: "cargo-insurance",
    title: "7. Cargo Insurance",
    content: `The Company does not automatically insure cargo on the Client's behalf. Clients are responsible for arranging their own cargo insurance.

We strongly recommend that all clients obtain adequate marine cargo insurance covering all risks for the full commercial value of their goods. The Company can assist in arranging cargo insurance through our insurance partners upon written request — additional charges will apply.

Where the Company arranges insurance on behalf of the Client, the terms and conditions of the relevant insurance policy shall govern. The Company acts as agent only and accepts no liability for the acts or omissions of the insurer.`,
  },
  {
    id: "customs",
    title: "8. Customs and Regulatory Compliance",
    content: `The Client is the importer/exporter of record and bears full responsibility for compliance with all applicable customs laws, import/export regulations, trade sanctions, and embargo restrictions.

The Company acts as customs agent only, processing documentation based on information supplied by the Client. The Client warrants that all declarations, invoices, and supporting documents are true, accurate, and complete. Penalties, fines, or additional duties arising from incorrect, incomplete, or fraudulent declarations provided by the Client are entirely the Client's responsibility.

The Company reserves the right to refuse to submit any documentation it believes to be inaccurate or fraudulent and is not liable for delays resulting from such refusal.`,
  },
  {
    id: "warehousing",
    title: "9. Warehousing and Storage",
    content: `Goods received into the Company's warehousing facilities are subject to the following conditions:

- Storage charges accrue from the date of receipt and are invoiced monthly or upon withdrawal
- The Company's liability for goods in storage is limited as set out in Section 6
- Clients must collect goods within the agreed storage period. Goods left beyond the agreed period may be moved to external storage at the Client's cost
- The Company is not responsible for normal shrinkage, leakage, or deterioration of perishable or fragile goods
- The Client must notify the Company of any hazardous, controlled, or temperature-sensitive goods prior to delivery to the warehouse

Separate warehousing terms and conditions may apply for bonded warehouse storage in accordance with customs regulations.`,
  },
  {
    id: "force-majeure",
    title: "10. Force Majeure",
    content: `Neither party shall be in breach of these Terms or liable for any failure or delay in performance due to circumstances beyond its reasonable control, including but not limited to acts of God, natural disasters, pandemic, war, civil unrest, government actions, port closures, strikes, or critical infrastructure failures.

The affected party shall promptly notify the other party of the force majeure event and its expected duration. If the event continues for more than 60 days, either party may terminate the affected service arrangement by written notice without liability.`,
  },
  {
    id: "intellectual-property",
    title: "11. Intellectual Property",
    content: `All content on our website, including text, graphics, logos, images, and software, is the property of ${COMPANY} or its content licensors and is protected by Cameroonian and international intellectual property laws.

You may not reproduce, distribute, modify, or create derivative works from any content on our website without our express prior written consent. You may use our website for legitimate business enquiry purposes only.`,
  },
  {
    id: "governing-law",
    title: "12. Governing Law and Disputes",
    content: `These Terms are governed by and construed in accordance with the laws of the Republic of Cameroon. The OHADA Uniform Act on General Commercial Law and applicable CEMAC regulations apply where relevant.

**Dispute Resolution**: In the event of a dispute arising out of or in connection with these Terms or any services provided, the parties agree to first attempt to resolve the matter through good-faith negotiation. If negotiation fails within 30 days, the dispute shall be submitted to mediation before the Douala Chamber of Commerce and Industry (CCID).

If mediation is unsuccessful, disputes shall be referred to the competent courts of Douala, Cameroon, which shall have exclusive jurisdiction. Nothing in this clause prevents either party from seeking urgent injunctive relief from a competent court.`,
  },
  {
    id: "amendments",
    title: "13. Amendments",
    content: `The Company reserves the right to modify these Terms at any time. We will provide notice of material changes by updating the "Last Updated" date at the top of this page and, where appropriate, by email notification to registered clients.

Your continued use of our services after the effective date of any changes constitutes acceptance of the revised Terms. We encourage you to review these Terms periodically.`,
  },
  {
    id: "contact",
    title: "14. Contact Information",
    content: `For any questions, concerns, or notices under these Terms, please contact us:

**${COMPANY}**
${ADDRESS}
Email: ${EMAIL}
Phone: ${PHONE}

All legal notices must be provided in writing and delivered by email with confirmed receipt or by registered post to the address above.`,
  },
];

function renderContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-semibold text-gray-900 mt-4 mb-1">{line.replace(/\*\*/g, "")}</p>;
    }
    if (line.startsWith("- **")) {
      const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)/);
      if (match) {
        return (
          <li key={i} className="ml-4 mb-1.5">
            <span className="font-semibold text-gray-900">{match[1]}</span>
            {match[2] ? `: ${match[2]}` : ""}
          </li>
        );
      }
    }
    if (line.startsWith("- ")) {
      return <li key={i} className="ml-4 mb-1 text-gray-700">{line.slice(2)}</li>;
    }
    if (line.trim() === "") return <br key={i} />;
    return <p key={i} className="text-gray-700 leading-relaxed mb-2">{line}</p>;
  });
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-sm text-blue-200 mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Terms of Service</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Terms of Service</h1>
                <p className="text-blue-200 mt-1">Last updated: {LAST_UPDATED}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar TOC */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Contents</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm text-gray-600 hover:text-primary hover:pl-1 transition-all duration-150 py-1 border-l-2 border-transparent hover:border-accent pl-3"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12">
              {/* Disclaimer banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
                <strong>Important:</strong> These Terms of Service govern your use of our website and logistics services. Please read them carefully before engaging our services. By using our services, you agree to these terms.
              </div>

              <div className="space-y-12">
                {sections.map((section, i) => (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.03 }}
                  >
                    <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-gray-100">
                      {section.title}
                    </h2>
                    <ul className="list-none space-y-0">
                      {renderContent(section.content)}
                    </ul>
                  </motion.section>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="bg-primary/5 rounded-xl p-6">
                  <h3 className="font-semibold text-primary mb-2">Have questions about our terms?</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Contact our team at <a href={`mailto:${EMAIL}`} className="text-accent hover:underline font-medium">{EMAIL}</a> and we'll be happy to clarify any aspect of these terms.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/contact">
                      <span className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer">
                        Contact Us
                      </span>
                    </Link>
                    <Link href="/privacy">
                      <span className="inline-flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors cursor-pointer">
                        Privacy Policy
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
