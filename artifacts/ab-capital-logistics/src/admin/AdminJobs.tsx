import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Plus, Pencil, Trash2, Briefcase, ToggleLeft, ToggleRight } from "lucide-react";

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
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
          <p className="text-gray-500 mt-1">{jobs.filter((j) => j.active).length} active / {jobs.length} total</p>
        </div>
        <button
          onClick={() => setLocation("/admin/jobs/new")}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Position
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : jobs.length === 0 ? (
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
        ) : (
          <div className="divide-y divide-gray-100">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold text-sm ${job.active ? "text-gray-900" : "text-gray-400"}`}>{job.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${job.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                      {job.active ? "Active" : "Closed"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                    <span>{job.department}</span>
                    <span>·</span>
                    <span>{job.type}</span>
                    <span>·</span>
                    <span>{job.location}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{job.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
