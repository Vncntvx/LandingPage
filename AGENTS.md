# IFLOW.md - LandingPage 项目上下文

## 项目概述

这是一个现代化的个人落地页主题，使用 Astro 5、React 19 和 Tailwind
CSS 构建。项目采用静态站点生成（SSG）架构，支持国际化、深色模式、RSS 聚合和响应式设计。

### 技术栈

- **框架**: Astro 5.x
- **UI**: React 19.x
- **样式**: Tailwind CSS 3.x
- **运行时**: Bun 1.x（推荐）或 Node.js 18+
- **邮件**: EmailJS
- **图标**: Iconify (Material Design Icons)

### 核心特性

- 内置国际化（中文/英文）
- 自动深色模式切换
- RSS/Atom 订阅聚合
- 预配置的联系表单（EmailJS）
- 响应式移动优先设计
- 岛屿架构（最小化 JavaScript）
- SEO 优化（sitemap.xml, robots.txt）

## 项目结构

```
src/
├── components/
│   ├── react/          # React 岛屿组件（需要交互）
│   │   ├── Contact.jsx        # 联系表单
│   │   ├── ErrorBoundary.jsx  # 错误边界
│   │   ├── HeaderBar.jsx      # 导航栏（含语言切换）
│   │   ├── LanguageSwitcher.jsx # 语言切换器
│   │   ├── PrimaryNav.jsx     # 主导航
│   │   ├── ThemeToggle.jsx    # 主题切换
│   │   └── UnderlineEffects.jsx # 下划线悬停效果
│   │
│   └── ui/             # Astro 静态组件（无交互）
│       ├── Hero.astro              # 英雄区块
│       ├── Footer.astro            # 页脚
│       ├── WebsiteItem.astro       # 网站项目
│       ├── WebsitesSection.astro   # 网站区块
│       ├── FeaturedPostItem.astro  # 特色文章项目
│       └── FeaturedPostsSection.astro # 特色文章区块
│
├── layouts/
│   └── BaseLayout.astro  # 全局布局
│
├── lib/
│   ├── i18n.ts           # 国际化工具函数
│   └── utils.ts          # 公共工具函数
│
├── pages/
│   ├── index.astro       # 根首页（渲染中文版）
│   ├── 404.astro         # 根 404 页面
│   └── [lang]/           # 动态路由（多语言）
│       ├── index.astro   # 各语言首页
│       ├── about.astro   # 关于页面
│       ├── contact.astro # 联系页面
│       └── 404.astro     # 各语言 404
│
├── content/
│   └── i18n/             # 国际化内容
│       ├── zh_CN.json    # 中文内容
│       └── en_US.json    # 英文内容
│
├── data/
│   └── rss-posts.json    # RSS 聚合数据
│
└── styles/
    └── global.css        # 全局样式
```

## 构建和运行

### 前提条件

- Bun 1.0+（推荐）或 Node.js 18+

### 常用命令

```bash
# 安装依赖
bun install

# 开发服务器（Bun 运行时）
bun run dev

# 开发服务器（Node.js 运行时）
bun run dev:node

# 生产构建
bun run build

# 生产构建（Node.js 运行时）
bun run build:node

# 预览生产构建
bun run preview

# 获取 RSS 订阅
bun run fetch:rss

# 代码格式化
bun run format

# 类型检查
bun run type-check

# 代码检查
bun run lint

# 清理构建
bun run clean

# 重新安装依赖
bun run reinstall
```

### 环境变量

创建 `.env` 文件：

```env
# EmailJS（联系表单必需）
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Google Analytics（可选）
PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 配置说明

### 1. Astro 配置 (`astro.config.mjs`)

- 站点 URL: `https://wenjiexu.site`
- 国际化: 默认中文 (`zh_CN`)，支持英文 (`en_US`)
- 集成: React, Tailwind, MDX, Sitemap, Robots.txt, Iconify
- 输出: 静态站点生成（SSG）

### 2. Tailwind 配置 (`tailwind.config.mjs`)

- 内容路径: 包含所有 Astro、React 和 JSON 文件
- 深色模式: 基于 CSS 类 (`dark:class`)
- 字体: Noto Sans 字体变量

### 3. TypeScript 配置 (`tsconfig.json`)

- 路径别名配置：
  - `@/*` → `src/*`
  - `@components/*` → `src/components/*`
  - `@layouts/*` → `src/layouts/*`
  - `@lib/*` → `src/lib/*`
  - `@styles/*` → `src/styles/*`
  - `@data/*` → `src/data/*`

### 4. 内容配置 (`src/content.config.ts`)

- 使用 Astro Content Collections 管理国际化数据
- 定义严格的 JSON schema 验证
- 支持导航、网站、文章、时间线等结构化数据

### 5. 中间件 (`src/middleware.ts`)

- 语言检测和路由验证
- 无效语言路径重定向到默认语言
- 静态资源直接放行

## 开发约定

### 组件选择原则

1. **React 岛屿组件**：用于需要交互的组件（表单、导航、主题切换）
2. **Astro 静态组件**：用于纯展示组件（Hero、Footer、内容区块）
3. **客户端指令**：
   - `client:load`：关键交互组件（HeaderBar）
   - `client:idle`：非关键交互组件（UnderlineEffects）

### 国际化实现

1. **路由结构**：`/[lang]/page` 格式
2. **内容管理**：`src/content/i18n/[locale].json`
3. **工具函数**：`src/lib/i18n.ts` 提供 `getI18n()` 等函数
4. **语言检测**：中间件自动处理无效语言路径

### 样式约定

1. **Tailwind CSS**：使用实用类优先
2. **响应式设计**：移动优先断点
3. **深色模式**：使用 `dark:` 前缀
4. **自定义样式**：`src/styles/global.css`

### 数据流

1. **内容数据**：通过 Content Collections 从 JSON 文件加载
2. **RSS 数据**：通过脚本定期获取，存储在 `src/data/rss-posts.json`
3. **环境变量**：通过 `import.meta.env` 访问

## 部署

### 静态托管平台

项目生成静态 HTML 文件，可部署到：

- **Vercel**: `npx vercel`
- **Netlify**: `npx netlify deploy --prod --dir=dist`
- **GitHub Pages**: 使用内置 GitHub Actions 工作流
- **Cloudflare Pages**: 设置构建命令为 `bun run build`

### 构建输出

- 输出目录: `dist/`
- 包含: HTML、CSS、JavaScript、静态资源
- 自动生成: `sitemap.xml`, `robots.txt`

## 扩展和自定义

### 添加新语言

1. 更新 `astro.config.mjs` 中的 `locales` 数组
2. 更新 `src/lib/i18n.ts` 中的 `locales` 和 `localeConfig`
3. 创建 `i18n/[new_locale].json`
4. 创建 `src/pages/[new_locale]/` 目录和页面

### 修改样式

1. **主题颜色**: 编辑 `tailwind.config.mjs`
2. **全局样式**: 编辑 `src/styles/global.css`
3. **组件样式**: 直接在组件中使用 Tailwind 类

### 添加新功能

1. **新页面**: 在 `src/pages/[lang]/` 下创建 `.astro` 文件
2. **新组件**: 根据交互需求选择 React 或 Astro 组件
3. **新内容类型**: 更新 `src/content.config.ts` 中的 schema

## 故障排除

### 常见问题

1. **RSS 获取失败**: 检查网络连接和 RSS URL 格式
2. **联系表单不工作**: 验证 EmailJS 环境变量
3. **构建错误**: 运行 `bun run type-check` 检查类型错误
4. **样式问题**: 检查 Tailwind 类名和深色模式前缀

### 调试命令

```bash
# 检查类型错误
bun run type-check

# 检查代码格式
bun run format:check

# 检查 Astro 配置
bun run lint

# 清理并重新构建
bun run clean && bun install && bun run build
```

## 维护说明

### 依赖更新

```bash
# 更新所有依赖
bun update

# 更新特定依赖
bun add package-name@latest
```

### 项目清理

```bash
# 清理构建缓存
rm -rf dist .astro

# 清理依赖
rm -rf node_modules

# 完全重新安装
bun run reinstall
```
