import { useState, useEffect } from "react";
import { Terminal, Cpu, ArrowRight, ShieldCheck } from "lucide-react";

const BOOT_LOGS = [
  "BIOS: Nexus AI Quantum Architecture v3.8.2 initializing...",
  "CPU: 16-Core Neural Engine verified · Latency: 14ms",
  "CORE: Mounting 12 autonomous agent microservices...",
  "SYNC: Strategy, Content, SEO, Ads, Social & Analytics online",
  "DATA: Establishing encrypted pipelines (GA4, Ads, Looker, CRM)",
  "AUTH: 256-bit handshake complete · System status: 100% Nominal",
  "READY: Launching Nexus AI Marketing Operating System...",
];

export default function OsLoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Paced boot sequence (~2.2s total to reach 100%)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Realistic non-linear boot increments:
        // Starts with steady hardware scan, accelerates mid-way, finishes strong
        let step = 3;
        if (prev < 25) {
          step = Math.floor(Math.random() * 3) + 2; // 2-4
        } else if (prev < 70) {
          step = Math.floor(Math.random() * 5) + 3; // 3-7
        } else if (prev < 92) {
          step = Math.floor(Math.random() * 4) + 2; // 2-5
        } else {
          step = Math.floor(Math.random() * 4) + 3; // 3-6
        }

        const next = Math.min(100, prev + step);
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // Update log stream lines as progress increments
  useEffect(() => {
    const idx = Math.min(
      BOOT_LOGS.length - 1,
      Math.floor((progress / 100) * BOOT_LOGS.length)
    );
    setCurrentLogIndex(idx);

    if (progress === 100) {
      // Hold at 100% for 450ms so the user can read "SYSTEM OPERATIONAL"
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 450);

      // Dismiss completely after fade-out transition finishes
      const dismissTimer = setTimeout(() => {
        setIsDismissed(true);
      }, 1050);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(dismissTimer);
      };
    }
  }, [progress]);

  // Handle instant skip (touch button or Escape key)
  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsDismissed(true);
    }, 200);
  };

  // Keyboard shortcut (Escape to skip)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (isDismissed) return null;

  return (
    <div
      className={`fixed inset-0 h-[100dvh] w-full z-[99999] flex flex-col justify-between bg-[#030305] text-white select-none transition-all duration-600 ease-out px-4 py-4 sm:px-8 sm:py-6 overflow-hidden ${
        isFading ? "opacity-0 scale-[1.02] pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* ── Background Cyber Grid & Scanline ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,140,60,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,140,60,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 50%, rgba(255,122,0,0.14), transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,122,0,0.9), transparent)",
          animation: "scan 4s linear infinite",
        }}
      />

      {/* ── Top OS Status Bar (Mobile-Optimized) ── */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-xl mx-auto border-b border-white/10 pb-3 flex-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex h-2.5 w-2.5 flex-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7A00] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF7A00] shadow-[0_0_8px_#ff7a00]" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10.5px] sm:text-xs font-bold tracking-wider text-white">
              NEXUS OS // KERNEL v3.8.2
            </span>
            <span className="text-[8.5px] uppercase tracking-[0.18em] text-white/45">
              Autonomous Agency Mesh
            </span>
          </div>
        </div>

        {/* Touch-Friendly Skip Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 active:scale-95 px-3 py-1.5 text-[10.5px] sm:text-xs font-mono font-medium text-white/85 hover:text-white transition shadow-[0_0_12px_rgba(255,122,0,0.15)] touch-manipulation cursor-pointer"
        >
          <span>SKIP BOOT</span>
          <ArrowRight className="h-3 w-3 text-[#FF7A00]" />
        </button>
      </div>

      {/* ── Center Futuristic HUD Loader (Phone & Desktop Responsive) ── */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center w-full max-w-sm sm:max-w-md mx-auto text-center px-2 py-2">
        {/* Radar Ring with Rotating SVGs */}
        <div className="relative h-28 w-28 sm:h-36 sm:w-36 flex items-center justify-center">
          {/* Ambient Glow Blob */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-full opacity-40 blur-xl"
            style={{
              background:
                "radial-gradient(circle, rgba(255,122,0,0.85) 0%, rgba(255,179,122,0.2) 60%, transparent 80%)",
            }}
          />

          {/* Outer Rotating Radar Ring */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            style={{ animation: "radar-spin 4s linear infinite" }}
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="rgba(255,122,0,0.18)"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="rgba(255,122,0,0.9)"
              strokeWidth="2.5"
              strokeDasharray="60 220"
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 8px rgba(255,122,0,1))" }}
            />
          </svg>

          {/* Middle Counter-Rotating Ring */}
          <svg
            className="absolute inset-2 h-[calc(100%-16px)] w-[calc(100%-16px)]"
            viewBox="0 0 100 100"
            style={{
              animation: "radar-spin 7s linear infinite reverse",
            }}
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
            />
          </svg>

          {/* Core Icon & Aura */}
          <div className="relative flex h-14 w-14 sm:h-18 sm:w-18 items-center justify-center rounded-2xl border border-[#FF7A00]/45 bg-gradient-to-br from-[#FF7A00]/25 via-black/85 to-black shadow-[0_0_25px_rgba(255,122,0,0.4)]">
            {progress === 100 ? (
              <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-[#FFB37A] animate-pulse" />
            ) : (
              <Cpu className="h-6 w-6 sm:h-8 sm:w-8 text-[#FFB37A] animate-pulse" />
            )}
          </div>
        </div>

        {/* Big Counter */}
        <div className="mt-4 sm:mt-5 flex items-baseline gap-1">
          <span
            className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-white"
            style={{
              textShadow: "0 0 25px rgba(255,122,0,0.65)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {progress}
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-[#FF7A00]">%</span>
        </div>

        {/* Stage Subtitle */}
        <div className="mt-1 text-xs sm:text-sm font-semibold tracking-wider text-white/85 uppercase">
          {progress === 100
            ? "ALL SYSTEMS OPERATIONAL // READY"
            : progress > 75
              ? "SYNCHRONIZING NEURAL ATTRIBUTION..."
              : progress > 50
                ? "CONNECTING ENCRYPTED DATA PIPELINES..."
                : progress > 25
                  ? "CALIBRATING 12 AUTONOMOUS AGENTS..."
                  : "INITIALIZING QUANTUM KERNEL..."}
        </div>

        {/* Glowing Progress Bar */}
        <div className="mt-4 w-full max-w-xs sm:max-w-sm h-2 sm:h-2.5 rounded-full bg-white/[0.08] overflow-hidden p-0.5 border border-white/10 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
          <div
            className="h-full rounded-full transition-all duration-100 ease-out relative overflow-hidden"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #FF4500 0%, #FF7A00 50%, #FFC857 100%)",
              boxShadow: "0 0 12px rgba(255,122,0,0.9)",
            }}
          >
            {/* Shimmer light sweep */}
            <div
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
              style={{ animation: "shimmer 1.4s infinite" }}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom OS Terminal Window (Phone Adapted) ── */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-xl mx-auto rounded-xl border border-white/10 bg-black/80 backdrop-blur-md p-3 sm:p-4 shadow-2xl flex-none mb-1 sm:mb-2">
        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
          <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-white/50">
            <Terminal className="h-3 w-3 text-[#FF7A00]" />
            <span>Boot Stream Console</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-green-500/70" />
          </div>
        </div>

        {/* Terminal Line Log Stream */}
        <div className="font-mono text-[9px] sm:text-[10.5px] space-y-1 overflow-hidden h-14 sm:h-16 flex flex-col justify-end text-left">
          {BOOT_LOGS.slice(0, currentLogIndex + 1).slice(-3).map((line, i) => {
            const isLatest = i === Math.min(2, currentLogIndex);
            return (
              <div
                key={i}
                className="flex items-start gap-1.5 leading-snug animate-fade-in"
              >
                <span className="text-[#FF7A00] flex-none">›</span>
                <span
                  className={`truncate ${
                    isLatest
                      ? "text-white font-medium"
                      : "text-white/40"
                  }`}
                >
                  {line}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
