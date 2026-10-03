import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FlaskConical,
  Plus,
  X,
  Upload,
  Sparkles,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Hackathon, TeamMember, ProjectLink, ProjectStatus } from "../lib/types";
import { TECH_STACK_OPTIONS, POTION_STYLES, blendStyles } from "../lib/types";
import { useEffect, useMemo } from "react";
import PotionBottle from "../components/PotionBottle";
import StylePreview from "../components/StylePreview";

export default function Submit() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [hackathonId, setHackathonId] = useState("");
  const [title, setTitle] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "", role: "" },
  ]);
  const [links, setLinks] = useState<ProjectLink[]>([]);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [potionStyle, setPotionStyle] = useState<string[]>([]);
  const [status, setStatus] = useState<ProjectStatus>("published");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("hackathons").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setHackathons(data);
        setHackathonId(data[0].id);
      }
    })();
  }, []);

  const toggleTech = (tech: string) => {
    setTechStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", role: "" }]);
  };

  const removeTeamMember = (i: number) => {
    setTeamMembers(teamMembers.filter((_, idx) => idx !== i));
  };

  const updateTeamMember = (i: number, field: keyof TeamMember, value: string) => {
    setTeamMembers(
      teamMembers.map((m, idx) => (idx === i ? { ...m, [field]: value } : m))
    );
  };

  const addLink = () => {
    setLinks([...links, { label: "", url: "" }]);
  };

  const removeLink = (i: number) => {
    setLinks(links.filter((_, idx) => idx !== i));
  };

  const updateLink = (i: number, field: keyof ProjectLink, value: string) => {
    setLinks(links.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  };

  const addScreenshot = () => {
    const url = prompt("输入截图 URL：");
    if (url) setScreenshots([...screenshots, url]);
  };

  const removeScreenshot = (i: number) => {
    setScreenshots(screenshots.filter((_, idx) => idx !== i));
  };

  const addPotion = (key: string) => {
    setPotionStyle((prev) => {
      if (prev.length >= 5) return prev;
      return [...prev, key];
    });
  };

  const removePotionAt = (index: number) => {
    setPotionStyle((prev) => prev.filter((_, i) => i !== index));
  };

  const blend = useMemo(() => blendStyles(potionStyle), [potionStyle]);

  const canProceedStep1 = hackathonId && title.trim() && oneLiner.trim() && techStack.length > 0;
  const canProceedStep2 = true;

  const handleSubmit = async () => {
    if (!canProceedStep1) return;
    setSubmitting(true);
    const cleanTeam = teamMembers.filter((m) => m.name.trim());
    const cleanLinks = links.filter((l) => l.label.trim() && l.url.trim());

    const { data, error } = await supabase
      .from("projects")
      .insert({
        hackathon_id: hackathonId,
        title: title.trim(),
        one_liner: oneLiner.trim(),
        description: description.trim(),
        tech_stack: techStack,
        team_members: cleanTeam,
        links: cleanLinks,
        screenshots,
        potion_style: potionStyle,
        status,
      })
      .select()
      .maybeSingle();

    setSubmitting(false);
    if (error) {
      alert("提交失败：" + error.message);
      return;
    }
    if (data) {
      navigate(`/project/${data.id}`);
    }
  };

  const steps = [
    { num: 1, label: "项目信息" },
    { num: 2, label: "项目截图" },
    { num: 3, label: "魔药定制" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">提交作品</h1>
      <p className="text-neutral-400 mb-8">更便捷的三步流程</p>

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8 max-w-md">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step >= s.num
                    ? "bg-primary text-black"
                    : "bg-white/5 text-neutral-400"
                }`}
              >
                {step > s.num ? <Check className="w-5 h-5" /> : s.num}
              </div>
              <span
                className={`text-xs ${step >= s.num ? "text-primary" : "text-neutral-500"}`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                  step > s.num ? "bg-primary" : "bg-white/8"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Project info */}
      {step === 1 && (
        <div className="glass rounded-2xl p-6 space-y-5 animate-slide-up">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              所属黑客松场次
            </label>
            <select
              value={hackathonId}
              onChange={(e) => setHackathonId(e.target.value)}
              className="input-field"
            >
              {hackathons.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              项目名称 <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请填写项目名称"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              一句话介绍 <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
              placeholder="请填写一句话介绍"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              详细描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="详细描述你的项目..."
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              技术栈 <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && techInput.trim()) {
                  e.preventDefault();
                  if (!techStack.includes(techInput.trim())) {
                    setTechStack([...techStack, techInput.trim()]);
                  }
                  setTechInput("");
                }
              }}
              placeholder="输入技术名称后回车，或从下方选择..."
              className="input-field mb-3"
            />
            <div className="flex flex-wrap gap-2 mb-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="tag bg-primary/15 text-primary border border-primary/25 flex items-center gap-1.5"
                >
                  {tech}
                  <button onClick={() => toggleTech(tech)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TECH_STACK_OPTIONS.filter((t) => !techStack.includes(t)).slice(0, 20).map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-white/5 text-neutral-400 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  + {tech}
                </button>
              ))}
            </div>
            {techStack.length === 0 && (
              <p className="text-xs text-error mt-2">请至少添加一个技术栈</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-neutral-300">团队成员</label>
              <button
                onClick={addTeamMember}
                className="text-sm text-primary hover:text-primary-light flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> 添加成员
              </button>
            </div>
            <div className="space-y-2">
              {teamMembers.map((member, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateTeamMember(i, "name", e.target.value)}
                    placeholder="作者姓名"
                    className="input-field flex-1"
                  />
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => updateTeamMember(i, "role", e.target.value)}
                    placeholder="角色（可选）"
                    className="input-field flex-1"
                  />
                  {teamMembers.length > 1 && (
                    <button
                      onClick={() => removeTeamMember(i)}
                      className="px-3 rounded-xl bg-white/5 text-neutral-400 hover:text-error transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-neutral-300">相关链接</label>
              <button
                onClick={addLink}
                className="text-sm text-primary hover:text-primary-light flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> 添加
              </button>
            </div>
            {links.length === 0 ? (
              <p className="text-xs text-neutral-500">点击添加外链（GitHub、Demo 等）</p>
            ) : (
              <div className="space-y-2">
                {links.map((link, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLink(i, "label", e.target.value)}
                      placeholder="链接名称"
                      className="input-field w-1/3"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(i, "url", e.target.value)}
                      placeholder="https://..."
                      className="input-field flex-1"
                    />
                    <button
                      onClick={() => removeLink(i)}
                      className="px-3 rounded-xl bg-white/5 text-neutral-400 hover:text-error transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">状态</label>
            <div className="flex gap-2">
              {(
                [
                  { v: "draft", l: "草稿" },
                  { v: "published", l: "已发布" },
                ] as { v: ProjectStatus; l: string }[]
              ).map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setStatus(opt.v)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    status === opt.v
                      ? "bg-primary/15 text-primary border border-primary/25"
                      : "bg-white/5 text-neutral-400 border border-white/8 hover:bg-white/8"
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="btn-primary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              下一步 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Screenshots */}
      {step === 2 && (
        <div className="glass rounded-2xl p-6 space-y-5 animate-slide-up">
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-neutral-300">项目截图</label>
              <button
                onClick={addScreenshot}
                className="text-sm text-primary hover:text-primary-light flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> 添加截图
              </button>
            </div>
            {screenshots.length === 0 ? (
              <div
                className="border-2 border-dashed border-white/8 rounded-2xl p-12 text-center cursor-pointer hover:border-primary/20 transition-all"
                onClick={addScreenshot}
              >
                <Upload className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-400 text-sm">点击添加项目截图 URL</p>
                <p className="text-neutral-600 text-xs mt-1">可添加多张，九宫格导出时会使用</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {screenshots.map((url, i) => (
                  <div
                    key={i}
                    className="relative group aspect-video rounded-xl overflow-hidden bg-bg-card"
                  >
                    <img src={url} alt={`截图 ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeScreenshot(i)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addScreenshot}
                  className="aspect-video rounded-xl border-2 border-dashed border-white/8 hover:border-primary/20 flex items-center justify-center transition-all"
                >
                  <Plus className="w-6 h-6 text-neutral-500" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="btn-ghost flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> 上一步
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!canProceedStep2}
              className="btn-primary flex items-center gap-2"
            >
              下一步 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Potion customization */}
      {step === 3 && (
        <div className="animate-slide-up">
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <FlaskConical className="w-6 h-6 text-primary" />
              魔药定制
            </h2>
            <p className="text-neutral-400 text-sm">
              可重复选择同一种风格，共投 5 次素材入魔药瓶
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
            {/* Left: bottle + style selection */}
            <div className="glass rounded-2xl p-6 space-y-6">
              {/* Potion bottle */}
              <div className="flex justify-center py-2">
                <PotionBottle selectedStyles={potionStyle} />
              </div>

              {/* Selected droplets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-400">已选素材</span>
                  {potionStyle.length > 0 && (
                    <button
                      onClick={() => setPotionStyle([])}
                      className="text-xs text-neutral-400 hover:text-error flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> 重置
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((slot) => {
                    const key = potionStyle[slot];
                    const style = key ? POTION_STYLES.find((s) => s.key === key) : null;
                    return (
                      <div
                        key={slot}
                        className={`flex-1 h-10 rounded-lg border flex items-center justify-center transition-all ${
                          style
                            ? "border-white/20 cursor-pointer hover:border-error/50"
                            : "border-dashed border-white/8"
                        }`}
                        style={
                          style
                            ? {
                                background: `linear-gradient(135deg, ${style.color}, ${style.colorEnd})`,
                                boxShadow: `0 0 10px ${style.color}40`,
                              }
                            : {}
                        }
                        onClick={() => style && removePotionAt(slot)}
                        title={style ? `${style.label}（点击移除）` : "空槽位"}
                      >
                        {style ? (
                          <X className="w-4 h-4 text-white/80" />
                        ) : (
                          <Plus className="w-4 h-4 text-neutral-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  点击已填入的素材可移除，空槽位从下方选择填入
                </p>
              </div>

              {/* Style selection */}
              <div>
                <span className="text-sm text-neutral-400 block mb-3">
                  点击风格加入魔药瓶（可重复选择）
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {POTION_STYLES.map((style) => {
                    const count = potionStyle.filter((k) => k === style.key).length;
                    const disabled = potionStyle.length >= 5;
                    return (
                      <button
                        key={style.key}
                        onClick={() => addPotion(style.key)}
                        disabled={disabled}
                        className={`relative p-3 rounded-xl border transition-all duration-200 ${
                          count > 0
                            ? "border-white/20 scale-105"
                            : disabled
                            ? "border-white/5 opacity-20 cursor-not-allowed"
                            : "border-white/10 hover:border-white/20 hover:scale-105"
                        }`}
                        style={{
                          background: count > 0 ? `${style.color}20` : "rgba(255,255,255,0.03)",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full mx-auto mb-1.5"
                          style={{
                            background: `linear-gradient(135deg, ${style.color}, ${style.colorEnd})`,
                            boxShadow: count > 0 ? `0 0 16px ${style.color}60` : "none",
                          }}
                        />
                        <span className="text-xs text-neutral-300">{style.label}</span>
                        <span className="text-[10px] text-neutral-500 block">{style.mood}</span>
                        {count > 0 && (
                          <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-primary text-black flex items-center justify-center text-xs font-bold">
                            {count}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {potionStyle.length === 5 && (
                <div className="text-center animate-scale-in">
                  <p className="text-primary text-sm flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    魔药已满，点击确认调制
                  </p>
                </div>
              )}

              {potionStyle.length < 5 && (
                <div className="text-center">
                  <p className="text-neutral-500 text-xs flex items-center justify-center gap-1.5">
                    <FlaskConical className="w-3 h-3" />
                    还需投入 {5 - potionStyle.length} 次
                  </p>
                </div>
              )}
            </div>

            {/* Right: live preview */}
            <div className="glass rounded-2xl p-6">
              <StylePreview blend={blend} />
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button
              onClick={() => setStep(2)}
              className="btn-ghost flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> 返回信息编辑
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || potionStyle.length !== 5}
              className="btn-primary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  魔药调制中...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  确认调制
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
