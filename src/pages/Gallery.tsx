import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FlaskConical, Search, Filter, Award, Clock, LayoutGrid } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Project, Hackathon, ProjectStatus } from "../lib/types";
import { extractHackathonName } from "../lib/types";

export default function Gallery() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [hackathonFilter, setHackathonFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"time" | "award">("time");

  useEffect(() => {
    (async () => {
      const [{ data: hData }, { data: pData }] = await Promise.all([
        supabase.from("hackathons").select("*").order("created_at", { ascending: false }),
        supabase
          .from("projects")
          .select("*, hackathons(name)")
          .order("created_at", { ascending: false }),
      ]);
      setHackathons(hData || []);
      setProjects(
        (pData || []).map((p) => ({
          ...p,
          hackathon_name: extractHackathonName(p as Record<string, unknown>),
        })) as Project[]
      );
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let result = projects;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.one_liner.toLowerCase().includes(q) ||
          p.tech_stack?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (hackathonFilter !== "all") {
      result = result.filter((p) => p.hackathon_id === hackathonFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (sortBy === "award") {
      result = [...result].sort((a, b) => {
        if (a.award && !b.award) return -1;
        if (!a.award && b.award) return 1;
        return 0;
      });
    }
    return result;
  }, [projects, search, hackathonFilter, statusFilter, sortBy]);

  const statusLabels: Record<ProjectStatus, string> = {
    draft: "草稿",
    published: "已发布",
    awarded: "已获奖",
  };

  const statusColors: Record<ProjectStatus, string> = {
    draft: "bg-neutral-500/20 text-neutral-300 border-neutral-500/30",
    published: "bg-secondary/20 text-secondary border-secondary/30",
    awarded: "bg-accent/20 text-accent border-accent/30",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">作品库</h1>
        <p className="text-neutral-400">浏览所有黑客松参赛作品</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 mb-8 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索项目名称、介绍或技术栈..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Filter className="w-4 h-4" />
            筛选
          </div>

          <select
            value={hackathonFilter}
            onChange={(e) => setHackathonFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-sm text-white focus:border-primary/50 focus:outline-none transition-all"
          >
            <option value="all">全部场次</option>
            {hackathons.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "all")}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-sm text-white focus:border-primary/50 focus:outline-none transition-all"
          >
            <option value="all">全部状态</option>
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
            <option value="awarded">已获奖</option>
          </select>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setSortBy("time")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                sortBy === "time"
                  ? "bg-primary/10 text-primary"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Clock className="w-4 h-4" />
              按提交时间
            </button>
            <button
              onClick={() => setSortBy("award")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                sortBy === "award"
                  ? "bg-accent/10 text-accent"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Award className="w-4 h-4" />
              按奖项
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-full" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <LayoutGrid className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-400 text-lg">还没有作品</p>
          <Link to="/submit" className="btn-primary inline-flex mt-4">
            提交第一个作品
          </Link>
        </div>
      ) : (
        <>
          <div className="text-sm text-neutral-400 mb-4">
            共 {filtered.length} 个作品
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="glass rounded-2xl overflow-hidden card-glow-hover group"
              >
                <div className="aspect-video bg-gradient-to-br from-bg-card to-bg-hover relative overflow-hidden">
                  {project.screenshots && project.screenshots.length > 0 ? (
                    <img
                      src={project.screenshots[0]}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FlaskConical className="w-12 h-12 text-neutral-600" />
                    </div>
                  )}
                  {project.status === "awarded" && (
                    <div className="absolute top-3 right-3">
                      <span className="tag bg-accent text-white border border-accent/50 shadow-lg">
                        <Award className="w-3 h-3" />
                        {project.award || "获奖"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`tag ${statusColors[project.status]}`}>
                      {statusLabels[project.status]}
                    </span>
                    {project.hackathon_name && (
                      <span className="text-xs text-neutral-500">{project.hackathon_name}</span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-neutral-400 text-sm line-clamp-2">{project.one_liner}</p>
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.tech_stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="tag bg-primary/10 text-primary border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 4 && (
                        <span className="tag bg-white/5 text-neutral-400">
                          +{project.tech_stack.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
