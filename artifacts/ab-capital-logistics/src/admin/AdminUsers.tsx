import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2, Check, Shield, User, ShieldAlert, Users, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useAdminAuth } from "./useAdminAuth";

// ─── Types & Constants ────────────────────────────────────────────────────────

interface AdminUserRecord {
  id: number;
  username: string;
  email: string | null;
  role: string;
  permissions: string; // JSON string
  active: boolean;
  createdAt: string;
}

const PERMISSION_SECTIONS = [
  { key: "dashboard", label: "Dashboard", group: "General" },
  { key: "quotes_crm", label: "Quote Requests", group: "General" },
  { key: "contacts", label: "Contact Messages", group: "General" },
  { key: "blog", label: "Blog Posts", group: "Content" },
  { key: "gallery", label: "Gallery", group: "Content" },
  { key: "jobs", label: "Job Listings", group: "Content" },
  { key: "quotations", label: "Quotation System", group: "Operations" },
  { key: "charges", label: "System Charges", group: "Operations" },
  { key: "ai", label: "AI Assistant", group: "AI" },
];

const GROUPS = ["General", "Content", "Operations", "AI"];

const ROLE_PRESETS: Record<string, string[]> = {
  admin: PERMISSION_SECTIONS.map((s) => s.key),
  staff: ["dashboard", "quotes_crm", "contacts", "quotations"],
};

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  super_admin: { label: "Super Admin", color: "text-purple-700", bg: "bg-purple-50", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  admin: { label: "Admin", color: "text-blue-700", bg: "bg-blue-50", icon: <Shield className="w-3.5 h-3.5" /> },
  staff: { label: "Staff", color: "text-emerald-700", bg: "bg-emerald-50", icon: <User className="w-3.5 h-3.5" /> },
  custom: { label: "Custom", color: "text-amber-700", bg: "bg-amber-50", icon: <Shield className="w-3.5 h-3.5" /> },
};

const EMPTY_FORM = { username: "", email: "", password: "", role: "staff" as string, permissions: [] as string[], active: true };

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminUsers() {
  const { user: currentUser } = useAdminAuth();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const parsePermissions = (p: string): string[] => {
    try { return JSON.parse(p); } catch { return []; }
  };

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/users", { credentials: "include" })
      .then((r) => r.json())
      .then((d: AdminUserRecord[]) => setUsers(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors([]);
    setShowForm(true);
  };

  const openEdit = (u: AdminUserRecord) => {
    setEditingId(u.id);
    setForm({
      username: u.username,
      email: u.email ?? "",
      password: "",
      role: u.role,
      permissions: parsePermissions(u.permissions),
      active: u.active,
    });
    setErrors([]);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); };

  const applyPreset = (role: string) => {
    if (role === "admin" || role === "staff") {
      setForm((f) => ({ ...f, role, permissions: [...(ROLE_PRESETS[role] ?? [])] }));
    } else if (role === "custom") {
      setForm((f) => ({ ...f, role: "custom" }));
    }
  };

  const togglePermission = (key: string) => {
    setForm((f) => ({
      ...f,
      role: "custom",
      permissions: f.permissions.includes(key)
        ? f.permissions.filter((p) => p !== key)
        : [...f.permissions, key],
    }));
  };

  const validate = () => {
    const errs: string[] = [];
    if (!form.username.trim()) errs.push("Username is required");
    if (!editingId && !form.password) errs.push("Password is required for new users");
    if (form.password && form.password.length < 6) errs.push("Password must be at least 6 characters");
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);
    setSaving(true);
    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim() || undefined,
        ...(form.password ? { password: form.password } : {}),
        role: form.role,
        permissions: JSON.stringify(form.permissions),
        active: form.active,
      };
      const url = editingId ? `/api/admin/users/${editingId}` : "/api/admin/users";
      const method = editingId ? "PUT" : "POST";
      const r = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const e = await r.json() as { error: string };
        setErrors([e.error ?? "Failed to save"]);
        return;
      }
      closeForm();
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE", credentials: "include" });
    setUsers((p) => p.filter((u) => u.id !== id));
  };

  const toggleActive = async (u: AdminUserRecord) => {
    await fetch(`/api/admin/users/${u.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      credentials: "include", body: JSON.stringify({ active: !u.active }),
    });
    setUsers((p) => p.map((x) => (x.id === u.id ? { ...x, active: !u.active } : x)));
  };

  const activeCount = users.filter((u) => u.active).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} accounts · {activeCount} active</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-500">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white text-sm rounded-lg hover:bg-[#123D6B] transition-colors font-semibold">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* Current user notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
        <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0" />
        <p className="text-sm text-purple-700">
          You are signed in as <strong>{currentUser?.username}</strong> (Super Admin). This is the only account that can manage users and has unrestricted access to all sections.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total Users", value: users.length, color: "text-gray-900" },
          { label: "Admins", value: users.filter((u) => u.role === "admin").length, color: "text-blue-600" },
          { label: "Staff", value: users.filter((u) => u.role === "staff").length, color: "text-emerald-600" },
          { label: "Custom", value: users.filter((u) => u.role === "custom").length, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* User list */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading…</div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-1">No sub-admin accounts yet</h3>
            <p className="text-sm text-gray-500 mb-4">Create accounts for your team and assign them roles.</p>
            <button onClick={openNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white text-sm rounded-lg font-semibold hover:bg-[#123D6B] transition-colors">
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {users.map((u) => {
              const rc = ROLE_CONFIG[u.role] ?? ROLE_CONFIG.staff!;
              const perms = parsePermissions(u.permissions);
              return (
                <div key={u.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors ${!u.active ? "opacity-50" : ""}`}>
                  <div className="w-10 h-10 rounded-full bg-[#0B1F3A] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {u.username[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{u.username}</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${rc.color} ${rc.bg}`}>
                        {rc.icon}{rc.label}
                      </span>
                      {!u.active && <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium">Disabled</span>}
                    </div>
                    {u.email && <p className="text-xs text-gray-500 mt-0.5">{u.email}</p>}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {perms.slice(0, 5).map((p) => (
                        <span key={p} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">
                          {PERMISSION_SECTIONS.find((s) => s.key === p)?.label ?? p}
                        </span>
                      ))}
                      {perms.length > 5 && <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded">+{perms.length - 5} more</span>}
                      {perms.length === 0 && u.role !== "admin" && <span className="text-[10px] text-gray-400 italic">No sections assigned</span>}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 shrink-0">
                    {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleActive(u)} title={u.active ? "Disable" : "Enable"}
                      className={`p-1.5 rounded-lg transition-colors ${u.active ? "text-emerald-500 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}>
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B1F3A] hover:bg-gray-100 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(u.id, u.username)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Create / Edit Slide-over ──────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={closeForm} />
          <div className="w-[480px] bg-white shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-[#0B1F3A]">
              <h2 className="font-bold text-white text-lg">{editingId ? "Edit User" : "New User"}</h2>
              <button onClick={closeForm} className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 space-y-1">
                  {errors.map((e) => <p key={e}>{e}</p>)}
                </div>
              )}

              {/* Basic info */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Account Details</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Username <span className="text-red-500">*</span></label>
                    <input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                      placeholder="e.g. john.doe"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="john@example.com"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Password {editingId ? <span className="font-normal text-gray-400">(leave blank to keep current)</span> : <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                        placeholder={editingId ? "New password (optional)" : "Minimum 6 characters"}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] pr-10"
                      />
                      <button type="button" onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-[#0B1F3A]" />
                    Account active (user can sign in)
                  </label>
                </div>
              </div>

              {/* Role presets */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Role</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { value: "admin", label: "Admin", desc: "All sections", icon: <Shield className="w-4 h-4" /> },
                    { value: "staff", label: "Staff", desc: "Quotes & contacts", icon: <User className="w-4 h-4" /> },
                    { value: "custom", label: "Custom", desc: "Choose below", icon: <Shield className="w-4 h-4" /> },
                  ].map((r) => (
                    <button key={r.value} type="button" onClick={() => applyPreset(r.value)}
                      className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${form.role === r.value ? "border-[#0B1F3A] bg-[#0B1F3A] text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      {r.icon}{r.label}
                      <span className={`text-[10px] font-normal ${form.role === r.value ? "text-blue-200" : "text-gray-400"}`}>{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
                  Section Access <span className="font-normal text-gray-400 normal-case">({form.permissions.length} selected)</span>
                </p>
                <div className="space-y-4">
                  {GROUPS.map((group) => {
                    const groupSections = PERMISSION_SECTIONS.filter((s) => s.group === group);
                    return (
                      <div key={group}>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{group}</p>
                        <div className="space-y-1">
                          {groupSections.map((s) => (
                            <label key={s.key} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                              <input type="checkbox" checked={form.permissions.includes(s.key)} onChange={() => togglePermission(s.key)} className="w-4 h-4 accent-[#0B1F3A]" />
                              <span className="text-sm text-gray-700 font-medium">{s.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={closeForm} className="flex-1 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0B1F3A] text-white text-sm rounded-xl hover:bg-[#123D6B] disabled:opacity-40 transition-colors font-semibold">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? "Save Changes" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
