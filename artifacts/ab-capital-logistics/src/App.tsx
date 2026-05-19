import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Tracking from "@/pages/tracking";
import Quote from "@/pages/quote";
import Services from "@/pages/services";
import ServiceDetail from "@/pages/service-detail";
import Industries from "@/pages/industries";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import FAQ from "@/pages/faq";
import Careers from "@/pages/careers";
import GlobalNetwork from "@/pages/global-network";
import ShipAgency from "@/pages/ship-agency";
import Gallery from "@/pages/gallery";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import AdminLogin from "@/admin/AdminLogin";
import AdminApp from "@/admin/AdminApp";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/:rest*" component={AdminApp} />
      <Route path="/admin" component={AdminApp} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/tracking" component={Tracking} />
            <Route path="/quote" component={Quote} />
            <Route path="/services" component={Services} />
            <Route path="/services/:slug" component={ServiceDetail} />
            <Route path="/industries" component={Industries} />
            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogPost} />
            <Route path="/faq" component={FAQ} />
            <Route path="/careers" component={Careers} />
            <Route path="/global-network" component={GlobalNetwork} />
            <Route path="/ship-agency" component={ShipAgency} />
            <Route path="/gallery" component={Gallery} />
            <Route path="/privacy" component={PrivacyPolicy} />
            <Route path="/terms" component={TermsOfService} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
