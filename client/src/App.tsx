import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Success from "@/pages/success";
import Dashboard from "@/pages/dashboard";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

function Navigation() {
  return (
    <nav className="bg-background border-b p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-lg font-semibold">NUSU Dental Feedback</a>
        </Link>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <a className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </a>
          </Link>
        </Button>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/success" component={Success} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;