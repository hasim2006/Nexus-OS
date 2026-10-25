import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { X, CheckCircle2, TrendingUp } from "lucide-react";
import {
  ArrowLeft,
  Brain,
  PenLine,
  Search,
  Megaphone,
  Share2,
  BarChart3,
  Mail,
  Users,
  Sparkles,
  Workflow,
  Palette,
  Video,
  Activity,
  Cpu,
  Zap,
  Upload,
  Plus,
} from "lucide-react";
import IntegrationsModal, { ConnectorId, ConnectorConfig } from "@/components/IntegrationsModal";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Nexus AI · Agent Control Center" },
      {
        name: "description",
        content:
          "Live control center for all twelve AI marketing agents — strategy, content, SEO, ads, analytics, and more.",
      },
    ],
  }),
  component: Dashboard,
});

type Agent = {
  name: string;
  role: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "orange" | "amber" | "gold";
  status: "active" | "thinking" | "idle";
  load: number;
  tasksDone: number;
  metric: string;
  metricLabel: string;
  working: string[];
};

const AGENTS: Agent[] = [
  {
    name: "Strategy AI",
    role: "Quarterly planning & GTM",
    icon: Brain,
    accent: "orange",
    status: "active",
    load: 72,
    tasksDone: 184,
    metric: "12",
    metricLabel: "plans",
    working: [
      "Drafting Q3 GTM brief — North America",
      "Modeling channel mix for FY26",
      "Scoring 3 new market entries",
    ],
  },
  {
    name: "Content AI",
    role: "Long-form & social copy",
    icon: PenLine,
    accent: "amber",
    status: "thinking",
    load: 88,
    tasksDone: 1248,
    metric: "12.4K",
    metricLabel: "assets",
    working: [
      "Writing 14 LinkedIn variants for launch",
      "Localizing landing page → ES, DE, JP",
      "Rewriting 3 blog intros (CTR uplift)",
    ],
  },
  {
    name: "SEO AI",
    role: "Rank tracking & on-page",
    icon: Search,
    accent: "gold",
    status: "active",
    load: 61,
    tasksDone: 942,
    metric: "94",
    metricLabel: "score",
    working: [
      "Pushing 18 on-page fixes to /pricing",
      "Tracking 12,480 keywords across 6 SERPs",
      "Building cluster: 'agentic workflows'",
    ],
  },
  {
    name: "Ads AI",
    role: "Bid & creative optimization",
    icon: Megaphone,
    accent: "orange",
    status: "active",
    load: 79,
    tasksDone: 312,
    metric: "7.8x",
    metricLabel: "ROAS",
    working: [
      "Re-bidding 142 Google keywords",
      "Pausing 6 underperforming Meta creatives",
      "Pacing ₹3.4L daily budget across 4 platforms",
    ],
  },
  {
    name: "Social Media AI",
    role: "Scheduling & engagement",
    icon: Share2,
    accent: "amber",
    status: "active",
    load: 54,
    tasksDone: 2480,
    metric: "248K",
    metricLabel: "reach",
    working: [
      "Replying to 142 comments on IG & X",
      "Drafting 3 Reels from trending audio",
      "Scheduling 28 posts for next 48h",
    ],
  },
  {
    name: "Analytics AI",
    role: "Attribution & insights",
    icon: BarChart3,
    accent: "gold",
    status: "thinking",
    load: 67,
    tasksDone: 510,
    metric: "98.4%",
    metricLabel: "uptime",
    working: [
      "Refitting attribution model on 30d data",
      "Investigating 22% checkout drop",
      "Forecasting Q3 pipeline (+18% vs plan)",
    ],
  },
  {
    name: "Email AI",
    role: "Lifecycle & broadcast",
    icon: Mail,
    accent: "orange",
    status: "active",
    load: 48,
    tasksDone: 1820,
    metric: "42%",
    metricLabel: "open",
    working: [
      "Running A/B on onboarding email 3",
      "Optimizing send window for EU cohort",
      "Suppressing 1,284 disengaged contacts",
    ],
  },
  {
    name: "CRM AI",
    role: "Pipeline & deal scoring",
    icon: Users,
    accent: "amber",
    status: "active",
    load: 58,
    tasksDone: 690,
    metric: "₹10.6 Cr",
    metricLabel: "pipeline",
    working: [
      "Re-scoring 142 open opportunities",
      "Enriching 88 inbound contacts",
      "Flagging 6 stalled deals over ₹40L",
    ],
  },
  {
    name: "Lead Generation AI",
    role: "Prospecting & enrichment",
    icon: Sparkles,
    accent: "gold",
    status: "active",
    load: 81,
    tasksDone: 4892,
    metric: "4.8K",
    metricLabel: "leads",
    working: [
      "Pulling 248 net-new ICP accounts",
      "Qualifying 88 leads → routing to Sales",
      "Tuning ICP — adding climate tech vertical",
    ],
  },
  {
    name: "Automation AI",
    role: "Workflows & integrations",
    icon: Workflow,
    accent: "orange",
    status: "active",
    load: 64,
    tasksDone: 12480,
    metric: "312",
    metricLabel: "flows",
    working: [
      "Deploying flow: form → CRM → Slack",
      "Self-healing broken Salesforce webhook",
      "Retiring 4 redundant workflows",
    ],
  },
  {
    name: "Brand AI",
    role: "Voice & visual consistency",
    icon: Palette,
    accent: "amber",
    status: "active",
    load: 36,
    tasksDone: 128,
    metric: "100%",
    metricLabel: "on-brand",
    working: [
      "Reviewing 22 social assets for launch",
      "Blocking ad with logo clear-space issue",
      "Updating tone profile — warmer, direct",
    ],
  },
  {
    name: "Video AI",
    role: "Edits, captions & shorts",
    icon: Video,
    accent: "gold",
    status: "thinking",
    load: 74,
    tasksDone: 418,
    metric: "1.2M",
    metricLabel: "views",
    working: [
      "Cutting webinar into 14 vertical shorts",
      "Captioning 32 videos — EN / ES / FR",
      "Publishing Reel — 84K views first hour",
    ],
  },
];

type Platform = { name: string; color: string; bg: string; icon: React.ReactNode };

type AgentDetail = {
  summary: string;
  capabilities: string[];
  activity: { label: string; value: string }[];
  recent: { time: string; text: string }[];
  platforms: Platform[];
};

// ── Platform SVG Icons ────────────────────────────────────────────────────────
const Icons = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <defs>
        <radialGradient id="ig" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="20" height="20" x="2" y="2" rx="6" fill="url(#ig)" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="white" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="#0A66C2" className="h-5 w-5">
      <rect width="20" height="20" x="2" y="2" rx="4" />
      <path
        fill="white"
        d="M7 10h2v7H7zm1-3a1.1 1.1 0 110 2.2A1.1 1.1 0 018 7zm3 3h2v1h.03C13.4 10.4 14.2 10 15 10c2 0 2 1.5 2 2.5V17h-2v-4c0-.7-.3-1-.8-1s-1.2.5-1.2 1.2V17h-2z"
      />
    </svg>
  ),
  WhatsApp: (
    <svg viewBox="0 0 24 24" fill="#25D366" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" />
      <path
        fill="white"
        d="M17 14.8c-.2-.1-1.3-.6-1.5-.7s-.3-.1-.5.1l-.6.8c-.1.1-.2.1-.4 0a6 6 0 01-1.8-1.1 6.3 6.3 0 01-1.2-1.6c-.1-.2 0-.3.1-.4l.4-.5.2-.4v-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4H10c-.2 0-.4.1-.6.3a3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.8c.1.2 1.8 2.8 4.5 3.8.6.2 1 .4 1.4.5.6.2 1.1.1 1.5-.1.5-.3.8-.7.9-1.2.1-.3.1-.6 0-.8z"
      />
    </svg>
  ),
  Twitter: (
    <svg viewBox="0 0 24 24" fill="black" className="h-5 w-5">
      <rect width="20" height="20" x="2" y="2" rx="4" fill="#000" />
      <path
        fill="white"
        d="M13.8 10.6L18 5h-1.5l-3.6 4.2L10 5H5.5l4.5 6.5L5.5 19H7l3.8-4.4 3.2 4.4H19l-5.2-7.4zm-1.3 1.6l-.4-.6-3.5-5h1.5l2.7 3.8.4.6 3.6 5.2h-1.5l-2.8-4z"
      />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path
        fill="white"
        d="M13.5 12.5H15l.3-2H13.5v-1c0-.6.3-1 1-1H15V7s-.7-.1-1.4-.1c-1.9 0-2.9 1.1-2.9 3v1.6H9v2h1.7V19h2.8v-6.5z"
      />
    </svg>
  ),
  Google: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" fill="white" />
      <path
        fill="#4285F4"
        d="M21 12.2c0-.6-.1-1.2-.2-1.7H12v3.3h5.1a4.4 4.4 0 01-1.9 2.9v2.4h3c1.8-1.6 2.8-4 2.8-6.9z"
      />
      <path
        fill="#34A853"
        d="M12 21c2.6 0 4.7-.8 6.3-2.3l-3-2.4c-.9.6-2 .9-3.3.9a5.8 5.8 0 01-5.4-4h-3v2.4A9 9 0 0012 21z"
      />
      <path fill="#FBBC05" d="M6.6 13.2a5.6 5.6 0 010-3.6V7.2H3.6a9 9 0 000 8l3-2z" />
      <path
        fill="#EA4335"
        d="M12 5.8c1.4 0 2.7.5 3.7 1.5l2.8-2.8A9 9 0 003.6 7.2l3 2.4A5.8 5.8 0 0112 5.8z"
      />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect width="20" height="20" x="2" y="2" rx="4" fill="#010101" />
      <path
        fill="#FE2C55"
        d="M13.5 5h2.3a4 4 0 003.2 3.2v2.2a6.3 6.3 0 01-3.2-.9V15a4.5 4.5 0 11-4.5-4.5h.4v2.3h-.4a2.2 2.2 0 102.2 2.2V5z"
      />
      <path
        fill="#25F4EE"
        d="M13.3 5h.2v7.3a4.5 4.5 0 104.7 4.5v-4.4a6.3 6.3 0 003.3.9V11a4 4 0 01-3.2-3.2V5h-5z"
        opacity=".5"
      />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect width="20" height="14" x="2" y="5" rx="4" fill="#FF0000" />
      <path fill="white" d="M10 9l5 3-5 3z" />
    </svg>
  ),
  Slack: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect width="20" height="20" x="2" y="2" rx="5" fill="#4A154B" />
      <g fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
        <line x1="8" y1="14" x2="8" y2="17" />
        <line x1="8" y1="7" x2="8" y2="10" />
        <line x1="10" y1="10" x2="7" y2="10" />
        <line x1="17" y1="10" x2="14" y2="10" />
        <line x1="16" y1="14" x2="16" y2="17" />
        <line x1="14" y1="14" x2="17" y2="14" />
      </g>
    </svg>
  ),
  Salesforce: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" fill="#00A1E0" />
      <path
        fill="white"
        d="M9 8a3 3 0 015.5 0A2.5 2.5 0 0116 13H8a2.5 2.5 0 01-2-4A2.5 2.5 0 019 8z"
      />
    </svg>
  ),
  HubSpot: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" fill="#FF7A59" />
      <circle cx="12" cy="9" r="2.5" fill="white" />
      <path fill="white" d="M8.5 15c.5-2.5 7-2.5 7 0H8.5z" />
    </svg>
  ),
  Notion: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect width="20" height="20" x="2" y="2" rx="4" fill="white" />
      <path fill="#191919" d="M7 6h7l3 3v9H7V6zm6 0v3h3" />
    </svg>
  ),
  Ahrefs: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect width="20" height="20" x="2" y="2" rx="4" fill="#0080FF" />
      <text x="6" y="16" fontSize="10" fill="white" fontWeight="bold">
        Ah
      </text>
    </svg>
  ),
  Semrush: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect width="20" height="20" x="2" y="2" rx="4" fill="#FF642D" />
      <text x="5" y="16" fontSize="9" fill="white" fontWeight="bold">
        SEM
      </text>
    </svg>
  ),
  Mailchimp: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" fill="#FFE01B" />
      <text x="7" y="16" fontSize="10" fill="#201E1D" fontWeight="bold">
        MC
      </text>
    </svg>
  ),
  Klaviyo: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect width="20" height="20" x="2" y="2" rx="4" fill="#16C1A3" />
      <text x="5" y="16" fontSize="9" fill="white" fontWeight="bold">
        KLV
      </text>
    </svg>
  ),
  Stripe: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect width="20" height="20" x="2" y="2" rx="4" fill="#635BFF" />
      <path
        fill="white"
        d="M11 9c0-.7.6-1 1.4-1 1.3 0 2.6.4 3.6 1V6.5a9.7 9.7 0 00-3.6-.6c-2.9 0-4.9 1.5-4.9 4 0 3.9 5.4 3.3 5.4 5 0 .8-.7 1.1-1.6 1.1-1.4 0-3-.6-4.2-1.3v2.6c1.2.5 2.7.7 4.2.7 3 0 5.2-1.5 5.2-4.1 0-4.2-5.5-3.5-5.5-4.9z"
      />
    </svg>
  ),
  Analytics: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect width="20" height="20" x="2" y="2" rx="4" fill="#E37400" />
      <path fill="white" d="M6 16l3-5 3 3 3-7 3 4" />
    </svg>
  ),
  Looker: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" fill="#4285F4" />
      <circle cx="12" cy="12" r="4" fill="white" />
    </svg>
  ),
  ZoomInfo: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect width="20" height="20" x="2" y="2" rx="4" fill="#FD5A00" />
      <text x="5" y="16" fontSize="8" fill="white" fontWeight="bold">
        ZOOM
      </text>
    </svg>
  ),
  Zapier: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" fill="#FF4A00" />
      <path fill="white" d="M12 6l1.5 4.5H18l-3.8 2.7 1.5 4.5L12 15l-3.7 2.7 1.5-4.5L6 10.5h4.5z" />
    </svg>
  ),
  Figma: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect width="20" height="20" x="2" y="2" rx="4" fill="#1E1E1E" />
      <circle cx="14" cy="12" r="3" fill="#1ABCFE" />
      <path fill="#FF7262" d="M8 5h3a3 3 0 010 6H8z" />
      <path fill="#F24E1E" d="M8 11h3a3 3 0 010 6H8z" />
      <path fill="#0ACF83" d="M8 17a3 3 0 003-3v-3H8z" />
      <path fill="#A259FF" d="M8 5a3 3 0 000 6V5z" />
    </svg>
  ),
  Canva: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" fill="#7D2AE8" />
      <text x="6.5" y="16" fontSize="10" fill="white" fontWeight="bold">
        Ca
      </text>
    </svg>
  ),
};

const mapPlatformToConnector = (name: string): ConnectorId => {
  const lower = name.toLowerCase();
  if (lower.includes("google")) return "google";
  if (
    lower.includes("email") ||
    lower.includes("gmail") ||
    lower.includes("mail") ||
    lower.includes("klaviyo")
  )
    return "email";
  if (lower.includes("looker") || lower.includes("analytics")) return "looker";
  if (lower.includes("slack")) return "slack";
  if (lower.includes("notion")) return "notion";
  if (lower.includes("hubspot") || lower.includes("salesforce") || lower.includes("crm"))
    return "hubspot";
  if (lower.includes("claude") || lower.includes("ai")) return "claude";
  return "google";
};

const AGENT_DETAILS: Record<string, AgentDetail> = {
  "Strategy AI": {
    summary:
      "Synthesizes market signals, competitor moves, and pipeline data to draft quarterly GTM strategy and channel mix.",
    capabilities: [
      "Quarterly OKRs",
      "Channel mix modeling",
      "Competitor radar",
      "Budget allocation",
    ],
    activity: [
      { label: "Plans drafted", value: "12" },
      { label: "Models run", value: "84" },
      { label: "Confidence", value: "92%" },
    ],
    recent: [
      { time: "2m", text: "Drafted Q3 GTM brief for North America" },
      { time: "18m", text: "Reallocated ₹40L from display to paid social" },
      { time: "1h", text: "Flagged 3 emerging competitors in fintech vertical" },
    ],
    platforms: [
      { name: "Google", color: "#4285F4", bg: "rgba(66,133,244,0.12)", icon: Icons.Google },
      { name: "HubSpot", color: "#FF7A59", bg: "rgba(255,122,89,0.12)", icon: Icons.HubSpot },
      { name: "Slack", color: "#E01E5A", bg: "rgba(224,30,90,0.12)", icon: Icons.Slack },
      { name: "Notion", color: "#888", bg: "rgba(136,136,136,0.12)", icon: Icons.Notion },
      { name: "Looker", color: "#4285F4", bg: "rgba(66,133,244,0.12)", icon: Icons.Looker },
    ],
  },
  "Content AI": {
    summary:
      "Writes, edits and adapts long-form, social and ad copy across brand voice and 27 languages.",
    capabilities: ["Long-form articles", "Social variants", "Localization", "Brand voice tuning"],
    activity: [
      { label: "Assets today", value: "1,248" },
      { label: "Languages", value: "27" },
      { label: "Avg. score", value: "9.1" },
    ],
    recent: [
      { time: "now", text: "Generated 14 LinkedIn variants for product launch" },
      { time: "9m", text: "Localized landing page to ES, DE, JP" },
      { time: "42m", text: "Rewrote 3 underperforming blog intros" },
    ],
    platforms: [
      { name: "Instagram", color: "#E1306C", bg: "rgba(225,48,108,0.12)", icon: Icons.Instagram },
      { name: "LinkedIn", color: "#0A66C2", bg: "rgba(10,102,194,0.12)", icon: Icons.LinkedIn },
      { name: "WhatsApp", color: "#25D366", bg: "rgba(37,211,102,0.12)", icon: Icons.WhatsApp },
      { name: "Twitter / X", color: "#fff", bg: "rgba(255,255,255,0.08)", icon: Icons.Twitter },
      { name: "Notion", color: "#888", bg: "rgba(136,136,136,0.12)", icon: Icons.Notion },
    ],
  },
  "SEO AI": {
    summary:
      "Continuously audits on-page signals, builds topical clusters and tracks SERP movement across 12K keywords.",
    capabilities: ["Keyword clustering", "On-page fixes", "Internal linking", "SERP monitoring"],
    activity: [
      { label: "Keywords", value: "12,480" },
      { label: "Avg. position", value: "8.4" },
      { label: "Health", value: "94" },
    ],
    recent: [
      { time: "4m", text: "Pushed 18 on-page fixes to /pricing cluster" },
      { time: "31m", text: "Detected ranking jump (+6) on 'ai marketing platform'" },
      { time: "2h", text: "Built new topical cluster: 'agentic workflows'" },
    ],
    platforms: [
      { name: "Google", color: "#4285F4", bg: "rgba(66,133,244,0.12)", icon: Icons.Google },
      { name: "Ahrefs", color: "#0080FF", bg: "rgba(0,128,255,0.12)", icon: Icons.Ahrefs },
      { name: "Semrush", color: "#FF642D", bg: "rgba(255,100,45,0.12)", icon: Icons.Semrush },
      { name: "Looker", color: "#4285F4", bg: "rgba(66,133,244,0.12)", icon: Icons.Looker },
    ],
  },
  "Ads AI": {
    summary:
      "Optimizes bids, creative rotation and audience targeting across Google, Meta, LinkedIn and TikTok in real time.",
    capabilities: ["Bid optimization", "Creative rotation", "Audience tuning", "Budget pacing"],
    activity: [
      { label: "ROAS", value: "7.8x" },
      { label: "Spend", value: "₹35L" },
      { label: "CTR", value: "4.2%" },
    ],
    recent: [
      { time: "1m", text: "Paused 6 underperforming creatives on Meta" },
      { time: "12m", text: "Raised bids on top 3 LinkedIn segments (+18%)" },
      { time: "55m", text: "Launched 4 new lookalike audiences" },
    ],
    platforms: [
      { name: "Google Ads", color: "#4285F4", bg: "rgba(66,133,244,0.12)", icon: Icons.Google },
      { name: "Facebook", color: "#1877F2", bg: "rgba(24,119,242,0.12)", icon: Icons.Facebook },
      { name: "LinkedIn", color: "#0A66C2", bg: "rgba(10,102,194,0.12)", icon: Icons.LinkedIn },
      { name: "TikTok", color: "#FE2C55", bg: "rgba(254,44,85,0.12)", icon: Icons.TikTok },
    ],
  },
  "Social Media AI": {
    summary:
      "Schedules, posts and engages across 9 social platforms while monitoring sentiment and trending topics.",
    capabilities: ["Smart scheduling", "Auto replies", "Trend detection", "Sentiment analysis"],
    activity: [
      { label: "Reach", value: "248K" },
      { label: "Engagements", value: "18.4K" },
      { label: "Sentiment", value: "+82%" },
    ],
    recent: [
      { time: "now", text: "Replied to 142 comments across IG and X" },
      { time: "22m", text: "Detected trending audio — drafted 3 Reels" },
      { time: "1h", text: "Scheduled 28 posts for next 48h" },
    ],
    platforms: [
      { name: "Instagram", color: "#E1306C", bg: "rgba(225,48,108,0.12)", icon: Icons.Instagram },
      { name: "Twitter / X", color: "#fff", bg: "rgba(255,255,255,0.08)", icon: Icons.Twitter },
      { name: "Facebook", color: "#1877F2", bg: "rgba(24,119,242,0.12)", icon: Icons.Facebook },
      { name: "LinkedIn", color: "#0A66C2", bg: "rgba(10,102,194,0.12)", icon: Icons.LinkedIn },
      { name: "WhatsApp", color: "#25D366", bg: "rgba(37,211,102,0.12)", icon: Icons.WhatsApp },
      { name: "TikTok", color: "#FE2C55", bg: "rgba(254,44,85,0.12)", icon: Icons.TikTok },
      { name: "YouTube", color: "#FF0000", bg: "rgba(255,0,0,0.12)", icon: Icons.YouTube },
    ],
  },
  "Analytics AI": {
    summary:
      "Unifies first-party data, runs multi-touch attribution and surfaces anomalies before they hit the dashboard.",
    capabilities: [
      "Multi-touch attribution",
      "Anomaly detection",
      "Cohort analysis",
      "Forecasting",
    ],
    activity: [
      { label: "Events / hr", value: "1.2M" },
      { label: "Models", value: "14" },
      { label: "Uptime", value: "98.4%" },
    ],
    recent: [
      { time: "3m", text: "Detected 22% drop in checkout funnel — alerted CRO" },
      { time: "28m", text: "Refit attribution model with latest 30d data" },
      { time: "2h", text: "Forecast: Q3 pipeline +18% vs. plan" },
    ],
    platforms: [
      {
        name: "Google Analytics",
        color: "#E37400",
        bg: "rgba(227,116,0,0.12)",
        icon: Icons.Analytics,
      },
      { name: "Looker", color: "#4285F4", bg: "rgba(66,133,244,0.12)", icon: Icons.Looker },
      { name: "Stripe", color: "#635BFF", bg: "rgba(99,91,255,0.12)", icon: Icons.Stripe },
      { name: "Slack", color: "#E01E5A", bg: "rgba(224,30,90,0.12)", icon: Icons.Slack },
    ],
  },
  "Email AI": {
    summary:
      "Designs lifecycle journeys, writes subject lines and runs continuous experiments across the entire audience.",
    capabilities: [
      "Lifecycle journeys",
      "Subject-line A/B",
      "Send-time optimization",
      "Deliverability",
    ],
    activity: [
      { label: "Open rate", value: "42%" },
      { label: "CTR", value: "8.1%" },
      { label: "Sends today", value: "184K" },
    ],
    recent: [
      { time: "6m", text: "Won A/B on onboarding email 3 (+14% CTR)" },
      { time: "44m", text: "Shifted send window for EU cohort to 09:10 local" },
      { time: "1h", text: "Suppressed 1,284 disengaged addresses" },
    ],
    platforms: [
      { name: "Mailchimp", color: "#FFE01B", bg: "rgba(255,224,27,0.12)", icon: Icons.Mailchimp },
      { name: "Klaviyo", color: "#16C1A3", bg: "rgba(22,193,163,0.12)", icon: Icons.Klaviyo },
      {
        name: "Gmail",
        color: "#EA4335",
        bg: "rgba(234,67,53,0.12)",
        icon: (
          <svg viewBox="0 0 24 24" fill="#EA4335" className="h-5 w-5">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        ),
      },
      { name: "Slack", color: "#E01E5A", bg: "rgba(224,30,90,0.12)", icon: Icons.Slack },
    ],
  },
  "CRM AI": {
    summary:
      "Scores deals, enriches contacts and writes next-step recommendations directly into the pipeline.",
    capabilities: ["Deal scoring", "Contact enrichment", "Next-step coaching", "Pipeline hygiene"],
    activity: [
      { label: "Pipeline", value: "₹10.6 Cr" },
      { label: "Hot deals", value: "38" },
      { label: "Win prob.", value: "61%" },
    ],
    recent: [
      { time: "2m", text: "Re-scored 142 open opportunities" },
      { time: "19m", text: "Enriched 88 new contacts from inbound traffic" },
      { time: "1h", text: "Flagged 6 stalled deals over ₹40L" },
    ],
    platforms: [
      { name: "Salesforce", color: "#00A1E0", bg: "rgba(0,161,224,0.12)", icon: Icons.Salesforce },
      { name: "HubSpot", color: "#FF7A59", bg: "rgba(255,122,89,0.12)", icon: Icons.HubSpot },
      { name: "Slack", color: "#E01E5A", bg: "rgba(224,30,90,0.12)", icon: Icons.Slack },
      { name: "LinkedIn", color: "#0A66C2", bg: "rgba(10,102,194,0.12)", icon: Icons.LinkedIn },
    ],
  },
  "Lead Generation AI": {
    summary:
      "Prospects, enriches and qualifies new accounts using intent data and your ideal customer profile.",
    capabilities: ["ICP prospecting", "Intent signals", "Enrichment", "Qualification"],
    activity: [
      { label: "Leads today", value: "4,892" },
      { label: "MQLs", value: "612" },
      { label: "Cost / MQL", value: "₹698" },
    ],
    recent: [
      { time: "now", text: "Added 248 net-new ICP accounts from intent feed" },
      { time: "14m", text: "Qualified 88 leads → routed to Sales" },
      { time: "1h", text: "Tuned ICP — added vertical: climate tech" },
    ],
    platforms: [
      { name: "LinkedIn", color: "#0A66C2", bg: "rgba(10,102,194,0.12)", icon: Icons.LinkedIn },
      { name: "ZoomInfo", color: "#FD5A00", bg: "rgba(253,90,0,0.12)", icon: Icons.ZoomInfo },
      { name: "HubSpot", color: "#FF7A59", bg: "rgba(255,122,89,0.12)", icon: Icons.HubSpot },
      { name: "Salesforce", color: "#00A1E0", bg: "rgba(0,161,224,0.12)", icon: Icons.Salesforce },
    ],
  },
  "Automation AI": {
    summary:
      "Builds and maintains cross-tool workflows so every signal in your stack triggers the right next action.",
    capabilities: ["Workflow builder", "Integrations", "Error recovery", "SLA monitoring"],
    activity: [
      { label: "Active flows", value: "312" },
      { label: "Runs / hr", value: "18.4K" },
      { label: "Success", value: "99.7%" },
    ],
    recent: [
      { time: "1m", text: "Built new flow: form-fill → CRM → Slack → email" },
      { time: "26m", text: "Healed broken Salesforce webhook automatically" },
      { time: "2h", text: "Retired 4 redundant workflows" },
    ],
    platforms: [
      { name: "Zapier", color: "#FF4A00", bg: "rgba(255,74,0,0.12)", icon: Icons.Zapier },
      { name: "Slack", color: "#E01E5A", bg: "rgba(224,30,90,0.12)", icon: Icons.Slack },
      { name: "Salesforce", color: "#00A1E0", bg: "rgba(0,161,224,0.12)", icon: Icons.Salesforce },
      { name: "HubSpot", color: "#FF7A59", bg: "rgba(255,122,89,0.12)", icon: Icons.HubSpot },
      { name: "Notion", color: "#888", bg: "rgba(136,136,136,0.12)", icon: Icons.Notion },
    ],
  },
  "Brand AI": {
    summary:
      "Guards visual identity, tone and messaging consistency across every asset and channel before they ship.",
    capabilities: ["Voice guardrails", "Visual checks", "Approval routing", "Asset library"],
    activity: [
      { label: "On-brand", value: "100%" },
      { label: "Reviews today", value: "128" },
      { label: "Blocked", value: "3" },
    ],
    recent: [
      { time: "8m", text: "Blocked 1 ad creative — logo clear space violation" },
      { time: "34m", text: "Approved 22 social assets for launch campaign" },
      { time: "1h", text: "Updated tone profile: warmer, more direct" },
    ],
    platforms: [
      { name: "Figma", color: "#A259FF", bg: "rgba(162,89,255,0.12)", icon: Icons.Figma },
      { name: "Canva", color: "#7D2AE8", bg: "rgba(125,42,232,0.12)", icon: Icons.Canva },
      { name: "Notion", color: "#888", bg: "rgba(136,136,136,0.12)", icon: Icons.Notion },
      { name: "Slack", color: "#E01E5A", bg: "rgba(224,30,90,0.12)", icon: Icons.Slack },
    ],
  },
  "Video AI": {
    summary:
      "Cuts long-form video into shorts, generates captions, B-roll and platform-native edits in minutes.",
    capabilities: ["Auto shorts", "Captions", "B-roll suggest", "Platform formats"],
    activity: [
      { label: "Views", value: "1.2M" },
      { label: "Edits today", value: "418" },
      { label: "Avg. retention", value: "62%" },
    ],
    recent: [
      { time: "3m", text: "Cut 1 webinar into 14 vertical shorts" },
      { time: "21m", text: "Captioned 32 videos across EN/ES/FR" },
      { time: "1h", text: "Published Reel — 84K views in first hour" },
    ],
    platforms: [
      { name: "YouTube", color: "#FF0000", bg: "rgba(255,0,0,0.12)", icon: Icons.YouTube },
      { name: "Instagram", color: "#E1306C", bg: "rgba(225,48,108,0.12)", icon: Icons.Instagram },
      { name: "TikTok", color: "#FE2C55", bg: "rgba(254,44,85,0.12)", icon: Icons.TikTok },
      { name: "LinkedIn", color: "#0A66C2", bg: "rgba(10,102,194,0.12)", icon: Icons.LinkedIn },
      { name: "Twitter / X", color: "#fff", bg: "rgba(255,255,255,0.08)", icon: Icons.Twitter },
    ],
  },
};

const AGENT_COMMANDS: Record<string, { cmd: string; steps: string[] }[]> = {
  "Strategy AI": [
    {
      cmd: "Draft Q4 GTM Strategy",
      steps: [
        "Bootstrapping campaign model...",
        "Analyzing competitor share of voice...",
        "Allocating ₹25L channel budget...",
        "GTM brief compiled successfully!",
      ],
    },
    {
      cmd: "Competitor Intel Scan",
      steps: [
        "Scanning competitor domains...",
        "Extracting pricing models...",
        "Flagging 3 market entry opportunities...",
        "Competitor data synced to database.",
      ],
    },
  ],
  "Content AI": [
    {
      cmd: "Write Launch Campaign",
      steps: [
        "Fetching product specs...",
        "Generating 5 viral hooks...",
        "Adapting brand voice settings...",
        "Launch variants queued for review.",
      ],
    },
    {
      cmd: "Localize Landing Page",
      steps: [
        "Extracting DOM text nodes...",
        "Translating to ES, FR, JP...",
        "Verifying layout spacing...",
        "Localization bundle generated!",
      ],
    },
  ],
  "SEO AI": [
    {
      cmd: "Audit Pricing Page",
      steps: [
        "Fetching /pricing HTML...",
        "Auditing heading hierarchy...",
        "Analyzing image alt tags...",
        "12 critical optimizations pushed live!",
      ],
    },
    {
      cmd: "Build Keyword Cluster",
      steps: [
        "Scraping Google Autocomplete...",
        "Grouping keywords by intent...",
        "Generating internal link mapping...",
        "Topic cluster maps created!",
      ],
    },
  ],
  "Ads AI": [
    {
      cmd: "Optimize Google Ads",
      steps: [
        "Analyzing CTR on 140 keywords...",
        "Adjusting bid multipliers (+12% for top segments)...",
        "Reducing budget on low-ROAS creatives...",
        "Bids synchronized with AdWords API.",
      ],
    },
    {
      cmd: "Refresh Meta Ad Sets",
      steps: [
        "Analyzing frequency caps...",
        "Generating new image variants...",
        "Updating lookalike audiences...",
        "Meta campaigns refreshed!",
      ],
    },
  ],
  "Social Media AI": [
    {
      cmd: "Sentiment Pulse Check",
      steps: [
        "Scraping 500 recent mentions...",
        "Calculating NPS / sentiment ratio (+84%)...",
        "Flagging 2 high-priority posts...",
        "Sentiment score compiled.",
      ],
    },
    {
      cmd: "Schedule Post Queue",
      steps: [
        "Analyzing engagement peaks...",
        "Drafting 14 posts (text & images)...",
        "Scheduling pipeline for next 7 days...",
        "Queue scheduled successfully!",
      ],
    },
  ],
  "Analytics AI": [
    {
      cmd: "Attribution Re-run",
      steps: [
        "Loading 1.2M web events...",
        "Recalculating W-shaped models...",
        "Updating attribution reports...",
        "Attribution dashboards synced.",
      ],
    },
    {
      cmd: "Anomalies Deep Dive",
      steps: [
        "Analyzing checkout drops...",
        "Tracing Stripe API response times...",
        "Isolating Safari iOS 16 issue...",
        "Report generated & Slack alert sent.",
      ],
    },
  ],
  "Email AI": [
    {
      cmd: "A/B Subject Lines",
      steps: [
        "Generating 3 subject line variants...",
        "Segmenting 20,000 test users...",
        "Monitoring open rates for 1 hour...",
        "Winner 'Option B' deployed to remaining 150K!",
      ],
    },
    {
      cmd: "Clean Subscriber List",
      steps: [
        "Filtering bounce logs...",
        "Identifying 1,280 inactive addresses...",
        "Flagging for list removal...",
        "List cleaned (Deliverability score: 99.8%).",
      ],
    },
  ],
  "CRM AI": [
    {
      cmd: "Re-score Pipeline",
      steps: [
        "Loading CRM deal stages...",
        "Running opportunity win-prob algorithms...",
        "Re-scoring 142 active deals...",
        "Pipeline forecast updated!",
      ],
    },
    {
      cmd: "Lead Enrichment Batch",
      steps: [
        "Processing 88 new inbound signups...",
        "Scraping Clearbit & LinkedIn APIs...",
        "Populating firmographic data...",
        "Enrichment complete.",
      ],
    },
  ],
  "Lead Generation AI": [
    {
      cmd: "Prospect Target Accounts",
      steps: [
        "Filtering ZoomInfo for ICP accounts...",
        "Locating decision makers (VP Marketing)...",
        "Verifying corporate emails...",
        "248 new leads added to CRM.",
      ],
    },
    {
      cmd: "Qualify Intent Signal",
      steps: [
        "Monitoring G2 crowd intent triggers...",
        "Cross-referencing domain lookups...",
        "Scoring intent weight (+15)...",
        "Lead promoted to MQL & assigned.",
      ],
    },
  ],
  "Automation AI": [
    {
      cmd: "Self-Heal Webhooks",
      steps: [
        "Detecting Salesforce sync failure...",
        "Checking payload schemas...",
        "Re-authenticating API tokens...",
        "Connection restored & backlog processed!",
      ],
    },
    {
      cmd: "Deploy Sync Flow",
      steps: [
        "Configuring trigger: Webhook...",
        "Mapping fields (Email, Phone, Company)...",
        "Testing connection to database...",
        "Active workflow deployed!",
      ],
    },
  ],
  "Brand AI": [
    {
      cmd: "Audit Asset Adherence",
      steps: [
        "Scanning new campaign banners...",
        "Verifying logo margin (24px cap)...",
        "Checking color palette contrast...",
        "100% brand compliant, approved!",
      ],
    },
    {
      cmd: "Update Style Guide",
      steps: [
        "Importing new brand assets...",
        "Modifying core typography styles...",
        "Publishing tone guidelines...",
        "Brand guidelines synced.",
      ],
    },
  ],
  "Video AI": [
    {
      cmd: "Generate Video Shorts",
      steps: [
        "Extracting speech transcripts...",
        "Locating high-energy segments...",
        "Adding dynamic auto-captions...",
        "14 platform-ready shorts exported!",
      ],
    },
    {
      cmd: "Translate Captions",
      steps: [
        "Extracting audio timeline...",
        "Translating to ES, FR, PT...",
        "Generating SRT subtitle files...",
        "Multilingual video assets ready.",
      ],
    },
  ],
};

const ACCENT: Record<Agent["accent"], { rgb: string; text: string }> = {
  orange: { rgb: "255,122,0", text: "text-[#FF7A00]" },
  amber: { rgb: "245,245,245", text: "text-white" },
  gold: { rgb: "255,179,122", text: "text-[#FFB37A]" },
};

const STATUS_STYLE: Record<Agent["status"], string> = {
  active: "bg-[#FF7A00]",
  thinking: "bg-white",
  idle: "bg-white/30",
};

function useTick(intervalMs = 1500) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return t;
}

function Sparkline({ accent, seed }: { accent: Agent["accent"]; seed: number }) {
  const c = ACCENT[accent].rgb;

  // Custom height configurations to make each card sparkline wave slightly unique
  const heights = [
    { y1: 15, y2: 8, y3: 22, y4: 12 },
    { y1: 8, y2: 24, y3: 10, y4: 18 },
    { y1: 20, y2: 12, y3: 25, y4: 10 },
  ];
  const h = heights[seed % heights.length];

  return (
    <div className="h-8 w-full overflow-hidden relative">
      <svg
        viewBox="0 0 120 40"
        className="h-full w-[150%] absolute left-0 top-0"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`spk-${accent}-${seed}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={`rgb(${c})`} stopOpacity="0.4" />
            <stop offset="100%" stopColor={`rgb(${c})`} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 40 L 0 ${h.y1} Q 15 ${h.y2}, 30 ${h.y1} T 60 ${h.y1} T 90 ${h.y1} T 120 ${h.y1} T 150 ${h.y1} T 180 ${h.y1} L 180 40 Z`}
          fill={`url(#spk-${accent}-${seed})`}
          className="animate-sparkline-move"
          style={{
            animationDuration: `${3.5 + (seed % 3) * 1.2}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        />
        <path
          d={`M 0 ${h.y1} Q 15 ${h.y2}, 30 ${h.y1} T 60 ${h.y1} T 90 ${h.y1} T 120 ${h.y1} T 150 ${h.y1} T 180 ${h.y1}`}
          fill="none"
          stroke={`rgb(${c})`}
          strokeWidth="1.5"
          strokeLinecap="round"
          className="animate-sparkline-move"
          style={{
            filter: `drop-shadow(0 0 3px rgb(${c}))`,
            animationDuration: `${3.5 + (seed % 3) * 1.2}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        />
      </svg>
    </div>
  );
}

function AgentCard({ agent, index, onOpen }: { agent: Agent; index: number; onOpen: () => void }) {
  const a = ACCENT[agent.accent];
  const Icon = agent.icon;
  const circumference = 2 * Math.PI * 32; // r=32
  const dashOffset = circumference * (1 - agent.load / 100);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full text-left animate-fade-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]/60 rounded-2xl"
      style={{ animationDelay: `${index * 55}ms`, animationFillMode: "both" }}
    >
      {/* Outer glow bloom on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 transition-all duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at center, rgba(${a.rgb},0.25), transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      <div
        className="relative h-full rounded-2xl border border-white/[0.08] p-5 backdrop-blur-xl transition-all duration-300 group-hover:border-white/20 group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)]"
        style={{
          background: `linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(${a.rgb},0.04) 50%, rgba(0,0,0,0.4) 100%)`,
          boxShadow: `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 0 rgba(${a.rgb},0)`,
        }}
      >
        {/* Top gradient streak */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${a.rgb},0.6), transparent)`,
          }}
        />

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Icon with SVG load ring */}
            <div className="relative h-11 w-11">
              <svg className="absolute inset-0 h-11 w-11 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="6"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke={`rgb(${a.rgb})`}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{
                    filter: `drop-shadow(0 0 4px rgba(${a.rgb},0.8))`,
                    transition: "stroke-dashoffset 1.5s ease",
                  }}
                />
              </svg>
              <div
                className={`absolute inset-[6px] flex items-center justify-center rounded-full ${a.text}`}
                style={{
                  background: `linear-gradient(135deg, rgba(${a.rgb},0.2), rgba(0,0,0,0.6))`,
                }}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <div>
              <div className="text-[13px] font-bold text-white leading-tight">{agent.name}</div>
              <div className="mt-0.5 text-[10px] text-white/40 leading-none">{agent.role}</div>
            </div>
          </div>
          <span
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] font-semibold"
            style={{
              background: `rgba(${a.rgb},0.1)`,
              border: `1px solid rgba(${a.rgb},0.25)`,
              color: `rgb(${a.rgb})`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: `rgb(${a.rgb})`, boxShadow: `0 0 6px rgb(${a.rgb})` }}
            />
            {agent.status}
          </span>
        </div>

        {/* Metric + sparkline */}
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-white/35 mb-0.5">
              {agent.metricLabel}
            </div>
            <div
              className="text-2xl font-black tracking-tight text-white"
              style={{
                fontVariantNumeric: "tabular-nums",
                textShadow: `0 0 20px rgba(${a.rgb},0.5)`,
              }}
            >
              {agent.metric}
            </div>
          </div>
          <div className="w-[52%]">
            <Sparkline accent={agent.accent} seed={index} />
          </div>
        </div>

        {/* CPU load bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/35">CPU Load</span>
            <span className="font-mono text-[10px]" style={{ color: `rgb(${a.rgb})` }}>
              {agent.load}%
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full transition-all duration-[1800ms] ease-out"
              style={{
                width: `${agent.load}%`,
                background: `linear-gradient(90deg, rgba(${a.rgb},0.7), rgb(${a.rgb}))`,
                boxShadow: `0 0 8px rgba(${a.rgb},0.8)`,
              }}
            />
          </div>
        </div>

        <WorkingOn agent={agent} index={index} />

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] text-white/30 font-mono">
            {agent.tasksDone.toLocaleString("en-US")} tasks
          </span>
          <span
            className="flex items-center gap-1 text-[9px] uppercase tracking-[0.16em]"
            style={{ color: `rgb(${a.rgb})` }}
          >
            <Zap className="h-2.5 w-2.5" /> autonomous
          </span>
        </div>
      </div>
    </button>
  );
}

function WorkingOn({ agent, index }: { agent: Agent; index: number }) {
  const a = ACCENT[agent.accent];
  const [i, setI] = useState(index % agent.working.length);
  useEffect(() => {
    const id = setInterval(
      () => setI((x) => (x + 1) % agent.working.length),
      3800 + (index % 5) * 400,
    );
    return () => clearInterval(id);
  }, [agent.working.length, index]);
  const task = agent.working[i];
  return (
    <div
      className="relative mt-3 flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.025] px-2.5 py-2"
      style={{ boxShadow: `inset 0 0 20px -10px rgba(${a.rgb},0.55)` }}
    >
      <span className="relative mt-1 flex h-2 w-2 flex-none">
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: `rgba(${a.rgb},0.55)` }}
        />
        <span
          className="relative h-2 w-2 rounded-full"
          style={{ background: `rgb(${a.rgb})`, boxShadow: `0 0 8px rgb(${a.rgb})` }}
        />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[9px] uppercase tracking-[0.18em] text-white/40">Working on</div>
        <div key={task} className="truncate text-[11px] text-white/85 animate-fade-in">
          {task}
        </div>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string;
  accent: Agent["accent"];
  icon: React.ComponentType<{ className?: string }>;
}) {
  const a = ACCENT[accent];
  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-px transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, rgba(${a.rgb},0.4), rgba(255,255,255,0.05), rgba(${a.rgb},0.2))`,
      }}
    >
      <div
        className="relative flex h-full flex-col justify-between rounded-[14px] p-4 backdrop-blur-xl"
        style={{
          background: `linear-gradient(145deg, rgba(255,255,255,0.05), rgba(${a.rgb},0.03), rgba(0,0,0,0.5))`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        {/* Glow blob */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
          style={{ background: `rgb(${a.rgb})` }}
        />
        <div className="relative flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.22em] text-white/40">{label}</span>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: `rgba(${a.rgb},0.15)`, border: `1px solid rgba(${a.rgb},0.3)` }}
          >
            <Icon className={`h-3.5 w-3.5 ${a.text}`} />
          </div>
        </div>
        <div
          className="mt-2 text-2xl font-black tracking-tight"
          style={{
            fontVariantNumeric: "tabular-nums",
            textShadow: `0 0 30px rgba(${a.rgb},0.6)`,
            color: "white",
          }}
        >
          {value}
        </div>
        {/* Bottom line */}
        <div
          className="mt-2 h-px w-full"
          style={{ background: `linear-gradient(90deg, rgba(${a.rgb},0.5), transparent)` }}
        />
      </div>
    </div>
  );
}

// ── 3-D Neural-Network Background ────────────────────────────────────────────
function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Node setup ──────────────────────────────────────────────────────────
    const NODE_COUNT = 120;
    const DEPTH = 900;
    const CONNECT_DIST_SQ = 38000; // squared threshold
    const FOV = 500;

    type Node3D = {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      r: number;
    };

    const nodes: Node3D[] = Array.from({ length: NODE_COUNT }, () => ({
      x: (Math.random() - 0.5) * DEPTH * 1.6,
      y: (Math.random() - 0.5) * DEPTH * 1.0,
      z: (Math.random() - 0.5) * DEPTH,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      vz: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.8 + 0.6,
    }));

    let W = 0,
      H = 0;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    let t = 0;

    // ── Project 3-D → 2-D with camera tilt ──────────────────────────────────
    const project = (x: number, y: number, z: number) => {
      const mx = mouseRef.current.x * 0.18;
      const my = mouseRef.current.y * 0.14;
      const autoX = Math.sin(t * 0.00022) * 0.25;
      const autoY = Math.cos(t * 0.00015) * 0.18;
      const rx = my + autoY;
      const ry = mx + autoX;

      // Rotate around Y
      const cosY = Math.cos(ry),
        sinY = Math.sin(ry);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // Rotate around X
      const cosX = Math.cos(rx),
        sinX = Math.sin(rx);
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const scale = FOV / (FOV + z2 + DEPTH * 0.5);
      return { sx: x1 * scale + W / 2, sy: y1 * scale + H / 2, scale, z2 };
    };

    // ── Render loop ─────────────────────────────────────────────────────────
    const draw = (ts: number) => {
      t = ts;
      ctx.clearRect(0, 0, W, H);

      // Move nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;
        const half = DEPTH * 0.8;
        if (n.x > half || n.x < -half) n.vx *= -1;
        if (n.y > DEPTH * 0.55 || n.y < -DEPTH * 0.55) n.vy *= -1;
        if (n.z > DEPTH * 0.55 || n.z < -DEPTH * 0.55) n.vz *= -1;
      }

      // Project all nodes
      const proj = nodes.map((n) => ({ n, ...project(n.x, n.y, n.z) }));

      // Draw connections
      for (let i = 0; i < proj.length; i++) {
        for (let j = i + 1; j < proj.length; j++) {
          const a = proj[i],
            b = proj[j];
          const dx = a.n.x - b.n.x,
            dy = a.n.y - b.n.y,
            dz = a.n.z - b.n.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq > CONNECT_DIST_SQ) continue;

          const strength = 1 - distSq / CONNECT_DIST_SQ;
          const avgScale = (a.scale + b.scale) * 0.5;
          const depth01 = Math.max(0, Math.min(1, ((a.z2 + b.z2) / (DEPTH * 0.5)) * 0.5 + 0.5));

          // Color: orange → amber based on depth
          const r = Math.round(255);
          const g = Math.round(80 + depth01 * 120);
          const bC = Math.round(0 + depth01 * 30);
          const alpha = strength * avgScale * 0.55;

          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.strokeStyle = `rgba(${r},${g},${bC},${alpha.toFixed(3)})`;
          ctx.lineWidth = strength * avgScale * 1.2;
          ctx.stroke();
        }
      }

      // Draw nodes
      for (const p of proj) {
        const depth01 = Math.max(0, Math.min(1, (p.z2 / (DEPTH * 0.5)) * 0.5 + 0.5));
        const r = Math.round(255);
        const g = Math.round(90 + depth01 * 130);
        const radius = p.n.r * p.scale;
        const alpha = p.scale * (0.5 + depth01 * 0.5);

        // Outer glow
        const grd = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, radius * 4);
        grd.addColorStop(0, `rgba(${r},${g},0,${(alpha * 0.5).toFixed(3)})`);
        grd.addColorStop(1, `rgba(${r},${g},0,0)`);
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},30,${Math.min(1, alpha * 1.4).toFixed(3)})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{ opacity: 0.55 }}
    />
  );
}

// ── Agent Network Panel ───────────────────────────────────────────────────────
const AGENT_COLORS: Record<string, string> = {
  "Strategy AI": "255,122,0",
  "Content AI": "245,158,11",
  "SEO AI": "234,179,8",
  "Ads AI": "249,115,22",
  "Social Media AI": "236,72,153",
  "Analytics AI": "139,92,246",
  "Email AI": "59,130,246",
  "CRM AI": "16,185,129",
  "Lead Generation AI": "20,184,166",
  "Automation AI": "99,102,241",
  "Brand AI": "244,63,94",
  "Video AI": "239,68,68",
};

type Packet = {
  fromIdx: number;
  toIdx: number;
  t: number;
  speed: number;
  label: string;
  color: string;
};

const TASK_SNIPPETS = [
  "GTM brief",
  "Keyword data",
  "MQL list",
  "Attribution",
  "Copy draft",
  "Bid update",
  "Lead score",
  "Campaign",
  "Audience",
  "Budget",
  "Report",
  "Asset",
];

function AgentNetworkPanel({
  agents,
  logs,
  onOpenUpload,
}: {
  agents: Agent[];
  logs: string[];
  onOpenUpload: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const packetsRef = useRef<Packet[]>([]);
  const rafRef = useRef<number>(0);
  const logBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logBoxRef.current) logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    const dpr = window.devicePixelRatio || 1;
    const setSize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    window.addEventListener("resize", setSize);

    const N = agents.length;
    const getPositions = () => {
      const cx = W / 2,
        cy = H / 2 - 8;
      const r = Math.min(W, H) * 0.36;
      return agents.map((_, i) => {
        const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
        return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
      });
    };

    const spawnPacket = () => {
      const from = Math.floor(Math.random() * N);
      let to = Math.floor(Math.random() * N);
      if (to === from) to = (from + 1) % N;
      packetsRef.current.push({
        fromIdx: from,
        toIdx: to,
        t: 0,
        speed: 0.004 + Math.random() * 0.005,
        label: TASK_SNIPPETS[Math.floor(Math.random() * TASK_SNIPPETS.length)],
        color: AGENT_COLORS[agents[from].name] ?? "255,122,0",
      });
      if (packetsRef.current.length > 14) packetsRef.current.shift();
    };

    const spawnInterval = setInterval(spawnPacket, 850);
    for (let k = 0; k < 5; k++) setTimeout(spawnPacket, k * 180);

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);
      const nodePos = getPositions();
      const activeEdges = new Set(packetsRef.current.map((p) => `${p.fromIdx}-${p.toIdx}`));

      // Base edges
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const isActive = activeEdges.has(`${i}-${j}`) || activeEdges.has(`${j}-${i}`);
          const a = nodePos[i],
            b = nodePos[j];
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = isActive ? "rgba(255,160,40,0.12)" : "rgba(255,255,255,0.022)";
          ctx.lineWidth = isActive ? 0.9 : 0.35;
          ctx.stroke();
        }
      }

      // Packets
      packetsRef.current = packetsRef.current.filter((p) => p.t <= 1);
      for (const p of packetsRef.current) {
        p.t = Math.min(1, p.t + p.speed);
        const a = nodePos[p.fromIdx],
          b = nodePos[p.toIdx];
        const px = a.x + (b.x - a.x) * p.t;
        const py = a.y + (b.y - a.y) * p.t;
        const rgb = p.color;
        const t0 = Math.max(0, p.t - 0.12);
        const tx0 = a.x + (b.x - a.x) * t0,
          ty0 = a.y + (b.y - a.y) * t0;

        // Trail
        const tGrad = ctx.createLinearGradient(tx0, ty0, px, py);
        tGrad.addColorStop(0, `rgba(${rgb},0)`);
        tGrad.addColorStop(1, `rgba(${rgb},0.85)`);
        ctx.beginPath();
        ctx.moveTo(tx0, ty0);
        ctx.lineTo(px, py);
        ctx.strokeStyle = tGrad;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Outer glow
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grd.addColorStop(0, `rgba(${rgb},0.9)`);
        grd.addColorStop(1, `rgba(${rgb},0)`);
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(px, py, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.98)";
        ctx.fill();

        // Label
        if (p.t > 0.3 && p.t < 0.78) {
          const fade = p.t < 0.5 ? (p.t - 0.3) / 0.2 : (0.78 - p.t) / 0.28;
          ctx.save();
          ctx.globalAlpha = Math.min(1, fade);
          ctx.font = "bold 7.5px 'SF Mono',monospace";
          ctx.textBaseline = "middle";
          const tw = ctx.measureText(p.label).width;
          const lx = px + 10,
            ly = py - 1;
          ctx.fillStyle = "rgba(0,0,0,0.82)";
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") ctx.roundRect(lx - 3, ly - 7, tw + 6, 13, 3);
          else ctx.rect(lx - 3, ly - 7, tw + 6, 13);
          ctx.fill();
          ctx.fillStyle = `rgb(${rgb})`;
          ctx.fillText(p.label, lx, ly + 0.5);
          ctx.restore();
          ctx.textBaseline = "alphabetic";
        }
      }

      // Nodes
      agents.forEach((agent, i) => {
        const { x, y } = nodePos[i];
        const rgb = AGENT_COLORS[agent.name] ?? "255,122,0";
        const pulse = Math.sin(frame * 0.045 + i) * 0.5 + 0.5;
        const nodeR = 13 + (agent.load / 100) * 5;

        if (agent.status !== "idle") {
          const ringR = nodeR + 5 + pulse * 6;
          const ring = ctx.createRadialGradient(x, y, nodeR, x, y, ringR);
          ring.addColorStop(0, `rgba(${rgb},${0.28 * pulse})`);
          ring.addColorStop(1, `rgba(${rgb},0)`);
          ctx.beginPath();
          ctx.arc(x, y, ringR, 0, Math.PI * 2);
          ctx.fillStyle = ring;
          ctx.fill();
        }

        const halo = ctx.createRadialGradient(x, y, 0, x, y, nodeR * 2.8);
        halo.addColorStop(0, `rgba(${rgb},0.28)`);
        halo.addColorStop(1, `rgba(${rgb},0)`);
        ctx.beginPath();
        ctx.arc(x, y, nodeR * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        const fill = ctx.createRadialGradient(x - nodeR * 0.3, y - nodeR * 0.3, 0, x, y, nodeR);
        fill.addColorStop(0, `rgba(${rgb},0.92)`);
        fill.addColorStop(1, `rgba(${rgb},0.3)`);
        ctx.beginPath();
        ctx.arc(x, y, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, nodeR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb},0.75)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const dotClr =
          agent.status === "active"
            ? "34,197,94"
            : agent.status === "thinking"
              ? "250,204,21"
              : "100,116,139";
        ctx.save();
        ctx.shadowColor = `rgb(${dotClr})`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x + nodeR * 0.68, y - nodeR * 0.68, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${dotClr})`;
        ctx.fill();
        ctx.restore();

        const initials = agent.name
          .split(" ")
          .map((w: string) => w[0])
          .slice(0, 2)
          .join("");
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `bold ${Math.round(nodeR * 0.72)}px Inter,sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.fillText(initials, x, y + 0.5);

        const shortName = agent.name.replace(" AI", "");
        ctx.font = "600 8px Inter,sans-serif";
        ctx.fillStyle = `rgba(${rgb},0.82)`;
        ctx.fillText(shortName, x, y + nodeR + 11);

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(spawnInterval);
      window.removeEventListener("resize", setSize);
    };
  }, [agents]);

  const getLogColor = (line: string): string => {
    for (const [name, rgb] of Object.entries(AGENT_COLORS)) {
      if (line.includes(name)) return `rgb(${rgb})`;
    }
    if (line.startsWith("[SYSTEM]") || line.includes("[system]")) return "#6ee7b7";
    return "#475569";
  };

  return (
    <div className="lg:col-span-1 flex flex-col gap-2" style={{ height: "580px" }}>
      {/* Canvas panel */}
      <div
        className="relative flex-1 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg,rgba(6,6,10,0.97),rgba(3,3,6,0.99))",
          border: "1px solid rgba(255,122,0,0.2)",
          boxShadow: "0 0 60px -18px rgba(255,122,0,0.4),inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="relative z-10 flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF7A00] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF7A00] shadow-[0_0_8px_rgba(255,122,0,1)]" />
            </span>
            <span className="text-[9px] uppercase tracking-[0.24em] text-white/60 font-semibold">
              Agent Network
            </span>
            <span className="ml-1 rounded-full bg-white/[0.06] px-2 py-0.5 text-[8px] text-white/35 font-mono">
              12 nodes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 rounded-md border border-[#FF7A00]/30 bg-[#FF7A00]/[0.08] px-2.5 py-1 text-[8.5px] uppercase tracking-[0.12em] text-[#FF7A00] transition hover:bg-[#FF7A00]/[0.18] hover:border-[#FF7A00]/50"
            >
              <Upload className="h-2.5 w-2.5" />
              Upload Data
            </button>
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px,transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <canvas ref={canvasRef} className="block w-full" style={{ height: "calc(100% - 41px)" }} />
      </div>

      {/* Live log feed */}
      <div
        className="rounded-xl overflow-hidden flex flex-col"
        style={{
          height: "142px",
          background: "rgba(3,3,6,0.96)",
          border: "1px solid rgba(255,255,255,0.055)",
          boxShadow: "inset 0 2px 20px rgba(0,0,0,0.6)",
        }}
      >
        <div
          className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.04]"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[7.5px] uppercase tracking-[0.22em] text-white/35">
              Live Shell
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-green-500/70" />
          </div>
        </div>
        <div
          ref={logBoxRef}
          className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 no-scrollbar font-mono text-[9px] leading-relaxed"
          style={{ scrollbarWidth: "none" }}
        >
          {logs.slice(-20).map((line, idx) => (
            <div key={idx} className="flex gap-2 animate-fade-in">
              <span className="flex-none text-white/20">›</span>
              <span style={{ color: getLogColor(line) }} className="break-all">
                {line}
              </span>
            </div>
          ))}
          <div className="flex gap-2">
            <span className="text-white/20">›</span>
            <span className="inline-block w-1.5 h-3 bg-[#FF7A00]/80 animate-pulse mt-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [selected, setSelected] = useState<Agent | null>(null);
  const [systemStats, setSystemStats] = useState({
    tasksPerHour: 3482,
    systemLoad: 64,
  });
  const [logs, setLogs] = useState<string[]>([]);
  const termRef = useRef<HTMLDivElement>(null);

  // Connectors State
  const [connectors, setConnectors] = useState<Record<ConnectorId, ConnectorConfig>>({
    google: {
      connected: true,
      title: "Google Suite",
      account: "ads@nexus-growth.com",
      lastSync: "3m ago",
      dataSummary: "Ads & GA4 synchronized",
      meta: { adsCustomerId: "842-192-4910", ga4PropertyId: "G-NEXUS99182" },
    },
    email: {
      connected: true,
      title: "Email & Gmail",
      account: "marketing@nexus-ai.agency",
      lastSync: "2m ago",
      dataSummary: "Broadcasts active (42% open rate)",
      meta: { provider: "gmail", smtpHost: "smtp.gmail.com:587" },
    },
    excel: {
      connected: true,
      title: "Excel / CSV Data",
      account: "Q3_Lead_Campaign.csv",
      lastSync: "10m ago",
      dataSummary: "1,240 records active",
      meta: { fileName: "Q3_Lead_Campaign.csv", rowCount: "1240" },
    },
    notion: {
      connected: true,
      title: "Notion Workspace",
      account: "Nexus Marketing Hub",
      lastSync: "1h ago",
      dataSummary: "18 briefs & GTM roadmap synced",
      meta: { workspace: "Nexus Marketing Hub" },
    },
    slack: {
      connected: true,
      title: "Slack Alerts",
      account: "#marketing-alerts",
      lastSync: "5m ago",
      dataSummary: "Real-time alerts active",
      meta: { channel: "#marketing-alerts" },
    },
    looker: {
      connected: true,
      title: "Looker / BI Data",
      account: "nexus_bi_analytics_prod",
      lastSync: "15m ago",
      dataSummary: "BigQuery warehouse pipeline operational",
      meta: { datasetId: "nexus_bi_analytics_prod" },
    },
    claude: {
      connected: true,
      title: "Claude AI Core",
      account: "Claude 3.7 Sonnet (Auto-routing)",
      lastSync: "1m ago",
      dataSummary: "Reasoning pipeline verified",
      meta: { model: "Claude 3.7 Sonnet" },
    },
    hubspot: {
      connected: false,
      title: "HubSpot CRM",
      meta: {},
    },
  });

  const [activeConnectorModal, setActiveConnectorModal] = useState<ConnectorId | null>(null);

  const handleUpdateConnector = (id: ConnectorId, updates: Partial<ConnectorConfig>) => {
    setConnectors((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...updates },
    }));
  };

  const handlePushLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [...prev.slice(-30), `[${timestamp}] ${message}`]);
  };

  // Generate logs
  useEffect(() => {
    const initialLogs = [
      "[SYSTEM] Bootstrapping Nexus marketing intelligence framework...",
      "[SYSTEM] Initializing 12 autonomous micro-agents...",
      "[SYSTEM] Active pipeline monitor: ₹10.6 Cr synchronized.",
      "[SYSTEM] Live shell terminal ready.",
      "[Strategy AI] Generated Q3 GTM brief for North America",
      "[Ads AI] Balanced daily budgets across channels",
      "[SEO AI] Audited organic traffic and indexing fixes",
    ];
    setLogs(initialLogs);
  }, []);

  // Periodically generate log messages
  useEffect(() => {
    const logGenerator = setInterval(() => {
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const randTask = randomAgent.working[Math.floor(Math.random() * randomAgent.working.length)];
      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setLogs((prev) => [...prev.slice(-25), `[${timestamp}] [${randomAgent.name}] ${randTask}`]);
    }, 2800);
    return () => clearInterval(logGenerator);
  }, [agents]);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [logs]);

  // Oscillate dashboard values automatically for a fully live feel
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats((prev) => ({
        tasksPerHour: Math.max(
          3100,
          Math.min(3900, prev.tasksPerHour + Math.floor(Math.random() * 51) - 25),
        ),
        systemLoad: Math.max(55, Math.min(80, prev.systemLoad + Math.floor(Math.random() * 5) - 2)),
      }));

      setAgents((prev) => {
        const randIdx = Math.floor(Math.random() * prev.length);
        return prev.map((ag, idx) => {
          if (idx === randIdx) {
            const loadDiff = Math.floor(Math.random() * 7) - 3;
            const newLoad = Math.max(30, Math.min(95, ag.load + loadDiff));
            const tasksDiff = Math.floor(Math.random() * 3) + 1;

            // Adjust metrics slightly
            let newMetric = ag.metric;
            if (ag.name === "SEO AI") {
              const base = parseInt(ag.metric);
              newMetric = Math.max(
                92,
                Math.min(98, base + (Math.random() > 0.5 ? 1 : -1)),
              ).toString();
            } else if (ag.name === "Strategy AI") {
              newMetric = (parseInt(ag.metric) + (Math.random() > 0.85 ? 1 : 0)).toString();
            }

            return {
              ...ag,
              load: newLoad,
              tasksDone: ag.tasksDone + tasksDiff,
              metric: newMetric,
            };
          }
          return ag;
        });
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleTaskComplete = (agentName: string) => {
    setAgents((prev) =>
      prev.map((ag) => {
        if (ag.name === agentName) {
          return {
            ...ag,
            tasksDone: ag.tasksDone + 1,
            load: Math.min(98, ag.load + 4),
          };
        }
        return ag;
      }),
    );
  };

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  // Sync selected agent details with latest live data
  const liveSelected = selected ? agents.find((a) => a.name === selected.name) || selected : null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030305] text-white">
      {/* 3-D Neural Network Background */}
      <NeuralBackground />

      {/* Layered atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,122,0,0.15), transparent 60%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(255,180,0,0.08), transparent 70%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(255,80,0,0.08), transparent 70%)",
        }}
      />
      {/* Fine grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,140,60,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,140,60,0.04) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.88) 100%)",
        }}
      />
      {/* Scan line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60 z-[2]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,122,0,0.95), transparent)",
          animation: "scan 9s linear infinite",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-white/80 backdrop-blur-md transition hover:border-white/30 hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[#FF7A00] via-[#FFB300] to-[#FFC857] shadow-[0_0_20px_rgba(255,122,0,0.7)]" />
              <span className="text-sm font-semibold tracking-wide">
                NEXUS<span className="text-white/40">.AI</span>
              </span>
            </div>
          </div>

          {/* Connected Integrations Badge Bar */}
          <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 rounded-full px-3.5 py-1.5 backdrop-blur-md w-fit self-center sm:self-auto">
            <span className="text-[10px] uppercase tracking-[0.14em] text-white/40 mr-0.5 hidden xs:inline">
              Connectors:
            </span>

            {/* Google */}
            <button
              type="button"
              onClick={() => setActiveConnectorModal("google")}
              className="group relative flex items-center justify-center transition hover:scale-110 focus:outline-none"
              title="Google Ads & GA4 Connector"
            >
              <div
                className={`h-2 w-2 rounded-full absolute -top-0.5 -right-0.5 border border-[#080808] ${
                  connectors.google?.connected ? "bg-blue-400 animate-pulse" : "bg-white/30"
                }`}
              />
              <svg
                className={`h-4.5 w-4.5 transition ${connectors.google?.connected ? "text-blue-400" : "text-white/40"}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded bg-black/95 border border-white/10 px-2 py-1 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-30 shadow-lg">
                Google · {connectors.google?.connected ? "Connected" : "Click to connect"}
              </span>
            </button>

            {/* Email / Gmail */}
            <button
              type="button"
              onClick={() => setActiveConnectorModal("email")}
              className="group relative flex items-center justify-center transition hover:scale-110 focus:outline-none"
              title="Email / Gmail Dispatch & Test Sender"
            >
              <div
                className={`h-2 w-2 rounded-full absolute -top-0.5 -right-0.5 border border-[#080808] ${
                  connectors.email?.connected ? "bg-red-500 animate-pulse" : "bg-white/30"
                }`}
              />
              <svg
                className={`h-4.5 w-4.5 transition ${
                  connectors.email?.connected ? "text-red-500" : "text-white/40"
                }`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded bg-black/95 border border-white/10 px-2 py-1 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-30 shadow-lg">
                Email · {connectors.email?.connected ? "Live" : "Click to connect"}
              </span>
            </button>

            {/* Excel */}
            <button
              type="button"
              onClick={() => setActiveConnectorModal("excel")}
              className="group relative flex items-center justify-center transition hover:scale-110 focus:outline-none"
              title="Excel / CSV Data Ingestion"
            >
              <div
                className={`h-2 w-2 rounded-full absolute -top-0.5 -right-0.5 border border-[#080808] ${
                  connectors.excel?.connected ? "bg-emerald-500 animate-pulse" : "bg-white/30"
                }`}
              />
              <svg
                className={`h-4.5 w-4.5 transition ${
                  connectors.excel?.connected ? "text-emerald-500" : "text-white/40"
                }`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14.5 12H19v5h-4.5v-5zm-5.5 0h4.5v5H9v-5zm10-7h-16c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-11 5H4V7h4v3zm5.5 0H9.5V7h4v3zm5.5 0h-4.5V7H19v3z" />
              </svg>
              <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded bg-black/95 border border-white/10 px-2 py-1 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-30 shadow-lg">
                Excel · {connectors.excel?.connected ? "Connected" : "Click to connect"}
              </span>
            </button>

            {/* Notion */}
            <button
              type="button"
              onClick={() => setActiveConnectorModal("notion")}
              className="group relative flex items-center justify-center transition hover:scale-110 focus:outline-none"
              title="Notion Workspace Sync"
            >
              <div
                className={`h-2 w-2 rounded-full absolute -top-0.5 -right-0.5 border border-[#080808] ${
                  connectors.notion?.connected ? "bg-slate-300 animate-pulse" : "bg-white/30"
                }`}
              />
              <svg
                className={`h-4.5 w-4.5 transition ${
                  connectors.notion?.connected ? "text-white/90" : "text-white/40"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
              </svg>
              <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded bg-black/95 border border-white/10 px-2 py-1 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-30 shadow-lg">
                Notion · {connectors.notion?.connected ? "Connected" : "Click to connect"}
              </span>
            </button>

            {/* Slack */}
            <button
              type="button"
              onClick={() => setActiveConnectorModal("slack")}
              className="group relative flex items-center justify-center transition hover:scale-110 focus:outline-none"
              title="Slack Alerts Channel"
            >
              <div
                className={`h-2 w-2 rounded-full absolute -top-0.5 -right-0.5 border border-[#080808] ${
                  connectors.slack?.connected ? "bg-purple-400 animate-pulse" : "bg-white/30"
                }`}
              />
              <svg
                className={`h-4.5 w-4.5 transition ${connectors.slack?.connected ? "text-purple-400" : "text-white/40"}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" />
              </svg>
              <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded bg-black/95 border border-white/10 px-2 py-1 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-30 shadow-lg">
                Slack · {connectors.slack?.connected ? "Connected" : "Click to connect"}
              </span>
            </button>

            {/* Looker */}
            <button
              type="button"
              onClick={() => setActiveConnectorModal("looker")}
              className="group relative flex items-center justify-center transition hover:scale-110 focus:outline-none"
              title="Looker BI & BigQuery Data"
            >
              <div
                className={`h-2 w-2 rounded-full absolute -top-0.5 -right-0.5 border border-[#080808] ${
                  connectors.looker?.connected ? "bg-amber-400 animate-pulse" : "bg-white/30"
                }`}
              />
              <svg
                className={`h-4.5 w-4.5 transition ${connectors.looker?.connected ? "text-amber-400" : "text-white/40"}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
              <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded bg-black/95 border border-white/10 px-2 py-1 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-30 shadow-lg">
                Looker · {connectors.looker?.connected ? "Connected" : "Click to connect"}
              </span>
            </button>

            {/* Manage all connectors button */}
            <button
              type="button"
              onClick={() => setActiveConnectorModal("email")}
              className="ml-1 flex items-center gap-1 rounded-full bg-white/[0.08] hover:bg-[#FF7A00]/20 hover:border-[#FF7A00]/40 border border-transparent px-2.5 py-1 text-[9px] font-semibold text-white/80 transition"
              title="Manage All Connectors"
            >
              <Plus className="h-3 w-3 text-[#FF7A00]" />
              <span className="hidden sm:inline">Connect</span>
            </button>
          </div>

          <span className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/45 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF7A00] shadow-[0_0_10px_rgba(255,122,0,1)] animate-pulse" />
            Control Center · 12 agents online
          </span>
        </header>

        <section className="mt-10 animate-fade-in">
          <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl text-white w-full max-w-none">
            Your AI marketing agency,{" "}
            <span
              className="bg-gradient-to-r from-[#FF7A00] via-[#FFB300] to-[#FFC857] bg-clip-text text-transparent"
              style={{ filter: "drop-shadow(0 0 24px rgba(255,122,0,0.4))" }}
            >
              fully operational
            </span>
            .
          </h1>
        </section>

        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Agents online" value="12 / 12" accent="orange" icon={Activity} />
          <StatTile
            label="Tasks / hour"
            value={systemStats.tasksPerHour.toLocaleString()}
            accent="amber"
            icon={Zap}
          />
          <StatTile label="Pipeline" value="₹10.6 Cr" accent="gold" icon={BarChart3} />
          <StatTile
            label="System load"
            value={`${systemStats.systemLoad}%`}
            accent="orange"
            icon={Cpu}
          />
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4 items-start">
          {/* ── Futuristic Agent Network Panel ── */}
          <AgentNetworkPanel
            agents={agents}
            logs={logs}
            onOpenUpload={() => setActiveConnectorModal("excel")}
          />

          {/* 12 Agent Cards Grid on the Right */}
          <section
            className="lg:col-span-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 h-[580px] overflow-y-auto pr-1 pb-4 no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {agents.map((agent, i) => (
              <AgentCard
                key={agent.name}
                agent={agent}
                index={i}
                onOpen={() => setSelected(agent)}
              />
            ))}
          </section>
        </div>

        <footer className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-2.5 py-4 text-[10px] uppercase tracking-[0.22em] text-white/35 text-center sm:text-left">
          <span>Nexus Core v3.0</span>
          <span className="hidden sm:inline">Lat 14ms · GPU 38% · Tokens 2.4M/s</span>
          <span>© 2026 Nexus AI · Built by mohammad hasim</span>
        </footer>
      </div>

      {liveSelected && (
        <AgentModal
          agent={liveSelected}
          onClose={() => setSelected(null)}
          onTaskCompleted={handleTaskComplete}
          onOpenConnector={(id) => setActiveConnectorModal(id)}
        />
      )}

      <IntegrationsModal
        isOpen={activeConnectorModal !== null}
        initialConnector={activeConnectorModal || "excel"}
        onClose={() => setActiveConnectorModal(null)}
        connectors={connectors}
        onUpdateConnector={handleUpdateConnector}
        onPushLog={handlePushLog}
      />
    </div>
  );
}

function AgentModal({
  agent,
  onClose,
  onTaskCompleted,
  onOpenConnector,
}: {
  agent: Agent;
  onClose: () => void;
  onTaskCompleted: (name: string) => void;
  onOpenConnector: (connectorId: ConnectorId) => void;
}) {
  const a = ACCENT[agent.accent];
  const Icon = agent.icon;
  const detail = AGENT_DETAILS[agent.name];
  const commands = AGENT_COMMANDS[agent.name] || [];

  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    setTerminalLogs([
      `[system] Secure shell established with ${agent.name}...`,
      `[system] Sync status: OK (lat: 14ms)`,
      `[system] Listening for manual override commands.`,
    ]);
    setIsExecuting(false);
  }, [agent.name]);

  useEffect(() => {
    const el = document.getElementById("terminal-logs");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [terminalLogs, isExecuting]);

  const handleExecuteCommand = (cmd: { cmd: string; steps: string[] }) => {
    if (isExecuting) return;
    setIsExecuting(true);

    setTerminalLogs((prev) => [...prev, `> executing overriding action: ${cmd.cmd}`]);

    let stepIdx = 0;
    const runStep = () => {
      if (stepIdx < cmd.steps.length) {
        const timestamp = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setTerminalLogs((prev) => [...prev, `[${timestamp}] ${cmd.steps[stepIdx]}`]);
        stepIdx++;
        const nextTimer = setTimeout(runStep, 900 + Math.random() * 400);
        timeoutsRef.current.push(nextTimer);
      } else {
        setIsExecuting(false);
        setTerminalLogs((prev) => [...prev, `[system] Override action completed successfully.`]);
        onTaskCompleted(agent.name);
      }
    };

    const initialTimer = setTimeout(runStep, 500);
    timeoutsRef.current.push(initialTimer);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${agent.name} details`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(16px)" }}
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className="relative w-full max-w-3xl animate-scale-in overflow-hidden rounded-2xl sm:rounded-3xl max-h-[92vh] flex flex-col my-auto"
        style={{
          background: "linear-gradient(145deg, rgba(16,16,18,0.98), rgba(10,10,12,0.99))",
          border: `1px solid rgba(${a.rgb},0.3)`,
          boxShadow: `0 40px 120px -20px rgba(${a.rgb},0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden"
        >
          <div
            className="absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
            style={{ background: `rgb(${a.rgb})` }}
          />
          <div
            className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full opacity-10 blur-3xl"
            style={{ background: `rgb(${a.rgb})` }}
          />
        </div>
        {/* Fine grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Top border glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${a.rgb},0.8), transparent)`,
          }}
        />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 z-20 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/60 backdrop-blur-md transition hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ── Premium Header ─────────────────────────────── */}
        <div className="relative flex items-center gap-3.5 sm:gap-5 border-b border-white/[0.06] px-4 py-4 sm:px-7 sm:py-6 flex-none pr-12 sm:pr-14">
          {/* Rotating SVG ring icon */}
          <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-none">
            <svg
              className="absolute inset-0 h-12 w-12 sm:h-16 sm:w-16 animate-radar"
              viewBox="0 0 80 80"
              style={{ animationDuration: "8s" }}
            >
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke={`rgba(${a.rgb},0.15)`}
                strokeWidth="2"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke={`rgba(${a.rgb},0.7)`}
                strokeWidth="2"
                strokeDasharray="40 174"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px rgba(${a.rgb},1))` }}
              />
            </svg>
            <div
              className="absolute inset-[6px] sm:inset-[10px] flex items-center justify-center rounded-full"
              style={{
                background: `linear-gradient(135deg, rgba(${a.rgb},0.25), rgba(0,0,0,0.6))`,
                border: `1px solid rgba(${a.rgb},0.3)`,
              }}
            >
              <span style={{ filter: `drop-shadow(0 0 8px rgba(${a.rgb},0.9))` }}>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${a.text}`} />
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] ${a.text}`}>
                Agent · {agent.status}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/35 truncate max-w-[140px] sm:max-w-none">
                {agent.role}
              </span>
            </div>
            <h2 className="mt-0.5 sm:mt-1 text-xl sm:text-3xl font-black tracking-tight text-white">{agent.name}</h2>
            <div className="mt-1.5 sm:mt-2 flex items-center gap-2 sm:gap-3 flex-wrap">
              <div
                className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-semibold"
                style={{
                  background: `rgba(${a.rgb},0.12)`,
                  border: `1px solid rgba(${a.rgb},0.3)`,
                  color: `rgb(${a.rgb})`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: `rgb(${a.rgb})` }}
                />
                {agent.tasksDone.toLocaleString("en-US")} tasks
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] text-white/50">
                Load: {agent.load}%
              </div>
            </div>
          </div>
        </div>

        {/* ── Modal body ─────────────────────────────────── */}
        <div className="relative flex-1 overflow-y-auto no-scrollbar px-4 sm:px-7 pb-6">
          <div className="relative grid gap-5 sm:grid-cols-[180px_1fr] sm:gap-8 pt-4 sm:pt-6">
            {/* 3D rotating cube */}
            <div className="flex items-center justify-center">
              <div className="relative h-36 w-36" style={{ perspective: "800px" }}>
                <div
                  className="relative h-full w-full"
                  style={{
                    transformStyle: "preserve-3d",
                    animation: "agent-cube-spin 9s linear infinite",
                  }}
                >
                  {[
                    { t: "rotateY(0deg) translateZ(72px)" },
                    { t: "rotateY(90deg) translateZ(72px)" },
                    { t: "rotateY(180deg) translateZ(72px)" },
                    { t: "rotateY(-90deg) translateZ(72px)" },
                    { t: "rotateX(90deg) translateZ(72px)" },
                    { t: "rotateX(-90deg) translateZ(72px)" },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className={`absolute inset-0 flex items-center justify-center rounded-2xl border ${a.text}`}
                      style={{
                        transform: f.t,
                        background: `linear-gradient(135deg, rgba(${a.rgb},0.22), rgba(255,255,255,0.02))`,
                        borderColor: `rgba(${a.rgb},0.35)`,
                        boxShadow: `inset 0 0 30px rgba(${a.rgb},0.35), 0 0 30px rgba(${a.rgb},0.35)`,
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <Icon className="h-10 w-10" />
                    </div>
                  ))}
                </div>
                <div
                  aria-hidden
                  className="absolute left-1/2 top-full h-6 w-28 -translate-x-1/2 rounded-full blur-2xl"
                  style={{ background: `rgba(${a.rgb},0.55)` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] uppercase tracking-[0.22em] ${a.text}`}>
                  Agent · {agent.status}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-white/45 truncate max-w-[200px]">
                  {agent.role}
                </span>
              </div>
              <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {agent.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {detail?.summary ?? "Specialized AI agent in the Nexus orchestration layer."}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {(detail?.activity ?? []).map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur"
                    style={{ boxShadow: `0 0 30px -18px rgba(${a.rgb},0.7)` }}
                  >
                    <div className="text-[9px] uppercase tracking-[0.18em] text-white/40">
                      {s.label}
                    </div>
                    <div
                      className="mt-0.5 text-base font-semibold text-white"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {s.label === "Assets today" && agent.name === "Content AI"
                        ? agent.tasksDone.toLocaleString()
                        : s.label === "Keywords" && agent.name === "SEO AI"
                          ? agent.tasksDone.toLocaleString()
                          : s.label === "Leads today" && agent.name === "Lead Generation AI"
                            ? agent.tasksDone.toLocaleString()
                            : s.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Interactive Console */}
              <div
                className="mt-5 rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-[11px]"
                style={{ boxShadow: `inset 0 0 20px rgba(${a.rgb},0.15)` }}
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[9px] uppercase tracking-wider text-white/55">
                  <span>{agent.name} Overriding Shell</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Shell Connected
                  </span>
                </div>
                <div
                  id="terminal-logs"
                  className="mt-3 h-28 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-white/10 text-white/70"
                  style={{ scrollbarWidth: "none" }}
                >
                  {terminalLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log.startsWith(">") ? "text-[#FF7A00] font-semibold" : "text-white/80"
                      }
                    >
                      {log}
                    </div>
                  ))}
                  {isExecuting && (
                    <div className="flex items-center gap-1 text-white/40 mt-1 pl-1">
                      <span>running process</span>
                      <span
                        className="h-1 w-1 rounded-full bg-current animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-1 w-1 rounded-full bg-current animate-bounce"
                        style={{ animationDelay: "200ms" }}
                      />
                      <span
                        className="h-1 w-1 rounded-full bg-current animate-bounce"
                        style={{ animationDelay: "400ms" }}
                      />
                    </div>
                  )}
                </div>
                {commands.length > 0 && (
                  <div className="mt-3 border-t border-white/5 pt-3">
                    <div className="text-[9px] text-white/40 mb-2">Execute Override Action:</div>
                    <div className="flex flex-wrap gap-2">
                      {commands.map((cmd) => (
                        <button
                          key={cmd.cmd}
                          disabled={isExecuting}
                          onClick={() => handleExecuteCommand(cmd)}
                          className="rounded border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[10px] text-white/80 transition hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/10 disabled:opacity-50 disabled:hover:border-white/10 disabled:hover:bg-transparent cursor-pointer"
                        >
                          {cmd.cmd}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                  Capabilities
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(detail?.capabilities ?? []).map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/75"
                    >
                      <CheckCircle2 className={`h-3 w-3 ${a.text}`} />
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Connected Platforms ─────────────────────────── */}
              {detail?.platforms && detail.platforms.length > 0 && (
                <div className="mt-5">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/45 mb-3">
                    Connected Platforms
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {detail.platforms.map((platform) => (
                      <button
                        type="button"
                        key={platform.name}
                        onClick={() => {
                          onClose();
                          onOpenConnector(mapPlatformToConnector(platform.name));
                        }}
                        className="group relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-left cursor-pointer transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 focus:outline-none"
                        style={{
                          background: platform.bg,
                          border: `1px solid ${platform.color}30`,
                          boxShadow: `0 4px 20px -6px ${platform.color}40, inset 0 1px 0 rgba(255,255,255,0.08)`,
                        }}
                      >
                        {/* Subtle top glow streak */}
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-xl"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${platform.color}70, transparent)`,
                          }}
                        />
                        {/* Logo circle */}
                        <div
                          className="flex h-8 w-8 flex-none items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-110"
                          style={{
                            background: `${platform.color}18`,
                            border: `1px solid ${platform.color}40`,
                            boxShadow: `0 0 12px ${platform.color}30`,
                          }}
                        >
                          {platform.icon}
                        </div>
                        {/* Name */}
                        <div>
                          <div
                            className="text-[11px] font-semibold leading-tight"
                            style={{ color: platform.color }}
                          >
                            {platform.name}
                          </div>
                          <div className="text-[9px] text-white/50 mt-0.5 flex items-center gap-1 group-hover:text-white transition">
                            <span
                              className="h-1 w-1 rounded-full animate-pulse"
                              style={{ background: platform.color }}
                            />
                            Configure ⚡
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                    Recent activity
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] ${a.text}`}>
                    <TrendingUp className="h-3 w-3" /> live
                  </span>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {(detail?.recent ?? []).map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-[12px] text-white/75"
                    >
                      <span
                        className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full"
                        style={{ background: `rgb(${a.rgb})`, boxShadow: `0 0 8px rgb(${a.rgb})` }}
                      />
                      <span className="flex-1">{r.text}</span>
                      <span className="font-mono text-[10px] text-white/35">{r.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* end grid */}
        </div>
        {/* end scrollable body */}
      </div>
      {/* end modal panel */}
    </div>
  );
}
