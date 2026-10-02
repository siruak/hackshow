import { useEffect, useState } from "react";
import {
  Settings,
  Plus,
  Trash2,
  Award,
  Calendar,
  FlaskConical,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Hackathon, Project, ProjectStatus } from "../lib/types";
import { extractHackathonName } from "../lib/types";

export default function Admin() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddHackathon, setShowAddHackathon] = useState(false);
  const [newHackathon, setNewHackathon] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const loadData = async () => {
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
  };

  useEffect(() => {
    loadData();
  }, []);

  const addHackathon = async () => {
    if (!newHackathon.name.trim()) return;
    await supabase.from("hackathons").insert({
      name: newHackathon.name.trim(),
      description: newHackathon.description.trim(),
      start_date: newHackathon.start_date || null,
      end_date: newHackathon.end_date || null,
    });
    setNewHackathon({ name: "", description: "", start_date: "", end_date: "" });
    setShowAddHackathon(false);
    loadData();
  };

  const deleteHackathon = async (id: string) => {
    if (!confirm("确认删除此场次？关联的项目也会被删除。")) return;
    await supabase.from("hackathons").delete().eq("id", id);
    loadData();
  };

  const updateProjectStatus = async (id: string, status: ProjectStatus) => {
    await supabase.from("projects").update({ status }).eq("id", id);
    loadData();
  };

  const updateProjectAward = async (id: string, award: string) => {
    const newStatus = award.trim() ? "awarded" : "published";
    await supabase.from("projects").update({ award: award.trim() || null, status: newStatus }).eq("id", id);
    loadData();
  };

  const deleteProject = async (id: string) => {
    if (!confirm("确认删除此项目？")) return;
    await supabase.from("projects").delete().eq("id", id);
    loadData();
  };

  const statusOptions: { v: ProjectStatus; l: string }[] = [
    { v: "draft", l: "草稿" },
    { v: "published", l: "已发布" },
    { v: "awarded", l: "已获奖" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="font-display text-3xl font-bold">主办方后台</h1>
          <p className="text-neutral-400 text-sm">管理黑客松场次与参赛作品</p>
        </div>
      </div>

      {/* Hackathons section */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-secondary" />
            黑客松场次
          </h2>
          <button
            onClick={() => setShowAddHackathon(true)}
            className="btn-secondary text-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> 添加场次
          </button>
        </div>

        {showAddHackathon && (
          <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/8 space-y-3 animate-slide-down">
            <input
              type="text"
              placeholder="场次名称"
              value={newHackathon.name}
              onChange={(e) => setNewHackathon({ ...newHackathon, name: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="场次描述（可选）"
              value={newHackathon.description}
              onChange={(e) => setNewHackathon({ ...newHackathon, description: e.target.value })}
              className="input-field"
            />
            <div className="flex gap-3">
              <input
                type="date"
                placeholder="开始日期"
                value={newHackathon.start_date}
                onChange={(e) => setNewHackathon({ ...newHackathon, start_date: e.target.value })}
                className="input-field flex-1"
              />
              <input
                type="date"
                placeholder="结束日期"
                value={newHackathon.end_date}
                onChange={(e) => setNewHackathon({ ...newHackathon, end_date: e.target.value })}
                className="input-field flex-1"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddHackathon(false)}
                className="btn-ghost text-sm"
              >
                取消
              </button>
              <button onClick={addHackathon} className="btn-primary text-sm">
                确认添加
              </button>
            </div>
          </div>
        )}

        {hackathons.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-6">还没有场次，点击上方添加</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {hackathons.map((h) => {
              const count = projects.filter((p) => p.hackathon_id === h.id).length;
              return (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/8"
                >
                  <div>
                    <div className="font-medium">{h.name}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">
                      {count} 个作品
                      {h.start_date && ` · ${h.start_date}`}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHackathon(h.id)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-error hover:bg-error/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Projects section */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-4">
          <FlaskConical className="w-5 h-5 text-primary" />
          参赛作品管理
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm">还没有参赛作品</p>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{project.title}</span>
                    {project.award && (
                      <span className="tag bg-accent/15 text-accent border border-accent/25 flex-shrink-0">
                        <Award className="w-3 h-3" />
                        {project.award}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-400 truncate">
                    {project.hackathon_name} · {project.one_liner}
                  </div>
                </div>

                {/* Status selector */}
                <select
                  value={project.status}
                  onChange={(e) => updateProjectStatus(project.id, e.target.value as ProjectStatus)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/8 text-xs text-white focus:border-primary/50 focus:outline-none"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.v} value={opt.v}>
                      {opt.l}
                    </option>
                  ))}
                </select>

                {/* Award input */}
                <input
                  type="text"
                  placeholder="奖项"
                  defaultValue={project.award || ""}
                  onBlur={(e) => {
                    if (e.target.value !== (project.award || "")) {
                      updateProjectAward(project.id, e.target.value);
                    }
                  }}
                  className="w-24 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/8 text-xs text-white placeholder-neutral-500 focus:border-accent/50 focus:outline-none"
                />

                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-error hover:bg-error/10 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
