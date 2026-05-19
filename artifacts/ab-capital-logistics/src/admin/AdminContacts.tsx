import { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp, Mail } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/contacts", { credentials: "include" })
      .then((r) => r.json())
      .then((d: Contact[]) => setContacts(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-gray-500 mt-1">{contacts.length} total messages</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, subject..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">{search ? "No messages match your search." : "No contact messages yet."}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((contact) => (
              <div key={contact.id}>
                <button
                  onClick={() => setExpanded(expanded === contact.id ? null : contact.id)}
                  className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#0B1F3A]/10 flex items-center justify-center text-[#0B1F3A] font-bold text-sm shrink-0 mt-0.5">
                      {contact.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-gray-900 text-sm">{contact.name}</span>
                        {contact.company && <span className="text-xs text-gray-400">· {contact.company}</span>}
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-0.5">{contact.subject}</p>
                      <p className="text-xs text-gray-400 truncate">{contact.message}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">{new Date(contact.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(contact.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    {expanded === contact.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                    )}
                  </div>
                </button>

                {expanded === contact.id && (
                  <div className="px-6 pb-5 bg-gray-50 border-t border-gray-100">
                    <div className="pt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a>
                      </div>
                      {contact.phone && (
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Phone</p>
                          <p className="text-gray-800">{contact.phone}</p>
                        </div>
                      )}
                      {contact.company && (
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Company</p>
                          <p className="text-gray-800">{contact.company}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Message</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                    </div>
                    <div className="mt-4">
                      <a
                        href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white rounded-lg text-sm font-medium hover:bg-[#123D6B] transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Reply by email
                      </a>
                    </div>
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
