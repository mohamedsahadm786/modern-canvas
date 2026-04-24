import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: ".5625rem", /* 9px */
        md: ".375rem", /* 6px */
        sm: ".1875rem", /* 3px */
      },
      colors: {
        // Flat / base colors (regular buttons)
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          border: "hsl(var(--card-border) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
          border: "hsl(var(--popover-border) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          border: "var(--primary-border)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          border: "var(--secondary-border)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
          border: "var(--muted-border)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          border: "var(--accent-border)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          border: "var(--destructive-border)",
        },
        ring: "hsl(var(--ring) / <alpha-value>)",
        chart: {
          "1": "hsl(var(--chart-1) / <alpha-value>)",
          "2": "hsl(var(--chart-2) / <alpha-value>)",
          "3": "hsl(var(--chart-3) / <alpha-value>)",
          "4": "hsl(var(--chart-4) / <alpha-value>)",
          "5": "hsl(var(--chart-5) / <alpha-value>)",
        },
        sidebar: {
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
        },
        "sidebar-primary": {
          DEFAULT: "hsl(var(--sidebar-primary) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          border: "var(--sidebar-primary-border)",
        },
        "sidebar-accent": {
          DEFAULT: "hsl(var(--sidebar-accent) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "var(--sidebar-accent-border)"
        },
        status: {
          online: "rgb(34 197 94)",
          away: "rgb(245 158 11)",
          busy: "rgb(239 68 68)",
          offline: "rgb(156 163 175)",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["'JetBrains Mono'", "var(--font-mono)"],
      },
      colors: {
        neon: {
          cyan: "#00d4ff",
          green: "#00ff41",
          purple: "#7c3aed",
        },
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.15)",
        "neon-green": "0 0 20px rgba(0, 255, 65, 0.4), 0 0 40px rgba(0, 255, 65, 0.15)",
        "neon-purple": "0 0 20px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.15)",
        "neon-cyan-sm": "0 0 8px rgba(0, 212, 255, 0.6)",
        "card-neon": "0 0 0 1px rgba(0, 212, 255, 0.3), 0 4px 20px rgba(0, 212, 255, 0.08)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glitch-1": {
          "0%, 100%": { clipPath: "inset(0 0 98% 0)", transform: "translate(-3px, 0)" },
          "20%":       { clipPath: "inset(40% 0 50% 0)", transform: "translate(3px, 0)" },
          "40%":       { clipPath: "inset(80% 0 5% 0)",  transform: "translate(-2px, 0)" },
          "60%":       { clipPath: "inset(20% 0 70% 0)", transform: "translate(2px, 0)" },
          "80%":       { clipPath: "inset(60% 0 20% 0)", transform: "translate(-3px, 0)" },
        },
        "glitch-2": {
          "0%, 100%": { clipPath: "inset(95% 0 0 0)",   transform: "translate(3px, 0)" },
          "25%":      { clipPath: "inset(10% 0 85% 0)", transform: "translate(-3px, 0)" },
          "50%":      { clipPath: "inset(60% 0 30% 0)", transform: "translate(2px, 0)" },
          "75%":      { clipPath: "inset(30% 0 60% 0)", transform: "translate(-2px, 0)" },
        },
        "scan-line": {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "pulse-neon": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0,212,255,0.4), 0 0 0 1px rgba(0,212,255,0.2)" },
          "50%":      { boxShadow: "0 0 20px rgba(0,212,255,0.8), 0 0 0 1px rgba(0,212,255,0.5)" },
        },
        "border-orbit": {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "click-expand": {
          from: { width: "0px", height: "0px", opacity: "1" },
          to:   { width: "80px", height: "80px", opacity: "0" },
        },
        "node-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%":      { transform: "scale(1.5)", opacity: "0.3" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        "type-cursor": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
      },
      animation: {
        "accordion-down":  "accordion-down 0.2s ease-out",
        "accordion-up":    "accordion-up 0.2s ease-out",
        "glitch-1":        "glitch-1 3s infinite linear",
        "glitch-2":        "glitch-2 2.5s infinite linear",
        "glitch-fast":     "glitch-1 0.15s infinite linear",
        "scan-line":       "scan-line 3s linear infinite",
        "pulse-neon":      "pulse-neon 2s ease-in-out infinite",
        "border-orbit":    "border-orbit 4s ease infinite",
        "click-expand":    "click-expand 0.6s ease-out forwards",
        "node-pulse":      "node-pulse 2s ease-in-out infinite",
        "float":           "float 3s ease-in-out infinite",
        "type-cursor":     "type-cursor 1s step-end infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
