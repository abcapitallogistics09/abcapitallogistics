import { useEffect } from "react";
import { useLocation } from "wouter";
import { ShieldX } from "lucide-react";
import { useAdminAuth } from "./useAdminAuth";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import AdminQuotes from "./AdminQuotes";
import AdminContacts from "./AdminContacts";
import AdminBlog from "./AdminBlog";
import AdminBlogEdit from "./AdminBlogEdit";
import AdminJobs from "./AdminJobs";
import AdminJobEdit from "./AdminJobEdit";
import AdminGallery from "./AdminGallery";
import AdminGalleryEdit from "./AdminGalleryEdit";
import AdminAIConversations from "./AdminAIConversations";
import AdminAITraining from "./AdminAITraining";
import AdminQuotationsList from "./AdminQuotationsList";
import AdminCreateQuote from "./AdminCreateQuote";
import AdminCharges from "./AdminCharges";
import AdminUsers from "./AdminUsers";

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <ShieldX className="w-8 h-8 text-red-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
      <p className="text-gray-500 max-w-sm text-sm">
        You don't have permission to view this section. Contact your administrator to request access.
      </p>
    </div>
  );
}

function Guard({ permission, children }: { permission: string; children: React.ReactNode }) {
  const { hasPermission } = useAdminAuth();
  if (!hasPermission(permission)) return <AccessDenied />;
  return <>{children}</>;
}

export default function AdminApp() {
  const { user, isLoading } = useAdminAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/admin/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const renderPage = () => {
    if (location === "/admin" || location === "/admin/") return <Guard permission="dashboard"><AdminDashboard /></Guard>;
    if (location === "/admin/quotes") return <Guard permission="quotes_crm"><AdminQuotes /></Guard>;
    if (location === "/admin/contacts") return <Guard permission="contacts"><AdminContacts /></Guard>;
    if (location === "/admin/blog") return <Guard permission="blog"><AdminBlog /></Guard>;
    if (location === "/admin/blog/new") return <Guard permission="blog"><AdminBlogEdit /></Guard>;
    if (location === "/admin/jobs") return <Guard permission="jobs"><AdminJobs /></Guard>;
    if (location === "/admin/jobs/new") return <Guard permission="jobs"><AdminJobEdit /></Guard>;
    if (location === "/admin/gallery") return <Guard permission="gallery"><AdminGallery /></Guard>;
    if (location === "/admin/gallery/new") return <Guard permission="gallery"><AdminGalleryEdit /></Guard>;
    if (location === "/admin/ai/conversations") return <Guard permission="ai"><AdminAIConversations /></Guard>;
    if (location === "/admin/ai/training") return <Guard permission="ai"><AdminAITraining /></Guard>;
    if (location === "/admin/quotations") return <Guard permission="quotations"><AdminQuotationsList /></Guard>;
    if (location === "/admin/quotations/new") return <Guard permission="quotations"><AdminCreateQuote /></Guard>;
    if (location === "/admin/charges") return <Guard permission="charges"><AdminCharges /></Guard>;
    if (location === "/admin/users") return <Guard permission="users"><AdminUsers /></Guard>;

    const blogEditMatch = location.match(/^\/admin\/blog\/(\d+)\/edit$/);
    if (blogEditMatch) return <Guard permission="blog"><AdminBlogEdit id={blogEditMatch[1]} /></Guard>;

    const jobEditMatch = location.match(/^\/admin\/jobs\/(\d+)\/edit$/);
    if (jobEditMatch) return <Guard permission="jobs"><AdminJobEdit id={jobEditMatch[1]} /></Guard>;

    const galleryEditMatch = location.match(/^\/admin\/gallery\/(\d+)\/edit$/);
    if (galleryEditMatch) return <Guard permission="gallery"><AdminGalleryEdit id={galleryEditMatch[1]} /></Guard>;

    // Default: redirect to first accessible section
    return <Guard permission="dashboard"><AdminDashboard /></Guard>;
  };

  return <AdminLayout>{renderPage()}</AdminLayout>;
}
