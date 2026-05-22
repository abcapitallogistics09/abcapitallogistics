import { useEffect, useState } from "react";
import { MessageCircle, ChevronDown, ChevronUp, Trash2, Bot, User, Search, Calendar, RefreshCw } from "lucide-react";

interface ConvSummary {
  id: number;
  title: string;
  createdAt: string;
  messageCount: number;
  firstUserMessage: string | null;
}

interface Message {
  id: number;
  role: string;
  content: string;
  createdAt: string;
}

export default function AdminAIConversations() {
  const [convs, setConvs] = useState<ConvSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<number, Message[]>>({});
  const [loadingMsgs, setLoadingMsgs] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/ai/conversations", { credentials: "include" })
      .then((r) => r.json())
      .then((d: ConvSummary[]) => setConvs(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleExpand = async (id: number) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (messages[id]) return;
    setLoadingMsgs(id);
    try {
      const r = await fetch(`/api/admin/ai/conversations/${id}`, { credentials: "include" });
      const d = await r.json() as { messages: Message[] };
      setMessages((prev) => ({ ...prev, [id]: d.messages }));
    } finally {
      setLoadingMsgs(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this conversation and all its messages?")) return;
    await fetch(`/api/admin/ai/conversations/${id}`, { method: "DELETE", credentials: "include" });
    setConvs((p) => p.filter((c) => c.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const filtered = convs.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.title.toLowerCase().includes(s) || (c.firstUserMessage ?? "").toLowerCase().includes(s);
  });

  const totalMsgs = convs.reduce((a, c) => a + c.messageCount, 0);
  const userMsgs = convs.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Conversations</h1>
          <p className="text-sm text-gray-500 mt-0.5">{userMsgs} conversations · {totalMsgs} total messages</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: "Total Conversations", value: convs.length, color: "text-[#0B1F3A]" },
          { label: "Total Messages", value: totalMsgs, color: "text-[#00AEEF]" },
          { label: "Avg Messages / Chat", value: convs.length ? Math.round(totalMsgs / convs.length) : 0, color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations by topic or message content…"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white"
        />
      </div>

      {/* Conversations */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-1">No conversations yet</h3>
            <p className="text-gray-500 text-sm">When users engage the AI assistant, their chats will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((conv) => (
              <div key={conv.id}>
                <div className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[#0B1F3A] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleExpand(conv.id)}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">Conversation #{conv.id}</span>
                      <span className="text-xs px-2 py-0.5 bg-[#00AEEF]/10 text-[#0B1F3A] rounded-full font-medium">
                        {conv.messageCount} messages
                      </span>
                    </div>
                    {conv.firstUserMessage && (
                      <p className="text-sm text-gray-600 mt-0.5 truncate">
                        "{conv.firstUserMessage}"
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(conv.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleExpand(conv.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B1F3A] hover:bg-gray-100 transition-colors"
                    >
                      {expanded === conv.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(conv.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded messages */}
                {expanded === conv.id && (
                  <div className="px-5 pb-5 bg-gray-50 border-t border-gray-100">
                    {loadingMsgs === conv.id ? (
                      <div className="py-6 text-center text-gray-400 text-sm">Loading messages…</div>
                    ) : (
                      <div className="space-y-3 pt-4 max-h-[500px] overflow-y-auto">
                        {(messages[conv.id] ?? []).map((msg) => (
                          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "user" ? "bg-[#00AEEF]" : "bg-[#0B1F3A]"}`}>
                              {msg.role === "user" ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.role === "user" ? "bg-[#0B1F3A] text-white rounded-tr-sm" : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"}`}>
                              {msg.content}
                              <p className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-blue-200" : "text-gray-400"}`}>
                                {new Date(msg.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
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
