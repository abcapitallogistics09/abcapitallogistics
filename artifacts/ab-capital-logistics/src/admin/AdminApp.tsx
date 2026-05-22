import { useEffect } from "react";
import { useLocation } from "wouter";
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
    // Dashboard
    if (location === "/admin" || location === "/admin/") return <AdminDashboard />;

    // CRM
    if (location === "/admin/quotes") return <AdminQuotes />;
    if (location === "/admin/contacts") return <AdminContacts />;

    // Blog
    if (location === "/admin/blog") return <AdminBlog />;
    if (location === "/admin/blog/new") return <AdminBlogEdit />;

    // Jobs
    if (location === "/admin/jobs") return <AdminJobs />;
    if (location === "/admin/jobs/new") return <AdminJobEdit />;

    // Gallery
    if (location === "/admin/gallery") return <AdminGallery />;
    if (location === "/admin/gallery/new") return <AdminGalleryEdit />;

    // AI
    if (location === "/admin/ai/conversations") return <AdminAIConversations />;
    if (location === "/admin/ai/training") return <AdminAITraining />;

    // Quotation System
    if (location === "/admin/quotations") return <AdminQuotationsList />;
    if (location === "/admin/quotations/new") return <AdminCreateQuote />;
    if (location === "/admin/charges") return <AdminCharges />;

    // Dynamic routes
    const blogEditMatch = location.match(/^\/admin\/blog\/(\d+)\/edit$/);
    if (blogEditMatch) return <AdminBlogEdit id={blogEditMatch[1]} />;

    const jobEditMatch = location.match(/^\/admin\/jobs\/(\d+)\/edit$/);
    if (jobEditMatch) return <AdminJobEdit id={jobEditMatch[1]} />;

    const galleryEditMatch = location.match(/^\/admin\/gallery\/(\d+)\/edit$/);
    if (galleryEditMatch) return <AdminGalleryEdit id={galleryEditMatch[1]} />;

    const quotationViewMatch = location.match(/^\/admin\/quotations\/(\d+)$/);
    if (quotationViewMatch) return <AdminQuotationsList />;

    return <AdminDashboard />;
  };

  return <AdminLayout>{renderPage()}</AdminLayout>;
}
