import { useEffect, useState } from "react";
import { Brain, Save, Plus, Trash2, Pencil, X, Check, ChevronDown, ChevronUp, Loader2, Lightbulb, BookOpen } from "lucide-react";

interface KnowledgeEntry {
  id: number;
  category: string;
  question: string;
  answer: string;
  active: boolean;
  createdAt: string;
}

const CATEGORIES = ["General", "Services", "Pricing", "Customs", "Tracking", "Contact", "Port Operations", "Road Freight", "Air Freight", "Warehousing", "Ship Agency"];

const EMPTY_ENTRY = { category: "General", question: "", answer: "", active: true };

export default function AdminAITraining() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [savedPrompt, setSavedPrompt] = useState("");
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [promptSaved, setPromptSaved] = useState(false);

  const [knowledge, setKnowledge] = useState<KnowledgeEntry[]>([]);
  const [loadingKnowledge, setLoadingKnowledge] = useState(true);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(EMPTY_ENTRY);
  const [savingEntry, setSavingEntry] = useState(false);
  const [catFilter, setCatFilter] = useState("All");
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    fetch("/api/admin/ai/settings", { credentials: "include" })
      .then((r) => r.json())
      .then((d: { systemPrompt: string }) => {
        setSystemPrompt(d.systemPrompt);
        setSavedPrompt(d.systemPrompt);
      })
      .catch(() => {});

    fetch("/api/admin/ai/knowledge", { credentials: "include" })
      .then((r) => r.json())
      .then((d: KnowledgeEntry[]) => setKnowledge(d))
      .catch(() => {})
      .finally(() => setLoadingKnowledge(false));
  }, []);

  const handleSavePrompt = async () => {
    setSavingPrompt(true);
    try {
      await fetch("/api/admin/ai/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ systemPrompt }),
      });
      setSavedPrompt(systemPrompt);
      setPromptSaved(true);
      setTimeout(() => setPromptSaved(false), 2500);
    } finally {
      setSavingPrompt(false);
    }
  };

  const startEdit = (entry: KnowledgeEntry) => {
    setEditingId(entry.id);
    setForm({ category: entry.category, question: entry.question, answer: entry.answer, active: entry.active });
  };

  const startNew = () => {
    setEditingId("new");
    setForm(EMPTY_ENTRY);
  };

  const cancelEdit = () => { setEditingId(null); setForm(EMPTY_ENTRY); };

  const handleSaveEntry = async () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    setSavingEntry(true);
    try {
      if (editingId === "new") {
        const r = await fetch("/api/admin/ai/knowledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });
        const entry = await r.json() as KnowledgeEntry;
        setKnowledge((p) => [entry, ...p]);
      } else {
        const r = await fetch(`/api/admin/ai/knowledge/${editingId as number}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });
        const entry = await r.json() as KnowledgeEntry;
        setKnowledge((p) => p.map((e) => (e.id === entry.id ? entry : e)));
      }
      cancelEdit();
    } finally {
      setSavingEntry(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this knowledge entry?")) return;
    await fetch(`/api/admin/ai/knowledge/${id}`, { method: "DELETE", credentials: "include" });
    setKnowledge((p) => p.filter((e) => e.id !== id));
  };

  const toggleActive = async (entry: KnowledgeEntry) => {
    const r = await fetch(`/api/admin/ai/knowledge/${entry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ active: !entry.active }),
    });
    const updated = await r.json() as KnowledgeEntry;
    setKnowledge((p) => p.map((e) => (e.id === updated.id ? updated : e)));
  };

  const cats = ["All", ...CATEGORIES];
  const filtered = catFilter === "All" ? knowledge : knowledge.filter((e) => e.category === catFilter);
  const active = knowledge.filter((e) => e.active).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Assistant Training</h1>
        <p className="text-sm text-gray-500 mt-0.5">Customise the AI's behaviour and feed it knowledge to improve its responses</p>
      </div>

      {/* System Prompt */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowPrompt((p) => !p)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0B1F3A] flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">System Prompt</p>
              <p className="text-xs text-gray-500">The core instructions that define how the AI behaves</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {systemPrompt !== savedPrompt && (
              <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-medium">Unsaved changes</span>
            )}
            {showPrompt ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </button>

        {showPrompt && (
          <div className="px-5 pb-5 border-t border-gray-100">
            <p className="text-xs text-gray-500 mt-3 mb-2">
              This is the foundation of the AI's personality and knowledge. Be specific about what it should and shouldn't say. Changes take effect immediately on the next user message.
            </p>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={14}
              className="w-full px-4 py-3 text-sm font-mono border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] resize-none leading-relaxed"
              placeholder="You are the AI assistant for AB Capital Logistics…"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-400">{systemPrompt.length} characters</span>
              <div className="flex gap-2">
                {systemPrompt !== savedPrompt && (
                  <button onClick={() => setSystemPrompt(savedPrompt)} className="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Discard
                  </button>
                )}
                <button
                  onClick={handleSavePrompt}
                  disabled={savingPrompt || systemPrompt === savedPrompt}
                  className="flex items-center gap-2 px-4 py-1.5 bg-[#0B1F3A] text-white text-sm rounded-lg hover:bg-[#123D6B] disabled:opacity-40 transition-colors font-medium"
                >
                  {savingPrompt ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : promptSaved ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Save className="w-3.5 h-3.5" />}
                  {promptSaved ? "Saved!" : "Save Prompt"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Knowledge Base */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00AEEF] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Knowledge Base</p>
              <p className="text-xs text-gray-500">{active} of {knowledge.length} entries active — injected into every AI response</p>
            </div>
          </div>
          <button
            onClick={startNew}
            className="flex items-center gap-2 px-3 py-2 bg-[#0B1F3A] text-white text-sm rounded-lg hover:bg-[#123D6B] transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>

        {/* Category filter */}
        <div className="px-5 py-3 border-b border-gray-100 flex gap-2 flex-wrap">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${catFilter === c ? "bg-[#0B1F3A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {c}
              {c !== "All" && <span className="ml-1.5 opacity-60">{knowledge.filter((e) => e.category === c).length}</span>}
            </button>
          ))}
        </div>

        {/* New entry form */}
        {editingId === "new" && (
          <div className="px-5 py-4 bg-blue-50/40 border-b border-blue-100">
            <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-[#00AEEF]" /> New Knowledge Entry</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-[#0B1F3A]" />
                  Active (inject into AI context)
                </label>
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Question / Topic <span className="text-red-500">*</span></label>
              <input value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                placeholder="e.g. What are your ocean freight transit times to China?"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Answer / Information <span className="text-red-500">*</span></label>
              <textarea value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                rows={4} placeholder="e.g. Our ocean freight from Douala to Shanghai typically takes 28–35 days depending on carrier schedule…"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] resize-none" />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={cancelEdit} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><X className="w-3.5 h-3.5" />Cancel</button>
              <button onClick={handleSaveEntry} disabled={savingEntry || !form.question.trim() || !form.answer.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0B1F3A] text-white text-sm rounded-lg hover:bg-[#123D6B] disabled:opacity-40 transition-colors font-medium">
                {savingEntry ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}Save Entry
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {loadingKnowledge ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{catFilter === "All" ? "No knowledge entries yet. Add your first one above." : `No entries in the "${catFilter}" category.`}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((entry) => (
              <div key={entry.id} className={`px-5 py-4 ${!entry.active ? "opacity-50" : ""}`}>
                {editingId === entry.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]">
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-[#0B1F3A]" />
                        Active
                      </label>
                    </div>
                    <input value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
                    <textarea value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                      rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] resize-none" />
                    <div className="flex gap-2 justify-end">
                      <button onClick={cancelEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><X className="w-3.5 h-3.5" />Cancel</button>
                      <button onClick={handleSaveEntry} disabled={savingEntry}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B1F3A] text-white text-sm rounded-lg hover:bg-[#123D6B] disabled:opacity-40 transition-colors font-medium">
                        {savingEntry ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 bg-[#0B1F3A]/8 text-[#0B1F3A] rounded-full font-medium">{entry.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${entry.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                          {entry.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">{entry.question}</p>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed line-clamp-3">{entry.answer}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => toggleActive(entry)} title={entry.active ? "Deactivate" : "Activate"}
                        className={`p-1.5 rounded-lg transition-colors ${entry.active ? "text-emerald-500 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}>
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => startEdit(entry)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B1F3A] hover:bg-gray-100 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(entry.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
