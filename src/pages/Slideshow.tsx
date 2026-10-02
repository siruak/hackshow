import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, FlaskConical, Award, Monitor } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Project } from "../lib/types";
import { extractHackathonName } from "../lib/types";

const AUTO_ADVANCE_MS = 10000;

export default function Slideshow() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("projects")
        .select("*, hackathons(name)")
        .in("status", ["published", "awarded"])
        .order("submitted_at", { ascending: false });
      if (data) {
        setProjects(
          data.map((p) => ({
            ...p,
            hackathon_name: extractHackathonName(p as Record<string, unknown>),
          })) as Project[]
        );
      }
    })();
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % Math.max(projects.length, 1));
  }, [projects.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + Math.max(projects.length, 1)) % Math.max(projects.length, 1));
  }, [projects.length]);

  useEffect(() => {
    if (paused || projects.length === 0) return;
    const timer = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [next, paused, projects.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") navigate(-1);
      else if (e.key === " ") setPaused((p) => !p);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, navigate]);

  if (projects.length === 0) {
    return (
      <div className="fixed inset-0 bg-bg flex items-center justify-center">
        <div className="text-center">
          <Monitor className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-400 text-lg mb-4">暂无可展示的作品</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            返回
          </button>
        </div>
      </div>
    );
  }

  const project = projects[current];

  return (
    <div
      className="fixed inset-0 bg-bg flex flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-primary" />
          <span className="font-brand font-bold text-sm">HackShow 路演大屏</span>
          <span className="text-neutral-400 text-sm ml-2">
            {current + 1} / {projects.length}
          </span>
          {paused && (
            <span className="ml-2 text-xs text-warning">已暂停</span>
          )}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-16">
        <div key={project.id} className="max-w-5xl w-full animate-scale-in">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Screenshot */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {project.screenshots && project.screenshots.length > 0 ? (
                <img
                  src={project.screenshots[0]}
                  alt={project.title}
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-bg-card to-bg-hover flex items-center justify-center">
                  <FlaskConical className="w-20 h-20 text-neutral-600" />
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {project.hackathon_name && (
                  <span className="tag bg-secondary/20 text-secondary border border-secondary/30">
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

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {project.title}
              </h1>

              <p className="text-lg sm:text-xl text-neutral-300 mb-6 leading-relaxed">
                {project.one_liner}
              </p>

              {project.description && (
                <p className="text-neutral-400 leading-relaxed mb-6 line-clamp-4">
                  {project.description}
                </p>
              )}

              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="tag bg-primary/10 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {project.team_members && project.team_members.length > 0 && (
                <div className="text-sm text-neutral-400">
                  团队：{project.team_members.map((m) => m.name).join("、")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nav buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
        <div
          key={current + (paused ? "p" : "r")}
          className="h-full bg-primary"
          style={{
            animation: paused
              ? "none"
              : `slideProgress ${AUTO_ADVANCE_MS}ms linear forwards`,
          }}
        />
      </div>

      <style>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
