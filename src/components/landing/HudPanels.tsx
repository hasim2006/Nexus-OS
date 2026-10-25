import { useEffect, useState } from "react";
import {
  Activity,
  TrendingUp,
  DollarSign,
  Search,
  Target,
  FileText,
  Users,
  Zap,
  Gauge,
  ListChecks,
} from "lucide-react";

type Metric = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  icon: React.ComponentType<{ className?: string }>;
  accent: "orange" | "amber" | "gold";
  chart: "bar" | "line" | "progress";
  position: string;
  delta: number; // deterministic, prevents hydration mismatch
};

const ACCENT: Record<Metric["accent"], { text: string; rgb: string; glow: string }> = {
  orange: {
    text: "text-[#FF7A00]",
    rgb: "255,122,0",
    glow: "shadow-[0_0_45px_-10px_rgba(255,122,0,0.7)]",
  },
  // "amber" repurposed → pure white accent
  amber: {
    text: "text-white",
    rgb: "245,245,245",
    glow: "shadow-[0_0_45px_-10px_rgba(255,255,255,0.35)]",
  },
  // "gold" repurposed → soft orange-white
  gold: {
    text: "text-[#FFB37A]",
    rgb: "255,179,122",
    glow: "shadow-[0_0_45px_-10px_rgba(255,179,122,0.55)]",
  },
};

const METRICS: Metric[] = [
  {
    label: "Marketing Score",
    value: 96,
    icon: Gauge,
    accent: "gold",
    chart: "progress",
    position: "top-[10%] left-[3%]",
    delta: 4.2,
  },
  {
    label: "Campaign Performance",
    value: 98.4,
    suffix: "%",
    decimals: 1,
    icon: Activity,
    accent: "orange",
    chart: "progress",
    position: "top-[24%] right-[3%]",
    delta: 2.8,
  },
  {
    label: "Revenue",
    value: 1242000,
    prefix: "₹",
    icon: DollarSign,
    accent: "amber",
    chart: "bar",
    position: "top-[40%] left-[2%]",
    delta: 6.1,
  },
  {
    label: "Traffic",
    value: 248920,
    icon: TrendingUp,
    accent: "orange",
    chart: "line",
    position: "top-[54%] right-[2%]",
    delta: 5.4,
  },
  {
    label: "SEO Score",
    value: 94,
    icon: Search,
    accent: "gold",
    chart: "progress",
    position: "top-[68%] left-[3%]",
    delta: 3.3,
  },
  {
    label: "ROAS",
    value: 7.8,
    suffix: "x",
    decimals: 1,
    icon: Target,
    accent: "amber",
    chart: "line",
    position: "bottom-[20%] right-[3%]",
    delta: 7.2,
  },
  {
    label: "Leads",
    value: 4892,
    icon: Users,
    accent: "orange",
    chart: "line",
    position: "bottom-[6%] left-[3%]",
    delta: 8.1,
  },
  {
    label: "Conversions",
    value: 12.6,
    suffix: "%",
    decimals: 1,
    icon: Zap,
    accent: "gold",
    chart: "progress",
    position: "bottom-[6%] right-[3%]",
    delta: 4.7,
  },
  {
    label: "Content Generated",
    value: 12480,
    icon: FileText,
    accent: "amber",
    chart: "bar",
    position: "bottom-[34%] left-[3%]",
    delta: 9.3,
  },
];

function useCountUp(target: number, duration = 1800, delay = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start = 0;
    const timeout = setTimeout(() => {
      const tick = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min(1, (ts - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setV(target * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);
  return v;
}

function MiniBar({ accent }: { accent: Metric["accent"] }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1400);
    return () => clearInterval(id);
  }, []);
  const bars = Array.from({ length: 12 }).map(
    (_, i) => 20 + ((Math.sin(tick + i * 0.7) + 1) / 2) * 80,
  );
  const c = ACCENT[accent].rgb;
  return (
    <div className="flex h-10 items-end gap-[3px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-700 ease-out"
          style={{
            height: `${h}%`,
            background: `linear-gradient(180deg, rgba(${c},1), rgba(${c},0.35))`,
            boxShadow: `0 0 6px rgba(${c},0.5)`,
          }}
        />
      ))}
    </div>
  );
}

function MiniLine({ accent }: { accent: Metric["accent"] }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1600);
    return () => clearInterval(id);
  }, []);
  const pts = Array.from({ length: 20 }).map((_, i) => {
    const y = 50 - Math.sin(tick * 0.6 + i * 0.5) * 18 - i * 1.3;
    return `${(i / 19) * 100},${Math.max(5, Math.min(55, y))}`;
  });
  const c = ACCENT[accent].rgb;
  const stroke = `rgb(${c})`;
  const gid = `g-${accent}`;
  return (
    <svg viewBox="0 0 100 60" className="h-10 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.5" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-1000 ease-out"
        style={{ filter: `drop-shadow(0 0 4px ${stroke})` }}
      />
      <polyline points={`0,60 ${pts.join(" ")} 100,60`} fill={`url(#${gid})`} />
    </svg>
  );
}

function MiniProgress({ accent, value }: { accent: Metric["accent"]; value: number }) {
  const c = ACCENT[accent].rgb;
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-[1800ms] ease-out"
        style={{
          width: `${Math.min(100, value)}%`,
          background: `linear-gradient(90deg, rgba(${c},1), rgba(255,255,255,0.95))`,
          boxShadow: `0 0 14px rgba(${c},0.9)`,
        }}
      />
    </div>
  );
}

function formatNumber(v: number, decimals = 0, prefix = "", suffix = "", label = "") {
  if (label === "Revenue") {
    const rounded = Math.round(v);
    if (rounded >= 1242000) {
      return "₹12 Lakh 42,000";
    }
    if (rounded < 100000) {
      return `₹${rounded.toLocaleString("en-IN")}`;
    }
    const lakhs = Math.floor(rounded / 100000);
    const remainder = rounded % 100000;
    return `₹${lakhs} Lakh ${Math.round(remainder).toLocaleString("en-IN")}`;
  }
  const locale = prefix === "₹" ? "en-IN" : "en-US";
  const n = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString(locale);
  return `${prefix}${n}${suffix}`;
}

function Panel({ metric, index }: { metric: Metric; index: number }) {
  const value = useCountUp(metric.value, 2000, 400 + index * 120);
  const Icon = metric.icon;
  const pct = metric.suffix === "%" ? value : (value / metric.value) * 100;
  const a = ACCENT[metric.accent];

  return (
    <div
      className="animate-fade-in pointer-events-auto w-full"
      style={{ animationDelay: `${index * 120}ms`, animationFillMode: "both" }}
    >
      <div
        className={`group relative w-full rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl ${a.glow} transition-all duration-500 hover:border-white/25 hover:bg-white/[0.06]`}
        style={{
          animation: `float 6s ease-in-out ${index * 0.4}s infinite`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, rgba(${a.rgb},0.08), rgba(255,255,255,0) 55%)`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-px rounded-[15px]"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 40%)",
          }}
        />
        <div className="relative flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/55">
            {metric.label}
          </span>
          <Icon className={`h-3.5 w-3.5 ${a.text}`} />
        </div>
        <div
          className={`relative mt-1.5 font-semibold tracking-tight text-white ${
            metric.label === "Revenue" || metric.label === "Traffic" ? "text-2xl" : "text-3xl"
          }`}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {formatNumber(value, metric.decimals, metric.prefix, metric.suffix, metric.label)}
        </div>
        <div className="relative mt-3">
          {metric.chart === "bar" && <MiniBar accent={metric.accent} />}
          {metric.chart === "line" && <MiniLine accent={metric.accent} />}
          {metric.chart === "progress" && <MiniProgress accent={metric.accent} value={pct} />}
        </div>
        <div className="relative mt-2 flex items-center justify-between text-[10px] text-white/45">
          <span className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${a.text} bg-current animate-pulse`} />
            live
          </span>
          <span className={`font-mono ${a.text}`}>+{metric.delta.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

function TaskCard() {
  const tasks = [
    { label: "Generate Q3 campaign brief", agent: "Strategy AI" },
    { label: "Publish 12 blog posts", agent: "Content AI" },
    { label: "Optimize Google Ads bids", agent: "Ads AI" },
    { label: "Score & route 248 leads", agent: "CRM AI" },
  ];
  return (
    <div
      className="pointer-events-auto w-full animate-fade-in"
      style={{ animationDelay: "1100ms", animationFillMode: "both" }}
    >
      <div
        className="relative w-full rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl shadow-[0_0_45px_-10px_rgba(255,122,0,0.55)]"
        style={{ animation: "float 7s ease-in-out 0.6s infinite" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/55">
            Upcoming Tasks
          </span>
          <ListChecks className="h-3.5 w-3.5 text-[#FFB300]" />
        </div>
        <ul className="mt-3 space-y-2.5">
          {tasks.map((t, i) => (
            <li key={t.label} className="flex items-start gap-2.5">
              <span
                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF7A00]"
                style={{
                  boxShadow: "0 0 8px rgba(255,122,0,0.9)",
                  animation: `pulse-glow 2s ease-in-out ${i * 0.3}s infinite`,
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs text-white/90">{t.label}</div>
                <div className="text-[10px] text-white/40">{t.agent}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function HudPanels() {
  const leftMetrics = [
    METRICS[0], // Marketing Score
    METRICS[2], // Revenue
    METRICS[4], // SEO Score
    METRICS[8], // Content Generated
    METRICS[6], // Leads
  ];
  const rightMetrics = [
    METRICS[1], // Campaign Performance
    METRICS[3], // Traffic
    METRICS[5], // ROAS
    METRICS[7], // Conversions
  ];

  return (
    <div className="pointer-events-none absolute inset-0 hidden xl:block z-20">
      {/* Left Column */}
      <div
        className="pointer-events-auto absolute left-6 top-24 bottom-20 w-[200px] sm:w-[235px] overflow-y-auto pr-2 pb-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `,
          }}
        />
        <div className="no-scrollbar flex flex-col gap-4">
          {leftMetrics.map((m, i) => (
            <Panel key={m.label} metric={m} index={i * 2} />
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div
        className="pointer-events-auto absolute right-6 top-24 bottom-20 w-[200px] sm:w-[235px] overflow-y-auto pl-2 pb-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="no-scrollbar flex flex-col gap-4">
          {rightMetrics.map((m, i) => (
            <Panel key={m.label} metric={m} index={i * 2 + 1} />
          ))}
          <TaskCard />
        </div>
      </div>
    </div>
  );
}
