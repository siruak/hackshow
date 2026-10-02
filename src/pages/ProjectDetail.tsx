import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Award,
  Users,
  Code2,
  FlaskConical,
  Share2,
  Grid3x3,
  FileText,
  Monitor,
  Copy,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Project } from "../lib/types";
import { extractHackathonName } from "../lib/types";
import { POTION_STYLES, blendStyles } from "../lib/types";
import StylePreview from "../components/StylePreview";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const { data } = await supabase
        .from("projects")
        .select("*, hackathons(name)")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        setProject({
          ...data,
          hackathon_name: extractHackathonName(data as Record<string, unknown>),
        } as Project);
      }
      setLoading(false);
    })();
  }, [id]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateShareLink = () => {
    return `${window.location.origin}/project/${project?.id}`;
  };

  const generateGridHTML = () => {
    if (!project) return "";
    const images = project.screenshots?.length
      ? project.screenshots
      : ["https://placehold.co/400x400/0a0a0f/00d9a3?text=HackShow"];
    const items = [...images];
    while (items.length < 9) items.push("");

    return `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:600px;margin:0 auto;">
${items
  .map(
    (img, i) =>
      img
        ? `  <div style="aspect-ratio:1;background:url('${img}') center/cover;border-radius:8px;"></div>`
        : `  <div style="aspect-ratio:1;background:#13131c;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#48484a;">+</div>`
  )
  .join("\n")}
</div>`;
  };

  const generateArticleHTML = () => {
    if (!project) return "";
    return `<div style="max-width:640px;margin:0 auto;font-family:system-ui,sans-serif;color:#333;">
  <h2 style="font-size:24px;font-weight:bold;margin-bottom:8px;">${project.title}</h2>
  <p style="color:#666;margin-bottom:16px;">${project.one_liner}</p>
  <p style="line-height:1.6;margin-bottom:16px;">${project.description}</p>
  <div style="margin-bottom:16px;">
    ${project.tech_stack
      .map((t) => `<span style="display:inline-block;padding:2px 10px;background:#e8f5e9;border-radius:12px;font-size:12px;margin-right:4px;">${t}</span>`)
      .join("")}
  </div>
  <div style="margin-bottom:16px;">
    <strong>团队成员：</strong>${project.team_members?.map((m) => m.name).join("、") || "无"}
  </div>
  ${
    project.links?.length
      ? `<div><strong>相关链接：</strong><br/>${project.links.map((l) => `<a href="${l.url}">${l.label}</a>`).join("<br/>")}</div>`
      : ""
  }
</div>`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <FlaskConical className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
        <p className="text-neutral-400 text-lg mb-4">作品不存在</p>
        <Link to="/gallery" className="btn-primary">
          返回作品库
        </Link>
      </div>
    );
  }

  const potionColors = project.potion_style
    ?.map((key) => POTION_STYLES.find((p) => p.key === key))
    .filter(Boolean);

  const blend = blendStyles(project.potion_style || []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        返回
      </button>

      {/* Hero */}
      <div className="glass rounded-3xl overflow-hidden mb-6">
        {project.screenshots && project.screenshots.length > 0 ? (
          <div className="aspect-video relative group">
            <img
              src={project.screenshots[0]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setLightboxIndex(0)}
              className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white text-sm">
                全屏查看
              </span>
            </button>
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-bg-card to-bg-hover flex items-center justify-center">
            <FlaskConical className="w-20 h-20 text-neutral-600" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {project.hackathon_name && (
              <span className="tag bg-secondary/15 text-secondary border border-secondary/25">
                {project.hackathon_name}
              </span>
            )}
            {project.status === "awarded" && project.award && (
              <span className="tag bg-accent/20 text-accent border border-accent/30">
                <Award className="w-3 h-3" />
                {project.award}
              </span>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
            {project.title}
          </h1>
          <p className="text-lg text-neutral-300 mb-6">{project.one_liner}</p>

          {/* Tech stack */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                <Code2 className="w-4 h-4" />
                技术栈
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="tag bg-primary/10 text-primary border border-primary/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {project.description && (
            <div className="mb-6">
              <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          )}

          {/* Team */}
          {project.team_members && project.team_members.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-neutral-400 mb-3">
                <Users className="w-4 h-4" />
                团队成员
              </div>
              <div className="flex flex-wrap gap-3">
                {project.team_members.map((member, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/8"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-bold text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{member.name}</div>
                      {member.role && (
                        <div className="text-xs text-neutral-400">{member.role}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {project.links && project.links.length > 0 && (
            <div className="mb-6">
              <div className="text-sm text-neutral-400 mb-2">相关链接</div>
              <div className="flex flex-col gap-2">
                {project.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 hover:border-primary/30 hover:bg-white/8 transition-all group"
                  >
                    <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-primary" />
                    <span className="text-sm text-neutral-200">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Potion styles */}
          {potionColors && potionColors.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-neutral-400 mb-3">
                <FlaskConical className="w-4 h-4" />
                魔药风格
              </div>
              <div className="flex gap-2 mb-4">
                {potionColors.map((potion, i) => (
                  potion && (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white/10"
                      style={{
                        background: `linear-gradient(135deg, ${potion.color}, ${potion.colorEnd})`,
                        boxShadow: `0 0 12px ${potion.color}40`,
                      }}
                      title={potion.label}
                    />
                  )
                ))}
              </div>
              {blend && (
                <div className="bg-white/5 rounded-2xl p-5">
                  <StylePreview blend={blend} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Export section */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-primary" />
          一键导出
        </h3>
        {!showExport ? (
          <div className="grid sm:grid-cols-3 gap-3">
            <button
              onClick={() => setShowExport(true)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/8 hover:border-primary/30 transition-all group"
            >
              <Grid3x3 className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">社交媒体九宫格</span>
              <span className="text-xs text-neutral-500">3×3 布局大图</span>
            </button>
            <button
              onClick={() => setShowExport(true)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/8 hover:border-secondary/30 transition-all group"
            >
              <FileText className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">公众号推文 HTML</span>
              <span className="text-xs text-neutral-500">可复制到秀米</span>
            </button>
            <button
              onClick={() => navigate("/slideshow")}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/8 hover:border-accent/30 transition-all group"
            >
              <Monitor className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">路演大屏轮播</span>
              <span className="text-xs text-neutral-500">全屏自动翻页</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Share link */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/8">
              <span className="text-sm text-neutral-400 flex-shrink-0">分享链接</span>
              <input
                readOnly
                value={generateShareLink()}
                className="flex-1 bg-transparent text-sm text-white outline-none"
              />
              <button
                onClick={() => copyToClipboard(generateShareLink(), "link")}
                className="btn-ghost px-3 py-1.5 text-sm flex items-center gap-1.5"
              >
                {copied === "link" ? (
                  <>
                    <Check className="w-4 h-4 text-success" /> 已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> 复制链接
                  </>
                )}
              </button>
            </div>

            {/* Grid export */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Grid3x3 className="w-4 h-4 text-primary" />
                  九宫格预览
                </span>
                <button
                  onClick={() => copyToClipboard(generateGridHTML(), "grid")}
                  className="btn-ghost px-3 py-1.5 text-sm flex items-center gap-1.5"
                >
                  {copied === "grid" ? (
                    <>
                      <Check className="w-4 h-4 text-success" /> 已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> 复制 HTML
                    </>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 max-w-xs">
                {[...Array(9)].map((_, i) => {
                  const img = project.screenshots?.[i];
                  return img ? (
                    <div
                      key={i}
                      className="aspect-square rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  ) : (
                    <div
                      key={i}
                      className="aspect-square rounded-lg bg-bg-card flex items-center justify-center text-neutral-600 text-lg"
                    >
                      +
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Article HTML export */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-secondary" />
                  公众号推文 HTML
                </span>
                <button
                  onClick={() => copyToClipboard(generateArticleHTML(), "article")}
                  className="btn-ghost px-3 py-1.5 text-sm flex items-center gap-1.5"
                >
                  {copied === "article" ? (
                    <>
                      <Check className="w-4 h-4 text-success" /> 已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> 复制 HTML
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-neutral-500">
                生成 HTML 字符串，可复制到秀米/135编辑器
              </p>
            </div>

            <button
              onClick={() => setShowExport(false)}
              className="btn-ghost text-sm flex items-center gap-1.5"
            >
              <X className="w-4 h-4" /> 收起
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && project.screenshots && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(null);
            }}
          >
            <X className="w-6 h-6" />
          </button>
          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}
          {lightboxIndex < project.screenshots.length - 1 && (
            <button
              className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
          <img
            src={project.screenshots[lightboxIndex]}
            alt={`${project.title} ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
