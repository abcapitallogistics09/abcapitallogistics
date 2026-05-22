import { useEffect, useState } from "react";
import { DollarSign, Plus, Pencil, Trash2, X, Save, Loader2, Check, Info } from "lucide-react";

interface Charge {
  id: number;
  name: string;
  description: string | null;
  amount: string;
  currency: string;
  isOptional: boolean;
  isDefault: boolean;
  editable: boolean;
  active: boolean;
}

const EMPTY_FORM = { name: "", description: "", amount: "", currency: "USD", isOptional: true, isDefault: true, editable: false, active: true };

export default function AdminCharges() {
  const [chargesList, setChargesList] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/charges", { credentials: "include" })
      .then((r) => r.json())
      .then((d: Charge[]) => setChargesList(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const startEdit = (c: Charge) => {
    setEditingId(c.id);
    setForm({ name: c.name, description: c.description ?? "", amount: c.amount, currency: c.currency, isOptional: c.isOptional, isDefault: c.isDefault, editable: c.editable, active: c.active });
  };

  const startNew = () => { setEditingId("new"); setForm(EMPTY_FORM); };
  const cancel = () => { setEditingId(null); setForm(EMPTY_FORM); };

  const handleSave = async () => {
    if (!form.name || !form.amount) return;
    setSaving(true);
    try {
      if (editingId === "new") {
        const r = await fetch("/api/admin/charges", {
          method: "POST", headers: { "Content-Type": "application/json" },
          credentials: "include", body: JSON.stringify(form),
        });
        const c = await r.json() as Charge;
        setChargesList((p) => [...p, c]);
      } else {
        const r = await fetch(`/api/admin/charges/${editingId as number}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          credentials: "include", body: JSON.stringify(form),
        });
        const c = await r.json() as Charge;
        setChargesList((p) => p.map((x) => (x.id === c.id ? c : x)));
        setSaved(c.id);
        setTimeout(() => setSaved(null), 2000);
      }
      cancel();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this charge? It won't affect existing quotations.")) return;
    await fetch(`/api/admin/charges/${id}`, { method: "DELETE", credentials: "include" });
    setChargesList((p) => p.filter((c) => c.id !== id));
  };

  const toggleActive = async (c: Charge) => {
    const r = await fetch(`/api/admin/charges/${c.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      credentials: "include", body: JSON.stringify({ active: !c.active }),
    });
    const updated = await r.json() as Charge;
    setChargesList((p) => p.map((x) => (x.id === updated.id ? updated : x)));
  };

  const activeCount = chargesList.filter((c) => c.active).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Charges</h1>
          <p className="text-sm text-gray-500 mt-0.5">{activeCount} active charges · shown on every new quotation</p>
        </div>
        <button onClick={startNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white text-sm rounded-lg hover:bg-[#123D6B] transition-colors font-semibold">
          <Plus className="w-4 h-4" /> Add Charge
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          System charges appear on every new quotation. Staff can select or deselect optional charges when building a quote, but only admins can edit the amounts below.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* New charge form */}
        {editingId === "new" && (
          <div className="px-5 py-4 bg-blue-50/50 border-b border-blue-100">
            <p className="text-sm font-semibold text-gray-900 mb-3">New System Charge</p>
            <ChargeForm form={form} setForm={setForm} saving={saving} onSave={handleSave} onCancel={cancel} />
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {chargesList.map((c) => (
              <div key={c.id} className={`${!c.active ? "opacity-50" : ""}`}>
                {editingId === c.id ? (
                  <div className="px-5 py-4 bg-amber-50/40 border-l-4 border-amber-400">
                    <ChargeForm form={form} setForm={setForm} saving={saving} onSave={handleSave} onCancel={cancel} />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1F3A]/8 flex items-center justify-center shrink-0">
                      <DollarSign className="w-5 h-5 text-[#0B1F3A]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-gray-900 text-sm">{c.name}</span>
                        {!c.isOptional && <span className="text-[10px] px-1.5 py-0.5 bg-[#0B1F3A] text-white rounded font-medium">Required</span>}
                        {c.isDefault && c.isOptional && <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-medium">Default on</span>}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${c.active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                          {c.active ? "Active" : "Inactive"}
                        </span>
                        {saved === c.id && <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1"><Check className="w-3 h-3" />Saved</span>}
                      </div>
                      {c.description && <p className="text-xs text-gray-500">{c.description}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-gray-900">{c.currency} {Number(c.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => toggleActive(c)} title={c.active ? "Deactivate" : "Activate"}
                        className={`p-1.5 rounded-lg transition-colors ${c.active ? "text-emerald-500 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}>
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => startEdit(c)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B1F3A] hover:bg-gray-100 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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

function ChargeForm({
  form,
  setForm,
  saving,
  onSave,
  onCancel,
}: {
  form: typeof EMPTY_FORM;
  setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_FORM>>;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Charge Name <span className="text-red-500">*</span></label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Customs Clearance Fee"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Amount <span className="text-red-500">*</span></label>
            <input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="0.00" min="0" step="0.01"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
            <select value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]">
              <option>USD</option>
              <option>EUR</option>
              <option>XAF</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
        <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Brief description of this charge"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
      </div>
      <div className="flex items-center gap-4 mb-3 flex-wrap">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={!form.isOptional} onChange={(e) => setForm((f) => ({ ...f, isOptional: !e.target.checked }))} className="w-4 h-4 accent-[#0B1F3A]" />
          Required (cannot be deselected)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))} className="w-4 h-4 accent-[#0B1F3A]" />
          Selected by default
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-[#0B1F3A]" />
          Active
        </label>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <X className="w-3.5 h-3.5" />Cancel
        </button>
        <button onClick={onSave} disabled={saving || !form.name || !form.amount}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0B1F3A] text-white text-sm rounded-lg hover:bg-[#123D6B] disabled:opacity-40 transition-colors font-semibold">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}Save Charge
        </button>
      </div>
    </div>
  );
}
