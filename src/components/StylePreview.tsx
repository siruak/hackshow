import type { BlendedStyle } from "../lib/types";

interface StylePreviewProps {
  blend: BlendedStyle | null;
}

function DecorationLayer({ decorations, color }: { decorations: string[]; color: string }) {
  return (
    <>
      {decorations.includes("grid-lines") && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(${color}40 1px, transparent 1px), linear-gradient(90deg, ${color}40 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
      )}
      {decorations.includes("polka-dots") && (
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle, ${color} 1.5px, transparent 1.5px)`,
            backgroundSize: "16px 16px",
          }}
        />
      )}
      {decorations.includes("gold-lines") && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />
      )}
      {decorations.includes("soft-glow") && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${color}40 0%, transparent 60%)`,
          }}
        />
      )}
      {decorations.includes("neon-glow") && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            boxShadow: `inset 0 0 30px ${color}, inset 0 0 60px ${color}80`,
          }}
        />
      )}
      {decorations.includes("particles") && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-float"
              style={{
                background: color,
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.5,
                boxShadow: `0 0 4px ${color}`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function StylePreview({ blend }: StylePreviewProps) {
  if (!blend) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-neutral-500 text-sm">
          选择风格后，此处将实时预览混合后的视觉效果
        </p>
      </div>
    );
  }

  const { dominantStyle, background, fontFamily, fontWeight, borderRadius, shadowColor, shadowBlur, decorations } = blend;
  const isLight = ["warm", "premium"].includes(dominantStyle.key);
  const textColor = isLight ? "#1a1a1a" : "#ffffff";
  const subColor = isLight ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)";

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="text-sm font-medium text-neutral-400 mb-1">实时风格预览</h4>
        <p className="text-xs text-neutral-500">
          主风格：{dominantStyle.label} · {dominantStyle.mood}
        </p>
      </div>

      {/* Preview card */}
      <div
        className="relative overflow-hidden transition-all duration-500"
        style={{
          background,
          borderRadius: `${borderRadius}px`,
          boxShadow: `0 0 ${shadowBlur}px ${shadowColor}40`,
          fontFamily,
        }}
      >
        <DecorationLayer decorations={decorations} color={shadowColor} />

        <div className="relative p-6 sm:p-8" style={{ color: textColor }}>
          {/* Title */}
          <h3
            style={{
              fontFamily,
              fontWeight,
              fontSize: "1.75rem",
              letterSpacing: dominantStyle.key === "premium" ? "0.05em" : "normal",
              marginBottom: "0.5rem",
            }}
          >
            示例项目标题
          </h3>

          {/* One-liner */}
          <p style={{ color: subColor, fontSize: "1rem", marginBottom: "1rem" }}>
            这是一句话介绍，展示混合后的字体与排版效果
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["React", "TypeScript", "Supabase"].map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "4px 12px",
                  borderRadius: `${Math.round(borderRadius * 0.6)}px`,
                  fontSize: "0.75rem",
                  color: textColor,
                  border: `1px solid ${shadowColor}60`,
                  background: `${shadowColor}15`,
                  fontFamily: dominantStyle.key === "tech" ? fontFamily : "inherit",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Button */}
          <button
            style={{
              padding: "8px 20px",
              borderRadius: `${borderRadius}px`,
              fontFamily,
              fontWeight,
              fontSize: "0.875rem",
              color: isLight ? textColor : shadowColor,
              border: `1.5px solid ${shadowColor}`,
              background: "transparent",
              boxShadow: decorations.includes("neon-glow") ? `0 0 12px ${shadowColor}60` : "none",
            }}
          >
            查看详情
          </button>

          {/* Team */}
          <div style={{ marginTop: "1.5rem", fontSize: "0.8rem", color: subColor }}>
            团队：张三、李四、王五
          </div>
        </div>
      </div>

      {/* Blend details */}
      <div className="glass rounded-xl p-4 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-neutral-500">圆角</span>
          <span className="text-neutral-300">{borderRadius}px（均值）</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">阴影色</span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: shadowColor, boxShadow: `0 0 6px ${shadowColor}` }}
            />
            <span className="text-neutral-300">{shadowColor}（RGB 均值）</span>
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">阴影模糊</span>
          <span className="text-neutral-300">{shadowBlur}px（均值）</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">字体</span>
          <span className="text-neutral-300" style={{ fontFamily }}>
            {dominantStyle.label}（主风格）
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">点缀叠加</span>
          <span className="text-neutral-300">
            {decorations.map((d) => {
              const labels: Record<string, string> = {
                "grid-lines": "网格线",
                "polka-dots": "波点",
                "gold-lines": "金线",
                "soft-glow": "柔光",
                "neon-glow": "霓虹",
                particles: "粒子",
              };
              return labels[d] || d;
            }).join(" + ")}
          </span>
        </div>
      </div>
    </div>
  );
}
