import { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, Save, Download, Plus, Trash2, Loader2, Check,
  Plane, Ship, Truck, FileCheck, ChevronDown, AlertCircle
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SystemCharge {
  id: number;
  name: string;
  description: string | null;
  amount: string;
  currency: string;
  isOptional: boolean;
  isDefault: boolean;
  active: boolean;
}

interface OtherCharge {
  _key: number;
  name: string;
  amount: string;
}

interface SelectedSystem {
  id: number;
  name: string;
  amount: string;
}

const INCOTEMS = ["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP", "FAS", "FOB", "CFR", "CIF"];
const CARGO_TYPES = ["General Cargo", "Dangerous Goods (DG)", "Perishables", "Oversized / OOG", "Electronics", "Pharmaceuticals", "Machinery", "Chemicals", "Bulk Commodity", "Personal Effects"];
const CONTAINER_TYPES = ["20ft Standard", "40ft Standard", "40ft High Cube (HC)", "20ft Reefer", "40ft Reefer", "20ft Open Top", "40ft Open Top"];
const CURRENCIES = ["USD", "EUR", "XAF"];

const MODES = [
  { value: "air", label: "Air Freight", icon: Plane },
  { value: "sea_lcl", label: "Sea — LCL", icon: Ship },
  { value: "sea_fcl", label: "Sea — FCL", icon: Ship },
  { value: "clearance_only", label: "Clearance Only", icon: FileCheck },
];

let _keyCounter = 0;
const nextKey = () => ++_keyCounter;

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({ title, children, number }: { title: string; children: React.ReactNode; number: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <span className="w-7 h-7 rounded-full bg-[#0B1F3A] text-white text-xs font-bold flex items-center justify-center shrink-0">
          {number}
        </span>
        <h2 className="font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-colors ${props.className ?? ""}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent appearance-none bg-white disabled:bg-gray-50 transition-colors ${props.className ?? ""}`}
      >
        {props.children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminCreateQuote({ id }: { id?: string }) {
  const [, setLocation] = useLocation();
  const isEditing = Boolean(id);

  // ── Customer
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");

  // ── Shipment
  const [mode, setMode] = useState("sea_lcl");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [incoterm, setIncoterm] = useState("FOB");
  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const [containerType, setContainerType] = useState("20ft Standard");
  const [currency, setCurrency] = useState("USD");

  // ── Manual costs
  const [freightCost, setFreightCost] = useState("");
  const [customsDuties, setCustomsDuties] = useState("");
  const [otherCharges, setOtherCharges] = useState<OtherCharge[]>([]);

  // ── System charges
  const [systemChargesList, setSystemChargesList] = useState<SystemCharge[]>([]);
  const [selectedSystemIds, setSelectedSystemIds] = useState<Set<number>>(new Set());
  const [loadingCharges, setLoadingCharges] = useState(true);

  // ── Margin
  const [marginType, setMarginType] = useState<"percentage" | "fixed">("percentage");
  const [marginValue, setMarginValue] = useState("");

  // ── Notes, status
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("draft");

  // ── UI state
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [savedId, setSavedId] = useState<number | null>(null);

  // Load system charges
  useEffect(() => {
    fetch("/api/admin/charges", { credentials: "include" })
      .then((r) => r.json())
      .then((data: SystemCharge[]) => {
        const active = data.filter((c) => c.active);
        setSystemChargesList(active);
        // Auto-select defaults
        const defaults = new Set(active.filter((c) => c.isDefault || !c.isOptional).map((c) => c.id));
        setSelectedSystemIds(defaults);
      })
      .catch(() => {})
      .finally(() => setLoadingCharges(false));
  }, []);

  // Load existing quote if editing
  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/quotations/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((q: {
        customerName: string; customerEmail?: string; customerCompany?: string;
        mode: string; origin: string; destination: string; incoterm?: string;
        cargoType?: string; weight?: string; volume?: string; containerType?: string;
        currency: string; marginType: string; marginValue: string;
        notes?: string; status: string;
        items: { name: string; amount: string; source: string }[];
      }) => {
        setCustomerName(q.customerName ?? "");
        setCustomerEmail(q.customerEmail ?? "");
        setCustomerCompany(q.customerCompany ?? "");
        setMode(q.mode);
        setOrigin(q.origin);
        setDestination(q.destination);
        setIncoterm(q.incoterm ?? "FOB");
        setCargoType(q.cargoType ?? "");
        setWeight(q.weight ?? "");
        setVolume(q.volume ?? "");
        setContainerType(q.containerType ?? "20ft Standard");
        setCurrency(q.currency);
        setMarginType((q.marginType as "percentage" | "fixed") ?? "percentage");
        setMarginValue(q.marginValue ?? "0");
        setNotes(q.notes ?? "");
        setStatus(q.status);
        // Restore manual items
        const freight = q.items.find((i) => i.source === "freight");
        if (freight) setFreightCost(freight.amount);
        const duties = q.items.find((i) => i.source === "duties");
        if (duties) setCustomsDuties(duties.amount);
        const other = q.items.filter((i) => i.source === "other");
        setOtherCharges(other.map((i) => ({ _key: nextKey(), name: i.name, amount: i.amount })));
      })
      .catch(() => {});
  }, [id]);

  // ── Live calculation
  const calc = useMemo(() => {
    const freight = parseFloat(freightCost) || 0;
    const duties = parseFloat(customsDuties) || 0;
    const otherTotal = otherCharges.reduce((s, c) => s + (parseFloat(c.amount) || 0), 0);
    const manualTotal = freight + duties + otherTotal;

    const systemTotal = systemChargesList
      .filter((c) => selectedSystemIds.has(c.id))
      .reduce((s, c) => s + parseFloat(c.amount), 0);

    const subtotal = manualTotal + systemTotal;
    const mv = parseFloat(marginValue) || 0;
    const marginAmount = marginType === "percentage" ? subtotal * (mv / 100) : mv;
    const total = subtotal + marginAmount;

    return { manualTotal, systemTotal, subtotal, marginAmount, total };
  }, [freightCost, customsDuties, otherCharges, systemChargesList, selectedSystemIds, marginType, marginValue]);

  const fmt = useCallback((n: number) =>
    `${currency} ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    [currency]
  );

  const addOtherCharge = () =>
    setOtherCharges((p) => [...p, { _key: nextKey(), name: "", amount: "" }]);

  const removeOtherCharge = (key: number) =>
    setOtherCharges((p) => p.filter((c) => c._key !== key));

  const updateOtherCharge = (key: number, field: "name" | "amount", value: string) =>
    setOtherCharges((p) => p.map((c) => (c._key === key ? { ...c, [field]: value } : c)));

  const toggleSystem = (id: number, isOptional: boolean) => {
    if (!isOptional) return; // required charges can't be deselected
    setSelectedSystemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const validate = () => {
    const errs: string[] = [];
    if (!customerName.trim()) errs.push("Customer name is required");
    if (!origin.trim()) errs.push("Origin is required");
    if (!destination.trim()) errs.push("Destination is required");
    return errs;
  };

  const buildPayload = () => ({
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim() || undefined,
    customerCompany: customerCompany.trim() || undefined,
    origin: origin.trim(),
    destination: destination.trim(),
    mode,
    incoterm,
    cargoType: cargoType || undefined,
    weight: mode === "air" ? (parseFloat(weight) || undefined) : undefined,
    volume: mode === "sea_lcl" ? (parseFloat(volume) || undefined) : undefined,
    containerType: mode === "sea_fcl" ? containerType : undefined,
    currency,
    marginType,
    marginValue: parseFloat(marginValue) || 0,
    freightCost: parseFloat(freightCost) || 0,
    customsDuties: parseFloat(customsDuties) || 0,
    otherCharges: otherCharges
      .filter((c) => c.name && parseFloat(c.amount) > 0)
      .map((c) => ({ name: c.name, amount: parseFloat(c.amount) })),
    systemCharges: systemChargesList
      .filter((c) => selectedSystemIds.has(c.id))
      .map((c) => ({ name: c.name, amount: parseFloat(c.amount) })),
    notes: notes.trim() || undefined,
    status,
  });

  const handleSave = async (targetStatus?: string) => {
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);
    setSaving(true);
    try {
      const payload = { ...buildPayload(), status: targetStatus ?? status };
      const r = await fetch("/api/admin/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const q = await r.json() as { id: number; refNumber: string };
      setSavedId(q.id);
      setTimeout(() => setLocation("/admin/quotations"), 1000);
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePdf = async () => {
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);
    setSaving(true);
    try {
      const payload = { ...buildPayload(), status };
      const r = await fetch("/api/admin/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const q = await r.json() as { id: number };
      window.open(`/api/admin/quotations/${q.id}/pdf`, "_blank");
      setTimeout(() => setLocation("/admin/quotations"), 800);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setLocation("/admin/quotations")}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEditing ? "Edit Quotation" : "New Quotation"}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Fill in all sections, then save or generate a PDF</p>
          </div>
        </div>
        {savedId && (
          <span className="flex items-center gap-1.5 text-emerald-700 text-sm font-medium">
            <Check className="w-4 h-4" /> Saved successfully
          </span>
        )}
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <div>
            {errors.map((e) => <p key={e} className="text-sm text-red-700">{e}</p>)}
          </div>
        </div>
      )}

      <div className="flex gap-5 items-start">
        {/* ── Left: Form sections ───────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Customer */}
          <SectionCard title="Customer Information" number={1}>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <FieldLabel required>Customer Name</FieldLabel>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="John Doe" />
              </div>
              <div>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="john@example.com" />
              </div>
              <div>
                <FieldLabel>Company</FieldLabel>
                <Input value={customerCompany} onChange={(e) => setCustomerCompany(e.target.value)} placeholder="Acme Corp" />
              </div>
            </div>
          </SectionCard>

          {/* Shipment Details */}
          <SectionCard title="Shipment Details" number={2}>
            {/* Mode selector */}
            <div className="mb-4">
              <FieldLabel required>Freight Mode</FieldLabel>
              <div className="grid grid-cols-4 gap-2">
                {MODES.map(({ value, label, icon: Icon }) => (
                  <button key={value} type="button" onClick={() => setMode(value)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all text-xs font-semibold ${mode === value ? "border-[#0B1F3A] bg-[#0B1F3A] text-white" : "border-gray-200 text-gray-600 hover:border-[#0B1F3A]/40"}`}>
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <FieldLabel required>Origin</FieldLabel>
                <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g. Shanghai, China" />
              </div>
              <div>
                <FieldLabel required>Destination</FieldLabel>
                <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Douala, Cameroon" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <FieldLabel>Incoterm</FieldLabel>
                <Select value={incoterm} onChange={(e) => setIncoterm(e.target.value)}>
                  {INCOTEMS.map((t) => <option key={t}>{t}</option>)}
                </Select>
              </div>
              <div>
                <FieldLabel>Cargo Type</FieldLabel>
                <Select value={cargoType} onChange={(e) => setCargoType(e.target.value)}>
                  <option value="">— Select —</option>
                  {CARGO_TYPES.map((t) => <option key={t}>{t}</option>)}
                </Select>
              </div>
              <div>
                <FieldLabel>Currency</FieldLabel>
                <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </Select>
              </div>
              {/* Dynamic field based on mode */}
              {mode === "air" && (
                <div>
                  <FieldLabel>Weight (kg)</FieldLabel>
                  <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0" min="0" />
                </div>
              )}
              {mode === "sea_lcl" && (
                <div>
                  <FieldLabel>Volume (CBM)</FieldLabel>
                  <Input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="0.00" min="0" step="0.01" />
                </div>
              )}
              {mode === "sea_fcl" && (
                <div>
                  <FieldLabel>Container Type</FieldLabel>
                  <Select value={containerType} onChange={(e) => setContainerType(e.target.value)}>
                    {CONTAINER_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </Select>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Manual Costs */}
          {mode !== "clearance_only" && (
            <SectionCard title="Manual Costs" number={3}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <FieldLabel>Freight Cost</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">{currency}</span>
                    <Input type="number" value={freightCost} onChange={(e) => setFreightCost(e.target.value)} placeholder="0.00" min="0" step="0.01" className="pl-12" />
                  </div>
                </div>
                <div>
                  <FieldLabel>Customs Duties</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">{currency}</span>
                    <Input type="number" value={customsDuties} onChange={(e) => setCustomsDuties(e.target.value)} placeholder="0.00" min="0" step="0.01" className="pl-12" />
                  </div>
                </div>
              </div>

              {/* Other charges */}
              {otherCharges.length > 0 && (
                <div className="space-y-2 mb-3">
                  {otherCharges.map((c) => (
                    <div key={c._key} className="flex gap-2 items-center">
                      <Input value={c.name} onChange={(e) => updateOtherCharge(c._key, "name", e.target.value)} placeholder="Charge name" className="flex-1" />
                      <div className="relative w-36 shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">{currency}</span>
                        <Input type="number" value={c.amount} onChange={(e) => updateOtherCharge(c._key, "amount", e.target.value)} placeholder="0.00" min="0" step="0.01" className="pl-12" />
                      </div>
                      <button onClick={() => removeOtherCharge(c._key)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={addOtherCharge}
                className="flex items-center gap-2 text-sm text-[#0B1F3A] font-medium hover:text-[#123D6B] transition-colors">
                <Plus className="w-4 h-4" /> Add other charge
              </button>
            </SectionCard>
          )}

          {/* System Charges */}
          <SectionCard title="System Charges" number={4}>
            {loadingCharges ? (
              <div className="py-6 text-center text-gray-400 text-sm">Loading charges…</div>
            ) : systemChargesList.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No active system charges configured.</p>
            ) : (
              <div className="divide-y divide-gray-100 -mx-5">
                {systemChargesList.map((c) => {
                  const checked = selectedSystemIds.has(c.id);
                  const required = !c.isOptional;
                  return (
                    <label key={c.id} className={`flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50/60 transition-colors ${required ? "cursor-default" : ""}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleSystem(c.id, c.isOptional)}
                        disabled={required}
                        className="w-4 h-4 accent-[#0B1F3A] cursor-pointer disabled:cursor-default" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {c.name}
                          {required && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#0B1F3A] text-white rounded">Required</span>}
                        </p>
                        {c.description && <p className="text-xs text-gray-500 mt-0.5">{c.description}</p>}
                      </div>
                      <span className={`font-semibold text-sm ${checked ? "text-gray-900" : "text-gray-300"}`}>
                        {c.currency} {Number(c.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Margin */}
          <SectionCard title="Margin" number={5}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Margin Type</FieldLabel>
                <div className="flex gap-2">
                  {[{ value: "percentage", label: "% Percentage" }, { value: "fixed", label: "Fixed Amount" }].map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setMarginType(opt.value as "percentage" | "fixed")}
                      className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${marginType === opt.value ? "border-[#0B1F3A] bg-[#0B1F3A] text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel>Margin Value</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
                    {marginType === "percentage" ? "%" : currency}
                  </span>
                  <Input type="number" value={marginValue} onChange={(e) => setMarginValue(e.target.value)} placeholder={marginType === "percentage" ? "e.g. 15" : "e.g. 500"} min="0" step="0.01" className="pl-10" />
                </div>
                {marginType === "percentage" && calc.subtotal > 0 && (
                  <p className="text-xs text-gray-500 mt-1">= {fmt(calc.marginAmount)}</p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Notes + Status */}
          <SectionCard title="Notes & Status" number={6}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Internal Notes</FieldLabel>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                  placeholder="Any additional notes for this quotation…"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] resize-none transition-colors" />
              </div>
              <div>
                <FieldLabel>Quote Status</FieldLabel>
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent to Client</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── Right: Live Summary (sticky) ───────────────────── */}
        <div className="w-72 shrink-0 sticky top-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
            <div className="bg-[#0B1F3A] px-4 py-3">
              <h2 className="text-white font-semibold text-sm">Live Summary</h2>
              <p className="text-blue-300 text-xs mt-0.5">Updates as you type</p>
            </div>
            <div className="p-4 space-y-2.5">
              <SummaryRow label="Manual Costs" value={fmt(calc.manualTotal)} />
              <SummaryRow label="System Charges" value={fmt(calc.systemTotal)} />
              <div className="border-t border-gray-100 pt-2.5">
                <SummaryRow label="Subtotal" value={fmt(calc.subtotal)} bold />
              </div>
              <SummaryRow
                label={`Margin (${marginType === "percentage" ? `${marginValue || 0}%` : "fixed"})`}
                value={`+ ${fmt(calc.marginAmount)}`}
                muted
              />
              <div className="bg-[#0B1F3A] rounded-xl px-3 py-3 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-xs font-semibold uppercase tracking-wide">Total</span>
                  <span className="text-white text-lg font-bold">{fmt(calc.total)}</span>
                </div>
              </div>
            </div>

            {/* Breakdown mini-list */}
            {(parseFloat(freightCost) > 0 || parseFloat(customsDuties) > 0 || selectedSystemIds.size > 0) && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2 mt-3">Line Items</p>
                <div className="space-y-1.5 text-xs">
                  {parseFloat(freightCost) > 0 && <MiniLine label="Freight Cost" value={fmt(parseFloat(freightCost))} />}
                  {parseFloat(customsDuties) > 0 && <MiniLine label="Customs Duties" value={fmt(parseFloat(customsDuties))} />}
                  {otherCharges.filter((c) => parseFloat(c.amount) > 0 && c.name).map((c) => (
                    <MiniLine key={c._key} label={c.name} value={fmt(parseFloat(c.amount) || 0)} />
                  ))}
                  {systemChargesList.filter((c) => selectedSystemIds.has(c.id)).map((c) => (
                    <MiniLine key={c.id} label={c.name} value={`${c.currency} ${Number(c.amount).toFixed(2)}`} system />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button onClick={() => handleSave()}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#0B1F3A] text-white text-sm font-semibold rounded-xl hover:bg-[#123D6B] disabled:opacity-50 transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </button>
            <button onClick={handleGeneratePdf}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#00AEEF] text-white text-sm font-semibold rounded-xl hover:bg-[#0095cc] disabled:opacity-50 transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Save &amp; Generate PDF
            </button>
            <button onClick={() => setLocation("/admin/quotations")}
              className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${bold ? "font-semibold text-gray-900" : muted ? "text-gray-400 italic text-xs" : "text-gray-600"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function MiniLine({ label, value, system }: { label: string; value: string; system?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={`truncate max-w-[55%] ${system ? "text-[#00AEEF]" : "text-gray-500"}`}>{label}</span>
      <span className="text-gray-700 font-medium">{value}</span>
    </div>
  );
}
