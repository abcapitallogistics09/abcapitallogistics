/**
 * Quotation System routes for AB Capital Logistics admin backoffice.
 * All routes require admin session (requireAdmin middleware passed from caller).
 */
import { Router, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import {
  charges,
  quotations,
  quotationItems,
} from "@workspace/db";
import { eq, desc, asc } from "drizzle-orm";
import { validateSession } from "../lib/adminSession";

const router = Router();

// ─── Auth middleware (local copy so this file is self-contained) ────────────
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies;
  const token = cookies?.["admin_session"];
  if (!token || !validateSession(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generate a sequential reference number: ABCL-Q-YYYYMMDD-XXXX */
async function generateRefNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
  const existing = await db
    .select({ refNumber: quotations.refNumber })
    .from(quotations)
    .orderBy(desc(quotations.createdAt))
    .limit(1);
  const last = existing[0]?.refNumber;
  let seq = 1;
  if (last) {
    const parts = last.split("-");
    const lastSeq = parseInt(parts[parts.length - 1] ?? "0", 10);
    if (!isNaN(lastSeq)) seq = lastSeq + 1;
  }
  return `ABCL-Q-${dateStr}-${String(seq).padStart(4, "0")}`;
}

/** Calculate totals from line-item inputs */
function calculateTotals(params: {
  freightCost: number;
  customsDuties: number;
  otherCharges: { name: string; amount: number }[];
  systemCharges: { name: string; amount: number }[];
  marginType: "percentage" | "fixed";
  marginValue: number;
}) {
  const manualTotal =
    params.freightCost +
    params.customsDuties +
    params.otherCharges.reduce((s, c) => s + c.amount, 0);
  const systemTotal = params.systemCharges.reduce((s, c) => s + c.amount, 0);
  const subtotal = manualTotal + systemTotal;
  const marginAmount =
    params.marginType === "percentage"
      ? subtotal * (params.marginValue / 100)
      : params.marginValue;
  const total = subtotal + marginAmount;
  return { manualTotal, systemTotal, subtotal, marginAmount, total };
}

// ─── Seed default charges if none exist ──────────────────────────────────────
async function seedChargesIfEmpty() {
  const existing = await db.select().from(charges).limit(1);
  if (existing.length > 0) return;
  await db.insert(charges).values([
    { name: "Documentation Fee", description: "Bill of lading, certificates, and export docs", amount: "150", currency: "USD", isOptional: false, isDefault: true, editable: false, active: true },
    { name: "Customs Clearance Fee", description: "Customs broker service fee at destination port", amount: "280", currency: "USD", isOptional: false, isDefault: true, editable: false, active: true },
    { name: "Handling Fee", description: "Port handling, loading and unloading charges", amount: "120", currency: "USD", isOptional: true, isDefault: true, editable: false, active: true },
    { name: "Delivery Fee", description: "Last-mile delivery to final destination", amount: "200", currency: "USD", isOptional: true, isDefault: false, editable: false, active: true },
    { name: "Storage / Demurrage", description: "Container or warehouse storage charges", amount: "80", currency: "USD", isOptional: true, isDefault: false, editable: false, active: true },
    { name: "Insurance", description: "Cargo insurance (0.5% of declared value)", amount: "100", currency: "USD", isOptional: true, isDefault: false, editable: false, active: true },
  ]);
}

// ─── Charges CRUD ─────────────────────────────────────────────────────────────

router.get("/admin/charges", requireAdmin, async (_req, res) => {
  await seedChargesIfEmpty();
  const rows = await db.select().from(charges).orderBy(asc(charges.id));
  res.json(rows);
});

router.post("/admin/charges", requireAdmin, async (req, res) => {
  const body = req.body as {
    name: string;
    description?: string;
    amount: string | number;
    currency?: string;
    isOptional?: boolean;
    isDefault?: boolean;
    editable?: boolean;
  };
  const [row] = await db.insert(charges).values({
    name: body.name,
    description: body.description,
    amount: String(body.amount),
    currency: body.currency ?? "USD",
    isOptional: body.isOptional ?? true,
    isDefault: body.isDefault ?? true,
    editable: body.editable ?? false,
    active: true,
  }).returning();
  res.status(201).json(row);
});

router.put("/admin/charges/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params["id"]));
  const body = req.body as Partial<{
    name: string;
    description: string;
    amount: string | number;
    currency: string;
    isOptional: boolean;
    isDefault: boolean;
    editable: boolean;
    active: boolean;
  }>;
  const update: Record<string, unknown> = {};
  if (body.name !== undefined) update.name = body.name;
  if (body.description !== undefined) update.description = body.description;
  if (body.amount !== undefined) update.amount = String(body.amount);
  if (body.currency !== undefined) update.currency = body.currency;
  if (body.isOptional !== undefined) update.isOptional = body.isOptional;
  if (body.isDefault !== undefined) update.isDefault = body.isDefault;
  if (body.editable !== undefined) update.editable = body.editable;
  if (body.active !== undefined) update.active = body.active;
  const [row] = await db.update(charges).set(update).where(eq(charges.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/admin/charges/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params["id"]));
  await db.delete(charges).where(eq(charges.id, id));
  res.status(204).send();
});

// ─── Calculate (live pricing engine) ─────────────────────────────────────────

router.post("/admin/calculate", requireAdmin, async (req, res) => {
  const body = req.body as {
    freightCost: number;
    customsDuties: number;
    otherCharges: { name: string; amount: number }[];
    systemCharges: { name: string; amount: number }[];
    marginType: "percentage" | "fixed";
    marginValue: number;
  };
  const result = calculateTotals({
    freightCost: Number(body.freightCost) || 0,
    customsDuties: Number(body.customsDuties) || 0,
    otherCharges: body.otherCharges ?? [],
    systemCharges: body.systemCharges ?? [],
    marginType: body.marginType ?? "percentage",
    marginValue: Number(body.marginValue) || 0,
  });
  res.json(result);
});

// ─── Quotations CRUD ──────────────────────────────────────────────────────────

router.get("/admin/quotations", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(quotations).orderBy(desc(quotations.createdAt));
  res.json(rows);
});

router.post("/admin/quotations", requireAdmin, async (req, res) => {
  const body = req.body as {
    customerName: string;
    customerEmail?: string;
    customerCompany?: string;
    origin: string;
    destination: string;
    mode: string;
    incoterm?: string;
    cargoType?: string;
    weight?: number;
    volume?: number;
    containerType?: string;
    currency?: string;
    marginType: "percentage" | "fixed";
    marginValue: number;
    freightCost: number;
    customsDuties: number;
    otherCharges: { name: string; amount: number }[];
    systemCharges: { name: string; amount: number }[];
    notes?: string;
    status?: string;
  };

  const totals = calculateTotals({
    freightCost: Number(body.freightCost) || 0,
    customsDuties: Number(body.customsDuties) || 0,
    otherCharges: body.otherCharges ?? [],
    systemCharges: body.systemCharges ?? [],
    marginType: body.marginType ?? "percentage",
    marginValue: Number(body.marginValue) || 0,
  });

  const refNumber = await generateRefNumber();

  const [quote] = await db.insert(quotations).values({
    refNumber,
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerCompany: body.customerCompany,
    origin: body.origin,
    destination: body.destination,
    mode: body.mode,
    incoterm: body.incoterm,
    cargoType: body.cargoType,
    weight: body.weight ? String(body.weight) : undefined,
    volume: body.volume ? String(body.volume) : undefined,
    containerType: body.containerType,
    currency: body.currency ?? "USD",
    marginType: body.marginType ?? "percentage",
    marginValue: String(body.marginValue ?? 0),
    manualTotal: String(totals.manualTotal),
    systemTotal: String(totals.systemTotal),
    subtotal: String(totals.subtotal),
    marginAmount: String(totals.marginAmount),
    totalCost: String(totals.total),
    notes: body.notes,
    status: body.status ?? "draft",
  }).returning();

  // Insert line items
  const items: { quotationId: number; name: string; amount: string; source: string }[] = [];
  if (Number(body.freightCost) > 0)
    items.push({ quotationId: quote.id, name: "Freight Cost", amount: String(body.freightCost), source: "freight" });
  if (Number(body.customsDuties) > 0)
    items.push({ quotationId: quote.id, name: "Customs Duties", amount: String(body.customsDuties), source: "duties" });
  for (const c of body.otherCharges ?? [])
    if (c.amount > 0) items.push({ quotationId: quote.id, name: c.name, amount: String(c.amount), source: "other" });
  for (const c of body.systemCharges ?? [])
    items.push({ quotationId: quote.id, name: c.name, amount: String(c.amount), source: "system" });

  if (items.length > 0) await db.insert(quotationItems).values(items);

  res.status(201).json({ ...quote, items });
});

router.get("/admin/quotations/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params["id"]));
  const [quote] = await db.select().from(quotations).where(eq(quotations.id, id));
  if (!quote) { res.status(404).json({ error: "Not found" }); return; }
  const items = await db.select().from(quotationItems).where(eq(quotationItems.quotationId, id)).orderBy(asc(quotationItems.id));
  res.json({ ...quote, items });
});

router.put("/admin/quotations/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params["id"]));
  const body = req.body as {
    status?: string;
    notes?: string;
    customerName?: string;
    customerEmail?: string;
    customerCompany?: string;
  };
  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (body.status !== undefined) update.status = body.status;
  if (body.notes !== undefined) update.notes = body.notes;
  if (body.customerName !== undefined) update.customerName = body.customerName;
  if (body.customerEmail !== undefined) update.customerEmail = body.customerEmail;
  if (body.customerCompany !== undefined) update.customerCompany = body.customerCompany;
  const [quote] = await db.update(quotations).set(update).where(eq(quotations.id, id)).returning();
  if (!quote) { res.status(404).json({ error: "Not found" }); return; }
  res.json(quote);
});

router.delete("/admin/quotations/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params["id"]));
  await db.delete(quotations).where(eq(quotations.id, id));
  res.status(204).send();
});

// ─── PDF Generation (styled HTML → print to PDF) ─────────────────────────────

router.get("/admin/quotations/:id/pdf", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params["id"]));
  const [quote] = await db.select().from(quotations).where(eq(quotations.id, id));
  if (!quote) { res.status(404).send("Not found"); return; }
  const items = await db.select().from(quotationItems).where(eq(quotationItems.quotationId, id)).orderBy(asc(quotationItems.id));

  const fmt = (n: string | number | null | undefined) =>
    `${quote.currency} ${Number(n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const modeLabel: Record<string, string> = {
    air: "Air Freight",
    sea_lcl: "Sea Freight — LCL",
    sea_fcl: "Sea Freight — FCL",
    clearance_only: "Customs Clearance Only",
  };

  const statusColor: Record<string, string> = {
    draft: "#6b7280",
    sent: "#2563eb",
    accepted: "#16a34a",
    rejected: "#dc2626",
  };

  const itemRows = items.map((item) => `
    <tr>
      <td class="item-name">${item.name}</td>
      <td class="item-source">${item.source === "system" ? "System" : item.source === "freight" ? "Freight" : item.source === "duties" ? "Duties" : "Other"}</td>
      <td class="item-amount">${fmt(item.amount)}</td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Quotation ${quote.refNumber}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a2e; background: #fff; }
  @page { margin: 20mm 18mm; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }

  .page { max-width: 800px; margin: 0 auto; padding: 40px; }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 3px solid #0B1F3A; margin-bottom: 28px; }
  .logo-block h1 { font-size: 22px; font-weight: 800; color: #0B1F3A; letter-spacing: -0.5px; }
  .logo-block p { font-size: 11px; color: #6b7280; margin-top: 3px; }
  .logo-ring { width: 48px; height: 48px; border-radius: 50%; border: 3px solid #00AEEF; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
  .logo-ring svg { width: 28px; height: 28px; fill: #0B1F3A; }
  .quote-meta { text-align: right; }
  .quote-meta .ref { font-size: 20px; font-weight: 700; color: #0B1F3A; }
  .quote-meta .date { font-size: 11px; color: #6b7280; margin-top: 4px; }
  .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: white; background: ${statusColor[quote.status] ?? "#6b7280"}; margin-top: 6px; }

  /* Client + Shipment */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  .section-card { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; }
  .section-card h3 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #00AEEF; margin-bottom: 10px; }
  .field { margin-bottom: 6px; }
  .field label { font-size: 10px; color: #9ca3af; display: block; }
  .field span { font-size: 13px; font-weight: 600; color: #1f2937; }

  /* Cost table */
  .cost-section { margin-bottom: 24px; }
  .cost-section h3 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #00AEEF; margin-bottom: 10px; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: #0B1F3A; }
  thead th { color: white; font-size: 11px; font-weight: 600; padding: 9px 12px; text-align: left; }
  thead th:last-child { text-align: right; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  tbody tr td { padding: 8px 12px; font-size: 12px; border-bottom: 1px solid #e5e7eb; }
  .item-source { color: #9ca3af; font-size: 11px; }
  .item-amount { text-align: right; font-weight: 600; }

  /* Totals */
  .totals { border-top: 2px solid #e5e7eb; padding-top: 12px; margin-top: 4px; }
  .totals-row { display: flex; justify-content: space-between; padding: 4px 12px; font-size: 12px; color: #4b5563; }
  .totals-row.subtotal { font-weight: 600; color: #1f2937; border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 4px; }
  .totals-row.margin { color: #6b7280; font-style: italic; }
  .totals-row.grand-total { background: #0B1F3A; color: white; font-size: 15px; font-weight: 700; border-radius: 6px; padding: 10px 12px; margin-top: 8px; }

  /* Notes */
  .notes-section { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; margin-bottom: 24px; }
  .notes-section h3 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #92400e; margin-bottom: 6px; }
  .notes-section p { font-size: 12px; color: #78350f; line-height: 1.6; }

  /* Footer */
  .footer { border-top: 1px solid #e5e7eb; padding-top: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
  .footer-left { font-size: 10px; color: #9ca3af; line-height: 1.7; }
  .footer-right { font-size: 10px; color: #9ca3af; text-align: right; }
  .validity { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 8px 12px; font-size: 11px; color: #1e40af; margin-bottom: 16px; }

  /* Print button (hidden in print) */
  .print-btn { display: block; margin: 0 auto 24px; padding: 10px 28px; background: #0B1F3A; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
  @media print { .print-btn { display: none !important; } }
</style>
</head>
<body>
<div class="page">
  <button class="print-btn" onclick="window.print()">⬇ Save as PDF / Print</button>

  <!-- Header -->
  <div class="header">
    <div class="logo-block">
      <div class="logo-ring">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4C8.9 3 8 3.9 8 5v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-8-2h4v2h-4V5zm8 13H4V9h16v9z"/>
        </svg>
      </div>
      <h1>AB Capital Logistics</h1>
      <p>3MGF+F5M Bonabéri, Douala, Cameroon</p>
      <p>+237 677-238-818 · info@abcapitallogistics.com</p>
    </div>
    <div class="quote-meta">
      <div class="ref">${quote.refNumber}</div>
      <div class="date">Date: ${new Date(quote.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</div>
      <div class="status-badge">${quote.status.toUpperCase()}</div>
    </div>
  </div>

  <!-- Client + Shipment -->
  <div class="two-col">
    <div class="section-card">
      <h3>Client Information</h3>
      <div class="field"><label>Name</label><span>${quote.customerName}</span></div>
      ${quote.customerCompany ? `<div class="field"><label>Company</label><span>${quote.customerCompany}</span></div>` : ""}
      ${quote.customerEmail ? `<div class="field"><label>Email</label><span>${quote.customerEmail}</span></div>` : ""}
    </div>
    <div class="section-card">
      <h3>Shipment Details</h3>
      <div class="field"><label>Mode</label><span>${modeLabel[quote.mode] ?? quote.mode}</span></div>
      <div class="field"><label>Route</label><span>${quote.origin} → ${quote.destination}</span></div>
      ${quote.incoterm ? `<div class="field"><label>Incoterm</label><span>${quote.incoterm}</span></div>` : ""}
      ${quote.cargoType ? `<div class="field"><label>Cargo Type</label><span>${quote.cargoType}</span></div>` : ""}
      ${quote.weight ? `<div class="field"><label>Weight</label><span>${quote.weight} kg</span></div>` : ""}
      ${quote.volume ? `<div class="field"><label>Volume</label><span>${quote.volume} CBM</span></div>` : ""}
      ${quote.containerType ? `<div class="field"><label>Container</label><span>${quote.containerType}</span></div>` : ""}
    </div>
  </div>

  <!-- Cost Breakdown -->
  <div class="cost-section">
    <h3>Cost Breakdown</h3>
    <table>
      <thead>
        <tr>
          <th style="width:55%">Description</th>
          <th style="width:20%">Type</th>
          <th style="width:25%">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>
    <div class="totals">
      <div class="totals-row"><span>Manual Costs</span><span>${fmt(quote.manualTotal)}</span></div>
      <div class="totals-row"><span>System Charges</span><span>${fmt(quote.systemTotal)}</span></div>
      <div class="totals-row subtotal"><span>Subtotal</span><span>${fmt(quote.subtotal)}</span></div>
      <div class="totals-row margin"><span>Margin (${quote.marginType === "percentage" ? `${quote.marginValue}%` : "Fixed"})</span><span>+ ${fmt(quote.marginAmount)}</span></div>
      <div class="totals-row grand-total"><span>TOTAL</span><span>${fmt(quote.totalCost)}</span></div>
    </div>
  </div>

  ${quote.notes ? `<div class="notes-section"><h3>Notes</h3><p>${quote.notes}</p></div>` : ""}

  <div class="validity">
    ℹ This quotation is valid for 30 days from the date of issue. Rates are subject to change based on market conditions and carrier availability.
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-left">
      <strong>AB Capital Logistics Ltd</strong><br />
      3MGF+F5M Bonabéri, Douala, Cameroon<br />
      Tel: +237 677-238-818<br />
      Email: info@abcapitallogistics.com
    </div>
    <div class="footer-right">
      Generated: ${new Date().toLocaleDateString("en-GB")}<br />
      Ref: ${quote.refNumber}<br />
      <em>Thank you for choosing AB Capital Logistics</em>
    </div>
  </div>
</div>
<script>
  // Auto-open print dialog if ?print=1 is in URL
  if (window.location.search.includes('print=1')) window.onload = () => window.print();
</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

export default router;
