# 后端恢复笔记

> 目前处于「封存」状态。想折腾时按这个恢复。

## 当前封存了什么

- `src/pages/_api/posts.ts` —— Astro API 路由，查 Supabase 的 `posts` 表
- `src/lib/supabase.ts` —— Supabase 客户端
- `.env` —— Supabase URL 和 key（本地，没推到 GitHub）
- Supabase 项目 `my-site` —— 数据库还在，`posts` 表有两条测试数据

## 为什么封存

- `vercel.app` 在国内打不开，改用 Cloudflare Pages（纯静态）
- Supabase 国内访问不稳定，本地测不通

## 恢复步骤

### 1. 恢复 API 路由

把 `src/pages/_api/` 改回 `src/pages/api/`。

### 2. 装 Vercel adapter

```bash
npm install @astrojs/vercel
```

### 3. 改 `astro.config.mjs`

```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  }
});
```

### 4. 处理动态路由

在 `src/pages/blog/[...slug].astro` 顶部加：

```astro
---
export const prerender = true;
// ... 其余代码不变
---
```

否则 `output: 'server'` 模式下，博客详情页会报 `RenderUndefinedEntryError`。

### 5. 本地测试

```bash
npm run dev
```

访问 `http://localhost:4321/api/posts`，能返回 JSON 就通了。

### 6. 部署

- 如果还部署 Vercel：Vercel 环境变量里配 `PUBLIC_SUPABASE_URL` 和 `PUBLIC_SUPABASE_ANON_KEY`
- 如果换 Cloudflare Pages：Cloudflare Pages 也支持 SSR，但要用 `@astrojs/cloudflare` adapter

### 7. 如果 `fetch failed`

依次尝试：

1. 开代理，本地测浏览器能不能直接访问 `https://chiuhvknojwdbizvxid.supabase.co/rest/v1/posts?select=*`
2. 换 legacy anon key（`eyJ` 开头那个，在 Supabase → Settings → API Keys → Legacy）
3. 换国内 BaaS：LeanCloud、腾讯云开发 CloudBase

## 相关地址

| 服务 | 地址 |
|---|---|
| GitHub 仓库 | https://github.com/duokaixin21/my-personal-site |
| Supabase 控制台 | https://supabase.com/dashboard |
| Supabase 项目 | my-site |
| 表名 | posts |
| 字段 | id, title, content, created_at |