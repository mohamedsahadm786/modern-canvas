import { Switch, Route } from "wouter";
import { lazy, Suspense, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Portfolio from "@/pages/Portfolio";
import NotFound from "@/pages/not-found";
import CustomCursor from "@/components/CustomCursor";
import { useLenis } from "@/hooks/useLenis";
import { useClickRipple } from "@/hooks/useClickRipple";
import { initScrollSync } from "@/lib/scrollSync";

// Lazy-load the Three.js canvas (~600 KB) so it doesn't block first paint
const Scene3D = lazy(() => import("@/components/Scene3D"));

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
  useEffect(() => initScrollSync(), []);

  return (
    <>
      {/* Layer 1: Three.js canvas — 3D matrix rain + orbs + starfield (Phase 2) */}
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      {/* Layer 2 (front): page content + cursor */}
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
      themes={['dark', 'night']}
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