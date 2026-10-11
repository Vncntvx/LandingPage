/**
 * @fileoverview Astro 中间件配置
 *
 * 此中间件负责处理多语言路由，主要功能包括：
 * 1. 语言检测与路由验证
 * 2. 无效语言路径重定向到默认语言
 *
 * 注意：根路径 "/" 不再在此处重定向，由 src/pages/index.astro 直接处理
 *
 * @module src/middleware
 * @requires astro:middleware
 * @requires ./lib/i18n
 * @since 1.0.0
 */

import { defineMiddleware } from 'astro:middleware';
import { defaultLocale, isValidLocale, resolveLocale } from './lib/i18n';

/**
 * 从 URL 路径中提取语言代码
 *
 * @function extractLocaleFromPath
 * @param {string} pathname - URL 路径
 * @returns {string | null} 提取的语言代码，如果不存在则返回 null
 *
 * @example
 * extractLocaleFromPath('/zh_CN/about') // 返回 'zh_CN'
 * extractLocaleFromPath('/about') // 返回 null
 */
function extractLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] || null;
}

/**
 * 主中间件函数
 *
 * 处理所有传入请求的路由逻辑：
 * 1. 静态资源直接放行
 * 2. 根路径直接放行（由 index.astro 处理）
 * 3. 验证语言路径有效性
 * 4. 非规范语言代码（如 en-us, zh-cn 等）重定向到规范语言路径
 * 5. 无效语言路径重定向到默认语言
 *
 * @function onRequest
 * @param {Object} context - Astro 中间件上下文
 * @param {URL} context.url - 请求的 URL 对象
 * @param {Function} context.redirect - 重定向函数
 * @param {Function} next - 调用下一个中间件或路由处理器
 * @returns {Promise<Response | void>} 中间件处理结果
 *
 * @example
 * // 请求 /zh_CN/about -> 正常处理
 * // 请求 /en-us/about -> 重定向到 /en_US/about/
 * // 请求 /about -> 重定向到 /zh_CN/about/
 * // 请求 /favicon.ico -> 直接放行
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context;
  const pathname = url.pathname;

  // 1. 静态资源和特殊路径直接放行
  // 这些路径不需要语言前缀处理
  if (
    pathname.startsWith('/_') || // Astro 内部路由
    pathname.startsWith('/assets/') || // 静态资源
    pathname.startsWith('/api/') || // API 端点
    pathname.includes('.') || // 带扩展名的文件
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/site.webmanifest'
  ) {
    return next();
  }

  // 2. 根路径直接放行，由 index.astro 渲染
  // 根路径会根据用户的语言偏好或浏览器设置进行重定向
  if (pathname === '/' || pathname === '') {
    return next();
  }

  // 3. 提取并验证语言代码
  const pathLocale = extractLocaleFromPath(pathname);

  // 如果路径以有效语言开头，继续处理
  if (pathLocale && isValidLocale(pathLocale)) {
    return next();
  }

  // 4. 如果路径以非规范语言代码（如 en-us, zh-cn, en, zh）开头，重定向到规范语言路径
  if (pathLocale) {
    const resolved = resolveLocale(pathLocale);
    if (resolved) {
      const restSegments = pathname.split('/').filter(Boolean).slice(1);
      const restPath = restSegments.length > 0 ? restSegments.join('/') + '/' : '';
      const newPath = `/${resolved}/${restPath}`;
      return redirect(newPath, 301);
    }
  }

  // 5. 无效语言路径，重定向到默认语言的对应页面
  // 例如：/about/ -> /zh_CN/about/
  const newPath = `/${defaultLocale}${pathname}`;
  return redirect(newPath, 302);
});
