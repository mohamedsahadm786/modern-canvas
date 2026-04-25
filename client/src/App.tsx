import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
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

  return (
    <>
      {/* Layer 1 (back): 2D code-rain + neural-net canvas */}
      <AnimatedBackground />

      {/* Layer 2: Three.js 3D orbs float on top of the code rain.
          Canvas has alpha:true so the rain shows through the transparent gaps. */}
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      {/* Layer 3 (front): page content + cursor */}
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