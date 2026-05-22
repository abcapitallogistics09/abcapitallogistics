import { useLocation } from "wouter";
import {
  LayoutDashboard, FileText, Mail, Briefcase, Newspaper, LogOut,
  ChevronRight, Package, Images, MessageCircle, Brain,
  Receipt, DollarSign, Users
} from "lucide-react";
import { useAdminAuth } from "./useAdminAuth";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  permission: string;
}

const mainNavItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, permission: "dashboard" },
  { href: "/admin/quotes", label: "Quote Requests", icon: FileText, permission: "quotes_crm" },
  { href: "/admin/contacts", label: "Contact Messages", icon: Mail, permission: "contacts" },
  { href: "/admin/blog", label: "Blog Posts", icon: Newspaper, permission: "blog" },
  { href: "/admin/gallery", label: "Gallery", icon: Images, permission: "gallery" },
  { href: "/admin/jobs", label: "Job Listings", icon: Briefcase, permission: "jobs" },
];

const quotationNavItems: NavItem[] = [
  { href: "/admin/quotations", label: "Quotations", icon: Receipt, permission: "quotations" },
  { href: "/admin/charges", label: "System Charges", icon: DollarSign, permission: "charges" },
];

const aiNavItems: NavItem[] = [
  { href: "/admin/ai/conversations", label: "AI Conversations", icon: MessageCircle, permission: "ai" },
  { href: "/admin/ai/training", label: "AI Training", icon: Brain, permission: "ai" },
];

const userNavItems: NavItem[] = [
  { href: "/admin/users", label: "User Management", icon: Users, permission: "users" },
];

function NavButton({ item, location, setLocation, hasPermission }: {
  item: NavItem;
  location: string;
  setLocation: (p: string) => void;
  hasPermission: (s: string) => boolean;
}) {
  if (!hasPermission(item.permission)) return null;
  const isActive = item.exact ? location === item.href : location.startsWith(item.href);
  return (
    <button
      onClick={() => setLocation(item.href)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
        isActive ? "bg-[#00AEEF] text-white" : "text-blue-200 hover:bg-white/10 hover:text-white"
      }`}
    >
      <item.icon className="w-4 h-4 shrink-0" />
      {item.label}
      {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
    </button>
  );
}

function NavSection({ label, items, location, setLocation, hasPermission }: {
  label: string;
  items: NavItem[];
  location: string;
  setLocation: (p: string) => void;
  hasPermission: (s: string) => boolean;
}) {
  const visible = items.filter((i) => hasPermission(i.permission));
  if (visible.length === 0) return null;
  return (
    <>
      <div className="pt-3 pb-1">
        <p className="px-3 text-[10px] uppercase tracking-widest font-semibold text-blue-400/70 mb-1">{label}</p>
      </div>
      {items.map((item) => (
        <NavButton key={item.href} item={item} location={location} setLocation={setLocation} hasPermission={hasPermission} />
      ))}
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout, hasPermission } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1F3A] text-white flex flex-col shrink-0 fixed top-0 left-0 h-full z-30">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00AEEF] flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">AB Capital</p>
              <p className="text-xs text-blue-300">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => (
            <NavButton key={item.href} item={item} location={location} setLocation={setLocation} hasPermission={hasPermission} />
          ))}
          <NavSection label="Quotation System" items={quotationNavItems} location={location} setLocation={setLocation} hasPermission={hasPermission} />
          <NavSection label="AI Assistant" items={aiNavItems} location={location} setLocation={setLocation} hasPermission={hasPermission} />
          <NavSection label="Administration" items={userNavItems} location={location} setLocation={setLocation} hasPermission={hasPermission} />
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#00AEEF]/20 flex items-center justify-center text-[#00AEEF] font-bold text-sm">
              {user?.username?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{user?.username}</p>
              <p className="text-xs text-blue-300 capitalize">{user?.role?.replace("_", " ") ?? "Admin"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-blue-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
