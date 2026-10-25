import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import HudPanels from "@/components/landing/HudPanels";
import { Sparkles, ArrowRight, Zap, Brain, BarChart3, Shield, Globe, Activity } from "lucide-react";

const Scene3D = lazy(() => import("@/components/landing/Scene3D"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus AI — The AI Marketing Operating System" },
      {
        name: "description",
        content:
          "An autonomous AI marketing agency running strategy, content, SEO, ads, and analytics — orchestrated by a single intelligent core.",
      },
      { property: "og:title", content: "Nexus AI — The AI Marketing OS" },
      {
        property: "og:description",
        content:
          "A next-generation AI operating system running an entire digital marketing agency.",
      },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: Brain, label: "Strategy AI", desc: "Quarterly GTM planning" },
  { icon: BarChart3, label: "Analytics AI", desc: "Real-time attribution" },
  { icon: Zap, label: "Automation AI", desc: "312 active workflows" },
  { icon: Globe, label: "SEO AI", desc: "12.4K keywords tracked" },
  { icon: Shield, label: "Brand AI", desc: "100% on-brand output" },
  { icon: Activity, label: "Ads AI", desc: "7.8× ROAS delivered" },
];

const STATS = [
  { value: "12", label: "AI Agents", suffix: "" },
  { value: "98.4", label: "Uptime", suffix: "%" },
  { value: "2.4M", label: "Tokens / sec", suffix: "" },
  { value: "24/7", label: "Always running", suffix: "" },
];

function Index() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030305] text-white font-sans">
      {/* ── Layered atmosphere ───────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,122,0,0.18), transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(255,80,0,0.09), transparent 70%), radial-gradient(ellipse 50% 60% at 0% 50%, rgba(255,200,100,0.05), transparent 70%)",
        }}
      />

      {/* ── Fine grid ──────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,140,60,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,140,60,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Corner vignette ────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* ── Diagonal light shafts ──────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-0 h-[80vh] w-[180px] -translate-x-[60%] -rotate-12 opacity-[0.07]"
          style={{
            background: "linear-gradient(180deg, transparent, #FF7A00, transparent)",
            filter: "blur(50px)",
          }}
        />
        <div
          className="absolute left-1/2 top-0 h-[70vh] w-[120px] translate-x-[10%] rotate-[20deg] opacity-[0.04]"
          style={{
            background: "linear-gradient(180deg, transparent, #fff, transparent)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* ── Horizontal scan line ───────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,122,0,0.95), transparent)",
          animation: "scan 9s linear infinite",
        }}
      />

      {/* ── 3-D Canvas ─────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </div>

      {/* ── HUD panels ─────────────────────────────────────────── */}
      <HudPanels />

      {/* ═══════════════════════════════════════════════════════════
          FOREGROUND UI
      ═══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* ── NAV ─────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between px-6 py-5 sm:px-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative animate-float-glow rounded-xl">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#FF7A00] via-[#FFB300] to-[#FFC857]" />
              <div className="absolute inset-0 h-8 w-8 rounded-xl border border-white/20" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-widest">NEXUS</span>
              <span className="text-sm font-bold tracking-widest text-white/35">.AI</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.15em] text-white/50 md:flex">
            <Link
              to="/dashboard"
              className="relative py-1 transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#FF7A00] after:transition-all hover:after:w-full"
            >
              Agents
            </Link>
            <Link
              to="/dashboard"
              className="relative py-1 transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#FF7A00] after:transition-all hover:after:w-full"
            >
              Control Center
            </Link>
            <span className="relative py-1 text-white/30 cursor-not-allowed">Pricing (Custom)</span>
            <span className="relative py-1 text-white/30 cursor-not-allowed">Docs (v3.0)</span>
          </nav>

          {/* Live indicator + CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] text-white/50 backdrop-blur sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              System Online
            </div>
            <Link
              to="/dashboard"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#FF7A00]/40 bg-[#FF7A00]/10 px-5 py-2 text-xs font-semibold text-white backdrop-blur transition hover:border-[#FF7A00]/80 hover:bg-[#FF7A00]/20 hover:shadow-[0_0_30px_rgba(255,122,0,0.4)]"
            >
              Enter Control Center
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </header>

        {/* ── HERO ────────────────────────────────────────────────── */}
        <main className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
          {/* Dark backdrop behind text */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-[80px]"
            style={{ background: "radial-gradient(ellipse, rgba(4,4,6,0.9) 30%, transparent 70%)" }}
          />

          {/* Headline */}
          <h1
            className="animate-fade-in mt-6 sm:mt-8 max-w-5xl text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black leading-[1.05] sm:leading-[1.02] tracking-tight px-1"
            style={{
              animationDelay: "100ms",
              animationFillMode: "both",
              textShadow: "0 4px 40px rgba(0,0,0,0.8)",
            }}
          >
            The AI Operating System
            <br />
            <span
              className="animate-aurora inline-block bg-gradient-to-r from-[#FF7A00] via-[#FFD700] to-[#FF4500] bg-clip-text text-transparent pb-1"
              style={{
                filter: "drop-shadow(0 0 40px rgba(255,122,0,0.5))",
                backgroundSize: "300% 100%",
                animation: "aurora 4s ease infinite",
              }}
            >
              for Modern Marketing
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            className="animate-fade-in mt-5 sm:mt-6 max-w-2xl text-sm xs:text-base leading-relaxed text-white/60 sm:text-lg px-2"
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            Twelve specialized AI agents — strategy, content, SEO, ads, analytics — orchestrated by
            a single intelligent core.{" "}
            <span className="text-white/85 font-medium">Your entire agency, autonomous, 24/7.</span>
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-in mt-8 sm:mt-10 flex flex-col items-center gap-3.5 sm:gap-4 sm:flex-row w-full sm:w-auto px-4 sm:px-0"
            style={{ animationDelay: "300ms", animationFillMode: "both" }}
          >
            <Link
              to="/dashboard"
              className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#FF7A00] via-[#FF9540] to-[#FFB300] px-8 py-3.5 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,122,0,0.5)] transition hover:shadow-[0_0_60px_rgba(255,122,0,0.8)] hover:scale-105"
            >
              <span className="relative z-10">Launch Nexus</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
              <span
                aria-hidden
                className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                style={{ animation: "shimmer 2.5s ease-in-out infinite" }}
              />
            </Link>
            <Link
              to="/dashboard"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-8 py-3.5 text-sm font-medium text-white/80 backdrop-blur-md transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
            >
              <Activity className="h-4 w-4 text-emerald-400" />
              Watch it run live
            </Link>
          </div>

          {/* Live stat strip (2x2 on mobile, 4 cols on desktop) */}
          <div
            className="animate-fade-in mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 w-full max-w-sm sm:max-w-3xl overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md"
            style={{ animationDelay: "420ms", animationFillMode: "both" }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`group flex flex-col items-center justify-center gap-0.5 px-4 sm:px-8 py-3.5 sm:py-4 transition hover:bg-white/[0.04] ${
                  i % 2 === 0 ? "border-r border-white/[0.06]" : ""
                } ${i < 2 ? "border-b sm:border-b-0 border-white/[0.06]" : ""} ${
                  i === 1 ? "sm:border-r sm:border-white/[0.06]" : ""
                } ${i === 2 ? "sm:border-r sm:border-white/[0.06]" : ""}`}
              >
                <span className="text-gradient-orange text-xl sm:text-2xl font-black tracking-tight">
                  {s.value}
                  {s.suffix}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-white/40">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Feature chips */}
          <div
            className="animate-fade-in mt-8 flex flex-wrap items-center justify-center gap-2"
            style={{ animationDelay: "500ms", animationFillMode: "both" }}
          >
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 backdrop-blur transition hover:border-[#FF7A00]/30 hover:bg-[#FF7A00]/[0.06]"
              >
                <Icon className="h-3.5 w-3.5 text-[#FFB37A] transition group-hover:text-[#FF7A00]" />
                <span className="text-[11px] font-medium text-white/70 transition group-hover:text-white">
                  {label}
                </span>
                <span className="hidden text-[10px] text-white/35 sm:inline">· {desc}</span>
              </div>
            ))}
          </div>
        </main>

        {/* ── FOOTER ──────────────────────────────────────────────── */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-white/35 sm:px-12 text-center sm:text-left">
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            System online · 12 agents active
          </span>
          <span className="hidden sm:inline">Lat 14ms · GPU 38% · Tokens 2.4M/s</span>
          <span>© 2026 Nexus AI · by mohammad hasim</span>
        </footer>
      </div>
    </div>
  );
}
