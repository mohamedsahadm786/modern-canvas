import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Portfolio from "@/pages/Portfolio";
import NotFound from "@/pages/not-found";
import AnimatedBackground from "@/components/AnimatedBackground";
import CustomCursor from "@/components/CustomCursor";
import { useLenis } from "@/hooks/useLenis";
import { useClickRipple } from "@/hooks/useClickRipple";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppInner() {
  useLenis();
  useClickRipple();

  return (
    <>
      <AnimatedBackground />
      <CustomCursor />
      <div className="min-h-screen relative" style={{ zIndex: 1 }}>
        <Router />
        <Toaster />
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="night"
      themes={['dark', 'light', 'night']}
      enableSystem={false}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppInner />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;