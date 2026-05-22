import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Plus, Search, FileText, Eye, Trash2, Download,
  ArrowRight, Clock, CheckCircle, XCircle, Send, RefreshCw
} from "lucide-react";

interface Quotation {
  id: number;
  refNumber: string;
  customerName: string;
  customerCompany: string | null;
  origin: string;
  destination: string;
  mode: string;
  totalCost: string;
  currency: string;
  status: string;
  createdAt: string;
}

const MODE_LABELS: Record<string, string> = {
  air: "Air",
  sea_lcl: "Sea LCL",
  sea_fcl: "Sea FCL",
  clearance_only: "Clearance",
};

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  draft: { label: "Draft", icon: <Clock className="w-3 h-3" />, color: "text-gray-600", bg: "bg-gray-100" },
  sent: { label: "Sent", icon: <Send className="w-3 h-3" />, color: "text-blue-700", bg: "bg-blue-50" },
  accepted: { label: "Accepted", icon: <CheckCircle className="w-3 h-3" />, color: "text-emerald-700", bg: "bg-emerald-50" },
  rejected: { label: "Rejected", icon: <XCircle className="w-3 h-3" />, color: "text-red-700", bg: "bg-red-50" },
};

export default function AdminQuotationsList() {
  const [, setLocation] = useLocation();
  const [quotes, setQuotes] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/quotations", { credentials: "include" })
      .then((r) => r.json())
      .then((d: Quotation[]) => setQuotes(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number, ref: string) => {
    if (!confirm(`Delete quotation ${ref}?`)) return;
    await fetch(`/api/admin/quotations/${id}`, { method: "DELETE", credentials: "include" });
    setQuotes((p) => p.filter((q) => q.id !== id));
  };

  const openPdf = (id: number) => {
    window.open(`/api/admin/quotations/${id}/pdf`, "_blank");
  };

  const filtered = quotes.filter((q) => {
    const s = search.toLowerCase();
    const matchSearch = !s || q.refNumber.toLowerCase().includes(s) || q.customerName.toLowerCase().includes(s) || (q.customerCompany ?? "").toLowerCase().includes(s) || q.origin.toLowerCase().includes(s) || q.destination.toLowerCase().includes(s);
    const matchStatus = statusFilter === "all" || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: quotes.length,
    draft: quotes.filter((q) => q.status === "draft").length,
    sent: quotes.filter((q) => q.status === "sent").length,
    accepted: quotes.filter((q) => q.status === "accepted").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
          <p className="text-sm text-gray-500 mt-0.5">{stats.total} total · {stats.sent} sent · {stats.accepted} accepted</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setLocation("/admin/quotations/new")}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white text-sm rounded-lg hover:bg-[#123D6B] transition-colors font-semibold">
            <Plus className="w-4 h-4" /> New Quotation
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "All Quotes", value: stats.total, color: "text-gray-900" },
          { label: "Draft", value: stats.draft, color: "text-gray-500" },
          { label: "Sent", value: stats.sent, color: "text-blue-600" },
          { label: "Accepted", value: stats.accepted, color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ref, client, company, route…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white" />
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {["all", "draft", "sent", "accepted", "rejected"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${statusFilter === s ? "bg-[#0B1F3A] text-white" : "text-gray-600 hover:bg-gray-50"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-1">No quotations yet</h3>
            <p className="text-gray-500 text-sm mb-4">Create your first quotation to get started.</p>
            <button onClick={() => setLocation("/admin/quotations/new")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white text-sm rounded-lg hover:bg-[#123D6B] transition-colors font-semibold">
              <Plus className="w-4 h-4" /> New Quotation
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">Ref</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Client</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Route</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Mode</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Total</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((q) => {
                const sc = STATUS_CONFIG[q.status] ?? STATUS_CONFIG.draft!;
                return (
                  <tr key={q.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-[#0B1F3A] bg-blue-50 px-2 py-0.5 rounded">{q.refNumber}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-sm text-gray-900">{q.customerName}</div>
                      {q.customerCompany && <div className="text-xs text-gray-400">{q.customerCompany}</div>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <span className="font-medium">{q.origin}</span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="font-medium">{q.destination}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs px-2 py-1 bg-[#0B1F3A]/8 text-[#0B1F3A] rounded-full font-medium">
                        {MODE_LABELS[q.mode] ?? q.mode}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-bold text-gray-900 text-sm">{q.currency} {Number(q.totalCost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${sc.color} ${sc.bg}`}>
                        {sc.icon}{sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-400">
                      {new Date(q.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => setLocation(`/admin/quotations/${q.id}`)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B1F3A] hover:bg-gray-100 transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => openPdf(q.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#00AEEF] hover:bg-blue-50 transition-colors" title="PDF">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(q.id, q.refNumber)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
