import { motion } from "framer-motion";
import { Link } from "wouter";
import { Shield, ChevronRight } from "lucide-react";

const LAST_UPDATED = "May 19, 2025";
const COMPANY = "AB Capital Logistics Ltd";
const EMAIL = "info@abcapitallogistics.com";
const ADDRESS = "3MGF+F5M Bonabéri, Douala, Cameroon";
const PHONE = "+237 677-238-818";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `${COMPANY} ("we", "our", or "us") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage our logistics services.

Please read this policy carefully. If you disagree with its terms, please discontinue use of our site and services. We may update this policy from time to time; continued use of our services after any changes constitutes acceptance of the revised policy.`,
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    content: `We collect information you voluntarily provide to us and information automatically gathered during your use of our website.

**Information You Provide**
- Contact details: full name, email address, phone number, and company name when you submit a quote request, contact form, or inquiry
- Shipment data: origin, destination, cargo type, weight, volume, incoterms, and any special handling instructions required to process your freight request
- Payment information: billing details processed through secure third-party payment processors (we do not store card numbers)
- Correspondence: emails, messages, and communications you send us

**Automatically Collected Information**
- Device data: IP address, browser type, operating system, and referring URLs
- Usage data: pages viewed, time spent, links clicked, and navigation patterns collected via cookies and analytics tools
- Cookies and tracking technologies: used to improve site functionality and measure performance (see Section 7)`,
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    content: `We use the information we collect to:

- **Provide logistics services**: process freight quotes, coordinate shipments, manage customs clearance, and communicate status updates
- **Respond to inquiries**: answer questions, provide customer support, and follow up on service requests
- **Improve our services**: analyse site usage patterns, identify areas for improvement, and develop new service offerings
- **Send communications**: transactional emails (booking confirmations, shipment updates), and where permitted, marketing communications about our services. You may opt out of marketing emails at any time
- **Comply with legal obligations**: meet regulatory requirements under Cameroonian law and international trade regulations including anti-money laundering (AML) and know-your-customer (KYC) obligations
- **Protect our business**: detect and prevent fraud, security threats, and violations of our Terms of Service`,
  },
  {
    id: "sharing",
    title: "4. Sharing Your Information",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

**Service Partners**: We share shipment-related data with carriers (airlines, shipping lines, trucking companies), freight agents, port authorities, and customs brokers strictly as necessary to execute your shipment

**Regulatory & Government Bodies**: We disclose information to Cameroonian customs authorities (DGD), the port authority (PAD), and other government agencies as required by law or to comply with export control regulations

**Technology Providers**: We use trusted third-party providers for website hosting, email, analytics, and payment processing, all bound by confidentiality obligations

**Legal Requirements**: We may disclose information if required by court order, subpoena, or applicable law, or to protect the rights, property, or safety of ${COMPANY}, our clients, or others

**Business Transfers**: In the event of a merger, acquisition, or sale of all or part of our business, your information may be transferred to the new entity`,
  },
  {
    id: "international",
    title: "5. International Data Transfers",
    content: `As a freight forwarding company, we operate across multiple countries. Your shipment data may necessarily be shared with partners, carriers, and authorities in the origin and destination countries of your freight. By engaging our services, you acknowledge and consent to such international transfers required to perform the logistics service.

We take reasonable steps to ensure that international partners handle your data responsibly and in accordance with applicable privacy standards.`,
  },
  {
    id: "retention",
    title: "6. Data Retention",
    content: `We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy, including to satisfy legal, accounting, and reporting requirements.

- **Client records**: retained for a minimum of 7 years in accordance with Cameroonian commercial and tax law
- **Customs and shipping documents**: retained for a minimum of 5 years to comply with customs regulations
- **Website analytics data**: retained for up to 26 months
- **Marketing preferences**: retained until you withdraw consent

When data is no longer required, we securely delete or anonymise it.`,
  },
  {
    id: "cookies",
    title: "7. Cookies",
    content: `Our website uses cookies — small text files stored on your device — to enhance your experience. We use:

- **Essential cookies**: necessary for the website to function (e.g. session management)
- **Analytics cookies**: help us understand how visitors use the site (e.g. Google Analytics)
- **Preference cookies**: remember your settings and choices

You can control cookies through your browser settings. Disabling certain cookies may affect site functionality. We do not use cookies to serve targeted advertising.`,
  },
  {
    id: "security",
    title: "8. Data Security",
    content: `We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. These include:

- Encrypted data transmission (HTTPS/TLS)
- Access controls limiting data access to authorised personnel
- Regular security reviews and staff training

However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security and encourage you to use strong passwords and be cautious about the information you share online.`,
  },
  {
    id: "rights",
    title: "9. Your Rights",
    content: `Subject to applicable law, you have the right to:

- **Access**: request a copy of the personal data we hold about you
- **Correction**: request that inaccurate or incomplete data be corrected
- **Deletion**: request erasure of your personal data where we have no legitimate reason to continue processing it
- **Objection**: object to processing of your data for direct marketing purposes
- **Restriction**: request that we restrict processing of your data in certain circumstances
- **Portability**: receive your data in a structured, machine-readable format

To exercise any of these rights, please contact us at ${EMAIL}. We will respond within 30 days.`,
  },
  {
    id: "third-party",
    title: "10. Third-Party Links",
    content: `Our website may contain links to third-party websites (e.g. shipping line portals, payment processors, trade portals). We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies before providing any personal information.`,
  },
  {
    id: "children",
    title: "11. Children's Privacy",
    content: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a child has provided us with personal information without parental consent, we will take steps to delete such information.`,
  },
  {
    id: "contact",
    title: "12. Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:

**${COMPANY}**
${ADDRESS}
Email: ${EMAIL}
Phone: ${PHONE}

We aim to respond to all privacy-related inquiries within 30 business days.`,
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
          <li key={i} className="ml-4 mb-1">
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

export default function PrivacyPolicy() {
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
              <span className="text-white">Privacy Policy</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
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
              <p className="text-gray-600 leading-relaxed mb-10 pb-8 border-b border-gray-100">
                Your privacy is important to us. This policy explains how <strong>{COMPANY}</strong> collects, uses, and protects your personal information when you use our website and logistics services.
              </p>

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
                  <h3 className="font-semibold text-primary mb-2">Questions about your privacy?</h3>
                  <p className="text-gray-600 text-sm mb-4">Contact our team at <a href={`mailto:${EMAIL}`} className="text-accent hover:underline font-medium">{EMAIL}</a> and we will respond within 30 business days.</p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/contact">
                      <span className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer">
                        Contact Us
                      </span>
                    </Link>
                    <Link href="/terms">
                      <span className="inline-flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors cursor-pointer">
                        Terms of Service
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
