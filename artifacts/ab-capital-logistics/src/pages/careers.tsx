import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Briefcase, Users, Award, Globe, TrendingUp } from "lucide-react";

const openings = [
  {
    title: "Freight Coordinator",
    type: "Full-Time",
    location: "Douala, Cameroon",
    department: "Operations",
    description: "Manage and coordinate freight shipments for our clients, liaising with carriers, customs agents, and clients to ensure smooth cargo movement.",
    requirements: ["2+ years in freight forwarding or logistics", "Knowledge of Incoterms and customs procedures", "Strong communication skills", "Proficient in Microsoft Office"],
  },
  {
    title: "Customs Clearance Officer",
    type: "Full-Time",
    location: "Douala Port, Cameroon",
    department: "Customs",
    description: "Handle import and export customs declarations, liaise with customs authorities, and ensure compliance with all Cameroonian customs regulations.",
    requirements: ["3+ years customs clearance experience", "Knowledge of SYDONIA system", "Licensed customs agent preferred", "Deep knowledge of HS tariff codes"],
  },
  {
    title: "Business Development Manager",
    type: "Full-Time",
    location: "Douala, Cameroon",
    department: "Sales",
    description: "Drive revenue growth by identifying and pursuing new business opportunities, building relationships with importers, exporters, and multinational companies.",
    requirements: ["5+ years sales experience in logistics", "Strong network in Cameroon business community", "Fluent in French and English", "Track record of meeting sales targets"],
  },
  {
    title: "Warehouse Supervisor",
    type: "Full-Time",
    location: "Bonabéri, Douala",
    department: "Warehousing",
    description: "Oversee daily warehouse operations including receiving, storage, inventory management, and dispatching. Ensure safety standards and operational efficiency.",
    requirements: ["3+ years warehouse management", "Experience with WMS software", "Strong leadership skills", "Forklift certification advantageous"],
  },
];

const values = [
  { icon: Users, title: "Team First", desc: "We succeed together. Collaboration and mutual support are at the core of how we work." },
  { icon: Award, title: "Excellence", desc: "We hold ourselves to the highest professional standards in everything we do." },
  { icon: Globe, title: "Global Mindset", desc: "We think globally while understanding our local market deeply." },
  { icon: TrendingUp, title: "Growth", desc: "We invest in our people's development and create pathways for career advancement." },
];

export default function Careers() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-32 pt-40 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary/80" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Join Our Team</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Build Your Career in <span className="text-accent">Logistics</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
              Join Central Africa's premier logistics company and be part of a team shaping the future of freight and trade across the region.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Our Culture</p>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Why Work at AB Capital Logistics?</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                At AB Capital Logistics, we're building the logistics company that Central Africa deserves — professional, technology-enabled, and deeply committed to our clients and our team.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We offer competitive compensation, opportunities for professional development, and the chance to work on complex, international logistics challenges that have real impact on businesses across the region.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <v.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="font-bold text-primary mb-2 text-sm">{v.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-10 text-center">Open Positions</h2>
            <div className="space-y-6 max-w-4xl mx-auto">
              {openings.map((job, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-lg transition-shadow"
                  data-testid={`card-job-${i}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="font-bold text-primary text-xl">{job.title}</span>
                        <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">{job.department}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.type}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.department}</span>
                      </div>
                    </div>
                    <a
                      href={`mailto:info@abcapitallogistics.com?subject=Application: ${job.title}`}
                      data-testid={`link-apply-${i}`}
                    >
                      <Button className="bg-accent hover:bg-accent/90 text-white whitespace-nowrap">Apply Now</Button>
                    </a>
                  </div>
                  <p className="text-gray-600 mb-5 leading-relaxed">{job.description}</p>
                  <div>
                    <p className="font-semibold text-primary text-sm mb-3">Requirements:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {job.requirements.map((req, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-500">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* General Application */}
          <div className="mt-16 bg-primary rounded-2xl p-10 text-center text-white max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Don't See Your Role?</h2>
            <p className="text-gray-300 mb-8">
              We're always looking for talented individuals who are passionate about logistics. Send us your CV and we'll keep you in mind for future opportunities.
            </p>
            <a href="mailto:info@abcapitallogistics.com?subject=General Application - AB Capital Logistics" data-testid="link-general-application">
              <Button className="bg-accent hover:bg-accent/90 text-white px-10">Send Your CV</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
