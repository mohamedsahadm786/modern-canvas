import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const themes = ['night', 'dark', 'light'] as const;
type Theme = (typeof themes)[number];

const themeConfig: Record<Theme, { icon: React.ComponentType<{ className?: string }>; label: string; title: string }> = {
  night: { icon: Zap,  label: 'Night', title: 'Switch to Dark mode'  },
  dark:  { icon: Moon, label: 'Dark',  title: 'Switch to Light mode' },
  light: { icon: Sun,  label: 'Light', title: 'Switch to Night mode' },
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const current = (themes.includes(theme as Theme) ? theme : 'dark') as Theme;
  const next = themes[(themes.indexOf(current) + 1) % themes.length];
  const { icon: Icon, label, title } = themeConfig[current];

  const cycleTheme = () => {
    setTheme(next);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      title={title}
      data-testid="theme-toggle"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50
                 text-muted-foreground hover:text-foreground hover:border-primary/50
                 transition-all duration-300 font-mono text-xs"
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
