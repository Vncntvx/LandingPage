/**
 * @fileoverview 国际化(i18n)工具函数库
 *
 * 提供多语言支持的核心功能，包括语言检测、翻译数据获取、
 * 路径本地化等工具函数。
 *
 * @module src/lib/i18n
 * @requires astro:content
 * @since 1.0.0
 */

import { getCollection, getEntry } from 'astro:content';
import type { I18nSchema } from '../content.config';
import type { CollectionEntry } from 'astro:content';

/**
 * 支持的语言列表
 * 使用 const 断言确保类型安全
 */
export const locales: readonly ('zh_CN' | 'en_US')[] = ['zh_CN', 'en_US'] as const;

/**
 * 语言类型定义
 * 基于支持的语言列表生成的联合类型
 */
export type Locale = (typeof locales)[number];

/**
 * 默认语言配置
 * 当用户未指定语言或指定语言无效时使用
 *
 * @type {Locale}
 * @constant
 */
export const defaultLocale: Locale = 'zh_CN';

/**
 * 语言元数据配置
 * 包含每种语言的显示标签、完整名称和 hrefLang 属性
 *
 * @type {Record<Locale, { label: string; name: string; hrefLang: string }>}
 * @constant
 */
export const localeConfig: Record<Locale, { label: string; name: string; hrefLang: string }> = {
  zh_CN: {
    label: '中',
    name: '简体中文',
    hrefLang: 'zh-CN',
  },
  en_US: {
    label: 'EN',
    name: 'English',
    hrefLang: 'en-US',
  },
};

/**
 * 从内容集合获取指定语言的翻译数据
 *
 * 如果指定语言的翻译数据不存在，会自动回退到默认语言的翻译数据。
 * 如果默认语言数据也不存在，则抛出错误。
 *
 * @async
 * @function getI18n
 * @param {Locale} locale - 语言代码 ('zh_CN' | 'en_US')
 * @returns {Promise<Object>} 翻译数据对象
 * @throws {Error} 当指定语言和默认语言的翻译数据都不存在时
 *
 * @example
 * // 获取中文翻译数据
 * const zhTranslations = await getI18n('zh_CN');
 *
 * // 获取英文翻译数据
 * const enTranslations = await getI18n('en_US');
 */
export async function getI18n(locale: Locale): Promise<I18nSchema> {
  // 将语言代码转换为小写形式以满足内容集合的 ID 兼容性需求
  const contentId = locale.toLowerCase();

  // 直接使用 getEntry 获取指定条目
  const entry = await getEntry('i18n', contentId);

  if (!entry) {
    // 如果指定语言的 i18n 数据不存在，则使用默认语言作为回退
    const defaultContentId = defaultLocale.toLowerCase();
    const fallback = await getEntry('i18n', defaultContentId);
    if (!fallback) {
      throw new Error(`Missing i18n data for ${locale}`);
    }
    return fallback.data as I18nSchema;
  }
  return entry.data as I18nSchema;
}

/**
 * 获取所有可用的翻译数据
 *
 * 返回一个包含所有语言翻译数据的对象，键为语言代码，值为对应的翻译数据。
 *
 * @async
 * @function getAllI18n
 * @returns {Promise<Record<Locale, Object>>} 所有语言的翻译数据
 *
 * @example
 * const allTranslations = await getAllI18n();
 * // 返回: { zh_cn: {...}, en_us: {...} }
 */
export async function getAllI18n(): Promise<Record<string, I18nSchema>> {
  // 获取 i18n 内容集合
  const collection = await getCollection('i18n');
  return Object.fromEntries(
    collection.map((entry: CollectionEntry<'i18n'>) => [entry.id, entry.data])
  ) as Record<string, I18nSchema>;
}

/**
 * 验证语言代码是否有效
 *
 * 检查给定的字符串是否为支持的语言代码之一。
 * 这是一个类型守卫函数，可以在运行时验证语言代码的有效性。
 *
 * @function isValidLocale
 * @param {string} locale - 待验证的语言代码
 * @returns {locale is Locale} 是否是有效的语言代码
 *
 * @example
 * if (isValidLocale(userLocale)) {
 *   // TypeScript 知道 userLocale 是 Locale 类型
 *   const translations = await getI18n(userLocale);
 * }
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * 语言别名映射表
 * 支持常见别名、大小写和中划线格式到规范 Locale 的映射
 */
const localeAliasMap: Record<string, Locale> = {
  zh: 'zh_CN',
  'zh-cn': 'zh_CN',
  zh_cn: 'zh_CN',
  en: 'en_US',
  'en-us': 'en_US',
  en_us: 'en_US',
};

/**
 * 将任意语言标识解析为规范的 Locale
 *
 * @function resolveLocale
 * @param {string | null | undefined} input - 语言标识字符串
 * @returns {Locale | null} 规范 Locale 或 null
 *
 * @example
 * resolveLocale('en-us') // 返回: 'en_US'
 * resolveLocale('zh') // 返回: 'zh_CN'
 * resolveLocale('invalid') // 返回: null
 */
export function resolveLocale(input?: string | null): Locale | null {
  if (!input) return null;
  if (isValidLocale(input)) return input;
  const normalized = input.toLowerCase();
  return localeAliasMap[normalized] || null;
}

/**
 * 获取语言的显示标签
 *
 * 返回语言的简短标签，通常用于语言切换器等 UI 组件。
 * 如果语言代码无效，则返回大写的语言代码作为回退。
 *
 * @function getLocaleLabel
 * @param {Locale} locale - 语言代码
 * @returns {string} 语言显示标签
 *
 * @example
 * getLocaleLabel('zh_CN') // 返回: '中'
 * getLocaleLabel('en_US') // 返回: 'EN'
 */
export function getLocaleLabel(locale: Locale): string {
  return localeConfig[locale]?.label || locale.toUpperCase();
}

/**
 * 获取语言的完整名称
 *
 * 返回语言的完整本地化名称，用于更详细的显示。
 * 如果语言代码无效，则返回原始语言代码作为回退。
 *
 * @function getLocaleName
 * @param {Locale} locale - 语言代码
 * @returns {string} 语言完整名称
 *
 * @example
 * getLocaleName('zh_CN') // 返回: '简体中文'
 * getLocaleName('en_US') // 返回: 'English'
 */
export function getLocaleName(locale: Locale): string {
  return localeConfig[locale]?.name || locale;
}

/**
 * 获取语言的 hrefLang 属性值
 *
 * 返回符合 HTML 标准的 hrefLang 属性值，用于 SEO 和国际化。
 * 如果语言代码无效，则返回原始语言代码作为回退。
 *
 * @function getHrefLang
 * @param {Locale} locale - 语言代码
 * @returns {string} hrefLang 属性值
 *
 * @example
 * getHrefLang('zh_CN') // 返回: 'zh-CN'
 * getHrefLang('en_US') // 返回: 'en-US'
 */
export function getHrefLang(locale: Locale): string {
  return localeConfig[locale]?.hrefLang || locale;
}

/**
 * 从 URL 路径中提取语言代码
 *
 * 解析 URL 路径，提取其中的语言代码。
 * 如果路径中没有有效的语言代码，则返回默认语言。
 *
 * @function getLocaleFromPath
 * @param {string} pathname - URL 路径
 * @returns {Locale} 提取的语言代码
 *
 * @example
 * getLocaleFromPath('/zh_CN/about') // 返回: 'zh_CN'
 * getLocaleFromPath('/about') // 返回: 'zh_CN' (默认语言)
 */
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}

/**
 * 生成指定语言的 URL 路径
 *
 * 将原始路径转换为包含指定语言前缀的本地化路径。
 * 会自动移除可能存在的旧语言前缀，确保路径格式正确。
 *
 * @function getLocalizedPath
 * @param {string} path - 原始路径（不含语言前缀）
 * @param {Locale} locale - 目标语言
 * @returns {string} 带语言前缀的路径
 *
 * @example
 * getLocalizedPath('about', 'zh_CN') // 返回: '/zh_CN/about'
 * getLocalizedPath('/en_US/about', 'zh_CN') // 返回: '/zh_CN/about'
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  // 移除开头的斜杠
  const cleanPath = path.replace(/^\//, '');
  // 移除可能存在的语言前缀
  const pathWithoutLocale = cleanPath.replace(/^(zh_CN|en_US)(\/|$)/, '');
  const trimmed = pathWithoutLocale.replace(/^\/+/, '');
  // 构建新路径，确保根路径为 /${locale}/
  return trimmed ? `/${locale}/${trimmed}` : `/${locale}/`;
}

/**
 * 获取当前语言的替代语言列表
 *
 * 返回除当前语言外的所有可用语言列表，用于语言切换功能。
 *
 * @function getAlternateLocales
 * @param {Locale} currentLocale - 当前语言
 * @returns {Locale[]} 其他可用语言列表
 *
 * @example
 * getAlternateLocales('zh_CN') // 返回: ['en_US']
 * getAlternateLocales('en_US') // 返回: ['zh_CN']
 */
export function getAlternateLocales(currentLocale: Locale): Locale[] {
  return locales.filter(l => l !== currentLocale);
}
