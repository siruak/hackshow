import { Link } from "react-router-dom";
import {
  FlaskConical,
  Upload,
  Grid3x3,
  Share2,
  Monitor,
  Sparkles,
  ArrowRight,
  Zap,
  Palette,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Project } from "../lib/types";
import { extractHackathonName } from "../lib/types";

export default function Home() {
  const [stats, setStats] = useState({
    projects: 0,
    hackathons: 0,
    awarded: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  useEffect(() => {
    (async () => {
      const [{ count: projectCount }, { count: hackathonCount }, { count: awardedCount }, { data: recent }] =
        await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("hackathons").select("*", { count: "exact", head: true }),
          supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "awarded"),
          supabase
            .from("projects")
            .select("*, hackathons(name)")
            .order("created_at", { ascending: false })
            .limit(6),
        ]);
      setStats({
        projects: projectCount || 0,
        hackathons: hackathonCount || 0,
        awarded: awardedCount || 0,
      });
      if (recent) {
        setRecentProjects(
          recent.map((p) => ({
            ...p,
            hackathon_name: extractHackathonName(p as Record<string, unknown>),
          })) as Project[]
        );
      }
    })();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 animate-slide-down">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-neutral-200">黑客松作品统一收集与宣发平台</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-slide-up">
            让每一个
            <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
              创意
            </span>
            <br />
            都被看见
          </h1>

          <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            收集、展示、宣发黑客松作品。
            魔药定制风格、九宫格导出、路演大屏轮播，
            三步完成从提交到展示的全流程。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link to="/submit" className="btn-primary flex items-center gap-2 text-base px-7 py-3.5">
              <Upload className="w-5 h-5" />
              提交作品
            </Link>
            <Link to="/gallery" className="btn-secondary flex items-center gap-2 text-base px-7 py-3.5">
              <Grid3x3 className="w-5 h-5" />
              浏览作品库
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16">
            {[
              { label: "参赛作品", value: stats.projects, icon: FlaskConical, color: "text-primary" },
              { label: "黑客松场次", value: stats.hackathons, icon: Zap, color: "text-secondary" },
              { label: "获奖作品", value: stats.awarded, icon: Sparkles, color: "text-accent" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="glass rounded-2xl p-4 sm:p-6">
                  <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                  <div className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs sm:text-sm text-neutral-400 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4">功能亮点</h2>
        <p className="text-neutral-400 text-center mb-12 max-w-xl mx-auto">
          更便捷的三步流程，更直观的三栏联动
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: FlaskConical,
              title: "魔药定制",
              desc: "选择 5 种风格素材投入魔药瓶，为作品生成独特视觉风格",
              color: "from-primary/20 to-primary/5",
              iconColor: "text-primary",
            },
            {
              icon: Share2,
              title: "一键导出",
              desc: "社交媒体九宫格、公众号推文 HTML、分享链接，多种格式任选",
              color: "from-secondary/20 to-secondary/5",
              iconColor: "text-secondary",
            },
            {
              icon: Monitor,
              title: "路演大屏轮播",
              desc: "全屏幻灯片，10 秒自动翻页，支持键盘控制，路演展示利器",
              color: "from-accent/20 to-accent/5",
              iconColor: "text-accent",
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`glass rounded-2xl p-8 card-glow-hover relative overflow-hidden group`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* How it works */}
        <div className="mt-20">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-center mb-12">
            更便捷的三步流程
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "填写项目信息", icon: FileText, desc: "项目名称、一句话介绍、技术栈、团队成员" },
              { step: "02", title: "魔药定制风格", icon: Palette, desc: "选择风格素材，调配专属视觉" },
              { step: "03", title: "一键导出宣发", icon: Share2, desc: "九宫格、公众号、路演轮播" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="relative">
                  <div className="text-5xl font-brand font-bold text-white/5 absolute -top-4 -left-2">
                    {s.step}
                  </div>
                  <div className="relative glass rounded-2xl p-6">
                    <Icon className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-display text-lg font-bold mb-1">{s.title}</h4>
                    <p className="text-neutral-400 text-sm">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent projects */}
      {recentProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">最新作品</h2>
            <Link
              to="/gallery"
              className="flex items-center gap-1 text-primary hover:text-primary-light transition-colors text-sm font-medium"
            >
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
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
                </div>
                <div className="p-5">
                  <h4 className="font-display font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-neutral-400 text-sm line-clamp-2">{project.one_liner}</p>
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="tag bg-primary/10 text-primary border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <span className="tag bg-white/5 text-neutral-400">
                          +{project.tech_stack.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
