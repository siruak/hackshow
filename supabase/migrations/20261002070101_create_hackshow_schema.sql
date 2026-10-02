/*
# HackShow - 黑客松作品展示平台数据库

## 概述
创建两个表：hackathons（黑客松场次）和 projects（参赛项目）。
这是一个公开展示平台，无登录需求，所有访客可浏览和提交作品。

## 新建表
1. `hackathons` - 黑客松场次表
   - id (uuid, 主键)
   - name (text, 场次名称)
   - description (text, 场次描述)
   - start_date (date, 开始日期)
   - end_date (date, 结束日期)
   - created_at (timestamp, 创建时间)

2. `projects` - 参赛项目表
   - id (uuid, 主键)
   - hackathon_id (uuid, 外键关联 hackathons)
   - title (text, 项目名称)
   - one_liner (text, 一句话介绍)
   - description (text, 详细描述)
   - tech_stack (text[], 技术栈数组)
   - team_members (jsonb, 团队成员 [{name, role}])
   - links (jsonb, 相关链接 [{label, url}])
   - screenshots (text[], 截图URL数组)
   - potion_style (text[], 魔药风格选择数组)
   - award (text, 奖项名称，可为空)
   - status (text, 状态：draft/published/awarded)
   - submitted_at (timestamp, 提交时间)
   - created_at (timestamp, 创建时间)

## 安全策略
- 两个表均启用 RLS
- 允许 anon + authenticated 完整 CRUD（公开平台，无需登录）
*/

CREATE TABLE IF NOT EXISTS hackathons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_hackathons" ON hackathons;
CREATE POLICY "anon_select_hackathons" ON hackathons FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_hackathons" ON hackathons;
CREATE POLICY "anon_insert_hackathons" ON hackathons FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_hackathons" ON hackathons;
CREATE POLICY "anon_update_hackathons" ON hackathons FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_hackathons" ON hackathons;
CREATE POLICY "anon_delete_hackathons" ON hackathons FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id uuid REFERENCES hackathons(id) ON DELETE CASCADE,
  title text NOT NULL,
  one_liner text NOT NULL DEFAULT '',
  description text DEFAULT '',
  tech_stack text[] DEFAULT '{}',
  team_members jsonb DEFAULT '[]',
  links jsonb DEFAULT '[]',
  screenshots text[] DEFAULT '{}',
  potion_style text[] DEFAULT '{}',
  award text,
  status text NOT NULL DEFAULT 'draft',
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_projects_hackathon_id ON projects(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_submitted_at ON projects(submitted_at DESC);

-- 插入默认黑客松场次
INSERT INTO hackathons (name, description, start_date, end_date)
SELECT '2024春季黑客松', '一场汇聚创新与技术的春季黑客松盛宴', '2024-03-01', '2024-03-03'
WHERE NOT EXISTS (SELECT 1 FROM hackathons LIMIT 1);
