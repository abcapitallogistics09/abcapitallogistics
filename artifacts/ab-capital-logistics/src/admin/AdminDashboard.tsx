import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { FileText, Mail, Newspaper, Briefcase, TrendingUp, ArrowRight } from "lucide-react";

interface Stats {
  quotes: { total: number; week: number };
  contacts: { total: number; week: number };
  blogPosts: { total: number };
  jobs: { active: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then((r) => r.json())
      .then((d: Stats) => setStats(d))
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "Quote Requests",
      icon: FileText,
      total: stats?.quotes.total ?? "—",
      sub: stats ? `+${stats.quotes.week} this week` : "Loading...",
      color: "bg-blue-500",
      href: "/admin/quotes",
    },
    {
      label: "Contact Messages",
      icon: Mail,
      total: stats?.contacts.total ?? "—",
      sub: stats ? `+${stats.contacts.week} this week` : "Loading...",
      color: "bg-emerald-500",
      href: "/admin/contacts",
    },
    {
      label: "Blog Posts",
      icon: Newspaper,
      total: stats?.blogPosts.total ?? "—",
      sub: "DB-managed posts",
      color: "bg-violet-500",
      href: "/admin/blog",
    },
    {
      label: "Active Jobs",
      icon: Briefcase,
      total: stats?.jobs.active ?? "—",
      sub: "Open positions",
      color: "bg-orange-500",
      href: "/admin/jobs",
    },
  ];

  const quickLinks = [
    { label: "View new quote requests", href: "/admin/quotes", icon: FileText },
    { label: "Read contact messages", href: "/admin/contacts", icon: Mail },
    { label: "Write a new blog post", href: "/admin/blog/new", icon: Newspaper },
    { label: "Add a job opening", href: "/admin/jobs/new", icon: Briefcase },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here's what's happening on your site.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {cards.map(({ label, icon: Icon, total, sub, color, href }) => (
          <button
            key={label}
            onClick={() => setLocation(href)}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{total}</p>
            <p className="text-sm font-medium text-gray-700 mb-0.5">{label}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => setLocation(href)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-[#0B1F3A] hover:bg-[#0B1F3A]/5 transition-colors group text-left"
            >
              <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#0B1F3A]" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#0B1F3A] flex-1">{label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#0B1F3A] opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
