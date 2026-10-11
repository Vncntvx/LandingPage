/**
 * @fileoverview Astro 框架配置文件
 * @module astro.config
 * @version 2.0.0
 * @author LandingPage Team
 * @since 1.0.0
 * @description 本文件定义了 Astro 项目的核心配置，基于 Astro 7.3 与 Tailwind CSS 4 Vite 原生集成。
 *
 * @see https://astro.build/config
 * @license MIT
 */

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import robotsTxt from 'astro-robots-txt';
import icon from 'astro-icon';

export default defineConfig({
  /** 站点部署的基础 URL，用于生成绝对路径和 SEO 优化 */
  site: 'https://wenjiexu.site',

  /** URL 尾部斜杠处理策略：'always' 总是添加，'never' 从不添加，'ignore' 忽略 */
  trailingSlash: 'ignore',

  /** 构建输出模式：'static' 静态站点生成，'server' 服务器端渲染，'hybrid' 混合模式 */
  output: 'static',

  /** 预渲染路由冲突处理策略 */
  prerenderConflictBehavior: 'ignore',

  /** 构建优化配置 */
  build: {
    /** 内联样式表策略：'auto' 自动判断 */
    inlineStylesheets: 'auto',
  },

  /** 插件集成配置 */
  integrations: [
    /** React 集成：支持在 Astro 组件中使用 React 组件 */
    react(),

    /** MDX 集成：支持在 Markdown 中使用 JSX 组件和交互式元素 */
    mdx({
      /** 继承 Astro 的 Markdown 配置，保持一致性 */
      extendMarkdownConfig: true,
      /** 启用 MDX 输出优化，提高构建性能 */
      optimize: true,
    }),

    /** 图标集成：基于 Iconify 的图标系统支持 */
    icon(),

    /** 站点地图集成：自动生成 sitemap.xml 文件供搜索引擎使用 */
    sitemap({
      /** 国际化配置：定义支持的语言和地区 */
      i18n: {
        /** 默认语言环境 */
        defaultLocale: 'zh_CN',
        /** 启用的语言环境映射 */
        locales: {
          zh_CN: 'zh-CN',
          en_US: 'en-US',
        },
      },
      /** 内容更新频率 */
      changefreq: 'weekly',
      /** 页面优先级 */
      priority: 0.7,
      /** 最后修改时间 */
      lastmod: new Date(),
    }),

    /** robots.txt 集成：自动生成搜索引擎爬虫规则文件 */
    robotsTxt({
      /** 自动引用 sitemap 集成生成的站点地图文件 */
      sitemap: true,
      /** 爬虫访问策略配置 */
      policy: [
        {
          /** 目标爬虫：'*' 表示所有爬虫 */
          userAgent: '*',
          /** 允许访问的路径 */
          allow: '/',
          /** 禁止访问的路径 */
          disallow: ['/404'],
        },
      ],
    }),
  ],

  /** 国际化配置：定义多语言支持的路由和内容策略 */
  i18n: {
    /** 默认语言环境 */
    defaultLocale: 'zh_CN',
    /** 项目支持的语言环境列表 */
    locales: ['zh_CN', 'en_US'],
    /** 路由策略配置 */
    routing: {
      /** 是否为默认语言添加 URL 前缀 */
      prefixDefaultLocale: true,
      /** 是否自动重定向到默认语言 */
      redirectToDefaultLocale: true,
    },
  },

  /** 预获取配置：优化页面加载性能 */
  prefetch: {
    /** 默认预获取策略：'tap' 点击时，'hover' 悬停时，'viewport' 进入视口时 */
    defaultStrategy: 'hover',
    /** 是否预获取所有链接 */
    prefetchAll: false,
  },

  /** Vite 构建工具配置：集成 Tailwind CSS 4 Vite 原生插件 */
  vite: {
    plugins: [tailwindcss()],
    /** 依赖优化配置 */
    optimizeDeps: {
      /** 预构建依赖列表 */
      include: ['react', 'react-dom'],
    },
    /** 模块解析配置 */
    resolve: {
      /** 去重依赖：确保 React 只有一个副本，避免版本冲突 */
      dedupe: ['react', 'react-dom'],
    },
  },

  /** 图片优化配置：定义图片处理和显示策略 */
  image: {
    /** 允许优化的外部图片域名白名单 */
    domains: [
      'images.unsplash.com',
      'unsplash.com',
      'picsum.photos',
      'fastly.picsum.photos',
      'blog.wenjiexu.site',
    ],
    /** 远程图片匹配模式：更灵活的域名和路径匹配 */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '**.picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'blog.wenjiexu.site',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
    /** 启用响应式图片样式：确保图片在不同设备上自适应显示 */
    responsiveStyles: true,
  },
});
