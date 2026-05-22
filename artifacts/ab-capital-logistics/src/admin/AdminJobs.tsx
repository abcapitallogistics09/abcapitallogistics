import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Plus, Pencil, Trash2, Briefcase, ToggleLeft, ToggleRight, Search, MapPin, Clock, Building2 } from "lucide-react";

interface Job {
  id: number;
  title: string;
  type: string;
  location: string;
  department: string;
  description: string;
  requirements: string;
  active: boolean;
  createdAt: string;
  salary: string | null;
  experienceLevel: string | null;
  applicationEmail: string | null;
  closingDate: string | null;
  benefits: string | null;
}

const DEPT_COLORS: Record<string, { bg: string; text: string }> = {
  Operations: { bg: "bg-blue-50", text: "text-blue-700" },
  Customs: { bg: "bg-purple-50", text: "text-purple-700" },
  Sales: { bg: "bg-green-50", text: "text-green-700" },
  Warehousing: { bg: "bg-amber-50", text: "text-amber-700" },
  Finance: { bg: "bg-emerald-50", text: "text-emerald-700" },
  HR: { bg: "bg-pink-50", text: "text-pink-700" },
  IT: { bg: "bg-cyan-50", text: "text-cyan-700" },
  Management: { bg: "bg-indigo-50", text: "text-indigo-700" },
};

const DEPARTMENTS = ["All", "Operations", "Customs", "Sales", "Warehousing", "Finance", "HR", "IT", "Management"];

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed">("all");
  const [, setLocation] = useLocation();

  const load = () => {
    fetch("/api/admin/jobs", { credentials: "include" })
      .then((r) => r.json())
      .then((d: Job[]) => setJobs(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete the "${title}" listing? This cannot be undone.`)) return;
    await fetch(`/api/admin/jobs/${id}`, { method: "DELETE", credentials: "include" });
    setJobs((j) => j.filter((job) => job.id !== id));
  };

  const toggleActive = async (job: Job) => {
    const res = await fetch(`/api/admin/jobs/${job.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ active: !job.active }),
    });
    if (res.ok) {
      const updated = await res.json() as Job;
      setJobs((j) => j.map((x) => (x.id === job.id ? { ...x, active: updated.active } : x)));
    }
  };

  const filtered = jobs.filter((j) => {
    const matchesSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "All" || j.department === deptFilter;
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? j.active : !j.active);
    return matchesSearch && matchesDept && matchesStatus;
  });

  const active = jobs.filter((j) => j.active).length;
  const byDept = jobs.reduce<Record<string, number>>((acc, j) => { acc[j.department] = (acc[j.department] ?? 0) + 1; return acc; }, {});
  const topDept = Object.entries(byDept).sort((a, b) => b[1] - a[1])[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
          <p className="text-gray-500 mt-0.5 text-sm">{active} active · {jobs.length - active} closed · {jobs.length} total</p>
        </div>
        <button
          onClick={() => setLocation("/admin/jobs/new")}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Position
        </button>
      </div>

      {jobs.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            { label: "Total Listings", value: jobs.length, color: "text-[#0B1F3A]" },
            { label: "Active / Open", value: active, color: "text-emerald-600" },
            { label: "Closed", value: jobs.length - active, color: "text-gray-500" },
            { label: "Top Department", value: topDept ? topDept[0] : "—", color: "text-[#00AEEF]" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className={`text-xl font-bold ${s.color} truncate`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search positions or departments..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white"
        >
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "closed")}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 && jobs.length === 0 ? (
          <div className="p-16 text-center">
            <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-1">No job listings</h3>
            <p className="text-gray-500 text-sm mb-5">Add open positions to show them on your Careers page.</p>
            <button
              onClick={() => setLocation("/admin/jobs/new")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add first position
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No jobs match your filters.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((job) => {
              const deptColor = DEPT_COLORS[job.department] ?? { bg: "bg-gray-100", text: "text-gray-600" };
              return (
                <div key={job.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${deptColor.bg}`}>
                    <Building2 className={`w-4 h-4 ${deptColor.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className={`font-semibold text-sm ${job.active ? "text-gray-900" : "text-gray-400"}`}>{job.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${job.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                        {job.active ? "Active" : "Closed"}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${deptColor.bg} ${deptColor.text}`}>{job.department}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                      {job.experienceLevel && <span>{job.experienceLevel}</span>}
                      {job.salary && <span className="text-[#00AEEF] font-medium">{job.salary}</span>}
                      {job.closingDate && <span className="text-red-500">Closes: {job.closingDate}</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{job.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleActive(job)}
                      title={job.active ? "Close position" : "Reopen position"}
                      className={`p-1.5 rounded-lg transition-colors ${job.active ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}
                    >
                      {job.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setLocation(`/admin/jobs/${job.id}/edit`)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B1F3A] hover:bg-gray-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id, job.title)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
