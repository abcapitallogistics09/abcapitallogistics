import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2, Save } from "lucide-react";

interface Job {
  id: number;
  title: string;
  type: string;
  location: string;
  department: string;
  description: string;
  requirements: string;
  active: boolean;
}

const TYPES = ["Full-Time", "Part-Time", "Contract", "Internship"];
const DEPARTMENTS = ["Operations", "Customs", "Sales", "Warehousing", "Finance", "HR", "IT", "Management"];

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
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
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

  if (loading) return <div className="p-12 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setLocation("/admin/jobs")}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? "New Position" : "Edit Position"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Position Details</h2>

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
            <Field label="Type" required>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputCls}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Department" required>
              <select value={form.department} onChange={(e) => set("department", e.target.value)} className={inputCls}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Location" required>
            <input
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              className={inputCls}
              placeholder="e.g. Douala, Cameroon"
              required
            />
          </Field>

          <Field label="Job Description" required>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={`${inputCls} h-28 resize-none`}
              placeholder="Describe the role and key responsibilities..."
              required
            />
          </Field>

          <Field label="Requirements (one per line)">
            <textarea
              value={form.requirements}
              onChange={(e) => set("requirements", e.target.value)}
              className={`${inputCls} h-28 resize-none`}
              placeholder={"2+ years in freight forwarding\nKnowledge of Incoterms\nFluent in French and English"}
            />
            <p className="text-xs text-gray-400 mt-1">Each line becomes a bullet point on the public listing.</p>
          </Field>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">Visibility</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="w-4 h-4 accent-[#0B1F3A]"
            />
            <span className="text-sm font-medium text-gray-700">Active (visible on Careers page)</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pb-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : isNew ? "Create Position" : "Save Changes"}
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

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent bg-white";

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
