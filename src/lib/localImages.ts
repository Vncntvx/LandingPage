/**
 * @fileoverview 本地图片资源管理工具
 *
 * 此模块提供本地图片资源的索引和访问功能，支持通过文件名或路径
 * 引用图片，同时确保图片能够被 Astro 的资源优化系统处理。
 *
 * 主要功能：
 * - 自动索引 src/assets/img/ 目录下的所有图片文件
 * - 支持多种图片格式：PNG, JPG, JPEG, WebP, AVIF
 * - 提供灵活的图片引用方式，兼容 i18n 配置
 *
 * @module src/lib/localImages
 * @requires astro
 * @since 1.0.0
 */

import type { ImageMetadata } from 'astro';

/**
 * 使用 import.meta.glob 预加载所有本地图片资源
 *
 * 通过 eager: true 选项，所有图片在模块加载时就会被导入，
 * 而不是按需加载，这样可以确保图片元数据立即可用。
 */
const imageModules: Record<string, { default: ImageMetadata }> = import.meta.glob<{
  default: ImageMetadata;
}>('../assets/img/**/*.{png,jpg,jpeg,webp,avif}', { eager: true });

/**
 * 图片文件名到 ImageMetadata 的映射表
 *
 * 使用 Map 数据结构提供高效的图片查找功能，
 * 键为文件名，值为对应的图片元数据。
 */
const imageByFileName: Map<string, ImageMetadata> = new Map<string, ImageMetadata>();

/**
 * 初始化图片映射表
 *
 * 遍历所有导入的图片模块，提取文件名并建立映射关系。
 * 这样可以通过文件名快速访问图片元数据。
 */
for (const [path, mod] of Object.entries(imageModules)) {
  const fileName = path.split('/').pop();
  if (!fileName) continue;
  imageByFileName.set(fileName, mod.default);
}

/**
 * 从路径或文件名中提取基础文件名
 *
 * 支持多种输入格式：
 * - "prof_pic.png" - 纯文件名
 * - "/img/prof_pic.png" - 相对路径
 * - "/assets/img/prof_pic.png" - 完整资源路径（兼容旧版）
 * - "https://example.com/prof_pic.png" - 外部 URL（不会匹配，但无害）
 *
 * @function getBaseName
 * @param {string} input - 输入路径或文件名
 * @returns {string} 提取的基础文件名
 *
 * @example
 * getBaseName("prof_pic.png") // 返回: "prof_pic.png"
 * getBaseName("/img/prof_pic.png") // 返回: "prof_pic.png"
 * getBaseName("/assets/img/prof_pic.png") // 返回: "prof_pic.png"
 * getBaseName("https://example.com/prof_pic.png") // 返回: "prof_pic.png"
 */
function getBaseName(input: string): string {
  // 移除查询参数部分
  const withoutQuery = input.split('?')[0] ?? input;
  // 分割路径并过滤空字符串
  const parts = withoutQuery.split('/').filter(Boolean);
  // 返回最后一部分（文件名），如果没有则返回原始输入
  return parts[parts.length - 1] ?? withoutQuery;
}

/**
 * 获取本地图片的元数据
 *
 * 根据文件名或路径查找并返回对应的图片元数据。
 * 如果图片不存在，则返回 undefined。
 *
 * @function getLocalImage
 * @param {string} fileNameOrPath - 图片文件名或路径
 * @returns {ImageMetadata | undefined} 图片元数据，如果图片不存在则返回 undefined
 *
 * @example
 * // 使用文件名
 * const image = getLocalImage("prof_pic.png");
 *
 * // 使用路径
 * const image = getLocalImage("/img/prof_pic.png");
 *
 * // 使用完整路径（兼容旧版）
 * const image = getLocalImage("/assets/img/prof_pic.png");
 */
export function getLocalImage(fileNameOrPath: string): ImageMetadata | undefined {
  if (!fileNameOrPath) return undefined;
  const base = getBaseName(fileNameOrPath);
  return imageByFileName.get(base);
}

/**
 * 兼容旧命名的网站图片查询别名
 */
export const getWebsiteImage = getLocalImage;
