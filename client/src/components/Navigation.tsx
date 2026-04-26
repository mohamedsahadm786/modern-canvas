import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setIsMobileMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Home',       id: 'hero'       },
    { label: 'About',      id: 'about'      },
    { label: 'Education',  id: 'education'  },
    { label: 'Projects',   id: 'projects'   },
    { label: 'Experience', id: 'experience' },
    { label: 'Skills',     id: 'skills'     },
    { label: 'Contact',    id: 'contact'    },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/90 backdrop-blur-md border-b border-primary/20 shadow-lg shadow-primary/5'
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">

            {/* Brand */}
            <button
              onClick={() => scrollToSection('hero')}
              className="text-xl font-bold font-mono text-primary hover-elevate px-3 py-2 rounded-lg transition-colors tracking-widest"
              data-testid="nav-brand"
            >
              SAHAD
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium font-mono text-primary/80 hover:text-primary transition-colors hover-elevate px-3 py-2 rounded-lg tracking-wide"
                  data-testid={`nav-link-${item.id}`}
                >
                  {item.label}
                </button>
              ))}
              <ThemeToggle />
            </div>

            {/* Mobile: theme toggle + hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="nav-mobile-toggle"
                aria-label="Toggle mobile menu"
                className="relative z-[60]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileMenuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0,   opacity: 1 }}
                      exit={{   rotate:  90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90,  opacity: 0 }}
                      animate={{ rotate: 0,   opacity: 1 }}
                      exit={{   rotate: -90,  opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile full-screen drawer ───────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              className="fixed top-0 right-0 bottom-0 z-50 md:hidden flex flex-col"
              style={{
                width: 'min(80vw, 320px)',
                background: 'hsl(var(--background) / 0.97)',
                backdropFilter: 'blur(16px)',
                borderLeft: '1px solid rgba(0,212,255,0.15)',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-primary/10">
                <span className="font-mono text-sm text-primary/60 tracking-widest uppercase">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto py-6 px-4">
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left px-4 py-4 rounded-xl font-mono text-base font-semibold text-foreground/80 hover:text-primary hover:bg-primary/8 transition-all duration-200 tracking-wide flex items-center gap-3"
                    data-testid={`nav-mobile-link-${item.id}`}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.045, duration: 0.22 }}
                  >
                    <span className="text-primary/40 text-xs font-mono">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </motion.button>
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="px-6 py-5 border-t border-primary/10">
                <p className="font-mono text-xs text-muted-foreground/50 text-center tracking-widest">
                  SAHAD · DATA SCIENTIST
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
