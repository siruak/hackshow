export type ProjectStatus = "draft" | "published" | "awarded";

export interface Hackathon {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  hackathon_id: string;
  hackathon_name?: string;
  title: string;
  one_liner: string;
  description: string;
  tech_stack: string[];
  team_members: TeamMember[];
  links: ProjectLink[];
  screenshots: string[];
  potion_style: string[];
  award?: string;
  status: ProjectStatus;
  submitted_at: string;
  created_at: string;
}

export interface ProjectInput {
  hackathon_id: string;
  title: string;
  one_liner: string;
  description: string;
  tech_stack: string[];
  team_members: TeamMember[];
  links: ProjectLink[];
  screenshots: string[];
  potion_style: string[];
  status: ProjectStatus;
  award?: string;
}

export function extractHackathonName(row: Record<string, unknown>): string | undefined {
  const h = row.hackathons as Record<string, unknown> | undefined;
  return h?.name as string | undefined;
}

export const TECH_STACK_OPTIONS = [
  "React", "Vue", "Svelte", "Angular", "TypeScript", "JavaScript",
  "Python", "Go", "Rust", "Java", "Kotlin", "Swift",
  "Django", "Flask", "FastAPI", "Spring Boot", "Node.js",
  "PostgreSQL", "Redis", "SQLite", "Firebase", "Docker", "Kubernetes",
  "Tailwind CSS", "React Native", "Flutter", "Unity", "WebGL",
  "Solidity", "PyTorch", "TensorFlow", "LangChain", "OpenAI",
  "AWS", "Vercel", "GitHub", "Sass", "WebSocket",
];

// ─── Potion Style Design System ──────────────────────────────────────────────

export interface StyleDesignToken {
  key: string;
  label: string;
  color: string;
  colorEnd: string;
  fontFamily: string;
  fontWeight: number;
  borderRadius: number;
  shadowColor: string;
  shadowBlur: number;
  decorations: string[];
  mood: string;
}

export const POTION_STYLES: StyleDesignToken[] = [
  {
    key: "tech",
    label: "技术",
    color: "#00ff88",
    colorEnd: "#1a1a1a",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    borderRadius: 4,
    shadowColor: "#00ff88",
    shadowBlur: 12,
    decorations: ["grid-lines"],
    mood: "专业可靠",
  },
  {
    key: "vitality",
    label: "活力",
    color: "#ff6b35",
    colorEnd: "#ff2e88",
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 800,
    borderRadius: 24,
    shadowColor: "#ff6b35",
    shadowBlur: 16,
    decorations: ["polka-dots"],
    mood: "兴奋年轻",
  },
  {
    key: "premium",
    label: "高级",
    color: "#d4af37",
    colorEnd: "#111111",
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    borderRadius: 8,
    shadowColor: "#d4af37",
    shadowBlur: 8,
    decorations: ["gold-lines"],
    mood: "优雅精致",
  },
  {
    key: "warm",
    label: "温暖",
    color: "#ffe8a3",
    colorEnd: "#fdf6e3",
    fontFamily: "'Ma Shan Zheng', cursive",
    fontWeight: 400,
    borderRadius: 20,
    shadowColor: "#ffd54f",
    shadowBlur: 14,
    decorations: ["soft-glow"],
    mood: "亲切舒服",
  },
  {
    key: "cool",
    label: "炫酷",
    color: "#7b2ff7",
    colorEnd: "#000000",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 800,
    borderRadius: 12,
    shadowColor: "#9b59b6",
    shadowBlur: 20,
    decorations: ["neon-glow"],
    mood: "震撼酷炫",
  },
  {
    key: "future",
    label: "未来",
    color: "#00d4ff",
    colorEnd: "#0a192f",
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 400,
    borderRadius: 16,
    shadowColor: "#00d4ff",
    shadowBlur: 18,
    decorations: ["particles"],
    mood: "前卫科幻",
  },
];

// ─── Style Mixing Engine ─────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => Math.round(v).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function averageColor(colors: string[]): string {
  if (colors.length === 0) return "#00d9a3";
  const rgbs = colors.map(hexToRgb);
  const avg = rgbs.reduce(
    (acc, [r, g, b]) => [acc[0] + r, acc[1] + g, acc[2] + b],
    [0, 0, 0]
  ).map((v) => v / rgbs.length);
  return rgbToHex(avg[0], avg[1], avg[2]);
}

function averageRadius(values: number[]): number {
  if (values.length === 0) return 8;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function averageBlur(values: number[]): number {
  if (values.length === 0) return 12;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export interface BlendedStyle {
  dominantStyle: StyleDesignToken;
  background: string;
  fontFamily: string;
  fontWeight: number;
  borderRadius: number;
  shadowColor: string;
  shadowBlur: number;
  decorations: string[];
  allStyles: StyleDesignToken[];
}

export function blendStyles(selectedKeys: string[]): BlendedStyle | null {
  const selected = selectedKeys
    .map((key) => POTION_STYLES.find((s) => s.key === key))
    .filter(Boolean) as StyleDesignToken[];

  if (selected.length === 0) return null;

  // Count occurrences to find dominant (first if all unique, most frequent otherwise)
  const counts = new Map<string, number>();
  selected.forEach((s) => counts.set(s.key, (counts.get(s.key) || 0) + 1));
  let dominantKey = selected[0].key;
  let maxCount = 0;
  for (const [key, count] of counts) {
    if (count > maxCount) {
      maxCount = count;
      dominantKey = key;
    }
  }
  const dominant = selected.find((s) => s.key === dominantKey)!;

  // Average: borderRadius, shadowBlur
  const borderRadius = averageRadius(selected.map((s) => s.borderRadius));
  const shadowBlur = averageBlur(selected.map((s) => s.shadowBlur));

  // Average: shadowColor (RGB channel average)
  const shadowColor = averageColor(selected.map((s) => s.shadowColor));

  // Background: dominant style's gradient
  const background = `linear-gradient(135deg, ${dominant.color} 0%, ${dominant.colorEnd} 100%)`;

  // Font: dominant
  const fontFamily = dominant.fontFamily;
  const fontWeight = dominant.fontWeight;

  // Decorations: overlay (unique union)
  const seen = new Set<string>();
  const decorations: string[] = [];
  selected.forEach((s) => {
    s.decorations.forEach((d) => {
      if (!seen.has(d)) {
        seen.add(d);
        decorations.push(d);
      }
    });
  });

  return {
    dominantStyle: dominant,
    background,
    fontFamily,
    fontWeight,
    borderRadius,
    shadowColor,
    shadowBlur,
    decorations,
    allStyles: selected,
  };
}
