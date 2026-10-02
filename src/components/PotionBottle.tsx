import { FlaskConical } from "lucide-react";
import { POTION_STYLES } from "../lib/types";

interface PotionBottleProps {
  selectedStyles: string[];
}

export default function PotionBottle({ selectedStyles }: PotionBottleProps) {
  const selected = selectedStyles
    .map((key) => POTION_STYLES.find((p) => p.key === key))
    .filter(Boolean) as typeof POTION_STYLES;

  const primaryColor = selected[0]?.color || "#00d9a3";
  const fillHeight = Math.min((selected.length / 5) * 100, 100);

  return (
    <div className="relative w-32 h-44 flex items-center justify-center">
      {selected.length > 0 && (
        <div
          className="absolute inset-0 rounded-full blur-2xl animate-pulse-slow pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 70%, ${primaryColor}30 0%, transparent 70%)`,
          }}
        />
      )}

      <svg viewBox="0 0 120 280" className="relative w-full h-full">
        <defs>
          <linearGradient id="liquidGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            {selected.map((s, i) => (
              <stop
                key={s.key}
                offset={`${15 + i * 18}%`}
                stopColor={s.color}
                stopOpacity="0.85"
              />
            ))}
            {selected.length === 0 && (
              <>
                <stop offset="0%" stopColor="#1a1a28" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#13131c" stopOpacity="0.3" />
              </>
            )}
          </linearGradient>
          <radialGradient id="bubbleGrad" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </radialGradient>
        </defs>

        <path
          d="M55,95 Q30,110 25,150 L25,240 Q25,275 60,280 L120,280 Q155,275 155,240 L155,150 Q150,110 125,95 Z"
          transform="translate(-30, 0)"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />

        {selected.length > 0 && (
          <g transform="translate(-30, 0)">
            <clipPath id="bottleClip">
              <path d="M55,95 Q30,110 25,150 L25,240 Q25,275 60,280 L120,280 Q155,275 155,240 L155,150 Q150,110 125,95 Z" />
            </clipPath>
            <rect
              x="20"
              y={280 - (fillHeight * 185) / 100}
              width="140"
              height={fillHeight * 1.85}
              fill="url(#liquidGrad)"
              clipPath="url(#bottleClip)"
            >
              <animate
                attributeName="y"
                values={`${280 - (fillHeight * 185) / 100};${280 - (fillHeight * 185) / 100 - 3};${280 - (fillHeight * 185) / 100}`}
                dur="3s"
                repeatCount="indefinite"
              />
            </rect>
          </g>
        )}

        <path
          d="M38,115 Q32,140 32,170 L32,230 Q32,255 50,265"
          transform="translate(-30, 0)"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <ellipse
          cx="45"
          cy="140"
          rx="4"
          ry="12"
          fill="rgba(255,255,255,0.12)"
          transform="translate(-30, 0)"
        />

        {selected.length > 0 &&
          [0, 1, 2, 3, 4].map((i) => (
            <circle
              key={i}
              cx={50 + i * 20}
              cy={250}
              r={3 + (i % 2)}
              fill="url(#bubbleGrad)"
              className={`animate-bubble-${i + 1}`}
              transform="translate(-30, 0)"
            />
          ))}

        {selected.length === 5 &&
          [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full animate-sparkle pointer-events-none"
              style={{
                background: primaryColor,
                left: `${30 + Math.random() * 40}%`,
                top: `${20 + Math.random() * 30}%`,
                animationDelay: `${i * 0.15}s`,
                boxShadow: `0 0 6px ${primaryColor}`,
              }}
            />
          ))}

        <ellipse
          cx="90"
          cy="95"
          rx="36"
          ry="5"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          transform="translate(-30, 0)"
        />
      </svg>

      {selected.length === 0 && (
        <div className="absolute -bottom-6 text-xs text-neutral-500 flex items-center gap-1">
          <FlaskConical className="w-3 h-3" />
          点击展开魔药定制
        </div>
      )}
      {selected.length > 0 && selected.length < 5 && (
        <div className="absolute -bottom-6 text-xs text-neutral-400">
          风格正在融合 ({selected.length}/5)
        </div>
      )}
    </div>
  );
}
