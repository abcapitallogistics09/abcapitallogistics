import { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp, AlertTriangle, FileText } from "lucide-react";

interface Quote {
  id: number;
  referenceNumber: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  origin: string;
  destination: string;
  freightType: string;
  cargoType: string;
  weight: string;
  volume: string | null;
  incoterms: string | null;
  hazardous: boolean;
  message: string | null;
  createdAt: string;
}

const FREIGHT_LABELS: Record<string, string> = {
  air: "Air Freight",
  ocean: "Ocean Freight",
  road: "Road Freight",
  customs: "Customs Clearance",
  warehousing: "Warehousing",
  threepl: "3PL",
};

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/quotes", { credentials: "include" })
      .then((r) => r.json())
      .then((d: Quote[]) => setQuotes(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = quotes.filter(
    (q) =>
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.email.toLowerCase().includes(search.toLowerCase()) ||
      q.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      q.origin.toLowerCase().includes(search.toLowerCase()) ||
      q.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quote Requests</h1>
          <p className="text-gray-500 mt-1">{quotes.length} total requests</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, reference..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">{search ? "No quotes match your search." : "No quote requests yet."}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((quote) => (
              <div key={quote.id}>
                <button
                  onClick={() => setExpanded(expanded === quote.id ? null : quote.id)}
                  className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">{quote.name}</span>
                        {quote.company && <span className="text-xs text-gray-400">· {quote.company}</span>}
                        {quote.hazardous && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                            <AlertTriangle className="w-3 h-3" /> Hazardous
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
                        <span>{quote.referenceNumber}</span>
                        <span>{quote.origin} → {quote.destination}</span>
                        <span>{FREIGHT_LABELS[quote.freightType] ?? quote.freightType}</span>
                        <span>{quote.cargoType}</span>
                        <span>{quote.weight}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">{new Date(quote.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400">{new Date(quote.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    {expanded === quote.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </div>
                </button>

                {expanded === quote.id && (
                  <div className="px-6 pb-5 bg-gray-50 border-t border-gray-100">
                    <div className="pt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <Detail label="Email" value={<a href={`mailto:${quote.email}`} className="text-blue-600 hover:underline">{quote.email}</a>} />
                      <Detail label="Phone" value={quote.phone} />
                      <Detail label="Company" value={quote.company ?? "—"} />
                      <Detail label="Reference" value={quote.referenceNumber} />
                      <Detail label="Freight Type" value={FREIGHT_LABELS[quote.freightType] ?? quote.freightType} />
                      <Detail label="Cargo Type" value={quote.cargoType} />
                      <Detail label="Weight" value={quote.weight} />
                      <Detail label="Volume" value={quote.volume ?? "—"} />
                      <Detail label="Incoterms" value={quote.incoterms ?? "—"} />
                      <Detail label="Hazardous" value={quote.hazardous ? "Yes" : "No"} />
                    </div>
                    {quote.message && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Message</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{quote.message}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}
