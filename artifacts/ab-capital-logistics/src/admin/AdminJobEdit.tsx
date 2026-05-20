import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2, Save, MapPin, Clock, Building2, Mail, DollarSign, Calendar, AlertCircle, ExternalLink } from "lucide-react";

interface Job {
  id: number;
  title: string;
  type: string;
  location: string;
  department: string;
  description: string;
  requirements: string;
  active: boolean;
  salary: string | null;
  experienceLevel: string | null;
  applicationEmail: string | null;
  closingDate: string | null;
  benefits: string | null;
}

const TYPES = ["Full-Time", "Part-Time", "Contract", "Internship"];
const DEPARTMENTS = ["Operations", "Customs", "Sales", "Warehousing", "Finance", "HR", "IT", "Management"];
const EXPERIENCE_LEVELS = ["Entry Level (0–2 years)", "Mid Level (2–5 years)", "Senior (5–10 years)", "Lead / Manager (10+ years)"];

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent bg-white";

function Field({ label, children, required, hint }: { label: string; children: React.ReactNode; required?: boolean; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminJobEdit({ id }: { id?: string }) {
  const [, setLocation] = useLocation();
  const isNew = !id;

  const [form, setForm] = useState({
    title: "",
    type: "Full-Time",
    location: "Douala, Cameroon",
    department: "Operations",
    description: "",
    requirements: "",
    active: true,
    salary: "",
    experienceLevel: "",
    applicationEmail: "info@abcapitallogistics.com",
    closingDate: "",
    benefits: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isNew && id) {
      fetch(`/api/admin/jobs`, { credentials: "include" })
        .then((r) => r.json())
        .then((jobs: Job[]) => {
          const job = jobs.find((j) => j.id === parseInt(id));
          if (job) {
            setForm({
              title: job.title,
              type: job.type,
              location: job.location,
              department: job.department,
              description: job.description,
              requirements: job.requirements,
              active: job.active,
              salary: job.salary ?? "",
              experienceLevel: job.experienceLevel ?? "",
              applicationEmail: job.applicationEmail ?? "info@abcapitallogistics.com",
              closingDate: job.closingDate ?? "",
              benefits: job.benefits ?? "",
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const set = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url = isNew ? "/api/admin/jobs" : `/api/admin/jobs/${id}`;
      const method = isNew ? "POST" : "PUT";
      const body = {
        ...form,
        salary: form.salary || null,
        experienceLevel: form.experienceLevel || null,
        applicationEmail: form.applicationEmail || null,
        closingDate: form.closingDate || null,
        benefits: form.benefits || null,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setLocation("/admin/jobs");
      } else {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "Failed to save");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading…</div>;

  const requirementLines = form.requirements.split("\n").filter(Boolean).length;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setLocation("/admin/jobs")} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{isNew ? "New Position" : "Edit Position"}</h1>
          {form.title && <p className="text-sm text-gray-500 mt-0.5">{form.department} · {form.type} · {form.location}</p>}
        </div>
        <button
          type="button"
          onClick={handleSubmit as unknown as React.MouseEventHandler}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : isNew ? "Create Position" : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Position Details
          </h2>

          <Field label="Job Title" required>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputCls}
              placeholder="e.g. Freight Coordinator"
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Employment Type" required>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select value={form.type} onChange={(e) => set("type", e.target.value)} className={`${inputCls} pl-9`}>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </Field>
            <Field label="Department" required>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select value={form.department} onChange={(e) => set("department", e.target.value)} className={`${inputCls} pl-9`}>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Location" required>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  className={`${inputCls} pl-9`}
                  placeholder="e.g. Douala, Cameroon"
                  required
                />
              </div>
            </Field>
            <Field label="Experience Level">
              <select value={form.experienceLevel} onChange={(e) => set("experienceLevel", e.target.value)} className={inputCls}>
                <option value="">Not specified</option>
                {EXPERIENCE_LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Salary / Compensation" hint="e.g. CFA 250,000–350,000/month or Competitive">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={form.salary}
                  onChange={(e) => set("salary", e.target.value)}
                  className={`${inputCls} pl-9`}
                  placeholder="e.g. CFA 300,000–400,000/month"
                />
              </div>
            </Field>
            <Field label="Application Deadline" hint="Leave blank if open until filled">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={form.closingDate}
                  onChange={(e) => set("closingDate", e.target.value)}
                  className={`${inputCls} pl-9`}
                />
              </div>
            </Field>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Role Description</h2>

          <Field label="Job Description" required hint="Describe the role, key responsibilities, and what success looks like">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={`${inputCls} h-32 resize-none`}
              placeholder="Describe the role and key responsibilities in detail. What will this person do day-to-day? What outcomes are expected?"
              required
            />
          </Field>

          <Field label="Requirements" hint={`${requirementLines} requirement${requirementLines !== 1 ? "s" : ""} · each line becomes a bullet point`}>
            <textarea
              value={form.requirements}
              onChange={(e) => set("requirements", e.target.value)}
              className={`${inputCls} h-28 resize-none font-mono text-xs`}
              placeholder={"2+ years in freight forwarding\nKnowledge of Incoterms 2020\nFluent in French and English\nStrong communication skills"}
            />
          </Field>

          <Field label="Benefits & Perks" hint="e.g. Health insurance, transport allowance, training opportunities (one per line)">
            <textarea
              value={form.benefits}
              onChange={(e) => set("benefits", e.target.value)}
              className={`${inputCls} h-24 resize-none font-mono text-xs`}
              placeholder={"Competitive salary\nHealth insurance\nProfessional development budget\nHybrid work options"}
            />
          </Field>
        </div>

        {/* Application & Visibility */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Application & Visibility</h2>

          <Field label="Application Email" hint="Applications are sent to this address via the Careers page">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={form.applicationEmail}
                onChange={(e) => set("applicationEmail", e.target.value)}
                className={`${inputCls} pl-9`}
                placeholder="info@abcapitallogistics.com"
              />
            </div>
          </Field>

          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-[#0B1F3A] transition-colors">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#0B1F3A]"
            />
            <div>
              <div className="text-sm font-medium text-gray-800">Active — visible on Careers page</div>
              <div className="text-xs text-gray-500">Toggle off to close applications without deleting the listing</div>
            </div>
          </label>
        </div>

        {/* Preview card */}
        {form.title && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Public Listing Preview</h2>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-gray-900">{form.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{form.department}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{form.type}</span>
                    {form.experienceLevel && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{form.experienceLevel}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{form.location}</span>
                    {form.salary && <span className="text-[#F28C28] font-medium flex items-center gap-1"><DollarSign className="w-3 h-3" />{form.salary}</span>}
                    {form.closingDate && <span className="flex items-center gap-1 text-red-500"><Calendar className="w-3 h-3" />Closes {form.closingDate}</span>}
                  </div>
                  {form.description && <p className="text-xs text-gray-600 mt-2 line-clamp-2">{form.description}</p>}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${form.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                  {form.active ? "Active" : "Closed"}
                </span>
              </div>
              {form.applicationEmail && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                  <Mail className="w-3 h-3" />
                  Apply to: <span className="text-[#123D6B]">{form.applicationEmail}</span>
                </div>
              )}
            </div>
            <a href="/careers" target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1.5 text-xs text-[#123D6B] hover:underline">
              <ExternalLink className="w-3 h-3" />
              View Careers page →
            </a>
          </div>
        )}

        <div className="flex items-center gap-3 pb-6 pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : isNew ? "Create Position" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => setLocation("/admin/jobs")}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
