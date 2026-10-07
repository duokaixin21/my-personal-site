---
title: 个人网站复盘
date: 2026-10-07
description: 复盘＋正确部署
---

# 多开心个人网站 · 项目复盘

> 写于 2026-10-07
> 项目地址：https://github.com/duokaixin21/my-personal-site
> 线上地址：https://my-personal-site-taupe.vercel.app

---

## 一、最终状态

| 部分 | 状态 |
|---|---|
| 前端页面 | ✅ 上线可用 |
| 视觉设计 | ✅ 极简黑白 + 极光 + 动画 |
| 部署 | ✅ Vercel，GitHub 自动部署 |
| 后端 API | ❌ 未跑通（`fetch failed`） |
| 数据库 | ✅ Supabase 建表成功，但前端读不到 |

---

## 二、技术栈

```text
前端：Astro v7 + Tailwind v4 + TypeScript
内容：Markdown（Content Collections）
部署：GitHub → Vercel（自动部署）
后端：Astro API Routes + Supabase（未通）
字体：Inter + Noto Serif SC
```

---

## 三、走过的路

### 1. 从零创建项目

```bash
npm create astro@latest my-personal-site
npx astro add tailwind
npm run dev
```

### 2. 视觉方向反复切换（教训一）

- 初版：古风（宣纸 + 朱砂 + 印章）→ 丑
- 二版：复古 Gucci 风（参考图）→ 未落地
- 三版：NOVA 极简黑白（最终采用）

**教训：先定方向再写代码。方向不定，代码全废。**

### 3. 加了大量动效

- 极光背景（三层独立漂移）
- 鼠标光晕
- 星点闪烁
- 卡片交错淡入
- 页面切换动画（View Transitions）
- 标题下划线扫过

关键 CSS 类：

```css
.bg-aurora / .aurora-blob  /* 极光 */
.cursor-glow               /* 鼠标光晕 */
.star                      /* 星点 */
.reveal / .card-item       /* 滚动触发 + 交错 */
.hairline-scan             /* 扫光分隔线 */
.title-sweep               /* 标题下划线 */
```

Page Transitions 关键：

```astro
---
import { ClientRouter } from 'astro:transitions';
---
<ClientRouter />
```

脚本必须用：

```ts
document.addEventListener('astro:page-load', initPage);
```

**不能用 `is:inline`**，否则切换页面后脚本不重跑。

### 4. Git 推送到 GitHub

```bash
git add .
git commit -m "first version"
git branch -M main
git remote add origin https://github.com/duokaixin21/my-personal-site.git
git push -u origin main
```

首次推送会弹 GitHub 授权，选 **Sign in with your browser**。

**踩坑**：`git push` 时会让输入 8 位验证码，这个码显示在浏览器授权页，不是终端。

### 5. 部署到 Vercel

1. vercel.com 用 GitHub 登录
2. Import 仓库
3. 直接 Deploy

之后每次 `git push`，Vercel 自动重新部署。

### 6. Supabase 后端（卡在这里）

**做了什么**：

- 注册 Supabase，建项目 `my-site`
- 建 `posts` 表，开了 RLS，两条 policy
- 获取 Project URL + Publishable key
- 本地装 `@supabase/supabase-js`
- 建 `src/lib/supabase.ts`
- 建 `src/pages/api/posts.ts`
- 装 `@astrojs/vercel`，改 `astro.config.mjs` 为 `output: 'server'`
- 在 Vercel 配置环境变量

**结果**：

- 环境变量读取正常（调试版返回 `urlLength: 39`、`keyLength: 46`）
- 但真实查询返回 `{"error":"TypeError: fetch failed"}`

---

## 四、卡住的真正原因（判断）

**核心问题：国内网络环境访问 Supabase 不稳定。**

证据链：

1. 浏览器直接访问 Supabase REST API → 无法访问
2. Vercel Logs 显示对 Supabase 的请求 → 4 次全部失败
3. 环境变量本身没问题

**没验证完就停了，所以只是判断，不是定论。**

---

## 五、教训

### ✅ 做对的事

1. Astro + Tailwind 组合适合个人站
2. GitHub → Vercel 部署流程顺畅
3. 用 `.env` + `.gitignore` 保护密钥
4. 每一步都验证，不盲目往下推

### ❌ 踩的坑

| 坑 | 原因 | 下次怎么做 |
|---|---|---|
| 视觉方向反复推翻 | 没先定方案 | 先画草图或找参考，定了再写 |
| `output: 'server'` 忘加 | 不知道 Astro 默认静态 | 要用 API 路由必须加 adapter |
| Supabase 在国内打不开 | 没提前查网络可达性 | 选后端先测网络 |
| 本地 `fetch failed` 没重视 | 以为是代码问题 | 网络层问题优先排查 |
| 一直在改代码试 | 没先看日志 | 先看日志，再改代码 |

### 🔑 最关键的认知

**做全栈项目，网络可达性是第一道门槛。**

选任何后端服务前，先问：

1. 我本地能不能访问？
2. 部署环境能不能访问？
3. 国内用户能不能访问？

三个都通，才动手写代码。

---

## 六、如果重来

### 方案 A：换国内可访问的 BaaS

- LeanCloud（国内）
- 腾讯云开发 CloudBase
- 阿里云 EMAS

### 方案 B：不用后端，用 Git 做内容管理

- 文章就是 Markdown 文件
- 用 Decap CMS 提供网页编辑界面
- 内容推到 GitHub，Vercel 自动部署

### 方案 C：想学后端，本地跑

- 本地装 PostgreSQL
- 本地写 Node/Express API
- 只在本地练，不部署

---

## 七、当前代码结构

```text
my-personal-site/
├── src/
│   ├── content/
│   │   └── blog/
│   │       └── pippi-longstocking.md
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── projects.astro
│   │   ├── now.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   └── api/
│   │       └── posts.ts
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── .env
└── package.json
```

---

## 八、常用命令备忘

```bash
# 开发
npm run dev

# 停掉
Ctrl + C

# 推送
git add .
git commit -m "说明"
git push

# 检查错误
npx astro check

# 同步类型
npx astro sync
```

---

## 九、下一步可走的路

**如果还想继续做后端**：

1. 开代理，本地测 Supabase 到底通不通
2. 通 → 换 legacy anon key 重试
3. 不通 → 换 LeanCloud 或 CloudBase

**如果不想折腾后端**：

1. 回到纯静态站
2. 用 Decap CMS 做网页编辑
3. 删掉 `src/lib/supabase.ts`、`src/pages/api/`、`@astrojs/vercel`
4. `astro.config.mjs` 改回 `output: 'static'`

**如果只想练后端**：

1. 本地 `npm init`
2. 写 Express + SQLite
3. 不部署，纯本地跑通流程

---

# 📚 附一、所有用到的网站

## 核心工具

| 网站 | 网址 | 用途 |
|---|---|---|
| Astro 官方文档 | https://docs.astro.build | 框架文档 |
| Tailwind 文档 | https://tailwindcss.com/docs | 样式文档 |
| Astro Content Collections | https://docs.astro.build/en/guides/content-collections/ | Markdown 内容管理 |
| Astro View Transitions | https://docs.astro.build/en/guides/view-transitions/ | 页面切换动画 |

## 代码托管 & 部署

| 网站 | 网址 | 用途 |
|---|---|---|
| GitHub | https://github.com | 代码仓库 |
| GitHub 新建仓库 | https://github.com/new | 创建仓库 |
| GitHub 设备授权 | https://github.com/login/device | 验证码登录 |
| Vercel | https://vercel.com | 部署平台 |
| Vercel 项目设置 | https://vercel.com/duokaixin/my-personal-site/settings | 环境变量 |
| Vercel 部署列表 | https://vercel.com/duokaixin/my-personal-site/deployments | 查看部署 |
| Vercel 日志 | https://vercel.com/duokaixin/my-personal-site/logs | 调试 |

## 后端 / 数据库

| 网站 | 网址 | 用途 |
|---|---|---|
| Supabase | https://supabase.com | 后端即服务 |
| Supabase 控制台 | https://supabase.com/dashboard | 管理数据库 |
| LeanCloud（备选） | https://leancloud.app | 国内 BaaS |
| 腾讯云开发（备选） | https://tcb.cloud.tencent.com | 国内 BaaS |

## 字体 / CDN

| 网站 | 网址 | 用途 |
|---|---|---|
| Google Fonts | https://fonts.google.com | Inter / Noto Serif SC |
| jsDelivr | https://www.jsdelivr.com | 免费 CDN |
| 霞鹜文楷 | https://github.com/lxgw/LxgwWenKai | 开源中文字体 |

## 内容管理（可选）

| 网站 | 网址 | 用途 |
|---|---|---|
| Decap CMS | https://decapcms.org | 网页端内容编辑 |
| Netlify | https://netlify.com | Decap OAuth 中转 |

## 学习资源

| 网站 | 网址 | 用途 |
|---|---|---|
| MDN Web Docs | https://developer.mozilla.org | Web 技术文档 |
| 菜鸟教程 Git | https://www.runoob.com/git/git-tutorial.html | Git 入门 |
| Astro 中文文档 | https://docs.astro.build/zh-cn | 中文文档 |

---

# 🚀 附二、正确的部署流程

> 从零到上线的完整顺序。每一步都验证，验证通过再进下一步。

## 阶段一：本地开发

### 1. 创建项目

```bash
npm create astro@latest my-personal-site
cd my-personal-site
npm install
```

### 2. 加 Tailwind

```bash
npx astro add tailwind
```

### 3. 启动开发服务器

```bash
npm run dev
```

浏览器打开 `http://localhost:4321`，能看到页面就是成功。

### 4. 写代码

- 页面放 `src/pages/`
- 布局放 `src/layouts/`
- 文章放 `src/content/blog/`（Markdown）
- 样式放 `src/styles/global.css`

### 5. 本地验证

- 页面能打开
- 导航能切换
- 文章能显示
- 无控制台报错

---

## 阶段二：推送到 GitHub

### 1. 创建 GitHub 仓库

访问 https://github.com/new

- Repository name：`my-personal-site`
- 选 **Public**
- **不勾** Add README / Add .gitignore / Choose a license

### 2. 本地初始化 Git

```bash
git init
git add .
git commit -m "first version"
git branch -M main
git remote add origin https://github.com/你的用户名/my-personal-site.git
git push -u origin main
```

### 3. 授权 GitHub

会弹窗 → 选 **Sign in with your browser** → 浏览器里点绿色的 **Authorize** 按钮。

**验证**：打开 `https://github.com/你的用户名/my-personal-site`，能看到所有文件。

⚠️ **确认 `.gitignore` 里有 `.env`**，否则密钥会泄露。

---

## 阶段三：部署到 Vercel

### 1. 登录 Vercel

访问 https://vercel.com，用 **GitHub 账号登录**。

### 2. Import 项目

- 点 **Add New** → **Project**
- 如果没看到仓库，点 **Install** 授权 Vercel 访问 GitHub
- 选 `my-personal-site` → 点 **Import**

### 3. 配置

**什么都不用改**，Framework Preset 会自动识别为 Astro。

### 4. Deploy

点 **Deploy**，等 30 秒。

### 5. 拿到地址

成功后拿到 `https://xxx.vercel.app`。

**验证**：打开这个地址，网站能显示。

---

## 阶段四：环境变量（如果用了后端）

### 1. 打开环境变量页

```text
https://vercel.com/你的用户名/你的项目/settings/environment-variables
```

### 2. 添加变量

点 **Add Environment Variable**，逐条添加：

| Key | Value | Type | Environments |
|---|---|---|---|
| `PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Config | 三个都勾 |
| `PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Config | 三个都勾 |

### 3. 重新部署

**Deployments** → 最新一条 → **...** → **Redeploy**。

### 4. 验证

访问 `https://xxx.vercel.app/api/你的接口`，看是否返回正确数据。

---

## 阶段五：后续更新

每次改完代码：

```bash
git add .
git commit -m "改了什么"
git push
```

Vercel 自动检测到 push，自动重新部署，1 分钟内生效。

**不用手动操作 Vercel。**

---

## ⚠️ 部署流程的关键注意点

### 1. 网络可达性是第一道门槛

选任何后端服务前先测：

- 浏览器能不能直接访问它的 API 地址？
- 国内访问稳不稳定？

**Supabase 在国内不稳定**，这是本次项目卡住的核心原因。

### 2. Astro 默认是静态站

- 只有静态页面 → `output: 'static'`（默认）
- 要用 API 路由 / SSR → 必须装 adapter：

```bash
npm install @astrojs/vercel
```

```javascript
// astro.config.mjs
import vercel from '@astrojs/vercel';
export default defineConfig({
  output: 'server',
  adapter: vercel(),
});
```

### 3. 密钥必须放 `.env`

```bash
# .env
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

```bash
# .gitignore
.env
```

**永远不要**把密钥直接写在代码里。

### 4. 遇到问题先看日志

- Vercel：**Deployments → Logs**
- 浏览器：**F12 → Console / Network**
- 本地终端：看红色输出

**不要盲改代码。**

### 5. 换 key 类型可能出问题

Supabase 有两种 key：

- `sb_publishable_...`（新版）
- `eyJ...`（legacy 版）

新版可能与旧版 `supabase-js` 不兼容，遇到 `fetch failed` 可以换 legacy key 试试。

### 6. 缓存可能骗你

Vercel 会缓存 API 响应。API 路由加：

```ts
headers: {
  'Cache-Control': 'no-store'
}
```

测试时用**无痕窗口**，避免浏览器缓存。

---

## 一句话总结

**前端已经过关。后端卡在网络上，不是能力问题。**

**选技术栈时，先验证网络可达性，再动手写代码——这是这次最大的收获。**